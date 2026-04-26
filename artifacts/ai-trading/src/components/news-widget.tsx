import { useNews } from "@/hooks/use-news";
import { Loader2, Newspaper, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

// Category badge colors — kept inside the warm gold/amber family so news
// tags don't compete visually with bullish/bearish signals on the page.
const CATEGORY_COLORS: Record<string, string> = {
  GLOBAL: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  FOREX: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  KOMODITAS: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  SAHAM: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  EKONOMI: "bg-yellow-500/15 text-yellow-800 dark:text-yellow-200",
};

export function NewsWidget({ limit = 5 }: { limit?: number }) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useNews();
  const articles = data?.articles?.slice(0, limit) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-500/20 flex items-center justify-center">
          <Newspaper className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h3 className="text-sm font-bold text-foreground">{t.widgets.news_title}</h3>
        <a
          href="https://newsmaker.id"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
          data-testid="link-news-source-newsmaker"
        >
          {t.widgets.source_newsmaker}
        </a>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">{t.widgets.loading_news}</span>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">{t.widgets.news_error}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  {article.category && (
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
                      CATEGORY_COLORS[article.category] ?? "bg-muted text-muted-foreground"
                    )}>
                      {article.category}
                    </span>
                  )}
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
              </div>
              <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                {article.title}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground">{article.sourceName}</span>
                <span className="text-[10px] text-muted-foreground">{article.date}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
