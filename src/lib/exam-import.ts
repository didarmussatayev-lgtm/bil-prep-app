import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

/**
 * Загрузка пробных вариантов из файлов репозитория: data/exams/<предмет>/manifest.json + картинки в public/exams/….
 * Идемпотентна: вопросы и варианты ищутся по slug и обновляются на месте (id не меняются, результаты учеников сохраняются).
 * Скрытие варианта в админке при повторной загрузке не сбрасывается.
 *
 * Формат manifest.json:
 * { "subject": "math", "papers": [ { "slug": "math-training-01", "group": "training"|"past", "number": 1, "title": "Тест 1",
 *   "titleKk": "1-тест", "year": 2025?, "timeMinutes": 120,
 *   "questions": [ { "n": 1, "answer": "C", "image": "/exams/math/t01/q01.webp", "imageKk": "/exams/math/t01/q01.kk.webp"? } ] } ] }
 */
type Manifest = {
  subject: string;
  papers: {
    slug: string; group: "training" | "past"; number: number; title: string; titleKk?: string; year?: number; timeMinutes?: number;
    questions: { n: number; answer: string; image: string; imageKk?: string }[];
  }[];
};

const LETTERS = /^[A-E]$/;

export async function importPapers() {
  const root = path.join(process.cwd(), "data", "exams");
  let dirs: string[] = [];
  try { dirs = (await fs.readdir(root, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name); } catch { /* нет папки */ }
  const report: { subject: string; papers: number; questions: number; problems: string[] }[] = [];

  for (const dir of dirs) {
    let man: Manifest;
    try { man = JSON.parse(await fs.readFile(path.join(root, dir, "manifest.json"), "utf8")); } catch { continue; }
    const subject = await prisma.subject.findUnique({ where: { slug: man.subject }, select: { id: true } });
    const problems: string[] = [];
    if (!subject) { report.push({ subject: man.subject, papers: 0, questions: 0, problems: ["Предмет не найден в базе"] }); continue; }

    // служебная скрытая тема — «дом» для вопросов вариантов (скрытые темы не попадают ни в обучение, ни в случайные тесты)
    const section = await prisma.section.findFirst({ where: { subjectId: subject.id }, orderBy: { order: "desc" }, select: { id: true } });
    if (!section) { report.push({ subject: man.subject, papers: 0, questions: 0, problems: ["В предмете нет разделов"] }); continue; }
    const container = await prisma.topic.upsert({
      where: { slug: `exam-papers-${man.subject}` },
      update: {},
      create: { slug: `exam-papers-${man.subject}`, sectionId: section.id, title: "Пробные варианты (служебная тема)", order: 9999, hidden: true, explanationContent: "" },
    });

    let questions = 0;
    for (const [pi, p] of man.papers.entries()) {
      const ids: string[] = [];
      for (const q of [...p.questions].sort((a, b) => a.n - b.n)) {
        if (!LETTERS.test(q.answer)) { problems.push(`${p.slug} №${q.n}: нет ответа A–E`); continue; }
        const slug = `exam:${p.slug}:q${q.n}`;
        const fig = (src: string) => ({ kind: "image", src, alt: `${p.title}, вопрос ${q.n}` });
        const data = {
          topicId: container.id, type: "test_choice" as const, number: String(q.n), order: q.n, question: "",
          options: ["", "", "", "", ""], correctOption: q.answer, solutionText: null,
          imageParamsJson: fig(q.image),
          i18n: q.imageKk ? { kk: { figure: fig(q.imageKk), reviewed: true } } : undefined,
        };
        const t = await prisma.task.upsert({ where: { slug }, update: data, create: { slug, ...data } });
        ids.push(t.id);
        questions += 1;
      }
      const base = {
        subjectId: subject.id, groupKey: p.group, title: p.title, year: p.year ?? null, order: p.number ?? pi + 1,
        timeLimitSeconds: p.timeMinutes ? p.timeMinutes * 60 : null, questionIds: ids,
        i18n: p.titleKk ? { kk: { title: p.titleKk } } : undefined,
      };
      await prisma.examPaper.upsert({ where: { slug: p.slug }, update: base, create: { slug: p.slug, ...base } });
    }
    report.push({ subject: man.subject, papers: man.papers.length, questions, problems });
  }
  return report;
}
