import { NextResponse } from "next/server";
import { generateCodeChallenge, generateCodeVerifier, generateState } from "@/lib/auth/pkce";
import { setOAuthTempCookies } from "@/lib/auth/cookies";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET() {
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = generateState();

  setOAuthTempCookies(verifier, state);

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
    response_type: "code",
    scope: "openid email profile",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}
