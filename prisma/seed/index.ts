/**
 * Идемпотентный seed: можно запускать сколько угодно раз.
 * Всё ищется по slug/уникальным ключам и обновляется на месте, поэтому id задач
 * не меняются и прогресс учеников (Progress, TestAttempt) не ломается.
 *
 * Запуск: npx prisma db seed   (см. "prisma.seed" в package.json)
 */
import { recalcTopicCounts } from "../../src/lib/student/topic-counts";
import { spawnSync } from "node:child_process";
import { Prisma, PrismaClient } from "@prisma/client";
import { ENTITIES } from "../../src/lib/content-schemas";
import { Ans, Figure, SeedTask, SeedTopic } from "./types";
import { SECTION_1 } from "./data/math/section-1";
import { SECTION_2 } from "./data/math/section-2";
import { SECTION_3 } from "./data/math/section-3";
import { M2_SECTION_1 } from "./data/math2/section-1";
import { M2_SECTION_2 } from "./data/math2/section-2";
import { M2_SECTION_3 } from "./data/math2/section-3";
import { M3_SECTION_1 } from "./data/math3/section-1";
import { M3_SECTION_2 } from "./data/math3/section-2";
import { M4_SECTION_1 } from "./data/math4/section-1";
import { M4_SECTION_2 } from "./data/math4/section-2";
import { G5B1_CHAPTER_1 } from "./data/grade5/book-1/chapter-1";
import { G5B1_CHAPTER_2 } from "./data/grade5/book-1/chapter-2";
import { G5B1_CHAPTER_3 } from "./data/grade5/book-1/chapter-3";
import { G5_CHAPTER_6 } from "./data/grade5/book-2/chapter-6";
import { G5_CHAPTER_4 } from "./data/grade5/book-2/chapter-4";
import { G5_CHAPTER_5 } from "./data/grade5/book-2/chapter-5";
import { LOGIC_SECTION_1 } from "./data/logic/section-1";
import { LOGIC_SECTION_2 } from "./data/logic/section-2b";
import { LOGIC_SECTION_3 } from "./data/logic/section-3";
import { NIS_BOOK_1 } from "./data/nis/book-1";
import { KK_SECTIONS, KK_SUBJECTS, KK_TOPICS } from "./data/kk";

const prisma = new PrismaClient();

const ALL_SUBJECTS = [
  { name: "Математика", slug: "math", order: 0, sections: [SECTION_1, SECTION_2, SECTION_3, M2_SECTION_1, M2_SECTION_2, M2_SECTION_3, M3_SECTION_1, M3_SECTION_2, M4_SECTION_1, M4_SECTION_2] },
  { name: "Логика", slug: "logic", order: 1, sections: [LOGIC_SECTION_1, LOGIC_SECTION_2, LOGIC_SECTION_3] },
  { name: "5 класс", slug: "grade5", order: 2, sections: [G5B1_CHAPTER_1, G5B1_CHAPTER_2, G5B1_CHAPTER_3, G5_CHAPTER_4, G5_CHAPTER_5, G5_CHAPTER_6] },
  { name: "Естествознание", slug: "nis-science", order: 3, sections: [NIS_BOOK_1] },
];

/** SEED_ONLY="grade5,logic" — загрузить только эти предметы (по slug); пусто = все. Нужен автозапуску из GitHub Actions. */
const ONLY = (process.env.SEED_ONLY ?? "").split(",").map((x) => x.trim()).filter(Boolean);
const SUBJECTS = ONLY.length ? ALL_SUBJECTS.filter((x) => ONLY.includes(x.slug)) : ALL_SUBJECTS;

const fmtAns = (a: Ans) =>
  a.t === "int" ? String(a.v)
  : a.t === "dec" ? String(a.v).replace(".", ",")
  : a.t === "frac" ? `{${a.n}/${a.d}}`
  : a.t === "mixed" ? `{${a.w} ${a.n}/${a.d}}`
  : a.t === "seq" ? a.items.join(", ")
  : a.t === "set" ? a.items.join("; ")
  : a.s;

function answerFields(a: Ans) {
  switch (a.t) {
    case "int": return { answerType: "integer", correctAnswerJson: { value: a.v } };
    case "dec": return { answerType: "decimal", correctAnswerJson: { value: a.v } };
    case "frac": return { answerType: "fraction", correctAnswerJson: { num: a.n, denom: a.d } };
    case "mixed": return { answerType: "mixed", correctAnswerJson: { whole: a.w, num: a.n, denom: a.d } };
    case "seq": return { answerType: "sequence", correctAnswerJson: { items: a.items } };
    case "set": return { answerType: "set", correctAnswerJson: { items: a.items } };
    case "text": return { answerType: "text", correctAnswerJson: { text: a.s } };
  }
}

function buildTask(topicId: string, topicSlug: string, t: SeedTask, purpose: "practice" | "test", order: number) {
  const figures: Figure[] | undefined = t.figure ? (Array.isArray(t.figure) ? t.figure : [t.figure]) : undefined;
  const base = {
    topicId,
    slug: `${topicSlug}:${purpose === "test" ? "t" : "p"}:${t.n}`,
    number: t.n,
    order,
    // "purpose" используется только здесь, в slug и в отчёте seed-скрипта — Task.purpose
    // в модели нет (не используется нигде на стороне ученика, см. step5-README): не пишем в БД.
    question: t.q,
    imageParamsJson: figures ?? undefined,
  };
  let data: Record<string, unknown>;
  if (t.choice) {
    data = {
      ...base, type: "test_choice", options: t.choice.options, correctOption: t.choice.correct,
      answerType: null, correctAnswerJson: undefined, solutionText: t.solution ?? "",
    };
  } else if (t.ans) {
    data = {
      ...base, type: "open", options: [], correctOption: null, ...answerFields(t.ans),
      solutionText: t.solution ?? `Ответ: ${fmtAns(t.ans)}`,
    };
  } else {
    throw new Error(`${base.slug}: нужен ans или choice`);
  }
  // Проверяем той же схемой, что и админка (форма эталона, варианты A–E и т.д.)
  const check = ENTITIES.tasks.schema.safeParse(data);
  if (!check.success) throw new Error(`${base.slug}: ${JSON.stringify(check.error.flatten())}`);
  return data;
}

