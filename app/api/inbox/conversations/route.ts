import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await getSession();
    const conversations = await prisma.conversation.findMany({
      where: { tenantId: session.tenantId, channel: { in: ["WHATSAPP", "EMAIL", "CALL"] } },
      include: {
        contact: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ conversations });
  } catch (err) {
    return handleApiError(err);
  }
}
