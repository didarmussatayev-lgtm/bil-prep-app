// Уведомления админу в Telegram. Настройка — переменные окружения (на Railway: Variables):
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
//   TELEGRAM_CHAT_ID   — id чата (можно несколько через запятую, например два админа)
//   APP_URL            — адрес сайта для ссылки в сообщении (необязательно)
// Без переменных уведомления молча отключены. Отправка никогда не ломает основной запрос.

const API = () => process.env.TELEGRAM_API_BASE || "https://api.telegram.org"; // TELEGRAM_API_BASE — только для тестов

export const telegramConfigured = () => !!process.env.TELEGRAM_BOT_TOKEN && chatIds().length > 0;
const chatIds = () => (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Отправляет HTML-сообщение всем админским чатам. Возвращает число доставленных; ошибки не бросает. */
export async function notifyAdmins(html: string): Promise<{ sent: number; failed: number; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ids = chatIds();
  if (!token || ids.length === 0) return { sent: 0, failed: 0, error: "not_configured" };
  let sent = 0, failed = 0, error: string | undefined;
  for (const chat_id of ids) {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 7000);
      const res = await fetch(`${API()}/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
        signal: ctl.signal,
      });
      clearTimeout(timer);
      if (res.ok) sent += 1;
      else {
        failed += 1;
        const body = await res.json().catch(() => ({}));
        error = body?.description ?? `HTTP ${res.status}`;
        console.warn(`[telegram] chat ${chat_id}: ${error}`); // токен в лог не пишем
      }
    } catch (e) {
      failed += 1;
      error = (e as Error).name === "AbortError" ? "timeout" : "network";
      console.warn(`[telegram] chat ${chat_id}: ${error}`);
    }
  }
  return { sent, failed, error };
}

export type HelpNote = { topic: string; number: string | null; question: string; source: "practice" | "test"; note: string | null };

// Если ученик подряд отмечает несколько задач, шлём одно сообщение, а не по одному на каждую.
const BATCH_MS = 20_000;
const pending = new Map<string, { login: string; items: HelpNote[]; timer: ReturnType<typeof setTimeout> }>();

export function queueHelpNotification(userId: string, login: string, item: HelpNote, openTotal: () => Promise<number>) {
  if (!telegramConfigured()) return;
  const cur = pending.get(userId);
  if (cur) { cur.items.push(item); return; }
  const entry = { login, items: [item], timer: setTimeout(async () => {
    pending.delete(userId);
    const total = await openTotal().catch(() => null);
    const lines = entry.items.slice(0, 5).map((i) =>
      `• ${esc(i.topic)}${i.number ? `, №${esc(i.number)}` : ""} (${i.source === "test" ? "тест" : "закрепление"})\n  ${esc(i.question.replace(/\{([^{}]*)\}/g, "$1").slice(0, 110))}${i.note ? `\n  💬 ${esc(i.note.slice(0, 160))}` : ""}`,
    );
    const more = entry.items.length > 5 ? `\n… и ещё ${entry.items.length - 5}` : "";
    const link = process.env.APP_URL ? `\n\n${esc(process.env.APP_URL.replace(/\/$/, ""))}/admin/help` : "";
    void notifyAdmins(
      `🙋 <b>${esc(entry.login)}</b> не смог решить (${entry.items.length}):\n${lines.join("\n")}${more}${total !== null ? `\n\nВсего ждут разбора: ${total}` : ""}${link}`,
    );
  }, BATCH_MS) };
  pending.set(userId, entry);
}
