import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getLang, getT } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { RichText, renderRichInline } from "@/components/content/RichText";
import { HelpFlag } from "@/components/tasks/HelpFlag";
import { TaskContent } from "@/components/tasks/TaskContent";
import { parseFigures, parseOptions } from "@/lib/content/types";
import { WEAK_THRESHOLD_PERCENT, type BreakdownRow } from "@/lib/student/tests";
import { ProgressBar } from "./ProgressBar";
import ui from "./ui.module.css";

type Attempt = {
  id: string;
  userId: string;
  questionIds: unknown;
  answers: unknown;
  score: number | null;
  total: number;
  breakdown: unknown;
};

const pct = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);

export async function TestResult({ attempt, slug }: { attempt: Attempt; slug: string }) {
  const [lang, tr] = [await getLang(), await getT()];
  const ids = attempt.questionIds as string[];
  const answers = (attempt.answers ?? {}) as Record<string, string>;
  const rawBreakdown = (attempt.breakdown ?? []) as BreakdownRow[];
  // названия тем берём из БД на нужном языке (в breakdown лежит русское название на момент завершения)
  const topicRows = await prisma.topic.findMany({
    where: { id: { in: rawBreakdown.map((b) => b.topicId) } },
    select: { id: true, title: true, i18n: true },
  });
  const topicTitle = new Map(topicRows.map((x) => [x.id, pick(x.i18n, lang, "title", x.title)]));
  const breakdown = rawBreakdown
    .map((b) => ({ ...b, title: topicTitle.get(b.topicId) ?? b.title, percent: pct(b.correct, b.total) }))
    .sort((a, b) => a.percent - b.percent); // слабые места — сверху

  const tasks = await prisma.task.findMany({
    where: { id: { in: ids } },
    select: { id: true, question: true, options: true, imageParamsJson: true, correctOption: true, solutionText: true, i18n: true },
  });
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const flagged = new Set(
    (await prisma.helpRequest.findMany({
      where: { userId: attempt.userId, status: "open", taskId: { in: ids } },
      select: { taskId: true },
    })).map((h) => h.taskId),
  );

  const score = attempt.score ?? 0;
  const total = attempt.total;
  const weak = breakdown.filter((b) => b.percent < WEAK_THRESHOLD_PERCENT);

  return (
    <div>
      <section className={ui.score}>
        <p className={ui.scoreBig}>{tr("{a} из {b}", { a: score, b: total })}</p>
        <p className={ui.muted}>{tr("Верных ответов: {p}%", { p: pct(score, total) })}</p>
        <ProgressBar value={pct(score, total)} label={tr("Результат теста")} tone={pct(score, total) >= WEAK_THRESHOLD_PERCENT ? "ok" : "weak"} />
      </section>

      {breakdown.length > 0 && (
        <section>
          <h2 className={ui.h2}>{tr("Результат по темам")}</h2>
          {breakdown.map((b) => (
            <div key={b.topicId} className={ui.breakRow}>
              <span className={ui.breakTitle}>{b.title}</span>
              <ProgressBar value={b.percent} label={b.title} tone={b.percent < WEAK_THRESHOLD_PERCENT ? "weak" : "ok"} />
              <span className={ui.breakNum}>{tr("{a} из {b}", { a: b.correct, b: b.total })}</span>
            </div>
          ))}
        </section>
      )}

      {weak.length > 0 && (
        <section className={ui.callout}>
          <strong>{tr("Что стоит повторить")}</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
            {weak.map((b) => (
              <li key={b.topicId}>
                <Link href={`/bil/${slug}/learn/${b.topicId}`}>{b.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <h2 className={ui.h2}>{tr("Разбор вопросов")}</h2>
      {ids.map((id, i) => {
        const t = byId.get(id);
        if (!t) return null;
        const options = parseOptions(pick(t.i18n, lang, "options", t.options));
        const mine = answers[id];
        const ok = !!mine && mine === t.correctOption;
        const text = (key?: string) => options.find((o) => o.key === key);

        return (
          <article key={id} className={`${ui.review} ${ok ? ui.reviewOk : ui.reviewBad}`}>
            <p className={ui.questionNum}>{tr("Вопрос {n}", { n: i + 1 })}: {ok ? tr("верно") : mine ? tr("неверно") : tr("нет ответа")}</p>
            <TaskContent question={pick(t.i18n, lang, "question", t.question)} figures={parseFigures(t.imageParamsJson)} />
            {!ok && (
              <p className={ui.reviewLine}>
                {tr("Ваш ответ")}: {mine ? <>{mine}. {renderRichInline(text(mine)?.text ?? "", `m${i}`)}</> : tr("не выбран")}
              </p>
            )}
            <p className={ui.reviewLine}>
              {tr("Правильный ответ")}: {t.correctOption}. {renderRichInline(text(t.correctOption ?? undefined)?.text ?? "", `c${i}`)}
            </p>
            {pick<string>(t.i18n, lang, "solution", t.solutionText ?? "") && (
              <details>
                <summary>{tr("Показать решение")}</summary>
                <RichText text={pick<string>(t.i18n, lang, "solution", t.solutionText ?? "")} />
              </details>
            )}
            {(!ok || flagged.has(id)) && (
              <HelpFlag taskId={id} from={{ source: "test", attemptId: attempt.id }} initiallyFlagged={flagged.has(id)} />
            )}
          </article>
        );
      })}

      <div className={ui.actions}>
        <Link href={`/bil/${slug}/test`} className={ui.btn}>{tr("К выбору тестов")}</Link>
        <Link href={`/bil/${slug}`} className={ui.btnGhost}>{tr("К предмету")}</Link>
      </div>
    </div>
  );
}
