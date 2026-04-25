import { useState } from "react";
import { useLocation } from "wouter";
import {
  ChevronLeft,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight,
  Loader2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@workspace/api-client-react";

const PAGE_SIZE = 25;

type FeedbackTypeFilter = "all" | "useful" | "not_useful";

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
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FeedbackTypeFilter>("all");

  const queryParams = { page, limit: PAGE_SIZE };
  const { data, isLoading } = useGetAdminFeedback(queryParams, {
    query: { queryKey: getGetAdminFeedbackQueryKey(queryParams) },
  });

  const list = (data as AdminFeedbackList | undefined)?.feedback ?? [];
  const total = (data as AdminFeedbackList | undefined)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const visibleRows =
    filter === "all" ? list : list.filter((row) => row.feedbackType === filter);

  const dateLocale = lang === "id" ? idLocale : enUS;

  const outcomeLabel = (outcome: AdminFeedbackRow["outcome"]) => {
    if (outcome === "correct") return t.admin.feedback_outcome_correct;
    if (outcome === "wrong") return t.admin.feedback_outcome_wrong;
    if (outcome === "unknown") return t.admin.feedback_outcome_unknown;
    return t.admin.feedback_outcome_none;
  };

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

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {t.admin.feedback_filter_label}
          </span>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as FeedbackTypeFilter)}
          >
            <SelectTrigger
              className="h-8 w-[160px] text-xs"
              data-testid="select-feedback-filter"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.admin.feedback_filter_all}</SelectItem>
              <SelectItem value="useful">
                {t.admin.feedback_filter_useful}
              </SelectItem>
              <SelectItem value="not_useful">
                {t.admin.feedback_filter_not_useful}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : visibleRows.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            data-testid="empty-feedback"
          >
            <MessageSquare className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t.admin.feedback_empty}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleRows.map((row) => (
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
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                .replace("{page}", String(page))
                .replace("{total}", String(totalPages))}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
