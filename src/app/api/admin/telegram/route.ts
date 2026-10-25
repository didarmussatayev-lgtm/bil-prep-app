import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { notifyAdmins, telegramConfigured } from "@/lib/telegram";

// GET — настроен ли Telegram; POST — отправить тестовое сообщение (проверить токен и chat id)
export async function GET() {
  const g = await requireAdmin(); if (g.error) return g.error;
  return NextResponse.json({ configured: telegramConfigured() });
}

export async function POST() {
  const g = await requireAdmin(); if (g.error) return g.error;
  if (!telegramConfigured()) return NextResponse.json({ ok: false, error: "Не заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID" }, { status: 400 });
  const r = await notifyAdmins("✅ Проверка связи: уведомления о заявках «Не смог решить» работают.");
  return NextResponse.json({ ok: r.sent > 0, ...r }, { status: r.sent > 0 ? 200 : 502 });
}
