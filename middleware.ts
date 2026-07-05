import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/api-utils";

const PUBLIC_PATHS = ["/login", "/api/auth/google", "/api/auth/callback", "/api/inbox/webhook/whatsapp"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // CORS preflight for API routes
  if (pathname.startsWith("/api/") && req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
  }

  const res = NextResponse.next();

  // Baseline security headers (defense-in-depth against XSS/clickjacking/etc).
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (pathname.startsWith("/api/")) {
    const cors = corsHeaders(req.headers.get("origin"));
    Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
  }

  // Page-level auth gate: unauthenticated users are bounced to /login before
  // any protected page even starts rendering. API routes do their own
  // getSession() check (which also enforces tenant scoping), so this is a
  // UX convenience layer, not the security boundary itself.
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isProtectedPage =
    !pathname.startsWith("/api/") && !pathname.startsWith("/_next") && !isPublic && pathname !== "/";

  if (isProtectedPage) {
    const hasSession = req.cookies.get("darexai_access") || req.cookies.get("darexai_refresh");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
