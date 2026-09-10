import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { TrendingUp, Clock, User, Bell, Moon, Sun, ChevronLeft, ExternalLink, BookOpen, Shield } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "./auth-provider";
import { useTheme } from "./theme-provider";
import { avatarSrc } from "@/lib/avatar";
import {
  useGetNotifications,
  getGetNotificationsQueryKey,
  useUpdateProfile,
  useGetAnalysesSummary,
  getGetAnalysesSummaryQueryKey,
  type NotificationsList,
  type AnalysesSummary,
} from "@workspace/api-client-react";
import { useEmbedMode } from "@/lib/embed-mode";
import { useLastAnalysisNavPath, useBackToLastAnalysisPath } from "@/hooks/use-last-analysis";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useTrackOutbound } from "@/hooks/use-track-outbound";
import { useTrackEvent } from "@/hooks/use-track-event";
import { SHOW_SPONSOR } from "@/lib/sponsor-flag";
import { SHOW_NEWSMAKER } from "@/lib/newsmaker-flag";
import { LanguageToggle } from "./language-toggle";
import { ContinuousTicker } from "./continuous-ticker";

const MAIN_NAV_PATHS = ["/analyze", "/journal", "/mirror", "/history", "/guide", "/profile", "/admin/dashboard"];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const isEmbed = useEmbedMode();
  const trackOutbound = useTrackOutbound();
  const trackEvent = useTrackEvent();
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();

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

  const { data: analysesSummaryData, isLoading: analysesSummaryLoading } = useGetAnalysesSummary({
    query: {
      enabled: !!user && !isEmbed,
      queryKey: getGetAnalysesSummaryQueryKey(),
    },
  });

  const totalAnalyses = analysesSummaryLoading
    ? Infinity
    : ((analysesSummaryData as AnalysesSummary | undefined)?.totalAnalyses ?? Infinity);

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

  // Single integration point for page-view analytics: every page that
  // renders through <Layout> gets tracked automatically on navigation,
  // without each page file needing its own tracking call. `landing.tsx`
  // and `login.tsx` don't use <Layout> and are tracked directly instead.
  useEffect(() => {
    trackEvent("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const notifications = (notifData as NotificationsList | undefined)?.notifications ?? [];
  const unreadCount = notifications.length;
  const isMainNav = MAIN_NAV_PATHS.includes(location);

  // "Analisis" tab + the header back button both point at the user's last
  // *already generated* analysis (zero tokens to reopen) rather than a
  // fresh New-Analysis form. Only a first-timer with no analyses lands on
  // the blank form. See use-last-analysis.ts.
  const analyzeNavPath = useLastAnalysisNavPath();
  const backPath = useBackToLastAnalysisPath();
  // Exception: from a standalone analysis detail page (`/analyses/:id`,
  // reached by tapping a row in Riwayat) "back" returns to Riwayat — the
  // list the user came from — instead of the last analysis.
  const headerBackPath = /^\/analyses\/\d+/.test(location) ? "/history" : backPath;

  // `id` is the stable key/testid/unlock-tracking handle; `href` can be
  // dynamic (the Analisis tab points at the last analysis, which changes).
  // `activePrefixes` overrides the default path-prefix match for the
  // highlighted state.
  type NavItem = {
    id: string;
    href: string;
    icon: typeof TrendingUp;
    label: string;
    minCount: number;
    activePrefixes?: string[];
  };

  // Embed mode: simplified 3-tab layout for broker iframe context.
  // Full mode: original tabs unchanged.
  const EMBED_NAV: NavItem[] = [
    { id: "analyze", href: "/analyze", icon: TrendingUp, label: t.nav.analyze, minCount: 0 },
    { id: "history", href: "/history", icon: Clock, label: t.nav.history, minCount: 0 },
    { id: "profile", href: "/profile", icon: User, label: t.nav.profile, minCount: 0 },
  ];

  const FULL_NAV: NavItem[] = [
    { id: "analyze", href: analyzeNavPath, icon: TrendingUp, label: t.nav.analyze, minCount: 0, activePrefixes: ["/analyze", "/analyses"] },
    { id: "history", href: "/history", icon: Clock, label: t.nav.history, minCount: 0 },
    { id: "guide", href: "/guide", icon: BookOpen, label: t.nav.guide, minCount: 0 },
    // Admin dashboard — super_admin only (the /admin/dashboard route
    // itself is also role-gated in App.tsx). Sits right after Panduan.
    ...(user?.role === "super_admin"
      ? [{ id: "admin", href: "/admin/dashboard", icon: Shield, label: t.nav.admin, minCount: 0 } as NavItem]
      : []),
  ];

  const navItems = isEmbed
    ? EMBED_NAV
    : FULL_NAV.filter((item) => totalAnalyses >= item.minCount);

  const isNavItemActive = (item: NavItem) => {
    const prefixes = item.activePrefixes ?? [item.href];
    return prefixes.some((p) => location === p || location.startsWith(p + "/"));
  };

  const prevNavIdsRef = useRef<Set<string> | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(navItems.map((i) => i.id));
    if (prevNavIdsRef.current === null) {
      prevNavIdsRef.current = currentIds;
      return;
    }
    const prevIds = prevNavIdsRef.current;
    prevNavIdsRef.current = currentIds;

    const justUnlocked: string[] = [];
    for (const id of currentIds) {
      if (!prevIds.has(id)) {
        const key = `nav_celebrated_${id}`;
        if (!sessionStorage.getItem(key)) {
          justUnlocked.push(id);
          sessionStorage.setItem(key, "1");
        }
      }
    }

    if (justUnlocked.length > 0) {
      setNewlyUnlocked((prev) => {
        const next = new Set(prev);
        justUnlocked.forEach((h) => next.add(h));
        return next;
      });
    }
  }, [navItems]);

  const clearUnlocked = (id: string) => {
    setNewlyUnlocked((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const profileActive = location === "/profile" || location.startsWith("/profile/");
  const profileInitial = user?.email?.trim()?.[0]?.toUpperCase() ?? "";
  const profileAvatar = avatarSrc(user?.avatarUrl);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto relative">
      <header className="sticky top-0 z-40 pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] sm:pl-[calc(env(safe-area-inset-left,0px)+1rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+1rem)] pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-2.5 sm:pb-3 flex items-center justify-between backdrop-blur-xl bg-background/80 border-b border-border/50 gap-2">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          {!isMainNav && (
            <button
              onClick={() => setLocation(headerBackPath)}
              className="p-1 sm:p-1.5 rounded-xl hover:bg-muted transition-colors -ml-1 sm:-ml-1 mr-0 shrink-0"
              aria-label={t.common.back}
              data-testid="button-back-header"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <Link
            href={analyzeNavPath}
            className="flex items-center gap-1.5 sm:gap-2 -m-1 p-1 rounded-lg hover:bg-muted/40 transition-colors shrink-0 min-w-0"
            data-testid="link-brand-home"
            aria-label={t.nav.analyze}
          >
            <BrandLogo className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
            <div className="flex flex-col shrink-0 min-w-0">
              <span className="font-bold text-[12px] sm:text-[13px] leading-none tracking-tight truncate">
                <span className="gradient-text">TradePilot</span>
                <span className="text-foreground">.id</span>
              </span>
            </div>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto" aria-label="Primary">
          {navItems.map((item) => {
            const { id, href, icon: Icon, label } = item;
            const active = isNavItemActive(item);
            const isNew = newlyUnlocked.has(id);
            return (
              <Link
                key={id}
                href={href}
                data-testid={`nav-desktop-${id}`}
                aria-current={active ? "page" : undefined}
                onAnimationEnd={isNew ? () => clearUnlocked(id) : undefined}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  isNew && "nav-unlock-pulse"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {isEmbed && (
            <a
              href={window.location.origin + (import.meta.env.BASE_URL || "/")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground hover:text-amber-400 transition-colors px-2 py-1 rounded-lg hover:bg-muted mr-1 shrink-0"
              data-testid="link-embed-full-version"
              aria-label={t.common.embed_full_version}
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{t.common.embed_full_version}</span>
            </a>
          )}
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
            className="p-1.5 sm:p-2 rounded-xl hover:bg-muted transition-colors shrink-0"
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
                "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 ml-0.5 rounded-full text-[11px] sm:text-[12px] font-semibold transition-colors overflow-hidden shrink-0",
                profileActive
                  ? "bg-primary/15 text-primary ring-2 ring-primary/40"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {profileAvatar ? (
                <img
                  src={profileAvatar}
                  alt={user?.displayName ?? ""}
                  className="w-full h-full object-cover"
                />
              ) : profileInitial ? (
                <span>{profileInitial}</span>
              ) : (
                <User className="w-4 h-4" />
              )}
            </Link>
          )}
          {user && (
            <Link
              href="/notifications"
              data-testid="button-notifications"
              className="relative p-1.5 sm:p-2 rounded-xl hover:bg-muted transition-colors shrink-0"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[8px] sm:text-[9px] rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center font-bold shadow-lg shadow-amber-500/40">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </header>

      <ContinuousTicker />

      <main
        className="flex-1 mobile-main-scroll lg:pb-8 overflow-y-auto"
        data-testid="app-scroll-container"
      >
        {children}

        <footer className="border-t border-border/50 px-3 sm:px-4 py-4 mt-6 text-center space-y-2">
          <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 leading-relaxed max-w-[280px] sm:max-w-none mx-auto">
            {t.landing.footer}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 sm:gap-x-4 gap-y-1.5 text-[10px] sm:text-[11px]">
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
            <span className="text-muted-foreground/50">·</span>
            <Link
              href="/support"
              className="text-muted-foreground hover:text-foreground"
              data-testid="link-footer-support"
            >
              {t.legal.support_link}
            </Link>
            <span className="text-muted-foreground/50">·</span>
            <Link
              href="/delete-account"
              className="text-muted-foreground hover:text-foreground"
              data-testid="link-footer-delete-account"
            >
              {t.legal.delete_account_link}
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

      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg md:max-w-4xl z-40 lg:hidden"
        data-testid="mobile-bottom-nav"
        aria-label="Mobile navigation"
      >
        <div className="mx-2 sm:mx-3 mb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] rounded-2xl bg-background/90 backdrop-blur-xl border border-border/60 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-around py-1.5 sm:py-2 px-0.5 sm:px-1">
            {navItems.map((item) => {
              const { id, href, icon: Icon, label } = item;
              const active = isNavItemActive(item);
              const isNew = newlyUnlocked.has(id);
              return (
                <Link
                  key={id}
                  href={href}
                  data-testid={`nav-${id}`}
                  aria-current={active ? "page" : undefined}
                  onAnimationEnd={isNew ? () => clearUnlocked(id) : undefined}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 sm:gap-1 px-0.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all duration-200 min-w-0",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                    isNew && "nav-unlock-pulse"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all",
                    active ? "bg-primary/10 dark:bg-primary/20" : ""
                  )}>
                    <Icon className={cn("w-4 sm:w-4.5 h-4 sm:h-4.5", active && "stroke-[2.5]")} />
                  </div>
                  <span className={cn("text-[8px] sm:text-[9px] font-medium tracking-tight truncate w-full text-center px-0.5", active && "font-semibold")}>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
