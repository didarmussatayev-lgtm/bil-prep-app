import { NextResponse } from "next/server";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";
import { saveAnswers } from "@/lib/student/tests";

// PUT /api/tests/attempts/:id  { answers: { [taskId]: "B" } } — автосохранение во время теста
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireApiUser();
    const { id } = await params;
    const body = await req.json().catch(() => null);
    await saveAnswers(user.id, id, body?.answers);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
