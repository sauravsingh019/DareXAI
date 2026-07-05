import { prisma } from "@/lib/prisma";

const META_TOKEN = process.env.WHATSAPP_META_TOKEN;
const META_PHONE_ID = process.env.WHATSAPP_META_PHONE_ID;

/**
 * Sends a WhatsApp message and persists it into the unified conversation
 * timeline. If Meta Cloud API credentials are present in env, it sends for
 * real; otherwise it runs in sandbox mode (stores the outbound message and
 * logs it) so the whole agent/CRM/inbox loop is demoable with zero external
 * credentials. Swapping to production only requires setting the two env
 * vars — no code changes.
 */
export async function sendWhatsAppMessage(opts: {
  tenantId: string;
  phone: string;
  message: string;
  contactId?: string;
}) {
  const { tenantId, phone, message } = opts;

  let contactId = opts.contactId;
  if (!contactId) {
    const contact = await prisma.contact.findFirst({ where: { tenantId, phone } });
    contactId = contact?.id;
  }

  let conversation = await prisma.conversation.findFirst({
    where: { tenantId, contactId, channel: "WHATSAPP" },
    orderBy: { createdAt: "desc" },
  });
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { tenantId, contactId, channel: "WHATSAPP" },
    });
  }

  let deliveryStatus: "sent_live" | "sandbox";
  if (META_TOKEN && META_PHONE_ID) {
    const res = await fetch(`https://graph.facebook.com/v19.0/${META_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${META_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message },
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`WhatsApp send failed: ${body}`);
    }
    deliveryStatus = "sent_live";
  } else {
    deliveryStatus = "sandbox";
  }

  const saved = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      direction: "OUTBOUND",
      content: message,
    },
  });

  return { conversationId: conversation.id, messageId: saved.id, deliveryStatus };
}
