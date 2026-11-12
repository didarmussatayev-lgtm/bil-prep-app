"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/client";

export function LogoutButton({ className }: { className?: string }) {
  const t = useT();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      // чистим офлайн-кэш страниц: на общем устройстве ничего не должно остаться
      try { navigator.serviceWorker?.controller?.postMessage("clear"); } catch {}
      window.location.assign("/login");
    }
  }

  return (
    <button type="button" onClick={onClick} disabled={busy} className={className}>
      {t("Выйти")}
    </button>
  );
}
