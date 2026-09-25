import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { StartTestButton } from "@/components/student/StartTestButton";
import ui from "@/components/student/ui.module.css";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";
import { formatDateTime, formatDuration } from "@/lib/student/format";
import { flattenTopics, getCourseTree, getSubjectBySlug } from "@/lib/student/progress";
import { finishAttempt, TEST_CONFIG } from "@/lib/student/tests";

export default async function TestIndexPage({ params }: { params: Promise<{ subject: string }> }) {
  const user = await requireUser();
  const { subject: slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  // попытки с истёкшим таймером закрываем и считаем автоматически
  const stale = await prisma.testAttempt.findMany({
    where: { userId: user.id, subjectId: subject.id, finishedAt: null, deadlineAt: { lte: new Date() } },
    select: { id: true },
  });
  for (const a of stale) await finishAttempt(user.id, a.id);

  const [tree, attempts] = await Promise.all([
    getCourseTree(subject.id, user.id),
    prisma.testAttempt.findMany({
      where: { userId: user.id, subjectId: subject.id },
      orderBy: { startedAt: "desc" },
      take: 15,
      select: { id: true, scope: true, sectionId: true, topicId: true, startedAt: true, finishedAt: true, score: true, total: true },
    }),
  ]);

  const topics = flattenTopics(tree);
  const sectionTitle = new Map(tree.map((s) => [s.id, s.title]));
  const topicTitle = new Map(topics.map((t) => [t.id, t.title]));
  const label = (a: (typeof attempts)[number]) =>
    a.scope === "full"
      ? "Сборный тест"
      : a.scope === "section"
        ? (sectionTitle.get(a.sectionId ?? "") ?? "Тест по разделу")
        : (topicTitle.get(a.topicId ?? "") ?? "Тест по теме");

  const learned = topics.filter((t) => t.learned);
  const fullPool = learned.reduce((n, t) => n + t.testTotal, 0);
  const fullCfg = TEST_CONFIG.full;
  const fullQuestions = Math.min(fullPool, fullCfg.questions);

  const open = attempts.filter((a) => !a.finishedAt);
  const done = attempts.filter((a) => a.finishedAt);

  return (
    <main className={ui.container}>
      <Breadcrumbs
        items={[
          { label: "Подготовка в БИЛ", href: "/bil" },
          { label: subject.name, href: `/bil/${slug}` },
          { label: "Пробное тестирование" },
        ]}
      />
      <h1 className={ui.h1}>Пробное тестирование</h1>
      <p className={ui.lead}>Каждый раз вопросы подбираются случайно. Разбор ответов доступен после завершения.</p>

      {open.length > 0 && (
        <section className={ui.callout}>
          <strong>Незавершённые тесты</strong>
          <ul className={ui.historyList}>
            {open.map((a) => (
              <li key={a.id}>
                <span>{label(a)}, начат {formatDateTime(a.startedAt)}</span>
                <Link href={`/bil/${slug}/test/${a.id}`}>Продолжить</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <h2 className={ui.h2}>Сборный тест по всей программе</h2>
      <div className={ui.example}>
        <p className={ui.tileText}>
          Вопросы берутся из тем, которые вы уже изучили (сейчас тем: {learned.length}).
          {fullCfg.timeLimitSeconds ? ` Время: ${formatDuration(fullCfg.timeLimitSeconds)}, как на экзамене.` : ""}
        </p>
        <p className={ui.tileMeta}>Вопросов в тесте: {fullQuestions}</p>
        <div className={ui.actions}>
          <StartTestButton
            subject={slug}
            scope="full"
            label="Начать сборный тест"
            disabled={learned.length === 0 || fullQuestions === 0}
          />
        </div>
        {learned.length === 0 && <p className={ui.muted}>Сначала изучите хотя бы одну тему.</p>}
      </div>

      <h2 className={ui.h2}>Тест по разделу</h2>
      {tree.length === 0 ? (
        <p className={ui.callout}>Разделы пока не добавлены.</p>
      ) : (
        <ul className={ui.topicList}>
          {tree.map((s) => {
            const pool = s.topics.reduce((n, t) => n + t.testTotal, 0);
            const q = Math.min(pool, TEST_CONFIG.section.questions);
            return (
              <li key={s.id}>
                <div className={ui.topicRow}>
                  <span className={ui.topicTitle}>{s.title}</span>
                  <span className={ui.topicMeta}>{q > 0 ? `Вопросов: ${q}` : "Вопросов пока нет"}</span>
                  {q > 0 && <StartTestButton subject={slug} scope="section" sectionId={s.id} label="Начать" />}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {done.length > 0 && (
        <>
          <h2 className={ui.h2}>Прошлые результаты</h2>
          <ul className={ui.historyList}>
            {done.map((a) => (
              <li key={a.id}>
                <span>{label(a)}, {formatDateTime(a.finishedAt!)}</span>
                <Link href={`/bil/${slug}/test/${a.id}`}>{a.score} из {a.total}, разбор</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
