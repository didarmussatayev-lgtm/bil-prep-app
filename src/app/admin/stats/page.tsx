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
      <h1>Статистика</h1>
      <div className="stats">{cards.map(([k, v]) => <div className="card" key={k}><b>{v}</b><span className="muted">{k}</span></div>)}</div>
      <h2>Самые сложные темы</h2>
      <div className="scroll"><table>
        <thead><tr><th>Тема</th><th>Средний % верных</th><th>Учеников</th></tr></thead>
        <tbody>
          {s.hardestTopics.map((t) => <tr key={t.topicId}><td>{t.title}</td><td>{t.avgScore}</td><td>{t.students}</td></tr>)}
          {!s.hardestTopics.length && <tr><td colSpan={3} className="muted">Данных пока нет — они появятся, когда ученики начнут решать задачи.</td></tr>}
        </tbody>
      </table></div>
    </>
  );
}
