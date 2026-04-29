import { useTechnicalIndicators, type IndicatorTimeframe } from "@/hooks/use-technical-indicators";
import { Loader2, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { SHOW_NEWSMAKER } from "@/lib/newsmaker-flag";
import { MarketContextSummary } from "./market-context-summary";
import { SignalSpeedometer } from "./signal-speedometer";

type RawSignal = "Buy" | "Sell" | "Neutral";

/** Map a single Buy/Sell/Neutral signal into the speedometer's count tally. */
function signalToCounts(signal: RawSignal): { buy: number; sell: number; neutral: number } {
  if (signal === "Buy") return { buy: 1, sell: 0, neutral: 0 };
  if (signal === "Sell") return { buy: 0, sell: 1, neutral: 0 };
  return { buy: 0, sell: 0, neutral: 1 };
}

/** Per-row signal: a tiny gauge + (in pro mode) the raw Buy/Sell/Neutral label. */
function SignalCell({ signal, mode, testId }: { signal: RawSignal; mode: "beginner" | "pro"; testId?: string }) {
  const { t } = useTranslation();
  const counts = signalToCounts(signal);
  const rawLabel =
    signal === "Buy" ? t.analyze.signal_buy :
    signal === "Sell" ? t.analyze.signal_sell :
    t.analyze.signal_neutral;

  return (
    <div className="flex items-center gap-1.5">
      <SignalSpeedometer
        buy={counts.buy}
        sell={counts.sell}
        neutral={counts.neutral}
        size="xs"
        showCounts={false}
        showCenterLabel={false}
        testId={testId}
      />
      {mode === "pro" && (
        <span className="text-[10px] font-medium leading-none text-muted-foreground/70 min-w-[2.75rem] text-left tabular-nums">
          {rawLabel}
        </span>
      )}
    </div>
  );
}

/**
 * Pro-mode raw signal label ("Buy"/"Sell"/"Neutral") shown as the
 * parenthetical under the descriptive label in the Speedometer. Returns
 * undefined for beginner mode so the speedometer hides the parenthetical.
 */
function rawSignalLabel(
  buy: number,
  sell: number,
  mode: "beginner" | "pro",
  t: ReturnType<typeof useTranslation>["t"],
): string | undefined {
  if (mode !== "pro") return undefined;
  if (buy > sell * 1.5) return t.analyze.signal_buy;
  if (sell > buy * 1.5) return t.analyze.signal_sell;
  return t.analyze.signal_neutral;
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
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-500/20 flex items-center justify-center">
          <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h3 className="text-sm font-bold text-foreground" data-testid="text-indicator-header">
          {t.analyze.technical_indicators} — {timeframe}
        </h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {dataLabel} · {ind.dataPoints} {t.analyze.candles}
          </span>
          {SHOW_NEWSMAKER && (
            <a
              href="https://newsmaker.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
              data-testid="link-indicators-source-newsmaker"
            >
              {t.widgets.source_newsmaker}
            </a>
          )}
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
        <SignalSpeedometer
          buy={ind.overallSummary.buy}
          sell={ind.overallSummary.sell}
          neutral={ind.overallSummary.neutral}
          rawLabel={rawSignalLabel(ind.overallSummary.buy, ind.overallSummary.sell, mode, t)}
          testId="speedometer-overall"
        />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-muted/50 rounded-xl p-2 flex flex-col items-center">
            <p className="text-[9px] text-muted-foreground mb-1">{t.analyze.oscillator_section}</p>
            <SignalSpeedometer
              buy={ind.oscillatorSummary.buy}
              sell={ind.oscillatorSummary.sell}
              neutral={ind.oscillatorSummary.neutral}
              size="sm"
              rawLabel={rawSignalLabel(ind.oscillatorSummary.buy, ind.oscillatorSummary.sell, mode, t)}
              testId="speedometer-oscillator"
            />
          </div>
          <div className="bg-muted/50 rounded-xl p-2 flex flex-col items-center">
            <p className="text-[9px] text-muted-foreground mb-1">{t.analyze.moving_avg_short}</p>
            <SignalSpeedometer
              buy={ind.maSummary.buy}
              sell={ind.maSummary.sell}
              neutral={ind.maSummary.neutral}
              size="sm"
              rawLabel={rawSignalLabel(ind.maSummary.buy, ind.maSummary.sell, mode, t)}
              testId="speedometer-ma"
            />
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
              <SignalCell signal={row.signal as RawSignal} mode={mode} />
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
              <SignalCell signal={ma.signal} mode={mode} />
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
