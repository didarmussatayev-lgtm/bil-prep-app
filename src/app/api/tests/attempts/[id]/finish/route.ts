import { NextResponse } from "next/server";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";
import { finishAttempt } from "@/lib/student/tests";

// POST /api/tests/attempts/:id/finish — завершить тест и посчитать результат
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const attempt = await finishAttempt(user.id, id);
    return NextResponse.json({ ok: true, score: attempt.score, total: attempt.total });
  } catch (e) {
    return handleApiError(e);
  }
}
