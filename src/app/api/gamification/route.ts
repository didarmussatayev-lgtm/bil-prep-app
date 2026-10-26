import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";
import { describeKey, getSummary } from "@/lib/gamification/engine";

// GET /api/gamification — сводка ученика + достижения, которых он ещё не видел
export async function GET() {
  try {
    const user = await requireApiUser();
    if (user.role !== "student") return NextResponse.json({ enabled: false });
    const [summary, unseen] = await Promise.all([
      getSummary(user.id),
      prisma.userAchievement.findMany({ where: { userId: user.id, seenAt: null }, orderBy: { earnedAt: "asc" }, select: { key: true } }),
    ]);
    // несколько повышений уровня подряд — одно поздравление (с самым высоким уровнем)
    const levels = unseen.filter((u) => u.key.startsWith("lvl:")).map((u) => u.key).sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));
    const keep = unseen.filter((u) => !u.key.startsWith("lvl:") || u.key === levels[levels.length - 1]);
    const items = (await Promise.all(keep.map(async (u) => {
      const d = await describeKey(u.key);
      return d && { ...d, also: u.key === levels[levels.length - 1] ? levels.slice(0, -1) : [] };
    }))).filter((x) => x !== null);
    return NextResponse.json({
      enabled: true,
      xp: summary.xp, level: summary.level, streak: summary.streak, atRisk: summary.atRisk,
      todayPoints: summary.todayPoints, goal: summary.goal,
      unseen: items,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
