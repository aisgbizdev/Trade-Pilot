import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing, CheckCheck, Download, Loader2, Send, Sunrise } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useGetDailySummary,
  useUpdateDailySummarySettings,
  getGetDailySummaryQueryKey,
  type NotificationsList,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { usePush } from "@/hooks/use-push";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { useStandalone } from "@/hooks/use-standalone";

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
  const { state: pushState, subscribe, unsubscribe, errorMessage: pushErrorMessage } = usePush();
  const { data: pushPrefs } = useGetPushPrefs({
    query: { queryKey: getGetPushPrefsQueryKey(), staleTime: 60_000 },
  });
  const updatePushPrefs = useUpdatePushPrefs();
  const sendPushTest = useSendPushTest();
  const [testSending, setTestSending] = useState(false);
  const { canInstall, prompt: triggerInstall } = useInstallPrompt();
  const { standalone } = useStandalone();
  const showInstallCta = canInstall && !standalone;

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

  const handlePrefToggle = async (
    key:
      | "pushExpiry"
      | "pushBroadcast"
      | "pushDailySummary"
      | "pushMarketNews"
      | "pushCalendarEvents"
      | "pushPriceAnomaly"
      | "pushWeeklyRecap"
      | "pushSignalFlip"
      | "pushDormancyNudge"
      | "pushOnboarding"
      | "guardrailRevenge"
      | "guardrailOvertrading"
      | "guardrailHighRisk"
      | "coolingOffEnabled",
    value: boolean,
  ) => {
    try {
      await updatePushPrefs.mutateAsync({ data: { [key]: value } });
      queryClient.invalidateQueries({ queryKey: getGetPushPrefsQueryKey() });
    } catch {
      toast({ title: t.notifications.push_prefs_error, variant: "destructive" });
    }
  };

  // Tier 3 (task #142 A): market-session reminders. The pref is an
  // array of opted-in sessions — toggling a checkbox sends the new
  // membership list, not a boolean.
  const handleSessionToggle = async (
    session: "tokyo" | "london" | "newyork",
    checked: boolean,
  ) => {
    const current = pushPrefs?.marketOpenSessions ?? [];
    const next = checked
      ? Array.from(new Set([...current, session]))
      : current.filter((s) => s !== session);
    try {
      await updatePushPrefs.mutateAsync({ data: { marketOpenSessions: next } });
      queryClient.invalidateQueries({ queryKey: getGetPushPrefsQueryKey() });
    } catch {
      toast({ title: t.notifications.push_prefs_error, variant: "destructive" });
    }
  };

  const handleDismissDisengageBanner = async () => {
    try {
      await updatePushPrefs.mutateAsync({ data: { dismissDisengageNotice: true } });
      queryClient.invalidateQueries({ queryKey: getGetPushPrefsQueryKey() });
    } catch {
      toast({ title: t.notifications.push_prefs_error, variant: "destructive" });
    }
  };

  // Daily summary settings — toggle + time + timezone. Kept local while
  // the user is editing to avoid stomping their typing on each refetch;
  // synced back from the server response on save / first load.
  const { data: dailySummary } = useGetDailySummary({
    query: { queryKey: getGetDailySummaryQueryKey(), staleTime: 60_000 },
  });
  const updateDailySummary = useUpdateDailySummarySettings();
  const [dsTime, setDsTime] = useState("07:00");
  const [dsTimezone, setDsTimezone] = useState("Asia/Jakarta");
  useEffect(() => {
    if (dailySummary?.settings) {
      setDsTime(dailySummary.settings.time);
      setDsTimezone(dailySummary.settings.timezone);
    }
  }, [dailySummary?.settings]);

  const persistDailySummary = async (patch: {
    enabled?: boolean;
    time?: string;
    timezone?: string;
  }) => {
    try {
      await updateDailySummary.mutateAsync({ data: patch });
      queryClient.invalidateQueries({ queryKey: getGetDailySummaryQueryKey() });
    } catch {
      toast({ title: t.daily_summary.save_error, variant: "destructive" });
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

  // Re-render on any in-app navigation (wouter pushState) so we can
  // re-read window.location.hash; also listen for back/forward and
  // explicit hash changes from outside wouter.
  const [location] = useLocation();
  const [hashTick, setHashTick] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const bump = () => setHashTick((n) => n + 1);
    window.addEventListener("hashchange", bump);
    window.addEventListener("popstate", bump);
    return () => {
      window.removeEventListener("hashchange", bump);
      window.removeEventListener("popstate", bump);
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#settings") return;
    let scrolled = false;
    const tryScroll = () => {
      if (scrolled) return true;
      const el = document.getElementById("notification-settings");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        scrolled = true;
        return true;
      }
      return false;
    };
    if (tryScroll()) return;
    const timer = window.setTimeout(tryScroll, 150);
    return () => window.clearTimeout(timer);
  }, [location, hashTick, pushPrefs]);

  return (
    <Layout>
      <div className="px-4 py-5 md:max-w-3xl md:mx-auto lg:max-w-none">
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

        <Card className="p-4 mb-5" id="notification-settings" data-testid="card-notification-settings">
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
                  <div className="space-y-1">
                    <p className="text-xs text-destructive">{t.notifications.push_error}</p>
                    {pushErrorMessage && (
                      <p
                        className="text-[10px] text-destructive/70 break-words font-mono leading-snug"
                        data-testid="text-push-error-detail"
                      >
                        {pushErrorMessage}
                      </p>
                    )}
                  </div>
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

              {(isPushEnabled || showInstallCta) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {isPushEnabled && (
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
                  )}
                  {showInstallCta && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void triggerInstall();
                      }}
                      className="gap-1.5 h-8"
                      data-testid="button-install-app-notifications"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t.push.install_btn}
                    </Button>
                  )}
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
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.daily_summary.push_alert_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.daily_summary.push_alert_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushDailySummary}
                  onCheckedChange={(v) => handlePrefToggle("pushDailySummary", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-daily-summary"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_market_news_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_market_news_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushMarketNews}
                  onCheckedChange={(v) => handlePrefToggle("pushMarketNews", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-market-news"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_calendar_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_calendar_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushCalendarEvents}
                  onCheckedChange={(v) => handlePrefToggle("pushCalendarEvents", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-calendar"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_price_anomaly_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_price_anomaly_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushPriceAnomaly}
                  onCheckedChange={(v) => handlePrefToggle("pushPriceAnomaly", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-price-anomaly"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_weekly_recap_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_weekly_recap_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushWeeklyRecap}
                  onCheckedChange={(v) => handlePrefToggle("pushWeeklyRecap", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-weekly-recap"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_signal_flip_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_signal_flip_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushSignalFlip}
                  onCheckedChange={(v) => handlePrefToggle("pushSignalFlip", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-signal-flip"
                />
              </div>
            </div>
          </Card>
        )}

        {pushPrefs && (
          <Card className="p-4 mb-5" data-testid="card-guardrail-prefs">
            <div className="mb-3">
              <p className="text-sm font-semibold text-foreground">
                {t.notifications.guardrail_section_title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {t.notifications.guardrail_section_desc}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.guardrail_revenge_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.guardrail_revenge_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.guardrailRevenge}
                  onCheckedChange={(v) => handlePrefToggle("guardrailRevenge", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-guardrail-revenge"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.guardrail_overtrading_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.guardrail_overtrading_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.guardrailOvertrading}
                  onCheckedChange={(v) => handlePrefToggle("guardrailOvertrading", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-guardrail-overtrading"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.guardrail_high_risk_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.guardrail_high_risk_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.guardrailHighRisk}
                  onCheckedChange={(v) => handlePrefToggle("guardrailHighRisk", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-guardrail-high-risk"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.cooling_off_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.cooling_off_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.coolingOffEnabled}
                  onCheckedChange={(v) => handlePrefToggle("coolingOffEnabled", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-cooling-off"
                />
              </div>
            </div>
          </Card>
        )}

        {pushPrefs?.disengageNoticeCategory && (
          <Card
            className="p-4 mb-5 border-amber-300 bg-amber-50 dark:border-amber-700/50 dark:bg-amber-900/20"
            data-testid="card-disengage-banner"
          >
            <p className="text-sm font-semibold text-foreground">
              {t.notifications.push_disengage_banner_title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {t.notifications.push_disengage_banner_body}
            </p>
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismissDisengageBanner}
                disabled={updatePushPrefs.isPending}
                data-testid="button-dismiss-disengage-banner"
              >
                {t.notifications.push_disengage_banner_dismiss}
              </Button>
            </div>
          </Card>
        )}

        {pushPrefs && (
          <Card className="p-4 mb-5">
            <div className="mb-3">
              <p className="text-sm font-semibold text-foreground">
                {t.notifications.push_session_section_title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {t.notifications.push_session_section_desc}
              </p>
            </div>
            <div className="space-y-3">
              {(["tokyo", "london", "newyork"] as const).map((session) => {
                const label =
                  session === "tokyo"
                    ? t.notifications.push_session_tokyo
                    : session === "london"
                      ? t.notifications.push_session_london
                      : t.notifications.push_session_newyork;
                const checked = (pushPrefs.marketOpenSessions ?? []).includes(session);
                return (
                  <div key={session} className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <Switch
                      checked={checked}
                      onCheckedChange={(v) => handleSessionToggle(session, v)}
                      disabled={updatePushPrefs.isPending}
                      data-testid={`switch-session-${session}`}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {pushPrefs && (
          <Card className="p-4 mb-5">
            <div className="mb-3">
              <p className="text-sm font-semibold text-foreground">
                {t.notifications.push_engage_section_title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {t.notifications.push_engage_section_desc}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_dormancy_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_dormancy_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushDormancyNudge}
                  onCheckedChange={(v) => handlePrefToggle("pushDormancyNudge", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-dormancy"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t.notifications.push_pref_onboarding_title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.notifications.push_pref_onboarding_desc}
                  </p>
                </div>
                <Switch
                  checked={pushPrefs.pushOnboarding}
                  onCheckedChange={(v) => handlePrefToggle("pushOnboarding", v)}
                  disabled={updatePushPrefs.isPending}
                  data-testid="switch-pref-onboarding"
                />
              </div>
            </div>
          </Card>
        )}

        {dailySummary && (
          <Card className="p-4 mb-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                <Sunrise className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {t.daily_summary.section_title}
                  </p>
                  <Switch
                    checked={dailySummary.settings.enabled}
                    onCheckedChange={(v) => persistDailySummary({ enabled: v })}
                    disabled={updateDailySummary.isPending}
                    data-testid="switch-daily-summary-enabled"
                    aria-label={t.daily_summary.enable_label}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {t.daily_summary.section_desc}
                </p>
              </div>
            </div>
            {dailySummary.settings.enabled && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <Label htmlFor="ds-time" className="text-xs text-muted-foreground">
                    {t.daily_summary.time_label}
                  </Label>
                  <Input
                    id="ds-time"
                    type="time"
                    value={dsTime}
                    onChange={(e) => setDsTime(e.target.value)}
                    onBlur={() => {
                      if (dsTime && dsTime !== dailySummary.settings.time) {
                        void persistDailySummary({ time: dsTime });
                      }
                    }}
                    disabled={updateDailySummary.isPending}
                    className="mt-1 h-9 text-sm"
                    data-testid="input-daily-summary-time"
                  />
                </div>
                <div>
                  <Label htmlFor="ds-tz" className="text-xs text-muted-foreground">
                    {t.daily_summary.timezone_label}
                  </Label>
                  <Input
                    id="ds-tz"
                    type="text"
                    value={dsTimezone}
                    onChange={(e) => setDsTimezone(e.target.value)}
                    onBlur={() => {
                      if (dsTimezone && dsTimezone !== dailySummary.settings.timezone) {
                        void persistDailySummary({ timezone: dsTimezone });
                      }
                    }}
                    disabled={updateDailySummary.isPending}
                    className="mt-1 h-9 text-sm font-mono"
                    placeholder="Asia/Jakarta"
                    data-testid="input-daily-summary-timezone"
                  />
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-[10px] text-muted-foreground">
                {dailySummary.settings.lastSentDate
                  ? `${t.daily_summary.last_sent}: ${dailySummary.settings.lastSentDate}`
                  : t.daily_summary.no_digest_yet}
              </p>
              <Link href="/daily-summary">
                <a
                  className="text-xs text-primary hover:underline"
                  data-testid="link-open-daily-summary"
                >
                  {t.daily_summary.page_title} →
                </a>
              </Link>
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
