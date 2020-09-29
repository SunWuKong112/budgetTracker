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
self.addEventListener("fetch", e=>{
     console.log("Service worker: fetching");
     e.respondWith(
          fetch(e.request).then((res)=>{
               const resClone = res.clone();
               cache
                    .open(CACHE_NAME)
                    .then(cache=>{
                         cache.put(e.request, resClone);
                    });
               return res;
          }).catch(()=>{
               caches
                    .match(e.request)
                    .then(res=> res);
          })
     );
});
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