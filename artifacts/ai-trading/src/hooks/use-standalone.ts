import { useEffect, useState } from "react";

export function useStandalone() {
  const [standalone, setStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent || "";
    // iPadOS 13+ reports as Mac; disambiguate via touch points.
    const isIPad =
      /Macintosh/.test(ua) &&
      typeof navigator.maxTouchPoints === "number" &&
      navigator.maxTouchPoints > 1;
    const iOS = /iPad|iPhone|iPod/.test(ua) || isIPad;
    setIsIos(iOS);

    const mql = window.matchMedia?.("(display-mode: standalone)");
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
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return { standalone, isIos };
}
