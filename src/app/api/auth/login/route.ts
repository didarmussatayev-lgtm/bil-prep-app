import { getT } from "@/lib/i18n/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDummyHash, verifyPassword } from "@/lib/auth/password";
import { LOGIN_MAX_ATTEMPTS, LOGIN_MAX_PER_IP, LOGIN_MAX_PER_LOGIN } from "@/lib/auth/config";
import { checkLoginRate, registerLoginFailure, resetLoginFailures } from "@/lib/auth/rate-limit";
import { createSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const login = typeof body?.login === "string" ? body.login.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!login || !password || login.length > 64 || password.length > 200) {
    return NextResponse.json({ error: (await getT())("Введите логин и пароль") }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  // Три независимых ограничителя: пара IP+логин, один логин (с любых IP — защита от подбора со сменой IP,
  // заодно от подделки X-Forwarded-For) и один IP (перебор разных логинов).
  const keys = [
    { key: `${ip}:${login}`, max: LOGIN_MAX_ATTEMPTS },
    { key: `login:${login}`, max: LOGIN_MAX_PER_LOGIN },
    { key: `ip:${ip}`, max: LOGIN_MAX_PER_IP },
  ];
  const blocked = keys.map((k) => checkLoginRate(k.key, k.max)).find((r) => !r.allowed);
  if (blocked) {
    const t = await getT();
    return NextResponse.json(
      { error: t("Слишком много попыток. Повторите через {m} мин.", { m: Math.max(1, Math.ceil(blocked.retryAfterSec / 60)) }) },
      { status: 429, headers: { "Retry-After": String(blocked.retryAfterSec) } },
    );
  }

  const user = await prisma.user.findUnique({ where: { login } });

  // compare выполняем всегда — одинаковое время ответа для «нет логина» и «неверный пароль»
  const valid = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));

  if (!user || !valid) {
    for (const k of keys) registerLoginFailure(k.key);
    return NextResponse.json({ error: (await getT())("Неверный логин или пароль") }, { status: 401 });
  }

  resetLoginFailures(keys[0].key); // успешный вход сбрасывает только свою пару; общие счётчики по логину и IP остаются до конца окна

  // создаёт новую сессию и завершает все предыдущие (вход с другого устройства)
  await createSession(user.id, { ip, userAgent: req.headers.get("user-agent") });

  return NextResponse.json({
    ok: true,
    role: user.role,
    redirectTo: user.role === "admin" ? "/admin" : "/",
  });
}
