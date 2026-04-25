import { Link, useLocation } from "wouter";
import { LayoutDashboard, TrendingUp, Clock, BarChart3, User, Bell, Moon, Sun } from "lucide-react";
import { useAuth } from "./auth-provider";
import { useTheme } from "./theme-provider";
import { useGetNotifications, getGetNotificationsQueryKey } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analyze", icon: TrendingUp, label: "Analisis" },
  { href: "/history", icon: Clock, label: "Riwayat" },
  { href: "/analytics", icon: BarChart3, label: "Statistik" },
  { href: "/profile", icon: User, label: "Profil" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: notifData } = useGetNotifications(
    { unreadOnly: true },
    {
      query: {
        enabled: !!user,
        queryKey: getGetNotificationsQueryKey({ unreadOnly: true }),
      },
    }
  );

  const unreadCount = (notifData as any)?.notifications?.length ?? 0;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-lg mx-auto relative">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground tracking-tight">AI Trading</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            data-testid="button-theme-toggle"
            aria-label={theme === "dark" ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {theme === "dark"
              ? <Sun className="w-5 h-5 text-muted-foreground" />
              : <Moon className="w-5 h-5 text-muted-foreground" />
            }
          </button>
          {user && (
            <Link href="/notifications">
              <button
                data-testid="button-notifications"
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-40 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location === href || location.startsWith(href + "/");
            return (
              <Link key={href} href={href}>
                <button
                  data-testid={`nav-${label.toLowerCase()}`}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
