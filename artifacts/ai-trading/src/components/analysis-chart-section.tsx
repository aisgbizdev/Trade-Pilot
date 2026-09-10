import { useCallback, useState } from "react";
import { Maximize2, AlertTriangle, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TradingViewSymbolOverview } from "@/components/tradingview-symbol-overview";
import { TradingViewAdvancedChart } from "@/components/tradingview-advanced-chart";
import { AnalysisLevelsChart } from "@/components/analysis-levels-chart";
import {
  instrumentToTradingViewSymbol,
  timeframeToTradingViewInterval,
} from "@/lib/tradingview-symbols";
import { useTranslation } from "@/lib/i18n";
import type { TradePlan } from "@workspace/api-client-react";
import type { LiveQuote } from "@/hooks/use-live-quotes";
import { cn } from "@/lib/utils";

interface AnalysisChartSectionProps {
  instrument: string;
  timeframe: string;
  tradePlan?: TradePlan | null;
  // Wall-clock time the analysis was generated. Passed down so the
  // levels chart can mark "AI saw up to here" on the time axis.
  analysisCreatedAt?: string | Date | null;
  liveQuote?: LiveQuote;
  liveQuoteReceivedAt?: number;
}

export const LIVE_QUOTE_STALE_AFTER_MS = 20_000;

