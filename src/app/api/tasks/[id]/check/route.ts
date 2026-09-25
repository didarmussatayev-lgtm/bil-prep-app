import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const task = await prisma.task.findUnique({
      where: { id },
      select: { id: true, topicId: true, type: true, answerType: true, correctAnswerJson: true, allowUnreduced: true },
    });
    if (!task || task.type !== "open" || !task.answerType) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const answerType = task.answerType as AnswerType;
    if (!isWellFormedAnswer(answerType, body?.answer)) {
      return NextResponse.json({ error: "Заполните ответ полностью" }, { status: 400 });
    }

    const correct = checkAnswer({
      answerType,
      studentValue: body.answer,
      correctValue: task.correctAnswerJson as any,
      allowUnreduced: task.allowUnreduced,
    });

    await prisma.$transaction([
      // correct: "хотя бы раз решена верно" — при неверном ответе не затираем true, поставленный раньше.
      prisma.taskResult.upsert({
        where: { userId_taskId: { userId: user.id, taskId: task.id } },
        update: { correct: correct ? true : undefined, attempts: { increment: 1 }, lastAnswer: body.answer },
        create: { userId: user.id, taskId: task.id, correct, attempts: 1, lastAnswer: body.answer },
      }),
      prisma.progress.upsert({
        where: { userId_topicId: { userId: user.id, topicId: task.topicId } },
        update: { lastAttemptAt: new Date() },
        create: { userId: user.id, topicId: task.topicId, lastAttemptAt: new Date() },
      }),
    ]);

    return NextResponse.json({ correct });
  } catch (e) {
    return handleApiError(e);
  }
}
