import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

/** Список заявок «Не смог решить» для админа. ?status=open (по умолчанию) | resolved | all */
export async function GET(req: Request) {
  const g = await requireAdmin();
  if (g.error) return g.error;

  const status = new URL(req.url).searchParams.get("status") ?? "open";
  const rows = await prisma.helpRequest.findMany({
    where: status === "all" ? {} : { status: status === "resolved" ? "resolved" : "open" },
    orderBy: [{ createdAt: "desc" }],
    take: 500,
    select: {
      id: true, note: true, source: true, attemptId: true, status: true, autoResolved: true, createdAt: true, resolvedAt: true,
      user: { select: { id: true, login: true } },
      task: {
        select: {
          id: true, number: true, question: true, answerType: true, correctAnswerJson: true, type: true, options: true, correctOption: true, solutionText: true, imageParamsJson: true,
          topic: { select: { id: true, title: true, section: { select: { title: true, level: true, subjectId: true } } } },
        },
      },
    },
  });
  return NextResponse.json(rows);
}

/** Разбор пачкой: PATCH { ids: string[], status: "open" | "resolved" } */
export async function PATCH(req: Request) {
  const g = await requireAdmin();
  if (g.error) return g.error;
  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids) ? body.ids.filter((x: unknown) => typeof x === "string").slice(0, 500) : [];
  if (!ids.length || (body?.status !== "open" && body?.status !== "resolved")) {
    return NextResponse.json({ error: "Нужны ids и status (open | resolved)" }, { status: 400 });
  }
  const open = body.status === "open";
  const res = await prisma.helpRequest.updateMany({
    where: { id: { in: ids } },
    data: { status: body.status, autoResolved: false, resolvedAt: open ? null : new Date() },
  });
  return NextResponse.json({ updated: res.count });
}
