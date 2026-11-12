// Service worker: офлайн-режим.
//  • статика (/_next/static, иконки, шрифты, рисунки) — cache-first;
//  • страницы теории/закрепления/предметов — network-first, последняя открытая версия доступна без сети;
//  • нет сети и страницы нет в кэше — показываем /offline.html;
//  • /api/* и любые не-GET запросы не трогаем: ответы и сессии всегда с сервера;
//  • при выходе из аккаунта кэш страниц очищается (сообщение "clear"), чтобы на общем устройстве ничего не осталось.
const V = "v2";
const STATIC = `static-${V}`;
const PAGES = `pages-${V}`;
const PAGE_PATH = /^\/(?:$|bil|nis|achievements|search)/;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC).then((c) => c.add("/offline.html")).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![STATIC, PAGES].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "clear") e.waitUntil(caches.delete(PAGES));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (/^\/(_next\/static|icons|figures|exams)\//.test(url.pathname) || url.pathname === "/offline.html") {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(STATIC).then((c) => c.put(req, copy)); }
        return res;
      })),
    );
    return;
  }

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          // кэшируем только обычные страницы ученика; редирект на /login не кэшируем
          if (res.ok && !res.redirected && PAGE_PATH.test(url.pathname)) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("/offline.html"))),
    );
  }
});
