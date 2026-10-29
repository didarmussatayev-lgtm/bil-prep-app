import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { StartPaperButtons } from "@/components/student/StartPaperButtons";
import ui from "@/components/student/ui.module.css";
import { bilCrumb } from "@/lib/student/nav";
import { requireUser } from "@/lib/auth/guards";
import { pick } from "@/lib/i18n/content";
import { getLang, getT } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatDuration } from "@/lib/student/format";
import { getSubjectBySlug } from "@/lib/student/progress";
import { canOpenPapers, finishAttempt } from "@/lib/student/tests";

const GROUPS = ["training", "past"] as const;

export default async function PapersPage({ params }: { params: Promise<{ subject: string }> }) {
  const user = await requireUser();
  const [lang, t] = [await getLang(), await getT()];
  const { subject: slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject || !(await canOpenPapers(user.id, subject.id))) notFound();

  // попытки с истёкшим таймером закрываем и считаем
  const stale = await prisma.testAttempt.findMany({
    where: { userId: user.id, subjectId: subject.id, scope: "paper", finishedAt: null, deadlineAt: { lte: new Date() } },
    select: { id: true },
  });
  for (const a of stale) await finishAttempt(user.id, a.id);

  const [papers, attempts] = await Promise.all([
    prisma.examPaper.findMany({ where: { subjectId: subject.id, hidden: false }, orderBy: [{ groupKey: "asc" }, { order: "asc" }] }),
    prisma.testAttempt.findMany({
      where: { userId: user.id, subjectId: subject.id, scope: "paper" },
      orderBy: { startedAt: "desc" },
      select: { id: true, paperId: true, startedAt: true, finishedAt: true, score: true, total: true },
    }),
  ]);

  const byPaper = new Map<string, typeof attempts>();
  for (const a of attempts) if (a.paperId) byPaper.set(a.paperId, [...(byPaper.get(a.paperId) ?? []), a]);

  return (
    <main className={ui.container}>
      <Breadcrumbs items={[...bilCrumb(slug, t), { label: subject.name, href: `/bil/${slug}` }, { label: t("Пробные варианты") }]} />
      <h1 className={ui.h1}>{t("Пробные варианты")}</h1>
      <p className={ui.lead}>{t("Полные варианты в том же порядке, как на экзамене. «Экзамен» идёт с таймером, результат сохраняется; «Тренировка» — без ограничения времени.")}</p>

      {papers.length === 0 && <p className={ui.callout}>{t("Варианты пока не добавлены.")}</p>}
      {GROUPS.map((g) => {
        const list = papers.filter((p) => p.groupKey === g);
        if (list.length === 0) return null;
        return (
          <section key={g}>
            <h2 className={ui.h2}>{g === "training" ? t("Тренировочные варианты") : t("Прошлогодние тесты")}</h2>
            <ul className={ui.topicList}>
              {list.map((p) => {
                const mine = byPaper.get(p.id) ?? [];
                const open = mine.find((a) => !a.finishedAt);
                const done = mine.filter((a) => a.finishedAt);
                const best = done.reduce<(typeof done)[number] | null>((b, a) => (!b || (a.score ?? 0) > (b.score ?? 0) ? a : b), null);
                const n = (p.questionIds as string[]).length;
                return (
                  <li key={p.id}>
                    <div className={ui.example}>
                      <strong>{pick(p.i18n, lang, "title", p.title)}{p.year ? ` · ${p.year}` : ""}</strong>
                      <p className={ui.tileMeta}>
                        {t("Вопросов: {n}", { n })}{p.timeLimitSeconds ? ` · ${t("Время: {d}", { d: formatDuration(p.timeLimitSeconds, lang) })}` : ""}
                        {best ? ` · ${t("Лучший результат: {a} из {b}", { a: best.score ?? 0, b: best.total })}` : ""}
                      </p>
                      {open ? (
                        <div className={ui.actions}><Link className={ui.btn} href={`/bil/${slug}/test/${open.id}`}>{t("Продолжить")}</Link></div>
                      ) : (
                        <StartPaperButtons subject={slug} paperId={p.id} timed={!!p.timeLimitSeconds} />
                      )}
                      {done.length > 0 && (
                        <ul className={ui.historyList}>
                          {done.slice(0, 3).map((a) => (
                            <li key={a.id}>
                              <span>{formatDateTime(a.finishedAt!, lang)}</span>
                              <Link href={`/bil/${slug}/test/${a.id}`}>{t("{a} из {b}, разбор", { a: a.score ?? 0, b: a.total })}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
