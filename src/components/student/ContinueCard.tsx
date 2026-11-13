import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n/server";
import { getAccess } from "@/lib/student/access";
import { pick } from "@/lib/i18n/content";
import { getLang } from "@/lib/i18n/server";
import styles from "./gami.module.css";
import ui from "./ui.module.css";

/** Главная кнопка «Продолжить»: незавершённый тест → последняя тема в закреплении → первая неизученная тема. */
export async function ContinueCard({ userId }: { userId: string }) {
  const [t, lang] = [await getT(), await getLang()];
  const now = new Date();
  const access = await getAccess(userId);
  if (access.restricted && access.books.length === 0) return null; // доступ закрыт — вести некуда

  const open = await prisma.testAttempt.findFirst({
    where: { userId, finishedAt: null, OR: [{ deadlineAt: null }, { deadlineAt: { gt: now } }] },
    orderBy: { startedAt: "desc" },
    include: { subject: { select: { slug: true, name: true } } },
  });
  if (open) {
    return (
      <Card
        title={t("Продолжить тест")}
        text={`${open.subject.name} · ${Object.keys((open.answers as Record<string, unknown>) ?? {}).length} / ${open.total}`}
        href={`/bil/${open.subject.slug}/test/${open.id}`}
        cta={t("Продолжить")}
      />
    );
  }

  const topicSel = { select: { id: true, title: true, i18n: true, section: { select: { subject: { select: { slug: true } } } } } } as const;
  const last = await prisma.taskAttempt.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, select: { topicId: true } });
  const tp = last ? await prisma.topic.findUnique({ where: { id: last.topicId }, ...topicSel }) : null;
  if (tp) {
    return (
      <Card
        title={t("Продолжить с места остановки")}
        text={pick(tp.i18n, lang, "title", tp.title)}
        href={`/bil/${tp.section.subject.slug}/practice/${tp.id}`}
        cta={t("Продолжить")}
      />
    );
  }

  const learned = await prisma.progress.findMany({ where: { userId, learnedAt: { not: null } }, select: { topicId: true } });
  const next = await prisma.topic.findFirst({
    where: { hidden: false, id: { notIn: learned.map((l) => l.topicId) }, section: { subject: { slug: "math" } } },
    orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
    select: topicSel.select,
  });
  if (!next) return null;
  return (
    <Card
      title={t("Начните с первой темы")}
      text={pick(next.i18n, lang, "title", next.title)}
      href={`/bil/${next.section.subject.slug}/learn/${next.id}`}
      cta={t("Начать")}
    />
  );
}

function Card({ title, text, href, cta }: { title: string; text: string; href: string; cta: string }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <p className={styles.heroKicker}>{title}</p>
        <p className={styles.heroTitle}>{text}</p>
      </div>
      <Link href={href} className={ui.btnHero}>{cta}</Link>
    </section>
  );
}
