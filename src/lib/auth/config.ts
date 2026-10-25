// Общие константы авторизации. Без server-only — файл импортируется и в middleware.

export const SESSION_COOKIE = "bil_session";

/** Сессия живёт ровно 8 часов с момента входа (без продления при активности). */
export const SESSION_TTL_SECONDS = 8 * 60 * 60;
export const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;

export const BCRYPT_ROUNDS = 12;

/** Защита от подбора пароля: N неудачных попыток на связку IP+логин за окно. */
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
/** Отдельные потолки: по одному логину с любых IP (против перебора через смену IP) и по одному IP (школьный Wi-Fi — у многих один IP). */
export const LOGIN_MAX_PER_LOGIN = 20;
export const LOGIN_MAX_PER_IP = 60;
/** Подозрение на общий аккаунт: за 7 дней столько разных устройств или столько входов, оборвавших чужую сессию. */
export const SHARED_DEVICES_THRESHOLD = 3;
export const SHARED_KICKS_THRESHOLD = 4;

export type Role = "student" | "admin";

/** Причина, по которой сессия перестала быть действительной. Показывается на /login. */
export type SessionEndReason =
  | "none" // куки нет / сессия не найдена
  | "expired" // прошло 8 часов
  | "replaced" // вход с другого устройства
  | "admin" // админ принудительно завершил
  | "password_reset" // админ сменил пароль
  | "logout"; // ученик сам нажал «Выйти»
