import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/config";

/**
 * Первый, дешёвый рубеж: нет куки сессии — сразу на /login (или 401 для API).
 * Настоящая проверка (сессия в БД, не истекла, не отозвана, роль) — в guards.ts
 * внутри страниц и API routes. Middleware НЕ единственная защита.
 *
 * Next.js 16+: файл переименован в proxy.ts, а функция — в `proxy`.
 */
const PUBLIC_PATHS = new Set(["/login", "/api/auth/login"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname) || req.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Требуется вход", reason: "none" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
