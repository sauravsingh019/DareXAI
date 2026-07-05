import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { REFRESH_COOKIE, clearAuthCookies } from "@/lib/auth/cookies";
import { hashToken, verifyRefreshToken } from "@/lib/auth/jwt";

export async function POST() {
  const raw = cookies().get(REFRESH_COOKIE)?.value;
  if (raw) {
    try {
      const payload = await verifyRefreshToken(raw);
      const stored = await prisma.refreshToken.findUnique({
        where: { tokenHash: hashToken(payload.jti) },
      });
      if (stored) {
        await prisma.refreshToken.updateMany({
          where: { family: stored.family },
          data: { revoked: true },
        });
      }
    } catch {
      // token already invalid — nothing to revoke
    }
  }
  clearAuthCookies();
  return NextResponse.json({ ok: true });
}
