import { useState, useEffect, useCallback } from "react";

type PushState = "idle" | "requesting" | "subscribed" | "unsubscribed" | "denied" | "unsupported" | "error";

const SW_READY_TIMEOUT_MS = 15_000;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buf = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < rawData.length; i++) view[i] = rawData.charCodeAt(i);
  return view;
}

async function ensureServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  const base = import.meta.env.BASE_URL || "/";
  const existing = await navigator.serviceWorker.getRegistration();
  if (!existing) {
    try {
      await navigator.serviceWorker.register(`${base}sw.js`, { scope: base });
    } catch (err) {
      console.error("[push] manual service worker registration failed", err);
      throw err;
    }
  }
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Service worker did not become ready in time")),
        SW_READY_TIMEOUT_MS,
      ),
    ),
  ]);
}

async function getVapidPublicKey(): Promise<string> {
  const res = await fetch("/api/push/public-key", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch VAPID public key");
  const data = (await res.json()) as { publicKey: string };
  return data.publicKey;
}

async function saveSubscription(sub: PushSubscriptionJSON): Promise<void> {
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: sub.endpoint,
      keys: { p256dh: sub.keys?.p256dh, auth: sub.keys?.auth },
    }),
  });
  if (!res.ok) throw new Error("Failed to save subscription");
}

async function deleteSubscription(endpoint: string): Promise<void> {
  await fetch("/api/push/unsubscribe", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });
}

export function usePush() {
  const [state, setState] = useState<PushState>("idle");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }

    const permission = Notification.permission;
    if (permission === "denied") {
      setState("denied");
      return;
    }

    ensureServiceWorkerRegistration()
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (sub) {
          setSubscription(sub);
          setState("subscribed");
        } else {
          setState("unsubscribed");
        }
      })
      .catch((err) => {
        console.error("[push] initial subscription check failed", err);
        setState("unsubscribed");
      });
  }, []);

  const subscribe = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }

    setState("requesting");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const publicKey = await getVapidPublicKey();
      const reg = await ensureServiceWorkerRegistration();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      const json = sub.toJSON();
      await saveSubscription(json);
      setSubscription(sub);
      setState("subscribed");
    } catch (err) {
      console.error("[push] subscribe failed", err);
      setState("error");
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;
    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      await deleteSubscription(endpoint);
      setSubscription(null);
      setState("unsubscribed");
    } catch {
      setState("error");
    }
  }, [subscription]);

  return { state, subscription, subscribe, unsubscribe };
}
