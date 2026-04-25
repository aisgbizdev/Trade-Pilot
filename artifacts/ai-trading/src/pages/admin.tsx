import { useState, useMemo } from "react";
import {
  Loader2,
  ChevronLeft,
  Send,
  Search,
  X,
  Plus,
  Megaphone,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Users as UsersIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import {
  useGetAdminStats,
  getGetAdminStatsQueryKey,
  useGetAllAnalyses,
  getGetAllAnalysesQueryKey,
  useBroadcastNotification,
  useGetAllUsers,
  getGetAllUsersQueryKey,
  useGetAllTags,
  getGetAllTagsQueryKey,
  useAddUserTag,
  useRemoveUserTag,
  useGetBroadcasts,
  getGetBroadcastsQueryKey,
  type AnalysesList,
  type Analysis,
  type UsersList,
  type UserWithStats,
  type BroadcastsList,
  type BroadcastNotificationBodyAudienceType,
  type BroadcastAudienceType,
} from "@workspace/api-client-react";
import { format, formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";

const MARKET_CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  trending_up: { label: "Tren Naik", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  trending_down: { label: "Tren Turun", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ranging: { label: "Sideways", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  volatile: { label: "Volatil", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

function UserTagEditor({
  user,
  knownTags,
}: {
  user: UserWithStats;
  knownTags: string[];
}) {
  const { t, lang } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addTag = useAddUserTag();
  const removeTag = useRemoveUserTag();

  const ownedTagSet = useMemo(() => new Set(user.tags), [user.tags]);
  const suggestions = useMemo(() => {
    const q = draft.trim().toLowerCase();
    return knownTags
      .filter((tag) => !ownedTagSet.has(tag) && (!q || tag.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [draft, knownTags, ownedTagSet]);

  const invalidateUserAndTagLists = () => {
    queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetAllTagsQueryKey() });
  };

  const submitTag = async (tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    if (!/^[A-Za-z0-9][A-Za-z0-9 _.-]{0,39}$/.test(clean)) {
      toast({ title: t.admin.tag_invalid, variant: "destructive" });
      return;
    }
    try {
      await addTag.mutateAsync({ id: user.id, data: { tag: clean } });
      setDraft("");
      setShowSuggestions(false);
      invalidateUserAndTagLists();
    } catch {
      toast({ title: t.admin.tag_add_failed, variant: "destructive" });
    }
  };

  const handleAdd = () => submitTag(draft);

  const handleRemove = async (tag: string) => {
    try {
      await removeTag.mutateAsync({ id: user.id, tag });
      invalidateUserAndTagLists();
    } catch {
      toast({ title: t.admin.tag_remove_failed, variant: "destructive" });
    }
  };

  const dateLocale = lang === "id" ? idLocale : enUS;

  return (
    <div className="space-y-2" data-testid={`tag-editor-${user.id}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate" data-testid={`text-user-name-${user.id}`}>
            {user.displayName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <p className="text-[10px] text-muted-foreground/80">
            {user.role} · {format(new Date(user.createdAt), "d MMM yyyy", { locale: dateLocale })}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {user.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
            data-testid={`tag-${user.id}-${tag}`}
          >
            {tag}
            <button
              onClick={() => handleRemove(tag)}
              disabled={removeTag.isPending}
              className="hover:text-destructive"
              aria-label={`Remove ${tag}`}
              data-testid={`button-remove-tag-${user.id}-${tag}`}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <div className="flex gap-1.5">
          <Input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              window.setTimeout(() => setShowSuggestions(false), 120);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={t.admin.add_tag_placeholder}
            className="h-8 text-xs"
            data-testid={`input-add-tag-${user.id}`}
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs"
            onClick={handleAdd}
            disabled={addTag.isPending || !draft.trim()}
            data-testid={`button-add-tag-${user.id}`}
          >
            {addTag.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          </Button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-popover shadow-md max-h-44 overflow-y-auto"
            data-testid={`tag-suggestions-${user.id}`}
          >
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  void submitTag(sug);
                }}
                className="block w-full text-left px-2.5 py-1.5 text-xs hover:bg-muted"
                data-testid={`tag-suggestion-${user.id}-${sug}`}
              >
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RecentSignupsPanel() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAllUsers(
    { search: search || undefined, page: 1, limit: 10 },
    { query: { queryKey: getGetAllUsersQueryKey({ search: search || undefined, page: 1, limit: 10 }) } },
  );
  const users = (data as UsersList | undefined)?.users ?? [];
  const { data: tagsData } = useGetAllTags({ query: { queryKey: getGetAllTagsQueryKey() } });
  const knownTags = tagsData?.tags ?? [];

  return (
    <Card className="p-4 space-y-3" data-testid="card-recent-signups">
      <div>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <UsersIcon className="w-4 h-4" /> {t.admin.recent_signups_title}
        </h3>
        <p className="text-[11px] text-muted-foreground">{t.admin.recent_signups_subtitle}</p>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.admin.search_users_placeholder}
          className="h-9 pl-8 text-sm"
          data-testid="input-search-users"
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">{t.admin.no_users_found}</p>
      ) : (
        <div className="divide-y divide-border">
          {users.map((u) => (
            <div key={u.id} className="py-3 first:pt-0 last:pb-0">
              <UserTagEditor user={u} knownTags={knownTags} />
            </div>
          ))}
        </div>
      )}
      <Link
        href="/admin/users"
        className="block text-center text-xs text-primary hover:underline pt-1"
        data-testid="link-full-users"
      >
        {t.admin.open_full_users}
      </Link>
    </Card>
  );
}

function BroadcastComposer() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audienceType, setAudienceType] =
    useState<BroadcastNotificationBodyAudienceType>("all");
  const [audienceValue, setAudienceValue] = useState<string>("");

  const { data: tagsData } = useGetAllTags({
    query: { queryKey: getGetAllTagsQueryKey() },
  });
  const tags = useMemo(() => tagsData?.tags ?? [], [tagsData]);

  const broadcast = useBroadcastNotification();

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({ title: t.admin.broadcast_validation, variant: "destructive" });
      return;
    }
    if (audienceType !== "all" && !audienceValue) {
      toast({ title: t.admin.broadcast_validation, variant: "destructive" });
      return;
    }
    try {
      const result = await broadcast.mutateAsync({
        data: {
          title,
          message,
          type: "info",
          audienceType,
          audienceValue: audienceType === "all" ? null : audienceValue,
        },
      });
      const count = (result as { recipientCount?: number } | undefined)?.recipientCount ?? 0;
      toast({
        title: t.admin.broadcast_sent_title,
        description: t.admin.broadcast_sent_desc.replace("{n}", String(count)),
      });
      setTitle("");
      setMessage("");
      setAudienceType("all");
      setAudienceValue("");
      queryClient.invalidateQueries({ queryKey: getGetBroadcastsQueryKey() });
    } catch {
      toast({ title: t.admin.broadcast_failed, variant: "destructive" });
    }
  };

  return (
    <Card className="p-4 space-y-3" data-testid="card-broadcast-composer">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Send className="w-4 h-4" /> {t.admin.broadcast_compose_title}
      </h3>
      <Input
        placeholder={t.admin.broadcast_title_placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        data-testid="input-broadcast-title"
      />
      <textarea
        rows={3}
        placeholder={t.admin.broadcast_message_placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground resize-none"
        data-testid="textarea-broadcast-message"
      />
      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
          {t.admin.audience_label}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {([
            ["all", t.admin.audience_all],
            ["role", t.admin.audience_role],
            ["tag", t.admin.audience_tag],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => {
                setAudienceType(value);
                setAudienceValue("");
              }}
              className={cn(
                "py-1.5 text-xs rounded-lg border transition-colors",
                audienceType === value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted",
              )}
              data-testid={`button-audience-${value}`}
            >
              {label}
            </button>
          ))}
        </div>
        {audienceType === "role" && (
          <Select value={audienceValue} onValueChange={setAudienceValue}>
            <SelectTrigger className="h-9 text-sm" data-testid="select-audience-role">
              <SelectValue placeholder={t.admin.audience_role_picker} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">user</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
              <SelectItem value="super_admin">super_admin</SelectItem>
            </SelectContent>
          </Select>
        )}
        {audienceType === "tag" && (
          <div className="space-y-2">
            <Input
              value={audienceValue}
              onChange={(e) => setAudienceValue(e.target.value)}
              placeholder={t.admin.audience_tag_custom_placeholder}
              className="h-9 text-sm"
              data-testid="input-audience-tag-custom"
            />
            {tags.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">{t.admin.audience_tag_empty}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setAudienceValue(tag)}
                    className={cn(
                      "px-2 py-0.5 text-xs rounded-full border transition-colors",
                      audienceValue === tag
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted",
                    )}
                    data-testid={`button-audience-tag-${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Button
        className="w-full"
        onClick={handleSend}
        disabled={broadcast.isPending}
        data-testid="button-send-broadcast"
      >
        {broadcast.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {broadcast.isPending ? t.admin.sending_broadcast : t.admin.send_broadcast_btn}
      </Button>
    </Card>
  );
}

function BroadcastHistoryPanel() {
  const { t, lang } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetBroadcasts(
    { page, limit },
    { query: { queryKey: getGetBroadcastsQueryKey({ page, limit }) } },
  );
  const list = (data as BroadcastsList | undefined)?.broadcasts ?? [];
  const total = (data as BroadcastsList | undefined)?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const dateLocale = lang === "id" ? idLocale : enUS;

  const audienceLabel = (audienceType: BroadcastAudienceType, value: string | null | undefined) => {
    if (audienceType === "all") return t.admin.broadcast_history_audience_all;
    if (audienceType === "role")
      return t.admin.broadcast_history_audience_role.replace("{value}", value ?? "?");
    return t.admin.broadcast_history_audience_tag.replace("{value}", value ?? "?");
  };

  return (
    <Card className="p-4 space-y-3" data-testid="card-broadcast-history">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Megaphone className="w-4 h-4" /> {t.admin.broadcast_history_title}
      </h3>
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          {t.admin.broadcast_history_empty}
        </p>
      ) : (
        <div className="space-y-2">
          {list.map((b) => (
            <div
              key={b.id}
              className="rounded-lg border border-border p-2.5 space-y-1"
              data-testid={`broadcast-row-${b.id}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground truncate flex-1">{b.title}</p>
                <span
                  className="text-[10px] text-muted-foreground whitespace-nowrap"
                  title={format(new Date(b.createdAt), "d MMM yyyy HH:mm", { locale: dateLocale })}
                >
                  {formatDistanceToNow(new Date(b.createdAt), {
                    addSuffix: true,
                    locale: dateLocale,
                  })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{b.message}</p>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {audienceLabel(b.audienceType, b.audienceValue)}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {t.admin.broadcast_history_recipients.replace("{n}", String(b.recipientCount))}
                </span>
                <span className="text-[10px] text-muted-foreground/80 ml-auto">
                  {b.senderName ?? t.admin.broadcast_history_sender_unknown}
                </span>
              </div>
            </div>
          ))}
          {(hasNext || hasPrev) && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                data-testid="button-prev-broadcasts"
              >
                ← {page - 1 || 1}
              </Button>
              <span className="text-[11px] text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                data-testid="button-next-broadcasts"
              >
                {page + 1} →
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function AdminContent() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: statsData, isLoading: statsLoading } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey() },
  });

  const { data: analysesData, isLoading: analysesLoading } = useGetAllAnalyses(
    { page, limit },
    { query: { queryKey: getGetAllAnalysesQueryKey({ page, limit }) } },
  );

  const stats = statsData;
  const analyses = (analysesData as AnalysesList | undefined)?.analyses ?? [];
  const total = (analysesData as AnalysesList | undefined)?.total ?? 0;
  const hasMore = page * limit < total;

  return (
    <Layout>
      <div className="px-4 py-5 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/profile")}
            className="p-2 rounded-lg hover:bg-muted"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t.admin.command_center_title}</h1>
            <p className="text-xs text-muted-foreground">{t.admin.command_center_subtitle}</p>
          </div>
        </div>

        {statsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total User", value: stats?.totalUsers ?? 0 },
                { label: "User Hari Ini", value: stats?.totalUsersToday ?? 0 },
                { label: "Analisis Hari Ini", value: stats?.totalAnalysesToday ?? 0 },
                { label: "Minggu Ini", value: stats?.totalAnalysesThisWeek ?? 0 },
                { label: "Bulan Ini", value: stats?.totalAnalysesThisMonth ?? 0 },
              ].map(({ label, value }) => (
                <Card key={label} className="p-3 text-center">
                  <div className="text-2xl font-bold text-primary" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
                    {value}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
                </Card>
              ))}
            </div>

            {stats?.instrumentBreakdown && stats.instrumentBreakdown.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Instrumen Terpopuler</h3>
                <div className="space-y-2">
                  {stats?.instrumentBreakdown?.slice(0, 5).map((item) => (
                    <div key={item.instrument} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.instrument}</span>
                      <Badge variant="secondary" className="text-xs">{item.count}x</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {stats?.modeBreakdown && Object.keys(stats.modeBreakdown).length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Breakdown Mode</h3>
                <div className="space-y-2">
                  {Object.entries(stats?.modeBreakdown ?? {}).map(([mode, count]) => (
                    <div key={mode} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">
                        {mode === "beginner" ? "Pemula" : "Pro"}
                      </span>
                      <Badge variant="secondary" className="text-xs">{count}x</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        <RecentSignupsPanel />

        <Card className="p-4 space-y-2" data-testid="card-feedback-shortcut">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> {t.admin.feedback_page_title}
          </h3>
          <Link
            href="/admin/feedback"
            className="block text-center text-xs text-primary hover:underline pt-1"
            data-testid="link-admin-feedback"
          >
            {t.admin.open_feedback_page}
          </Link>
        </Card>

        <BroadcastComposer />

        <BroadcastHistoryPanel />

        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">{t.admin.all_analyses}</h2>

          {analysesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {analyses.map((a) => {
                const mc = a.marketCondition ? MARKET_CONDITION_LABELS[a.marketCondition] : undefined;
                const userEmail = (a as Analysis & { userEmail?: string }).userEmail;
                const usefulCount = (a as Analysis & { usefulCount?: number }).usefulCount ?? 0;
                const notUsefulCount = (a as Analysis & { notUsefulCount?: number }).notUsefulCount ?? 0;
                const hasFeedback = usefulCount > 0 || notUsefulCount > 0;
                return (
                  <Card key={a.id} className="p-3" data-testid={`card-analysis-${a.id}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">{a.instrument}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{a.timeframe}</Badge>
                          <Badge className={cn("text-[10px] px-1.5 py-0 border-0", mc?.color)}>{mc?.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {userEmail} • {a.mode === "beginner" ? "Pemula" : "Pro"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {format(new Date(a.createdAt), "d MMM")}
                        </span>
                        {hasFeedback ? (
                          <Link
                            href={`/admin/feedback?analysisId=${a.id}`}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
                            data-testid={`link-analysis-feedback-${a.id}`}
                            title={t.admin.feedback_signal_tooltip}
                          >
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                              <ThumbsUp className="w-3 h-3" />
                              {usefulCount}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400">
                              <ThumbsDown className="w-3 h-3" />
                              {notUsefulCount}
                            </span>
                          </Link>
                        ) : (
                          <span
                            className="text-[10px] text-muted-foreground/60"
                            data-testid={`text-analysis-no-feedback-${a.id}`}
                          >
                            {t.admin.feedback_signal_none}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
              {hasMore && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setPage((p) => p + 1)}
                  data-testid="button-load-more"
                >
                  {t.admin.load_more}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <AdminContent />
    </ProtectedRoute>
  );
}
