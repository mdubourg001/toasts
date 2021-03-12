// @ts-nocheck

importScripts(
  "https://cdn.jsdelivr.net/npm/idb-keyval@5.0.4/dist/iife/index-min.js"
);

const { get, set } = idbKeyval;

const CACHE_KEY = "v2";
const ISS_POS_CACHE_KEY = "iss_pos";
const NOT_TO_CACHE = ["http://api.open-notify.org/iss-now.json"];

self.addEventListener("install", (event) => {
  console.log("Installing Service Worker...");

  event.waitUntil(caches.open(CACHE_KEY).then((cache) => cache.addAll(["/"])));
});

self.addEventListener("activate", (event) => {
  // delete any caches that aren't the current cache
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_KEY) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  // trying to fetch the ISS position from network, fallback to cache
  if (event.request.url === "http://api.open-notify.org/iss-now.json") {
    return event.respondWith(
      fetch(event.request.url).then(
        (response) => {
          response
            .clone()
            .json()
            .then((data) =>
              set(ISS_POS_CACHE_KEY, {
                ...data,
                timestamp: Math.floor(Date.now() / 1000),
              })
            );

          return response;
        },
        () =>
          new Promise((fullfill) =>
            get(ISS_POS_CACHE_KEY).then((value) =>
              fullfill(
                new Response(
                  JSON.stringify(
                    value ?? { timestamp: Math.floor(Date.now() / 1000) }
                  )
                )
              )
            )
          )
      )
    );
  }

  return event.respondWith(
    caches.open(CACHE_KEY).then((cache) =>
      cache.match(event.request).then((matching) => {
        // if we do have the ressource in cache, serving it without fetching
        if (matching) {
          console.log(`Serving ${event.request.url} from cache...`);

          return matching;
        }

        // if we don't have ressource in cache, fetching the ressource from network
        else {
          if (!event.request.url.startsWith("chrome-extension://")) {
            return fetch(event.request.url).then((response) => {
              if (response.ok && !NOT_TO_CACHE.includes(event.request.url)) {
                console.log(`Caching ${event.request.url}...`);
                //cache.put(event.request, response.clone());
              }

              return response;
            });
          }
        }
      })
    )
  );
});
