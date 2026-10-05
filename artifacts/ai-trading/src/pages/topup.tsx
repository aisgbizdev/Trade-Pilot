import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { Wallet, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { TopupFlow, WhatsAppGlyph, buildWhatsAppSupportUrl } from "@/components/topup-flow";
import {
  useGetCreditBalance,
  getGetCreditBalanceQueryKey,
  useGetMyTopupRequests,
  getGetMyTopupRequestsQueryKey,
  useGetDokuTopupStatus,
  type TopupRequestStatus,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_BADGE: Record<TopupRequestStatus, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

// Custom scheme already registered on both platforms for social-login
// handoff (see mobile-oauth.ts) — reused here for the opposite direction:
// returning to the app once a DOKU payment started from it resolves. The
// app never trusts status/id from this URL for anything real — it just
// re-fetches the balance from the server, same as on any resume (see chat
// 2026-10-05). This is purely a "come back here" nudge.
function buildAppReturnUrl(status: "approved" | "failed" | "cancelled", id: number): string {
  return `id.tradepilot.app://topup/result?status=${status}&id=${id}`;
}

// After DOKU's hosted checkout page redirects back, the id.tradepilot.app
// domain has already left and returned — read the outcome purely from the
// URL (?doku=success|cancel&id=N[&source=app]), never from component state
// that would have been lost across that navigation.
function useDokuReturnStatus() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<"cancelled" | null>(null);
  // Captured once on mount, before the query string gets stripped below —
  // `id` is kept separately from `pendingId`/`outcome` since it's needed
  // for the cancel case too (that path never sets pendingId).
  const [appReturn, setAppReturn] = useState<{ fromApp: boolean; id: number | null }>({
    fromApp: false,
    id: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dokuParam = params.get("doku");
    const idParam = Number(params.get("id"));
    const validId = Number.isFinite(idParam) && idParam > 0 ? idParam : null;
    if (!dokuParam) return;
    // Strip the query string so a page refresh doesn't re-trigger this.
    window.history.replaceState({}, "", window.location.pathname);
    setAppReturn({ fromApp: params.get("source") === "app", id: validId });
    if (dokuParam === "success" && validId !== null) {
      setPendingId(validId);
    } else if (dokuParam === "cancel") {
      setOutcome("cancelled");
      toast({ title: t.topup.doku_status_cancelled });
    }
    // Only ever read on first mount — this is a one-shot redirect landing,
    // not something that should re-run on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: statusData } = useGetDokuTopupStatus(pendingId ?? 0, {
    query: {
      queryKey: ["doku-topup-status", pendingId],
      enabled: pendingId !== null,
      refetchInterval: (query) => (query.state.data?.status === "pending" ? 2000 : false),
    },
  });

  // Fires the resolution toast + balance/history refresh exactly once.
  // Deliberately does NOT reset pendingId back to null — this hook's
  // query is the only source of the final approved/rejected status, and
  // resetting it would blank the status card (and, for an app-sourced
  // return, the app-return button) the instant it had something to show.
  const settledStatusRef = useRef<string | null>(null);
  useEffect(() => {
    if (!statusData || statusData.status === "pending") return;
    if (settledStatusRef.current === statusData.status) return;
    settledStatusRef.current = statusData.status;
    queryClient.invalidateQueries({ queryKey: getGetMyTopupRequestsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetCreditBalanceQueryKey() });
    if (statusData.status === "approved") {
      toast({ title: t.topup.doku_status_success });
    } else if (statusData.status === "rejected") {
      toast({ title: t.topup.doku_status_failed, variant: "destructive" });
    }
  }, [statusData?.status, queryClient, toast, t]);

  // Only resolves once the outcome is final (never while still "pending")
  // — an app user shouldn't get bounced back before the payment is
  // actually settled.
  const appReturnUrl =
    appReturn.fromApp && appReturn.id !== null
      ? outcome === "cancelled"
        ? buildAppReturnUrl("cancelled", appReturn.id)
        : statusData?.status === "approved"
          ? buildAppReturnUrl("approved", appReturn.id)
          : statusData?.status === "rejected"
            ? buildAppReturnUrl("failed", appReturn.id)
            : null
      : null;

  useEffect(() => {
    // Auto-fire once the outcome is known. iOS Safari and some Android
    // browsers can silently swallow this (no installed-app handler, or a
    // policy blocking programmatic scheme navigation) — the "Back to the
    // app" button rendered alongside the status card is the fallback for
    // exactly that case, not dead UI.
    if (appReturnUrl) window.location.href = appReturnUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appReturnUrl]);

  if (outcome === "cancelled") {
    return { icon: XCircle as typeof XCircle, text: t.topup.doku_status_cancelled, tone: "muted" as const, appReturnUrl };
  }
  if (pendingId !== null) {
    if (statusData?.status === "approved") {
      return { icon: CheckCircle2, text: t.topup.doku_status_success, tone: "success" as const, appReturnUrl };
    }
    if (statusData?.status === "rejected") {
      return { icon: XCircle as typeof XCircle, text: t.topup.doku_status_failed, tone: "muted" as const, appReturnUrl };
    }
    return { icon: Loader2, text: t.topup.doku_status_processing, tone: "pending" as const, appReturnUrl: null };
  }
  return null;
}

export default function TopupPage() {
  const { t, lang } = useTranslation();
  const dateLocale = lang === "id" ? idLocale : enUS;

  const { data: balanceData } = useGetCreditBalance({ query: { queryKey: getGetCreditBalanceQueryKey() } });
  const { data: history } = useGetMyTopupRequests(
    { page: 1, limit: 20 },
    { query: { queryKey: getGetMyTopupRequestsQueryKey({ page: 1, limit: 20 }) } },
  );
  const dokuReturn = useDokuReturnStatus();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6" data-testid="topup-container">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{t.topup.title}</h1>

        <Card className="p-5 shadow-sm flex items-center justify-between" data-testid="card-credit-balance">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.topup.balance_label}</p>
              <p className="text-xl font-bold text-foreground" data-testid="text-credit-balance">
                {balanceData?.balance ?? 0}
              </p>
            </div>
          </div>
        </Card>

        {dokuReturn && (
          <Card
            className={
              "p-4 flex items-center gap-3 flex-wrap " +
              (dokuReturn.tone === "success"
                ? "border-emerald-500/40 bg-emerald-500/5"
                : dokuReturn.tone === "pending"
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "")
            }
            data-testid="card-doku-return-status"
          >
            <dokuReturn.icon
              className={
                "w-5 h-5 shrink-0 " +
                (dokuReturn.tone === "success"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : dokuReturn.tone === "pending"
                    ? "text-amber-600 dark:text-amber-400 animate-spin"
                    : "text-muted-foreground")
              }
            />
            <p className="text-sm text-foreground flex-1 min-w-0">{dokuReturn.text}</p>
            {dokuReturn.appReturnUrl && (
              // Fallback for when the automatic id.tradepilot.app:// redirect
              // (fired from useDokuReturnStatus) gets silently blocked —
              // happens on iOS Safari and some Android browsers depending on
              // policy/app-install state.
              <Button asChild size="sm" variant="outline" data-testid="button-doku-return-to-app">
                <a href={dokuReturn.appReturnUrl}>{t.topup.doku_return_to_app}</a>
              </Button>
            )}
          </Card>
        )}

        <TopupFlow />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">{t.topup.history_title}</h3>
          {!history?.requests.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">{t.topup.history_empty}</p>
          ) : (
            <div className="space-y-2">
              {history.requests.map((r) => (
                <Card key={r.id} className="p-3" data-testid={`card-history-${r.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Rp{r.amountRupiah.toLocaleString("id-ID")} → {r.creditsRequested} kredit
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {format(new Date(r.createdAt), "dd MMM yyyy, HH:mm", { locale: dateLocale })}
                      </p>
                      {r.reviewNote && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{r.reviewNote}"</p>
                      )}
                      {r.paymentProvider === "doku" && r.status === "pending" && r.dokuPaymentUrl && (
                        <a
                          href={r.dokuPaymentUrl}
                          className="inline-block mt-1 text-xs font-medium text-primary hover:underline"
                          data-testid={`link-resume-doku-payment-${r.id}`}
                        >
                          {t.topup.doku_resume_payment}
                        </a>
                      )}
                    </div>
                    <Badge variant={STATUS_BADGE[r.status]} className="text-[10px] px-1.5 py-0 shrink-0">
                      {t.topup[`status_${r.status}` as "status_pending"]}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating WhatsApp shortcut — this page only. The small inline
          links inside TopupFlow's proof-notice dialog weren't visible
          enough on their own. */}
      <a
        href={buildWhatsAppSupportUrl(t.topup.support_whatsapp_message)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 active:scale-95"
        style={{
          marginBottom: "env(safe-area-inset-bottom, 0px)",
          marginRight: "env(safe-area-inset-right, 0px)",
        }}
        data-testid="button-whatsapp-fab"
        aria-label={t.topup.support_whatsapp_cta}
        title={t.topup.support_whatsapp_cta}
      >
        <WhatsAppGlyph className="h-7 w-7" />
      </a>
    </Layout>
  );
}
