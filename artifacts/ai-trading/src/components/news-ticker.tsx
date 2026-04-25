import { Newspaper } from "lucide-react";
import { useNews } from "@/hooks/use-news";
import { useTranslation } from "@/lib/i18n";

const CATEGORY_DOT: Record<string, string> = {
  GLOBAL: "bg-blue-400",
  FOREX: "bg-violet-400",
  KOMODITAS: "bg-amber-400",
  SAHAM: "bg-emerald-400",
  EKONOMI: "bg-cyan-400",
};

export function NewsTicker({ limit = 3 }: { limit?: number }) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useNews();
  const articles = data?.articles?.slice(0, limit) ?? [];

  if (isLoading || isError || articles.length === 0) {
    return null;
  }

  const repeated = [...articles, ...articles];

  return (
    <section
      className="bg-slate-950 overflow-hidden py-1.5 border-b border-white/10"
      data-testid="news-ticker"
      aria-label={t.widgets.news_title}
    >
      <div className="flex gap-8 ticker-scroll-news whitespace-nowrap w-max items-center">
        {repeated.map((article, i) => (
          <a
            key={`${article.id}-${i}`}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
            data-testid={`news-ticker-item-${article.id}`}
          >
            <Newspaper className="w-3 h-3 text-cyan-400 shrink-0" />
            {article.category && (
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  CATEGORY_DOT[article.category] ?? "bg-slate-400"
                }`}
              />
            )}
            <span className="text-[11px] text-slate-200 group-hover:text-white transition-colors max-w-[480px] truncate">
              {article.title}
            </span>
            <span className="text-[10px] text-slate-500">
              · {article.sourceName}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
