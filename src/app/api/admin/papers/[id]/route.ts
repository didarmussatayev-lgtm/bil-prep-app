import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// PATCH { hidden?: boolean, minutes?: number | null } — скрыть/показать вариант, поменять время экзамена
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const data: { hidden?: boolean; timeLimitSeconds?: number | null } = {};
  if (typeof body?.hidden === "boolean") data.hidden = body.hidden;
  if (body && "minutes" in body) {
    const m = body.minutes;
    if (m === null) data.timeLimitSeconds = null;
    else if (Number.isInteger(m) && m >= 5 && m <= 600) data.timeLimitSeconds = m * 60;
    else return NextResponse.json({ error: "Время: от 5 до 600 минут" }, { status: 400 });
  }
  if (!Object.keys(data).length) return NextResponse.json({ error: "Нечего менять" }, { status: 400 });
  const res = await prisma.examPaper.updateMany({ where: { id }, data });
  return res.count ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
