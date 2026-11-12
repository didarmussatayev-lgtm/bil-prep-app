"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/client";

/** Регистрирует service worker (офлайн-режим) и показывает плашку, когда пропала сеть. */
export function RegisterSW() {
  const t = useT();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;
  return (
    <div role="status" style={{ position: "fixed", left: 12, right: 12, bottom: 84, zIndex: 60, maxWidth: 420, margin: "0 auto", padding: "10px 16px", textAlign: "center", fontWeight: 800, fontSize: "0.9rem", color: "#fff", background: "#ff9600", borderRadius: 14, boxShadow: "0 4px 0 #cc7a00" }}>
      {t("Нет соединения. Открытые ранее страницы доступны, а проверка ответов требует интернета.")}
    </div>
  );
}
