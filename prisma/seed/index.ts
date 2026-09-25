/**
 * Идемпотентный seed: можно запускать сколько угодно раз.
 * Всё ищется по slug/уникальным ключам и обновляется на месте, поэтому id задач
 * не меняются и прогресс учеников (Progress, TestAttempt) не ломается.
 *
 * Запуск: npx prisma db seed   (см. "prisma.seed" в package.json)
 */
import { Prisma, PrismaClient } from "@prisma/client";
import { ENTITIES } from "../../src/lib/content-schemas";
import { Ans, Figure, SeedTask, SeedTopic } from "./types";
import { SECTION_1 } from "./data/math/section-1";

const prisma = new PrismaClient();
const SECTIONS = [SECTION_1]; // сюда добавляются следующие разделы

const fmtAns = (a: Ans) =>
  a.t === "int" ? String(a.v)
  : a.t === "dec" ? String(a.v).replace(".", ",")
  : a.t === "frac" ? `{${a.n}/${a.d}}`
  : `{${a.w} ${a.n}/${a.d}}`;

function answerFields(a: Ans) {
  switch (a.t) {
    case "int": return { answerType: "integer", correctAnswerJson: { value: a.v } };
    case "dec": return { answerType: "decimal", correctAnswerJson: { value: a.v } };
    case "frac": return { answerType: "fraction", correctAnswerJson: { num: a.n, denom: a.d } };
    case "mixed": return { answerType: "mixed", correctAnswerJson: { whole: a.w, num: a.n, denom: a.d } };
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

const json = (v: unknown) => (v === undefined ? Prisma.JsonNull : (v as Prisma.InputJsonValue));

async function seedTopic(sectionId: string, sectionSlug: string, t: SeedTopic, order: number, report: string[]) {
  const slug = `${sectionSlug}.${t.code}`;
  const topic = await prisma.topic.upsert({
    where: { slug },
    update: { title: `${t.code} ${t.title}`, order, explanationContent: t.explanation },
    create: { slug, sectionId, title: `${t.code} ${t.title}`, order, explanationContent: t.explanation },
  });

  const all = [
    ...t.practice.map((x, i) => ({ x, purpose: "practice" as const, i })),
    ...t.test.map((x, i) => ({ x, purpose: "test" as const, i })),
  ];
  const ids = new Map<string, string>();
  for (const { x, purpose, i } of all) {
    const d = buildTask(topic.id, slug, x, purpose, i) as any;
    const fields = {
      ...d, correctAnswerJson: json(d.correctAnswerJson), imageParamsJson: json(d.imageParamsJson),
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

async function main() {
  const subject = await prisma.subject.upsert({
    where: { name: "Математика" },
    update: { slug: "math" },
    create: { name: "Математика", slug: "math", order: 0 },
  });
  const review: string[] = [];
  const pending: string[] = [];

  for (const s of SECTIONS) {
    const section = await prisma.section.upsert({
      where: { slug: s.slug },
      update: { title: s.title, order: s.order, subjectId: subject.id },
      create: { slug: s.slug, subjectId: subject.id, title: s.title, order: s.order },
    });
    console.log(`${s.title}:`);
    for (const [i, t] of s.topics.entries()) pending.push(...(await seedTopic(section.id, s.slug, t, i + 1, review)));
  }

  if (review.length) console.log(`\nПроверить вручную (${review.length}):\n` + review.map((r) => " - " + r).join("\n"));
  if (pending.length) console.log(`\nЕщё не загружено (${pending.length}):\n` + pending.map((r) => " - " + r).join("\n"));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
