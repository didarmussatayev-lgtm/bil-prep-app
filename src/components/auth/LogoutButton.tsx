"use client";

import { useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <button type="button" onClick={onClick} disabled={busy} className={className}>
      Выйти
    </button>
  );
}
