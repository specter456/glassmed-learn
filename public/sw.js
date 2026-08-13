/* GlassMed Learn service worker.
 *
 * Kept deliberately minimal and safe:
 * - Registers so the browser offers "Add to Home Screen".
 * - Navigations are network-first with a last-seen cache fallback, so the app
 *   still opens when the connection drops.
 * - All other requests (API calls, assets) pass straight through untouched.
 */
const CACHE = "glassmed-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only pages (navigations) get the offline fallback; everything else —
  // assets, API calls — is left to the network untouched.
  if (request.method !== "GET" || request.mode !== "navigate") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cached = await cache.match(request, { ignoreSearch: true });
        return cached || Response.error();
      }
    })(),
  );
});
