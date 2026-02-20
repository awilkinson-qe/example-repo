//sw.js
/* I used GitHub Copilot, VS Code IntelliSense, and ChatGPT for help with each step, debugging, and clearer comments. */

// Step 5: Implement caching for static resources
// Cache product images and static files (HTML, CSS, and JS)
// Notify the user of cached content 'page is using cached
// product images or styles to speed up loading.'

const CACHE_NAME = "my-cache";

// Install event runs when the service worker is first installed (or replaced)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["./index.html", "./styles.css", "./main.js", "./images/keyboard.jpg", "./images/headphones.jpg", "./images/monitor.jpg", "./images/desk.jpg", "./images/book.jpg",]);
    })
  );
});

// Fetch event runs for each network request - cache first then network if not cached
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => {
          return new Response("", { status: 504, statusText: "Offline" });
        })
      );
    })
  );
});
