import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const g = await requireAdmin(); if (g.error) return g.error;
  const rows = await prisma.examPaper.findMany({
    orderBy: [{ subject: { order: "asc" } }, { groupKey: "asc" }, { order: "asc" }],
    select: { id: true, slug: true, title: true, groupKey: true, year: true, hidden: true, timeLimitSeconds: true, questionIds: true, subject: { select: { name: true } } },
  });
  const attempts = await prisma.testAttempt.groupBy({ by: ["paperId"], where: { scope: "paper", finishedAt: { not: null } }, _count: true, _avg: { score: true } });
  const stat = new Map(attempts.map((a) => [a.paperId, a]));
  return NextResponse.json(rows.map((r) => ({
    id: r.id, slug: r.slug, title: r.title, group: r.groupKey, year: r.year, hidden: r.hidden, subject: r.subject.name,
    minutes: r.timeLimitSeconds ? Math.round(r.timeLimitSeconds / 60) : null, questions: (r.questionIds as string[]).length,
    attempts: stat.get(r.id)?._count ?? 0, avgScore: stat.get(r.id)?._avg.score ?? null,
  })));
}
