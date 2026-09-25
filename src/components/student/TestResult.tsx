import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RichText } from "@/components/content/RichText";
import { TaskContent } from "@/components/tasks/TaskContent";
import { parseFigures, parseOptions } from "@/lib/content/types";
import { WEAK_THRESHOLD_PERCENT, type BreakdownRow } from "@/lib/student/tests";
import { ProgressBar } from "./ProgressBar";
import ui from "./ui.module.css";

type Attempt = {
  questionIds: unknown;
  answers: unknown;
  score: number | null;
  total: number;
  breakdown: unknown;
};

const pct = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);

export async function TestResult({ attempt, slug }: { attempt: Attempt; slug: string }) {
  const ids = attempt.questionIds as string[];
  const answers = (attempt.answers ?? {}) as Record<string, string>;
  const breakdown = ((attempt.breakdown ?? []) as BreakdownRow[])
    .map((b) => ({ ...b, percent: pct(b.correct, b.total) }))
    .sort((a, b) => a.percent - b.percent); // слабые места — сверху

  const tasks = await prisma.task.findMany({
    where: { id: { in: ids } },
    select: { id: true, question: true, options: true, imageParamsJson: true, correctOption: true, solutionText: true },
  });
  const byId = new Map(tasks.map((t) => [t.id, t]));

  const score = attempt.score ?? 0;
  const total = attempt.total;
  const weak = breakdown.filter((b) => b.percent < WEAK_THRESHOLD_PERCENT);

  return (
    <div>
      <section className={ui.score}>
        <p className={ui.scoreBig}>{score} из {total}</p>
        <p className={ui.muted}>Верных ответов: {pct(score, total)}%</p>
        <ProgressBar value={pct(score, total)} label="Результат теста" tone={pct(score, total) >= WEAK_THRESHOLD_PERCENT ? "ok" : "weak"} />
      </section>

      {breakdown.length > 0 && (
        <section>
          <h2 className={ui.h2}>Результат по темам</h2>
          {breakdown.map((b) => (
            <div key={b.topicId} className={ui.breakRow}>
              <span className={ui.breakTitle}>{b.title}</span>
              <ProgressBar value={b.percent} label={b.title} tone={b.percent < WEAK_THRESHOLD_PERCENT ? "weak" : "ok"} />
              <span className={ui.breakNum}>{b.correct} из {b.total}</span>
            </div>
          ))}
        </section>
      )}

      {weak.length > 0 && (
        <section className={ui.callout}>
          <strong>Что стоит повторить</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
            {weak.map((b) => (
              <li key={b.topicId}>
                <Link href={`/bil/${slug}/learn/${b.topicId}`}>{b.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <h2 className={ui.h2}>Разбор вопросов</h2>
      {ids.map((id, i) => {
        const t = byId.get(id);
        if (!t) return null;
        const options = parseOptions(t.options);
        const mine = answers[id];
        const ok = !!mine && mine === t.correctOption;
        const text = (key?: string) => options.find((o) => o.key === key);

        return (
          <article key={id} className={`${ui.review} ${ok ? ui.reviewOk : ui.reviewBad}`}>
            <p className={ui.questionNum}>Вопрос {i + 1}: {ok ? "верно" : mine ? "неверно" : "нет ответа"}</p>
            <TaskContent question={t.question} figures={parseFigures(t.imageParamsJson)} />
            {!ok && (
              <p className={ui.reviewLine}>
                Ваш ответ: {mine ? `${mine}. ${text(mine)?.text ?? ""}` : "не выбран"}
              </p>
            )}
            <p className={ui.reviewLine}>
              Правильный ответ: {t.correctOption}. {text(t.correctOption ?? undefined)?.text}
            </p>
            {t.solutionText && (
              <details>
                <summary>Показать решение</summary>
                <RichText text={t.solutionText} />
              </details>
            )}
          </article>
        );
      })}

      <div className={ui.actions}>
        <Link href={`/bil/${slug}/test`} className={ui.btn}>К выбору тестов</Link>
        <Link href={`/bil/${slug}`} className={ui.btnGhost}>К предмету</Link>
      </div>
    </div>
  );
}
