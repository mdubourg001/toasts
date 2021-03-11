// @ts-nocheck

const CACHE_KEY = "v1";

const NOT_TO_CACHE = ["http://api.open-notify.org/iss-now.json"];

self.addEventListener("install", (event) => {
  console.log("Installing Service Worker...");

  event.waitUntil(caches.open(CACHE_KEY).then((cache) => cache.addAll(["/"])));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_KEY).then((cache) =>
      cache.match(event.request).then((matching) => {
        // if we do have the ressource in cache, serving it without fetching
        if (matching) {
          console.log(`Serving ${event.request.url} from cache...`);

          return matching;
        }

        // if we don't, fetching the ressource from network
        else {
          if (!event.request.url.startsWith("chrome-extension://")) {
            return fetch(event.request.url).then((response) => {
              if (response.ok && !NOT_TO_CACHE.includes(event.request.url)) {
                console.log(`Caching ${event.request.url}...`);
                cache.put(event.request, response.clone());
              }

              return response;
            });
          }
        }
      })
    )
  );
});
