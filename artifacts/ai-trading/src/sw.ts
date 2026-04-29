/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

cleanupOutdatedCaches();

// In dev (`devOptions: enabled: true`), vite-plugin-pwa substitutes
// `__WB_MANIFEST` with a stub (e.g. `[{ url: '/index.html' }]`) that does
// not include `offline.html`. Calling `createHandlerBoundToURL` for a URL
// that isn't in the precache throws and aborts the entire SW evaluation,
// which would also kill the `push` handler we need for testing. Only wire
// the offline navigation fallback in production builds.
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

if (!import.meta.env.DEV) {
  const offlineHandler = createHandlerBoundToURL(import.meta.env.BASE_URL + "offline.html");
  registerRoute(
    new NavigationRoute(offlineHandler, {
      denylist: [/^\/api\//],
    })
  );
}

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
  // Resolve the click destination against the SW scope so per-callsite
  // `url: "/notifications"` opens at the right artifact base path
  // (e.g. /artifacts/ai-trading/notifications).
  const targetUrl = new URL(notifUrl, self.registration.scope).href;
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clientList) => {
        // Prefer an already-open app window: navigate it to the target URL
        // and focus it, so retention warnings land on /notifications even
        // when the user already has the dashboard open.
        for (const client of clientList) {
          const win = client as WindowClient;
          if ("focus" in win) {
            try {
              if ("navigate" in win && win.url !== targetUrl) {
                await win.navigate(targetUrl);
              }
            } catch {
              // Cross-origin navigates throw; just focus the existing window.
            }
            await win.focus();
            return;
          }
        }
        await self.clients.openWindow(targetUrl);
      })
  );
});
