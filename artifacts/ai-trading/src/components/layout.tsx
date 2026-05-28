import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, TrendingUp, Clock, BarChart3, User, Bell, Moon, Sun, ChevronLeft, CheckCheck, ExternalLink, BookOpen, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "./auth-provider";
import { useTheme } from "./theme-provider";
import {
  useGetNotifications,
  getGetNotificationsQueryKey,
  useMarkAllNotificationsRead,
  useUpdateProfile,
  type NotificationsList,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useTrackOutbound } from "@/hooks/use-track-outbound";
import { SHOW_SPONSOR } from "@/lib/sponsor-flag";
import { SHOW_NEWSMAKER } from "@/lib/newsmaker-flag";
import { LanguageToggle } from "./language-toggle";
import { ContinuousTicker } from "./continuous-ticker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";

const MAIN_NAV_PATHS = ["/dashboard", "/analyze", "/journal", "/mirror", "/history", "/analytics", "/profile"];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, lang } = useTranslation();
  const trackOutbound = useTrackOutbound();
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const [bellOpen, setBellOpen] = useState(false);

  const { data: notifData } = useGetNotifications(
    { unreadOnly: true },
    {
      query: {
        enabled: !!user,
        queryKey: getGetNotificationsQueryKey({ unreadOnly: true }),
        refetchInterval: 60_000,
      },
    }
  );

  const markAll = useMarkAllNotificationsRead();

  useEffect(() => {
    if (!user) return;
    const base = (import.meta.env["BASE_URL"] || "/").replace(/\/$/, "");
    const url = `${base}/api/notifications/stream`;
    const es = new EventSource(url, { withCredentials: true });
    const onNotification = () => {
      queryClient.invalidateQueries({
        queryKey: getGetNotificationsQueryKey({ unreadOnly: true }),
      });
      queryClient.invalidateQueries({
        queryKey: getGetNotificationsQueryKey(),
      });
    };
    es.addEventListener("notification", onNotification);
    es.onerror = () => {
      // Browser auto-reconnects; nothing to do.
    };
    return () => {
      es.removeEventListener("notification", onNotification);
      es.close();
    };
  }, [user, queryClient]);

  const notifications = (notifData as NotificationsList | undefined)?.notifications ?? [];
  const unreadCount = notifications.length;
  const isMainNav = MAIN_NAV_PATHS.includes(location);

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/analyze", icon: TrendingUp, label: t.nav.analyze },
    { href: "/journal", icon: BookOpen, label: t.journal.nav_label },
    { href: "/mirror", icon: Sparkles, label: t.mirror.nav_label },
    { href: "/history", icon: Clock, label: t.nav.history },
    { href: "/analytics", icon: BarChart3, label: t.nav.analytics },
  ];

  const profileActive = location === "/profile" || location.startsWith("/profile/");
  const profileInitial = user?.email?.trim()?.[0]?.toUpperCase() ?? "";

  const handleMarkAllRead = () => {
    markAll.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({ unreadOnly: true }) });
      },
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-lg mx-auto relative md:shadow-2xl md:shadow-black/40 md:border-x md:border-border/50">
      <header className="sticky top-0 z-40 pl-[calc(env(safe-area-inset-left,0px)+1rem)] pr-[calc(env(safe-area-inset-right,0px)+1rem)] pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 flex items-center justify-between backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="flex items-center gap-2">
          {!isMainNav && (
            <button
              onClick={() => window.history.back()}
              className="p-1.5 rounded-xl hover:bg-muted transition-colors -ml-1 mr-0.5"
              aria-label={t.common.back}
              data-testid="button-back-header"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 -m-1 p-1 rounded-lg hover:bg-muted/40 transition-colors"
            data-testid="link-brand-home"
            aria-label={t.nav.dashboard}
          >
            <BrandLogo className="w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-bold text-[13px] leading-none tracking-tight">
                <span className="gradient-text">Trade</span>
                <span className="text-foreground"> Pilot</span>
              </span>
              <span className="text-[9px] text-muted-foreground leading-none mt-0.5 tracking-wide uppercase">
                {user?.selectedMode === "pro" ? t.common.pro : t.common.beginner} Mode
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <button
            data-testid="button-theme-toggle"
            aria-label={theme === "dark" ? t.profile.light_mode : t.profile.dark_mode}
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              if (user) {
                updateProfile.mutate({ data: { themePreference: next } });
              }
            }}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            {theme === "dark"
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-muted-foreground" />
            }
          </button>
          {user && (
            <Link
              href="/profile"
              data-testid="link-header-profile"
              aria-label={t.nav.profile}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-[12px] font-semibold transition-colors",
                profileActive
                  ? "bg-primary/15 text-primary ring-2 ring-primary/40"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {profileInitial ? (
                <span>{profileInitial}</span>
              ) : (
                <User className="w-4 h-4" />
              )}
            </Link>
          )}
          {user && (
            <Popover open={bellOpen} onOpenChange={setBellOpen}>
              <PopoverTrigger asChild>
                <button
                  data-testid="button-notifications"
                  className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg shadow-amber-500/40">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 p-0 rounded-2xl overflow-hidden border border-border/60 shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Notifikasi</p>
                    {unreadCount > 0 && (
                      <p className="text-[11px] text-muted-foreground">{unreadCount} belum dibaca</p>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-primary hover:text-primary/80"
                      onClick={handleMarkAllRead}
                      data-testid="button-mark-all-read"
                      disabled={markAll.isPending}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Tandai semua
                    </Button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Tidak ada notifikasi baru</p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-72">
                    <div className="divide-y divide-border/40">
                      {notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="px-4 py-3 hover:bg-muted/40 transition-colors">
                          <p className="text-[13px] font-medium text-foreground leading-snug">{n.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: dateLocale })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                <div className="border-t border-border/50 px-4 py-2.5">
                  <Link href="/notifications" onClick={() => setBellOpen(false)}>
                    <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium w-full justify-center" data-testid="link-view-all-notifications">
                      <ExternalLink className="w-3 h-3" />
                      Lihat semua notifikasi
                    </button>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>

      <ContinuousTicker />

      <main className="flex-1 pb-[calc(env(safe-area-inset-bottom,0px)+72px)] overflow-y-auto">
        {children}

        <footer className="border-t border-border/50 px-4 py-4 mt-6 text-center space-y-2">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {t.landing.footer}
          </p>
          <div className="flex justify-center items-center gap-4 text-[11px]">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground"
              data-testid="link-footer-privacy"
            >
              {t.legal.privacy_link}
            </Link>
            <span className="text-muted-foreground/50">·</span>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground"
              data-testid="link-footer-terms"
            >
              {t.legal.terms_link}
            </Link>
          </div>
          {SHOW_SPONSOR && (
            <p className="text-[10px] text-muted-foreground/70">
              {t.brand.sponsored_by}{" "}
              <a
                href="https://www.sg-berjangka.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-amber-500 dark:text-amber-300 hover:text-amber-400 underline-offset-2 hover:underline"
                data-testid="link-layout-footer-sponsor"
                onClick={() => trackOutbound("layout-footer", "sg-berjangka")}
              >
                SOLID PRIME
              </a>
            </p>
          )}
          {SHOW_NEWSMAKER && (
            <p className="text-[9px] text-muted-foreground/50">
              {t.brand.news_data_via}
            </p>
          )}
        </footer>
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-40">
        <div className="mx-3 mb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] rounded-2xl bg-background/90 backdrop-blur-xl border border-border/60 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-around py-2 px-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = location === href || location.startsWith(href + "/");
              return (
                <Link key={href} href={href}>
                  <button
                    data-testid={`nav-${href.replace("/", "")}`}
                    className={cn(
                      "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                      active ? "bg-primary/10 dark:bg-primary/20" : ""
                    )}>
                      <Icon className={cn("w-4.5 h-4.5", active && "stroke-[2.5]")} style={{ width: '18px', height: '18px' }} />
                    </div>
                    <span className={cn("text-[9px] font-medium", active && "font-semibold")}>{label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
