"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { useT } from "@/lib/i18n/client";
import { LangSwitch } from "@/components/auth/LangSwitch";

export function LoginForm({ notice, stats }: { notice?: string; stats?: { topics: number; tasks: number } | null }) {
  const t = useT();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? t("Не удалось войти. Попробуйте ещё раз."));
        setBusy(false);
        return;
      }
      window.location.assign(data.redirectTo ?? "/");
    } catch {
      setError(t("Нет связи с сервером. Проверьте интернет и повторите."));
      setBusy(false);
    }
  }

  const nf = (n: number) => n.toLocaleString("ru-RU");

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.top}>
          <span className={styles.brand}>{t("Подготовка в БИЛ")}</span>
          <LangSwitch />
        </header>

        <div className={styles.grid}>
          <section className={styles.intro} data-enter>
            <h1 className={styles.title}>{t("Подготовка к поступлению в БИЛ и НИШ")}</h1>
            <p className={styles.fact}>
              {stats
                ? t("{a} тем и {b} задач с проверкой ответа, пробные тесты по предметам.", { a: nf(stats.topics), b: nf(stats.tasks) })
                : t("Темы, задачи с проверкой ответа и пробные тесты по предметам.")}
            </p>

            {/* настоящий экран ученика: задача с вариантами и номерами вопросов */}
            <div className={styles.shot} aria-hidden="true">
              <div className={styles.shotHead}><span className={styles.shotKicker}>2.1</span><span className={styles.shotBar}><i /></span></div>
              <p className={styles.shotQ}>2/5 + 1/5 = ?</p>
              <ul className={styles.shotOpts}>
                <li className={styles.shotOn}><b>A</b>3/5</li>
                <li><b>B</b>3/10</li>
                <li><b>C</b>2/5</li>
                <li><b>D</b>1/5</li>
              </ul>
              <div className={styles.shotNums}>
                {[1, 2, 3, 4, 5, 6].map((n) => <span key={n} className={n === 1 ? styles.shotCur : n < 1 ? styles.shotDone : undefined}>{n}</span>)}
              </div>
            </div>
          </section>

          <section className={styles.sheet} data-enter aria-labelledby="login-h">
            <h2 id="login-h" className={styles.formTitle}>{t("Вход для учеников")}</h2>
            <p className={styles.lead}>{t("Логин и пароль выдаёт администратор.")}</p>

            {notice && <p className={styles.notice} role="status">{notice}</p>}

            {/* без <form>: отправка по кнопке и по Enter в полях */}
            <label className={styles.field}>
              <span>{t("Логин")}</span>
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                autoComplete="username"
                autoCapitalize="none"
                autoFocus
              />
            </label>

            <label className={styles.field}>
              <span>{t("Пароль")}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                autoComplete="current-password"
              />
            </label>

            {error && <p className={styles.error} role="alert">{error}</p>}

            <button className={styles.button} onClick={submit} disabled={busy || !login || !password}>
              {busy ? t("Входим…") : t("Войти в кабинет")}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
