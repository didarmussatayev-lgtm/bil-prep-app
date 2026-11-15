import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settle } from "@/lib/payments/service";

// POST /api/payments/webhook — уведомления от kaspi-pos-automation (payment.success / failed / expired / lost).
// Публичный путь (см. middleware), поэтому подпись HMAC SHA-256 обязательна: без неё и без верной суммы доступ не продлевается.
export async function POST(req: Request) {
  const secret = process.env.KASPI_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const raw = await req.text();
  const got = req.headers.get("x-webhook-signature") ?? "";
  const want = "sha256=" + createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(got);
  const b = Buffer.from(want);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "bad signature" }, { status: 401 });

  let body: { event?: string; paymentId?: string | number; status?: string; amount?: number | null; receiptUrl?: string | null };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  if (!body.paymentId || !body.event) return NextResponse.json({ error: "bad payload" }, { status: 400 });

  const p = await prisma.payment.findUnique({ where: { kaspiId: String(body.paymentId) } });
  // чужой платёж (не наш счёт) — отвечаем 200, чтобы сервис не повторял
  if (!p) return NextResponse.json({ ok: true, ignored: true });

  const extra = { kaspiStatus: body.status, receiptUrl: body.receiptUrl ?? undefined };
  if (body.event === "payment.success") {
    // сумма должна совпасть с тарифом
    if (typeof body.amount === "number" && body.amount !== p.amount) {
      await settle(p.id, "lost", { ...extra, note: `Сумма в Kaspi ${body.amount} ≠ ${p.amount}` });
      return NextResponse.json({ ok: true, flagged: true });
    }
    await settle(p.id, "paid", extra);
  } else if (body.event === "payment.failed") await settle(p.id, "failed", extra);
  else if (body.event === "payment.expired") await settle(p.id, "expired", extra);
  else if (body.event === "payment.lost") await settle(p.id, "lost", { ...extra, note: "Статус неизвестен, проверьте в приложении Kaspi" });

  return NextResponse.json({ ok: true });
}
