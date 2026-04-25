import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, TrendingUp, Clock, BarChart3, User, Bell, Moon, Sun, ChevronLeft, CheckCheck, ExternalLink } from "lucide-react";
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
import { LanguageToggle } from "./language-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";

const MAIN_NAV_PATHS = ["/dashboard", "/analyze", "/history", "/analytics", "/profile"];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, lang } = useTranslation();
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

  const notifications = (notifData as NotificationsList | undefined)?.notifications ?? [];
  const unreadCount = notifications.length;
  const isMainNav = MAIN_NAV_PATHS.includes(location);

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/analyze", icon: TrendingUp, label: t.nav.analyze },
    { href: "/history", icon: Clock, label: t.nav.history },
    { href: "/analytics", icon: BarChart3, label: t.nav.analytics },
    { href: "/profile", icon: User, label: t.nav.profile },
  ];

  const handleMarkAllRead = () => {
    markAll.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey({ unreadOnly: true }) });
      },
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-lg mx-auto relative">
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between backdrop-blur-xl bg-background/80 border-b border-border/50">
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/25">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[13px] leading-none tracking-tight">
              <span className="gradient-text">AI</span>
              <span className="text-foreground"> Trading</span>
            </span>
            <span className="text-[9px] text-muted-foreground leading-none mt-0.5 tracking-wide uppercase">
              {user?.selectedMode === "pro" ? t.common.pro : t.common.beginner} Mode
            </span>
            <a
              href="https://newsmaker.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 mt-0.5 hover:opacity-75 transition-opacity"
            >
              <span className="text-[8px] text-muted-foreground/60 leading-none">supported by</span>
              <img src="/newsmaker-logo.png" alt="Newsmaker.id" className="h-2.5 w-auto object-contain bg-white rounded-sm px-0.5" />
            </a>
          </div>
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
            <Popover open={bellOpen} onOpenChange={setBellOpen}>
              <PopoverTrigger asChild>
                <button
                  data-testid="button-notifications"
                  className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg shadow-blue-500/40">
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
                      className="h-7 text-xs gap-1 text-blue-500 hover:text-blue-600"
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
                    <button className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-medium w-full justify-center" data-testid="link-view-all-notifications">
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

      <main className="flex-1 pb-[72px] overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-40">
        <div className="mx-3 mb-2 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/60 shadow-2xl shadow-black/20">
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
