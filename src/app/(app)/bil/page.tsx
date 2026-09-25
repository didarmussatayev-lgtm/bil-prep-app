import Link from "next/link";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import ui from "@/components/student/ui.module.css";
import { requireUser } from "@/lib/auth/guards";
import { getCourseTree, listSubjects, summarize } from "@/lib/student/progress";

export default async function SubjectsPage() {
  const user = await requireUser();
  const subjects = await listSubjects();
  const items = await Promise.all(
    subjects.map(async (s) => ({ s, sum: summarize(await getCourseTree(s.id, user.id)) })),
  );

  return (
    <main className={ui.container}>
      <Breadcrumbs items={[{ label: "Подготовка в БИЛ" }]} />
      <h1 className={ui.h1}>Выберите предмет</h1>
      <p className={ui.lead}>Обучение, задачи и пробные тесты собраны по предметам.</p>

      <div className={ui.tiles}>
        {items.map(({ s, sum }) =>
          sum.topics > 0 ? (
            <Link key={s.id} href={`/bil/${s.slug}`} className={ui.tile}>
              <h2 className={ui.tileTitle}>{s.name}</h2>
              <p className={ui.tileText}>Пройдено {sum.percent}% курса</p>
              <p className={ui.tileMeta}>Изучено тем: {sum.learned} из {sum.topics}</p>
            </Link>
          ) : (
            <div key={s.id} className={`${ui.tile} ${ui.tileDisabled}`}>
              <h2 className={ui.tileTitle}>{s.name}</h2>
              <p className={ui.tileText}>Материалы появятся позже</p>
            </div>
          ),
        )}
      </div>
    </main>
  );
}
