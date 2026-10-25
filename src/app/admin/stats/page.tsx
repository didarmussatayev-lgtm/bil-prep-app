import { Reports } from "@/components/admin/Reports";
import { getStats } from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const s = await getStats();
  const cards: [string, string | number][] = [
    ["Учеников", s.students],
    ["Активны за 7 дней", s.activeLast7Days],
    ["Сессий сейчас", s.activeSessions],
    ["Средний прогресс курса", `${s.avgCourseProgressPct}%`],
    ["Пройдено тестов", s.testAttempts],
    ["Средний балл за тест", s.avgTestScore === null ? "—" : `${s.avgTestScore}%`],
  ];
  return (
    <>
      <h1>Отчёты</h1>
      <div className="stats">{cards.map(([k, v]) => <div className="card" key={k}><b>{v}</b><span className="muted">{k}</span></div>)}</div>
      <h2>Слабые места и динамика</h2>
      <Reports />
    </>
  );
}
