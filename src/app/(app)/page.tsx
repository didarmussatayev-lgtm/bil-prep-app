import Link from "next/link";
import { ProgressBar } from "@/components/student/ProgressBar";
import ui from "@/components/student/ui.module.css";
import { getT } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth/guards";
import { GamiSummary } from "@/components/student/GamiSummary";
import { WeakPlaces } from "@/components/student/WeakPlaces";
import { getOverallProgress } from "@/lib/student/progress";

export default async function HomePage() {
  const user = await requireUser();
  const t = await getT();
  const p = await getOverallProgress(user.id);

  return (
    <main className={ui.container}>
      <h1 className={ui.h1}>{t("Ваш прогресс")}</h1>

      {p.topics === 0 ? (
        <p className={ui.callout}>{t("Учебные материалы пока не добавлены. Загляните позже.")}</p>
      ) : (
        <section className={ui.progressBlock} aria-label={t("Общий прогресс курса")}>
          <div className={ui.progressHead}>
            <span className={ui.bigPercent}>{p.percent}%</span>
            <span>{t("курса пройдено")}</span>
          </div>
          <ProgressBar value={p.percent} label={t("Общий прогресс курса")} />
          <p className={ui.muted}>
            {t("Изучено тем: {a} из {b}. Решено задач: {c} из {d}.", { a: p.learned, b: p.topics, c: p.solved, d: p.tasks })}
          </p>
        </section>
      )}

      {user.role === "student" && <GamiSummary userId={user.id} />}

      <WeakPlaces userId={user.id} />

      <Link href="/bil" className={ui.btnLarge}>{t("Подготовка в БИЛ")}</Link>
    </main>
  );
}
