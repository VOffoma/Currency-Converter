const cacheName = 'currency-converter';
const filesToCache = [
    '/',
    '/index.html',
    '/css/bootstrap.min.css',
    '/css/style.css',
    '/index.js',
    '/lib/idb.js',
    '/bootstrap.min.js',
    '/services/dataService.js',
    '/services/idbService.js'
];

self.addEventListener('install', function(e){
    console.log('[ServiceWorker] Install');
    e.waitUntil(
      caches.open(cacheName).then(function(cache){
          console.log('[ServiceWorker] Caching app shell');
          return cache.addAll(filesToCache);
      })
    );
})

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, {ignoreSearch: true}).then(response => {
            return response || fetch(event.request);
        })
    );
  });

