import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// Лёгкая проверка сессии: клиент (SessionWatcher) опрашивает её раз в минуту,
// чтобы вовремя заметить истечение, вход с другого устройства или разлогин админом.
export async function GET() {
  const s = await getSession();
  const headers = { "Cache-Control": "no-store" };

  if (!s.ok) {
    return NextResponse.json({ authenticated: false, reason: s.reason }, { status: 401, headers });
  }
  return NextResponse.json(
    { authenticated: true, user: s.user, expiresAt: s.expiresAt.toISOString() },
    { headers },
  );
}
