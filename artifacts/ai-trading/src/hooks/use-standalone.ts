import { useEffect, useState } from "react";

/**
 * Detects PWA install state + iOS Safari, both of which matter for the
 * "enable push notifications" UX:
 *
 * - `standalone` — true once the user opens Trade Pilot from the Home
 *   Screen (or via Chromium's "Open in app" mode). On iOS this is the
 *   ONLY environment in which Web Push is even allowed.
 * - `isIos` — true on iPhone / iPad Safari. We use this to surface the
 *   "Share → Add to Home Screen" explainer, because iOS does not fire
 *   `beforeinstallprompt` so we cannot trigger an install dialog.
 *
 * Returns stable booleans rather than re-evaluating on every render so
 * components don't thrash when other state changes.
 */
export function useStandalone() {
  const [standalone, setStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent || "";
    // iPadOS 13+ reports as "MacIntel" with touch support — detect that
    // separately so iPad Safari is not mistaken for desktop Safari.
    const isIPad =
      /Macintosh/.test(ua) &&
      typeof navigator.maxTouchPoints === "number" &&
      navigator.maxTouchPoints > 1;
    const iOS = /iPad|iPhone|iPod/.test(ua) || isIPad;
    setIsIos(iOS);

    const mql = window.matchMedia?.("(display-mode: standalone)");
    // Safari historically exposes `navigator.standalone` for installed
    // home-screen PWAs; the standardised `display-mode` media query
    // covers everyone else.
    const navStandalone =
      typeof (window.navigator as Navigator & { standalone?: boolean }).standalone === "boolean"
        ? (window.navigator as Navigator & { standalone?: boolean }).standalone === true
        : false;
    setStandalone(Boolean(mql?.matches) || navStandalone);

    if (!mql) return;
    const onChange = (e: MediaQueryListEvent) => setStandalone(e.matches);
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Safari < 14 fallback.
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return { standalone, isIos };
}
