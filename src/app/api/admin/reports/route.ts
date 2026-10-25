import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { flaggedTasks, weakTopics, weeklyDynamics } from "@/lib/admin-reports";

// GET /api/admin/reports?type=weak|tasks|weeks&book=subjectId:level&userId=
export async function GET(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const sp = new URL(req.url).searchParams;
  const opts = { book: sp.get("book") || undefined, userId: sp.get("userId") || undefined };
  const type = sp.get("type");
  if (type === "weak") return NextResponse.json(await weakTopics(opts));
  if (type === "tasks") return NextResponse.json(await flaggedTasks(opts));
  if (type === "weeks") return NextResponse.json(await weeklyDynamics(opts));
  return NextResponse.json({ error: "type: weak | tasks | weeks" }, { status: 400 });
}
