import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export type MarketContextLean = "bullish" | "bearish" | "neutral";

export function leanFromCounts(buy: number, sell: number): MarketContextLean {
  if (buy > sell * 1.5) return "bullish";
  if (sell > buy * 1.5) return "bearish";
  return "neutral";
}

export function MarketContextSummary({
  buy,
  sell,
  neutral,
  mode = "beginner",
}: {
  buy: number;
  sell: number;
  neutral: number;
  mode?: "beginner" | "pro";
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
