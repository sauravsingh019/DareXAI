import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";
import { onboardingSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const data = onboardingSchema.parse(await req.json());

    const tenant = await prisma.tenant.update({
      where: { id: session.tenantId },
      data: { name: data.businessName, industry: data.industry, onboarded: true },
    });

    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: "tenant.onboarded",
      metadata: data,
    });

    return NextResponse.json({ tenant });
  } catch (err) {
    return handleApiError(err);
  }
}
