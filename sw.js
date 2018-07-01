const cacheName = 'currency-converter';
const repo = 'wedeycurrencyconverter';
const filesToCache = [
    `/${repo}/`,
    `/${repo}/index.html`,
    `/${repo}/css/bootstrap.min.css`,
    `/${repo}/css/style.css`,
    `/${repo}/index.js`,
    `/${repo}/lib/idb.js`,
    `/${repo}/services/dataService.js`,
    `/${repo}/services/idbService.js`
];

// Cache resources
self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(cacheName).then(function (cache) {
        console.log('[ServiceWorker] installing cache');
        return cache.addAll(filesToCache)
      }).then(function(){
        console.log('app shell cached successfully');
      })
      .catch(function(err){
        console.log(err);
      })
    )
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });
  


  //Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request;
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request);
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})




