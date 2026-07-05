import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { whatsappWebhookSchema } from "@/lib/validation";
import { generateConversationInsights } from "@/lib/ai/conversation-insights";
import { logAudit } from "@/lib/audit";

// Meta's webhook verification handshake (GET with hub.challenge).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge || "", { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * Accepts inbound WhatsApp messages. In sandbox mode (no Meta credentials)
 * this doubles as the demo simulator — POST {tenantSlug, from, name, text}.
 * A real Meta webhook payload would carry the destination phone_number_id
 * instead of tenantSlug; production wiring would resolve tenant via a
 * phoneNumberId → tenantId lookup table (noted in README as the one piece
 * that needs a real Meta Business Account to fully exercise).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = String(body.tenantSlug || "");
    const { from, name, text } = whatsappWebhookSchema.parse(body);

    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) return NextResponse.json({ error: "Unknown tenant" }, { status: 404 });

    let contact = await prisma.contact.findFirst({ where: { tenantId: tenant.id, phone: from } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: { tenantId: tenant.id, name: name || from, phone: from },
      });
    }

    let conversation = await prisma.conversation.findFirst({
      where: { tenantId: tenant.id, contactId: contact.id, channel: "WHATSAPP" },
      orderBy: { createdAt: "desc" },
    });
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { tenantId: tenant.id, contactId: contact.id, channel: "WHATSAPP" },
      });
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, direction: "INBOUND", content: text },
    });

    // Refresh AI summary/sentiment/intent for the whole thread so the inbox
    // reflects the latest context immediately.
    const allMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    });
    const transcript = allMessages
      .map(
        (m: { direction: string; content: string }) =>
          `${m.direction === "INBOUND" ? "Customer" : "Business"}: ${m.content}`
      )
      .join("\n");
    const insights = await generateConversationInsights(transcript);

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
      tenantId: tenant.id,
      action: "whatsapp.inbound",
      entity: `Conversation:${conversation.id}`,
      metadata: { from, textPreview: text.slice(0, 80) },
    });

    return NextResponse.json({ conversationId: conversation.id, insights });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
