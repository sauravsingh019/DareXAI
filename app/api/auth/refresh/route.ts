import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  REFRESH_COOKIE,
  clearAuthCookies,
  setAccessCookie,
  setRefreshCookie,
} from "@/lib/auth/cookies";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/auth/jwt";

// Rotation: every refresh invalidates the presented token and issues a new
// one in the same "family". If a revoked/already-used token is presented
// again, that signals theft — the entire family is revoked immediately.
export async function POST(req: NextRequest) {
  const raw = cookies().get(REFRESH_COOKIE)?.value;
  if (!raw) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  let payload;
  try {
    payload = await verifyRefreshToken(raw);
  } catch {
    clearAuthCookies();
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(payload.jti) },
  });

  if (!stored || stored.expiresAt < new Date()) {
    clearAuthCookies();
    return NextResponse.json({ error: "Refresh token expired" }, { status: 401 });
  }

  if (stored.revoked) {
    // Reuse of a revoked token: possible theft. Nuke the whole family.
    await prisma.refreshToken.updateMany({
      where: { family: stored.family },
      data: { revoked: true },
    });
    clearAuthCookies();
    return NextResponse.json({ error: "Token reuse detected" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user) {
    clearAuthCookies();
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const { token: newRefreshToken, jti: newJti } = await signRefreshToken({
    sub: user.id,
    tenantId: user.tenantId,
    family: stored.family,
  });

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true, replacedBy: newJti },
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(newJti),
        userId: user.id,
        tenantId: user.tenantId,
        family: stored.family,
        userAgent: req.headers.get("user-agent") || undefined,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    }),
  ]);

  const accessToken = await signAccessToken({
    sub: user.id,
    tenantId: user.tenantId,
    role: user.role,
    email: user.email,
  });

  setAccessCookie(accessToken);
  setRefreshCookie(newRefreshToken);

  return NextResponse.json({ ok: true });
}
