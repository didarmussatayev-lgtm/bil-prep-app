import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { importPapers } from "@/lib/exam-import";

export const maxDuration = 300;

// POST — загрузить/обновить варианты из data/exams (файлы лежат в репозитории)
export async function POST() {
  const g = await requireAdmin(); if (g.error) return g.error;
  return NextResponse.json(await importPapers());
}
