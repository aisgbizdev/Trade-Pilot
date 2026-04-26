import { useTechnicalIndicators, type IndicatorTimeframe } from "@/hooks/use-technical-indicators";
import { Loader2, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import {
  MarketContextSummary,
  leanFromCounts,
  type MarketContextLean,
} from "./market-context-summary";

type RawSignal = "Buy" | "Sell" | "Neutral";

function leanFromSignal(signal: RawSignal): MarketContextLean {
  if (signal === "Buy") return "bullish";
  if (signal === "Sell") return "bearish";
  return "neutral";
}

function SignalBadge({ signal, mode }: { signal: RawSignal; mode: "beginner" | "pro" }) {
  const { t } = useTranslation();
  const lean = leanFromSignal(signal);
  const descriptiveLabel =
    lean === "bullish" ? t.analyze.leaning_bullish :
    lean === "bearish" ? t.analyze.leaning_bearish :
    t.analyze.leaning_neutral;
  const rawLabel =
    signal === "Buy" ? t.analyze.signal_buy :
    signal === "Sell" ? t.analyze.signal_sell :
    t.analyze.signal_neutral;

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn(
        "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
        lean === "bullish" ? "bg-emerald-500/15 text-emerald-500" :
        lean === "bearish" ? "bg-red-500/15 text-red-500" :
        "bg-muted text-muted-foreground"
      )}>
        {descriptiveLabel}
      </span>
      {mode === "pro" && (
        <span className="text-[9px] text-muted-foreground uppercase tracking-wide tabular-nums">
          ({rawLabel})
        </span>
      )}
    </div>
  );
}

function SummaryGauge({ buy, sell, neutral, mode }: { buy: number; sell: number; neutral: number; mode: "beginner" | "pro" }) {
  const { t } = useTranslation();
  const total = buy + sell + neutral || 1;
  const buyPct = (buy / total) * 100;
  const sellPct = (sell / total) * 100;
  const lean = leanFromCounts(buy, sell);
  const headingLabel =
    lean === "bullish" ? t.analyze.leaning_bullish :
    lean === "bearish" ? t.analyze.leaning_bearish :
    t.analyze.leaning_neutral;
  const rawLabel =
    lean === "bullish" ? t.analyze.signal_buy :
    lean === "bearish" ? t.analyze.signal_sell :
    t.analyze.signal_neutral;
  const headingColor =
    lean === "bullish" ? "text-emerald-500" :
    lean === "bearish" ? "text-red-500" :
    "text-amber-500";

  return (
    <div className="text-center">
      <div className={cn("text-2xl font-extrabold mb-0.5", headingColor)}>{headingLabel}</div>
      {mode === "pro" && (
        <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">
          ({rawLabel})
        </div>
      )}
      <div className="h-2 rounded-full bg-muted overflow-hidden flex gap-0.5 mb-2">
        <div className="bg-emerald-500 rounded-full transition-all" style={{ width: `${buyPct}%` }} />
        <div className="bg-red-500 rounded-full transition-all" style={{ width: `${sellPct}%` }} />
      </div>
      <div className="flex justify-between text-[10px]">
        <span className="text-emerald-500 font-semibold">{buy} {t.analyze.count_bullish}</span>
        <span className="text-muted-foreground">{neutral} {t.analyze.leaning_neutral}</span>
        <span className="text-red-500 font-semibold">{sell} {t.analyze.count_bearish}</span>
      </div>
    </div>
  );
}

