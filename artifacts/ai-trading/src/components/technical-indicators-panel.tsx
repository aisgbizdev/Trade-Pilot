import { useTechnicalIndicators } from "@/hooks/use-technical-indicators";
import { Loader2, TrendingUp, TrendingDown, Minus, BarChart3, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

type RawSignal = "Buy" | "Sell" | "Neutral";
type Lean = "bullish" | "bearish" | "neutral";

function leanFromCounts(buy: number, sell: number): Lean {
  if (buy > sell * 1.5) return "bullish";
  if (sell > buy * 1.5) return "bearish";
  return "neutral";
}

function leanFromSignal(signal: RawSignal): Lean {
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

function MarketContextSummary({
  buy,
  sell,
  neutral,
  mode,
}: {
  buy: number;
  sell: number;
  neutral: number;
  mode: "beginner" | "pro";
}) {
  const { t } = useTranslation();
  const total = buy + sell + neutral;
  const lean = leanFromCounts(buy, sell);

  const template =
    lean === "bullish" ? t.analyze.market_context_bullish :
    lean === "bearish" ? t.analyze.market_context_bearish :
    t.analyze.market_context_neutral;

  const sentence = template
    .replace("{buy}", String(buy))
    .replace("{sell}", String(sell))
    .replace("{neutral}", String(neutral))
    .replace("{total}", String(total));

  const accent =
    lean === "bullish" ? "from-emerald-500/15 to-emerald-500/5 border-emerald-500/30" :
    lean === "bearish" ? "from-red-500/15 to-red-500/5 border-red-500/30" :
    "from-amber-500/15 to-amber-500/5 border-amber-500/30";

  const iconColor =
    lean === "bullish" ? "text-emerald-500" :
    lean === "bearish" ? "text-red-500" :
    "text-amber-500";

  const headingLabel =
    lean === "bullish" ? t.analyze.leaning_bullish :
    lean === "bearish" ? t.analyze.leaning_bearish :
    t.analyze.leaning_neutral;

  const rawLabel =
    lean === "bullish" ? t.analyze.signal_buy :
    lean === "bearish" ? t.analyze.signal_sell :
    t.analyze.signal_neutral;

  return (
    <div
      className={cn(
        "bg-gradient-to-br border rounded-2xl p-4 space-y-2",
        accent,
      )}
      data-testid="card-market-context"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-background/60 flex items-center justify-center">
          <Compass className={cn("w-4 h-4", iconColor)} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {t.analyze.market_context_title}
          </p>
          <p className={cn("text-sm font-bold", iconColor)} data-testid="text-market-context-lean">
            {headingLabel}
            {mode === "pro" && (
              <span className="ml-1.5 text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
                ({rawLabel})
              </span>
            )}
          </p>
        </div>
      </div>
      <p className="text-xs text-foreground leading-relaxed" data-testid="text-market-context-summary">
        {sentence}
      </p>
    </div>
  );
}

export function TechnicalIndicatorsPanel({
  instrument,
  mode = "beginner",
}: {
  instrument: string;
  mode?: "beginner" | "pro";
}) {
  const { t } = useTranslation();
  const { data: ind, isLoading, isError } = useTechnicalIndicators(instrument);

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
        <h3 className="text-sm font-bold text-foreground">{t.analyze.technical_indicators}</h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{t.analyze.daily_data} · {ind.dataPoints} {t.analyze.candles}</span>
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
          <div className="text-[10px] text-muted-foreground mb-1">{t.analyze.change_1d}</div>
          <ChangeChip value={ind.change1dPct} />
        </div>
        <div className="bg-card border border-border rounded-xl p-2.5">
          <div className="text-[10px] text-muted-foreground mb-1">{t.analyze.change_20d}</div>
          <ChangeChip value={ind.change20dPct} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-3">{t.analyze.signal_summary}</p>
        <SummaryGauge buy={ind.overallSummary.buy} sell={ind.overallSummary.sell} neutral={ind.overallSummary.neutral} mode={mode} />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-muted/50 rounded-xl p-2 text-center">
            <p className="text-[9px] text-muted-foreground mb-1">Oscillator</p>
            <SummaryGauge buy={ind.oscillatorSummary.buy} sell={ind.oscillatorSummary.sell} neutral={ind.oscillatorSummary.neutral} mode={mode} />
          </div>
          <div className="bg-muted/50 rounded-xl p-2 text-center">
            <p className="text-[9px] text-muted-foreground mb-1">Moving Avg</p>
            <SummaryGauge buy={ind.maSummary.buy} sell={ind.maSummary.sell} neutral={ind.maSummary.neutral} mode={mode} />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Oscillator</p>
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
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Moving Averages</p>
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
