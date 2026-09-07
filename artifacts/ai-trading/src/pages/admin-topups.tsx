import { useState } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, Wallet, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { avatarSrc } from "@/lib/avatar";
import {
  useGetPendingTopupRequests,
  getGetPendingTopupRequestsQueryKey,
  useReviewCreditTopupRequest,
  useGetTopupConfig,
  useUpdateTopupConfig,
  getGetTopupConfigQueryKey,
  type TopupRequestWithUser,
  type TopupRequestStatus,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_BADGE: Record<TopupRequestStatus, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const PAGE_SIZE = 20;

function TopupRateEditor() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useGetTopupConfig({ query: { queryKey: getGetTopupConfigQueryKey() } });
  const [rate, setRate] = useState("");
  const updateConfig = useUpdateTopupConfig();

  const currentRate = data?.rupiahPerCredit;

  const handleSave = async () => {
    const parsed = Number(rate);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast({ title: t.admin.topups_rate_invalid, variant: "destructive" });
      return;
    }
    try {
      await updateConfig.mutateAsync({ data: { rupiahPerCredit: Math.floor(parsed) } });
      queryClient.invalidateQueries({ queryKey: getGetTopupConfigQueryKey() });
      setRate("");
      toast({ title: t.admin.topups_rate_save_success });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? t.admin.topups_review_error, variant: "destructive" });
    }
  };

  return (
    <Card className="p-4 space-y-2" data-testid="card-topup-rate">
      <h3 className="text-sm font-semibold text-foreground">{t.admin.topups_rate_label}</h3>
      <p className="text-xs text-muted-foreground">
        {currentRate != null ? `Rp${currentRate.toLocaleString("id-ID")} = 1 kredit` : "…"}
      </p>
      <div className="flex gap-2">
        <Input
          type="number"
          min={1}
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder={String(currentRate ?? "")}
          className="h-9 text-sm"
          data-testid="input-topup-rate"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateConfig.isPending || !rate}
          data-testid="button-save-topup-rate"
        >
          {updateConfig.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
          {t.admin.topups_rate_save_button}
        </Button>
      </div>
    </Card>
  );
}

function AdminTopupsContent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, lang } = useTranslation();
  const dateLocale = lang === "id" ? idLocale : enUS;

  const [statusFilter, setStatusFilter] = useState<TopupRequestStatus>("pending");
  const [page, setPage] = useState(1);
  const [reviewTarget, setReviewTarget] = useState<TopupRequestWithUser | null>(null);
  const [reviewDecision, setReviewDecision] = useState<"approved" | "rejected">("approved");
  const [creditsGranted, setCreditsGranted] = useState("");
  const [reviewNote, setReviewNote] = useState("");

  const queryParams = { status: statusFilter, page, limit: PAGE_SIZE };
  const { data, isLoading } = useGetPendingTopupRequests(
    queryParams,
    { query: { queryKey: getGetPendingTopupRequestsQueryKey(queryParams) } },
  );
  const requests = data?.requests ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const reviewRequest = useReviewCreditTopupRequest();

  const openReview = (request: TopupRequestWithUser, decision: "approved" | "rejected") => {
    setReviewTarget(request);
    setReviewDecision(decision);
    setCreditsGranted(String(request.creditsRequested));
    setReviewNote("");
  };

  const handleReview = async () => {
    if (!reviewTarget) return;
    try {
      await reviewRequest.mutateAsync({
        id: reviewTarget.id,
        data: {
          status: reviewDecision,
          ...(reviewDecision === "approved" ? { creditsGranted: Number(creditsGranted) || undefined } : {}),
          reviewNote: reviewNote.trim() || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetPendingTopupRequestsQueryKey() });
      setReviewTarget(null);
      toast({ title: reviewDecision === "approved" ? t.admin.topups_approve_success : t.admin.topups_reject_success });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? t.admin.topups_review_error, variant: "destructive" });
    }
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
          <h1 className="text-xl font-bold text-foreground">{t.admin.topups_page_title}</h1>
        </div>

        <TopupRateEditor />

        <div className="flex gap-1.5">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:bg-muted"
              }`}
              data-testid={`button-filter-${s}`}
            >
              {t.admin[`topups_filter_${s}` as "topups_filter_pending" | "topups_filter_approved" | "topups_filter_rejected"]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wallet className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm text-muted-foreground">{t.admin.topups_no_requests}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {requests.map((r) => (
              <Card key={r.id} className="p-3" data-testid={`card-topup-${r.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{r.userDisplayName}</span>
                      <Badge variant={STATUS_BADGE[r.status]} className="text-[10px] px-1.5 py-0">
                        {t.admin[`topups_filter_${r.status}` as "topups_filter_pending"]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.userEmail}</p>
                    <p className="text-sm text-foreground mt-1">
                      Rp{r.amountRupiah.toLocaleString("id-ID")} → {r.creditsRequested} kredit
                    </p>
                    {r.paymentReferenceNote && (
                      <p className="text-xs text-muted-foreground mt-0.5">{r.paymentReferenceNote}</p>
                    )}
                    {r.proofObjectPath && (
                      <a
                        href={avatarSrc(r.proofObjectPath) ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1"
                        data-testid={`link-proof-${r.id}`}
                      >
                        <img
                          src={avatarSrc(r.proofObjectPath) ?? undefined}
                          alt="Bukti pembayaran"
                          className="h-16 w-16 object-cover rounded border border-border"
                        />
                      </a>
                    )}
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {format(new Date(r.createdAt), "dd MMM yyyy, HH:mm", { locale: dateLocale })}
                    </p>
                    {r.reviewNote && (
                      <p className="text-xs text-muted-foreground mt-1 italic">"{r.reviewNote}"</p>
                    )}
                  </div>
                  {r.status === "pending" && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => openReview(r, "approved")}
                        className="p-1.5 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-600"
                        data-testid={`button-approve-${r.id}`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openReview(r, "rejected")}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        data-testid={`button-reject-${r.id}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
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
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.admin.users_prev_page}
            </Button>
            <span className="text-xs text-muted-foreground">
              {t.admin.users_page_indicator.replace("{page}", String(page)).replace("{total}", String(totalPages))}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="gap-1"
            >
              {t.admin.users_next_page}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Dialog open={reviewTarget !== null} onOpenChange={(open) => !open && setReviewTarget(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {reviewDecision === "approved" ? t.admin.topups_approve_button : t.admin.topups_reject_button}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {reviewDecision === "approved" && (
                <div>
                  <label className="text-xs text-muted-foreground">{t.admin.topups_credits_granted_label}</label>
                  <Input
                    type="number"
                    min={1}
                    value={creditsGranted}
                    onChange={(e) => setCreditsGranted(e.target.value)}
                    data-testid="input-credits-granted"
                  />
                </div>
              )}
              <Textarea
                placeholder={t.admin.topups_review_note_placeholder}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                data-testid="input-review-note"
              />
              <Button
                className="w-full"
                onClick={handleReview}
                disabled={reviewRequest.isPending}
                variant={reviewDecision === "rejected" ? "destructive" : "default"}
                data-testid="button-confirm-review"
              >
                {reviewRequest.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {reviewDecision === "approved" ? t.admin.topups_approve_button : t.admin.topups_reject_button}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

export default function AdminTopupsPage() {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <AdminTopupsContent />
    </ProtectedRoute>
  );
}
