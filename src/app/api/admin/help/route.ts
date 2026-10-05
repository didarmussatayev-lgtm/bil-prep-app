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
      id: true, note: true, status: true, autoResolved: true, createdAt: true, resolvedAt: true,
      user: { select: { id: true, login: true } },
      task: {
        select: {
          id: true, number: true, question: true, answerType: true, correctAnswerJson: true,
          topic: { select: { title: true, section: { select: { title: true, level: true } } } },
        },
      },
    },
  });
  return NextResponse.json(rows);
}
