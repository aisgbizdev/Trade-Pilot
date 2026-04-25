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
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/25">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[13px] leading-none tracking-tight">
              <span className="gradient-text">AI</span>
              <span className="text-foreground"> Trading</span>
            </span>
            <span className="text-[9px] text-muted-foreground leading-none mt-0.5 tracking-wide uppercase">
              {user?.selectedMode === "pro" ? "Pro Mode" : "Pemula Mode"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            data-testid="button-theme-toggle"
            aria-label={theme === "dark" ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            {theme === "dark"
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-muted-foreground" />
            }
          </button>
          {user && (
            <Link href="/notifications">
              <button
                data-testid="button-notifications"
                className="relative p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg shadow-blue-500/40">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </Link>
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
                    data-testid={`nav-${label.toLowerCase()}`}
                    className={cn(
                      "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                      active
                        ? "bg-primary/10 dark:bg-primary/20"
                        : ""
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