export function TechnicalIndicatorsPanel({
  instrument,
  mode = "beginner",
  timeframe = "1D",
}: {
  instrument: string;
  mode?: "beginner" | "pro";
  timeframe?: IndicatorTimeframe;
}) {
  const { t } = useTranslation();
  const { data: ind, isLoading, isError } = useTechnicalIndicators(instrument, timeframe);

  if (isLoading) return (
    <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-xs">{t.analyze.loading_indicators}</span>
    </div>
  );

  if (isError || !ind) return (
    <div className="p-4 rounded-xl border border-dashed border-border text-center">
      <p className="text-xs text-muted-foreground">{t.analyze.indicators_error}</p>
    </div>
  );

  const r = (n: number, d = 2) => Number(n).toFixed(d);
  const sortedMAs = [...ind.movingAverages].sort((a, b) => a.period - b.period || a.type.localeCompare(b.type));

  // Pick the right "data freshness" pill, "1-bar change" label, and
  // "20-bar change" label based on the active timeframe so intraday users
  // don't see "Daily data" copy under their 5-minute candles.
  const dataLabel =
    timeframe === "1W" ? t.analyze.weekly_data :
    timeframe === "1D" ? t.analyze.daily_data :
    t.analyze.intraday_data.replace("{tf}", timeframe);
  const change1Label =
    timeframe === "1W" ? t.analyze.change_1w :
    timeframe === "1D" ? t.analyze.change_1d :
    t.analyze.change_1bar;
  const change20Label =
    timeframe === "1W" ? t.analyze.change_20w :
    timeframe === "1D" ? t.analyze.change_20d :
    t.analyze.change_20bar;

  return (
    <div className="space-y-3">
      <MarketContextSummary
        buy={ind.overallSummary.buy}
        sell={ind.overallSummary.sell}
        neutral={ind.overallSummary.neutral}
        mode={mode}
      />

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <h3 className="text-sm font-bold text-foreground" data-testid="text-indicator-header">
          {t.analyze.technical_indicators} — {timeframe}
        </h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {dataLabel} · {ind.dataPoints} {t.analyze.candles}
          </span>
          <a
            href="https://newsmaker.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            title="Data dari Newsmaker.id"
          >
            <span className="text-[10px] text-muted-foreground">by</span>
            <img src="/newsmaker-logo.png" alt="Newsmaker.id" className="h-3.5 w-auto object-contain bg-white rounded px-1 py-0.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-card border border-border rounded-xl p-2.5">
          <div className="text-[10px] text-muted-foreground mb-1">{t.analyze.price_label}</div>
          <div className="text-sm font-bold text-foreground tabular-nums">{Number(ind.lastClose).toFixed(ind.lastClose > 100 ? 2 : 4)}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-2.5">
          <div className="text-[10px] text-muted-foreground mb-1">{change1Label}</div>
          <ChangeChip value={ind.change1dPct} />
        </div>
        <div className="bg-card border border-border rounded-xl p-2.5">
          <div className="text-[10px] text-muted-foreground mb-1">{change20Label}</div>
          <ChangeChip value={ind.change20dPct} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-3">{t.analyze.signal_summary}</p>
        <SummaryGauge buy={ind.overallSummary.buy} sell={ind.overallSummary.sell} neutral={ind.overallSummary.neutral} mode={mode} />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-muted/50 rounded-xl p-2 text-center">
            <p className="text-[9px] text-muted-foreground mb-1">{t.analyze.oscillator_section}</p>
            <SummaryGauge buy={ind.oscillatorSummary.buy} sell={ind.oscillatorSummary.sell} neutral={ind.oscillatorSummary.neutral} mode={mode} />
          </div>
          <div className="bg-muted/50 rounded-xl p-2 text-center">
            <p className="text-[9px] text-muted-foreground mb-1">{t.analyze.moving_avg_short}</p>
            <SummaryGauge buy={ind.maSummary.buy} sell={ind.maSummary.sell} neutral={ind.maSummary.neutral} mode={mode} />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t.analyze.oscillator_section}</p>
        {[
          { name: "RSI (14)", value: r(ind.rsi14.value), signal: ind.rsi14.signal },
          { name: `MACD (12,26)`, value: r(ind.macd.macd, 4), signal: ind.macd.action },
          { name: `Stochastic %K`, value: r(ind.stochastic.k), signal: ind.stochastic.signal },
          { name: `Bollinger`, value: `${r(ind.bollinger.lower, 2)}–${r(ind.bollinger.upper, 2)}`, signal: ind.bollinger.signal },
        ].map((row) => (
          <div key={row.name} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{row.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-foreground">{row.value}</span>
              <SignalBadge signal={row.signal as RawSignal} mode={mode} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t.analyze.moving_averages_section}</p>
        {sortedMAs.map((ma) => (
          <div key={`${ma.type}-${ma.period}`} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{ma.type} ({ma.period})</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-foreground">{Number(ma.value).toFixed(ma.value > 100 ? 2 : 4)}</span>
              <SignalBadge signal={ma.signal} mode={mode} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangeChip({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const isUp = value > 0;
  const isFlat = Math.abs(value) < 0.001;
  return (
    <span className={cn(
      "text-[10px] font-semibold flex items-center gap-0.5",
      isFlat ? "text-muted-foreground" : isUp ? "text-emerald-500" : "text-red-500"
    )}>
      {isFlat ? <Minus className="w-3 h-3" /> : isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isUp ? "+" : ""}{value.toFixed(2)}{suffix}
    </span>
  );
}
