import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import ui from "@/components/student/ui.module.css";
import { getT } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth/guards";
import { allowedLevels, getAccess } from "@/lib/student/access";
import { getCourseTree, getSubjectBySlug, summarize } from "@/lib/student/progress";
import { canOpenPapers } from "@/lib/student/tests";
import { prisma } from "@/lib/prisma";

export default async function SubjectHubPage({ params }: { params: Promise<{ subject: string }> }) {
  const user = await requireUser();
  const t = await getT();
  const { subject: slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const [tree, access] = await Promise.all([getCourseTree(subject.id, user.id), getAccess(user.id)]);
  if (access.restricted && tree.length === 0) notFound(); // книги предмета ученику не открыты
  const sum = summarize(tree);
  const base = `/bil/${slug}`;
  const papersCount = (await canOpenPapers(user.id, subject.id)) ? await prisma.examPaper.count({ where: { subjectId: subject.id, hidden: false } }) : 0;

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
        {papersCount > 0 && (
          <Link href={`${base}/papers`} className={ui.tile}>
            <h2 className={ui.tileTitle}>{t("Пробные варианты")}</h2>
            <p className={ui.tileText}>{t("Полные варианты экзамена с таймером и общим баллом.")}</p>
            <p className={ui.tileMeta}>{t("Вариантов: {n}", { n: papersCount })}</p>
          </Link>
        )}
      </div>
    </main>
  );
}
