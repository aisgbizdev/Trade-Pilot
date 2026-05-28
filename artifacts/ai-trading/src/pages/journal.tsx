import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  BookOpen,
  Filter,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Loader2,
  ExternalLink,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/layout";
import { LogTradeDialog } from "@/components/log-trade-dialog";
import {
  useListJournalEntries,
  useGetJournalStats,
  useDeleteJournalEntry,
  getListJournalEntriesQueryKey,
  getGetJournalStatsQueryKey,
  type JournalEntry,
  type ListJournalEntriesParams,
  type ListJournalEntriesOutcome,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id as idLocale, enUS, type Locale } from "date-fns/locale";
import { cn } from "@/lib/utils";

const OUTCOMES: ListJournalEntriesOutcome[] = [
  "win",
  "loss",
  "breakeven",
  "open",
  "skipped",
];

const ALL_INSTRUMENTS = [
  "XAU/USD",
  "BRENT",
  "XAG/USD",
  "HSI",
  "NIKKEI",
  "DJIA",
  "NASDAQ",
  "DXY",
  "AUD/USD",
  "EUR/USD",
  "GBP/USD",
  "USD/CHF",
  "USD/JPY",
  "USD/IDR",
];

const SENTINEL_ALL = "__all__";

function fmtPct(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function fmtNum(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}`;
}

function fmtRate(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${Math.round(n * 100)}%`;
}

