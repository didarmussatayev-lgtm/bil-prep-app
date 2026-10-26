import { NextResponse } from "next/server";

// Проверка для Railway (healthcheckPath): сервер поднялся и отвечает. К базе не ходит намеренно —
// чтобы кратковременная недоступность БД не помечала деплой как неудачный.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true });
}
