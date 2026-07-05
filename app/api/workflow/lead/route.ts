import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";
import { generateTurn, GeminiMessage } from "@/lib/ai/gemini";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { logAudit } from "@/lib/audit";

const leadSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(3).max(30),
  company: z.string().max(160).optional(),
  interest: z.string().max(500).optional(),
});

async function qualifyLead(lead: z.infer<typeof leadSchema>, businessName: string) {
  const prompt = `A new lead came in for "${businessName}": name=${lead.name}, company=${
    lead.company || "n/a"
  }, stated interest="${lead.interest || "n/a"}".
Score how sales-ready this lead is from 0-100 and draft a short, warm WhatsApp follow-up message.
Respond ONLY as JSON: {"score": <0-100>, "reasoning": "<1 sentence>", "whatsappMessage": "<2-3 sentences>"}`;

  const parts = await generateTurn(
    [{ role: "user", parts: [{ text: prompt }] } as GeminiMessage],
    "You are a lead-qualification assistant for a B2B sales team. Always respond with strict JSON.",
    []
  );
  const text = parts.find((p) => p.text)?.text || "{}";
  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  return {
    score: Number(parsed.score ?? 50),
    reasoning: String(parsed.reasoning || ""),
    whatsappMessage: String(
      parsed.whatsappMessage || `Hi ${lead.name}, thanks for your interest — we'll be in touch shortly!`
    ),
  };
}

/**
 * Step-by-step, audit-logged workflow. Each stage writes its own audit
 * entry so the run is fully traceable even if a later stage fails.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const lead = leadSchema.parse(await req.json());
    const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } });

    // 1. New Lead → create/find contact
    let contact = await prisma.contact.findFirst({
      where: { tenantId: session.tenantId, phone: lead.phone },
    });
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          tenantId: session.tenantId,
          name: lead.name,
          phone: lead.phone,
          company: lead.company,
          tags: ["lead"],
        },
      });
    }
    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: "workflow.lead_created",
      entity: `Contact:${contact.id}`,
    });

    // 2. AI Qualification
    const qualification = await qualifyLead(lead, tenant?.name || "the business");
    const opportunity = await prisma.opportunity.create({
      data: {
        tenantId: session.tenantId,
        contactId: contact.id,
        title: `${lead.company || lead.name} — inbound lead`,
        stage: qualification.score >= 80 ? "QUALIFIED" : "NEW",
        score: qualification.score,
        nextBestAction: qualification.score >= 80 ? "Send WhatsApp follow-up now" : "Nurture lead",
        nbaReasoning: qualification.reasoning,
      },
    });
    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: "workflow.ai_qualification",
      entity: `Opportunity:${opportunity.id}`,
      metadata: { score: qualification.score, reasoning: qualification.reasoning },
    });

    let whatsappResult = null;
    let task = null;

    // 3. Score > 80 → WhatsApp follow-up + task creation
    if (qualification.score > 80) {
      whatsappResult = await sendWhatsAppMessage({
        tenantId: session.tenantId,
        phone: lead.phone,
        message: qualification.whatsappMessage,
        contactId: contact.id,
      });
      await logAudit({
        tenantId: session.tenantId,
        userId: session.sub,
        action: "workflow.whatsapp_followup",
        entity: `Contact:${contact.id}`,
        metadata: { message: qualification.whatsappMessage },
      });

      // 4. Create Follow-up Task
      task = await prisma.task.create({
        data: {
          tenantId: session.tenantId,
          contactId: contact.id,
          title: `Call ${lead.name} to close — hot lead (score ${qualification.score})`,
          dueAt: new Date(Date.now() + 24 * 3600_000),
        },
      });
      await logAudit({
        tenantId: session.tenantId,
        userId: session.sub,
        action: "workflow.task_created",
        entity: `Task:${task.id}`,
      });
    }

    // 5. Record Audit Log (final workflow-complete marker)
    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: "workflow.completed",
      entity: `Opportunity:${opportunity.id}`,
      metadata: { qualified: qualification.score > 80 },
    });

    return NextResponse.json({ contact, opportunity, qualification, whatsappResult, task });
  } catch (err) {
    return handleApiError(err);
  }
}
