import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";
import { formatAnswer, type AnswerType } from "@/lib/student/answerCheck";

/** «Показать решение» — отдаёт разбор и эталонный ответ по запросу (не вместе с условием задачи). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireApiUser();
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      select: { type: true, solutionText: true, correctOption: true, answerType: true, correctAnswerJson: true },
    });
    if (!task) return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });

    const answer =
      task.type === "test_choice"
        ? task.correctOption
        : task.answerType
          ? formatAnswer(task.answerType as AnswerType, task.correctAnswerJson as any)
          : null;

    return NextResponse.json({ solutionText: task.solutionText ?? "", answer });
  } catch (e) {
    return handleApiError(e);
  }
}
