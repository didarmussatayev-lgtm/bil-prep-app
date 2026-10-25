import Link from "next/link";
import { studentWeakTopics } from "@/lib/admin-reports";
import { getLang, getT } from "@/lib/i18n/server";
import { WEAK_THRESHOLD_PERCENT } from "@/lib/student/tests";
import ui from "./ui.module.css";

/** «Слабые места» ученика: темы, где верных ответов меньше порога (тесты и закрепление вместе). */
export async function WeakPlaces({ userId, subjectSlug }: { userId: string; subjectSlug?: string }) {
  const [lang, t] = [await getLang(), await getT()];
  const rows = await studentWeakTopics(userId, { subjectSlug, lang });
  if (rows.length === 0) return null;
  return (
    <section className={ui.callout} aria-label={t("Слабые места")}>
      <strong>{t("Слабые места")}</strong>
      <p className={ui.muted}>{t("Эти темы стоит повторить: верных ответов меньше {p}%.", { p: WEAK_THRESHOLD_PERCENT })}</p>
      <ul className={ui.historyList}>
        {rows.map((r) => (
          <li key={r.topicId}>
            <span>{r.title} · {r.percent}%</span>
            <span>
              <Link href={`/bil/${r.subjectSlug}/learn/${r.topicId}`}>{t("Повторить")}</Link>{" · "}
              <Link href={`/bil/${r.subjectSlug}/practice/${r.topicId}`}>{t("Закрепить")}</Link>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
