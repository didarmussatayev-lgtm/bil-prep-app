import { NextResponse } from "next/server";
import { ApiError, handleApiError, requireApiUser } from "@/lib/auth/guards";
import { startAttempt, startPaperAttempt, type TestScope } from "@/lib/student/tests";

const SCOPES: TestScope[] = ["topic", "section", "full"];

// POST /api/tests/start  { subject: "math", scope: "topic"|"section"|"full", sectionId?, topicId? }
//                        или { subject, scope: "paper", paperId, mode: "exam"|"practice" }
export async function POST(req: Request) {
  try {
    const user = await requireApiUser();
    const body = await req.json().catch(() => null);

    if (body?.scope === "paper") {
      if (typeof body.subject !== "string" || typeof body.paperId !== "string") throw new ApiError(400, "Неверные параметры теста");
      const a = await startPaperAttempt(user.id, { subjectSlug: body.subject, paperId: body.paperId, mode: body.mode === "practice" ? "practice" : "exam" });
      return NextResponse.json({ id: a.id });
    }

    const scope = body?.scope as TestScope;
    if (typeof body?.subject !== "string" || !SCOPES.includes(scope)) {
      throw new ApiError(400, "Неверные параметры теста");
    }

    const attempt = await startAttempt(user.id, {
      subjectSlug: body.subject,
      scope,
      sectionId: typeof body.sectionId === "string" ? body.sectionId : undefined,
      topicId: typeof body.topicId === "string" ? body.topicId : undefined,
    });
    return NextResponse.json({ id: attempt.id });
  } catch (e) {
    return handleApiError(e);
  }
}
