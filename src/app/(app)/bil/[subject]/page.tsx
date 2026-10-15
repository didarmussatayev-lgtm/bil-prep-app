import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import ui from "@/components/student/ui.module.css";
import { getT } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth/guards";
import { getCourseTree, getSubjectBySlug, summarize } from "@/lib/student/progress";

export default async function SubjectHubPage({ params }: { params: Promise<{ subject: string }> }) {
  const user = await requireUser();
  const t = await getT();
  const { subject: slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const sum = summarize(await getCourseTree(subject.id, user.id));
  const base = `/bil/${slug}`;

  return (
    <main className={ui.container}>
      <Breadcrumbs items={[{ label: t("Подготовка в БИЛ"), href: "/bil" }, { label: subject.name }]} />
      <h1 className={ui.h1}>{subject.name}</h1>
      <p className={ui.lead}>{t("Сначала изучите тему, затем закрепите её задачами и проверьте себя тестом.")}</p>

      <div className={ui.tiles}>
        <Link href={`${base}/learn`} className={ui.tile}>
          <h2 className={ui.tileTitle}>{t("Пройти обучение")}</h2>
          <p className={ui.tileText}>{t("Теория и разобранные примеры по каждой теме.")}</p>
          <p className={ui.tileMeta}>{t("Изучено тем: {a} из {b}", { a: sum.learned, b: sum.topics })}</p>
        </Link>
        <Link href={`${base}/practice`} className={ui.tile}>
          <h2 className={ui.tileTitle}>{t("Закрепить тему")}</h2>
          <p className={ui.tileText}>{t("Задачи по теме с проверкой ответа.")}</p>
          <p className={ui.tileMeta}>{t("Решено задач: {a} из {b}", { a: sum.solved, b: sum.tasks })}</p>
        </Link>
        <Link href={`${base}/test`} className={ui.tile}>
          <h2 className={ui.tileTitle}>{t("Пробное тестирование")}</h2>
          <p className={ui.tileText}>{t("Тест по разделу или сборный тест по всей программе.")}</p>
        </Link>
      </div>
    </main>
  );
}
