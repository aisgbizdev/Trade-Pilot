import { ArrowDown, ArrowUp } from "lucide-react";
import { useLiveQuotes, type LiveQuote } from "@/hooks/use-live-quotes";

const FALLBACK_INSTRUMENTS = [
  "XAU/USD", "EUR/USD", "GBP/USD", "USD/JPY", "BRENT",
  "XAG/USD", "NASDAQ", "DJIA", "DXY", "USD/IDR",
];

function formatPrice(price: number, instrument: string): string {
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
  return price.toFixed(4);
}

function TickerItem({ quote }: { quote: LiveQuote }) {
  const isUp = quote.direction === "up";
  const colorClass = isUp ? "text-emerald-400" : "text-red-400";
  const Arrow = isUp ? ArrowUp : ArrowDown;
  return (
    <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
      <span className="font-semibold">{quote.instrument}</span>
      <span className="text-slate-300">
        {formatPrice(quote.price, quote.instrument)}
      </span>
      <span className={`flex items-center gap-0.5 ${colorClass}`}>
        <Arrow className="w-3 h-3" strokeWidth={3} />
        {quote.changePercent.replace(/^\+/, "")}
      </span>
    </span>
  );
}

function FallbackTickerItem({ instrument }: { instrument: string }) {
  return (
    <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
      {instrument}
    </span>
  );
}

export function PriceTicker() {
  const { data: liveQuotesData } = useLiveQuotes();
  const liveQuotes = liveQuotesData?.data ?? [];
  const hasLive = liveQuotes.length > 0;

  return (
    <section
      className="bg-slate-950 overflow-hidden py-2 border-b border-white/10"
      data-testid="price-ticker"
      aria-label="Live market prices"
    >
      <div className="flex gap-6 ticker-scroll whitespace-nowrap w-max">
        {hasLive
          ? [...liveQuotes, ...liveQuotes].map((q, i) => (
              <TickerItem key={`${q.symbol}-${i}`} quote={q} />
            ))
          : [...FALLBACK_INSTRUMENTS, ...FALLBACK_INSTRUMENTS].map((inst, i) => (
              <FallbackTickerItem key={`${inst}-${i}`} instrument={inst} />
            ))}
      </div>
    </section>
  );
}
