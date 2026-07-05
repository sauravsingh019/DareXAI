import { cookies } from "next/headers";
import { REFRESH_TOKEN_TTL_SECONDS } from "./jwt";

const isProd = process.env.NODE_ENV === "production";

export const ACCESS_COOKIE = "darexai_access";
export const REFRESH_COOKIE = "darexai_refresh";
export const PKCE_COOKIE = "darexai_pkce_verifier";
export const STATE_COOKIE = "darexai_oauth_state";

const baseOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export function setAccessCookie(token: string) {
  cookies().set(ACCESS_COOKIE, token, { ...baseOpts, maxAge: 60 * 15 });
}

export function setRefreshCookie(token: string) {
  cookies().set(REFRESH_COOKIE, token, {
    ...baseOpts,
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });
}

export function setOAuthTempCookies(verifier: string, state: string) {
  cookies().set(PKCE_COOKIE, verifier, { ...baseOpts, maxAge: 60 * 10 });
  cookies().set(STATE_COOKIE, state, { ...baseOpts, maxAge: 60 * 10 });
}

export function clearAuthCookies() {
  cookies().set(ACCESS_COOKIE, "", { ...baseOpts, maxAge: 0 });
  cookies().set(REFRESH_COOKIE, "", { ...baseOpts, maxAge: 0 });
}
