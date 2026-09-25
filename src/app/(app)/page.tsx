import Link from "next/link";
import { ProgressBar } from "@/components/student/ProgressBar";
import ui from "@/components/student/ui.module.css";
import { requireUser } from "@/lib/auth/guards";
import { getOverallProgress } from "@/lib/student/progress";

export default async function HomePage() {
  const user = await requireUser();
  const p = await getOverallProgress(user.id);

  return (
    <main className={ui.container}>
      <h1 className={ui.h1}>Ваш прогресс</h1>

      {p.topics === 0 ? (
        <p className={ui.callout}>Учебные материалы пока не добавлены. Загляните позже.</p>
      ) : (
        <section className={ui.progressBlock} aria-label="Общий прогресс курса">
          <div className={ui.progressHead}>
            <span className={ui.bigPercent}>{p.percent}%</span>
            <span>курса пройдено</span>
          </div>
          <ProgressBar value={p.percent} label="Общий прогресс курса" />
          <p className={ui.muted}>
            Изучено тем: {p.learned} из {p.topics}. Решено задач: {p.solved} из {p.tasks}.
          </p>
        </section>
      )}

      <Link href="/bil" className={ui.btnLarge}>Подготовка в БИЛ</Link>
    </main>
  );
}
