import { cloneElement, isValidElement, type ReactElement } from "react";
import { ArrowDown, ArrowUp, Newspaper } from "lucide-react";
import { useLiveQuotes, type LiveQuote } from "@/hooks/use-live-quotes";
import { useNews, type NewsArticle } from "@/hooks/use-news";
import { useTranslation } from "@/lib/i18n";

const FALLBACK_INSTRUMENTS = [
  "XAU/USD", "EUR/USD", "GBP/USD", "USD/JPY", "BRENT",
  "XAG/USD", "NASDAQ", "DJIA", "DXY", "USD/IDR",
];

// News category dots — used purely for visual differentiation between
// rss feeds in the marquee. Avoid red/emerald (they read as Buy/Sell)
// and stay within a warm gold-leaning palette to match the brand.
const CATEGORY_DOT: Record<string, string> = {
  GLOBAL: "bg-amber-300",
  FOREX: "bg-yellow-400",
  KOMODITAS: "bg-orange-400",
  SAHAM: "bg-amber-500",
  EKONOMI: "bg-yellow-200",
};

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

function PriceItem({ quote }: { quote: LiveQuote }) {
  const isUp = quote.direction === "up";
  const colorClass = isUp ? "text-emerald-400" : "text-red-400";
  const Arrow = isUp ? ArrowUp : ArrowDown;
  return (
    <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
      <span className="font-semibold">{quote.instrument}</span>
      <span className="text-slate-100">
        {formatPrice(quote.price, quote.instrument)}
      </span>
      <span className={`flex items-center gap-0.5 ${colorClass}`}>
        <Arrow className="w-3 h-3" strokeWidth={3} />
        {quote.changePercent.replace(/^\+/, "")}
      </span>
    </span>
  );
}

function FallbackPriceItem({ instrument }: { instrument: string }) {
  return (
    <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 inline-block" />
      {instrument}
    </span>
  );
}

function NewsItem({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 group"
      data-testid={`ticker-news-item-${article.id}`}
    >
      <Newspaper className="w-3 h-3 text-amber-300 shrink-0" />
      {article.category && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            CATEGORY_DOT[article.category] ?? "bg-amber-300/70"
          }`}
        />
      )}
      <span className="text-xs text-slate-200 group-hover:text-white transition-colors max-w-[420px] truncate">
        {article.title}
      </span>
      <span className="text-[10px] text-slate-400">
        · {article.sourceName}
      </span>
    </a>
  );
}

function Separator() {
  return <span className="text-amber-500/40 text-xs select-none">|</span>;
}

function LiveQuoteBadge() {
  return (
    <span
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_14px_rgba(245,197,24,0.45)] shrink-0"
      data-testid="ticker-live-quote-badge"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-80" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-600" />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-black">
        Live Quote
      </span>
    </span>
  );
}

function BreakingNewsBadge() {
  return (
    <span
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_14px_rgba(220,38,38,0.55)] shrink-0"
      data-testid="ticker-breaking-news-badge"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">
        Breaking News
      </span>
    </span>
  );
}

export function ContinuousTicker({ newsLimit = 3 }: { newsLimit?: number }) {
  const { t } = useTranslation();
  const { data: liveQuotesData } = useLiveQuotes();
  const { data: newsData } = useNews();

  const liveQuotes = liveQuotesData?.data ?? [];
  const articles = newsData?.articles?.slice(0, newsLimit) ?? [];

  const hasLive = liveQuotes.length > 0;
  const hasNews = articles.length > 0;

  const items: React.ReactNode[] = [];

  if (hasLive) {
    items.push(<LiveQuoteBadge key="badge-live" />);
    liveQuotes.forEach((q, i) => {
      items.push(<PriceItem key={`p-${q.symbol}-${i}`} quote={q} />);
    });
  } else {
    FALLBACK_INSTRUMENTS.forEach((inst, i) => {
      items.push(<FallbackPriceItem key={`fp-${inst}-${i}`} instrument={inst} />);
    });
  }

  if (hasNews) {
    items.push(<Separator key="sep-1" />);
    items.push(<BreakingNewsBadge key="badge-breaking" />);
    articles.forEach((a, i) => {
      items.push(<NewsItem key={`n-${a.id}-${i}`} article={a} />);
    });
    items.push(<Separator key="sep-2" />);
  }

  return (
    <section
      className="bg-slate-950 overflow-hidden py-2 border-b border-white/10 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]"
      data-testid="continuous-ticker"
      aria-label={t.widgets.news_title}
    >
      <div className="flex gap-6 ticker-scroll-mixed whitespace-nowrap w-max items-center">
        {items}
        {items.map((item, idx) =>
          isValidElement(item)
            ? cloneElement(item as ReactElement, { key: `dup-${idx}` })
            : item,
        )}
      </div>
    </section>
  );
}