function formatLivePrice(price: number, instrument: string): string {
  if (!Number.isFinite(price)) return "—";
  if (instrument === "USD/IDR") return price.toFixed(0);
  if (
    instrument === "USD/JPY" ||
    instrument.includes("BRENT") ||
    instrument === "XAU/USD" ||
    instrument === "XAG/USD"
  ) {
    return price.toFixed(2);
  }
  if (instrument === "DXY") return price.toFixed(3);
  if (price >= 1_000) {
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  return price.toFixed(4);
}

function ChartQuote({
  instrument,
  quote,
  receivedAt,
}: {
  instrument: string;
  quote?: LiveQuote;
  receivedAt?: number;
}) {
  const { t, lang } = useTranslation();
  const timestamp = receivedAt && receivedAt > 0 ? receivedAt : null;
  const stale = !!quote && (!timestamp || Date.now() - timestamp > LIVE_QUOTE_STALE_AFTER_MS);
  const rawChange = quote ? Number.parseFloat(quote.changePercent.replace("%", "")) : 0;
  const flat = !Number.isFinite(rawChange) || rawChange === 0;
  const direction = flat ? "flat" : quote?.direction === "down" ? "down" : "up";
  const DirectionIcon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  const updatedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString(lang === "id" ? "id-ID" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  if (!quote) {
    return (
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5" data-testid="chart-live-quote">
        <span className="text-xs font-bold text-foreground">{instrument}</span>
        <span className="text-xs text-muted-foreground" data-testid="chart-live-quote-unavailable">
          {t.analysis_detail.chart_quote_unavailable}
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5" data-testid="chart-live-quote">
      <span className="text-xs font-bold text-foreground">{instrument}</span>
      <span className="font-mono text-base font-black tabular-nums text-foreground" data-testid="chart-live-quote-price">
        {formatLivePrice(quote.price, instrument)}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-0.5 text-[11px] font-bold",
          stale && "text-muted-foreground",
          !stale && direction === "up" && "text-emerald-600 dark:text-emerald-400",
          !stale && direction === "down" && "text-red-600 dark:text-red-400",
          !stale && direction === "flat" && "text-muted-foreground",
        )}
        aria-label={t.analysis_detail[`chart_quote_${direction}`]}
        data-testid="chart-live-quote-direction"
      >
        <DirectionIcon className="h-3 w-3" aria-hidden="true" />
        {quote.changePercent}
      </span>
      <span
        className={cn(
          "text-[10px]",
          stale ? "font-semibold text-amber-600 dark:text-amber-400" : "text-muted-foreground",
        )}
        data-testid={stale ? "chart-live-quote-stale" : "chart-live-quote-fresh"}
      >
        {stale
          ? `${t.analysis_detail.chart_quote_stale}${updatedTime ? ` · ${updatedTime}` : ""}`
          : t.analysis_detail.chart_quote_updated.replace("{time}", updatedTime ?? "—")}
      </span>
    </div>
  );
}

// Timeframes the backend `/historical/candles` endpoint supports. Keep in
// sync with SUPPORTED_INDICATOR_TIMEFRAMES on the server. Outside this set
// (e.g. weird legacy values), we fall back to the TradingView widget so the
// chart still renders — just without the trade-plan overlay.
const LEVELS_SUPPORTED_TIMEFRAMES = new Set([
  "1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W",
]);

export function AnalysisChartSection({
  instrument,
  timeframe,
  tradePlan = null,
  analysisCreatedAt = null,
  liveQuote,
  liveQuoteReceivedAt,
}: AnalysisChartSectionProps) {
  const { t } = useTranslation();
  const [overviewFailed, setOverviewFailed] = useState<string | null>(null);
  const [advancedFailed, setAdvancedFailed] = useState<string | null>(null);
  const [levelsInlineFailed, setLevelsInlineFailed] = useState<string | null>(null);
  const [levelsModalFailed, setLevelsModalFailed] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const tvSymbol = instrumentToTradingViewSymbol(instrument);
  const tvInterval = timeframeToTradingViewInterval(timeframe);

  const handleOverviewFail = useCallback((reason: string) => {
    setOverviewFailed(reason);
  }, []);
  const handleAdvancedFail = useCallback((reason: string) => {
    setAdvancedFailed(reason);
  }, []);
  const handleLevelsInlineFail = useCallback((reason: string) => {
    setLevelsInlineFailed(reason);
  }, []);
  const handleLevelsModalFail = useCallback((reason: string) => {
    setLevelsModalFailed(reason);
  }, []);

  // Use the self-rendered lightweight-charts view whenever a trade plan is
  // present AND the timeframe is one our backend can serve OHLC for. That's
  // the only path that can draw entry/SL/TP price lines directly on the
  // chart. Everything else falls back to TradingView's free embed (which
  // can't host custom drawings).
  const canRenderLevels =
    !!tradePlan && LEVELS_SUPPORTED_TIMEFRAMES.has(timeframe);
  const inlineUsesLevels = canRenderLevels && !levelsInlineFailed;
  const modalUsesLevels = canRenderLevels && !levelsModalFailed;

  return (
    <Card
      className="p-3 space-y-2"
      data-testid="card-analysis-chart"
      data-tv-symbol={tvSymbol}
      data-tv-interval={tvInterval}
      data-has-trade-plan={tradePlan ? "true" : "false"}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-0.5">
          <h3 className="text-sm font-bold text-foreground">
            {t.analysis_detail.chart_section_title}
          </h3>
          <ChartQuote instrument={instrument} quote={liveQuote} receivedAt={liveQuoteReceivedAt} />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setAdvancedFailed(null);
            setLevelsModalFailed(null);
            setOpen(true);
          }}
          data-testid="button-open-full-chart"
          className="h-7 shrink-0 px-2 text-xs gap-1"
        >
          <Maximize2 className="w-3 h-3" />
          {t.analysis_detail.chart_open_full}
        </Button>
      </div>

      {inlineUsesLevels ? (
        <div className="h-[260px]">
          <AnalysisLevelsChart
            instrument={instrument}
            timeframe={timeframe}
            tradePlan={tradePlan}
            analysisCreatedAt={analysisCreatedAt}
            height="100%"
            onLoadFailed={handleLevelsInlineFail}
          />
        </div>
      ) : overviewFailed ? (
        <div
          className="flex items-start gap-2 p-3 rounded-md border border-dashed border-border bg-muted/40"
          data-testid="chart-overview-fallback"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t.analysis_detail.chart_unavailable}
          </p>
        </div>
      ) : (
        <TradingViewSymbolOverview
          symbol={tvSymbol}
          displayName={instrument}
          onLoadFailed={handleOverviewFail}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[100vw] w-screen h-[100dvh] sm:h-[90vh] sm:max-w-5xl p-3 sm:p-4 sm:rounded-lg rounded-none flex flex-col gap-2"
          data-testid="dialog-full-chart"
        >
          <DialogHeader className="space-y-1 pr-8">
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <span>{instrument}</span>
              <span className="text-xs font-normal text-muted-foreground">
                · {timeframe}
              </span>
            </DialogTitle>
            <ChartQuote instrument={instrument} quote={liveQuote} receivedAt={liveQuoteReceivedAt} />
          </DialogHeader>
          <div className="flex-1 min-h-0">
            {modalUsesLevels ? (
              <div className="h-full w-full">
                <AnalysisLevelsChart
                  instrument={instrument}
                  timeframe={timeframe}
                  tradePlan={tradePlan}
                  analysisCreatedAt={analysisCreatedAt}
                  height="100%"
                  onLoadFailed={handleLevelsModalFail}
                />
              </div>
            ) : advancedFailed ? (
              <div
                className="h-full flex items-center justify-center p-6 rounded-md border border-dashed border-border bg-muted/40"
                data-testid="chart-advanced-fallback"
              >
                <div className="flex flex-col items-center gap-2 text-center max-w-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.analysis_detail.chart_unavailable}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full">
                <TradingViewAdvancedChart
                  symbol={tvSymbol}
                  interval={tvInterval}
                  height="100%"
                  onLoadFailed={handleAdvancedFail}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
