import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { useTranslation } from "@/lib/i18n";
import { TopupFlow, WhatsAppGlyph, buildWhatsAppSupportUrl } from "@/components/topup-flow";
import {
  useGetCreditBalance,
  getGetCreditBalanceQueryKey,
  useGetMyTopupRequests,
  getGetMyTopupRequestsQueryKey,
  type TopupRequestStatus,
} from "@workspace/api-client-react";

const STATUS_BADGE: Record<TopupRequestStatus, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

export default function TopupPage() {
  const { t, lang } = useTranslation();
  const dateLocale = lang === "id" ? idLocale : enUS;

  const { data: balanceData } = useGetCreditBalance({ query: { queryKey: getGetCreditBalanceQueryKey() } });
  const { data: history } = useGetMyTopupRequests(
    { page: 1, limit: 20 },
    { query: { queryKey: getGetMyTopupRequestsQueryKey({ page: 1, limit: 20 }) } },
  );

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
