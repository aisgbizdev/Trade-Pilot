import { useState } from "react";
import { Link } from "wouter";
import { Clock, TrendingUp, Loader2, Filter, X, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { useListAnalyses, getListAnalysesQueryKey, type AnalysesList, type ListAnalysesMode } from "@workspace/api-client-react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useRefreshAnalysis } from "@/hooks/use-refresh-analysis";

const ALL_INSTRUMENTS = [
  "XAU/USD", "BRENT", "XAG/USD", "HSI", "NIKKEI", "DJIA", "NASDAQ", "DXY",
  "AUD/USD", "EUR/USD", "GBP/USD", "USD/CHF", "USD/JPY", "USD/IDR",
];

export default function HistoryPage() {
  const { t, lang } = useTranslation();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const [page, setPage] = useState(1);
  const limit = 20;
  const { refresh, isRefreshing } = useRefreshAnalysis();

  const [filterMode, setFilterMode] = useState<ListAnalysesMode | "">("");
  const [filterInstrument, setFilterInstrument] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filterMode !== "" || filterInstrument !== "" || filterFrom !== "" || filterTo !== "";

  const params = {
    page,
    limit,
    ...(filterMode ? { mode: filterMode } : {}),
    ...(filterInstrument ? { instrument: filterInstrument } : {}),
    ...(filterFrom ? { from: filterFrom } : {}),
    ...(filterTo ? { to: filterTo } : {}),
  };

  const { data, isLoading } = useListAnalyses(
    params,
    { query: { queryKey: getListAnalysesQueryKey(params) } }
  );

  const listData = data as AnalysesList | undefined;
  const analyses = listData?.analyses ?? [];
  const total = listData?.total ?? 0;
  const hasMore = page * limit < total;

  const handleClearFilters = () => {
    setFilterMode("");
    setFilterInstrument("");
    setFilterFrom("");
    setFilterTo("");
    setPage(1);
  };

  const MARKET_CONDITION_LABELS: Record<string, { label: string; color: string }> = {
    trending_up: { label: t.dashboard.trending_up, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    trending_down: { label: t.dashboard.trending_down, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    ranging: { label: t.dashboard.ranging, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    volatile: { label: t.dashboard.volatile, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  };

  return (
    <Layout>
      <div className="px-4 py-5">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">{t.history.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {total > 0 ? `${total} ${t.history.total_analyses}` : t.history.no_data_yet}
              </p>
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              data-testid="button-toggle-filters"
              className={cn(
                "p-2 rounded-xl transition-colors relative",
                showFilters || hasActiveFilters
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 p-3 rounded-xl border border-border bg-muted/30 space-y-3" data-testid="filter-panel">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mode</p>
                <div className="flex gap-2">
                  {(["", "beginner", "pro"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setFilterMode(m as ListAnalysesMode | ""); setPage(1); }}
                      data-testid={`filter-mode-${m || "all"}`}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                        filterMode === m
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {m === "" ? t.common.all ?? "All" : m === "beginner" ? t.common.beginner : t.common.pro}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{t.analyze.select_instrument}</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => { setFilterInstrument(""); setPage(1); }}
                    data-testid="filter-instrument-all"
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-lg border transition-all",
                      filterInstrument === ""
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {t.common.all ?? "All"}
                  </button>
                  {ALL_INSTRUMENTS.map((inst) => (
                    <button
                      key={inst}
                      onClick={() => { setFilterInstrument(inst); setPage(1); }}
                      data-testid={`filter-instrument-${inst}`}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-lg border transition-all",
                        filterInstrument === inst
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  {t.history.date_range ?? "Date Range"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      {t.history.from_date ?? "From"}
                    </label>
                    <input
                      type="date"
                      value={filterFrom}
                      onChange={(e) => { setFilterFrom(e.target.value); setPage(1); }}
                      data-testid="filter-date-from"
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">
                      {t.history.to_date ?? "To"}
                    </label>
                    <input
                      type="date"
                      value={filterTo}
                      onChange={(e) => { setFilterTo(e.target.value); setPage(1); }}
                      data-testid="filter-date-to"
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  data-testid="button-clear-filters"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t.common.clear_filters ?? "Clear filters"}
                </button>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm font-medium text-foreground">{t.history.no_analyses_title}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.history.no_analyses_subtitle}</p>
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" className="mt-4" onClick={handleClearFilters} data-testid="button-clear-filters-empty">
                {t.common.clear_filters ?? "Clear filters"}
              </Button>
            ) : (
              <Link href="/analyze">
                <Button variant="outline" size="sm" className="mt-4" data-testid="button-start-analysis">
                  {t.history.start_analysis}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {analyses.map((a) => {
              const valid = new Date(a.validUntil) > new Date();
              const mc = MARKET_CONDITION_LABELS[a.marketCondition];
              const refreshing = isRefreshing(a.id);
              return (
                <Card
                  key={a.id}
                  className="p-3 hover:border-primary/50 transition-colors"
                  data-testid={`card-analysis-${a.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/analyses/${a.id}`} className="flex-1 min-w-0 cursor-pointer">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">{a.instrument}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                          {a.timeframe}
                        </span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                          {a.mode === "beginner" ? t.common.beginner : t.common.pro}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {mc && (
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md font-medium", mc.color)}>
                            {mc.label}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {format(new Date(a.createdAt), "dd MMM yyyy HH:mm", { locale: dateLocale })}
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant={valid ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {valid ? t.history.valid : t.history.expired}
                      </Badge>
                      {!valid && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (refreshing) return;
                            refresh({
                              id: a.id,
                              instrument: a.instrument,
                              timeframe: a.timeframe,
                              mode: a.mode,
                            });
                          }}
                          disabled={refreshing}
                          aria-label={t.analysis_detail.refresh_btn}
                          title={t.analysis_detail.refresh_btn}
                          data-testid={`button-refresh-row-${a.id}`}
                          className={cn(
                            "p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors",
                            refreshing && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          {refreshing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                data-testid="button-prev-page"
              >
                {t.history.prev}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
                data-testid="button-next-page"
              >
                {t.history.next}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
