import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { PKCE_COOKIE, STATE_COOKIE, setAccessCookie, setRefreshCookie } from "@/lib/auth/cookies";
import { hashToken, signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { randomUUID } from "crypto";
import { logAudit } from "@/lib/audit";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = cookies();
  const savedVerifier = cookieStore.get(PKCE_COOKIE)?.value;
  const savedState = cookieStore.get(STATE_COOKIE)?.value;

  if (!code || !state || !savedVerifier || state !== savedState) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", req.url));
  }

  // Exchange authorization code for tokens using the PKCE verifier
  // (no client secret needed on the code_verifier leg for public clients,
  // but we support confidential-client secret too if configured).
  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      code,
      code_verifier: savedVerifier,
      grant_type: "authorization_code",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
  }
  const tokenData = await tokenRes.json();

  const userInfoRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!userInfoRes.ok) {
    return NextResponse.redirect(new URL("/login?error=userinfo_failed", req.url));
  }
  const profile = await userInfoRes.json();

  // Look up an existing user by Google ID. First-time login provisions a
  // brand-new tenant so every business owner starts fully isolated.
  let user = await prisma.user.findUnique({ where: { googleId: profile.sub } });
  let isNewTenant = false;

  if (!user) {
    isNewTenant = true;
    const tenant = await prisma.tenant.create({
      data: {
        name: `${profile.name || profile.email}'s Business`,
        slug: `${(profile.email as string).split("@")[0]}-${randomUUID().slice(0, 6)}`,
      },
    });
    user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture,
        googleId: profile.sub,
        role: "OWNER",
      },
    });
  }

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
    metadata: { via: "google_oauth", newTenant: isNewTenant },
  });

  const dest = isNewTenant ? "/onboarding" : "/dashboard";
  return NextResponse.redirect(new URL(dest, req.url));
}
