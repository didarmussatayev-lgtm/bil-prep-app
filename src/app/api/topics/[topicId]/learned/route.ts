import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, handleApiError, requireApiUser } from "@/lib/auth/guards";

// POST /api/topics/:topicId/learned — отметить тему изученной
export async function POST(_req: Request, { params }: { params: Promise<{ topicId: string }> }) {
  try {
    const user = await requireApiUser();
    const { topicId } = await params;

    const topic = await prisma.topic.findUnique({ where: { id: topicId }, select: { id: true } });
    if (!topic) throw new ApiError(404, "Тема не найдена");

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

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
