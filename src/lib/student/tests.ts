import "server-only";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/auth/guards";
import { onTestFinished } from "@/lib/gamification/engine";
import { getAccess, sectionFilter } from "@/lib/student/access";
import { hasPendingFigure, parseFigures, parseOptions } from "@/lib/content/types";

export type TestScope = "topic" | "section" | "full"; // + "paper" — отдельно (startPaperAttempt)

// Параметры тестов. Значения ориентировочные — подстройте под реальный формат экзамена БИЛ.
export const TEST_CONFIG: Record<TestScope, { questions: number; timeLimitSeconds: number | null }> = {
  topic: { questions: 10, timeLimitSeconds: null },
  section: { questions: 20, timeLimitSeconds: null }, // без таймера; для «мягкого» — задайте секунды
  full: { questions: 40, timeLimitSeconds: 60 * 60 },
};

/** Тема считается «слабым местом», если верных ответов меньше этого процента. */
export const WEAK_THRESHOLD_PERCENT = 60;

/** Запас на сетевые задержки после дедлайна. */
const ANSWER_GRACE_MS = 5000;

export type BreakdownRow = { topicId: string; title: string; correct: number; total: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Случайная выборка, равномерно по темам (по кругу), чтобы разбивка по темам была осмысленной. */
function pickBalanced(pool: { id: string; topicId: string }[], n: number): string[] {
  const byTopic = new Map<string, string[]>();
  for (const t of pool) byTopic.set(t.topicId, [...(byTopic.get(t.topicId) ?? []), t.id]);
  const queues = shuffle([...byTopic.values()].map(shuffle));

  const picked: string[] = [];
  while (picked.length < n && queues.some((q) => q.length > 0)) {
    for (const q of queues) {
      const id = q.pop();
      if (id) picked.push(id);
      if (picked.length >= n) break;
    }
  }
  return shuffle(picked);
}

/** Доступен ли ученику вариант предмета: админу и ученикам без ограничений — всегда, иначе нужна хотя бы одна открытая книга предмета. */
export async function canOpenPapers(userId: string, subjectId: string) {
  const a = await getAccess(userId);
  return !a.restricted || a.books.some((b) => b.subjectId === subjectId);
}

/** Пробный вариант: вопросы и их порядок фиксированы. mode "exam" — с таймером варианта, "practice" — без. */
export async function startPaperAttempt(
  userId: string,
  input: { subjectSlug: string; paperId: string; mode: "exam" | "practice" },
) {
  const subject = await prisma.subject.findUnique({ where: { slug: input.subjectSlug }, select: { id: true } });
  if (!subject) throw new ApiError(404, "Предмет не найден");
  const paper = await prisma.examPaper.findFirst({ where: { id: input.paperId, subjectId: subject.id, hidden: false } });
  if (!paper || !(await canOpenPapers(userId, subject.id))) throw new ApiError(404, "Вариант не найден");
  const questionIds = paper.questionIds as string[];
  if (questionIds.length === 0) throw new ApiError(400, "В этом варианте пока нет вопросов", "NO_QUESTIONS");

  const limit = input.mode === "exam" ? paper.timeLimitSeconds : null;
  return prisma.testAttempt.create({
    data: {
      userId,
      subjectId: subject.id,
      scope: "paper",
      paperId: paper.id,
      questionIds,
      total: questionIds.length,
      deadlineAt: limit ? new Date(Date.now() + limit * 1000) : null,
    },
    select: { id: true },
  });
}

export async function startAttempt(
  userId: string,
  input: { subjectSlug: string; scope: TestScope; sectionId?: string; topicId?: string },
) {
  const subject = await prisma.subject.findUnique({ where: { slug: input.subjectSlug }, select: { id: true } });
  if (!subject) throw new ApiError(404, "Предмет не найден");
  const access = await sectionFilter(userId); // закрытые книги в тесты не попадают

  let topicIds: string[] = [];
  let sectionId: string | null = null;
  let topicId: string | null = null;

  if (input.scope === "topic") {
    const topic = await prisma.topic.findFirst({
      where: { id: input.topicId ?? "", hidden: false, section: { subjectId: subject.id, ...access } },
      select: { id: true },
    });
    if (!topic) throw new ApiError(404, "Тема не найдена");
    topicId = topic.id;
    topicIds = [topic.id];
  } else if (input.scope === "section") {
    const section = await prisma.section.findFirst({
      where: { id: input.sectionId ?? "", subjectId: subject.id, ...access },
      select: { id: true, topics: { where: { hidden: false }, select: { id: true } } },
    });
    if (!section) throw new ApiError(404, "Раздел не найден");
    sectionId = section.id;
    topicIds = section.topics.map((t) => t.id);
  } else {
    // сборный тест — только из тем, которые ученик уже прошёл
    const learned = await prisma.progress.findMany({
      where: { userId, learnedAt: { not: null }, topic: { hidden: false, section: { subjectId: subject.id, ...access } } },
      select: { topicId: true },
    });
    if (learned.length === 0) {
      throw new ApiError(400, "Сначала изучите хотя бы одну тему", "NO_LEARNED_TOPICS");
    }
    topicIds = learned.map((p) => p.topicId);
  }

  // Вопросы с ещё не готовым рисунком (kind="placeholder") в тест не попадают.
  const poolRows = await prisma.task.findMany({
    where: { topicId: { in: topicIds }, type: "test_choice", hidden: false },
    select: { id: true, topicId: true, imageParamsJson: true },
  });
  const pool = poolRows.filter((t) => !hasPendingFigure(parseFigures(t.imageParamsJson)));
  if (pool.length === 0) throw new ApiError(400, "В этой области пока нет тестовых вопросов", "NO_QUESTIONS");

  const cfg = TEST_CONFIG[input.scope];
  const questionIds = pickBalanced(pool, cfg.questions);

  return prisma.testAttempt.create({
    data: {
      userId,
      subjectId: subject.id,
      scope: input.scope,
      sectionId,
      topicId,
      questionIds,
      total: questionIds.length,
      deadlineAt: cfg.timeLimitSeconds ? new Date(Date.now() + cfg.timeLimitSeconds * 1000) : null,
    },
    select: { id: true },
  });
}

/** Сохраняет ВСЕ текущие ответы попытки (клиент шлёт полную карту — устойчиво к гонкам). */
export async function saveAnswers(userId: string, attemptId: string, incoming: unknown) {
  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
    throw new ApiError(400, "Неверный формат ответов");
  }
  const attempt = await prisma.testAttempt.findFirst({ where: { id: attemptId, userId } });
  if (!attempt) throw new ApiError(404, "Попытка не найдена");
  if (attempt.finishedAt) throw new ApiError(409, "Тест уже завершён", "FINISHED");
  if (attempt.deadlineAt && Date.now() > attempt.deadlineAt.getTime() + ANSWER_GRACE_MS) {
    throw new ApiError(409, "Время теста вышло", "CLOSED");
  }

  const ids = attempt.questionIds as string[];
  const tasks = await prisma.task.findMany({ where: { id: { in: ids } }, select: { id: true, options: true } });
  const optionKeys = new Map(tasks.map((t) => [t.id, new Set(parseOptions(t.options).map((o) => o.key))]));

  const clean: Record<string, string> = {};
  for (const [taskId, key] of Object.entries(incoming as Record<string, unknown>)) {
    if (typeof key === "string" && optionKeys.get(taskId)?.has(key)) clean[taskId] = key;
  }

  await prisma.testAttempt.updateMany({
    where: { id: attempt.id, finishedAt: null },
    data: { answers: clean },
  });
}

