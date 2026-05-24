// CARDVERSE – Service Worker (App Shell Cache)

const CACHE_NAME = "cardverse-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./eventlog.js",
  "./card-engine.js",
  "./map-engine.js",
  "./stats.js",
  "./minigames.js",
  "./manifest.json",
];

// Install: App Shell cachen
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: alte Caches entfernen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: Cache-first für App Shell, Network-first für externe Ressourcen
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Externe Ressourcen (z. B. Google Drive Videos) immer netzwerkseitig
  if (url.origin !== self.location.origin) {
    return; // Browser-Standard
  }

  // App Shell: Cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          // Assets cachen
          const toCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, toCache));
          return response;
        })
        .catch(() => {
          // Offline-Fallback: index.html
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
