import { prisma } from "@/lib/prisma";
import { FunctionDeclaration } from "./gemini";
import { logAudit } from "@/lib/audit";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export const TOOL_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: "search_contacts",
    description: "Find customers/contacts by name, phone, or company.",
    parameters: {
      type: "object",
      properties: { query: { type: "string", description: "Name, phone, or company to search for" } },
      required: ["query"],
    },
  },
  {
    name: "create_task",
    description: "Create a reminder or follow-up task, optionally linked to a contact.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        contactId: { type: "string", description: "UUID of the related contact, if any" },
        dueInHours: { type: "number", description: "Hours from now the task is due" },
      },
      required: ["title"],
    },
  },
  {
    name: "update_opportunity",
    description: "Update a CRM opportunity's stage or value.",
    parameters: {
      type: "object",
      properties: {
        opportunityId: { type: "string" },
        stage: { type: "string", enum: ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"] },
        value: { type: "number" },
      },
      required: ["opportunityId"],
    },
  },
  {
    name: "send_whatsapp",
    description: "Send a WhatsApp message to a contact by phone number.",
    parameters: {
      type: "object",
      properties: {
        phone: { type: "string" },
        message: { type: "string" },
      },
      required: ["phone", "message"],
    },
  },
  {
    name: "fetch_business_metrics",
    description: "Retrieve current dashboard KPIs (pipeline value, active opportunities, pending follow-ups).",
    parameters: { type: "object", properties: {} },
  },
];

interface ToolCtx {
  tenantId: string;
  userId: string;
}

export async function executeTool(name: string, args: Record<string, unknown>, ctx: ToolCtx) {
  let result: unknown;

  switch (name) {
    case "search_contacts": {
      const q = String(args.query || "");
      result = await prisma.contact.findMany({
        where: {
          tenantId: ctx.tenantId,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { company: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
      });
      break;
    }
    case "create_task": {
      const dueAt = args.dueInHours
        ? new Date(Date.now() + Number(args.dueInHours) * 3600_000)
        : undefined;
      result = await prisma.task.create({
        data: {
          tenantId: ctx.tenantId,
          contactId: (args.contactId as string) || undefined,
          title: String(args.title),
          dueAt,
        },
      });
      break;
    }
    case "update_opportunity": {
      // Tenant filter on the update guard clause is what stops the AI (or a
      // malicious prompt) from mutating another tenant's data even if it
      // somehow guesses a valid opportunity UUID.
      const existing = await prisma.opportunity.findFirst({
        where: { id: String(args.opportunityId), tenantId: ctx.tenantId },
      });
      if (!existing) throw new Error("Opportunity not found in this tenant");
      result = await prisma.opportunity.update({
        where: { id: existing.id },
        data: {
          stage: (args.stage as never) || undefined,
          value: typeof args.value === "number" ? args.value : undefined,
        },
      });
      break;
    }
    case "send_whatsapp": {
      result = await sendWhatsAppMessage({
        tenantId: ctx.tenantId,
        phone: String(args.phone),
        message: String(args.message),
      });
      break;
    }
    case "fetch_business_metrics": {
      const [activeOpps, pipeline, pendingTasks] = await Promise.all([
        prisma.opportunity.count({
          where: { tenantId: ctx.tenantId, stage: { notIn: ["WON", "LOST"] } },
        }),
        prisma.opportunity.aggregate({
          where: { tenantId: ctx.tenantId, stage: { notIn: ["WON", "LOST"] } },
          _sum: { value: true },
        }),
        prisma.task.count({ where: { tenantId: ctx.tenantId, status: "PENDING" } }),
      ]);
      result = {
        activeOpportunities: activeOpps,
        pipelineValue: pipeline._sum.value || 0,
        pendingFollowUps: pendingTasks,
      };
      break;
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }

  await logAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: `ai.tool.${name}`,
    metadata: { args, result },
  });

  return result;
}
