import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ChevronLeft,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight,
  Loader2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
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
import { ProtectedRoute } from "@/components/protected-route";
import { useTranslation } from "@/lib/i18n";
import {
  useGetAdminFeedback,
  getGetAdminFeedbackQueryKey,
  type AdminFeedbackList,
  type AdminFeedbackRow,
  type GetAdminFeedbackParams,
} from "@workspace/api-client-react";

const PAGE_SIZE = 25;

type FeedbackTypeFilter = "all" | "useful" | "not_useful";

interface FeedbackFilters {
  search: string;
  feedbackType: FeedbackTypeFilter;
  from: string;
  to: string;
  // Drill-down filter set when an admin clicks the feedback signal on a
  // specific analysis card (URL: /admin/feedback?analysisId=N). Lives in
  // FeedbackFilters so it composes with the generic filters and roundtrips
  // through the URL just like the others.
  analysisId: number | undefined;
  page: number;
}

const EMPTY_FILTERS: FeedbackFilters = {
  search: "",
  feedbackType: "all",
  from: "",
  to: "",
  analysisId: undefined,
  page: 1,
};

function readFiltersFromSearch(search: string): FeedbackFilters {
  const params = new URLSearchParams(search);
  const ft = params.get("feedbackType");
  const pageRaw = Number(params.get("page") ?? "1");
  const analysisIdRaw = params.get("analysisId");
  const analysisIdNum = analysisIdRaw == null ? NaN : Number(analysisIdRaw);
  return {
    search: params.get("search") ?? "",
    feedbackType:
      ft === "useful" || ft === "not_useful" ? ft : "all",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    analysisId:
      Number.isFinite(analysisIdNum) && analysisIdNum > 0
        ? Math.floor(analysisIdNum)
        : undefined,
    page: Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1,
  };
}

