import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { TrendingUp, Plus, Clock, Loader2, TrendingDown, Minus, RefreshCw, Brain, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import { OnboardingModal, isOnboardingDone } from "@/components/onboarding-modal";
import { NewsWidget } from "@/components/news-widget";
import { CalendarWidget } from "@/components/calendar-widget";
import {
  useGetAnalysesSummary, getGetAnalysesSummaryQueryKey,
  useGetRecentInstruments, getGetRecentInstrumentsQueryKey,
  useListAnalyses, getListAnalysesQueryKey,
  useUpdateProfile, getGetMeQueryKey,
  type AnalysesSummary, type AnalysesList, type RecentInstruments,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useLiveQuotes } from "@/hooks/use-live-quotes";
import { useTranslation } from "@/lib/i18n";

function isValid(validUntil: string | Date) {
  return new Date(validUntil) > new Date();
}

const PRIORITY_INSTRUMENTS = ["XAU/USD", "EUR/USD", "GBP/USD", "USD/JPY", "BRENT", "DXY", "USD/IDR"];

function formatPrice(price: number, instrument: string): string {
  if (instrument === "USD/IDR") return price.toLocaleString("id-ID");
  if (instrument === "USD/JPY") return price.toFixed(2);
  if (instrument === "XAU/USD") return price.toFixed(2);
  if (["BRENT"].includes(instrument)) return price.toFixed(2);
  if (price > 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return price.toFixed(4);
}

function LivePriceTicker() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch, isFetching } = useLiveQuotes();

  const quotes = data?.data
    .filter((q) => PRIORITY_INSTRUMENTS.includes(q.instrument))
    .sort((a, b) => PRIORITY_INSTRUMENTS.indexOf(a.instrument) - PRIORITY_INSTRUMENTS.indexOf(b.instrument));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">{t.dashboard.live_price}</h2>
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {data?.serverTime && (
            <span className="text-[10px] text-muted-foreground font-mono">{data.serverTime} UTC</span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label={t.dashboard.refresh_price}
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-muted-foreground", isFetching && "animate-spin")} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">{t.dashboard.price_error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {quotes?.map((q) => {
            const isUp = q.direction === "up";
            const isFlat = q.changePercent === "+0%" || q.changePercent === "0%";
            return (
              <Link key={q.instrument} href={`/analyze?instrument=${q.instrument}`}>
                <div
                  className={cn(
                    "relative p-3 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.97] border overflow-hidden group",
                    "bg-card hover:border-primary/30",
                    isFlat ? "border-border" :
                    isUp ? "border-emerald-500/20 hover:border-emerald-500/40" :
                    "border-red-500/20 hover:border-red-500/40"
                  )}
                  data-testid={`live-quote-${q.instrument}`}
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    isUp ? "bg-emerald-500/3" : !isFlat ? "bg-red-500/3" : ""
                  )} />
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-foreground tracking-tight">{q.instrument}</span>
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center",
                      isFlat ? "bg-muted" : isUp ? "bg-emerald-500/15" : "bg-red-500/15"
                    )}>
                      {isFlat ? <Minus className="w-3 h-3 text-muted-foreground" /> :
                       isUp ? <TrendingUp className="w-3 h-3 text-emerald-500" /> :
                       <TrendingDown className="w-3 h-3 text-red-500" />}
                    </div>
                  </div>
                  <div className="text-[15px] font-bold text-foreground tabular-nums leading-none mb-1">
                    {formatPrice(q.price, q.instrument)}
                  </div>
                  <div className={cn(
                    "text-[10px] font-semibold",
                    isFlat ? "text-muted-foreground" :
                    isUp ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                  )}>
                    {q.changePercent}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1 font-mono">
                    B:{formatPrice(q.buy, q.instrument)} / S:{formatPrice(q.sell, q.instrument)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, lang } = useTranslation();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();
  const [, setLocation] = useLocation();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const [onboardingDone, setOnboardingDone] = useState(() => isOnboardingDone(user?.id));

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

  const { data: listData, isLoading: listLoading } = useListAnalyses(
    { page: 1, limit: 5 },
    { query: { queryKey: getListAnalysesQueryKey({ page: 1, limit: 5 }) } }
  );

  const handleModeToggle = async (mode: "beginner" | "pro") => {
    await updateProfile.mutateAsync({ data: { selectedMode: mode } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
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

      <div className="px-4 py-5 space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">{t.dashboard.welcome}</p>
            <h1 className="text-xl font-extrabold text-foreground" data-testid="text-display-name">
              {user?.displayName}
            </h1>
          </div>
          <button
            onClick={() => setLocation("/analyze")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-premium text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
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

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: t.dashboard.total_analyses, value: summaryLoading ? "—" : (summaryData?.totalAnalyses ?? 0), icon: Brain, gradient: "from-blue-500/20 to-violet-500/20", iconColor: "text-blue-400" },
            { label: t.dashboard.beginner_mode, value: summaryLoading ? "—" : (summaryData?.beginnerCount ?? 0), icon: Sparkles, gradient: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
            { label: t.dashboard.pro_mode, value: summaryLoading ? "—" : (summaryData?.proCount ?? 0), icon: TrendingUp, gradient: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
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
        {summaryData?.avgConfidenceMin != null && summaryData.avgConfidenceMax != null && (
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center justify-between" data-testid="stat-avg-confidence">
            <span className="text-xs text-muted-foreground">{t.dashboard.avg_confidence ?? "Avg. Confidence"}</span>
            <span className="text-sm font-bold text-primary">
              {Math.round(summaryData.avgConfidenceMin)}–{Math.round(summaryData.avgConfidenceMax)}%
            </span>
          </div>
        )}

        <LivePriceTicker />

        {instrumentsData?.instruments && instrumentsData.instruments.length > 0 && (
          <div>
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5" />
              <div className="relative p-7 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-7 h-7 text-blue-400" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{t.dashboard.no_analyses_title}</p>
                <p className="text-xs text-muted-foreground mb-4">{t.dashboard.no_analyses_subtitle}</p>
                <button
                  className="px-5 py-2 rounded-xl btn-premium text-white text-sm font-semibold hover:opacity-90 transition-all"
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

        <CalendarWidget limit={6} />
        <NewsWidget limit={5} />

      </div>
    </Layout>
  );
}
