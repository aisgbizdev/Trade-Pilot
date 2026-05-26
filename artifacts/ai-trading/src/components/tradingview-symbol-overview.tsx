import { useEffect, useRef, useDeferredValue } from "react";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "@/lib/i18n";

interface TradingViewSymbolOverviewProps {
  symbol: string;
  displayName?: string;
  height?: number;
  onLoadFailed?: (reason: string) => void;
  loadTimeoutMs?: number;
}

const SCRIPT_SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";

function resolveColorTheme(theme: string): "light" | "dark" {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

function resolveLoadTimeout(propValue: number): number {
  if (typeof window === "undefined") return propValue;
  const override = window.__TV_LOAD_TIMEOUT_MS_OVERRIDE__;
  if (typeof override === "number" && override > 0) return override;
  return propValue;
}

export function TradingViewSymbolOverview({
  symbol,
  displayName,
  height = 240,
  onLoadFailed,
  loadTimeoutMs = 6000,
}: TradingViewSymbolOverviewProps) {
  const { theme } = useTheme();
  const deferredTheme = useDeferredValue(theme);
  const { lang } = useTranslation();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const effectiveLoadTimeoutMs = resolveLoadTimeout(loadTimeoutMs);
  const label = displayName ?? symbol;

  useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl) return;

    const colorTheme = resolveColorTheme(deferredTheme);
    const widgetLocale = lang === "id" ? "id" : "en";

    const config = {
      symbols: [[label, `${symbol}|3M`]],
      chartOnly: false,
      width: "100%",
      height,
      locale: widgetLocale,
      colorTheme,
      autosize: false,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "system-ui, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      isTransparent: true,
      dateRanges: ["1d|15", "1m|60", "3m|60", "12m|1D", "60m|1W", "all|1M"],
    };

    hostEl.innerHTML = "";
    hostEl.dataset["loadState"] = "pending";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.width = "100%";

    const widgetInner = document.createElement("div");
    widgetInner.className = "tradingview-widget-container__widget";
    widgetInner.style.width = "100%";
    widgetInner.style.height = `${height}px`;
    widgetContainer.appendChild(widgetInner);

    const copyright = document.createElement("div");
    copyright.className =
      "tradingview-widget-copyright text-[10px] text-muted-foreground text-center mt-1";
    const link = document.createElement("a");
    link.href = "https://www.tradingview.com/";
    link.rel = "noopener nofollow";
    link.target = "_blank";
    const linkSpan = document.createElement("span");
    linkSpan.className = "text-primary hover:underline";
    linkSpan.textContent = `${label} chart by TradingView`;
    link.appendChild(linkSpan);
    copyright.appendChild(link);
    widgetContainer.appendChild(copyright);

    hostEl.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.type = "text/javascript";
    script.async = true;
    script.appendChild(document.createTextNode(JSON.stringify(config)));
    widgetContainer.appendChild(script);

    let cancelled = false;
    let failed = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let failTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (pollInterval) clearInterval(pollInterval);
      if (failTimeout) clearTimeout(failTimeout);
      pollInterval = null;
      failTimeout = null;
    };

    const triggerFailure = (reason: string) => {
      if (cancelled || failed) return;
      failed = true;
      cleanup();
      hostEl.dataset["loadState"] = "failed";
      hostEl.dataset["loadError"] = reason;
      onLoadFailed?.(reason);
    };

    const markLoaded = () => {
      if (cancelled || failed) return;
      cleanup();
      hostEl.dataset["loadState"] = "loaded";
    };

    const isPopulated = () =>
      widgetInner.childElementCount > 0 ||
      hostEl.querySelector("iframe") !== null;

    script.onload = () => {
      hostEl.dataset["scriptLoaded"] = "true";
    };

    script.onerror = (event) => {
      const detail =
        typeof event === "string" ? event : (event as Event)?.type ?? "unknown";
      hostEl.dataset["scriptError"] = detail;
      triggerFailure(`script-error:${detail}`);
    };

    pollInterval = setInterval(() => {
      if (cancelled || failed) return;
      if (isPopulated()) markLoaded();
    }, 500);

    failTimeout = setTimeout(() => {
      if (cancelled || failed) return;
      if (!isPopulated()) {
        triggerFailure("timeout");
      } else {
        markLoaded();
      }
    }, effectiveLoadTimeoutMs);

    return () => {
      cancelled = true;
      cleanup();
      hostEl.innerHTML = "";
    };
  }, [
    symbol,
    label,
    height,
    effectiveLoadTimeoutMs,
    onLoadFailed,
    deferredTheme,
    lang,
  ]);

  return (
    <div
      ref={hostRef}
      style={{ width: "100%" }}
      data-testid="tradingview-symbol-overview"
      data-symbol={symbol}
      data-load-state="pending"
    />
  );
}
