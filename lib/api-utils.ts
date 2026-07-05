import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/auth/session";
import { ZodError } from "zod";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");

export function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };
}

/** Wraps a route handler with consistent error → HTTP status mapping. */
export function handleApiError(err: unknown) {
  if (err instanceof UnauthorizedError) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", issues: err.issues },
      { status: 400 }
    );
  }
  console.error(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

// Minimal in-memory sliding-window rate limiter. Fine for a single-instance
// demo; swap for a Redis-backed limiter (e.g. Upstash) in production so
// limits are enforced across all server instances.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
