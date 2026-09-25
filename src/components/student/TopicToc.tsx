import Link from "next/link";
import { learnStatus, practiceStatus, type SectionRow, type Status } from "@/lib/student/progress";
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

/** Кликабельное оглавление: разделы → темы, с индикатором прогресса у каждой темы. */
export function TopicToc({
  sections,
  mode,
  basePath,
}: {
  sections: SectionRow[];
  mode: "learn" | "practice";
  basePath: string; // ссылка на тему = `${basePath}/${topic.id}`
}) {
  if (sections.length === 0) {
    return <p className={ui.callout}>Материалы по этому предмету пока не добавлены.</p>;
  }

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`sec-${section.id}`}>
          <h2 className={ui.h2} id={`sec-${section.id}`}>{section.title}</h2>
          <ul className={ui.topicList}>
            {section.topics.map((t) => {
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
        </section>
      ))}
    </>
  );
}