export default function JournalPage() {
  const { t, lang } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dateLocale = lang === "id" ? idLocale : enUS;

  const [filterInstrument, setFilterInstrument] = useState<string>("");
  const [filterOutcome, setFilterOutcome] = useState<string>("");
  const [filterFrom, setFilterFrom] = useState<string>("");
  const [filterTo, setFilterTo] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);

  const listParams: ListJournalEntriesParams = useMemo(() => {
    const p: ListJournalEntriesParams = {};
    if (filterInstrument) p.instrument = filterInstrument;
    if (filterOutcome) p.outcome = filterOutcome as ListJournalEntriesOutcome;
    if (filterFrom) p.from = new Date(filterFrom).toISOString();
    if (filterTo) p.to = new Date(filterTo).toISOString();
    return p;
  }, [filterInstrument, filterOutcome, filterFrom, filterTo]);

  const { data: listData, isLoading } = useListJournalEntries(listParams, {
    query: { queryKey: getListJournalEntriesQueryKey(listParams) },
  });
  const statsParams = useMemo(() => {
    const p: { from?: string; to?: string } = {};
    if (filterFrom) p.from = new Date(filterFrom).toISOString();
    if (filterTo) p.to = new Date(filterTo).toISOString();
    return p;
  }, [filterFrom, filterTo]);
  const { data: stats } = useGetJournalStats(statsParams, {
    query: { queryKey: getGetJournalStatsQueryKey(statsParams) },
  });

  const deleteMutation = useDeleteJournalEntry();

  const entries = listData?.entries ?? [];
  const hasFilters = !!(
    filterInstrument ||
    filterOutcome ||
    filterFrom ||
    filterTo
  );

  const handleDelete = (entry: JournalEntry) => {
    if (!window.confirm(t.journal.delete_confirm)) return;
    deleteMutation.mutate(
      { id: entry.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListJournalEntriesQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetJournalStatsQueryKey(),
          });
        },
        onError: () => {
          toast({ title: t.journal.delete_failed, variant: "destructive" });
        },
      },
    );
  };

  const sessionLabel = (key: string): string => {
    if (key === "asia") return t.journal.session_asia;
    if (key === "london") return t.journal.session_london;
    if (key === "newyork") return t.journal.session_newyork;
    return t.journal.session_off;
  };

  return (
    <Layout>
      <div className="px-4 pb-24 pt-2 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <h1
                className="text-lg font-bold text-foreground leading-tight"
                data-testid="text-journal-title"
              >
                {t.journal.title}
              </h1>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {t.journal.subtitle}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            data-testid="button-add-journal-entry"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t.journal.add_entry}
          </Button>
        </div>

        {/* Stats summary */}
        <Card className="p-4 space-y-3" data-testid="card-journal-stats">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t.journal.stats_title}
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <StatBox
              label={t.journal.stats_win_rate}
              value={fmtRate(stats?.winRate)}
              testId="stat-win-rate"
            />
            <StatBox
              label={t.journal.stats_avg_pnl_pct}
              value={fmtPct(stats?.avgPnlPercent)}
              testId="stat-avg-pnl-pct"
              valueClass={
                (stats?.avgPnlPercent ?? 0) >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }
            />
            <StatBox
              label={t.journal.stats_total}
              value={String(stats?.totals.entries ?? 0)}
              testId="stat-total"
            />
            <StatBox
              label={t.journal.stats_resolved}
              value={String(stats?.totals.resolved ?? 0)}
              testId="stat-resolved"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <RankRow
              label={t.journal.stats_best_instrument}
              keyText={stats?.bestInstrument?.key ?? null}
              avg={stats?.bestInstrument?.avgPnlPercent ?? null}
              positive
              testId="rank-best-instrument"
            />
            <RankRow
              label={t.journal.stats_worst_instrument}
              keyText={stats?.worstInstrument?.key ?? null}
              avg={stats?.worstInstrument?.avgPnlPercent ?? null}
              testId="rank-worst-instrument"
            />
            <RankRow
              label={t.journal.stats_best_session}
              keyText={
                stats?.bestSession?.key ? sessionLabel(stats.bestSession.key) : null
              }
              avg={stats?.bestSession?.avgPnlPercent ?? null}
              positive
              testId="rank-best-session"
            />
            <RankRow
              label={t.journal.stats_worst_session}
              keyText={
                stats?.worstSession?.key
                  ? sessionLabel(stats.worstSession.key)
                  : null
              }
              avg={stats?.worstSession?.avgPnlPercent ?? null}
              testId="rank-worst-session"
            />
          </div>
          {stats &&
            stats.totals.resolved < 2 &&
            !stats.bestInstrument &&
            !stats.bestSession && (
              <p className="text-[11px] text-muted-foreground italic">
                {t.journal.stats_need_more}
              </p>
            )}
        </Card>

        {/* Filters */}
        <Card className="p-3 space-y-3" data-testid="card-journal-filters">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t.journal.filters}
            </span>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-7 px-2 text-[11px]"
                onClick={() => {
                  setFilterInstrument("");
                  setFilterOutcome("");
                  setFilterFrom("");
                  setFilterTo("");
                }}
                data-testid="button-clear-journal-filters"
              >
                <X className="w-3 h-3 mr-1" />
                {t.journal.clear_filters}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[11px]">{t.journal.filter_instrument}</Label>
              <Select
                value={filterInstrument || SENTINEL_ALL}
                onValueChange={(v) =>
                  setFilterInstrument(v === SENTINEL_ALL ? "" : v)
                }
              >
                <SelectTrigger
                  className="h-9 text-xs"
                  data-testid="select-filter-instrument"
                >
                  <SelectValue placeholder={t.journal.filter_all_instruments} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SENTINEL_ALL}>
                    {t.journal.filter_all_instruments}
                  </SelectItem>
                  {ALL_INSTRUMENTS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t.journal.filter_outcome}</Label>
              <Select
                value={filterOutcome || SENTINEL_ALL}
                onValueChange={(v) =>
                  setFilterOutcome(v === SENTINEL_ALL ? "" : v)
                }
              >
                <SelectTrigger
                  className="h-9 text-xs"
                  data-testid="select-filter-outcome"
                >
                  <SelectValue placeholder={t.journal.filter_all_outcomes} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SENTINEL_ALL}>
                    {t.journal.filter_all_outcomes}
                  </SelectItem>
                  {OUTCOMES.map((o) => (
                    <SelectItem key={o} value={o}>
                      {outcomeLabel(o, t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t.journal.filter_from}</Label>
              <Input
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="h-9 text-xs"
                data-testid="input-filter-from"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">{t.journal.filter_to}</Label>
              <Input
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="h-9 text-xs"
                data-testid="input-filter-to"
              />
            </div>
          </div>
        </Card>

        {/* Entries list */}
        {isLoading ? (
          <div
            className="flex items-center justify-center py-12 text-muted-foreground"
            data-testid="text-journal-loading"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <Card
            className="p-8 text-center space-y-2"
            data-testid="card-journal-empty"
          >
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-semibold text-foreground">
              {t.journal.no_entries_title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t.journal.no_entries_subtitle}
            </p>
          </Card>
        ) : (
          <div className="space-y-2" data-testid="list-journal-entries">
            {entries.map((entry) => (
              <JournalEntryRow
                key={entry.id}
                entry={entry}
                onEdit={() => {
                  setEditing(entry);
                  setDialogOpen(true);
                }}
                onDelete={() => handleDelete(entry)}
                dateLocale={dateLocale}
                tJournal={t.journal}
              />
            ))}
          </div>
        )}
      </div>

      <LogTradeDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        editing={editing}
      />
    </Layout>
  );
}

function outcomeLabel(
  o: ListJournalEntriesOutcome,
  t: ReturnType<typeof useTranslation>["t"],
): string {
  switch (o) {
    case "win":
      return t.journal.outcome_win;
    case "loss":
      return t.journal.outcome_loss;
    case "breakeven":
      return t.journal.outcome_breakeven;
    case "open":
      return t.journal.outcome_open;
    case "skipped":
      return t.journal.outcome_skipped;
  }
}

function outcomeBadgeClass(o: string): string {
  switch (o) {
    case "win":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "loss":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    case "breakeven":
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800";
    case "open":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "skipped":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    default:
      return "";
  }
}

function StatBox({
  label,
  value,
  testId,
  valueClass,
}: {
  label: string;
  value: string;
  testId: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-md border border-border/60 p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
        {label}
      </p>
      <p
        className={cn("text-lg font-bold mt-0.5", valueClass)}
        data-testid={testId}
      >
        {value}
      </p>
    </div>
  );
}

function RankRow({
  label,
  keyText,
  avg,
  positive,
  testId,
}: {
  label: string;
  keyText: string | null;
  avg: number | null | undefined;
  positive?: boolean;
  testId: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 px-2 py-1.5 rounded border border-border/40 bg-muted/30"
      data-testid={testId}
    >
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-semibold",
          keyText
            ? positive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
            : "text-muted-foreground",
        )}
      >
        {keyText ? `${keyText} ${fmtPct(avg)}` : "—"}
      </span>
    </div>
  );
}

