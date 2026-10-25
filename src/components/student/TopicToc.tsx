import Link from "next/link";
import { learnStatus, practiceStatus, SUBJECT_LEVELS, type SectionRow, type Status, type TopicRow } from "@/lib/student/progress";
import { getT } from "@/lib/i18n/server";
import ui from "./ui.module.css";

const LABEL: Record<Status, string> = {
  not_started: "Не начато",
  in_progress: "В процессе",
  done: "Пройдено",
  empty: "Задач пока нет",
};
const TONE: Record<Status, string> = {
  not_started: ui.badgeNone,
  in_progress: ui.badgeProgress,
  done: ui.badgeDone,
  empty: ui.badgeNone,
};

type Mode = "learn" | "practice";

type Tr = (ru: string, vars?: Record<string, string | number>) => string;

function TopicList({ topics, mode, basePath, t: tt }: { topics: TopicRow[]; mode: Mode; basePath: string; t: Tr }) {
  return (
    <ul className={ui.topicList}>
      {topics.map((t) => {
        const status = mode === "learn" ? learnStatus(t) : practiceStatus(t);
        const clickable = !(mode === "practice" && t.practiceTotal === 0);
        const inner = (
          <>
            <span className={ui.topicTitle}>{t.title}</span>
            {mode === "practice" && t.practiceTotal > 0 && (
              <span className={ui.topicMeta}>{tt("{a} из {b}", { a: t.practiceSolved, b: t.practiceTotal })}</span>
            )}
            <span className={`${ui.badge} ${TONE[status]}`}>{tt(LABEL[status])}</span>
          </>
        );
        return (
          <li key={t.id}>
            {clickable ? (
              <Link href={`${basePath}/${t.id}`} className={ui.topicRow}>{inner}</Link>
            ) : (
              <div className={ui.topicRow}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** «5 из 13» — сколько тем пройдено (обучение) или задач решено (закрепление) в наборе тем. */
function counter(topics: TopicRow[], mode: Mode, tt: Tr) {
  if (mode === "learn") return tt("{a} из {b} тем", { a: topics.filter((t) => t.learned).length, b: topics.length });
  const total = topics.reduce((n, t) => n + t.practiceTotal, 0);
  return tt("{a} из {b} задач", { a: topics.reduce((n, t) => n + t.practiceSolved, 0), b: total });
}

function SectionBlock({ section, mode, basePath, open, t }: { section: SectionRow; mode: Mode; basePath: string; open?: boolean; t: Tr }) {
  return (
    <details className={ui.sectionBox} open={open}>
      <summary className={ui.sectionSummary}>
        <span className={ui.topicTitle}>{section.title}</span>
        <span className={ui.topicMeta}>{counter(section.topics, mode, t)}</span>
      </summary>
      <TopicList topics={section.topics} mode={mode} basePath={basePath} t={t} />
    </details>
  );
}

/**
 * Кликабельное оглавление с индикатором прогресса у каждой темы.
 * Для предметов с уровнями (математика: «Математика 1–4») — раскрывающиеся уровни, внутри
 * раскрывающиеся разделы с названиями; для остальных — плоский список разделов, как раньше.
 */
export async function TopicToc({
  sections,
  mode,
  basePath,
  subjectSlug,
  allowedLevels,
}: {
  sections: SectionRow[];
  mode: Mode;
  basePath: string; // ссылка на тему = `${basePath}/${topic.id}`
  subjectSlug?: string;
  allowedLevels?: number[]; // у ученика с ограниченным доступом — только открытые книги (уровни)
}) {
  const t = await getT();
  const levels = (subjectSlug ? SUBJECT_LEVELS[subjectSlug] : undefined)?.filter(
    (l) => !allowedLevels || allowedLevels.includes(l.level),
  );

  if (!levels) {
    if (sections.length === 0) return <p className={ui.callout}>{t("Материалы по этому предмету пока не добавлены.")}</p>;
    return (
      <>
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`sec-${section.id}`}>
            <h2 className={ui.h2} id={`sec-${section.id}`}>{section.title}</h2>
            <TopicList topics={section.topics} mode={mode} basePath={basePath} t={t} />
          </section>
        ))}
      </>
    );
  }

  // уровень, который раскрыт сразу: первый, где есть разделы
  const firstFilled = levels.find((l) => sections.some((s) => s.level === l.level))?.level;

  return (
    <>
      {levels.map(({ level, title }) => {
        const own = sections.filter((s) => s.level === level);
        const topics = own.flatMap((s) => s.topics);
        return (
          <details key={level} className={ui.levelBox} open={level === firstFilled}>
            <summary className={ui.levelSummary}>
              <span className={ui.levelTitle}>{t(title)}</span>
              {own.length > 0 && <span className={ui.topicMeta}>{counter(topics, mode, t)}</span>}
            </summary>
            {own.length === 0 ? (
              <p className={ui.levelSoon}>{t("Материалы этого уровня появятся позже.")}</p>
            ) : (
              <div className={ui.levelBody}>
                {own.map((s) => (
                  <SectionBlock key={s.id} section={s} mode={mode} basePath={basePath} t={t} />
                ))}
              </div>
            )}
          </details>
        );
      })}
    </>
  );
}
