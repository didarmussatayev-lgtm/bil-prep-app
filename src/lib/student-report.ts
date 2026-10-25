import path from "node:path";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { getLastActive } from "@/lib/admin-students";
import { weakTopics } from "@/lib/admin-reports";
import { bookKey, getAccess, listBooks } from "@/lib/student/access";
import { getProgressForUsers } from "@/lib/student/progress";
import { WEAK_THRESHOLD_PERCENT } from "@/lib/student/tests";
import { pick } from "@/lib/i18n/content";
import type { Lang } from "@/lib/i18n/config";
import { KK } from "@/lib/i18n/kk";

const FONT = (f: string) => path.join(process.cwd(), "assets", "fonts", f);

// Подписи отчёта. Казахский — рабочий перевод, ждёт вычитки носителем (как и остальные kk-тексты проекта).
const L = {
  ru: {
    title: "Отчёт об ученике", made: "составлен", progress: "Общий прогресс", course: "Пройдено курса", counts: (a: number, b: number, c: number, d: number) => `Изучено тем: ${a} из ${b} · решено задач закрепления: ${c} из ${d}`,
    open: "Открыто", allBooks: "все книги", noBooks: "нет открытых книг", last: "Последняя активность", never: "ещё не занимался", since: "в системе с",
    tests: "Тесты (последние 10)", noTests: "Тестов ещё не было.", of: "из", avg: "Средний результат",
    scope: { topic: "по теме", section: "по разделу", full: "сборный" } as Record<string, string>,
    weak: (n: number) => `Слабые места (верных ответов меньше ${n}%)`, noWeak: "Слабых тем не выявлено (или данных пока мало).", testsW: "тесты", tasksW: "задачи",
    help: "Просил разобрать («Не смог решить»)", noHelp: "Заявок не было.", helpTotal: (n: number, m: number) => `Всего заявок: ${n}, ждут разбора: ${m}.`, helpTopics: "Темы, по которым ждут разбора",
    notes: "Заметки преподавателя", noNotes: "Заметок нет.", locale: "ru-RU", file: "report", titleMeta: "Отчёт",
  },
  kk: {
    title: "Оқушы туралы есеп", made: "жасалған күні", progress: "Жалпы үлгерім", course: "Курс өтілді", counts: (a: number, b: number, c: number, d: number) => `Оқылған тақырып: ${b}-дан ${a} · шығарылған бекіту есебі: ${d}-дан ${c}`,
    open: "Ашық", allBooks: "барлық кітаптар", noBooks: "ашық кітап жоқ", last: "Соңғы белсенділік", never: "әлі шұғылданған жоқ", since: "жүйеде тіркелген күні",
    tests: "Тесттер (соңғы 10)", noTests: "Тест әлі болған жоқ.", of: "/", avg: "Орташа нәтиже",
    scope: { topic: "тақырып бойынша", section: "бөлім бойынша", full: "жинақы" } as Record<string, string>,
    weak: (n: number) => `Әлсіз тұстар (дұрыс жауап ${n}%-дан аз)`, noWeak: "Әлсіз тақырып анықталған жоқ (немесе деректер әлі аз).", testsW: "тесттер", tasksW: "есептер",
    help: "Талдауға сұраған («Шеше алмадым»)", noHelp: "Өтініш болған жоқ.", helpTotal: (n: number, m: number) => `Барлығы өтініш: ${n}, талдауды күтіп тұр: ${m}.`, helpTopics: "Талдау күтілетін тақырыптар",
    notes: "Мұғалімнің жазбалары", noNotes: "Жазбалар жоқ.", locale: "kk-KZ", file: "esep", titleMeta: "Есеп",
  },
} as const;

