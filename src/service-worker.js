const CACHE_NAME = 'vario-cache-v1';
const urlsToCache = [
  '/vario/dev/',
  '/vario/dev/index.html',
  '/vario/dev/scripts/altitudeOnlyGPS.js',
  '/vario/dev/assets/compass.png',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  '/vario/dev/assets/favicon.ico',
  '/vario/dev/assets/marker.png',
  '/vario/dev/assets/paraglider.png',

];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache-v1').then(async (cache) => {
      return cache.addAll([
        '/',
        '/styles/main.css',
        '/script/main.js',
        // Add more resources here
      ]).catch((error) => {
        console.error('Failed to cache resources:', error);
      });
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
