import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { hasPendingFigure, parseFigures } from "@/lib/content/types";

// Прогресс ученика в реальной модели (шаг 5): тема — learnedAt/lastAttemptAt (Progress) +
// задачи закрепления — TaskResult; тесты — TestAttempt (вопросы подбираются на лету, без Test/TestQuestion).
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const user = await prisma.user.findFirst({ where: { id, role: "student" }, select: { id: true, login: true } });
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });

  const [topics, allTasks, progress, results, attempts] = await Promise.all([
    prisma.topic.findMany({
      orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
      select: { id: true, title: true },
    }),
    // Общее число задач закрепления на тему (без задач, у которых ещё нет рисунка).
    prisma.task.findMany({ where: { type: "open" }, select: { topicId: true, imageParamsJson: true } }),
    prisma.progress.findMany({ where: { userId: id } }),
    prisma.taskResult.findMany({
      where: { userId: id, correct: true },
      select: { task: { select: { topicId: true } } },
    }),
    prisma.testAttempt.findMany({
      where: { userId: id, finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" },
      take: 50,
      select: { id: true, scope: true, score: true, total: true, finishedAt: true },
    }),
  ]);

  const practiceTotal = new Map<string, number>();
  for (const t of allTasks) {
    if (hasPendingFigure(parseFigures(t.imageParamsJson))) continue;
    practiceTotal.set(t.topicId, (practiceTotal.get(t.topicId) ?? 0) + 1);
  }
  const practiceSolved = new Map<string, number>();
  for (const r of results) {
    practiceSolved.set(r.task.topicId, (practiceSolved.get(r.task.topicId) ?? 0) + 1);
  }
  const byTopic = new Map(progress.map((p) => [p.topicId, p]));

  return NextResponse.json({
    user,
    topics: topics.map((t) => {
      const total = practiceTotal.get(t.id) ?? 0;
      const solved = practiceSolved.get(t.id) ?? 0;
      const learned = !!byTopic.get(t.id)?.learnedAt;
      const status = total === 0 && !learned ? "empty" : !learned && solved === 0 ? "not_started" : learned && solved >= total ? "done" : "in_progress";
      return {
        id: t.id,
        title: t.title,
        learned,
        practiceSolved: solved,
        practiceTotal: total,
        status,
        lastAttemptAt: byTopic.get(t.id)?.lastAttemptAt ?? null,
      };
    }),
    attempts: attempts.map((a) => ({
      id: a.id,
      scope: a.scope,
      score: a.score,
      total: a.total,
      percent: a.total ? Math.round(((a.score ?? 0) / a.total) * 100) : 0,
      takenAt: a.finishedAt,
    })),
  });
}