/** Казахский перевод пишем с пометкой reviewed:false — пока носитель не проверит. null = перевода нет. */
const kkBag = (fields: Record<string, unknown> | undefined) =>
  fields ? ({ kk: { ...fields, reviewed: false } } as Prisma.InputJsonValue) : Prisma.JsonNull;

const json = (v: unknown) => (v === undefined ? Prisma.JsonNull : (v as Prisma.InputJsonValue));

async function seedTopic(sectionId: string, sectionSlug: string, t: SeedTopic, order: number, report: string[]) {
  const slug = `${sectionSlug}.${t.code}`;
  const kk = KK_TOPICS[slug];
  const topicI18n = kkBag(kk && { title: `${t.code} ${kk.title}`, ...(kk.explanation ? { explanation: kk.explanation } : {}) });
  const topic = await prisma.topic.upsert({
    where: { slug },
    update: { title: `${t.code} ${t.title}`, order, explanationContent: t.explanation, i18n: topicI18n },
    create: { slug, sectionId, title: `${t.code} ${t.title}`, order, explanationContent: t.explanation, i18n: topicI18n },
  });

  const all = [
    ...t.practice.map((x, i) => ({ x, purpose: "practice" as const, i })),
    ...t.test.map((x, i) => ({ x, purpose: "test" as const, i })),
  ];
  const ids = new Map<string, string>();
  for (const { x, purpose, i } of all) {
    const d = buildTask(topic.id, slug, x, purpose, i) as any;
    const kt = kk?.tasks?.[`${purpose === "test" ? "t" : "p"}:${x.n}`];
    const fields = {
      ...d, correctAnswerJson: json(d.correctAnswerJson), imageParamsJson: json(d.imageParamsJson),
      i18n: kkBag(kt && { question: kt.question, ...(kt.options ? { options: kt.options } : {}), ...(kt.solution ? { solution: kt.solution } : {}), ...(kt.figure ? { figure: kt.figure } : {}) }),
    };
    const { slug: taskSlug, ...rest } = fields;
    const task = await prisma.task.upsert({ where: { slug: taskSlug }, update: rest, create: { slug: taskSlug, ...rest } });
    ids.set(`${purpose}:${x.n}`, task.id);
    if (x.review) report.push(`[${t.code} ${purpose === "test" ? "тест" : "задача"} №${x.n}] ${x.review}`);
  }

  // Пул вопросов теста по теме собирается на лету из type="test_choice" (см. src/lib/student/tests.ts) —
  // отдельная модель Test/TestQuestion, которая была в черновике, начиная с шага 5 не используется.

  const placeholders = all.filter(({ x }) => {
    const f = x.figure ? (Array.isArray(x.figure) ? x.figure : [x.figure]) : [];
    return f.some((g) => g.kind === "placeholder");
  }).length;
  console.log(`  ${t.code} ${t.title}: задач ${t.practice.length}, вопросов теста ${t.test.length}, ждут рисунка ${placeholders}, не загружено ${t.pending.length}`);
  return t.pending.map((p) => `[${t.code}] стр. ${p.page}, №${p.n}: ${p.why}`);
}

/** Приводит схему БД в соответствие с schema.prisma (безопасно: только добавляет таблицы/колонки). Без этого новый деплой падает на «column does not exist». */
function syncSchema() {
  if (process.env.SEED_SKIP_DB_PUSH === "1") return;
  const r = spawnSync("npx", ["prisma", "db", "push", "--skip-generate"], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("prisma db push не выполнился — seed остановлен");
}

async function main() {
  syncSchema();
  const review: string[] = [];
  const pending: string[] = [];

  for (const subjectDef of SUBJECTS) {
    const subject = await prisma.subject.upsert({
      where: { name: subjectDef.name },
      update: { slug: subjectDef.slug, order: subjectDef.order, i18n: kkBag(KK_SUBJECTS[subjectDef.slug]) },
      create: { name: subjectDef.name, slug: subjectDef.slug, order: subjectDef.order, i18n: kkBag(KK_SUBJECTS[subjectDef.slug]) },
    });
    console.log(`\n=== ${subjectDef.name} ===`);
    for (const s of subjectDef.sections) {
      const section = await prisma.section.upsert({
        where: { slug: s.slug },
        update: { title: s.title, order: s.order, level: (s as { level?: number }).level ?? 1, subjectId: subject.id, i18n: kkBag(KK_SECTIONS[s.slug]) },
        create: { slug: s.slug, subjectId: subject.id, title: s.title, order: s.order, level: (s as { level?: number }).level ?? 1, i18n: kkBag(KK_SECTIONS[s.slug]) },
      });
      console.log(`${s.title}:`);
      for (const [i, t] of s.topics.entries()) pending.push(...(await seedTopic(section.id, s.slug, t, i + 1, review)));
    }
  }

  if (review.length) console.log(`\nПроверить вручную (${review.length}):\n` + review.map((r) => " - " + r).join("\n"));
  if (pending.length) console.log(`\nЕщё не загружено (${pending.length}):\n` + pending.map((r) => " - " + r).join("\n"));
}

main().then(() => recalcTopicCounts()).catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
