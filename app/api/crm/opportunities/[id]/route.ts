import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/audit";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    const body = await req.json();

    const existing = await prisma.opportunity.findFirst({
      where: { id: params.id, tenantId: session.tenantId },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const opportunity = await prisma.opportunity.update({
      where: { id: existing.id },
      data: {
        stage: body.stage || undefined,
        value: typeof body.value === "number" ? body.value : undefined,
      },
    });

    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: "crm.opportunity.update",
      entity: `Opportunity:${opportunity.id}`,
      metadata: { stage: body.stage, value: body.value },
    });

    return NextResponse.json({ opportunity });
  } catch (err) {
    return handleApiError(err);
  }
}
