import { useEffect, useRef, useState, useDeferredValue } from "react";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "@/lib/i18n";
import { LivePriceChip } from "@/components/live-price-chip";

/**
 * Small real-time "running price" for a single instrument, rendered by
 * TradingView's single-quote embed (streams live ticks over TradingView's
 * own socket, so the number moves tick-by-tick). Scaled down so it can
 * sit inline next to the timeframe chips / Compare Risk button.
 *
 * If the embed fails to load (blocked script, offline, unknown symbol)
 * it falls back to <LivePriceChip>, the poll-based chip on our own feed.
 */
const SCRIPT_SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";

const TV_SYMBOL: Record<string, string> = {
  "XAU/USD": "OANDA:XAUUSD",
  BRENT: "BLACKBULL:BRENT",
  HSI: "VANTAGE:HK50",
  NIKKEI: "SPREADEX:NIKKEI",
};

// Natural size of the single-quote widget, and how much we shrink it.
const NATURAL_W = 240;
const NATURAL_H = 126;
const SCALE = 0.5;

function resolveColorTheme(theme: string): "light" | "dark" {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function LivePriceTicker({
  instrument,
  className,
}: {
  instrument: string;
  className?: string;
}) {
  const tvSymbol = TV_SYMBOL[instrument];
  const { theme } = useTheme();
  const deferredTheme = useDeferredValue(theme);
  const { lang } = useTranslation();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl || !tvSymbol) return undefined;

    const config = {
      symbol: tvSymbol,
      width: "100%",
      isTransparent: true,
      colorTheme: resolveColorTheme(deferredTheme),
      locale: lang === "id" ? "id" : "en",
    };

    hostEl.innerHTML = "";
    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    container.appendChild(inner);
    hostEl.appendChild(container);

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.type = "text/javascript";
    script.async = true;
    script.appendChild(document.createTextNode(JSON.stringify(config)));
    script.onerror = () => setFailed(true);
    container.appendChild(script);

    let cancelled = false;
    const isPopulated = () =>
      inner.childElementCount > 0 || hostEl.querySelector("iframe") !== null;
    const failTimer = setTimeout(() => {
      if (!cancelled && !isPopulated()) setFailed(true);
    }, 6000);

    return () => {
      cancelled = true;
      clearTimeout(failTimer);
      hostEl.innerHTML = "";
    };
  }, [tvSymbol, deferredTheme, lang]);

  if (!tvSymbol || failed) {
    return <LivePriceChip instrument={instrument} className={className} />;
  }

  return (
    <div
      className={className}
      style={{
        width: NATURAL_W * SCALE,
        height: NATURAL_H * SCALE,
        overflow: "hidden",
      }}
      data-testid="live-price-ticker"
    >
      <div
        ref={hostRef}
        style={{
          width: NATURAL_W,
          height: NATURAL_H,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}
