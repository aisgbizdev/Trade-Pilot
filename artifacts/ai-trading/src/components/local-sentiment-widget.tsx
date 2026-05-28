import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  useGetJournalSentiment,
  getGetJournalSentimentQueryKey,
} from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
  instrument: string;
}

// Anonymous community sentiment surfaced from the journal table. The
// widget hides itself entirely when the API returns `gated: true` so
// we don't show a half-empty "0 traders" placeholder on instruments
// nobody trades. The minimum-sample-size guard lives on the server
// (see `/api/journal/sentiment`); the UI just respects the flag.
export function LocalSentimentWidget({ instrument }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetJournalSentiment(
    { instrument },
    {
      query: {
        queryKey: getGetJournalSentimentQueryKey({ instrument }),
        // The aggregate refreshes every few minutes at most; no need
        // to refetch on tab focus and absolutely no polling.
        refetchOnWindowFocus: false,
        staleTime: 60_000,
      },
    },
  );

  if (isLoading || !data) return null;

  if (data.gated) {
    return (
      <Card className="p-3" data-testid="local-sentiment-gated">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-semibold text-foreground">
            {t.widgets.local_sentiment_title}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          {t.widgets.local_sentiment_gated}
        </p>
      </Card>
    );
  }

  const buy = data.buyPct ?? 0;
  const sell = data.sellPct ?? 0;
  const leansLong = buy >= sell;

  return (
    <Card className="p-3" data-testid="local-sentiment-widget">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-semibold text-foreground">
            {t.widgets.local_sentiment_title}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {data.sampleSize} {t.widgets.local_sentiment_entries}, {data.windowDays}d
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
        <div
          className="bg-emerald-500 transition-all"
          style={{ width: `${buy}%` }}
          data-testid="bar-buy"
        />
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${sell}%` }}
          data-testid="bar-sell"
        />
      </div>
      <div className="flex justify-between text-[11px] font-semibold mt-1.5">
        <span
          className={cn(
            leansLong ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
          )}
          data-testid="text-buy-pct"
        >
          {t.widgets.local_sentiment_long} {buy}%
        </span>
        <span
          className={cn(
            !leansLong ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
          )}
          data-testid="text-sell-pct"
        >
          {sell}% {t.widgets.local_sentiment_short}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
        {t.widgets.local_sentiment_footnote}
      </p>
    </Card>
  );
}
