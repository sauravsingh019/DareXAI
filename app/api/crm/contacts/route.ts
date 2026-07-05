import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";
import { contactSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getSession();
    const contacts = await prisma.contact.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ contacts });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const data = contactSchema.parse(await req.json());

    const contact = await prisma.contact.create({
      data: { ...data, tenantId: session.tenantId },
    });

    await logAudit({
      tenantId: session.tenantId,
      userId: session.sub,
      action: "crm.contact.create",
      entity: `Contact:${contact.id}`,
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
