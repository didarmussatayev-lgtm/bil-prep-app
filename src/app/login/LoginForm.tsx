"use client";

import { useState } from "react";
import styles from "./login.module.css";

export function LoginForm({ notice }: { notice?: string }) {
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
        setError(data.error ?? "Не удалось войти. Попробуйте ещё раз.");
        setBusy(false);
        return;
      }
      window.location.assign(data.redirectTo ?? "/");
    } catch {
      setError("Нет связи с сервером. Проверьте интернет и повторите.");
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.sheet}>
        <h1 className={styles.title}>Подготовка в БИЛ</h1>
        <p className={styles.lead}>Введите логин и пароль, которые выдал администратор.</p>

        {notice && <p className={styles.notice} role="status">{notice}</p>}

        {/* без <form>: отправка по кнопке и по Enter в полях */}
        <label className={styles.field}>
          <span>Логин</span>
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
          <span>Пароль</span>
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
          {busy ? "Входим…" : "Войти"}
        </button>
      </div>
    </main>
  );
}
