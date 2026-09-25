import { NextResponse } from "next/server";
import { ApiError, handleApiError, requireApiUser } from "@/lib/auth/guards";
import { startAttempt, type TestScope } from "@/lib/student/tests";

const SCOPES: TestScope[] = ["topic", "section", "full"];

// POST /api/tests/start  { subject: "math", scope: "topic"|"section"|"full", sectionId?, topicId? }
export async function POST(req: Request) {
  try {
    const user = await requireApiUser();
    const body = await req.json().catch(() => null);

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
