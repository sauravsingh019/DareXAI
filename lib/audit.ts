import { prisma } from "@/lib/prisma";

export async function logAudit(entry: {
  tenantId: string;
  userId?: string;
  action: string;
  entity?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        tenantId: entry.tenantId,
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        metadata: entry.metadata as never,
      },
    });
  } catch (err) {
    // Audit logging must never crash the primary request path.
    console.error("audit log failed", err);
  }
}
