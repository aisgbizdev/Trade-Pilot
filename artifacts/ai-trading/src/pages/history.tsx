import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Clock, TrendingUp, Loader2, Filter, X, RefreshCw, StickyNote, Search, Bookmark, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { MarketContextChip } from "@/components/market-context-summary";
import { OutcomeBadge, type OutcomeStatus } from "@/components/outcome-badge";
import {
  useListAnalyses,
  getListAnalysesQueryKey,
  useListFilterPresets,
  useCreateFilterPreset,
  useRenameFilterPreset,
  useDeleteFilterPreset,
  getListFilterPresetsQueryKey,
  type AnalysesList,
  type ListAnalysesMode,
  type FilterPreset,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useRefreshAnalysis } from "@/hooks/use-refresh-analysis";

const ALL_INSTRUMENTS = [
  "XAU/USD", "BRENT", "XAG/USD", "HSI", "NIKKEI", "DJIA", "NASDAQ", "DXY",
  "AUD/USD", "EUR/USD", "GBP/USD", "USD/CHF", "USD/JPY", "USD/IDR",
];

const ALL_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W"];

const ALL_INSTRUMENTS_SET = new Set(ALL_INSTRUMENTS);
const ALL_TIMEFRAMES_SET = new Set(ALL_TIMEFRAMES);

// Filter state lives in the URL so the view is shareable / bookmarkable.
// We round-trip through URLSearchParams: arrays are repeated keys (?instruments=A&instruments=B)
// to match the backend's repeatable query-param contract.
type FilterState = {
  mode: ListAnalysesMode | "";
  instruments: string[];
  timeframes: string[];
  from: string;
  to: string;
  q: string;
};

const EMPTY_FILTERS: FilterState = {
  mode: "",
  instruments: [],
  timeframes: [],
  from: "",
  to: "",
  q: "",
};

const MAX_SEARCH_LEN = 100;

