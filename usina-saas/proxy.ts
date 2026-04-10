import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getRateLimiter } from "@/lib/rate-limit";

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; connect-src 'self' https://*.supabase.co https://api.stripe.com; frame-src https://js.stripe.com;",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh session Supabase (necessário antes de qualquer checagem)
  const { supabaseResponse, user } = await updateSession(request);

  // Aplicar headers de segurança em todas as respostas
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    supabaseResponse.headers.set(key, value);
  });

  // Rate limiting em POST /api/jobs/create
  if (pathname === "/api/jobs/create" && request.method === "POST") {
    const limiter = getRateLimiter();
    if (limiter && user) {
      const { success, reset } = await limiter.limit(user.id);
      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return NextResponse.json(
          { error: "Limite de jobs atingido. Tente novamente em 1 hora." },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              ...SECURITY_HEADERS,
            },
          }
        );
      }
    }
  }

  // Proteção de rotas /dashboard/* e /api/* (exceto /api/auth/* e /api/webhooks/*)
  const isProtected =
    pathname.startsWith("/dashboard") ||
    (pathname.startsWith("/api") &&
      !pathname.startsWith("/api/auth") &&
      !pathname.startsWith("/api/webhooks"));

  if (isProtected && !user) {
    // API routes retornam 401 JSON
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: SECURITY_HEADERS }
      );
    }

    // Páginas redirecionam para login com ?redirectTo
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
