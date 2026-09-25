import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { StartTestButton } from "@/components/student/StartTestButton";
import ui from "@/components/student/ui.module.css";
import { TaskCard } from "@/components/tasks/TaskCard";
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
  const { subject: slug, topicId } = await params;

  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const topic = await prisma.topic.findFirst({
    where: { id: topicId, section: { subjectId: subject.id } },
    select: { id: true, title: true },
  });
  if (!topic) notFound();

  // Только поля БЕЗ ответа и решения — правильные ответы в браузер не уходят.
  // Задачи, для которых рисунок ещё не сделан (kind="placeholder"), скрываем от учеников.
  const allTasks = await prisma.task.findMany({
    where: { topicId: topic.id, type: "open" },
    orderBy: { order: "asc" },
    select: { id: true, topicId: true, type: true, question: true, options: true, answerType: true, imageParamsJson: true },
  });
  const tasks = allTasks.filter((t) => !hasPendingFigure(parseFigures(t.imageParamsJson)));
  const results = await prisma.taskResult.findMany({
    where: { userId: user.id, taskId: { in: tasks.map((t) => t.id) }, correct: true },
    select: { taskId: true },
  });
  const solved = new Set(results.map((r) => r.taskId));

  const row = flattenTopics(await getCourseTree(subject.id, user.id)).find((t) => t.id === topic.id);
  const testQuestions = Math.min(row?.testTotal ?? 0, TEST_CONFIG.topic.questions);

  return (
    <main className={ui.container}>
      <Breadcrumbs
        items={[
          { label: "Подготовка в БИЛ", href: "/bil" },
          { label: subject.name, href: `/bil/${slug}` },
          { label: "Закрепление", href: `/bil/${slug}/practice` },
          { label: topic.title },
        ]}
      />
      <h1 className={ui.h1}>{topic.title}</h1>
      <p className={ui.lead}>Решено задач: {solved.size} из {tasks.length}.</p>

      {tasks.length === 0 ? (
        <p className={ui.callout}>Задач по этой теме пока нет.</p>
      ) : (
        tasks.map((t, i) => <TaskCard key={t.id} index={i + 1} task={toPublicTask(t)} solved={solved.has(t.id)} />)
      )}

      {testQuestions > 0 && (
        <section className={ui.lessonFooter}>
          <strong>Тест по теме</strong>
          <p className={ui.muted}>Вопросов: {testQuestions}. Без таймера, разбор — после завершения.</p>
          <div className={ui.actions}>
            <StartTestButton subject={slug} scope="topic" topicId={topic.id} label="Пройти тест по теме" />
          </div>
        </section>
      )}
    </main>
  );
}
