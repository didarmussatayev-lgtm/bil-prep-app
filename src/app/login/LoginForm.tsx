"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { useT } from "@/lib/i18n/client";
import { LangSwitch } from "@/components/auth/LangSwitch";
import { DEMO_LOGIN, DEMO_PASSWORD, SITE_INFO } from "@/lib/site-info";

export function LoginForm({ notice, stats, selfPrice }: { notice?: string; stats?: { topics: number; tasks: number } | null; selfPrice?: number | null }) {
  const t = useT();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(creds?: { login: string; password: string }) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds ?? { login, password }),
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
          <span className={styles.brand}>AlMath</span>
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

            <button className={styles.button} onClick={() => submit()} disabled={busy || !login || !password}>
              {busy ? t("Входим…") : t("Войти в кабинет")}
            </button>
          </section>
        </div>

        <section className={styles.block} aria-labelledby="res-h">
          <h2 id="res-h" className={styles.blockTitle}>{t("О тренере")}</h2>
          <ul className={styles.facts}>
            <li className={styles.factWide}>
              <b>{SITE_INFO.yearsFrom}–{SITE_INFO.yearsTo}</b>
              <span>{t("годы работы тренера в БИЛ")}</span>
              <i className={styles.factBar} aria-hidden="true"><u style={{ width: "100%" }} /></i>
            </li>
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="price-h">
          <h2 id="price-h" className={styles.blockTitle}>{t("Форматы и цены")}</h2>
          <ul className={styles.prices}>
            <li><h3>{t("Офлайн")}</h3><p className={styles.price}>{t("{n} ₸ в месяц", { n: nf(SITE_INFO.offlinePrice) })}</p><p>{t("Занятия с преподавателем очно.")}</p></li>
            <li><h3>{t("Онлайн")}</h3><p className={styles.price}>{t("{n} ₸ в месяц", { n: nf(SITE_INFO.onlinePrice) })}</p><p>{t("Занятия с преподавателем онлайн.")}</p></li>
            <li><h3>{t("Самостоятельное обучение")}</h3><p className={styles.price}>{t("{n} ₸ в месяц", { n: nf(selfPrice ?? SITE_INFO.selfPriceFallback) })}</p><p>{t("Доступ к сайту: теория, задачи и тесты с правильными решениями и ответами.")}</p></li>
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="demo-h">
          <h2 id="demo-h" className={styles.blockTitle}>{t("Попробовать бесплатно")}</h2>
          <p className={styles.blockText}>{t("Демо-доступ: по одной теме, одному закреплению и одному тесту на каждый предмет.")}</p>
          <p className={styles.demoCreds}>{t("Логин")}: <b>{DEMO_LOGIN}</b> · {t("Пароль")}: <b>{DEMO_PASSWORD}</b></p>
          <button className={styles.buttonGhost} onClick={() => submit({ login: DEMO_LOGIN, password: DEMO_PASSWORD })} disabled={busy}>{t("Войти в демо")}</button>
        </section>

        <section className={styles.block} aria-labelledby="contact-h">
          <h2 id="contact-h" className={styles.blockTitle}>{t("Записаться и задать вопрос")}</h2>
          <p className={styles.phone}><a href={`tel:${SITE_INFO.phone}`}>{SITE_INFO.phoneView}</a></p>
          <div className={styles.actions}>
            <a className={styles.buttonLink} href={`tel:${SITE_INFO.phone}`}>{t("Позвонить")}</a>
            <a className={styles.buttonGhostLink} href={`https://wa.me/${SITE_INFO.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer">{t("Написать в WhatsApp")}</a>
          </div>
        </section>
      </div>
    </main>
  );
}
