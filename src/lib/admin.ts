import { NextResponse } from "next/server";
import { ApiError, requireApiUser } from "@/lib/auth/guards";
import { generateTempPassword } from "@/lib/auth/password";

/**
 * Адаптер над requireApiUser("admin") (шаг 3) под форму, которую уже используют
 * все роуты админки (шаг 7): `const g = await requireAdmin(); if (g.error) return g.error;`.
 * В шаге 7 предполагался несуществующий getCurrentUser() — здесь его больше нет.
 */
export async function requireAdmin() {
  try {
    const user = await requireApiUser("admin");
    return { user, error: null as null };
  } catch (e) {
    if (e instanceof ApiError) {
      return { user: null, error: NextResponse.json({ error: e.message, reason: e.reason }, { status: e.status }) };
    }
    throw e;
  }
}

/** Читаемый пароль без похожих символов (0/O, 1/l) — тот же генератор, что и в create-admin.ts. */
export const generatePassword = generateTempPassword;
