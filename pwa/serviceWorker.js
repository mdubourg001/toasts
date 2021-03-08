const CACHE_KEY = "v1";

self.addEventListener("install", (event) => {
  console.log("Installing Service Worker...");
  console.debug(event);

  //event.waitUntil(precache());
});

self.addEventListener("fetch", (event) => {
  console.log("Intercepting fetch...");
  console.debug(event);

  //event.respondWith(fromCache(event.request));
});

// ----- utils -----

function precache() {
  return caches.open(CACHE_KEY).then(function (cache) {
    return cache.addAll([]);
  });
}

function fromCache(request) {
  return caches.open(CACHE_KEY).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject("no-match");
    });
  });
}
