import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { TrendingUp, Plus, Clock, Loader2, Brain, Sparkles, Radio, ArrowUpRight, X } from "lucide-react";
import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import { OnboardingModal, isOnboardingDone } from "@/components/onboarding-modal";
import { NewsWidget } from "@/components/news-widget";
import { CalendarWidget } from "@/components/calendar-widget";
import { DashboardLivePrices } from "@/components/dashboard-live-prices";
import { UsdIdrCard } from "@/components/usd-idr-card";
import { WatchlistSection } from "@/components/watchlist-section";
import { EnablePushCard } from "@/components/enable-push-card";
import {
  useGetAnalysesSummary, getGetAnalysesSummaryQueryKey,
  useGetAnalysisOutcomesSummary, getGetAnalysisOutcomesSummaryQueryKey,
  useGetRecentInstruments, getGetRecentInstrumentsQueryKey,
  useListAnalyses, getListAnalysesQueryKey,
  useUpdateProfile, getGetMeQueryKey,
  type AnalysesSummary, type AnalysesList, type RecentInstruments,
  type AnalysisOutcomesSummary,
  type User, type UserSelectedMode,
} from "@workspace/api-client-react";
import { OutcomeBadge, type OutcomeStatus } from "@/components/outcome-badge";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useTrackOutbound } from "@/hooks/use-track-outbound";
import { SHOW_SPONSOR } from "@/lib/sponsor-flag";

