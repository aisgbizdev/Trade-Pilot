import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useStreamingQuoteByInstrument } from "@/hooks/use-live-quotes";

/**
 * Compact near-real-time "running price" pill for a single instrument.
 * Polls /api/quotes/live?fast=1 every ~3s (see useLiveQuotesStream) so the
 * number actually moves, and flashes green/red on each tick that changes
 * the price. Renders nothing until the first quote arrives — the feed
 * covers XAU/USD, BRENT, HSI, NIKKEI, the same set the Compare Risk
 * button is shown for.
 */
function formatLivePrice(price: number, instrument: string): string {
  if (instrument === "XAU/USD" || instrument === "BRENT" || instrument === "XAG/USD") {
    return price.toFixed(2);
  }
  if (price >= 1000) {
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  return price.toFixed(2);
}

export function LivePriceChip({
  instrument,
  className,
  enabled = true,
}: {
  instrument: string;
  className?: string;
  enabled?: boolean;
}) {
  const { quote } = useStreamingQuoteByInstrument(instrument, enabled);
  const price = quote?.price ?? null;

  // Flash direction for the most recent tick (green up / red down),
  // independent of the day's overall changePercent.
  const prevPrice = useRef<number | null>(null);
  const [tick, setTick] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (price == null) return undefined;
    const prev = prevPrice.current;
    prevPrice.current = price;
    if (prev == null || price === prev) return undefined;
    setTick(price > prev ? "up" : "down");
    const id = setTimeout(() => setTick(null), 700);
    return () => clearTimeout(id);
  }, [price]);

  if (!quote || price == null) return null;

  const dayUp = quote.direction === "up";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold tabular-nums transition-colors duration-300",
        tick === "up" && "border-emerald-500/60 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        tick === "down" && "border-rose-500/60 bg-rose-500/20 text-rose-600 dark:text-rose-400",
        tick == null &&
          (dayUp
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"),
        className,
      )}
      data-testid="live-price-chip"
      title={`${instrument} · ${new Date(quote.updatedAt).toLocaleTimeString()}`}
      aria-label={`Harga live ${instrument} ${formatLivePrice(price, instrument)}, ${quote.changePercent}`}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          tick === "up" && "bg-emerald-500",
          tick === "down" && "bg-rose-500",
          tick == null && "bg-current animate-pulse",
        )}
        aria-hidden="true"
      />
      <span>{formatLivePrice(price, instrument)}</span>
      <span className="opacity-80">{quote.changePercent}</span>
    </span>
  );
}
