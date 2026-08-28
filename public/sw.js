const CACHE = 'pen-drills-__BUILD_VERSION__';
const BUILD_ASSETS = /* inject:assets */ [];
const SHELL = ['/', '/practice', '/demo', '/privacy', '/terms', '/offline.html', '/offline.css', '/manifest.webmanifest', '/favicon.svg', '/assets/instrument-console.webp', '/assets/social-card.webp', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png', ...BUILD_ASSETS];
const fromCache = (request) => caches.match(request, { ignoreVary: true });
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))));
self.addEventListener('activate', (event) => event.waitUntil(Promise.all([
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  self.clients.claim(),
])));
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
      return response;
    }).catch(async () => (await fromCache(request)) || (await fromCache('/')) || fromCache('/offline.html')));
    return;
  }
  event.respondWith(fromCache(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
