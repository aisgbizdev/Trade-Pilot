import { useEffect, useRef, useState, useDeferredValue } from "react";
import { WifiOff } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "@/lib/i18n";

export type MiniChartDateRange = "1D" | "1W" | "1M" | "3M" | "1Y";

interface TradingViewMiniChartProps {
  symbol: string;
  dateRange?: MiniChartDateRange;
  height?: number;
  loadTimeoutMs?: number;
}

const SCRIPT_SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";

const DATE_RANGE_TO_TV: Record<MiniChartDateRange, string> = {
  "1D": "1D",
  "1W": "5D",
  "1M": "1M",
  "3M": "3M",
  "1Y": "12M",
};

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

function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

export function TradingViewMiniChart({
  symbol,
  dateRange = "1M",
  height = 180,
  loadTimeoutMs = 6000,
}: TradingViewMiniChartProps) {
  const { theme } = useTheme();
  const deferredTheme = useDeferredValue(theme);
  const { lang, t } = useTranslation();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [loadState, setLoadState] = useState<"pending" | "loaded" | "failed">(
    "pending",
  );
  const online = useOnlineStatus();
  const effectiveLoadTimeoutMs = resolveLoadTimeout(loadTimeoutMs);

  useEffect(() => {
    if (!online) return;
    const hostEl = hostRef.current;
    if (!hostEl) return;

    setLoadState("pending");

    const colorTheme = resolveColorTheme(deferredTheme);
    const widgetLocale = lang === "id" ? "id" : "en";

    const config = {
      symbol,
      width: "100%",
      height,
      locale: widgetLocale,
      dateRange: DATE_RANGE_TO_TV[dateRange],
      colorTheme,
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
      chartOnly: false,
      noTimeScale: false,
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
    link.href = `https://www.tradingview.com/symbols/${encodeURIComponent(symbol)}/`;
    link.rel = "noopener nofollow";
    link.target = "_blank";
    const linkSpan = document.createElement("span");
    linkSpan.className = "text-primary hover:underline";
    linkSpan.textContent = `${symbol} on TradingView`;
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
      setLoadState("failed");
    };

    const markLoaded = () => {
      if (cancelled || failed) return;
      cleanup();
      hostEl.dataset["loadState"] = "loaded";
      setLoadState("loaded");
    };

    const isPopulated = () =>
      widgetInner.childElementCount > 0 ||
      hostEl.querySelector("iframe") !== null;

    script.onerror = (event) => {
      const detail =
        typeof event === "string" ? event : (event as Event)?.type ?? "unknown";
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
  }, [symbol, dateRange, height, effectiveLoadTimeoutMs, deferredTheme, lang, online]);

  if (!online) {
    return (
      <div
        className="w-full rounded-lg border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1.5 text-center px-4"
        style={{ height: `${height}px` }}
        data-testid="tradingview-mini-chart-offline"
      >
        <WifiOff className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs text-muted-foreground leading-snug">
          {t.widgets.mini_chart_offline}
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full relative"
      style={{ minHeight: `${height}px` }}
      data-testid="tradingview-mini-chart-wrapper"
    >
      {loadState === "pending" && (
        <div
          className="absolute inset-0 rounded-lg bg-muted/40 animate-pulse"
          style={{ height: `${height}px` }}
          aria-hidden="true"
          data-testid="tradingview-mini-chart-skeleton"
        />
      )}
      <div
        ref={hostRef}
        style={{ width: "100%" }}
        data-testid="tradingview-mini-chart"
        data-symbol={symbol}
        data-date-range={dateRange}
        data-load-state={loadState}
      />
    </div>
  );
}
