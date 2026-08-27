const CACHE = 'shelf-rotation-v2';
const SHELL = ['/', '/assets/hero-shelf-760.webp', '/assets/hero-shelf-1200.webp', '/assets/hero-shelf-1200.jpg', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(async (cache) => {
    await cache.addAll(SHELL);
    const html = await (await fetch('/')).text();
    const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)].map((match) => match[1]);
    await cache.addAll([...new Set(builtAssets)]);
  }).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const url = new URL(event.request.url);
    const cached = url.origin === self.location.origin ? await caches.match(url.pathname) : undefined;
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok && url.origin === self.location.origin) {
        const cache = await caches.open(CACHE);
        await cache.put(url.pathname, response.clone());
      }
      return response;
    } catch {
      if (event.request.mode === 'navigate') return (await caches.match('/')) || Response.error();
      return Response.error();
    }
  })());
});
