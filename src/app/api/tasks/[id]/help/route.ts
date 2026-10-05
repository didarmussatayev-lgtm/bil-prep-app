import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";

/**
 * «Не смог решить»: ученик отправляет задачу админу на разбор при встрече.
 * Одна заявка на пару ученик+задача: повторная отметка снова открывает её (и обновляет заметку).
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const task = await prisma.task.findUnique({ where: { id }, select: { id: true } });
    if (!task) return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });

    const body = await req.json().catch(() => null);
    const note = typeof body?.note === "string" ? body.note.trim().slice(0, 1000) : "";

    await prisma.helpRequest.upsert({
      where: { userId_taskId: { userId: user.id, taskId: task.id } },
      update: { status: "open", note: note || null, autoResolved: false, resolvedAt: null, createdAt: new Date() },
      create: { userId: user.id, taskId: task.id, note: note || null },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}

/** Ученик передумал — снимает отметку (только пока заявка открыта). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    await prisma.helpRequest.deleteMany({ where: { userId: user.id, taskId: id, status: "open" } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
