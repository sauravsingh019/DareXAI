import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";
import { generateConversationInsights } from "@/lib/ai/conversation-insights";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const ingestSchema = z.object({
  channel: z.enum(["EMAIL", "CALL"]),
  contactName: z.string().min(1).max(120),
  contactPhone: z.string().max(30).optional(),
  contactEmail: z.string().email().max(160).optional(),
  messageText: z.string().min(1).max(4000),
  direction: z.enum(["INBOUND", "OUTBOUND"]).default("INBOUND"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = ingestSchema.parse(await req.json());

    // 1. Find or create contact
    let contact = await prisma.contact.findFirst({
      where: {
        tenantId: session.tenantId,
        OR: [
          body.contactPhone ? { phone: body.contactPhone } : undefined,
          body.contactEmail ? { email: body.contactEmail } : undefined,
        ].filter(Boolean) as any[],
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          tenantId: session.tenantId,
          name: body.contactName,
          phone: body.contactPhone,
          email: body.contactEmail,
          tags: ["simulated"],
        },
      });
    }

    // 2. Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        tenantId: session.tenantId,
        contactId: contact.id,
        channel: body.channel,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          tenantId: session.tenantId,
          contactId: contact.id,
          channel: body.channel,
        },
      });
    }

    // 3. Create message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: body.direction,
        content: body.messageText,
      },
    });

    // 4. Generate AI insights for the whole thread
    const allMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    });

    const transcript = allMessages
      .map(
        (m) =>
          `${m.direction === "INBOUND" ? "Customer" : "Business"}: ${m.content}`
      )
      .join("\n");

    const insights = await generateConversationInsights(transcript);

    // Update conversation timeline summary
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        summary: insights.summary,
        sentiment: insights.sentiment,
        intent: insights.intent,
        nextAction: insights.nextAction,
      },
    });

    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: `simulator.${body.channel.toLowerCase()}_ingested`,
      entity: `Conversation:${conversation.id}`,
      metadata: { contactId: contact.id, textPreview: body.messageText.slice(0, 80) },
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      insights,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