/** Завершает попытку и считает результат. Идемпотентна. Возвращает актуальную попытку. */
export async function finishAttempt(userId: string, attemptId: string) {
  const attempt = await prisma.testAttempt.findFirst({ where: { id: attemptId, userId } });
  if (!attempt) throw new ApiError(404, "Попытка не найдена");
  if (attempt.finishedAt) return attempt;

  const ids = attempt.questionIds as string[];
  const answers = (attempt.answers ?? {}) as Record<string, string>;
  const tasks = await prisma.task.findMany({
    where: { id: { in: ids } },
    select: { id: true, correctOption: true, topic: { select: { id: true, title: true } } },
  });
  const byId = new Map(tasks.map((t) => [t.id, t]));

  let correct = 0;
  let total = 0;
  const perTopic = new Map<string, BreakdownRow>();
  for (const id of ids) {
    const t = byId.get(id);
    if (!t) continue;
    total += 1;
    const ok = !!t.correctOption && answers[id] === t.correctOption;
    if (ok) correct += 1;
    const row = perTopic.get(t.topic.id) ?? { topicId: t.topic.id, title: t.topic.title, correct: 0, total: 0 };
    row.total += 1;
    if (ok) row.correct += 1;
    perTopic.set(t.topic.id, row);
  }
  // у пробного варианта все вопросы лежат в служебной теме — разбивка по темам не нужна и испортила бы отчёты
  const breakdown = attempt.scope === "paper" ? [] : [...perTopic.values()];
  const now = new Date();

  const [finished] = await prisma.$transaction([
    prisma.testAttempt.updateMany({
      where: { id: attempt.id, finishedAt: null },
      data: { finishedAt: now, score: correct, total, breakdown },
    }),
    prisma.progress.updateMany({
      where: { userId, topicId: { in: breakdown.map((b) => b.topicId) } },
      data: { lastAttemptAt: now },
    }),
  ]);

  // XP за тест — один раз (уникальность в XpEvent); только если именно этот вызов завершил попытку
  if (finished.count > 0) {
    try { await onTestFinished(userId, attempt.id, correct, total); } catch (e) { console.error("[gamification] test", e); }
  }

  return prisma.testAttempt.findUniqueOrThrow({ where: { id: attempt.id } });
}
