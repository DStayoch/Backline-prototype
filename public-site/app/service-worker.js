const BACKLINE_CACHE = "backline-pwa-20260903-41";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./field-polish.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/backline-pwa-192.png",
  "./assets/backline-pwa-512.png",
  "./assets/backline-icon-transparent.png",
  "./assets/backline-full-logo-transparent.png",
  "./assets/backline-wordmark.png",
  "./assets/backline-wordmark-dark.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(BACKLINE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("backline-pwa-") && key !== BACKLINE_CACHE)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(BACKLINE_CACHE).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(BACKLINE_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match(url.pathname)))
  );
});
