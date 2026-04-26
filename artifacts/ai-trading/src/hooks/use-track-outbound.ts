import { useCallback } from "react";
import type {
  OutboundClickBodyPlacement,
  OutboundClickBodyTarget,
} from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";

// API base URL is the Vite-injected base path. Mirrors the convention used
// elsewhere in this app (BASE_URL is always trailing-slashed).
const API_PATH = `${import.meta.env.BASE_URL}api/events/outbound-click`;

// Tiny helper that sends a fire-and-forget click ping. We deliberately bypass
// the generated `recordOutboundClick` axios mutation because:
//   1. Most callers are anchor `onClick`s on `target="_blank"` links. Plain
//      `fetch` is best-effort and gets cancelled when the originating context
//      is backgrounded — measurable loss on mobile/webview.
//   2. `navigator.sendBeacon` was designed exactly for this case: the browser
//      queues the request and guarantees delivery even after the page is
//      unloaded or backgrounded.
// `fetch` with `keepalive: true` is the documented fallback when sendBeacon
// is unavailable or refuses the payload (some browsers reject blobs > 64KB).
// Errors are swallowed end-to-end — analytics must never crash the UI.
function sendBeaconPayload(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(API_PATH, blob)) return;
    }
  } catch {
    /* fall through to keepalive fetch */
  }
  try {
    void fetch(API_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {});
  } catch {
    /* swallow */
  }
}

export function useTrackOutbound() {
  const { lang } = useTranslation();

  return useCallback(
    (placement: OutboundClickBodyPlacement, target: OutboundClickBodyTarget) => {
      sendBeaconPayload({ placement, target, lang });
    },
    [lang],
  );
}
