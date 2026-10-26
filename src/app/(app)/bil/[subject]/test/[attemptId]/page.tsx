import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { TestResult } from "@/components/student/TestResult";
import { TestRunner } from "@/components/student/TestRunner";
import ui from "@/components/student/ui.module.css";
import { getLang, getT } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";
import { toPublicTask } from "@/lib/content/types";
import { accessibleTaskIds, getAccess } from "@/lib/student/access";
import { getSubjectBySlug } from "@/lib/student/progress";
import { canOpenPapers, finishAttempt } from "@/lib/student/tests";

export default async function AttemptPage({
  params,
}: {
  params: Promise<{ subject: string; attemptId: string }>;
}) {
  const user = await requireUser();
  const [lang, t] = [await getLang(), await getT()];
  const { subject: slug, attemptId } = await params;

  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  let attempt = await prisma.testAttempt.findFirst({
    where: { id: attemptId, userId: user.id, subjectId: subject.id },
  });
  if (!attempt) notFound();
  if (attempt.scope === "paper") {
    if (!(await canOpenPapers(user.id, subject.id))) notFound();
  } else if ((await getAccess(user.id)).restricted) {
    const ids = attempt.questionIds as string[];
    const ok = await accessibleTaskIds(user.id, ids);
    if (!ids.every((id) => ok.has(id))) notFound(); // книга закрыта после начала теста
  }

  // таймер истёк, а тест не завершён — закрываем и считаем
  if (!attempt.finishedAt && attempt.deadlineAt && attempt.deadlineAt.getTime() <= Date.now()) {
    attempt = await finishAttempt(user.id, attempt.id);
  }

  const crumbs = [
    { label: t("Подготовка в БИЛ"), href: "/bil" },
    { label: subject.name, href: `/bil/${slug}` },
    attempt.scope === "paper"
      ? { label: t("Пробные варианты"), href: `/bil/${slug}/papers` }
      : { label: t("Пробное тестирование"), href: `/bil/${slug}/test` },
  ];

  if (attempt.finishedAt) {
    return (
      <main className={ui.container}>
        <Breadcrumbs items={[...crumbs, { label: t("Результат") }]} />
        <h1 className={ui.h1}>{t("Результат теста")}</h1>
        <TestResult attempt={attempt} slug={slug} />
      </main>
    );
  }

  // Условия вопросов БЕЗ правильных ответов; порядок — как при подборе.
  const ids = attempt.questionIds as string[];
  const rows = await prisma.task.findMany({
    where: { id: { in: ids } },
    select: { id: true, topicId: true, type: true, question: true, options: true, imageParamsJson: true, i18n: true },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  const questions = ids.flatMap((id) => {
    const r = byId.get(id);
    return r ? [toPublicTask(r, lang)] : [];
  });

  const flagged = await prisma.helpRequest.findMany({
    where: { userId: user.id, status: "open", taskId: { in: ids } },
    select: { taskId: true },
  });

  return (
    <main className={ui.container}>
      <Breadcrumbs items={[...crumbs, { label: t("Тест") }]} />
      <h1 className={ui.h1}>{t("Тест")}</h1>
      <TestRunner
        attemptId={attempt.id}
        questions={questions}
        flaggedIds={flagged.map((h) => h.taskId)}
        initialAnswers={(attempt.answers ?? {}) as Record<string, string>}
        deadlineAt={attempt.deadlineAt?.toISOString() ?? null}
        serverNow={new Date().toISOString()}
      />
    </main>
  );
}
