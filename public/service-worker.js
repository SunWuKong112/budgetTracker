const iconSizes = ["192","512"]
const iconFiles = iconSizes.map(
     (size)=> "/assets/images/icons/icon"
);

const FILES_TO_CACHE = [
     "/",
     "/index.js",
     "/index.html",
     "/manifest.webmanifest",

     "/icons/icon-192x192.png",
     "/icons/icon-512x512.png"
]

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("")

self.addEventListener("activate", function(evt) {
     evt.waitUntil(
          caches.keys().then(keylist=>{}));

     self.clients.claim();
});

self.addEventListener("fetch", function(evt) {
     const { url } = evt.request;
     if(url.includes("/all") || url.includes("/find")){
          return response || fetch(evt.response);
     }
     evt.respondWith(
          caches.match(evt.request).then(function(response) {
               return respone || fetch(evt.request);
          })
     );
});