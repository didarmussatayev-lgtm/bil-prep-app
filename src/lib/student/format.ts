const TZ = "Asia/Almaty";

export function formatDateTime(d: Date, lang: "ru" | "kk" = "ru"): string {
  return d.toLocaleString(lang === "kk" ? "kk-KZ" : "ru-RU", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(seconds: number, lang: "ru" | "kk" = "ru"): string {
  const m = Math.round(seconds / 60);
  return `${m} ${lang === "kk" ? "мин" : "мин"}`;
}
