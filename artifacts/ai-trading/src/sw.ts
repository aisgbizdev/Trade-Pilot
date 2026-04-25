/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
self.skipWaiting();
clientsClaim();

registerRoute(
  ({ url }: { url: URL }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({ cacheName: "api-cache", networkTimeoutSeconds: 10 })
);

registerRoute(
  ({ request }: { request: Request }) =>
    ["style", "script", "worker", "image", "font"].includes(request.destination),
  new CacheFirst({ cacheName: "static-assets" })
);

const offlineHandler = createHandlerBoundToURL(import.meta.env.BASE_URL + "offline.html");
registerRoute(
  new NavigationRoute(offlineHandler, {
    denylist: [/^\/api\//],
  })
);

self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;
  const data = event.data.json() as {
    title: string;
    body: string;
    url?: string;
    tag?: string;
  };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: import.meta.env.BASE_URL + "icon-192.png",
      badge: import.meta.env.BASE_URL + "icon-192.png",
      tag: data.tag ?? "ai-trading",
      data: { url: data.url ?? import.meta.env.BASE_URL },
    })
  );
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const notifUrl: string =
    (event.notification.data as { url?: string })?.url ?? import.meta.env.BASE_URL;
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            void (client as WindowClient).focus();
            return;
          }
        }
        return self.clients.openWindow(notifUrl);
      })
  );
});
