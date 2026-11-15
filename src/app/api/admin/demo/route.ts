import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { resetDemoUser } from "@/lib/demo";
import { DEMO_LOGIN, DEMO_PASSWORD } from "@/lib/site-info";

// POST /api/admin/demo — создаёт (или сбрасывает) демо-аккаунт student/student.
export async function POST() {
  const g = await requireAdmin(); if (g.error) return g.error;
  if (!(await resetDemoUser())) {
    return NextResponse.json({ error: `Логин «${DEMO_LOGIN}» уже занят обычным учеником. Переименуйте его и повторите.` }, { status: 409 });
  }
  return NextResponse.json({ ok: true, login: DEMO_LOGIN, password: DEMO_PASSWORD });
}
