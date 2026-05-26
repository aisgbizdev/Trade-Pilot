import { useCallback, useState } from "react";
import { Maximize2, AlertTriangle } from "lucide-react";
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

interface AnalysisChartSectionProps {
  instrument: string;
  timeframe: string;
  tradePlan?: TradePlan | null;
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
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">
          {t.analysis_detail.chart_section_title}
        </h3>
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
          className="h-7 px-2 text-xs gap-1"
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
          <DialogHeader className="space-y-0 pr-8">
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <span>{instrument}</span>
              <span className="text-xs font-normal text-muted-foreground">
                · {timeframe}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            {modalUsesLevels ? (
              <div className="h-full w-full">
                <AnalysisLevelsChart
                  instrument={instrument}
                  timeframe={timeframe}
                  tradePlan={tradePlan}
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
