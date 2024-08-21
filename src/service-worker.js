const CACHE_NAME = 'vario-cache-v1';
const urlsToCache = [
  '/vario/dev/',
  '/vario/dev/index.html',
  '/vario/dev/scripts/altitudeOnlyGPS.js',
  '/vario/dev/assets/img/compass.png',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  '/vario/dev/assets/favicon.ico',
  '/vario/dev/assets/marker.png',
  '/vario/dev/assets/paraglider.png',
];
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


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

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
