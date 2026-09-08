import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  type UserWithStats,
  type AdminFeedbackRow,
} from "@workspace/api-client-react";

type SectionKey = "overview" | "topups" | "users" | "feedback" | "progression";

type SortKey = "totalAmountRupiah" | "totalCreditsGranted" | "requestCount" | "lastApprovedAt";

const PREVIEW_LIMIT = 10;

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className="w-7 h-7 animate-spin text-primary" />
    </div>
  );
}

function OverviewSection() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });

  if (isLoading) return <SectionLoader />;

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

  if (isLoading) return <SectionLoader />;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{t.admin_dashboard.topups_summary_subtitle}</p>

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

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-block text-xs font-medium text-primary hover:underline" data-testid={`link-${href.replace(/\//g, "-").replace(/^-/, "")}`}>
      {label}
    </Link>
  );
}

function roleLabel(role: string, t: ReturnType<typeof useTranslation>["t"]): string {
  if (role === "super_admin") return t.admin_dashboard.role_super_admin;
  if (role === "admin") return t.admin_dashboard.role_admin;
  return t.admin_dashboard.role_user;
}

function UsersSection() {
  const { t, lang } = useTranslation();
  const params = { page: 1, limit: PREVIEW_LIMIT };
  const { data, isLoading } = useGetAllUsers(params, { query: { queryKey: getGetAllUsersQueryKey(params) } });
  const dateLocale = lang === "id" ? "id-ID" : "en-US";
  const users = data?.users ?? [];

  if (isLoading) return <SectionLoader />;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {t.admin_dashboard.users_card_count.replace("{n}", String(data?.total ?? 0))}
      </p>
      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">{t.admin_dashboard.users_empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-2 pr-2 font-medium">{t.admin_dashboard.users_col_user}</th>
                <th className="py-2 pr-2 font-medium">{t.admin_dashboard.users_col_role}</th>
                <th className="py-2 pr-2 font-medium text-right">{t.admin_dashboard.users_col_analyses}</th>
                <th className="py-2 pr-2 font-medium">{t.admin_dashboard.users_col_joined}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: UserWithStats) => (
                <tr key={u.id} className="border-b border-border/50" data-testid={`row-user-${u.id}`}>
                  <td className="py-2 pr-2">
                    <div className="font-medium text-foreground">{u.displayName}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="py-2 pr-2">
                    <Badge variant={u.role === "user" ? "secondary" : "default"} className="text-[10px]">
                      {roleLabel(u.role, t)}
                    </Badge>
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums">{u.analysisCount}</td>
                  <td className="py-2 pr-2 text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString(dateLocale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ViewAllLink href="/admin/users" label={t.admin_dashboard.users_card_link} />
    </div>
  );
}

function feedbackTypeBadge(type: AdminFeedbackRow["feedbackType"]) {
  return type === "useful"
    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
    : "bg-amber-500/15 text-amber-600 dark:text-amber-400";
}

function FeedbackSection() {
  const { t, lang } = useTranslation();
  const params = { page: 1, limit: PREVIEW_LIMIT };
  const { data, isLoading } = useGetAdminFeedback(params, { query: { queryKey: getGetAdminFeedbackQueryKey(params) } });
  const dateLocale = lang === "id" ? "id-ID" : "en-US";
  const rows = data?.feedback ?? [];

  if (isLoading) return <SectionLoader />;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {t.admin_dashboard.feedback_card_count.replace("{n}", String(data?.total ?? 0))}
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">{t.admin_dashboard.feedback_empty}</p>
      ) : (
        <div className="space-y-2">
          {rows.map((f: AdminFeedbackRow) => (
            <Card key={f.id} className="p-3 space-y-1" data-testid={`row-feedback-${f.id}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${feedbackTypeBadge(f.feedbackType)}`}>
                    {f.feedbackType === "useful" ? t.admin_dashboard.feedback_type_useful : t.admin_dashboard.feedback_type_not_useful}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">{f.instrument}</span>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {new Date(f.createdAt).toLocaleDateString(dateLocale)}
                </span>
              </div>
              {f.note && <p className="text-xs text-muted-foreground leading-snug">{f.note}</p>}
              <p className="text-[11px] text-muted-foreground/70">{f.userEmail}</p>
            </Card>
          ))}
        </div>
      )}
      <ViewAllLink href="/admin/feedback" label={t.admin_dashboard.feedback_card_link} />
    </div>
  );
}

function ProgressionSection() {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{t.admin_dashboard.progression_section_hint}</p>
      <ViewAllLink href="/admin/progression" label={t.admin_dashboard.progression_card_link} />
    </div>
  );
}

const SECTIONS: {
  key: SectionKey;
  icon: typeof LayoutDashboard;
  Body: () => ReactNode;
}[] = [
  { key: "overview", icon: LayoutDashboard, Body: OverviewSection },
  { key: "topups", icon: Wallet, Body: TopupsSummarySection },
  { key: "users", icon: UsersIcon, Body: UsersSection },
  { key: "feedback", icon: MessageSquare, Body: FeedbackSection },
  { key: "progression", icon: Activity, Body: ProgressionSection },
];

function AdminDashboardContent() {
  const { t } = useTranslation();
  const trackEvent = useTrackEvent();
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    trackEvent("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const NAV_LABEL: Record<SectionKey, string> = {
    overview: t.admin_dashboard.nav_overview,
    topups: t.admin_dashboard.nav_topups,
    users: t.admin_dashboard.nav_users,
    feedback: t.admin_dashboard.nav_feedback,
    progression: t.admin_dashboard.nav_progression,
  };

  // Keep the sidebar highlight in sync with what the reader has scrolled to.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id.replace("section-", "") as SectionKey);
        }
      },
      { root, rootMargin: "-20% 0px -70% 0px" },
    );
    SECTIONS.forEach(({ key }) => {
      const el = document.getElementById(`section-${key}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const goToSection = (key: SectionKey) => {
    setActiveSection(key);
    document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              {SECTIONS.map(({ key, icon: Icon }) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    isActive={activeSection === key}
                    onClick={() => goToSection(key)}
                    data-testid={`nav-${key}`}
                    tooltip={NAV_LABEL[key]}
                  >
                    <Icon />
                    <span>{NAV_LABEL[key]}</span>
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
          <h1 className="text-lg font-bold text-foreground">{t.admin_dashboard.page_title}</h1>
        </header>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8">
          {SECTIONS.map(({ key, Body }) => (
            <section key={key} id={`section-${key}`} className="scroll-mt-4" data-testid={`section-${key}`}>
              <h2 className="mb-3 text-base font-bold text-foreground">{NAV_LABEL[key]}</h2>
              <Body />
            </section>
          ))}
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
