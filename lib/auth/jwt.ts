import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";
import crypto from "crypto";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-me"
);

export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface AccessTokenPayload {
  sub: string; // userId
  tenantId: string;
  role: string;
  email: string;
}

export async function signAccessToken(payload: AccessTokenPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(ACCESS_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload as unknown as AccessTokenPayload;
}

export interface RefreshTokenPayload {
  sub: string; // userId
  tenantId: string;
  jti: string; // unique token id, stored (hashed) in DB
  family: string; // rotation family
}

export async function signRefreshToken(payload: Omit<RefreshTokenPayload, "jti"> & { jti?: string }) {
  const jti = payload.jti || randomUUID();
  const token = await new SignJWT({ ...payload, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_TTL_SECONDS}s`)
    .sign(REFRESH_SECRET);
  return { token, jti };
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload as unknown as RefreshTokenPayload;
}

// Refresh tokens are stored hashed (never plaintext) so a DB leak doesn't
// hand over usable tokens.
export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