/** Собирает отчёт по ученику и рисует PDF. notes=true — добавить заметки администратора (для внутреннего пользования). */
export async function renderStudentReport(userId: string, opts: { notes: boolean; lang?: Lang }): Promise<{ login: string; pdf: Buffer; filePrefix: string } | null> {
  const lang: Lang = opts.lang ?? "ru";
  const T = L[lang];
  const date = (d: Date) => d.toLocaleDateString(T.locale, { day: "2-digit", month: "2-digit", year: "numeric" });
  const user = await prisma.user.findFirst({ where: { id: userId, role: "student" }, select: { id: true, login: true, createdAt: true } });
  if (!user) return null;

  const [progress, active, access, books, attempts, weak, helps, notes] = await Promise.all([
    getProgressForUsers([userId]),
    getLastActive([userId]),
    getAccess(userId),
    listBooks(),
    prisma.testAttempt.findMany({
      where: { userId, finishedAt: { not: null } }, orderBy: { finishedAt: "desc" }, take: 10,
      select: { scope: true, score: true, total: true, finishedAt: true },
    }),
    weakTopics({ userId }),
    prisma.helpRequest.findMany({
      where: { userId }, select: { status: true, task: { select: { topic: { select: { id: true, title: true, i18n: true } } } } },
    }),
    opts.notes ? prisma.studentNote.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { text: true, createdAt: true } }) : Promise.resolve([]),
  ]);
  const sum = progress.get(userId);
  // названия тем на выбранном языке (если есть перевод)
  const topicRows = await prisma.topic.findMany({
    where: { OR: [{ id: { in: weak.map((w) => w.topicId) } }, { tasks: { some: { helpRequests: { some: { userId } } } } }] },
    select: { id: true, title: true, i18n: true },
  });
  const topicTitle = new Map(topicRows.map((t) => [t.id, pick(t.i18n, lang, "title", t.title)]));
  const bookNames = access.restricted
    ? books.filter((b) => access.books.some((x) => bookKey(x) === b.key)).map((b) => (lang === "kk" ? KK[b.title] ?? b.title : b.title)).join(", ") || T.noBooks
    : T.allBooks;
  const openHelp = helps.filter((h) => h.status === "open");
  const helpTopics = [...new Set(openHelp.map((h) => pick(h.task.topic.i18n, lang, "title", h.task.topic.title)))];

  const doc = new PDFDocument({ size: "A4", margin: 48, info: { Title: `${T.titleMeta}: ${user.login}` } });
  doc.registerFont("r", FONT("DejaVuSans.ttf"));
  doc.registerFont("b", FONT("DejaVuSans-Bold.ttf"));
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  const W = doc.page.width - 96;
  const h2 = (t: string) => { doc.moveDown(0.9).font("b").fontSize(13).fillColor("#1c2733").text(t).moveDown(0.3).font("r").fontSize(10.5).fillColor("#222"); };
  const line = (t: string) => doc.font("r").fontSize(10.5).fillColor("#222").text(t, { width: W });

  doc.font("b").fontSize(20).fillColor("#1c2733").text(T.title);
  doc.font("r").fontSize(11).fillColor("#5d6b7a").text(`${user.login} · ${T.made} ${date(new Date())}`);

  h2(T.progress);
  const pct = sum?.percent ?? 0;
  doc.rect(48, doc.y + 2, W, 10).fill("#e3e6ef");
  doc.rect(48, doc.y + 2, (W * pct) / 100, 10).fill("#1f5fbf");
  doc.y += 18;
  doc.fillColor("#222");
  line(`${T.course}: ${pct}%`);
  if (sum) line(T.counts(sum.learned, sum.topics, sum.solved, sum.tasks));
  line(`${T.open}: ${bookNames}`);
  line(`${T.last}: ${active.get(userId) ? date(active.get(userId)!) : T.never} · ${T.since} ${date(user.createdAt)}`);

  h2(T.tests);
  if (!attempts.length) line(T.noTests);
  for (const a of attempts) {
    const p = a.total ? Math.round(((a.score ?? 0) / a.total) * 100) : 0;
    line(`${date(a.finishedAt!)}  ·  ${T.scope[a.scope] ?? a.scope}  ·  ${a.score ?? 0} ${T.of} ${a.total}  (${p}%)`);
  }
  if (attempts.length) {
    const avg = Math.round(attempts.reduce((n, a) => n + (a.total ? ((a.score ?? 0) / a.total) * 100 : 0), 0) / attempts.length);
    doc.moveDown(0.3).font("b").text(`${T.avg}: ${avg}%`).font("r");
  }

  h2(T.weak(WEAK_THRESHOLD_PERCENT));
  if (!weak.length) line(T.noWeak);
  for (const w of weak.slice(0, 12)) line(`•  ${topicTitle.get(w.topicId) ?? w.title} — ${w.percent}%${w.testT ? `, ${T.testsW} ${w.testC}/${w.testT}` : ""}${w.prA ? `, ${T.tasksW} ${w.prS}/${w.prA}` : ""}`);

  h2(T.help);
  if (!helps.length) line(T.noHelp);
  else {
    line(T.helpTotal(helps.length, openHelp.length));
    if (helpTopics.length) line(`${T.helpTopics}: ${helpTopics.slice(0, 10).join("; ")}.`);
  }

  if (opts.notes) {
    h2(T.notes);
    if (!notes.length) line(T.noNotes);
    for (const n of notes) {
      doc.font("b").fontSize(9.5).fillColor("#5d6b7a").text(date(n.createdAt));
      doc.font("r").fontSize(10.5).fillColor("#222").text(n.text, { width: W }).moveDown(0.5);
    }
  }
  doc.end();
  return { login: user.login, pdf: await done, filePrefix: T.file };
}
