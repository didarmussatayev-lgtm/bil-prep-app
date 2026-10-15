import Link from "next/link";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import ui from "@/components/student/ui.module.css";
import { getT } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth/guards";
import { getCourseTree, listSubjects, summarize } from "@/lib/student/progress";

export default async function SubjectsPage() {
  const user = await requireUser();
  const t = await getT();
  const subjects = await listSubjects();
  const items = await Promise.all(
    subjects.map(async (s) => ({ s, sum: summarize(await getCourseTree(s.id, user.id)) })),
  );

  return (
    <main className={ui.container}>
      <Breadcrumbs items={[{ label: t("Подготовка в БИЛ") }]} />
      <h1 className={ui.h1}>{t("Выберите предмет")}</h1>
      <p className={ui.lead}>{t("Обучение, задачи и пробные тесты собраны по предметам.")}</p>

      <div className={ui.tiles}>
        {items.map(({ s, sum }) =>
          sum.topics > 0 ? (
            <Link key={s.id} href={`/bil/${s.slug}`} className={ui.tile}>
              <h2 className={ui.tileTitle}>{s.name}</h2>
              <p className={ui.tileText}>{t("Пройдено {p}% курса", { p: sum.percent })}</p>
              <p className={ui.tileMeta}>{t("Изучено тем: {a} из {b}", { a: sum.learned, b: sum.topics })}</p>
            </Link>
          ) : (
            <div key={s.id} className={`${ui.tile} ${ui.tileDisabled}`}>
              <h2 className={ui.tileTitle}>{s.name}</h2>
              <p className={ui.tileText}>{t("Материалы появятся позже")}</p>
            </div>
          ),
        )}
      </div>
    </main>
  );
}
