import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, handleApiError, requireApiUser } from "@/lib/auth/guards";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { checkLoginRate, registerLoginFailure, resetLoginFailures } from "@/lib/auth/rate-limit";
import { revokeOtherSessions } from "@/lib/auth/session";

const MIN_LEN = { student: 8, admin: 12 } as const;

// POST /api/auth/password { current, next } — смена своего пароля. Остальные сессии аккаунта завершаются.
export async function POST(req: Request) {
  try {
    const user = await requireApiUser();
    const body = await req.json().catch(() => null);
    const current = typeof body?.current === "string" ? body.current : "";
    const next = typeof body?.next === "string" ? body.next : "";

    const key = `pw:${user.id}`; // подбор текущего пароля через эту форму тоже ограничиваем
    const rate = checkLoginRate(key, 5);
    if (!rate.allowed) throw new ApiError(429, "Слишком много попыток. Повторите через {m} мин.".replace("{m}", String(Math.max(1, Math.ceil(rate.retryAfterSec / 60)))));

    const row = await prisma.user.findUnique({ where: { id: user.id }, select: { passwordHash: true, login: true, role: true } });
    if (!row || !(await verifyPassword(current, row.passwordHash))) {
      registerLoginFailure(key);
      throw new ApiError(400, "Текущий пароль указан неверно", "WRONG_CURRENT");
    }
    const min = MIN_LEN[row.role];
    if (next.length < min || next.length > 200) throw new ApiError(400, `Новый пароль: не короче ${min} символов`, "TOO_SHORT");
    if (next === current) throw new ApiError(400, "Новый пароль должен отличаться от текущего", "SAME");
    if (next.toLowerCase() === row.login) throw new ApiError(400, "Пароль не должен совпадать с логином", "SAME_AS_LOGIN");

    resetLoginFailures(key);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
    const others = await revokeOtherSessions(user.id);
    return NextResponse.json({ ok: true, signedOutElsewhere: others });
  } catch (e) {
    return handleApiError(e);
  }
}