// Build a "?foo=bar" query string with only the filters that are actually
// active. Page is omitted for page=1 to keep shareable URLs short.
function filtersToSearchString(f: FeedbackFilters): string {
  const params = new URLSearchParams();
  if (f.search.trim()) params.set("search", f.search.trim());
  if (f.feedbackType !== "all") params.set("feedbackType", f.feedbackType);
  if (f.from) params.set("from", f.from);
  if (f.to) params.set("to", f.to);
  if (f.analysisId !== undefined) {
    params.set("analysisId", String(f.analysisId));
  }
  if (f.page > 1) params.set("page", String(f.page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function feedbackTypeBadgeClass(type: AdminFeedbackRow["feedbackType"]) {
  return type === "useful"
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0";
}

function outcomeBadgeClass(outcome: AdminFeedbackRow["outcome"]) {
  if (outcome === "correct") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0";
  }
  if (outcome === "wrong") {
    return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-0";
  }
  return "bg-muted text-muted-foreground border-0";
}

function AdminFeedbackContent() {
  const [, setLocation] = useLocation();
  const { t, lang } = useTranslation();

  // Initial filters come from the URL so /admin/feedback?search=foo or
  // /admin/feedback?analysisId=42 is a first-class shareable view. We keep
  // filters in component state and mirror them back into history.replaceState
  // so filter changes don't pollute the back-button stack.
  const [filters, setFilters] = useState<FeedbackFilters>(() =>
    readFiltersFromSearch(
      typeof window !== "undefined" ? window.location.search : "",
    ),
  );

  // The text input is debounced so we don't fire a request on every keystroke.
  const [searchInput, setSearchInput] = useState(filters.search);
  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
      }
    }, 300);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Mirror current filters to the URL (replaceState — no extra history entry)
  // so the address bar stays in sync and is bookmarkable.
  useEffect(() => {
    const desired = filtersToSearchString(filters);
    if (typeof window === "undefined") return;
    if (window.location.search !== desired) {
      const url =
        window.location.pathname + desired + window.location.hash;
      window.history.replaceState(window.history.state, "", url);
    }
  }, [filters]);

  // Two-way sync: when the user navigates back/forward (or any other code
  // pushes a new URL), rehydrate filter state from the URL so the UI reflects
  // the address bar instead of getting out of sync.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPopState = () => {
      const next = readFiltersFromSearch(window.location.search);
      setFilters(next);
      setSearchInput(next.search);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Translate component state into the API params shape. Empty strings drop
  // out so the server query stays tidy.
  const queryParams: GetAdminFeedbackParams = useMemo(() => {
    const params: GetAdminFeedbackParams = {
      page: filters.page,
      limit: PAGE_SIZE,
    };
    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.feedbackType !== "all") {
      params.feedbackType = filters.feedbackType;
    }
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (filters.analysisId !== undefined) {
      params.analysisId = filters.analysisId;
    }
    return params;
  }, [filters]);

  const { data, isLoading } = useGetAdminFeedback(queryParams, {
    query: { queryKey: getGetAdminFeedbackQueryKey(queryParams) },
  });

  const list = (data as AdminFeedbackList | undefined)?.feedback ?? [];
  const total = (data as AdminFeedbackList | undefined)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const dateLocale = lang === "id" ? idLocale : enUS;

  const outcomeLabel = (outcome: AdminFeedbackRow["outcome"]) => {
    if (outcome === "correct") return t.admin.feedback_outcome_correct;
    if (outcome === "wrong") return t.admin.feedback_outcome_wrong;
    if (outcome === "unknown") return t.admin.feedback_outcome_unknown;
    return t.admin.feedback_outcome_none;
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.feedbackType !== "all" ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.analysisId !== undefined;

  const setFilter = <K extends keyof FeedbackFilters>(
    key: K,
    value: FeedbackFilters[K],
  ) => {
    // Any filter change resets pagination — staying on page 7 of an old
    // filter would otherwise show "no results" for a narrower search.
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({ ...EMPTY_FILTERS });
  };

  const clearAnalysisFilter = () =>
    setFilter("analysisId", undefined);

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/admin")}
            className="p-2 rounded-lg hover:bg-muted"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground">
              {t.admin.feedback_page_title}
            </h1>
            <p
              className="text-xs text-muted-foreground truncate"
              data-testid="text-feedback-total"
            >
              {t.admin.feedback_total.replace("{count}", String(total))}
            </p>
          </div>
        </div>

        {filters.analysisId !== undefined && (
          <div
            className="flex items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2"
            data-testid="banner-analysis-filter"
          >
            <span className="text-xs text-foreground">
              {t.admin.feedback_filtered_by.replace(
                "{id}",
                String(filters.analysisId),
              )}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-xs"
              onClick={clearAnalysisFilter}
              data-testid="button-clear-analysis-filter"
            >
              <X className="w-3 h-3" />
              {t.admin.feedback_clear_filter}
            </Button>
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-1">
            <Label
              htmlFor="feedback-search"
              className="text-xs text-muted-foreground"
            >
              {t.admin.feedback_search_label}
            </Label>
            <Input
              id="feedback-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.admin.feedback_search_placeholder}
              className="h-9 text-sm"
              data-testid="input-feedback-search"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="space-y-1">
              <Label
                htmlFor="feedback-from"
                className="text-xs text-muted-foreground"
              >
                {t.admin.feedback_date_from_label}
              </Label>
              <Input
                id="feedback-from"
                type="date"
                value={filters.from}
                max={filters.to || undefined}
                onChange={(e) => setFilter("from", e.target.value)}
                className="h-9 text-sm"
                data-testid="input-feedback-from"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="feedback-to"
                className="text-xs text-muted-foreground"
              >
                {t.admin.feedback_date_to_label}
              </Label>
              <Input
                id="feedback-to"
                type="date"
                value={filters.to}
                min={filters.from || undefined}
                onChange={(e) => setFilter("to", e.target.value)}
                className="h-9 text-sm"
                data-testid="input-feedback-to"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="feedback-type"
                className="text-xs text-muted-foreground"
              >
                {t.admin.feedback_filter_label}
              </Label>
              <Select
                value={filters.feedbackType}
                onValueChange={(v) =>
                  setFilter("feedbackType", v as FeedbackTypeFilter)
                }
              >
                <SelectTrigger
                  id="feedback-type"
                  className="h-9 text-sm"
                  data-testid="select-feedback-filter"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t.admin.feedback_filter_all}
                  </SelectItem>
                  <SelectItem value="useful">
                    {t.admin.feedback_filter_useful}
                  </SelectItem>
                  <SelectItem value="not_useful">
                    {t.admin.feedback_filter_not_useful}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="h-7 px-2 text-xs gap-1"
                data-testid="button-clear-filters"
              >
                <X className="w-3 h-3" />
                {t.admin.feedback_clear_filters}
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : list.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            data-testid="empty-feedback"
          >
            <MessageSquare className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? t.admin.feedback_no_match
                : t.admin.feedback_empty}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((row) => (
              <Card
                key={row.id}
                className="p-3 space-y-2"
                data-testid={`card-feedback-${row.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">
                        {row.instrument}
                      </span>
                      <Badge
                        className={
                          "text-[10px] px-1.5 py-0 inline-flex items-center gap-1 " +
                          feedbackTypeBadgeClass(row.feedbackType)
                        }
                        data-testid={`badge-feedback-type-${row.id}`}
                      >
                        {row.feedbackType === "useful" ? (
                          <ThumbsUp className="w-3 h-3" />
                        ) : (
                          <ThumbsDown className="w-3 h-3" />
                        )}
                        {row.feedbackType === "useful"
                          ? t.admin.feedback_filter_useful
                          : t.admin.feedback_filter_not_useful}
                      </Badge>
                      <Badge
                        className={
                          "text-[10px] px-1.5 py-0 " +
                          outcomeBadgeClass(row.outcome)
                        }
                        data-testid={`badge-feedback-outcome-${row.id}`}
                      >
                        {outcomeLabel(row.outcome)}
                      </Badge>
                    </div>
                    <p
                      className="text-xs text-muted-foreground truncate"
                      data-testid={`text-feedback-user-${row.id}`}
                    >
                      {row.userEmail}
                    </p>
                  </div>
                  <span
                    className="text-[10px] text-muted-foreground whitespace-nowrap"
                    title={format(new Date(row.createdAt), "d MMM yyyy HH:mm", {
                      locale: dateLocale,
                    })}
                  >
                    {format(new Date(row.createdAt), "d MMM yyyy", {
                      locale: dateLocale,
                    })}
                  </span>
                </div>
                {row.note && (
                  <p
                    className="text-xs text-foreground whitespace-pre-line border-l-2 border-border pl-2"
                    data-testid={`text-feedback-note-${row.id}`}
                  >
                    {row.note}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {!isLoading && total > PAGE_SIZE && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              data-testid="button-feedback-prev-page"
              className="gap-1"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              {t.admin.users_prev_page}
            </Button>
            <span
              className="text-xs text-muted-foreground"
              data-testid="text-feedback-page-indicator"
            >
              {t.admin.users_page_indicator
                .replace("{page}", String(filters.page))
                .replace("{total}", String(totalPages))}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={filters.page >= totalPages}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.min(totalPages, prev.page + 1),
                }))
              }
              data-testid="button-feedback-next-page"
              className="gap-1"
            >
              {t.admin.users_next_page}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function AdminFeedbackPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminFeedbackContent />
    </ProtectedRoute>
  );
}
