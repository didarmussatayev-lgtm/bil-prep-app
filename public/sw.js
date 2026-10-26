// Минимальный service worker: нужен, чтобы браузер предлагал «Установить приложение».
// Ничего не кэшируем — данные и сессии всегда с сервера.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
