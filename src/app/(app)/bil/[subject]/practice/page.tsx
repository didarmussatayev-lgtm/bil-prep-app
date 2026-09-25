import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { TopicToc } from "@/components/student/TopicToc";
import ui from "@/components/student/ui.module.css";
import { requireUser } from "@/lib/auth/guards";
import { getCourseTree, getSubjectBySlug } from "@/lib/student/progress";

export default async function PracticeTocPage({ params }: { params: Promise<{ subject: string }> }) {
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
          { label: "Закрепление" },
        ]}
      />
      <h1 className={ui.h1}>Закрепление</h1>
      <p className={ui.lead}>Выберите тему, чтобы решать задачи по ней.</p>
      <TopicToc sections={sections} mode="practice" basePath={`/bil/${slug}/practice`} />
    </main>
  );
}