function JournalEntryRow({
  entry,
  onEdit,
  onDelete,
  dateLocale,
  tJournal,
}: {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
  dateLocale: Locale;
  tJournal: ReturnType<typeof useTranslation>["t"]["journal"];
}) {
  const isBuy = entry.side === "buy";
  const pnlPct =
    entry.pnlPercent != null ? Number(entry.pnlPercent) : null;
  const pnlAmt = entry.pnlAmount != null ? Number(entry.pnlAmount) : null;
  const tradedAt = new Date(entry.tradedAt);

  return (
    <Card className="p-3 space-y-2" data-testid={`journal-entry-${entry.id}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm text-foreground">
              {entry.instrument}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0",
                isBuy
                  ? "border-emerald-300 text-emerald-700 dark:text-emerald-400"
                  : "border-red-300 text-red-700 dark:text-red-400",
              )}
            >
              {isBuy ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {isBuy ? tJournal.side_buy : tJournal.side_sell}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1.5 py-0", outcomeBadgeClass(entry.outcome))}
            >
              {outcomeLabel(
                entry.outcome as ListJournalEntriesOutcome,
                { journal: tJournal } as ReturnType<typeof useTranslation>["t"],
              )}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {format(tradedAt, "PPp", { locale: dateLocale })}
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onEdit}
            aria-label={tJournal.edit_entry}
            data-testid={`button-edit-entry-${entry.id}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-600 dark:text-red-400"
            onClick={onDelete}
            aria-label={tJournal.delete}
            data-testid={`button-delete-entry-${entry.id}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {(entry.entryPrice || entry.exitPrice || pnlPct != null) && (
        <div className="grid grid-cols-3 gap-2 text-[11px] text-foreground">
          <div>
            <p className="text-muted-foreground">{tJournal.entry_price}</p>
            <p className="font-medium">{entry.entryPrice ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{tJournal.exit_price}</p>
            <p className="font-medium">{entry.exitPrice ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{tJournal.pnl}</p>
            <p
              className={cn(
                "font-semibold",
                pnlPct == null
                  ? "text-muted-foreground"
                  : pnlPct >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
              )}
            >
              {pnlPct != null
                ? fmtPct(pnlPct)
                : pnlAmt != null
                  ? fmtNum(pnlAmt)
                  : "—"}
            </p>
          </div>
        </div>
      )}

      {entry.mood && (
        <Badge variant="secondary" className="text-[10px]">
          {entry.mood}
        </Badge>
      )}

      {entry.note && (
        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap border-l-2 border-border pl-2">
          {entry.note}
        </p>
      )}

      {entry.analysisId && (
        <Link
          href={`/analyses/${entry.analysisId}`}
          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
          data-testid={`link-entry-analysis-${entry.id}`}
        >
          <ExternalLink className="w-3 h-3" />
          {tJournal.linked_analysis.replace("{id}", String(entry.analysisId))}
        </Link>
      )}
    </Card>
  );
}
