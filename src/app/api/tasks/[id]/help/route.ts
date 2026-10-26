import { getT } from "@/lib/i18n/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sectionFilter } from "@/lib/student/access";
import { queueHelpNotification } from "@/lib/telegram";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";

/**
 * «Не смог решить»: ученик отправляет задачу админу на разбор при встрече.
 * Одна заявка на пару ученик+задача: повторная отметка снова открывает её (и обновляет заметку).
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const body = await req.json().catch(() => null);
    // Вопросы пробных вариантов лежат в служебной скрытой теме: их можно отметить только из собственной попытки,
    // где такой вопрос действительно есть. Обычные задачи — как раньше, только из доступных ученику книг.
    const own = body?.source === "test" && typeof body.attemptId === "string"
      ? await prisma.testAttempt.findFirst({ where: { id: body.attemptId, userId: user.id, scope: "paper" }, select: { questionIds: true } })
      : null;
    const inPaper = !!own && (own.questionIds as string[]).includes(id);
    const task = await prisma.task.findFirst({
      where: inPaper ? { id } : { id, hidden: false, topic: { hidden: false, section: await sectionFilter(user.id) } },
      select: { id: true, number: true, question: true, topic: { select: { title: true } } },
    });
    if (!task) return NextResponse.json({ error: (await getT())("Задача не найдена") }, { status: 404 });

    const note = typeof body?.note === "string" ? body.note.trim().slice(0, 1000) : "";

    // Источник заявки: закрепление (по умолчанию) или тест — тогда попытка должна быть этого ученика и содержать задачу
    let source: "practice" | "test" = "practice";
    let attemptId: string | null = null;
    if (body?.source === "test") {
      const attempt = typeof body.attemptId === "string"
        ? await prisma.testAttempt.findFirst({ where: { id: body.attemptId, userId: user.id }, select: { id: true, questionIds: true } })
        : null;
      if (!attempt || !(attempt.questionIds as string[]).includes(task.id)) {
        return NextResponse.json({ error: (await getT())("Задача не найдена") }, { status: 404 });
      }
      source = "test";
      attemptId = attempt.id;
    }

    const before = await prisma.helpRequest.findUnique({ where: { userId_taskId: { userId: user.id, taskId: task.id } }, select: { status: true } });
    await prisma.helpRequest.upsert({
      where: { userId_taskId: { userId: user.id, taskId: task.id } },
      update: { status: "open", note: note || null, source, attemptId, autoResolved: false, resolvedAt: null, createdAt: new Date() },
      create: { userId: user.id, taskId: task.id, note: note || null, source, attemptId },
    });
    // уведомление админу в Telegram — только о новой или заново открытой заявке (правка заметки не в счёт)
    if (before?.status !== "open") {
      queueHelpNotification(
        user.id,
        user.login,
        { topic: task.topic.title, number: task.number, question: task.question, source, note: note || null },
        () => prisma.helpRequest.count({ where: { status: "open" } }),
      );
    }
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
