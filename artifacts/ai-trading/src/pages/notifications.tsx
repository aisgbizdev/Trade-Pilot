import { useState } from "react";
import { Bell, BellOff, BellRing, CheckCheck, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/layout";
import {
  useGetNotifications,
  getGetNotificationsQueryKey,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useGetPushPrefs,
  useUpdatePushPrefs,
  getGetPushPrefsQueryKey,
  useSendPushTest,
  type NotificationsList,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { usePush } from "@/hooks/use-push";

const TYPE_STYLE: Record<string, string> = {
  info: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function cleanMessage(msg: string): string {
  return msg.replace(/\s*\[expiry:\d+\]/g, "").trim();
}

export default function NotificationsPage() {
  const { t, lang } = useTranslation();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const { state: pushState, subscribe, unsubscribe } = usePush();
  const { data: pushPrefs } = useGetPushPrefs({
    query: { queryKey: getGetPushPrefsQueryKey(), staleTime: 60_000 },
  });
  const updatePushPrefs = useUpdatePushPrefs();
  const sendPushTest = useSendPushTest();
  const [testSending, setTestSending] = useState(false);

  const handleSendTest = async () => {
    setTestSending(true);
    try {
      await sendPushTest.mutateAsync();
      toast({ title: t.notifications.test_push_success });
    } catch (err) {
      const status = (err as { status?: number }).status;
      const message =
        status === 404
          ? t.notifications.test_push_no_devices
          : t.notifications.test_push_error;
      toast({ title: message, variant: "destructive" });
    } finally {
      setTestSending(false);
    }
  };

  const handlePrefToggle = async (key: "pushExpiry" | "pushBroadcast", value: boolean) => {
    try {
      await updatePushPrefs.mutateAsync({ data: { [key]: value } });
      queryClient.invalidateQueries({ queryKey: getGetPushPrefsQueryKey() });
    } catch {
      toast({ title: t.notifications.push_prefs_error, variant: "destructive" });
    }
  };

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
    await markRead.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({}) });
    queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({ unreadOnly: true }) });
  };

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync();
    queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({}) });
    queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({ unreadOnly: true }) });
    toast({ title: t.notifications.all_read_toast });
  };

  const handlePushToggle = async () => {
    if (pushState === "subscribed") {
      await unsubscribe();
    } else if (pushState === "unsubscribed" || pushState === "error") {
      await subscribe();
    }
  };

  const isPushEnabled = pushState === "subscribed";
  const isPushPending = pushState === "requesting";
  const isPushUnavailable = pushState === "unsupported";
  const isPushDenied = pushState === "denied";

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

        <Card className="p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
              {isPushEnabled ? (
                <BellRing className="w-4 h-4 text-primary" />
              ) : (
                <Bell className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.notifications.push_section_title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {t.notifications.push_section_desc}
                  </p>
                </div>
                {!isPushUnavailable && !isPushDenied && (
                  <Switch
                    checked={isPushEnabled}
                    onCheckedChange={handlePushToggle}
                    disabled={isPushPending}
                    data-testid="switch-push-notifications"
                    aria-label={
                      isPushEnabled
                        ? t.notifications.push_disable
                        : t.notifications.push_enable
                    }
                  />
                )}
              </div>

              <div className="mt-2">
                {isPushPending && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {t.notifications.push_requesting}
                  </p>
                )}
                {isPushDenied && (
                  <p className="text-xs text-destructive">{t.notifications.push_denied}</p>
                )}
                {isPushUnavailable && (
                  <p className="text-xs text-muted-foreground">{t.notifications.push_unsupported}</p>
                )}
                {pushState === "error" && (
                  <p className="text-xs text-destructive">{t.notifications.push_error}</p>
                )}
                {!isPushPending && !isPushDenied && !isPushUnavailable && pushState !== "error" && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 border-0",
                      isPushEnabled
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isPushEnabled
                      ? t.notifications.push_enabled_label
                      : t.notifications.push_disabled_label}
                  </Badge>
                )}
              </div>

              {isPushEnabled && (
                <div className="mt-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleSendTest}
                    disabled={testSending}
                    className="gap-1.5 h-8"
                    data-testid="button-send-push-test"
                  >
                    {testSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {t.notifications.test_push_sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        {t.notifications.test_push_btn}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {pushPrefs && (
          <Card className="p-4 mb-5">
            <div className="mb-3">
              <p className="text-sm font-semibold text-foreground">
                {t.notifications.push_prefs_title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {t.notifications.push_prefs_desc}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_expiry_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_expiry_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushExpiry}
                  onCheckedChange={(v) => handlePrefToggle("pushExpiry", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-expiry"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_broadcast_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_broadcast_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushBroadcast}
                  onCheckedChange={(v) => handlePrefToggle("pushBroadcast", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-broadcast"
                />
              </div>
            </div>
          </Card>
        )}

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
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{cleanMessage(n.message)}</p>
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
