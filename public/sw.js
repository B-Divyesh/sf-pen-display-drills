const CACHE = 'pen-drills-v1';
const BUILD_ASSETS = /* inject:assets */ [];
const SHELL = ['/', '/practice', '/demo', '/privacy', '/terms', '/offline.html', '/offline.css', '/manifest.webmanifest', '/favicon.svg', '/assets/instrument-console.webp', '/assets/social-card.webp', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png', ...BUILD_ASSETS];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))));
self.addEventListener('activate', (event) => event.waitUntil(Promise.all([
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  self.clients.claim(),
])));
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CACHE_URLS') event.waitUntil(caches.open(CACHE).then((cache) => Promise.allSettled(event.data.urls.map((url) => cache.add(url)))));
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
    }).catch(async () => (await caches.match(request)) || (await caches.match('/')) || caches.match('/offline.html')));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
