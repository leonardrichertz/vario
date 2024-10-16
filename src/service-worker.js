const CACHE_NAME = 'vario-cache-v1';
// These are the urls that the service worker will cache.
const urlsToCache = [
  '/vario/dev/',
  '/vario/dev/index.html',
  '/vario/dev/scripts/altitudeOnlyGPS.js',
  '/vario/dev/assets/compass.svg',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  '/vario/dev/assets/favicon.ico',
  '/vario/dev/assets/favicon-white.ico',
  '/vario/dev/assets/marker.png',
  '/vario/dev/assets/paraglider.png',
  '/vario/dev/assets/icon-192x192-white.png',
  '/vario/dev/assets/icon-192x192.png',
];
// This event is triggered when the service worker is installed. It will cache the urlsToCache and see if any of them fail.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        const failedUrls = [];
        for (const url of urlsToCache) {
          try {
            await cache.add(url);
          } catch (error) {
            console.error(`Failed to cache ${url}:`, error);
            failedUrls.push(url);
          }
        }
        if (failedUrls.length > 0) {
          console.error('Failed to cache the following URLs:', failedUrls);
        }
      } catch (error) {
        console.error('Failed to open cache:', error);
      }
    })
  );
});

// This event is triggered upon a fetch request. It will check if the request is already cached and return it. If it is not cached, it will fetch the request.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// This event is triggered when the service worker is activated. It will delete any old caches that are not in the cacheWhitelist.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }))
    )
  );
});
