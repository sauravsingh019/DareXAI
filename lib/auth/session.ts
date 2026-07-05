import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "./cookies";
import { AccessTokenPayload, verifyAccessToken } from "./jwt";

export class UnauthorizedError extends Error {}

/**
 * Resolves the current request's session from the access-token cookie.
 * Every API route that touches tenant-scoped data MUST call this and use
 * the returned tenantId to filter every Prisma query — that filter is the
 * entire tenant-isolation boundary, so it can never be optional or derived
 * from a client-supplied value (query param / body).
 */
export async function getSession(): Promise<AccessTokenPayload> {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!token) throw new UnauthorizedError("Not authenticated");
  try {
    return await verifyAccessToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired session");
  }
}
