"use client";

import { useEffect } from "react";

const POLL_MS = 60_000;

/**
 * Невидимый компонент. Следит, чтобы вкладка не «жила» с мёртвой сессией:
 *  1) точно в момент истечения (8 ч) — редирект на /login;
 *  2) раз в минуту и при возврате на вкладку — сверяется с сервером
 *     (вход с другого устройства, принудительный разлогин админом).
 */
export function SessionWatcher({ expiresAt }: { expiresAt: string }) {
  useEffect(() => {
    let done = false;

    const goLogin = (reason: string) => {
      if (done) return;
      done = true;
      // жёсткая навигация — сбрасывает всё клиентское состояние
      window.location.assign(`/login?reason=${encodeURIComponent(reason)}`);
    };

    const check = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.status === 401) {
          const data = await res.json().catch(() => ({}));
          goLogin(data.reason ?? "expired");
        }
      } catch {
        // нет сети — не разлогиниваем, попробуем в следующий раз
      }
    };

    const msLeft = new Date(expiresAt).getTime() - Date.now();
    const expiryTimer = setTimeout(() => goLogin("expired"), Math.max(msLeft, 0));
    const pollTimer = setInterval(check, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);

    return () => {
      clearTimeout(expiryTimer);
      clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, [expiresAt]);

  return null;
}
