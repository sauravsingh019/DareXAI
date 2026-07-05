import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await getSession();
    const tenantId = session.tenantId;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true, slug: true },
    });

    const [activeOpportunities, pipeline, pendingFollowUps, recentActivity, wonThisMonth] =
      await Promise.all([
        prisma.opportunity.count({ where: { tenantId, stage: { notIn: ["WON", "LOST"] } } }),
        prisma.opportunity.aggregate({
          where: { tenantId, stage: { notIn: ["WON", "LOST"] } },
          _sum: { value: true },
        }),
        prisma.task.count({ where: { tenantId, status: "PENDING" } }),
        prisma.auditLog.findMany({
          where: { tenantId },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.opportunity.aggregate({
          where: {
            tenantId,
            stage: "WON",
            updatedAt: { gte: new Date(new Date().setDate(1)) },
          },
          _sum: { value: true },
        }),
      ]);

    const staleOpportunities = await prisma.opportunity.findMany({
      where: {
        tenantId,
        stage: { notIn: ["WON", "LOST"] },
        updatedAt: { lt: new Date(Date.now() - 7 * 24 * 3600_000) },
      },
      include: { contact: true },
      take: 5,
    });

    return NextResponse.json({
      tenantName: tenant?.name || "",
      tenantSlug: tenant?.slug || "",
      activeOpportunities,
      pipelineValue: pipeline._sum.value || 0,
      pendingFollowUps,
      wonThisMonth: wonThisMonth._sum.value || 0,
      recentActivity,
      aiAlerts: staleOpportunities.map((o: { id: string; title: string; contact: { name: string } }) => ({
        id: o.id,
        message: `"${o.title}" with ${o.contact.name} has had no movement in 7+ days`,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
