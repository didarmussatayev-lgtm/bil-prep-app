"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = { id: string; title: string; months: number; price: number; active: boolean };
type Pay = { id: string; login: string; amount: number; months: number; method: string; status: string; note: string | null; createdAt: string };

const STATUS: Record<string, [string, string]> = {
  pending: ["Ждём оплату", "warn"], paid: ["Оплачено", "good"], failed: ["Отклонено", "bad"], expired: ["Истекло", ""], lost: ["Проверить вручную", "bad"],
};
const METHOD: Record<string, string> = { qr: "QR", invoice: "Счёт", manual: "Вручную" };

async function send(url: string, method: string, body: unknown) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  return r.ok ? null : (d.error as string) ?? "Ошибка";
}

export function PaymentsAdmin({ plans, payments }: { plans: Plan[]; payments: Pay[] }) {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [grant, setGrant] = useState({ login: "", months: "1", amount: "0" });
  const [free, setFree] = useState({ login: "", free: "no" });
  const [fresh, setFresh] = useState({ title: "", months: "1", price: "" });
  const [edit, setEdit] = useState<Record<string, { title: string; months: string; price: string }>>({});

  async function run(fn: () => Promise<string | null>, done?: string) {
    setErr(null); setOk(null);
    const e = await fn();
    if (e) setErr(e); else { if (done) setOk(done); router.refresh(); }
  }

  return (
    <>
      {err && <p className="err" role="alert">{err}</p>}
      {ok && <p className="ok" role="status">{ok}</p>}

      <h2>Тарифы</h2>
      <div className="stack">
        {plans.map((p) => {
          const e = edit[p.id] ?? { title: p.title, months: String(p.months), price: String(p.price) };
          const set = (k: string, v: string) => setEdit({ ...edit, [p.id]: { ...e, [k]: v } });
          return (
            <div key={p.id} className="card">
              <div className="row">
                <input aria-label="Название" value={e.title} onChange={(x) => set("title", x.target.value)} style={{ width: 150 }} />
                <input aria-label="Месяцев" inputMode="numeric" value={e.months} onChange={(x) => set("months", x.target.value)} style={{ width: 70 }} />
                <input aria-label="Цена, ₸" inputMode="numeric" value={e.price} onChange={(x) => set("price", x.target.value)} style={{ width: 110 }} />
                <span className="muted">₸</span>
                <button className="primary sm" onClick={() => run(() => send(`/api/admin/plans/${p.id}`, "PATCH", { title: e.title, months: Number(e.months), price: Number(e.price) }), "Тариф сохранён")}>Сохранить</button>
                <button className="sm" onClick={() => run(() => send(`/api/admin/plans/${p.id}`, "PATCH", { active: !p.active }))}>{p.active ? "Скрыть" : "Показать"}</button>
                {!p.active && <span className="tag">скрыт</span>}
              </div>
            </div>
          );
        })}
        <div className="card">
          <div className="row">
            <input placeholder="Название" value={fresh.title} onChange={(x) => setFresh({ ...fresh, title: x.target.value })} style={{ width: 150 }} />
            <input placeholder="Мес." inputMode="numeric" value={fresh.months} onChange={(x) => setFresh({ ...fresh, months: x.target.value })} style={{ width: 70 }} />
            <input placeholder="Цена" inputMode="numeric" value={fresh.price} onChange={(x) => setFresh({ ...fresh, price: x.target.value })} style={{ width: 110 }} />
            <button className="primary sm" onClick={() => run(() => send("/api/admin/plans", "POST", { title: fresh.title, months: Number(fresh.months), price: Number(fresh.price), active: true }), "Тариф добавлен")}>Добавить тариф</button>
          </div>
        </div>
      </div>

      <h2>Открыть доступ вручную</h2>
      <div className="card">
        <p className="muted" style={{ margin: "0 0 8px" }}>Например, ученик перевёл деньги на Kaspi напрямую. Срок продлится от текущей даты окончания.</p>
        <div className="row">
          <input placeholder="Логин ученика" value={grant.login} onChange={(x) => setGrant({ ...grant, login: x.target.value })} autoCapitalize="none" />
          <input aria-label="Месяцев" inputMode="numeric" value={grant.months} onChange={(x) => setGrant({ ...grant, months: x.target.value })} style={{ width: 70 }} />
          <span className="muted">мес.</span>
          <input aria-label="Сумма, ₸" inputMode="numeric" value={grant.amount} onChange={(x) => setGrant({ ...grant, amount: x.target.value })} style={{ width: 110 }} />
          <span className="muted">₸</span>
          <button className="primary" disabled={!grant.login.trim()} onClick={() => run(() => send("/api/admin/payments/grant", "POST", { login: grant.login, months: Number(grant.months), amount: Number(grant.amount) || 0 }), "Доступ продлён")}>Открыть доступ</button>
        </div>
      </div>

      <h2>Бесплатный доступ</h2>
      <div className="card">
        <p className="muted" style={{ margin: "0 0 8px" }}>Ученики, созданные до включения оплаты, учатся бесплатно. Здесь можно перевести ученика на платный тариф или, наоборот, освободить от оплаты.</p>
        <div className="row">
          <input placeholder="Логин ученика" value={free.login} onChange={(x) => setFree({ ...free, login: x.target.value })} autoCapitalize="none" />
          <select aria-label="Бесплатный доступ" value={free.free} onChange={(x) => setFree({ ...free, free: x.target.value })}>
            <option value="no">Платный (должен оплатить)</option>
            <option value="yes">Бесплатный</option>
          </select>
          <button className="primary" disabled={!free.login.trim()} onClick={() => run(() => send("/api/admin/payments/free", "POST", { login: free.login, free: free.free === "yes" }), "Сохранено")}>Сохранить</button>
        </div>
      </div>

      <h2>Последние платежи</h2>
      {payments.length === 0 ? <p className="card muted">Платежей пока нет.</p> : (
        <div className="scroll">
          <table>
            <thead><tr><th>Дата</th><th>Ученик</th><th>Сумма</th><th>Способ</th><th>Статус</th><th /></tr></thead>
            <tbody>
              {payments.map((p) => {
                const [label, tone] = STATUS[p.status] ?? [p.status, ""];
                const open = p.status === "pending" || p.status === "lost";
                return (
                  <tr key={p.id}>
                    <td>{new Date(p.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                    <td>{p.login}</td>
                    <td>{p.amount.toLocaleString("ru-RU")} ₸ · {p.months} мес.</td>
                    <td>{METHOD[p.method] ?? p.method}</td>
                    <td><span className={`tag ${tone}`}>{label}</span>{p.note && <div className="muted" style={{ fontSize: 12 }}>{p.note}</div>}</td>
                    <td>
                      {open && (
                        <div className="row" style={{ margin: 0 }}>
                          <button className="sm primary" onClick={() => confirm("Деньги пришли в Kaspi? Доступ будет продлён.") && run(() => send(`/api/admin/payments/${p.id}`, "POST", { action: "confirm" }), "Платёж подтверждён")}>Пришло</button>
                          <button className="sm" onClick={() => run(() => send(`/api/admin/payments/${p.id}`, "POST", { action: "reject" }))}>Отклонить</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
