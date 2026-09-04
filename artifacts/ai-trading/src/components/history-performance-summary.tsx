import { useLocation, useSearch } from "wouter";
import { AlertTriangle, CheckCircle2, Clock3, Loader2, Target, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";

type SummaryRange = "7" | "30" | "90" | "all";
type OutcomeStats = {
  total: number; pending: number; activeValid: number; tp1Hit: number; tp2Hit: number;
  slHit: number; expired: number; invalidated: number; winRate: number | null; completionRate: number | null;
};
type AnalysisHistorySummary = {
  range: SummaryRange;
  minSamples: number;
  overall: OutcomeStats;
  byTimeframe: Array<OutcomeStats & { timeframe: string }>;
};

const RANGES: SummaryRange[] = ["7", "30", "90", "all"];

export function HistoryPerformanceSummary() {
  const { t } = useTranslation();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const sp = new URLSearchParams(search);
  const rawRange = sp.get("range");
  const range: SummaryRange =
    rawRange === "7" || rawRange === "90" || rawRange === "all" ? rawRange : "30";
  const instruments = sp.getAll("instruments");
  const timeframes = sp.getAll("timeframes");
  const queryString = new URLSearchParams({ range });
  instruments.forEach((item) => queryString.append("instruments", item));
  timeframes.forEach((item) => queryString.append("timeframes", item));
  const { data: summary, isLoading, isError } = useQuery<AnalysisHistorySummary>({
    queryKey: ["analysis-history-summary", range, instruments, timeframes],
    queryFn: async () => {
      const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
      const response = await fetch(`${base}api/analyses/history-summary?${queryString}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load history summary");
      return response.json() as Promise<AnalysisHistorySummary>;
    },
  });

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(search);
    Object.entries(changes).forEach(([key, value]) => value == null ? next.delete(key) : next.set(key, value));
    setLocation(`/history?${next.toString()}`, { replace: true });
  };
  const drill = (outcome?: string, timeframe?: string) => {
    const next = new URLSearchParams(search);
    next.set("view", "history");
    next.delete("outcomes");
    next.delete("timeframes");
    if (outcome) next.append("outcomes", outcome);
    if (timeframe) next.append("timeframes", timeframe);
    if (range !== "all") {
      const from = new Date();
      from.setDate(from.getDate() - Number(range));
      next.set("from", from.toISOString().slice(0, 10));
      next.delete("to");
    } else {
      next.delete("from");
      next.delete("to");
    }
    next.delete("page");
    setLocation(`/history?${next.toString()}`);
  };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (isError || !summary) return <Card className="p-4 text-sm text-destructive">{t.common.error}</Card>;

  const o = summary.overall;
  const stats = [
    { label: t.history.summary_total, value: o.total, icon: Target, outcome: undefined },
    { label: t.history.summary_valid, value: o.activeValid, icon: Clock3, outcome: "pending" },
    { label: t.history.summary_expired, value: o.expired, icon: Clock3, outcome: "expired" },
    { label: "SL", value: o.slHit, icon: TrendingDown, outcome: "sl_hit" },
    { label: "TP1", value: o.tp1Hit, icon: CheckCircle2, outcome: "tp1_hit" },
    { label: "TP2", value: o.tp2Hit, icon: CheckCircle2, outcome: "tp2_hit" },
    { label: t.history.summary_invalid, value: o.invalidated, icon: AlertTriangle, outcome: "invalidated" },
  ];
  const qualified = summary.byTimeframe.filter((row) => row.total >= summary.minSamples);
  const best = [...qualified].filter((r) => r.winRate != null).sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))[0];
  const mostExpired = [...qualified].sort((a, b) => b.expired / Math.max(1, b.total) - a.expired / Math.max(1, a.total))[0];
  const mostSl = [...qualified].sort((a, b) => b.slHit - a.slHit)[0];

  return (
    <section className="space-y-4" data-testid="history-performance-summary">
      <div className="flex gap-1.5 overflow-x-auto pb-1" data-testid="history-range-tabs">
        {RANGES.map((item) => (
          <button key={item} onClick={() => update({ range: item })} className={cn(
            "px-3 py-1.5 rounded-lg border text-xs font-medium shrink-0",
            range === item ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground",
          )}>
            {item === "all" ? t.common.all : `${item}D`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stats.map(({ label, value, icon: Icon, outcome }) => (
          <button key={label} onClick={() => drill(outcome)} className="text-left">
            <Card className="p-3 h-full hover:border-primary/60 transition-colors">
              <Icon className="w-4 h-4 text-primary mb-2" />
              <p className="text-xl font-bold tabular-nums">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        <Card className="p-3"><p className="text-[10px] text-muted-foreground">{t.history.insight_consistent}</p><p className="text-sm font-semibold mt-1">{best ? `${best.timeframe} · ${Math.round((best.winRate ?? 0) * 100)}%` : t.history.need_more_samples}</p></Card>
        <Card className="p-3"><p className="text-[10px] text-muted-foreground">{t.history.insight_expired}</p><p className="text-sm font-semibold mt-1">{mostExpired ? `${mostExpired.timeframe} · ${mostExpired.expired}` : t.history.need_more_samples}</p></Card>
        <Card className="p-3"><p className="text-[10px] text-muted-foreground">{t.history.insight_sl}</p><p className="text-sm font-semibold mt-1">{mostSl ? `${mostSl.timeframe} · ${mostSl.slHit}` : t.history.need_more_samples}</p></Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold">{t.history.timeframe_performance}</h2>
          <p className="text-[11px] text-muted-foreground mt-1">{t.history.rate_explainer}</p>
        </div>
        <div className="hidden md:grid grid-cols-[1fr_repeat(8,minmax(54px,1fr))] gap-2 px-4 py-2 text-[10px] text-muted-foreground border-b border-border">
          <span>Timeframe</span><span>Sample</span><span>{t.history.summary_valid}</span><span>Expired</span><span>SL</span><span>TP1</span><span>TP2</span><span>Win rate</span><span>Completion</span>
        </div>
        {summary.byTimeframe.length === 0 ? (
          <p className="p-6 text-center text-xs text-muted-foreground">{t.history.no_data_yet}</p>
        ) : summary.byTimeframe.map((row) => (
          <button key={row.timeframe} onClick={() => drill(undefined, row.timeframe)} className="w-full text-left p-4 border-b last:border-0 border-border hover:bg-muted/40">
            <div className="md:grid md:grid-cols-[1fr_repeat(8,minmax(54px,1fr))] md:gap-2 md:items-center">
              <div className="flex justify-between md:block"><strong>{row.timeframe}</strong><span className="md:hidden text-xs">{row.total} sample</span></div>
              <span className="hidden md:block text-xs">{row.total}</span>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs md:contents">
                <span>{t.history.summary_valid}: {row.activeValid}</span><span>Expired: {row.expired}</span><span>SL: {row.slHit}</span>
                <span>TP1: {row.tp1Hit}</span><span>TP2: {row.tp2Hit}</span>
                <span className="font-semibold">{row.total >= summary.minSamples && row.winRate != null ? `${Math.round(row.winRate * 100)}%` : `+${Math.max(0, summary.minSamples - row.total)} sample`}</span>
                <span className="font-semibold">{row.total >= summary.minSamples && row.completionRate != null ? `${Math.round(row.completionRate * 100)}%` : "—"}</span>
              </div>
            </div>
          </button>
        ))}
      </Card>
    </section>
  );
}