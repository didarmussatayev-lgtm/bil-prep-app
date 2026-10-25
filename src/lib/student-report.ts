import path from "node:path";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { getLastActive } from "@/lib/admin-students";
import { weakTopics } from "@/lib/admin-reports";
import { bookKey, getAccess, listBooks } from "@/lib/student/access";
import { getProgressForUsers } from "@/lib/student/progress";
import { WEAK_THRESHOLD_PERCENT } from "@/lib/student/tests";

const FONT = (f: string) => path.join(process.cwd(), "assets", "fonts", f);
const SCOPE: Record<string, string> = { topic: "по теме", section: "по разделу", full: "сборный" };
const date = (d: Date) => d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

/** Собирает отчёт по ученику и рисует PDF. notes=true — добавить заметки администратора (для внутреннего пользования). */
export async function renderStudentReport(userId: string, opts: { notes: boolean }): Promise<{ login: string; pdf: Buffer } | null> {
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
      where: { userId }, select: { status: true, task: { select: { topic: { select: { title: true } } } } },
    }),
    opts.notes ? prisma.studentNote.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { text: true, createdAt: true } }) : Promise.resolve([]),
  ]);
  const sum = progress.get(userId);
  const bookNames = access.restricted
    ? books.filter((b) => access.books.some((x) => bookKey(x) === b.key)).map((b) => b.title).join(", ") || "нет открытых книг"
    : "все книги";
  const openHelp = helps.filter((h) => h.status === "open");
  const helpTopics = [...new Set(openHelp.map((h) => h.task.topic.title))];

  const doc = new PDFDocument({ size: "A4", margin: 48, info: { Title: `Отчёт: ${user.login}` } });
  doc.registerFont("r", FONT("DejaVuSans.ttf"));
  doc.registerFont("b", FONT("DejaVuSans-Bold.ttf"));
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  const W = doc.page.width - 96;
  const h2 = (t: string) => { doc.moveDown(0.9).font("b").fontSize(13).fillColor("#1c2733").text(t).moveDown(0.3).font("r").fontSize(10.5).fillColor("#222"); };
  const line = (t: string) => doc.font("r").fontSize(10.5).fillColor("#222").text(t, { width: W });

  doc.font("b").fontSize(20).fillColor("#1c2733").text("Отчёт об ученике");
  doc.font("r").fontSize(11).fillColor("#5d6b7a").text(`${user.login} · составлен ${date(new Date())}`);

  h2("Общий прогресс");
  const pct = sum?.percent ?? 0;
  doc.rect(48, doc.y + 2, W, 10).fill("#e3e6ef");
  doc.rect(48, doc.y + 2, (W * pct) / 100, 10).fill("#1f5fbf");
  doc.y += 18;
  doc.fillColor("#222");
  line(`Пройдено курса: ${pct}%`);
  if (sum) line(`Изучено тем: ${sum.learned} из ${sum.topics} · решено задач закрепления: ${sum.solved} из ${sum.tasks}`);
  line(`Открыто: ${bookNames}`);
  line(`Последняя активность: ${active.get(userId) ? date(active.get(userId)!) : "ещё не занимался"} · в системе с ${date(user.createdAt)}`);

  h2("Тесты (последние 10)");
  if (!attempts.length) line("Тестов ещё не было.");
  for (const a of attempts) {
    const p = a.total ? Math.round(((a.score ?? 0) / a.total) * 100) : 0;
    line(`${date(a.finishedAt!)}  ·  ${SCOPE[a.scope] ?? a.scope}  ·  ${a.score ?? 0} из ${a.total}  (${p}%)`);
  }
  if (attempts.length) {
    const avg = Math.round(attempts.reduce((n, a) => n + (a.total ? ((a.score ?? 0) / a.total) * 100 : 0), 0) / attempts.length);
    doc.moveDown(0.3).font("b").text(`Средний результат: ${avg}%`).font("r");
  }

  h2(`Слабые места (верных ответов меньше ${WEAK_THRESHOLD_PERCENT}%)`);
  if (!weak.length) line("Слабых тем не выявлено (или данных пока мало).");
  for (const w of weak.slice(0, 12)) line(`•  ${w.title} — ${w.percent}%${w.testT ? `, тесты ${w.testC}/${w.testT}` : ""}${w.prA ? `, задачи ${w.prS}/${w.prA}` : ""}`);

  h2("Просил разобрать («Не смог решить»)");
  if (!helps.length) line("Заявок не было.");
  else {
    line(`Всего заявок: ${helps.length}, ждут разбора: ${openHelp.length}.`);
    if (helpTopics.length) line(`Темы, по которым ждут разбора: ${helpTopics.slice(0, 10).join("; ")}.`);
  }

  if (opts.notes) {
    h2("Заметки преподавателя");
    if (!notes.length) line("Заметок нет.");
    for (const n of notes) {
      doc.font("b").fontSize(9.5).fillColor("#5d6b7a").text(date(n.createdAt));
      doc.font("r").fontSize(10.5).fillColor("#222").text(n.text, { width: W }).moveDown(0.5);
    }
  }
  doc.end();
  return { login: user.login, pdf: await done };
}
