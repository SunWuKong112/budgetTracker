const CACHE_NAME = "static-cache";
const DATA_CACHE_NAME = "data-cache-v1";

const iconSizes = ["192","512"]
const iconFiles = iconSizes.map(
     (size)=> "/assets/images/icons/icon"
);

const FILES_TO_CACHE = [
     "/",
     "/index.js",
     "/index.html",
     "/styles.css",
     "/manifest.webmanifest",

     "/icons/icon-192x192.png",
     "/icons/icon-512x512.png"
]

//Call install evenet
self.addEventListener('install', (e)=>{
     console.log("Service worker: Installed");
     e.waitUntil(
          caches
               .open(CACHE_NAME)
               .then(cache=>{
                    console.log(`Service worker: caching files
                    ${JSON.stringify(cache)}`);
                    cache.addAll(FILES_TO_CACHE);
               })
               .then(()=>{
                    self.skipWaiting();
               })
     );
});

// Call activate event
self.addEventListener("activate", e=>{
     e.waitUntil(
          caches.keys().then(keylist=>{
               return Promise.all(
                    keylist.map(cache=>{
                         if(cache !== CACHE_NAME){
                              console.log(`Service worker: Clearing old cache
                              ${JSON.stringify(cache)}`);
                              return caches.delete(cache);
                         }
                    })
               )
          })
     );
});

//Call fetch event
self.addEventListener("fetch", function(evt) {
     // cache successful requests to the API
     if (evt.request.url.includes("/api/")) {
          evt.respondWith(
               caches.open(DATA_CACHE_NAME).then(cache => {
                    return fetch(evt.request)
                         .then(response => {
                              // If the response was good, clone it and store it in the cache.
                              if (response.status === 200) {
                                   cache.put(evt.request.url, response.clone());
                              }
   
                         return response;
                    })
                    .catch(err => {
                         // Network request failed, try to get it from the cache.
                         return cache.match(evt.request);
                    });
               }).catch(err => console.log(err))
          );
   
          return;
     }
   
     // if the request is not for the API, serve static assets using "offline-first" approach.
     // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
     evt.respondWith(
          caches.match(evt.request).then(function(response) {
               return response || fetch(evt.request);
          })
     );
});

//    self.addEventListener("fetch", e=>{
//      const { url } = e.request;
//      if(url.includes("/all") || url.includes("/find")){
//           return response || fetch(e.response);
//      }
//      e.respondWith(
//           caches.match(e.request).then(function(response) {
//                return respone || fetch(e.request);
//           })
//      );
// });