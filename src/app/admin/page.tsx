import Link from "next/link";
import { TelegramStatus } from "@/components/admin/TelegramStatus";
import { prisma } from "@/lib/prisma";
import { INACTIVE_DAYS, isInactive, loadStudents } from "@/lib/admin-students";

export const dynamic = "force-dynamic";

const plain = (q: string) => q.replace(/\{([^{}]*)\}/g, "$1").slice(0, 90);
const ago = (d: Date | null) => {
  if (!d) return "не заходил";
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  return days <= 0 ? "сегодня" : days === 1 ? "вчера" : `${days} дн. назад`;
};
const when = (d: Date) => d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

/** «Сегодня»: что требует внимания прямо сейчас. */
export default async function TodayPage() {
  const [students, helpCount, helps, tests] = await Promise.all([
    loadStudents(),
    prisma.helpRequest.count({ where: { status: "open" } }),
    prisma.helpRequest.findMany({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, createdAt: true, user: { select: { id: true, login: true } }, task: { select: { number: true, question: true, topic: { select: { title: true } } } } },
    }),
    prisma.testAttempt.findMany({
      where: { finishedAt: { not: null }, user: { role: "student" } },
      orderBy: { finishedAt: "desc" },
      take: 8,
      select: { id: true, scope: true, score: true, total: true, finishedAt: true, user: { select: { id: true, login: true } } },
    }),
  ]);

  const now = Date.now();
  const inactive = students.filter((s) => isInactive(s, now)).sort((a, b) => (a.lastActiveAt?.getTime() ?? 0) - (b.lastActiveAt?.getTime() ?? 0));
  const shared = students.filter((s) => s.shared);
  const slowing = students.filter((s) => s.slowing);
  const activeWeek = students.filter((s) => s.lastActiveAt && now - s.lastActiveAt.getTime() < 7 * 86_400_000).length;
  const SCOPE: Record<string, string> = { topic: "по теме", section: "по разделу", full: "сборный" };

  return (
    <>
      <h1>Сегодня</h1>
      <div className="stats">
        <Link href="/admin/help" className="card item"><b>{helpCount}</b><span className="muted">ждут разбора</span></Link>
        <Link href="/admin/students?activity=inactive" className="card item"><b>{inactive.length}</b><span className="muted">не заходили {INACTIVE_DAYS}+ дня</span></Link>
        <Link href="/admin/students" className="card item"><b>{students.length}</b><span className="muted">учеников</span></Link>
        {slowing.length > 0 && <Link href="/admin/students?activity=slowing" className="card item"><b>{slowing.length}</b><span className="muted">снизили темп занятий</span></Link>}
        {shared.length > 0 && <Link href="/admin/students?activity=shared" className="card item"><b>{shared.length}</b><span className="muted">с признаками общего аккаунта</span></Link>}
        <div className="card"><b>{activeWeek}</b><span className="muted">активны за неделю</span></div>
      </div>

      <h2>Новые заявки «Не смог решить»</h2>
      {helps.length === 0 ? <p className="card muted">Новых заявок нет 🎉</p> : (
        <div className="stack">
          {helps.map((h) => (
            <Link key={h.id} href="/admin/help" className="card item">
              <div className="head"><b>{h.user.login}</b><span className="muted">{when(h.createdAt)}</span></div>
              <div className="muted">{h.task.topic.title}</div>
              <div>{h.task.number ? `№${h.task.number}. ` : ""}{plain(h.task.question)}</div>
            </Link>
          ))}
          {helpCount > helps.length && <Link href="/admin/help">Все заявки ({helpCount}) →</Link>}
        </div>
      )}

      <h2>Давно не заходили</h2>
      {inactive.length === 0 ? <p className="card muted">Все заходили за последние {INACTIVE_DAYS} дня.</p> : (
        <div className="stack">
          {inactive.slice(0, 8).map((s) => (
            <Link key={s.id} href={`/admin/students/${s.id}`} className="card item">
              <div className="head"><b>{s.login}</b><span className="tag warn">{ago(s.lastActiveAt)}</span></div>
              <div className="meta"><span>прогресс {s.progressPct}%</span></div>
            </Link>
          ))}
          {inactive.length > 8 && <Link href="/admin/students?activity=inactive">Все ({inactive.length}) →</Link>}
        </div>
      )}

      <h2>Последние тесты</h2>
      {tests.length === 0 ? <p className="card muted">Тестов ещё не было.</p> : (
        <div className="stack">
          {tests.map((a) => {
            const pct = a.total ? Math.round(((a.score ?? 0) / a.total) * 100) : 0;
            return (
              <Link key={a.id} href={`/admin/students/${a.user.id}?tab=tests`} className="card item">
                <div className="head"><b>{a.user.login}</b><span className={`tag ${pct >= 60 ? "good" : "bad"}`}>{a.score ?? 0} из {a.total} · {pct}%</span></div>
                <div className="meta"><span>{SCOPE[a.scope] ?? a.scope}</span><span>{when(a.finishedAt!)}</span></div>
              </Link>
            );
          })}
        </div>
      )}
      <TelegramStatus />
    </>
  );
}
