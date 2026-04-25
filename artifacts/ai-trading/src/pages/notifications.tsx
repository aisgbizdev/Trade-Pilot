import { Bell, BellOff, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import {
  useGetNotifications,
  getGetNotificationsQueryKey,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  type NotificationsList,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const TYPE_STYLE: Record<string, string> = {
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function NotificationsPage() {
  const { t, lang } = useTranslation();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const TYPE_LABEL: Record<string, string> = {
    info: t.notifications.type_info,
    warning: t.notifications.type_warning,
    error: t.notifications.type_error,
  };

  const { data, isLoading } = useGetNotifications(
    {},
    { query: { queryKey: getGetNotificationsQueryKey({}) } }
  );

  const notifications = (data as NotificationsList | undefined)?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const handleMarkRead = async (id: number) => {
    await markRead.mutateAsync({ params: { id } });
    queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({}) });
    queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({ unreadOnly: true }) });
  };

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync();
    queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({}) });
    queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({ unreadOnly: true }) });
    toast({ title: t.notifications.all_read_toast });
  };

  return (
    <Layout>
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-foreground">{t.notifications.title}</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} {t.notifications.unread_count}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
              className="gap-1.5 text-xs"
              data-testid="button-mark-all-read"
            >
              <CheckCheck className="w-4 h-4" />
              {t.notifications.mark_all_read}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BellOff className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm font-medium text-foreground">{t.notifications.empty_title}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.notifications.empty_subtitle}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={cn(
                  "p-3 cursor-pointer transition-colors",
                  !n.readAt && "border-primary/30 bg-primary/5"
                )}
                onClick={() => !n.readAt && handleMarkRead(n.id)}
                data-testid={`card-notification-${n.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("text-[10px] border-0 px-1.5 py-0", TYPE_STYLE[n.type])}>
                        {TYPE_LABEL[n.type]}
                      </Badge>
                      {!n.readAt && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: dateLocale })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
