import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

/** Отметить заявку разобранной (status="resolved") или вернуть в работу (status="open"). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g.error) return g.error;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (body?.status !== "open" && body?.status !== "resolved") {
    return NextResponse.json({ error: "status должен быть open или resolved" }, { status: 400 });
  }
  const open = body.status === "open";
  const res = await prisma.helpRequest.updateMany({
    where: { id },
    data: { status: body.status, autoResolved: false, resolvedAt: open ? null : new Date() },
  });
  if (res.count === 0) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
