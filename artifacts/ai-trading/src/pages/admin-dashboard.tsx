import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard,
  Wallet,
  Users as UsersIcon,
  MessageSquare,
  Activity,
  Loader2,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useTranslation } from "@/lib/i18n";
import { useTrackEvent } from "@/hooks/use-track-event";
import {
  useGetAdminStats,
  getGetAdminStatsQueryKey,
  useGetTopupSummary,
  getGetTopupSummaryQueryKey,
  useGetAllUsers,
  getGetAllUsersQueryKey,
  useGetAdminFeedback,
  getGetAdminFeedbackQueryKey,
  type TopupUserSummary,
} from "@workspace/api-client-react";

type SectionKey = "overview" | "topups" | "users" | "feedback" | "progression";

type SortKey = "totalAmountRupiah" | "totalCreditsGranted" | "requestCount" | "lastApprovedAt";

function OverviewSection() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "total-users", label: t.admin.stats_total_users, value: stats?.totalUsers ?? 0 },
          { key: "users-today", label: t.admin.stats_users_today, value: stats?.totalUsersToday ?? 0 },
          { key: "analyses-today", label: t.admin.stats_analyses_today, value: stats?.totalAnalysesToday ?? 0 },
          { key: "this-week", label: t.admin.stats_this_week, value: stats?.totalAnalysesThisWeek ?? 0 },
          { key: "this-month", label: t.admin.stats_this_month, value: stats?.totalAnalysesThisMonth ?? 0 },
        ].map(({ key, label, value }) => (
          <Card key={key} className="p-3 text-center">
            <div className="text-2xl font-bold text-primary" data-testid={`stat-${key}`}>
              {value}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
          </Card>
        ))}
      </div>

      {stats?.instrumentBreakdown && stats.instrumentBreakdown.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">{t.admin.popular_instruments_title}</h3>
          <div className="space-y-2">
            {stats.instrumentBreakdown.slice(0, 5).map((item) => (
              <div key={item.instrument} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.instrument}</span>
                <Badge variant="secondary" className="text-xs">{item.count}x</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function TopupsSummarySection() {
  const { t, lang } = useTranslation();
  const { data, isLoading } = useGetTopupSummary({ query: { queryKey: getGetTopupSummaryQueryKey() } });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "totalAmountRupiah",
    dir: "desc",
  });

  const byUser = data?.byUser ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? byUser.filter(
          (r) => r.userEmail.toLowerCase().includes(q) || r.userDisplayName.toLowerCase().includes(q),
        )
      : byUser;
    const sorted = [...rows].sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [byUser, search, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  };

  const dateLocale = lang === "id" ? "id-ID" : "en-US";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{t.admin_dashboard.topups_summary_title}</h3>
        <p className="text-xs text-muted-foreground">{t.admin_dashboard.topups_summary_subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center" data-testid="stat-topup-total-revenue">
          <div className="text-lg font-bold text-primary">
            Rp{(data?.totalAmountRupiah ?? 0).toLocaleString("id-ID")}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{t.admin_dashboard.topups_total_revenue_label}</div>
        </Card>
        <Card className="p-3 text-center" data-testid="stat-topup-total-credits">
          <div className="text-lg font-bold text-primary">{data?.totalCreditsGranted ?? 0}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{t.admin_dashboard.topups_total_credits_label}</div>
        </Card>
        <Card className="p-3 text-center" data-testid="stat-topup-total-requests">
          <div className="text-lg font-bold text-primary">{data?.approvedRequestCount ?? 0}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{t.admin_dashboard.topups_total_requests_label}</div>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.admin_dashboard.topups_search_placeholder}
          className="pl-9 h-9 text-sm"
          data-testid="input-topup-summary-search"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">{t.admin_dashboard.topups_empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-2 pr-2 font-medium">{t.admin_dashboard.topups_table_col_user}</th>
                <SortableHeader label={t.admin_dashboard.topups_table_col_amount} active={sort.key === "totalAmountRupiah"} onClick={() => toggleSort("totalAmountRupiah")} />
                <SortableHeader label={t.admin_dashboard.topups_table_col_credits} active={sort.key === "totalCreditsGranted"} onClick={() => toggleSort("totalCreditsGranted")} />
                <SortableHeader label={t.admin_dashboard.topups_table_col_requests} active={sort.key === "requestCount"} onClick={() => toggleSort("requestCount")} />
                <SortableHeader label={t.admin_dashboard.topups_table_col_last_approved} active={sort.key === "lastApprovedAt"} onClick={() => toggleSort("lastApprovedAt")} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row: TopupUserSummary) => (
                <tr key={row.userId} className="border-b border-border/50" data-testid={`row-topup-summary-${row.userId}`}>
                  <td className="py-2 pr-2">
                    <div className="font-medium text-foreground">{row.userDisplayName}</div>
                    <div className="text-xs text-muted-foreground">{row.userEmail}</div>
                  </td>
                  <td className="py-2 pr-2">Rp{row.totalAmountRupiah.toLocaleString("id-ID")}</td>
                  <td className="py-2 pr-2">{row.totalCreditsGranted}</td>
                  <td className="py-2 pr-2">{row.requestCount}</td>
                  <td className="py-2 pr-2 text-xs text-muted-foreground">
                    {row.lastApprovedAt ? new Date(row.lastApprovedAt).toLocaleDateString(dateLocale) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SortableHeader({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <th className="py-2 pr-2 font-medium">
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-foreground">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${active ? "text-foreground" : "opacity-40"}`} />
      </button>
    </th>
  );
}

function LinkOutCard({
  icon: Icon,
  title,
  count,
  href,
  linkLabel,
  testId,
}: {
  icon: typeof UsersIcon;
  title: string;
  count?: string;
  href: string;
  linkLabel: string;
  testId: string;
}) {
  return (
    <Card className="p-4 space-y-2" data-testid={testId}>
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Icon className="w-4 h-4" /> {title}
      </h3>
      {count && <p className="text-xs text-muted-foreground">{count}</p>}
      <Link href={href} className="block text-center text-xs text-primary hover:underline pt-1">
        {linkLabel}
      </Link>
    </Card>
  );
}

function UsersLinkCard() {
  const { t } = useTranslation();
  const params = { page: 1, limit: 1 };
  const { data } = useGetAllUsers(params, { query: { queryKey: getGetAllUsersQueryKey(params) } });
  return (
    <LinkOutCard
      icon={UsersIcon}
      title={t.admin_dashboard.users_card_title}
      count={t.admin_dashboard.users_card_count.replace("{n}", String(data?.total ?? 0))}
      href="/admin/users"
      linkLabel={t.admin_dashboard.users_card_link}
      testId="card-users-link"
    />
  );
}

function FeedbackLinkCard() {
  const { t } = useTranslation();
  const params = { page: 1, limit: 1 };
  const { data } = useGetAdminFeedback(params, { query: { queryKey: getGetAdminFeedbackQueryKey(params) } });
  return (
    <LinkOutCard
      icon={MessageSquare}
      title={t.admin_dashboard.feedback_card_title}
      count={t.admin_dashboard.feedback_card_count.replace("{n}", String(data?.total ?? 0))}
      href="/admin/feedback"
      linkLabel={t.admin_dashboard.feedback_card_link}
      testId="card-feedback-link"
    />
  );
}

function ProgressionLinkCard() {
  const { t } = useTranslation();
  return (
    <LinkOutCard
      icon={Activity}
      title={t.admin_dashboard.progression_card_title}
      href="/admin/progression"
      linkLabel={t.admin_dashboard.progression_card_link}
      testId="card-progression-link"
    />
  );
}

function AdminDashboardContent() {
  const { t } = useTranslation();
  const trackEvent = useTrackEvent();
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");

  useEffect(() => {
    trackEvent("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const NAV_ITEMS: { key: SectionKey; icon: typeof LayoutDashboard; label: string }[] = [
    { key: "overview", icon: LayoutDashboard, label: t.admin_dashboard.nav_overview },
    { key: "topups", icon: Wallet, label: t.admin_dashboard.nav_topups },
    { key: "users", icon: UsersIcon, label: t.admin_dashboard.nav_users },
    { key: "feedback", icon: MessageSquare, label: t.admin_dashboard.nav_feedback },
    { key: "progression", icon: Activity, label: t.admin_dashboard.nav_progression },
  ];

  const activeLabel = NAV_ITEMS.find((item) => item.key === activeSection)?.label ?? "";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <BrandLogo className="w-6 h-6" />
            <span className="font-bold text-sm tracking-tight">
              <span className="gradient-text">Trade</span>
              <span className="text-foreground"> Pilot</span>
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t.admin_dashboard.nav_group_label}</SidebarGroupLabel>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeSection === item.key}
                    onClick={() => setActiveSection(item.key)}
                    data-testid={`nav-${item.key}`}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Link href="/profile" className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5" data-testid="link-back-to-app">
            {t.admin_dashboard.back_to_app}
          </Link>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center gap-2 border-b border-border p-4">
          <SidebarTrigger data-testid="button-sidebar-trigger" />
          <h1 className="text-lg font-bold text-foreground">{activeLabel}</h1>
        </header>
        <div className="p-4">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "topups" && <TopupsSummarySection />}
          {activeSection === "users" && <UsersLinkCard />}
          {activeSection === "feedback" && <FeedbackLinkCard />}
          {activeSection === "progression" && <ProgressionLinkCard />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
