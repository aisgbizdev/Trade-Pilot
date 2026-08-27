import { UAParser } from "ua-parser-js";

// Best-effort device/browser/OS + country resolution for analytics events
// (routes/events.ts `POST /events/track`). Both parsers here are pure,
// local/offline lookups — no external API calls, no added request latency
// beyond in-process work.
//
// `geoip-lite` bundles a multi-MB dataset that it loads into memory at
// require-time, so it's dynamically imported and cached on first use
// instead of being a top-level import — most requests never touch this
// module at all (only the analytics-event route does).
let geoipModule: typeof import("geoip-lite") | null = null;
async function loadGeoip(): Promise<typeof import("geoip-lite")> {
  if (!geoipModule) {
    geoipModule = (await import("geoip-lite")).default;
  }
  return geoipModule;
}

export interface ParsedDevice {
  deviceType: string; // "mobile" | "tablet" | "desktop" | other UAParser device types
  browser: string | null;
  os: string | null;
}

export function parseUserAgent(userAgent: string): ParsedDevice {
  if (!userAgent) {
    return { deviceType: "unknown", browser: null, os: null };
  }
  const result = new UAParser(userAgent).getResult();
  return {
    // UAParser leaves `device.type` undefined for plain desktop browsers —
    // only mobile/tablet/console/etc are explicitly typed.
    deviceType: result.device.type ?? "desktop",
    browser: result.browser.name ?? null,
    os: result.os.name ?? null,
  };
}

// Resolves a 2-letter ISO-3166-1 country code from an IP address. Returns
// null for private/local/unresolvable IPs (expected in local dev, where
// `req.ip` is typically ::1 or 127.0.0.1). The raw IP is intentionally
// never returned/persisted by this module — only the derived country.
export async function lookupCountry(ip: string | undefined): Promise<string | null> {
  if (!ip) return null;
  try {
    const geoip = await loadGeoip();
    const result = geoip.lookup(ip);
    return result?.country ?? null;
  } catch {
    return null;
  }
}
