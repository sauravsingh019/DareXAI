import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";
import { opportunitySchema } from "@/lib/validation";
import { generateNextBestAction } from "@/lib/ai/nba";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getSession();
    const opportunities = await prisma.opportunity.findMany({
      where: { tenantId: session.tenantId },
      include: { contact: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ opportunities });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const data = opportunitySchema.parse(await req.json());

    const contact = await prisma.contact.findFirst({
      where: { id: data.contactId, tenantId: session.tenantId },
    });
    if (!contact) {
      return NextResponse.json({ error: "Contact not found in this tenant" }, { status: 404 });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } });

    const nba = await generateNextBestAction({
      businessName: tenant?.name || "the business",
      contactName: contact.name,
      opportunityTitle: data.title,
      stage: data.stage || "NEW",
      value: data.value || 0,
    });

    const opportunity = await prisma.opportunity.create({
      data: {
        tenantId: session.tenantId,
        contactId: data.contactId,
        title: data.title,
        stage: data.stage,
        value: data.value,
        nextBestAction: nba.action,
        nbaReasoning: nba.reasoning,
      },
    });

    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: "crm.opportunity.create",
      entity: `Opportunity:${opportunity.id}`,
    });

    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
