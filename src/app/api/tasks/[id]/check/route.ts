import { getT } from "@/lib/i18n/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sectionFilter } from "@/lib/student/access";
import { onTaskChecked } from "@/lib/gamification/engine";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";
import { checkAnswer, isWellFormedAnswer, type AnswerType } from "@/lib/student/answerCheck";

/**
 * Проверка ответа на задачу закрепления (type="open"). Эталон (correctAnswerJson)
 * никогда не уходит на клиент — сравнение целиком на сервере, клиенту возвращается
 * только { correct: boolean }.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;

    const task = await prisma.task.findFirst({
      where: { id, hidden: false, topic: { hidden: false, section: await sectionFilter(user.id) } },
      select: { id: true, topicId: true, type: true, answerType: true, correctAnswerJson: true, allowUnreduced: true },
    });
    if (!task || task.type !== "open" || !task.answerType) {
      return NextResponse.json({ error: (await getT())("Задача не найдена") }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const answerType = task.answerType as AnswerType;
    if (!isWellFormedAnswer(answerType, body?.answer)) {
      return NextResponse.json({ error: (await getT())("Заполните ответ полностью") }, { status: 400 });
    }

    const correct = checkAnswer({
      answerType,
      studentValue: body.answer,
      correctValue: task.correctAnswerJson as any,
      allowUnreduced: task.allowUnreduced,
    });

    const prev = await prisma.taskResult.findUnique({ where: { userId_taskId: { userId: user.id, taskId: task.id } }, select: { correct: true } });

    await prisma.$transaction([
      // correct: "хотя бы раз решена верно" — при неверном ответе не затираем true, поставленный раньше.
      prisma.taskResult.upsert({
        where: { userId_taskId: { userId: user.id, taskId: task.id } },
        update: { correct: correct ? true : undefined, attempts: { increment: 1 }, lastAnswer: body.answer },
        create: { userId: user.id, taskId: task.id, correct, attempts: 1, lastAnswer: body.answer },
      }),
      prisma.taskAttempt.create({ data: { userId: user.id, taskId: task.id, topicId: task.topicId, correct } }),
      prisma.progress.upsert({
        where: { userId_topicId: { userId: user.id, topicId: task.topicId } },
        update: { lastAttemptAt: new Date() },
        create: { userId: user.id, topicId: task.topicId, lastAttemptAt: new Date() },
      }),
    ]);

    // Если ученик сам решил верно задачу, которую ранее отметил «не смог решить» — заявка закрывается.
    let fixedFlag = false;
    if (correct) {
      const r = await prisma.helpRequest.updateMany({
        where: { userId: user.id, taskId: task.id, status: "open" },
        data: { status: "resolved", autoResolved: true, resolvedAt: new Date() },
      });
      fixedFlag = r.count > 0;
    }

    // XP и достижения: сбой геймификации не должен ломать проверку ответа
    let xp = 0;
    try {
      xp = (await onTaskChecked(user.id, task.id, { correct, firstCorrect: correct && !prev?.correct, fixedFlag })).gained;
    } catch (e) {
      console.error("[gamification] check", e);
    }
    return NextResponse.json({ correct, xp });
  } catch (e) {
    return handleApiError(e);
  }
}
