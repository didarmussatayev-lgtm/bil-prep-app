import { getT } from "@/lib/i18n/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { checkLoginRate, registerLoginFailure } from "@/lib/auth/rate-limit";

// Самостоятельная регистрация. Новый ученик создаётся с restrictAccess=true и БЕЗ книг —
// то есть ничего не видит («Доступ не открыт»), пока админ не откроет книги в карточке ученика.
// Отключить регистрацию целиком: ALLOW_REGISTRATION=false.
const REGISTER_MAX_PER_IP = 10; // регистраций с одного IP за окно (LOGIN_WINDOW_MS)

const schema = z.object({
  login: z.string().trim().min(3).max(32).regex(/^[\w.-]+$/).transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const t = await getT();
  if (process.env.ALLOW_REGISTRATION === "false") {
    return NextResponse.json({ error: t("Регистрация закрыта. Попросите администратора создать аккаунт.") }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateKey = `register:${ip}`;
  const blocked = checkLoginRate(rateKey, REGISTER_MAX_PER_IP);
  if (!blocked.allowed) {
    return NextResponse.json(
      { error: t("Слишком много попыток. Повторите через {m} мин.", { m: Math.max(1, Math.ceil(blocked.retryAfterSec / 60)) }) },
      { status: 429, headers: { "Retry-After": String(blocked.retryAfterSec) } },
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: t("Логин: 3–32 символа (буквы, цифры, . _ -). Пароль: минимум 8 символов.") },
      { status: 400 },
    );
  }
  const { login, password } = parsed.data;
  registerLoginFailure(rateKey); // считаем каждую попытку регистрации, а не только неудачи

  if (await prisma.user.findUnique({ where: { login } })) {
    return NextResponse.json({ error: t("Такой логин уже занят") }, { status: 409 });
  }

  let user;
  try {
    user = await prisma.user.create({
      data: { login, passwordHash: await hashPassword(password), role: "student", restrictAccess: true },
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: t("Такой логин уже занят") }, { status: 409 });
    }
    throw e;
  }

  await createSession(user.id, { ip, userAgent: req.headers.get("user-agent") });
  return NextResponse.json({ ok: true, redirectTo: "/" }, { status: 201 });
}