function isValid(validUntil: string | Date) {
  return new Date(validUntil) > new Date();
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, lang } = useTranslation();
  const trackOutbound = useTrackOutbound();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();
  const [, setLocation] = useLocation();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const [onboardingDone, setOnboardingDone] = useState(() => isOnboardingDone(user?.id));
  const [liveBannerDismissed, setLiveBannerDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem("tp_live_analisa_dismissed") === "1";
    } catch {
      return false;
    }
  });
  const dismissLiveBanner = () => {
    setLiveBannerDismissed(true);
    try {
      sessionStorage.setItem("tp_live_analisa_dismissed", "1");
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handler = () => setOnboardingDone(true);
    window.addEventListener("onboarding-complete", handler);
    return () => window.removeEventListener("onboarding-complete", handler);
  }, []);

  const { data: summary, isLoading: summaryLoading } = useGetAnalysesSummary({
    query: { queryKey: getGetAnalysesSummaryQueryKey() },
  });

  const { data: recentInstruments } = useGetRecentInstruments({
    query: { queryKey: getGetRecentInstrumentsQueryKey() },
  });

  // Outcome roll-up powers the AI accuracy card. Returns nulls for the
  // hit-rate fields when `scored == 0`, which we render as a zero-state.
  const { data: outcomesSummary } = useGetAnalysisOutcomesSummary({
    query: { queryKey: getGetAnalysisOutcomesSummaryQueryKey() },
  });
  const outcomesData = outcomesSummary as AnalysisOutcomesSummary | undefined;

  const { data: listData, isLoading: listLoading } = useListAnalyses(
    { page: 1, limit: 5 },
    { query: { queryKey: getListAnalysesQueryKey({ page: 1, limit: 5 }) } }
  );

  const intendedModeRef = useRef<UserSelectedMode | null>(null);

  const handleModeToggle = (mode: UserSelectedMode) => {
    if (user?.selectedMode === mode) return;
    intendedModeRef.current = mode;
    const queryKey = getGetMeQueryKey();
    queryClient.cancelQueries({ queryKey }).then(() => {
      const previous = queryClient.getQueryData<User>(queryKey);
      queryClient.setQueryData<User>(queryKey, (old) =>
        old ? { ...old, selectedMode: mode } : old
      );
      updateProfile.mutate(
        { data: { selectedMode: mode } },
        {
          onError: () => {
            if (intendedModeRef.current !== mode) return;
            queryClient.setQueryData(queryKey, previous);
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
          },
        }
      );
    });
  };

  const summaryData = summary as AnalysesSummary | undefined;
  const instrumentsData = recentInstruments as RecentInstruments | undefined;
  const analyses = (listData as AnalysesList | undefined)?.analyses ?? [];

  const MARKET_CONDITION_LABELS: Record<string, { label: string; color: string }> = {
    trending_up: { label: t.dashboard.trending_up, color: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400" },
    trending_down: { label: t.dashboard.trending_down, color: "bg-red-500/15 text-red-500 dark:text-red-400" },
    ranging: { label: t.dashboard.ranging, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
    volatile: { label: t.dashboard.volatile, color: "bg-orange-500/15 text-orange-500 dark:text-orange-400" },
  };

  return (
    <Layout>
      {user && !onboardingDone && <OnboardingModal open userId={user.id} />}

      <div className="px-4 py-5 space-y-5 lg:px-6">

        <EnablePushCard />

        {SHOW_SPONSOR && !liveBannerDismissed && (
          <div className="relative" data-testid="card-live-analisa">
            <a
              href="https://www.tiktok.com/@solid.prime"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              data-testid="link-live-analisa-tiktok"
              onClick={() => trackOutbound("dashboard-tiktok", "tiktok")}
            >
              <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/10 p-3.5 active:scale-[0.99] transition-transform">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
                <div className="relative flex items-center gap-3 pr-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                    <Radio className="w-5 h-5 text-[#1a1208]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-red-500/90 text-white text-[8px] font-bold uppercase tracking-wider">
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        {t.brand.live_analisa_badge}
                      </span>
                      <span className="text-[10px] text-amber-300 font-semibold tracking-wide">SOLID PRIME</span>
                    </div>
                    <p className="text-xs font-bold text-foreground leading-tight">
                      {t.brand.live_analisa_title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                      {t.brand.live_analisa_subtitle}
                    </p>
                  </div>
                  <span
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-300 shrink-0"
                    data-testid="text-live-analisa-cta"
                  >
                    {t.brand.live_analisa_cta}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </a>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismissLiveBanner(); }}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors"
              aria-label="Close"
              data-testid="button-dismiss-live-analisa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">{t.dashboard.welcome}</p>
            <h1 className="text-xl font-extrabold text-foreground" data-testid="text-display-name">
              {user?.displayName}
            </h1>
          </div>
          <button
            onClick={() => setLocation("/analyze")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-premium text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
            data-testid="button-new-analysis"
          >
            <Plus className="w-4 h-4" />
            {t.dashboard.new_analysis}
          </button>
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          {(["beginner", "pro"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeToggle(mode)}
              data-testid={`button-mode-${mode}`}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                user?.selectedMode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode === "beginner" ? t.common.beginner : `⚡ ${t.common.pro}`}
            </button>
          ))}
        </div>

        <div className="space-y-5 lg:space-y-0 lg:columns-2 lg:gap-x-5">

        <div className="lg:mb-5 lg:break-inside-avoid">
          <WatchlistSection />
        </div>

        <div className="lg:mb-5 lg:break-inside-avoid">
          <DashboardLivePrices />
        </div>

        <div className="lg:mb-5 lg:break-inside-avoid">
          <UsdIdrCard />
        </div>

        <div className="lg:mb-5 lg:break-inside-avoid">
          <CalendarWidget limit={6} />
        </div>

        <div className="lg:mb-5 lg:break-inside-avoid">
          <NewsWidget limit={5} />
        </div>

        <div className="grid grid-cols-3 gap-2.5 lg:mb-5 lg:break-inside-avoid">
          {[
            { label: t.dashboard.total_analyses, value: summaryLoading ? "—" : (summaryData?.totalAnalyses ?? 0), icon: Brain, gradient: "from-amber-400/20 to-yellow-500/20", iconColor: "text-amber-300" },
            { label: t.dashboard.beginner_mode, value: summaryLoading ? "—" : (summaryData?.beginnerCount ?? 0), icon: Sparkles, gradient: "from-yellow-400/20 to-amber-500/20", iconColor: "text-yellow-300" },
            { label: t.dashboard.pro_mode, value: summaryLoading ? "—" : (summaryData?.proCount ?? 0), icon: TrendingUp, gradient: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
          ].map(({ label, value, icon: Icon, gradient, iconColor }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <div className="text-2xl font-extrabold gradient-text" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
                {value}
              </div>
              <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>
        {outcomesData && outcomesData.total > 0 && (
          <div
            className="bg-card border border-border rounded-2xl p-4 space-y-3 lg:mb-5 lg:break-inside-avoid"
            data-testid="card-outcomes-summary"
          >
            <div>
              <p className="text-sm font-bold text-foreground">
                {t.outcomes.summary_title.replace("{days}", String(outcomesData.rangeDays))}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {t.outcomes.summary_subtitle}
              </p>
            </div>
            {outcomesData.scored > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-emerald-500/10 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
                      {t.outcomes.summary_tp_rate}
                    </p>
                    <p
                      className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400"
                      data-testid="stat-tp-hit-rate"
                    >
                      {Math.round((outcomesData.tpHitRate ?? 0) * 100)}%
                    </p>
                    <p className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70 mt-0.5">
                      {outcomesData.tp1Hit + outcomesData.tp2Hit} / {outcomesData.scored}
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-500/10 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-red-700/80 dark:text-red-300/80">
                      {t.outcomes.summary_sl_rate}
                    </p>
                    <p
                      className="text-lg font-extrabold text-red-600 dark:text-red-400"
                      data-testid="stat-sl-hit-rate"
                    >
                      {Math.round((outcomesData.slHitRate ?? 0) * 100)}%
                    </p>
                    <p className="text-[10px] text-red-700/70 dark:text-red-300/70 mt-0.5">
                      {outcomesData.slHit} / {outcomesData.scored}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {t.outcomes.summary_resolved
                      .replace("{scored}", String(outcomesData.scored))
                      .replace("{total}", String(outcomesData.total))}
                  </span>
                  {outcomesData.pending > 0 && (
                    <span>
                      {t.outcomes.summary_pending.replace("{n}", String(outcomesData.pending))}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(["tp2_hit", "tp1_hit", "sl_hit", "expired", "invalidated", "pending"] as const).map((s) => {
                    const counts: Record<OutcomeStatus, number> = {
                      tp1_hit: outcomesData.tp1Hit,
                      tp2_hit: outcomesData.tp2Hit,
                      sl_hit: outcomesData.slHit,
                      expired: outcomesData.expired,
                      invalidated: outcomesData.invalidated,
                      pending: outcomesData.pending,
                    };
                    const n = counts[s];
                    if (n === 0) return null;
                    return (
                      <span key={s} className="inline-flex items-center gap-1">
                        <OutcomeBadge status={s} />
                        <span className="text-[10px] text-muted-foreground">{n}</span>
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">{t.outcomes.summary_no_data}</p>
            )}
          </div>
        )}
        {summaryData?.avgConfidenceMin != null && summaryData.avgConfidenceMax != null && (
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center justify-between lg:mb-5 lg:break-inside-avoid" data-testid="stat-avg-confidence">
            <span className="text-xs text-muted-foreground">{t.dashboard.avg_confidence ?? "Avg. Confidence"}</span>
            <span className="text-sm font-bold text-primary">
              {Math.round(summaryData.avgConfidenceMin)}–{Math.round(summaryData.avgConfidenceMax)}%
            </span>
          </div>
        )}

        {instrumentsData?.instruments && instrumentsData.instruments.length > 0 && (
          <div className="lg:mb-5 lg:break-inside-avoid">
            <h2 className="text-sm font-bold text-foreground mb-2.5">{t.dashboard.last_analyzed}</h2>
            <div className="flex gap-2 flex-wrap">
              {instrumentsData.instruments.map((inst) => (
                <Link key={inst.instrument} href={`/analyze?instrument=${inst.instrument}`}>
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-mono font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                    data-testid={`badge-instrument-${inst.instrument}`}
                  >
                    {inst.instrument}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">{t.dashboard.recent_analyses}</h2>
            <Link href="/history">
              <span className="text-xs text-primary font-medium hover:underline cursor-pointer" data-testid="link-view-history">
                {t.dashboard.view_all}
              </span>
            </Link>
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : analyses.length === 0 ? (
            <div className="relative rounded-2xl border border-dashed border-border overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-yellow-500/5" />
              <div className="relative p-7 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/20 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-7 h-7 text-amber-300" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{t.dashboard.no_analyses_title}</p>
                <p className="text-xs text-muted-foreground mb-4">{t.dashboard.no_analyses_subtitle}</p>
                <button
                  className="px-5 py-2 rounded-xl btn-premium text-sm font-semibold hover:opacity-90 transition-all"
                  onClick={() => setLocation("/analyze")}
                  data-testid="button-start-first-analysis"
                >
                  {t.dashboard.start_analysis}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {analyses.map((a) => {
                const valid = isValid(a.validUntil);
                const mc = a.marketCondition ? MARKET_CONDITION_LABELS[a.marketCondition] : undefined;
                return (
                  <Link key={a.id} href={`/analyses/${a.id}`}>
                    <div
                      className="p-3.5 rounded-xl border border-border bg-card cursor-pointer hover:border-primary/30 transition-all group"
                      data-testid={`card-analysis-${a.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{a.instrument}</span>
                          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground">{a.timeframe}</span>
                          {mc && (
                            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", mc.color)}>
                              {mc.label}
                            </span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                            valid
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          )}
                          data-testid={`status-validity-${a.id}`}
                        >
                          {valid ? t.common.relevant : t.common.expired}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {a.mode === "beginner" ? t.common.beginner : t.common.pro} · {a.confidenceMin}–{a.confidenceMax}% {t.common.confidence}
                        </span>
                        <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">
                          {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true, locale: dateLocale })}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
