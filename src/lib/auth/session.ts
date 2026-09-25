import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  SESSION_TTL_SECONDS,
  type Role,
  type SessionEndReason,
} from "./config";

// В куке лежит случайный токен, в БД — только его SHA-256.
// Утечка дампа БД не даёт готовых сессий.
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/**
 * Создаёт новую сессию и ЗАВЕРШАЕТ все прежние сессии пользователя
 * (одна активная сессия на аккаунт). Всё в одной транзакции.
 */
export async function createSession(
  userId: string,
  meta: { ip?: string | null; userAgent?: string | null } = {},
) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.$transaction([
    // чистим давно истёкшие сессии этого пользователя, чтобы таблица не росла
    prisma.session.deleteMany({ where: { userId, expiresAt: { lt: new Date() } } }),
    // инвалидируем все активные
    prisma.session.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true, revokedReason: "replaced" satisfies SessionEndReason },
    }),
    prisma.session.create({
      data: {
        userId,
        tokenHash: hashToken(token),
        expiresAt,
        ip: meta.ip ?? null,
        userAgent: meta.userAgent?.slice(0, 300) ?? null,
      },
    }),
  ]);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return { expiresAt };
}

export type SessionResult =
  | {
      ok: true;
      expiresAt: Date;
      user: { id: string; login: string; role: Role };
    }
  | { ok: false; reason: SessionEndReason };

/** Проверка текущей сессии по куке. Кэшируется на время одного запроса. */
export const getSession = cache(async (): Promise<SessionResult> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { ok: false, reason: "none" };

  const s = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      revoked: true,
      revokedReason: true,
      expiresAt: true,
      user: { select: { id: true, login: true, role: true } },
    },
  });

  if (!s) return { ok: false, reason: "none" };
  if (s.revoked) return { ok: false, reason: (s.revokedReason as SessionEndReason) ?? "logout" };
  if (s.expiresAt.getTime() <= Date.now()) return { ok: false, reason: "expired" };

  return { ok: true, expiresAt: s.expiresAt, user: { ...s.user, role: s.user.role as Role } };
});

/** Ручной выход: гасит текущую сессию и удаляет куку. Безопасно вызывать без сессии. */
export async function destroyCurrentSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashToken(token), revoked: false },
      data: { revoked: true, revokedReason: "logout" satisfies SessionEndReason },
    });
  }
  jar.delete(SESSION_COOKIE);
}

/** Завершает ВСЕ активные сессии пользователя (принудительный разлогин, смена пароля). */
export async function revokeUserSessions(
  userId: string,
  reason: Extract<SessionEndReason, "admin" | "password_reset">,
): Promise<number> {
  const { count } = await prisma.session.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true, revokedReason: reason },
  });
  return count;
}
