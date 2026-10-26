import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { onTopicLearned } from "@/lib/gamification/engine";
import { sectionFilter } from "@/lib/student/access";
import { ApiError, handleApiError, requireApiUser } from "@/lib/auth/guards";

// POST /api/topics/:topicId/learned — отметить тему изученной
export async function POST(_req: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const user = await requireApiUser();
    const { topicId } = await params;

    const topic = await prisma.topic.findFirst({
      where: { id: topicId, hidden: false, section: await sectionFilter(user.id) },
      select: { id: true },
    });
    if (!topic) throw new ApiError(404, "Тема не найдена");

    const before = await prisma.progress.findUnique({ where: { userId_topicId: { userId: user.id, topicId } }, select: { learnedAt: true } });
    const now = new Date();
    await prisma.progress.upsert({
      where: { userId_topicId: { userId: user.id, topicId } },
      create: { userId: user.id, topicId, learnedAt: now, lastAttemptAt: now },
      update: { lastAttemptAt: now },
    });
    // дату первого изучения не перезаписываем
    await prisma.progress.updateMany({
      where: { userId: user.id, topicId, learnedAt: null },
      data: { learnedAt: now },
    });

    let xp = 0;
    if (!before?.learnedAt) {
      try { xp = (await onTopicLearned(user.id, topicId)).gained; } catch (e) { console.error("[gamification] learned", e); }
    }
    return NextResponse.json({ ok: true, xp });
  } catch (e) {
    return handleApiError(e);
  }
}
