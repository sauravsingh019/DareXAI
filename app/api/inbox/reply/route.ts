import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { generateTurn, GeminiMessage } from "@/lib/ai/gemini";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const replySchema = z.object({
  conversationId: z.string().uuid(),
  text: z.string().max(4000).optional(),
  action: z.enum(["send", "suggest"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const { conversationId, text, action } = replySchema.parse(await req.json());

    // 1. Verify conversation belongs to this tenant and load contact
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, tenantId: session.tenantId },
      include: { contact: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (!conversation.contact) {
      return NextResponse.json({ error: "No contact linked to this conversation" }, { status: 400 });
    }

    // 2. Action: Suggest an AI response
    if (action === "suggest") {
      // Fetch last 15 messages in the thread
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        take: 15,
      });

      if (messages.length === 0) {
        return NextResponse.json({
          suggestion: "Hi! How can we help you today?",
        });
      }

      // Format messages as transcript
      const transcript = messages
        .map((m) => `${m.direction === "INBOUND" ? "Customer" : "Business"}: ${m.content}`)
        .join("\n");

      const tenant = await prisma.tenant.findUnique({
        where: { id: session.tenantId },
      });

      const prompt = `You are a helpful customer assistant at "${tenant?.name || "our company"}" (Industry: ${tenant?.industry || "Retail"}).
Here is a transcript of a chat timeline with a customer named ${conversation.contact.name}:
"""
${transcript}
"""

Draft a natural, professional, and concise response to the customer's last message. Do not include greetings if they are already in the chat. Avoid sounding like a robot. Write only the message itself. No markdown quotes, no JSON formatting, no explanation. Just the plain reply text.`;

      const parts = await generateTurn(
        [{ role: "user", parts: [{ text: prompt }] } as GeminiMessage],
        "You draft customer service responses. Respond with the plain text reply only, no markdown formatting.",
        []
      );

      const suggestion = parts.find((p) => p.text)?.text?.trim() || "Thank you for contacting us. How can we assist you?";

      await logAudit({
        tenantId: session.tenantId,
        userId: session.sub,
        action: "ai.reply_suggested",
        entity: `Conversation:${conversationId}`,
        metadata: { messageCount: messages.length },
      });

      return NextResponse.json({ suggestion });
    }

    // 3. Action: Send manual text
    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Reply text is required to send" }, { status: 400 });
    }

    // Send WhatsApp (will persist outbound message to database)
    const result = await sendWhatsAppMessage({
      tenantId: session.tenantId,
      phone: conversation.contact.phone || "",
      message: text,
      contactId: conversation.contact.id,
    });

    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: "whatsapp.outbound",
      entity: `Conversation:${conversationId}`,
      metadata: { textPreview: text.slice(0, 80) },
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    return handleApiError(err);
  }
}
