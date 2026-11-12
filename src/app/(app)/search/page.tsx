import Link from "next/link";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import ui from "@/components/student/ui.module.css";
import { getT } from "@/lib/i18n/server";
import { requireUser } from "@/lib/auth/guards";
import { getCourseTree, listSubjects } from "@/lib/student/progress";

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").trim();

/** Поиск по темам во всех открытых ученику предметах (на языке интерфейса). */
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await requireUser();
  const t = await getT();
  const q = ((await searchParams).q ?? "").slice(0, 80);
  const needle = norm(q);

  type Hit = { id: string; title: string; section: string; subject: string; slug: string; learned: boolean };
  const hits: Hit[] = [];
  if (needle.length >= 2) {
    const subjects = await listSubjects();
    const trees = await Promise.all(subjects.map(async (s) => ({ s, tree: await getCourseTree(s.id, user.id) })));
    for (const { s, tree } of trees) {
      for (const sec of tree) {
        for (const tp of sec.topics) {
          if (norm(tp.title).includes(needle) || norm(sec.title).includes(needle)) {
            hits.push({ id: tp.id, title: tp.title, section: sec.title, subject: s.name, slug: s.slug, learned: tp.learned });
          }
        }
      }
    }
  }
  const shown = hits.slice(0, 60);

  return (
    <main className={ui.container}>
      <Breadcrumbs items={[{ label: t("Подготовка в БИЛ"), href: "/" }, { label: t("Поиск") }]} />
      <h1 className={ui.h1}>{t("Поиск по темам")}</h1>
      <form action="/search" method="get" role="search" className={ui.searchForm}>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t("Например: дроби, проценты, уравнения")}
          aria-label={t("Поиск по темам")}
          className={ui.searchInput}
          autoFocus
          maxLength={80}
        />
        <button type="submit" className={ui.btn}>{t("Найти")}</button>
      </form>

      {needle.length > 0 && needle.length < 2 && <p className={ui.muted}>{t("Введите хотя бы 2 буквы.")}</p>}
      {needle.length >= 2 && hits.length === 0 && <p className={ui.callout}>{t("Ничего не найдено. Попробуйте другое слово.")}</p>}

      {shown.length > 0 && (
        <>
          <p className={ui.muted}>{t("Найдено тем: {n}", { n: hits.length })}</p>
          <ul className={ui.topicList}>
            {shown.map((h) => (
              <li key={h.id}>
                <div className={ui.topicRow}>
                  <span className={ui.topicTitle}>
                    {h.title}
                    <span className={ui.hitMeta}>{h.section}</span>
                  </span>
                  <span className={ui.hitLinks}>
                    <Link href={`/bil/${h.slug}/learn/${h.id}`} className={ui.hitLink}>{t("Теория")}</Link>
                    <Link href={`/bil/${h.slug}/practice/${h.id}`} className={ui.hitLink}>{t("Задачи")}</Link>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
