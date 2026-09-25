import "server-only";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { Role } from "./config";
import { getSession } from "./session";

/* ───────── Для страниц и server components ───────── */

export async function requireSession() {
  const s = await getSession();
  if (!s.ok) redirect(s.reason === "none" ? "/login" : `/login?reason=${s.reason}`);
  return s; // { ok: true, user, expiresAt }
}

export async function requireUser() {
  return (await requireSession()).user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}

/* ───────── Для API routes ───────── */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public reason?: string,
  ) {
    super(message);
  }
}

/** Бросает ApiError(401/403). Использовать внутри try/catch + handleApiError. */
export async function requireApiUser(role?: Role) {
  const s = await getSession();
  if (!s.ok) throw new ApiError(401, "Требуется вход", s.reason);
  if (role && s.user.role !== role) throw new ApiError(403, "Недостаточно прав");
  return s.user;
}

export function handleApiError(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message, reason: e.reason }, { status: e.status });
  }
  console.error(e);
  return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
}
