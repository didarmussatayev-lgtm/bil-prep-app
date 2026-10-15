import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { ExplanationView } from "@/components/student/ExplanationView";
import { MarkLearned } from "@/components/student/MarkLearned";
import ui from "@/components/student/ui.module.css";
import { getLang, getT } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { KkNote } from "@/components/student/KkNote";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";
import { parseExplanation } from "@/lib/content/types";
import { flattenTopics, getCourseTree, getSubjectBySlug } from "@/lib/student/progress";

export default async function TopicLearnPage({
  params,
}: {
  params: Promise<{ subject: string; topicId: string }>;
}) {
  const user = await requireUser();
  const [lang, t] = [await getLang(), await getT()];
  const { subject: slug, topicId } = await params;

  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  // тема должна принадлежать именно этому предмету
  const topic = await prisma.topic.findFirst({
    where: { id: topicId, section: { subjectId: subject.id } },
    select: { id: true, title: true, explanationContent: true, i18n: true },
  });
  if (!topic) notFound();

  const title = pick(topic.i18n, lang, "title", topic.title);
  const flat = flattenTopics(await getCourseTree(subject.id, user.id));
  const idx = flat.findIndex((t) => t.id === topic.id);
  const next = idx >= 0 ? flat[idx + 1] : undefined;

  return (
    <main className={ui.container}>
      <Breadcrumbs
        items={[
          { label: t("Подготовка в БИЛ"), href: "/bil" },
          { label: subject.name, href: `/bil/${slug}` },
          { label: t("Обучение"), href: `/bil/${slug}/learn` },
          { label: title },
        ]}
      />
      <h1 className={ui.h1}>{title}</h1>
      {lang === "kk" && <KkNote />}

      <ExplanationView blocks={parseExplanation(pick(topic.i18n, lang, "explanation", topic.explanationContent))} />

      <MarkLearned
        topicId={topic.id}
        initiallyLearned={flat[idx]?.learned ?? false}
        practiceHref={`/bil/${slug}/practice/${topic.id}`}
        nextHref={next ? `/bil/${slug}/learn/${next.id}` : null}
      />
    </main>
  );
}