// Normalise a list of URL-derived values: trim, drop empties, dedupe,
// and (optionally) whitelist against a known set. This mirrors the
// backend's dedupe/cap behaviour so a crafted URL can't create duplicate
// chips, duplicate React keys, or filters the UI can't render/remove.
function normalizeList(raw: string[], allow?: Set<string>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of raw) {
    const t = (v ?? "").trim();
    if (!t || seen.has(t)) continue;
    if (allow && !allow.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function parseFiltersFromSearch(search: string): { filters: FilterState; page: number } {
  const sp = new URLSearchParams(search);
  const modeRaw = sp.get("mode");
  const mode: ListAnalysesMode | "" =
    modeRaw === "beginner" || modeRaw === "pro" ? modeRaw : "";
  const pageRaw = Number(sp.get("page") ?? 1);
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
  return {
    page,
    filters: {
      mode,
      instruments: normalizeList(sp.getAll("instruments"), ALL_INSTRUMENTS_SET),
      timeframes: normalizeList(sp.getAll("timeframes"), ALL_TIMEFRAMES_SET),
      from: sp.get("from") ?? "",
      to: sp.get("to") ?? "",
      q: (sp.get("q") ?? "").slice(0, MAX_SEARCH_LEN),
    },
  };
}

function buildSearch(filters: FilterState, page: number): string {
  const sp = new URLSearchParams();
  if (filters.mode) sp.set("mode", filters.mode);
  for (const i of filters.instruments) sp.append("instruments", i);
  for (const tf of filters.timeframes) sp.append("timeframes", tf);
  if (filters.from) sp.set("from", filters.from);
  if (filters.to) sp.set("to", filters.to);
  if (filters.q) sp.set("q", filters.q);
  if (page > 1) sp.set("page", String(page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

const MAX_PRESET_NAME_LEN = 40;

// Compare two FilterStates so we can highlight the chip whose saved
// filters match what's currently in the URL. Arrays are compared as
// sets — order on disk shouldn't matter for "are these the same filter
// combo?".
function filtersEqual(a: FilterState, b: FilterState): boolean {
  if (a.mode !== b.mode) return false;
  if (a.from !== b.from || a.to !== b.to || a.q !== b.q) return false;
  if (a.instruments.length !== b.instruments.length) return false;
  if (a.timeframes.length !== b.timeframes.length) return false;
  const aI = new Set(a.instruments);
  for (const v of b.instruments) if (!aI.has(v)) return false;
  const aT = new Set(a.timeframes);
  for (const v of b.timeframes) if (!aT.has(v)) return false;
  return true;
}

// Coerce a preset's stored filters back into a UI FilterState, in case
// an older preset row is missing newer keys (e.g. saved before `q`
// existed). Mirrors EMPTY_FILTERS for the defaults.
function normalisePresetFilters(raw: FilterPreset["filters"]): FilterState {
  const mode = raw?.mode === "beginner" || raw?.mode === "pro" ? raw.mode : "";
  return {
    mode: mode as ListAnalysesMode | "",
    instruments: Array.isArray(raw?.instruments)
      ? normalizeList(raw.instruments, ALL_INSTRUMENTS_SET)
      : [],
    timeframes: Array.isArray(raw?.timeframes)
      ? normalizeList(raw.timeframes, ALL_TIMEFRAMES_SET)
      : [],
    from: typeof raw?.from === "string" ? raw.from : "",
    to: typeof raw?.to === "string" ? raw.to : "",
    q: typeof raw?.q === "string" ? raw.q.slice(0, MAX_SEARCH_LEN) : "",
  };
}

export default function HistoryPage() {
  const { t, lang } = useTranslation();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const search = useSearch();
  const [, setLocation] = useLocation();
  const limit = 20;
  const { refresh, isRefreshing } = useRefreshAnalysis();
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  // Single source of truth: the URL. Filters and page are derived from
  // it on every render, and every UI change calls `apply()` which routes
  // through wouter's `setLocation` (replace=true). This avoids the
  // two-way useEffect race where a URL-driven update could be clobbered
  // by a stale state-driven write-back during back/forward navigation.
  const { filters, page } = useMemo(
    () => parseFiltersFromSearch(search),
    [search],
  );

  const apply = (nextFilters: FilterState, nextPage: number) => {
    const qs = buildSearch(nextFilters, nextPage);
    setLocation(`/history${qs}`, { replace: true });
  };

  const hasActiveFilters =
    filters.mode !== "" ||
    filters.instruments.length > 0 ||
    filters.timeframes.length > 0 ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.q !== "";

  // Debounce the search input: while the user is still typing, the URL
  // (and thus the request) is unchanged. The committed value flows into
  // `filters.q` via the parent URL once typing pauses.
  //
  // Race fix: the debounced fire reads `filters` through a ref so that
  // if the user toggles a non-search filter inside the debounce window
  // (e.g. picks an instrument), the deferred URL write merges into the
  // LATEST filters instead of clobbering them with a stale snapshot.
  const [searchDraft, setSearchDraft] = useState(filters.q);
  const latestFiltersRef = useRef(filters);
  latestFiltersRef.current = filters;
  useEffect(() => {
    // Keep the input in sync if the URL changes externally (back/forward,
    // chip removal). Only overwrite when they actually differ to avoid
    // clobbering the user's in-flight typing.
    setSearchDraft((prev) => (prev === filters.q ? prev : filters.q));
  }, [filters.q]);
  useEffect(() => {
    // Normalise client-side the same way the backend does (trim + cap)
    // so the active-filter chip can never display a value the server
    // wouldn't honour.
    const normalised = searchDraft.trim().slice(0, MAX_SEARCH_LEN);
    if (normalised === filters.q) return;
    const handle = window.setTimeout(() => {
      const live = latestFiltersRef.current;
      apply({ ...live, q: normalised }, 1);
    }, 300);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft, filters.q]);

  // Saved filter presets (task #129). The list is per-user, returned in
  // creation order. Mutations invalidate the same query key so the chip
  // row stays in sync without manual cache surgery.
  const presetsQueryKey = getListFilterPresetsQueryKey();
  const { data: presetsData } = useListFilterPresets({
    query: { queryKey: presetsQueryKey },
  });
  const presets = presetsData?.presets ?? [];
  const invalidatePresets = () =>
    queryClient.invalidateQueries({ queryKey: presetsQueryKey });
  const createPreset = useCreateFilterPreset({
    mutation: { onSuccess: invalidatePresets },
  });
  const renamePreset = useRenameFilterPreset({
    mutation: { onSuccess: invalidatePresets },
  });
  const deletePreset = useDeleteFilterPreset({
    mutation: { onSuccess: invalidatePresets },
  });

  const handleSavePreset = () => {
    if (!hasActiveFilters) return;
    const raw = window.prompt(t.history.preset_prompt_save ?? "Name this preset");
    const name = (raw ?? "").trim().slice(0, MAX_PRESET_NAME_LEN);
    if (!name) return;
    createPreset.mutate(
      { data: { name, filters } },
      {
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { error?: string } } };
          window.alert(
            e?.response?.data?.error ??
              t.history.preset_save_failed ??
              "Could not save preset",
          );
        },
      },
    );
  };

  const handleApplyPreset = (preset: FilterPreset) => {
    apply(normalisePresetFilters(preset.filters), 1);
  };

  const handleRenamePreset = (preset: FilterPreset) => {
    const raw = window.prompt(
      t.history.preset_prompt_rename ?? "Rename preset",
      preset.name,
    );
    if (raw == null) return;
    const name = raw.trim().slice(0, MAX_PRESET_NAME_LEN);
    if (!name || name === preset.name) return;
    renamePreset.mutate(
      { id: preset.id, data: { name } },
      {
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { error?: string } } };
          window.alert(
            e?.response?.data?.error ??
              t.history.preset_save_failed ??
              "Could not rename preset",
          );
        },
      },
    );
  };

  const handleDeletePreset = (preset: FilterPreset) => {
    const confirmMsg = (t.history.preset_confirm_delete ?? "Delete preset \"{name}\"?").replace(
      "{name}",
      preset.name,
    );
    if (!window.confirm(confirmMsg)) return;
    deletePreset.mutate({ id: preset.id });
  };

  const params = {
    page,
    limit,
    ...(filters.mode ? { mode: filters.mode } : {}),
    ...(filters.instruments.length > 0 ? { instruments: filters.instruments } : {}),
    ...(filters.timeframes.length > 0 ? { timeframes: filters.timeframes } : {}),
    ...(filters.from ? { from: filters.from } : {}),
    ...(filters.to ? { to: filters.to } : {}),
    ...(filters.q ? { q: filters.q } : {}),
  };

  const { data, isLoading } = useListAnalyses(
    params,
    { query: { queryKey: getListAnalysesQueryKey(params) } }
  );

  const listData = data as AnalysesList | undefined;
  const analyses = listData?.analyses ?? [];
  const total = listData?.total ?? 0;
  const hasMore = page * limit < total;

  const updateFilters = (next: FilterState) => {
    apply(next, 1);
  };

  const toggleInstrument = (inst: string) => {
    const exists = filters.instruments.includes(inst);
    updateFilters({
      ...filters,
      instruments: exists
        ? filters.instruments.filter((i) => i !== inst)
        : [...filters.instruments, inst],
    });
  };

  const toggleTimeframe = (tf: string) => {
    const exists = filters.timeframes.includes(tf);
    updateFilters({
      ...filters,
      timeframes: exists
        ? filters.timeframes.filter((t) => t !== tf)
        : [...filters.timeframes, tf],
    });
  };

  const handleClearFilters = () => {
    apply(EMPTY_FILTERS, 1);
  };

  // Build the active-filter chip list — one chip per concrete filter value
  // so the user can tap × on a single instrument without nuking the rest.
  type Chip = { key: string; label: string; remove: () => void };
  const activeChips: Chip[] = [];
  if (filters.mode) {
    activeChips.push({
      key: `mode-${filters.mode}`,
      label: `${t.history.mode_chip_prefix ?? "Mode"}: ${filters.mode === "beginner" ? t.common.beginner : t.common.pro}`,
      remove: () => updateFilters({ ...filters, mode: "" }),
    });
  }
  for (const inst of filters.instruments) {
    activeChips.push({
      key: `inst-${inst}`,
      label: inst,
      remove: () =>
        updateFilters({
          ...filters,
          instruments: filters.instruments.filter((i) => i !== inst),
        }),
    });
  }
  for (const tf of filters.timeframes) {
    activeChips.push({
      key: `tf-${tf}`,
      label: tf,
      remove: () =>
        updateFilters({
          ...filters,
          timeframes: filters.timeframes.filter((t) => t !== tf),
        }),
    });
  }
  if (filters.from) {
    activeChips.push({
      key: "from",
      label: `${t.history.from_date ?? "From"}: ${filters.from}`,
      remove: () => updateFilters({ ...filters, from: "" }),
    });
  }
  if (filters.to) {
    activeChips.push({
      key: "to",
      label: `${t.history.to_date ?? "To"}: ${filters.to}`,
      remove: () => updateFilters({ ...filters, to: "" }),
    });
  }
  if (filters.q) {
    activeChips.push({
      key: "q",
      label: `${t.history.search ?? "Search"}: "${filters.q}"`,
      remove: () => updateFilters({ ...filters, q: "" }),
    });
  }

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

          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              inputMode="search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value.slice(0, MAX_SEARCH_LEN))}
              maxLength={MAX_SEARCH_LEN}
              placeholder={t.history.search_placeholder ?? "Search notes, instrument, AI reasoning…"}
              data-testid="input-history-search"
              className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {searchDraft && (
              <button
                type="button"
                onClick={() => setSearchDraft("")}
                aria-label={t.common.clear_filters ?? "Clear"}
                data-testid="button-clear-search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {(presets.length > 0 || hasActiveFilters) && (
            <div
              className="mt-2 flex flex-wrap gap-1.5 items-center"
              data-testid="preset-row"
            >
              <Bookmark className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mr-1">
                {t.history.presets ?? "Presets"}
              </span>
              {presets.map((preset) => {
                const active = filtersEqual(filters, normalisePresetFilters(preset.filters));
                return (
                  <div
                    key={preset.id}
                    className={cn(
                      "inline-flex items-center rounded-full text-[11px] font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80",
                    )}
                    data-testid={`preset-${preset.id}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      data-testid={`preset-apply-${preset.id}`}
                      className="pl-2.5 pr-1 py-0.5"
                      title={preset.name}
                    >
                      {preset.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRenamePreset(preset)}
                      data-testid={`preset-rename-${preset.id}`}
                      aria-label={t.history.preset_rename ?? "Rename preset"}
                      className={cn(
                        "p-1 rounded-full transition-colors",
                        active
                          ? "hover:bg-primary-foreground/20"
                          : "hover:bg-foreground/10 text-muted-foreground",
                      )}
                    >
                      <Pencil className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePreset(preset)}
                      data-testid={`preset-delete-${preset.id}`}
                      aria-label={t.history.preset_delete ?? "Delete preset"}
                      className={cn(
                        "p-1 pr-2 rounded-full transition-colors",
                        active
                          ? "hover:bg-primary-foreground/20"
                          : "hover:bg-foreground/10 text-muted-foreground",
                      )}
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleSavePreset}
                  disabled={createPreset.isPending}
                  data-testid="button-save-preset"
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border border-dashed border-primary/50 text-primary hover:bg-primary/10 transition-colors disabled:opacity-60"
                >
                  <Bookmark className="w-2.5 h-2.5" />
                  {t.history.save_preset ?? "Save preset"}
                </button>
              )}
            </div>
          )}

          {activeChips.length > 0 && (
            <div
              className="mt-2 flex flex-wrap gap-1.5 items-center"
              data-testid="active-filters-row"
            >
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mr-1">
                {t.history.active_filters ?? "Active filters"}
              </span>
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={chip.remove}
                  data-testid={`chip-${chip.key}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <span>{chip.label}</span>
                  <X className="w-2.5 h-2.5" />
                </button>
              ))}
              <button
                onClick={handleClearFilters}
                data-testid="button-clear-filters-chips"
                className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                {t.history.clear_all ?? "Clear all"}
              </button>
            </div>
          )}

          {showFilters && (
            <div className="mt-3 p-3 rounded-xl border border-border bg-muted/30 space-y-3" data-testid="filter-panel">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mode</p>
                <div className="flex gap-2">
                  {(["", "beginner", "pro"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => updateFilters({ ...filters, mode: m as ListAnalysesMode | "" })}
                      data-testid={`filter-mode-${m || "all"}`}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                        filters.mode === m
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
                  {ALL_INSTRUMENTS.map((inst) => {
                    const active = filters.instruments.includes(inst);
                    return (
                      <button
                        key={inst}
                        onClick={() => toggleInstrument(inst)}
                        data-testid={`filter-instrument-${inst}`}
                        aria-pressed={active}
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-lg border transition-all",
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        {inst}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  {t.history.timeframe ?? "Timeframe"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TIMEFRAMES.map((tf) => {
                    const active = filters.timeframes.includes(tf);
                    return (
                      <button
                        key={tf}
                        onClick={() => toggleTimeframe(tf)}
                        data-testid={`filter-timeframe-${tf}`}
                        aria-pressed={active}
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-lg border transition-all",
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        {tf}
                      </button>
                    );
                  })}
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
                      value={filters.from}
                      onChange={(e) => updateFilters({ ...filters, from: e.target.value })}
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
                      value={filters.to}
                      onChange={(e) => updateFilters({ ...filters, to: e.target.value })}
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
          <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="history-empty-state">
            <TrendingUp className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm font-medium text-foreground">
              {hasActiveFilters
                ? (t.history.no_results_with_filters_title ?? "No matches for these filters")
                : t.history.no_analyses_title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {hasActiveFilters
                ? (t.history.no_results_with_filters_subtitle ?? "Try removing a filter or clearing all to see more analyses.")
                : t.history.no_analyses_subtitle}
            </p>
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
              const mc = a.marketCondition ? MARKET_CONDITION_LABELS[a.marketCondition] : undefined;
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
                        {a.techBuyCount != null && a.techSellCount != null && (
                          <MarketContextChip
                            buy={a.techBuyCount}
                            sell={a.techSellCount}
                          />
                        )}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {format(new Date(a.createdAt), "dd MMM yyyy HH:mm", { locale: dateLocale })}
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <OutcomeBadge status={(a as { outcomeStatus?: OutcomeStatus | null }).outcomeStatus} />
                      {(a as { hasNote?: boolean }).hasNote && (
                        <span
                          aria-label={t.history.has_note}
                          title={t.history.has_note}
                          data-testid={`icon-has-note-${a.id}`}
                          className="inline-flex items-center text-primary"
                        >
                          <StickyNote className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <Badge
                        variant={valid ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {valid ? t.history.valid : t.history.expired}
                      </Badge>
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
                        aria-label={t.history.analyze_again}
                        title={t.history.analyze_again}
                        data-testid={`button-reanalyze-row-${a.id}`}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-primary bg-primary/10 hover:bg-primary/15 transition-colors",
                          refreshing && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {refreshing ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>{t.history.analyzing_again}</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3" />
                            <span>{t.history.analyze_again}</span>
                          </>
                        )}
                      </button>
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
                onClick={() => apply(filters, Math.max(1, page - 1))}
                data-testid="button-prev-page"
              >
                {t.history.prev}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={!hasMore}
                onClick={() => apply(filters, page + 1)}
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
