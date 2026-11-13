import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";
import { paywallEnabled } from "@/lib/payments/config";
import { startPayment } from "@/lib/payments/service";

const schema = z.object({
  planId: z.string().min(1),
  method: z.enum(["qr", "invoice"]),
  phone: z.string().max(20).optional(),
});

// POST /api/payments — ученик выбирает тариф, создаём счёт в Kaspi
export async function POST(req: Request) {
  try {
    const user = await requireApiUser("student");
    if (!paywallEnabled()) return NextResponse.json({ error: "Оплата не подключена" }, { status: 404 });
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    const p = await startPayment(user.id, parsed.data);
    const qrSvg = p.payLink ? await QRCode.toString(p.payLink, { type: "svg", margin: 1, errorCorrectionLevel: "M" }) : null;
    return NextResponse.json({ id: p.id, method: p.method, payLink: p.payLink, qrSvg, amount: p.amount, status: p.status }, { status: 201 });
  } catch (e) {
    return handleApiError(e);
  }
}
