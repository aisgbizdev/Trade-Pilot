import { Bell, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import {
  useListUserPriceAlerts,
  useDeleteUserPriceAlert,
  getListUserPriceAlertsQueryKey,
  type UserPriceAlertList,
  type UserPriceAlert,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function MyAlertsPage() {
  const { t, lang } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const { data, isLoading } = useListUserPriceAlerts({
    query: { queryKey: getListUserPriceAlertsQueryKey() },
  });
  const deleteAlert = useDeleteUserPriceAlert();

  const alerts = (data as UserPriceAlertList | undefined)?.alerts ?? [];

  const handleDelete = (alert: UserPriceAlert) => {
    if (!confirm(t.alerts.delete_confirm)) return;
    deleteAlert.mutate(
      { id: alert.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListUserPriceAlertsQueryKey(),
          });
          toast({ title: t.alerts.deleted_title });
        },
      },
    );
  };

  return (
    <Layout>
      <div className="px-4 py-5 md:max-w-3xl md:mx-auto lg:max-w-none">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            {t.alerts.page_title}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t.alerts.page_subtitle}
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t.common.loading}</p>
        ) : alerts.length === 0 ? (
          <Card className="p-6 text-center" data-testid="card-alerts-empty">
            <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">
              {t.alerts.list_empty_title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {t.alerts.list_empty_desc}
            </p>
          </Card>
        ) : (
          <ul className="space-y-2" data-testid="list-alerts">
            {alerts.map((a) => {
              const statusLabel =
                a.status === "triggered"
                  ? t.alerts.status_triggered
                  : a.status === "cancelled"
                  ? t.alerts.status_cancelled
                  : t.alerts.status_active;
              const statusClass =
                a.status === "triggered"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
                  : a.status === "cancelled"
                  ? "bg-muted text-muted-foreground border-border"
                  : "bg-primary/10 text-primary border-primary/30";
              const whenIso = a.triggeredAt ?? a.createdAt;
              const whenStr = formatDistanceToNow(new Date(whenIso), {
                addSuffix: true,
                locale: dateLocale,
              });
              const whenLabel = (
                a.triggeredAt ? t.alerts.triggered_at : t.alerts.created_at
              ).replace("{when}", whenStr);
              return (
                <li key={a.id} data-testid={`alert-row-${a.id}`}>
                  <Card className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-foreground">
                            {a.instrument}
                          </span>
                          {a.triggerDirection === "above" ? (
                            <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                          )}
                          <span className="text-sm text-foreground tabular-nums">
                            {a.triggerDirection === "above"
                              ? t.alerts.above_short
                              : t.alerts.below_short}{" "}
                            {a.targetPrice}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                              statusClass,
                            )}
                            data-testid={`alert-status-${a.id}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        {a.note && (
                          <p className="text-xs text-muted-foreground mt-1 leading-snug">
                            {a.note}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {whenLabel}
                          {a.triggeredPrice ? ` · @ ${a.triggeredPrice}` : ""}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(a)}
                        data-testid={`button-delete-alert-${a.id}`}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={t.alerts.delete_btn}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
}
