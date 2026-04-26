import { cloneElement, isValidElement, type ReactElement } from "react";
import { ArrowDown, ArrowUp, Newspaper } from "lucide-react";
import { useLiveQuotes, type LiveQuote } from "@/hooks/use-live-quotes";
import { useNews, type NewsArticle } from "@/hooks/use-news";
import { useTranslation } from "@/lib/i18n";

const FALLBACK_INSTRUMENTS = [
  "XAU/USD", "EUR/USD", "GBP/USD", "USD/JPY", "BRENT",
  "XAG/USD", "NASDAQ", "DJIA", "DXY", "USD/IDR",
];

const CATEGORY_DOT: Record<string, string> = {
  GLOBAL: "bg-blue-400",
  FOREX: "bg-violet-400",
  KOMODITAS: "bg-amber-400",
  SAHAM: "bg-emerald-400",
  EKONOMI: "bg-cyan-400",
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

function FallbackPriceItem({ instrument }: { instrument: string }) {
  return (
    <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
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
      <Newspaper className="w-3 h-3 text-cyan-400 shrink-0" />
      {article.category && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            CATEGORY_DOT[article.category] ?? "bg-slate-400"
          }`}
        />
      )}
      <span className="text-xs text-slate-200 group-hover:text-white transition-colors max-w-[420px] truncate">
        {article.title}
      </span>
      <span className="text-[10px] text-slate-500">
        · {article.sourceName}
      </span>
    </a>
  );
}

function Separator() {
  return <span className="text-slate-700 text-xs select-none">|</span>;
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
