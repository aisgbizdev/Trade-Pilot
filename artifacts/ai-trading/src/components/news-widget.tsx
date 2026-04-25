import { useNews } from "@/hooks/use-news";
import { Loader2, Newspaper, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  GLOBAL: "bg-blue-500/15 text-blue-500",
  FOREX: "bg-violet-500/15 text-violet-500",
  KOMODITAS: "bg-amber-500/15 text-amber-600",
  SAHAM: "bg-emerald-500/15 text-emerald-500",
  EKONOMI: "bg-cyan-500/15 text-cyan-500",
};

export function NewsWidget({ limit = 5 }: { limit?: number }) {
  const { data, isLoading, isError } = useNews();

  const articles = data?.articles?.slice(0, limit) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
          <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <h3 className="text-sm font-bold text-foreground">Berita Pasar</h3>
        <a
          href="https://newsmaker.id"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          title="Data dari Newsmaker.id"
        >
          <span className="text-[10px] text-muted-foreground">by</span>
          <img src="/newsmaker-logo.png" alt="Newsmaker.id" className="h-4 w-auto object-contain bg-white rounded px-1 py-0.5" />
        </a>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Memuat berita...</span>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">Tidak dapat memuat berita</p>
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
