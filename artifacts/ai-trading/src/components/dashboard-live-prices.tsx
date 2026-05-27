import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  Loader2,
  Minus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiveQuotes } from "@/hooks/use-live-quotes";
import { useTranslation } from "@/lib/i18n";
import { WatchlistStar } from "@/components/watchlist-star";
import { SHOW_NEWSMAKER } from "@/lib/newsmaker-flag";
import {
  TradingViewMarketQuotes,
  type TradingViewSymbol,
} from "@/components/tradingview-market-quotes";

const TRADINGVIEW_SYMBOLS: TradingViewSymbol[] = [
  { name: "OANDA:XAUUSD", displayName: "Gold" },
  { name: "BLACKBULL:BRENT", displayName: "Brent" },
  { name: "VANTAGE:HK50", displayName: "Hang Seng" },
  { name: "SPREADEX:NIKKEI", displayName: "Nikkei" },
  { name: "OANDA:AUDUSD", displayName: "Aussie" },
  { name: "OANDA:EURUSD", displayName: "Euro" },
  { name: "OANDA:GBPUSD", displayName: "Pound" },
  { name: "OANDA:USDCHF", displayName: "Swissy" },
  { name: "OANDA:USDJPY", displayName: "Yen" },
];

const FALLBACK_INSTRUMENTS = [
  "XAU/USD",
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "BRENT",
  "DXY",
  "USD/IDR",
];

function formatPrice(price: number, instrument: string): string {
  if (instrument === "USD/IDR") return price.toLocaleString("id-ID");
  if (instrument === "USD/JPY") return price.toFixed(2);
  if (instrument === "XAU/USD") return price.toFixed(2);
  if (["BRENT"].includes(instrument)) return price.toFixed(2);
  if (price > 1000)
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return price.toFixed(4);
}

function FallbackTicker() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch, isFetching } = useLiveQuotes();

  const quotes = data?.data
    .filter((q) => FALLBACK_INSTRUMENTS.includes(q.instrument))
    .sort(
      (a, b) =>
        FALLBACK_INSTRUMENTS.indexOf(a.instrument) -
        FALLBACK_INSTRUMENTS.indexOf(b.instrument),
    );

  return (
    <div data-testid="live-prices-fallback">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] text-amber-600 dark:text-amber-400 font-medium"
          data-testid="fallback-source-label"
        >
          {SHOW_NEWSMAKER
            ? t.dashboard.live_price_fallback_label
            : t.dashboard.live_price_fallback_label_generic}
        </span>
        <div className="flex items-center gap-1.5">
          {data?.serverTime && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {data.serverTime} UTC
            </span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label={t.dashboard.refresh_price}
          >
            <RefreshCw
              className={cn(
                "w-3.5 h-3.5 text-muted-foreground",
                isFetching && "animate-spin",
              )}
            />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">
            {t.dashboard.price_error}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {quotes?.map((q) => {
            const isUp = q.direction === "up";
            const isFlat =
              q.changePercent === "+0%" || q.changePercent === "0%";
            return (
              <Link
                key={q.instrument}
                href={`/analyze?instrument=${q.instrument}`}
              >
                <div
                  className={cn(
                    "relative p-3 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.97] border overflow-hidden group",
                    "bg-card hover:border-primary/30",
                    isFlat
                      ? "border-border"
                      : isUp
                        ? "border-emerald-500/20 hover:border-emerald-500/40"
                        : "border-red-500/20 hover:border-red-500/40",
                  )}
                  data-testid={`live-quote-${q.instrument}`}
                >
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      isUp
                        ? "bg-emerald-500/3"
                        : !isFlat
                          ? "bg-red-500/3"
                          : "",
                    )}
                  />
                  <div className="flex items-center justify-between mb-1.5 gap-1">
                    <span className="text-[11px] font-bold text-foreground tracking-tight">
                      {q.instrument}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center",
                          isFlat
                            ? "bg-muted"
                            : isUp
                              ? "bg-emerald-500/15"
                              : "bg-red-500/15",
                        )}
                      >
                        {isFlat ? (
                          <Minus className="w-3 h-3 text-muted-foreground" />
                        ) : isUp ? (
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                      <WatchlistStar instrument={q.instrument} size="sm" />
                    </div>
                  </div>
                  <div className="text-[15px] font-bold text-foreground tabular-nums leading-none mb-1">
                    {formatPrice(q.price, q.instrument)}
                  </div>
                  <div
                    className={cn(
                      "text-[10px] font-semibold",
                      isFlat
                        ? "text-muted-foreground"
                        : isUp
                          ? "text-emerald-500 dark:text-emerald-400"
                          : "text-red-500 dark:text-red-400",
                    )}
                  >
                    {q.changePercent}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1 font-mono">
                    B:{formatPrice(q.buy, q.instrument)} / S:
                    {formatPrice(q.sell, q.instrument)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const RETRY_DELAY_MS = 2000;
const MAX_ATTEMPTS = 2;
const WIDGET_HEIGHT = 340;

type LoadPhase = "loading" | "waiting-retry" | "fallback";

export function DashboardLivePrices() {
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState(1);
  const [phase, setPhase] = useState<LoadPhase>("loading");
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);
  const attemptRef = useRef(1);
  const phaseRef = useRef<LoadPhase>("loading");
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  // Refs are the single source of truth for the state machine. State setters
  // only trigger re-renders. handleLoadFailed avoids running side effects
  // inside a state-updater function (which React may invoke more than once
  // under StrictMode/concurrent rendering), and short-circuits noisy
  // duplicate failure callbacks that arrive after we already moved out of
  // the "loading" phase.
  const handleLoadFailed = useCallback((reason: string) => {
    if (phaseRef.current !== "loading") return;

    if (attemptRef.current < MAX_ATTEMPTS) {
      phaseRef.current = "waiting-retry";
      setPhase("waiting-retry");
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => {
        retryTimerRef.current = null;
        attemptRef.current += 1;
        phaseRef.current = "loading";
        setAttempt(attemptRef.current);
        setPhase("loading");
      }, RETRY_DELAY_MS);
      return;
    }

    phaseRef.current = "fallback";
    setFallbackReason(reason);
    setPhase("fallback");
  }, []);

  return (
    <div
      data-testid="dashboard-live-prices"
      data-fallback-reason={fallbackReason ?? ""}
      data-retry-attempt={attempt}
      data-load-phase={phase}
    >
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold text-foreground">
          {t.dashboard.live_price}
        </h2>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
            LIVE
          </span>
        </div>
      </div>

      {phase === "fallback" ? (
        <FallbackTicker />
      ) : phase === "waiting-retry" ? (
        <div
          className="flex items-center justify-center rounded-xl border border-dashed border-border bg-card/40"
          style={{ height: WIDGET_HEIGHT }}
          data-testid="live-prices-retry-indicator"
        >
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-[10px] text-muted-foreground">
              {t.dashboard.live_price_retrying}
            </span>
          </div>
        </div>
      ) : (
        <TradingViewMarketQuotes
          key={attempt}
          symbols={TRADINGVIEW_SYMBOLS}
          height={WIDGET_HEIGHT}
          onLoadFailed={handleLoadFailed}
        />
      )}
    </div>
  );
}
