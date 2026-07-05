import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError, rateLimit } from "@/lib/api-utils";
import { chatMessageSchema } from "@/lib/validation";
import { runAgentTurn } from "@/lib/ai/agent";
import { GeminiMessage } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!rateLimit(`chat:${session.sub}`, 20, 60_000)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
    }

    const body = chatMessageSchema.parse(await req.json());

    // Every conversation is scoped to the caller's tenant — findFirst with
    // the tenantId filter is what prevents cross-tenant conversation access
    // even if a client sends another tenant's conversationId.
    let conversation = body.conversationId
      ? await prisma.conversation.findFirst({
          where: { id: body.conversationId, tenantId: session.tenantId },
        })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { tenantId: session.tenantId, channel: "AI_CHAT" },
      });
    }

    const pastMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      take: 30,
    });

    const history: GeminiMessage[] = pastMessages
      .filter((m: { role: string | null }) => m.role === "user" || m.role === "assistant")
      .map((m: { role: string | null; content: string }) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.content }],
      }));

    const encoder = new TextEncoder();
    const conversationId = conversation.id;

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        send("conversation", { conversationId });

        try {
          for await (const evt of runAgentTurn({
            tenantId: session.tenantId,
            userId: session.sub,
            conversationId,
            history,
            userMessage: body.message,
          })) {
            send(evt.type, evt.data);
          }
        } catch (err) {
          send("error", { message: (err as Error).message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
