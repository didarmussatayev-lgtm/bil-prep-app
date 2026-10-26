import Link from "next/link";
import { getLang, getT } from "@/lib/i18n/server";
import { levelTitle } from "@/lib/gamification/config";
import { getSummary } from "@/lib/gamification/engine";
import { ProgressBar } from "./ProgressBar";
import ui from "./ui.module.css";
import styles from "./gami.module.css";

/** Блок на главной: уровень и XP, серия, цель дня, обратный отсчёт до экзамена. */
export async function GamiSummary({ userId, showLink = true }: { userId: string; showLink?: boolean }) {
  const [lang, t, g] = [await getLang(), await getT(), await getSummary(userId)];
  const done = g.todayPoints >= g.goal;
  return (
    <section className={styles.panel} aria-label={t("Мой прогресс")}>
      {g.exams.map((e) => (
        <div key={e.id} className={`${styles.stat} ${styles.exam}`}>
          <span className={styles.statNum}>{e.daysLeft === 0 ? t("Сегодня экзамен «{t}» — удачи!", { t: e.title }) : t("До экзамена «{t}»: {n} дн.", { t: e.title, n: e.daysLeft })}</span>
          {e.daysLeft > 0 && e.topicsLeft > 0 && <span className={styles.statLbl}>{t("Осталось тем: {a}. Это около {b} в неделю.", { a: e.topicsLeft, b: e.topicsPerWeek })}</span>}
        </div>
      ))}

      <div className={styles.row}>
        <div className={styles.stat}>
          <span className={styles.statNum}>🔥 {g.streak}</span>
          <span className={styles.statLbl}>{t("дней подряд")}</span>
        </div>
        <div className={`${styles.stat} ${styles.row}`} style={{ minWidth: 220 }}>
          <div className={`${styles.goalRing} ${done ? styles.goalDone : ""}`} style={{ ["--p" as string]: Math.min(100, (g.todayPoints / g.goal) * 100) }} data-label={done ? "✓" : `${g.todayPoints}/${g.goal}`} />
          <div style={{ flex: 1, minWidth: 120 }}>
            <span className={styles.statNum} style={{ fontSize: "1.05rem" }}>{done ? t("Цель дня выполнена!") : t("Цель дня")}</span>
            <span className={styles.statLbl}>{t("Задача — 1 очко, тема и тест — по 5.")}</span>
          </div>
        </div>
      </div>
      {g.atRisk && <p className={styles.warn}>{t("Позанимайся сегодня, чтобы не потерять серию!")}</p>}

      <div>
        <div className={styles.row} style={{ justifyContent: "space-between" }}>
          <strong>⭐ {t("Уровень {n}", { n: g.level })} · {levelTitle(g.level, lang)}</strong>
          <span className={ui.muted} style={{ margin: 0 }}>{g.xp} XP</span>
        </div>
        <ProgressBar value={(g.levelInto / g.levelNeed) * 100} label={t("До следующего уровня")} />
        <p className={ui.muted}>{t("До следующего уровня: {n} XP", { n: g.levelTo - g.xp })}</p>
      </div>
      {showLink && <Link href="/achievements" className={ui.btnGhost}>🏆 {t("Мои достижения")}</Link>}
    </section>
  );
}
