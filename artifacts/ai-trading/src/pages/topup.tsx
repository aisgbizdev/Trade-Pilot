import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { Wallet, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// After DOKU's hosted checkout page redirects back, the id.tradepilot.app
// domain has already left and returned — read the outcome purely from the
// URL (?doku=success|cancel&id=N), never from component state that would
// have been lost across that navigation.
function useDokuReturnStatus() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<"cancelled" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dokuParam = params.get("doku");
    const idParam = Number(params.get("id"));
    if (!dokuParam) return;
    // Strip the query string so a page refresh doesn't re-trigger this.
    window.history.replaceState({}, "", window.location.pathname);
    if (dokuParam === "success" && Number.isFinite(idParam) && idParam > 0) {
      setPendingId(idParam);
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

  useEffect(() => {
    if (!statusData || statusData.status === "pending") return;
    queryClient.invalidateQueries({ queryKey: getGetMyTopupRequestsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetCreditBalanceQueryKey() });
    if (statusData.status === "approved") {
      toast({ title: t.topup.doku_status_success });
    } else if (statusData.status === "rejected") {
      toast({ title: t.topup.doku_status_failed, variant: "destructive" });
    }
    setPendingId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusData?.status]);

  if (outcome === "cancelled") {
    return { icon: XCircle as typeof XCircle, text: t.topup.doku_status_cancelled, tone: "muted" as const };
  }
  if (pendingId !== null) {
    if (statusData?.status === "approved") {
      return { icon: CheckCircle2, text: t.topup.doku_status_success, tone: "success" as const };
    }
    return { icon: Loader2, text: t.topup.doku_status_processing, tone: "pending" as const };
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
              "p-4 flex items-center gap-3 " +
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
            <p className="text-sm text-foreground">{dokuReturn.text}</p>
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
