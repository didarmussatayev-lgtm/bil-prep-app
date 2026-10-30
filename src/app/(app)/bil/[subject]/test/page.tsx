import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { StartTestButton } from "@/components/student/StartTestButton";
import ui from "@/components/student/ui.module.css";
import { prisma } from "@/lib/prisma";
import { getLang, getT } from "@/lib/i18n/server";
import { bilCrumb } from "@/lib/student/nav";
import { requireUser } from "@/lib/auth/guards";
import { formatDateTime, formatDuration } from "@/lib/student/format";
import { accessibleTaskIds, getAccess } from "@/lib/student/access";
import { WeakPlaces } from "@/components/student/WeakPlaces";
import { flattenTopics, getCourseTree, getSubjectBySlug } from "@/lib/student/progress";
import { finishAttempt, TEST_CONFIG } from "@/lib/student/tests";

export default async function TestIndexPage({ params }: { params: Promise<{ subject: string }> }) {
  const user = await requireUser();
  const [lang, t] = [await getLang(), await getT()];
  const { subject: slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  // попытки с истёкшим таймером закрываем и считаем автоматически
  const stale = await prisma.testAttempt.findMany({
    where: { userId: user.id, subjectId: subject.id, finishedAt: null, deadlineAt: { lte: new Date() } },
    select: { id: true },
  });
  for (const a of stale) await finishAttempt(user.id, a.id);

  const [tree, allAttempts, access] = await Promise.all([
    getCourseTree(subject.id, user.id),
    prisma.testAttempt.findMany({
      where: { userId: user.id, subjectId: subject.id, scope: { not: "paper" } },
      orderBy: { startedAt: "desc" },
      take: 15,
      select: { id: true, scope: true, sectionId: true, topicId: true, questionIds: true, startedAt: true, finishedAt: true, score: true, total: true },
    }),
    getAccess(user.id),
  ]);
  if (access.restricted && tree.length === 0) notFound();
  // попытки по закрытым сейчас книгам в истории не показываем
  const okTasks = access.restricted
    ? await accessibleTaskIds(user.id, allAttempts.flatMap((a) => a.questionIds as string[]))
    : null;
  const attempts = okTasks ? allAttempts.filter((a) => (a.questionIds as string[]).every((id) => okTasks.has(id))) : allAttempts;

  const topics = flattenTopics(tree);
  const sectionTitle = new Map(tree.map((s) => [s.id, s.title]));
  const topicTitle = new Map(topics.map((t) => [t.id, t.title]));
  const label = (a: (typeof attempts)[number]) =>
    a.scope === "full"
      ? t("Сборный тест")
      : a.scope === "section"
        ? (sectionTitle.get(a.sectionId ?? "") ?? t("Тест по разделу"))
        : (topicTitle.get(a.topicId ?? "") ?? t("Тест по теме"));

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
          ...bilCrumb(slug, t),
          { label: subject.name, href: `/bil/${slug}` },
          { label: t("Пробное тестирование") },
        ]}
      />
      <h1 className={ui.h1}>{t("Пробное тестирование")}</h1>
      <p className={ui.lead}>{t("Каждый раз вопросы подбираются случайно. Разбор ответов доступен после завершения.")}</p>

      <WeakPlaces userId={user.id} subjectSlug={slug} />

      {open.length > 0 && (
        <section className={ui.callout}>
          <strong>{t("Незавершённые тесты")}</strong>
          <ul className={ui.historyList}>
            {open.map((a) => (
              <li key={a.id}>
                <span>{t("{name}, начат {date}", { name: label(a), date: formatDateTime(a.startedAt, lang) })}</span>
                <Link href={`/bil/${slug}/test/${a.id}`}>{t("Продолжить")}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <h2 className={ui.h2}>{t("Сборный тест по всей программе")}</h2>
      <div className={ui.example}>
        <p className={ui.tileText}>
          {t("Вопросы берутся из тем, которые вы уже изучили (сейчас тем: {n}).", { n: learned.length })}
          {fullCfg.timeLimitSeconds ? " " + t("Время: {d}, как на экзамене.", { d: formatDuration(fullCfg.timeLimitSeconds, lang) }) : ""}
        </p>
        <p className={ui.tileMeta}>{t("Вопросов в тесте: {n}", { n: fullQuestions })}</p>
        <div className={ui.actions}>
          <StartTestButton
            subject={slug}
            scope="full"
            label={t("Начать сборный тест")}
            disabled={learned.length === 0 || fullQuestions === 0}
          />
        </div>
        {learned.length === 0 && <p className={ui.muted}>{t("Сначала изучите хотя бы одну тему.")}</p>}
      </div>

      <h2 className={ui.h2}>{t("Тест по разделу")}</h2>
      {tree.length === 0 ? (
        <p className={ui.callout}>{t("Разделы пока не добавлены.")}</p>
      ) : (
        <ul className={ui.topicList}>
          {tree.map((s) => {
            const pool = s.topics.reduce((n, t) => n + t.testTotal, 0);
            const q = Math.min(pool, TEST_CONFIG.section.questions);
            return (
              <li key={s.id}>
                <div className={ui.topicRow}>
                  <span className={ui.topicTitle}>{s.title}</span>
                  <span className={ui.topicMeta}>{q > 0 ? t("Вопросов: {n}", { n: q }) : t("Вопросов пока нет")}</span>
                  {q > 0 && <StartTestButton subject={slug} scope="section" sectionId={s.id} label={t("Начать")} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {done.length > 0 && (
        <>
          <h2 className={ui.h2}>{t("Прошлые результаты")}</h2>
          <ul className={ui.historyList}>
            {done.map((a) => (
              <li key={a.id}>
                <span>{label(a)}, {formatDateTime(a.finishedAt!, lang)}</span>
                <Link href={`/bil/${slug}/test/${a.id}`}>{t("{a} из {b}, разбор", { a: a.score ?? 0, b: a.total })}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
