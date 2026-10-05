import Link from "next/link";
import { learnStatus, practiceStatus, SUBJECT_LEVELS, type SectionRow, type Status, type TopicRow } from "@/lib/student/progress";
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

function TopicList({ topics, mode, basePath }: { topics: TopicRow[]; mode: Mode; basePath: string }) {
  return (
    <ul className={ui.topicList}>
      {topics.map((t) => {
        const status = mode === "learn" ? learnStatus(t) : practiceStatus(t);
        const clickable = !(mode === "practice" && t.practiceTotal === 0);
        const inner = (
          <>
            <span className={ui.topicTitle}>{t.title}</span>
            {mode === "practice" && t.practiceTotal > 0 && (
              <span className={ui.topicMeta}>{t.practiceSolved} из {t.practiceTotal}</span>
            )}
            <span className={`${ui.badge} ${TONE[status]}`}>{LABEL[status]}</span>
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
function counter(topics: TopicRow[], mode: Mode) {
  if (mode === "learn") return `${topics.filter((t) => t.learned).length} из ${topics.length} тем`;
  const total = topics.reduce((n, t) => n + t.practiceTotal, 0);
  return `${topics.reduce((n, t) => n + t.practiceSolved, 0)} из ${total} задач`;
}

function SectionBlock({ section, mode, basePath, open }: { section: SectionRow; mode: Mode; basePath: string; open?: boolean }) {
  return (
    <details className={ui.sectionBox} open={open}>
      <summary className={ui.sectionSummary}>
        <span className={ui.topicTitle}>{section.title}</span>
        <span className={ui.topicMeta}>{counter(section.topics, mode)}</span>
      </summary>
      <TopicList topics={section.topics} mode={mode} basePath={basePath} />
    </details>
  );
}

/**
 * Кликабельное оглавление с индикатором прогресса у каждой темы.
 * Для предметов с уровнями (математика: «Математика 1–4») — раскрывающиеся уровни, внутри
 * раскрывающиеся разделы с названиями; для остальных — плоский список разделов, как раньше.
 */
export function TopicToc({
  sections,
  mode,
  basePath,
  subjectSlug,
}: {
  sections: SectionRow[];
  mode: Mode;
  basePath: string; // ссылка на тему = `${basePath}/${topic.id}`
  subjectSlug?: string;
}) {
  const levels = subjectSlug ? SUBJECT_LEVELS[subjectSlug] : undefined;

  if (!levels) {
    if (sections.length === 0) return <p className={ui.callout}>Материалы по этому предмету пока не добавлены.</p>;
    return (
      <>
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`sec-${section.id}`}>
            <h2 className={ui.h2} id={`sec-${section.id}`}>{section.title}</h2>
            <TopicList topics={section.topics} mode={mode} basePath={basePath} />
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
              <span className={ui.levelTitle}>{title}</span>
              {own.length > 0 && <span className={ui.topicMeta}>{counter(topics, mode)}</span>}
            </summary>
            {own.length === 0 ? (
              <p className={ui.levelSoon}>Материалы этого уровня появятся позже.</p>
            ) : (
              <div className={ui.levelBody}>
                {own.map((s) => (
                  <SectionBlock key={s.id} section={s} mode={mode} basePath={basePath} />
                ))}
              </div>
            )}
          </details>
        );
      })}
    </>
  );
}
