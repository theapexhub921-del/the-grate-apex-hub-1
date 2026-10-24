const CACHE_NAME = 'grateapex-pwa-v12';
// Study material kept for offline revision (question banks, lecture diagrams, and what
// Settings → Offline study saves: src/lib/offline-study.ts). A different prefix from
// CACHE_PREFIX on purpose: an app update must never delete what a learner saved.
const OFFLINE_CACHE = 'grateapex-offline-v1';
const CACHE_PREFIX = 'grateapex-pwa-';
const APP_SHELL = ['/', '/manifest.webmanifest', '/icons/grateapex-192-v2.png', '/icons/grateapex-512-v2.png'];
const CACHEABLE_DESTINATIONS = new Set(['font', 'image', 'script', 'style']);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    // One missing file must never stop the worker from installing (a failed install
    // means no push at all), so each file is cached on its own and failures are ignored.
    try {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => undefined)));
    } catch { /* caching is optional */ }
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

  // The 3D atlas (/atlas/...) is never touched by this worker: not the page, not its scripts, not its models. It is a
  // standalone viewer that changes whenever it is redeployed, and a saved copy (this worker used to fall back to one when
  // the connection was slow) left phones stuck on an old, broken version. The browser's normal checks keep it fresh:
  // the page is revalidated on every open (vercel.json) and its address carries a fresh ?v= stamp (src/lib/atlas-theme.ts).
  if (new URL(request.url).pathname.startsWith('/atlas/')) return;
  // Firebase's sign-in helper (/__/auth/..., proxied to Firebase by vercel.json for the installed
  // app's Google sign-in) always goes straight to the network and is never saved: a saved or
  // re-fetched copy loses the one-time sign-in result and leaves the learner on the login page.
  if (new URL(request.url).pathname.startsWith('/__/')) return;
  // Vercel Web Analytics (/_vercel/insights/...) always goes straight to the network.
  if (new URL(request.url).pathname.startsWith('/_vercel/')) return;
  // The 3D organs shown with the lesson simulations (/sim3d/...) use the atlas models: same rule.
  if (new URL(request.url).pathname.startsWith('/sim3d/')) return;
  // The Android app download (public/downloads) goes straight to the network: never saved.
  if (new URL(request.url).pathname.startsWith('/downloads/')) return;
  // Game builds (public/game-builds): played offline once played (or warmed up) online.
  // Online, every file comes from the network as usual (the browser's "has it changed?"
  // check keeps that cheap, so updates always show); a copy goes into the offline cache,
  // and the large engine file is written again only when it changed (ETag). Offline, the
  // saved copy is used. The original request is fetched as is, so the host's redirect
  // (play.html → /play) passes through untouched, and a redirected reply is never saved.
  const gamePath = new URL(request.url).pathname;
  if (gamePath.startsWith('/game-builds/')) {
    if (request.headers.has('range')) return;
    event.respondWith((async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      try {
        const response = await fetch(request);
        if (response.status === 200 && response.type === 'basic' && !response.redirected) {
          const saved = await cache.match(gamePath);
          const tag = response.headers.get('etag');
          if (!saved || !tag || saved.headers.get('etag') !== tag) {
            event.waitUntil(cache.put(gamePath, response.clone()).catch(() => undefined));
          }
        }
        return response;
      } catch {
        return (await cache.match(gamePath)) || Response.error();
      }
    })());
    return;
  }

  if (request.mode === 'navigate') {
    // Always the newest page from the network (bypassing the HTTP cache); the
    // saved copy is only for offline use.
    event.respondWith((async () => {
      try {
        const response = await fetch(request.url, { cache: 'no-store', credentials: 'same-origin' });
        // Keep the page just opened, so a screen visited once still opens with no connection.
        if (response.ok && response.type === 'basic' && !response.redirected) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => undefined));
        }
        return response;
      } catch {
        // Offline: this exact page, the same page without its query string, or the app shell.
        return (await caches.match(request)) || (await caches.match(request, { ignoreSearch: true })) || (await caches.match('/')) || Response.error();
      }
    })());
    return;
  }

  const url = new URL(request.url);

  // Question banks: show the saved copy straight away (the network can be slow or absent),
  // and refresh it in the background (a cheap "has it changed?" check) for next time.
  // A request that explicitly asks for a fresh copy (Settings → Offline study) goes to the network.
  if (url.pathname.startsWith('/curriculum/') && url.pathname.endsWith('.json')) {
    if (request.cache === 'reload' || request.cache === 'no-store') return;
    event.respondWith((async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      const cached = await cache.match(request);
      const refresh = fetch(request.url, { cache: 'no-cache' }).then(async (response) => {
        if (response.ok) await cache.put(request, response.clone());
        return response;
      });
      if (cached) {
        event.waitUntil(refresh.catch(() => undefined));
        return cached;
      }
      return refresh;
    })());
    return;
  }

  // Lecture diagrams: once seen, they are kept for offline study.
  if (url.pathname.startsWith('/figures/')) {
    if (request.cache === 'reload' || request.cache === 'no-store') return;
    event.respondWith((async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })());
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

// The number on the app icon = alerts still waiting in the notification centre.
// (Alerts with the same tag replace each other, so this is a fair unread count.)
async function syncBadge() {
  try {
    const waiting = (await self.registration.getNotifications()).length;
    if (waiting > 0) await navigator.setAppBadge?.(waiting);
    else await navigator.clearAppBadge?.();
  } catch { /* badges are optional */ }
}

// Push from the server (api/push.mjs): new messages while the app is closed or in the background.
// When the app is open on screen it shows its own toast, so no system alert then.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    // Apple's push service (iPhone and iPad) cancels a site's alerts after a few pushes
    // that show nothing, so there every push is shown, even with the app on screen.
    let apple = false;
    try {
      const subscription = await self.registration.pushManager.getSubscription();
      apple = Boolean(subscription && new URL(subscription.endpoint).hostname.endsWith('apple.com'));
    } catch { /* treat as not Apple */ }
    if (!apple && windows.some((client) => client.visibilityState === 'visible' && client.focused)) return;
    await self.registration.showNotification(data.title || 'GrAte Apex Hub', {
      body: data.body || '',
      icon: '/icons/grateapex-192-v2.png',
      badge: '/icons/grateapex-192-v2.png',
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      data: { href: data.href || '/' },
    });
    await syncBadge();
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const href = event.notification.data?.href || '/';
  event.waitUntil((async () => {
    await syncBadge();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows[0];
    if (existing) {
      try {
        await existing.focus();
        if ('navigate' in existing) await existing.navigate(href);
        return;
      } catch { /* some phones refuse: open the page in a new window instead */ }
    }
    await self.clients.openWindow(href);
  })());
});
