"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { useT } from "@/lib/i18n/client";
import { LangSwitch } from "@/components/auth/LangSwitch";

export function LoginForm({ notice }: { notice?: string }) {
  const t = useT();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"in" | "up">("in");
  const signUp = mode === "up";

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(signUp ? "/api/auth/register" : "/api/auth/login", {
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

  return (
    <main className={styles.page}>
      <div className={styles.sheet}>
        <div style={{ textAlign: "right" }}><LangSwitch className={styles.lead} /></div>
        <h1 className={styles.title}>{t("Подготовка в БИЛ")}</h1>
        <p className={styles.lead}>
          {signUp
            ? t("Создайте аккаунт. Материалы откроются после того, как администратор выдаст доступ.")
            : t("Введите логин и пароль, которые выдал администратор.")}
        </p>

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
            autoComplete={signUp ? "new-password" : "current-password"}
          />
        </label>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button className={styles.button} onClick={submit} disabled={busy || !login || !password}>
          {busy ? (signUp ? t("Создаём…") : t("Входим…")) : signUp ? t("Зарегистрироваться") : t("Войти")}
        </button>

        <button
          type="button"
          className={styles.switch}
          onClick={() => { setMode(signUp ? "in" : "up"); setError(null); }}
        >
          {signUp ? t("Уже есть аккаунт? Войти") : t("Нет аккаунта? Зарегистрироваться")}
        </button>
      </div>
    </main>
  );
}
