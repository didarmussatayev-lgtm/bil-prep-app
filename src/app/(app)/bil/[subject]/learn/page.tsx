import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { TopicToc } from "@/components/student/TopicToc";
import ui from "@/components/student/ui.module.css";
import { requireUser } from "@/lib/auth/guards";
import { getCourseTree, getSubjectBySlug } from "@/lib/student/progress";

export default async function LearnTocPage({ params }: { params: Promise<{ subject: string }> }) {
  const user = await requireUser();
  const { subject: slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const sections = await getCourseTree(subject.id, user.id);

  return (
    <main className={ui.container}>
      <Breadcrumbs
        items={[
          { label: "Подготовка в БИЛ", href: "/bil" },
          { label: subject.name, href: `/bil/${slug}` },
          { label: "Обучение" },
        ]}
      />
      <h1 className={ui.h1}>Обучение</h1>
      <p className={ui.lead}>Выберите тему, чтобы прочитать объяснение и разобрать примеры.</p>
      <TopicToc sections={sections} mode="learn" basePath={`/bil/${slug}/learn`} />
    </main>
  );
}
