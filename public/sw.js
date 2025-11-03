// Portfolio Service Worker - runtime caching + versioned shell
const VERSION = 'v2';
const SHELL_CACHE = `portfolio-shell-${VERSION}`;
const RUNTIME_CACHE = `portfolio-runtime-${VERSION}`;
const SHELL_ASSETS = [
  '/',
  '/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => ![SHELL_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // HTML: network-first with fallback
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request).then(resp => {
        const copy = resp.clone();
        caches.open(SHELL_CACHE).then(c => c.put(request, copy));
        return resp;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Images & static assets: stale-while-revalidate
  if (['image','script','style','font'].includes(request.destination) || /\.(png|jpg|jpeg|gif|webp|svg|js|css)$/i.test(request.url)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(resp => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(RUNTIME_CACHE).then(c => c.put(request, copy));
          }
          return resp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }
});
