import { NextResponse } from "next/server";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";
import { refreshPayment } from "@/lib/payments/service";
import { prisma } from "@/lib/prisma";

// GET /api/payments/:id — статус платежа (страница опрашивает раз в 3 секунды)
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const p = await refreshPayment((await params).id, user.id);
    const u = await prisma.user.findUnique({ where: { id: user.id }, select: { accessUntil: true } });
    return NextResponse.json({ status: p.status, accessUntil: u?.accessUntil ?? null });
  } catch (e) {
    return handleApiError(e);
  }
}
