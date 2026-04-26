import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "@/lib/i18n";

export interface TradingViewSymbol {
  name: string;
  displayName: string;
}

interface TradingViewMarketQuotesProps {
  symbols: TradingViewSymbol[];
  height?: number;
  onLoadFailed?: (reason: string) => void;
  loadTimeoutMs?: number;
}

const SCRIPT_SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";

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

export function TradingViewMarketQuotes({
  symbols,
  height = 410,
  onLoadFailed,
  loadTimeoutMs = 6000,
}: TradingViewMarketQuotesProps) {
  const { theme } = useTheme();
  const { lang } = useTranslation();
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl) return;

    const colorTheme = resolveColorTheme(theme);
    const widgetLang = lang;

    const config = {
      width: "100%",
      height,
      symbolsGroups: [
        {
          name: "Market Quotes",
          originalName: "Market Quotes",
          symbols: symbols.map((s) => ({
            name: s.name,
            displayName: s.displayName,
          })),
        },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      colorTheme,
      locale: widgetLang === "id" ? "id_ID" : "en",
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
    linkSpan.textContent = "Market summary by TradingView";
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

    const isPopulated = () => widgetInner.childElementCount > 0;

    script.onload = () => {
      hostEl.dataset["scriptLoaded"] = "true";
    };

    script.onerror = (event) => {
      const detail =
        typeof event === "string"
          ? event
          : (event as Event)?.type ?? "unknown";
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
    }, loadTimeoutMs);

    return () => {
      cancelled = true;
      cleanup();
      hostEl.innerHTML = "";
    };
    // Re-injecting on theme/lang/symbols change is intentional so the widget
    // reflects user toggles. The cleanup above clears the pending failTimeout,
    // so a dep change mid-load cannot trigger a spurious fallback.
  }, [height, loadTimeoutMs, onLoadFailed, theme, lang, symbols]);

  return (
    <div
      ref={hostRef}
      style={{ width: "100%" }}
      data-testid="tradingview-market-quotes"
      data-load-state="pending"
    />
  );
}
