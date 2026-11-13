"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/client";
import ui from "@/components/student/ui.module.css";
import styles from "./pay.module.css";

type Plan = { id: string; title: string; months: number; price: number };
type Started = { id: string; method: "qr" | "invoice"; payLink: string | null; qrSvg: string | null; amount: number };

const fmt = (n: number) => n.toLocaleString("ru-RU");

export function PayPanel({ plans }: { plans: Plan[] }) {
  const t = useT();
  const router = useRouter();
  const [planId, setPlanId] = useState(plans[plans.length > 1 ? 1 : 0]?.id ?? "");
  const [method, setMethod] = useState<"qr" | "invoice">("qr");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState<Started | null>(null);
  const [state, setState] = useState<"pending" | "paid" | "failed" | "expired" | "lost">("pending");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  useEffect(() => stop, []);

  const poll = useCallback(async (id: string) => {
    try {
      const r = await fetch(`/api/payments/${id}`, { cache: "no-store" });
      if (!r.ok) return;
      const d = await r.json();
      if (d.status !== "pending") {
        stop();
        setState(d.status);
        if (d.status === "paid") router.refresh();
      }
    } catch { /* нет связи — попробуем в следующий раз */ }
  }, [router]);

  async function pay() {
    setError(null);
    setBusy(true);
    try {
      const r = await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, method, phone: method === "invoice" ? phone : undefined }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setError(d.error ?? t("Не удалось создать счёт. Попробуйте ещё раз.")); return; }
      setStarted(d);
      setState("pending");
      stop();
      timer.current = setInterval(() => void poll(d.id), 3000);
    } catch {
      setError(t("Нет связи с сервером. Проверьте интернет и повторите."));
    } finally {
      setBusy(false);
    }
  }

  function reset() { stop(); setStarted(null); setState("pending"); setError(null); }

  if (started && state === "paid") {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>{t("Оплата прошла")}</p>
        <p className={ui.muted}>{t("Доступ открыт. Можно учиться.")}</p>
        <a href="/" className={ui.btn}>{t("На главную")}</a>
      </div>
    );
  }

  if (started) {
    return (
      <div className={styles.wait}>
        {state === "pending" ? (
          <>
            <p className={styles.amount}>{fmt(started.amount)} ₸</p>
            {started.method === "qr" ? (
              <>
                <p className={ui.muted}>{t("Откройте Kaspi.kz, нажмите «Сканировать» и наведите камеру на код. На телефоне нажмите кнопку ниже.")}</p>
                {started.qrSvg && <div className={styles.qr} role="img" aria-label={t("QR-код для оплаты в Kaspi")} dangerouslySetInnerHTML={{ __html: started.qrSvg }} />}
                {started.payLink && <a className={ui.btn} href={started.payLink} target="_blank" rel="noopener noreferrer">{t("Открыть в Kaspi")}</a>}
              </>
            ) : (
              <p className={ui.muted}>{t("Счёт выставлен на номер Kaspi. Откройте Kaspi.kz → «Платежи» и подтвердите оплату.")}</p>
            )}
            <p className={styles.hint}><span className={styles.dot} aria-hidden="true" />{t("Ждём оплату… страница обновится сама.")}</p>
          </>
        ) : (
          <p className={ui.error} role="alert">
            {state === "expired" ? t("Время оплаты истекло.") : state === "failed" ? t("Оплата не прошла.") : t("Не удалось определить статус оплаты. Если деньги списались — напишите администратору.")}
          </p>
        )}
        <button type="button" className={ui.btnGhost} onClick={reset}>{state === "pending" ? t("Отменить") : t("Выбрать тариф заново")}</button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.plans} role="radiogroup" aria-label={t("Тариф")}>
        {plans.map((p) => (
          <label key={p.id} className={`${styles.plan} ${planId === p.id ? styles.planOn : ""}`}>
            <input type="radio" name="plan" checked={planId === p.id} onChange={() => setPlanId(p.id)} />
            <span className={styles.planTitle}>{p.title}</span>
            <span className={styles.planPrice}>{fmt(p.price)} ₸</span>
            {p.months > 1 && <span className={styles.planPer}>{t("{n} ₸ в месяц", { n: fmt(Math.round(p.price / p.months)) })}</span>}
          </label>
        ))}
      </div>

      <div className={styles.methods} role="radiogroup" aria-label={t("Способ оплаты")}>
        <label className={`${styles.method} ${method === "qr" ? styles.methodOn : ""}`}>
          <input type="radio" name="method" checked={method === "qr"} onChange={() => setMethod("qr")} />
          {t("QR или ссылка Kaspi")}
        </label>
        <label className={`${styles.method} ${method === "invoice" ? styles.methodOn : ""}`}>
          <input type="radio" name="method" checked={method === "invoice"} onChange={() => setMethod("invoice")} />
          {t("Счёт на номер Kaspi")}
        </label>
      </div>

      {method === "invoice" && (
        <label className={styles.field}>
          <span>{t("Номер телефона в Kaspi")}</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="7001234567" maxLength={16} />
        </label>
      )}

      {error && <p className={ui.error} role="alert">{error}</p>}
      <button type="button" className={ui.btnLarge} onClick={pay} disabled={busy || !planId || (method === "invoice" && phone.replace(/\D/g, "").length < 10)}>
        {busy ? t("Создаём счёт…") : t("Оплатить через Kaspi")}
      </button>
    </div>
  );
}
