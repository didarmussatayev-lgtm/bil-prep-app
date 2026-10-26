import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { activityLogStart } from "@/lib/admin-activity";
import { flaggedTasks, weakTopics, weeklyDynamics } from "@/lib/admin-reports";

// GET /api/admin/reports?type=weak|tasks|weeks&book=subjectId:level&userId=&days=7|30|90 (пусто — всё время)
export async function GET(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const sp = new URL(req.url).searchParams;
  const days = Number(sp.get("days")) || 0; // 0 — за всё время
  const opts = { book: sp.get("book") || undefined, userId: sp.get("userId") || undefined, days };
  const type = sp.get("type");
  if (type === "weak") return NextResponse.json(await weakTopics(opts));
  if (type === "tasks") return NextResponse.json(await flaggedTasks(opts));
  if (type === "weeks") return NextResponse.json({ rows: await weeklyDynamics(opts), logStart: await activityLogStart() });
  return NextResponse.json({ error: "type: weak | tasks | weeks" }, { status: 400 });
}
