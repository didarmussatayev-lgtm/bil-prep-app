import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { settle } from "@/lib/payments/service";

// POST /api/admin/payments/:id {action} — вручную подтвердить («пришло по Kaspi») или отклонить платёж
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const parsed = z.object({ action: z.enum(["confirm", "reject"]) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  const ok = await settle((await params).id, parsed.data.action === "confirm" ? "paid" : "failed", { note: parsed.data.action === "confirm" ? "Подтверждено админом вручную" : "Отклонено админом" });
  if (!ok) return NextResponse.json({ error: "Платёж уже обработан" }, { status: 409 });
  return NextResponse.json({ ok: true });
}
