import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDummyHash, verifyPassword } from "@/lib/auth/password";
import { checkLoginRate, registerLoginFailure, resetLoginFailures } from "@/lib/auth/rate-limit";
import { createSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const login = typeof body?.login === "string" ? body.login.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!login || !password || login.length > 64 || password.length > 200) {
    return NextResponse.json({ error: "Введите логин и пароль" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateKey = `${ip}:${login}`;

  const rate = checkLoginRate(rateKey);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Слишком много попыток. Повторите через ${Math.ceil(rate.retryAfterSec / 60)} мин.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } },
    );
  }

  const user = await prisma.user.findUnique({ where: { login } });

  // compare выполняем всегда — одинаковое время ответа для «нет логина» и «неверный пароль»
  const valid = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));

  if (!user || !valid) {
    registerLoginFailure(rateKey);
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  resetLoginFailures(rateKey);

  // создаёт новую сессию и завершает все предыдущие (вход с другого устройства)
  await createSession(user.id, { ip, userAgent: req.headers.get("user-agent") });

  return NextResponse.json({
    ok: true,
    role: user.role,
    redirectTo: user.role === "admin" ? "/admin" : "/",
  });
}
