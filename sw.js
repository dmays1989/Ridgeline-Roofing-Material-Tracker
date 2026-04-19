const CACHE = 'ridgeline-v3';
const OFFLINE_URLS = [
  '/Ridgeline-Roofing-Material-Tracker/',
  '/Ridgeline-Roofing-Material-Tracker/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(OFFLINE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Don't intercept Firebase or Google API requests
  const url = event.request.url;
  if (url.includes('firebase') || url.includes('google') || url.includes('gstatic')) return;
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(r => r || caches.match('/Ridgeline-Roofing-Material-Tracker/'))
    )
  );
});
