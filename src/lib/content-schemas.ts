import { randomBytes } from "crypto";
import { z } from "zod";

const answerType = z.enum(["integer", "decimal", "fraction", "mixed"]);

/** Форма эталонного ответа зависит от answerType — проверяем при сохранении задачи. */
const answerShape = {
  integer: z.object({ value: z.number().int() }),
  decimal: z.object({ value: z.number() }),
  fraction: z.object({ num: z.number().int(), denom: z.number().int().positive() }),
  mixed: z.object({ whole: z.number().int(), num: z.number().int(), denom: z.number().int().positive() }),
};

// Контент, который приходит из этой схемы (шаг 4) и из формы админки (шаг 7), кладёт
// в task.options string[] (позиция = буква A, B, C…) — так же его разбирает parseOptions()
// на стороне ученика (src/lib/content/types.ts).
const task = z
  .object({
    topicId: z.string(),
    type: z.enum(["test_choice", "open"]),
    question: z.string().min(1),
    options: z.array(z.string()).default([]),
    correctOption: z.string().nullable().optional(),
    answerType: answerType.nullable().optional(),
    correctAnswerJson: z.any().optional(),
    allowUnreduced: z.boolean().optional(),
    solutionText: z.string().default(""),
    // Один рисунок ({kind:...}) или несколько ([{kind:...}, ...]) — см. docs/content-format.md.
    imageParamsJson: z.any().optional(),
    order: z.number().int().default(0).optional(),
  })
  .superRefine((t, ctx) => {
    if (t.type === "test_choice") {
      if (t.options.length < 2) ctx.addIssue({ code: "custom", message: "Нужно минимум 2 варианта", path: ["options"] });
      if (!t.correctOption || !/^[A-E]$/.test(t.correctOption))
        ctx.addIssue({ code: "custom", message: "correctOption: A–E", path: ["correctOption"] });
    } else {
      if (!t.answerType) return ctx.addIssue({ code: "custom", message: "Укажите answerType", path: ["answerType"] });
      const r = answerShape[t.answerType].safeParse(t.correctAnswerJson);
      if (!r.success) ctx.addIssue({ code: "custom", message: `Эталон не подходит под ${t.answerType}`, path: ["correctAnswerJson"] });
    }
  });

/** slug — обязательное уникальное поле в БД (нужно для идемпотентного seed и URL /bil/:slug).
 *  В форме админки поля slug нет вовсе, поэтому при создании (POST) подставляем случайный —
 *  см. ENTITIES[...].slugPrefix и его использование в /api/admin/content/[entity]/route.ts.
 *  На редактировании (PUT) отсутствующий slug просто не участвует в update — старое значение
 *  не переписывается на случайное (см. .../[entity]/[id]/route.ts). */
export const autoSlug = (prefix: string) => `${prefix}-${randomBytes(4).toString("hex")}`;
const slugField = () => z.string().trim().min(1).optional();

type Entity = { model: string; schema: z.ZodTypeAny; filters: string[]; orderBy: object; slugPrefix?: string };

export const ENTITIES: Record<string, Entity> = {
  subjects: {
    model: "subject",
    schema: z.object({ name: z.string().min(1), slug: slugField(), order: z.number().int().default(0) }),
    filters: [],
    orderBy: { order: "asc" },
    slugPrefix: "subject",
  },
  sections: {
    model: "section",
    schema: z.object({
      subjectId: z.string(),
      title: z.string().min(1),
      slug: slugField(),
      order: z.number().int(),
    }),
    filters: ["subjectId"],
    orderBy: { order: "asc" },
    slugPrefix: "section",
  },
  topics: {
    model: "topic",
    schema: z.object({
      sectionId: z.string(),
      title: z.string().min(1),
      slug: slugField(),
      order: z.number().int(),
      // ExplanationBlock[] (JSON) ИЛИ строка Markdown — parseExplanation() на стороне ученика
      // понимает обе формы (см. src/lib/content/types.ts, docs/content-format.md).
      explanationContent: z.any().optional(),
    }),
    filters: ["sectionId"],
    orderBy: { order: "asc" },
    slugPrefix: "topic",
  },
  tasks: { model: "task", schema: task, filters: ["topicId", "type"], orderBy: [{ order: "asc" }, { id: "asc" }] },
  // Test/TestQuestion из черновика плана здесь больше не используются: начиная с шага 5
  // вопросы тестов подбираются на лету (TestAttempt.questionIds, см. src/lib/student/tests.ts).
  // Если понадобится редактируемый список тестов из админки — верните эти модели в schema.prisma
  // и добавьте сюда сущности "tests"/"testQuestions" по образцу выше.
};
