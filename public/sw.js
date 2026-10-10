const CACHE_NAME = 'grateapex-pwa-v5';
const CACHE_PREFIX = 'grateapex-pwa-';
const APP_SHELL = ['/', '/manifest.webmanifest', '/icons/grateapex-192.png', '/icons/grateapex-512.png'];
const CACHEABLE_DESTINATIONS = new Set(['font', 'image', 'script', 'style']);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Always the newest page from the network (bypassing the HTTP cache); the
    // saved copy is only for offline use.
    event.respondWith(fetch(request.url, { cache: 'no-store', credentials: 'same-origin' }).catch(async () => (await caches.match(request)) || (await caches.match('/'))));
    return;
  }

  // Only cache static, fingerprinted assets. App data and other requests must
  // always reach the network so an installed shortcut cannot pin stale content.
  if (!CACHEABLE_DESTINATIONS.has(request.destination)) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const href = event.notification.data?.href || '/';
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows[0];
    if (existing) {
      await existing.focus();
      if ('navigate' in existing) await existing.navigate(href);
      return;
    }
    await self.clients.openWindow(href);
  })());
});
