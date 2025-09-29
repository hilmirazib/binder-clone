// Binder Web Service Worker - Basic PWA functionality
// Version: 1.0.0

const CACHE_NAME = "binder-web-v1";
const OFFLINE_URL = "/offline";

// Resources to cache for offline functionality
const CACHE_RESOURCES = [
  "/",
  "/space",
  "/you",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching app resources");
        return cache.addAll(CACHE_RESOURCES);
      })
      .then(() => {
        console.log("[SW] Skip waiting");
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("[SW] Taking control of all clients");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve cached resources when offline
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip non-HTTP requests
  if (!event.request.url.startsWith("http")) return;

  // Skip API requests (let them fail gracefully)
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("supabase.co")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If request is successful, update cache and return response
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // For navigation requests, serve offline page
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }

          // For other requests, return basic error response
          return new Response("Offline", {
            status: 408,
            statusText: "Offline",
          });
        });
      }),
  );
});

// Background sync for messages (future feature)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync-messages") {
    console.log("[SW] Background sync: messages");
    // Implementation for offline message queue
  }
});

// Push notifications (future feature)
self.addEventListener("push", (event) => {
  console.log("[SW] Push message received:", event);

  if (event.data) {
    const data = event.data.json();

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        tag: "binder-notification",
        requireInteraction: false,
        actions: [
          {
            action: "view",
            title: "View",
            icon: "/icons/action-view.png",
          },
          {
            action: "dismiss",
            title: "Dismiss",
          },
        ],
      }),
    );
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(self.clients.openWindow("/space"));
  }
});
