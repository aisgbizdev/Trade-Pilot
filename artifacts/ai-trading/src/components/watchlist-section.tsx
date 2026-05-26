import { Link } from "wouter";
import { Minus, Star, TrendingDown, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useLiveQuotes } from "@/hooks/use-live-quotes";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { WatchlistStar, useWatchlist } from "@/components/watchlist-star";
import type { Watchlist, WatchlistItem } from "@workspace/api-client-react";

function formatPrice(price: number, instrument: string): string {
  if (instrument === "USD/IDR") return price.toLocaleString("id-ID");
  if (instrument === "USD/JPY") return price.toFixed(2);
  if (instrument === "XAU/USD") return price.toFixed(2);
  if (instrument === "BRENT") return price.toFixed(2);
  if (price > 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return price.toFixed(4);
}

function WatchlistCard({ item }: { item: WatchlistItem }) {
  const { t, lang } = useTranslation();
  const { data: liveData } = useLiveQuotes();
  const quote = liveData?.data.find(
    (q) => q.instrument.toLowerCase() === item.instrument.toLowerCase(),
  );
  const dateLocale = lang === "id" ? idLocale : enUS;

  // Deep-link to the most recent analysis if there is one, otherwise drop
  // the user into the Analyze page pre-populated with this instrument.
  const href = item.mostRecentAnalysisId
    ? `/analyses/${item.mostRecentAnalysisId}`
    : `/analyze?instrument=${encodeURIComponent(item.instrument)}`;

  const isUp = quote?.direction === "up";
  const isFlat =
    !quote || quote.changePercent === "+0%" || quote.changePercent === "0%";

  return (
    <Link href={href}>
      <div
        className={cn(
          "relative p-3 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.97] border overflow-hidden group",
          "bg-card hover:border-primary/30",
          isFlat
            ? "border-border"
            : isUp
              ? "border-emerald-500/20 hover:border-emerald-500/40"
              : "border-red-500/20 hover:border-red-500/40",
        )}
        data-testid={`watchlist-card-${item.instrument}`}
      >
        <div className="flex items-center justify-between mb-1.5 gap-1">
          <span className="text-[11px] font-bold text-foreground tracking-tight truncate">
            {item.instrument}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {quote && (
              <div
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center",
                  isFlat
                    ? "bg-muted"
                    : isUp
                      ? "bg-emerald-500/15"
                      : "bg-red-500/15",
                )}
              >
                {isFlat ? (
                  <Minus className="w-3 h-3 text-muted-foreground" />
                ) : isUp ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
              </div>
            )}
            <WatchlistStar instrument={item.instrument} size="sm" />
          </div>
        </div>
        {quote ? (
          <>
            <div className="text-[15px] font-bold text-foreground tabular-nums leading-none mb-1">
              {formatPrice(quote.price, quote.instrument)}
            </div>
            <div
              className={cn(
                "text-[10px] font-semibold mb-1",
                isFlat
                  ? "text-muted-foreground"
                  : isUp
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400",
              )}
            >
              {quote.changePercent}
            </div>
          </>
        ) : (
          <div className="text-[10px] text-muted-foreground mb-1">—</div>
        )}
        <div
          className="text-[9px] text-muted-foreground truncate"
          data-testid={`watchlist-last-analyzed-${item.instrument}`}
        >
          {item.mostRecentAnalysisAt ? (
            <>
              {t.dashboard.watchlist_last_analyzed}:{" "}
              {formatDistanceToNow(new Date(item.mostRecentAnalysisAt), {
                addSuffix: true,
                locale: dateLocale,
              })}
            </>
          ) : (
            t.dashboard.watchlist_no_analysis
          )}
        </div>
      </div>
    </Link>
  );
}

export function WatchlistSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useWatchlist();
  const items = (data as Watchlist | undefined)?.items ?? [];

  if (isLoading) return null;

  return (
    <div data-testid="dashboard-watchlist">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <h2 className="text-sm font-bold text-foreground">
          {t.dashboard.watchlist_title}
        </h2>
      </div>
      {items.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-border bg-card/40 p-4 text-center"
          data-testid="watchlist-empty"
        >
          <p className="text-xs font-semibold text-foreground mb-1">
            {t.dashboard.watchlist_empty_title}
          </p>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {t.dashboard.watchlist_empty_subtitle}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <WatchlistCard key={item.instrument} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
