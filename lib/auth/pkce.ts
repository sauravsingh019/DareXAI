import crypto from "crypto";

function base64url(input: Buffer) {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateCodeVerifier() {
  return base64url(crypto.randomBytes(32));
}

export function generateCodeChallenge(verifier: string) {
  return base64url(crypto.createHash("sha256").update(verifier).digest());
}

export function generateState() {
  return base64url(crypto.randomBytes(16));
}
