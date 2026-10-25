import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { KkNote } from "@/components/student/KkNote";
import { StartTestButton } from "@/components/student/StartTestButton";
import ui from "@/components/student/ui.module.css";
import { PracticeRunner } from "@/components/tasks/PracticeRunner";
import { getLang, getT } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";
import { hasPendingFigure, parseFigures, toPublicTask } from "@/lib/content/types";
import { flattenTopics, getCourseTree, getSubjectBySlug } from "@/lib/student/progress";
import { TEST_CONFIG } from "@/lib/student/tests";

export default async function TopicPracticePage({
  params,
}: {
  params: Promise<{ subject: string; topicId: string }>;
}) {
  const user = await requireUser();
  const [lang, t] = [await getLang(), await getT()];
  const { subject: slug, topicId } = await params;

  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const topic = await prisma.topic.findFirst({
    where: { id: topicId, section: { subjectId: subject.id } },
    select: { id: true, title: true, i18n: true },
  });
  if (!topic) notFound();

  // Только поля БЕЗ ответа и решения — правильные ответы в браузер не уходят.
  // Задачи, для которых рисунок ещё не сделан (kind="placeholder"), скрываем от учеников.
  const allTasks = await prisma.task.findMany({
    where: { topicId: topic.id, type: "open" },
    orderBy: { order: "asc" },
    select: { id: true, topicId: true, type: true, question: true, options: true, answerType: true, imageParamsJson: true, i18n: true },
  });
  const tasks = allTasks.filter((t) => !hasPendingFigure(parseFigures(t.imageParamsJson)));
  const results = await prisma.taskResult.findMany({
    where: { userId: user.id, taskId: { in: tasks.map((t) => t.id) }, correct: true },
    select: { taskId: true },
  });
  const solved = new Set(results.map((r) => r.taskId));
  const helpRows = await prisma.helpRequest.findMany({
    where: { userId: user.id, status: "open", taskId: { in: tasks.map((t) => t.id) } },
    select: { taskId: true },
  });
  const flagged = new Set(helpRows.map((h) => h.taskId));

  const title = pick(topic.i18n, lang, "title", topic.title);
  const row = flattenTopics(await getCourseTree(subject.id, user.id)).find((t) => t.id === topic.id);
  const testQuestions = Math.min(row?.testTotal ?? 0, TEST_CONFIG.topic.questions);

  return (
    <main className={ui.container}>
      <Breadcrumbs
        items={[
          { label: t("Подготовка в БИЛ"), href: "/bil" },
          { label: subject.name, href: `/bil/${slug}` },
          { label: t("Закрепление"), href: `/bil/${slug}/practice` },
          { label: title },
        ]}
      />
      <h1 className={ui.h1}>{title}</h1>
      {lang === "kk" && <KkNote />}
      {testQuestions > 0 && (
        <section className={ui.testCard}>
          <strong>{t("Тест по теме")}</strong>
          <p className={ui.muted}>{t("Вопросов: {n}. Без таймера, разбор — после завершения.", { n: testQuestions })}</p>
          <div className={ui.actions}>
            <StartTestButton subject={slug} scope="topic" topicId={topic.id} label={t("Пройти тест по теме")} />
          </div>
        </section>
      )}
      {tasks.length === 0 ? (
        <p className={ui.callout}>{t("Задач по этой теме пока нет.")}</p>
      ) : (
        <PracticeRunner
          tasks={tasks.map((t) => toPublicTask(t, lang))}
          solvedIds={tasks.filter((t) => solved.has(t.id)).map((t) => t.id)}
          flaggedIds={tasks.filter((t) => flagged.has(t.id)).map((t) => t.id)}
        />
      )}

    </main>
  );
}
