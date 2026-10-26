import { GamiSummary } from "@/components/student/GamiSummary";
import ui from "@/components/student/ui.module.css";
import styles from "@/components/student/gami.module.css";
import { requireUser } from "@/lib/auth/guards";
import { ACHIEVEMENTS } from "@/lib/gamification/config";
import { describeKey, getSummary } from "@/lib/gamification/engine";
import { getLang, getT } from "@/lib/i18n/server";
import { formatDateTime } from "@/lib/student/format";

export default async function AchievementsPage() {
  const user = await requireUser();
  const [lang, t] = [await getLang(), await getT()];
  const summary = await getSummary(user.id);
  const have = new Map(summary.achievements.map((a) => [a.key, a.earnedAt]));
  const dynamic = await Promise.all([...have.keys()].filter((k) => k.startsWith("book_done:")).map((k) => describeKey(k)));
  const earned = summary.achievements.filter((a) => !a.key.startsWith("lvl:") && ACHIEVEMENTS.some((d) => d.key === a.key)).length + dynamic.length;

  return (
    <main className={ui.container}>
      <h1 className={ui.h1}>{t("Мои достижения")}</h1>
      <GamiSummary userId={user.id} showLink={false} />
      <h2 className={ui.h2}>{t("Все достижения")} · {t("Получено: {a} из {b}", { a: earned, b: ACHIEVEMENTS.length })}</h2>
      <ul className={styles.achGrid}>
        {ACHIEVEMENTS.map((a) => {
          const at = have.get(a.key);
          return (
            <li key={a.key} className={`${styles.ach} ${at ? "" : styles.achLocked}`}>
              <div className={styles.achIcon} aria-hidden="true">{a.icon}</div>
              <p className={styles.achTitle}>{lang === "kk" ? a.kk : a.ru}</p>
              <p className={styles.achDesc}>{lang === "kk" ? a.descKk : a.descRu}</p>
              {at && <p className={styles.achDesc}>{t("Получено {d}", { d: formatDateTime(at, lang) })}</p>}
            </li>
          );
        })}
        {dynamic.map((d) => d && (
          <li key={d.key} className={styles.ach}>
            <div className={styles.achIcon} aria-hidden="true">{d.icon}</div>
            <p className={styles.achTitle}>{d.title[lang]}</p>
            <p className={styles.achDesc}>{d.desc[lang]}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
