import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setAccessCookie, setRefreshCookie } from "@/lib/auth/cookies";
import { hashToken, signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { randomUUID } from "crypto";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  // Developer bypass is allowed in development, or if Google Client ID is not configured.
  const hasGoogleAuth = !!process.env.GOOGLE_CLIENT_ID;
  const isDev = process.env.NODE_ENV === "development";

  if (hasGoogleAuth && !isDev) {
    return NextResponse.redirect(new URL("/login?error=bypass_disabled_in_production", req.url));
  }

  const devEmail = "dev@darexai.com";
  const devGoogleId = "dev-bypass-google-id";

  // Look up or provision developer user/tenant
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: devGoogleId },
        { email: devEmail }
      ]
    }
  });

  let isNewTenant = false;
  if (!user) {
    isNewTenant = true;
    const tenant = await prisma.tenant.create({
      data: {
        name: "Acme Operations",
        slug: `acme-ops-${randomUUID().slice(0, 4)}`,
        industry: "AI Operations & Consulting",
        onboarded: false, // Set to false so user can experience/demo the onboarding page!
      },
    });
    user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: devEmail,
        name: "DareX Developer",
        googleId: devGoogleId,
        role: "OWNER",
      },
    });
  }

  // Get tenant to check onboarding status
  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId }
  });

  const accessToken = await signAccessToken({
    sub: user.id,
    tenantId: user.tenantId,
    role: user.role,
    email: user.email,
  });

  const family = randomUUID();
  const { token: refreshToken, jti } = await signRefreshToken({
    sub: user.id,
    tenantId: user.tenantId,
    family,
  });

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(jti),
      userId: user.id,
      tenantId: user.tenantId,
      family,
      userAgent: req.headers.get("user-agent") || undefined,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  setAccessCookie(accessToken);
  setRefreshCookie(refreshToken);

  await logAudit({
    tenantId: user.tenantId,
    userId: user.id,
    action: "auth.login",
    metadata: { via: "dev_bypass", newTenant: isNewTenant },
  });

  // If already onboarded, go straight to dashboard. Otherwise, send to onboarding.
  const dest = tenant?.onboarded ? "/dashboard" : "/onboarding";
  return NextResponse.redirect(new URL(dest, req.url));
}
