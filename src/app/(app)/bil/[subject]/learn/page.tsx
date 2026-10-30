import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { TopicToc } from "@/components/student/TopicToc";
import ui from "@/components/student/ui.module.css";
import { getT } from "@/lib/i18n/server";
import { bilCrumb } from "@/lib/student/nav";
import { requireUser } from "@/lib/auth/guards";
import { allowedLevels, getAccess } from "@/lib/student/access";
import { getCourseTree, getSubjectBySlug } from "@/lib/student/progress";

export default async function LearnTocPage({ params }: { params: Promise<{ subject: string }> }) {
  const user = await requireUser();
  const t = await getT();
  const { subject: slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const [sections, access] = await Promise.all([getCourseTree(subject.id, user.id), getAccess(user.id)]);
  if (access.restricted && sections.length === 0) notFound();

  return (
    <main className={ui.container}>
      <Breadcrumbs
        items={[
          ...bilCrumb(slug, t),
          { label: subject.name, href: `/bil/${slug}` },
          { label: t("Обучение") },
        ]}
      />
      <h1 className={ui.h1}>{t("Обучение")}</h1>
      <p className={ui.lead}>{t("Выберите тему, чтобы прочитать объяснение и разобрать примеры.")}</p>
      <TopicToc sections={sections} subjectSlug={slug} allowedLevels={allowedLevels(access, subject.id)} mode="learn" basePath={`/bil/${slug}/learn`} />
    </main>
  );
}
