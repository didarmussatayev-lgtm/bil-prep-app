const TZ = "Asia/Almaty";

export function formatDateTime(d: Date): string {
  return d.toLocaleString("ru-RU", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  return `${m} мин`;
}
