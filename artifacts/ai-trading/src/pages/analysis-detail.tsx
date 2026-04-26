import { useLocation } from "wouter";
import {
  ChevronLeft,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  RefreshCw,
  StickyNote,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Target,
  AlertOctagon,
  HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Layout } from "@/components/layout";
import { MarketContextSummary } from "@/components/market-context-summary";
import {
  useGetAnalysis,
  getGetAnalysisQueryKey,
  useSubmitFeedback,
  type Analysis,
  type Feedback,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { useRefreshAnalysis } from "@/hooks/use-refresh-analysis";

type T = ReturnType<typeof useTranslation>["t"];

function getMarketConditionMeta(
  key: string | null | undefined,
  t: T,
): { label: string; color: string } | undefined {
  if (!key) return undefined;
  const colorMap: Record<string, string> = {
    trending_up: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    trending_down: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    ranging: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    volatile: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  const labelMap: Record<string, string> = {
    trending_up: t.dashboard.trending_up,
    trending_down: t.dashboard.trending_down,
    ranging: t.dashboard.ranging,
    volatile: t.dashboard.volatile,
  };
  const color = colorMap[key];
  const label = labelMap[key];
  if (!color || !label) return undefined;
  return { label, color };
}

function getRiskLevelMeta(
  key: string | null | undefined,
  t: T,
): { label: string; color: string; bars: number } | undefined {
  if (!key) return undefined;
  const meta: Record<string, { color: string; bars: number; label: string }> = {
    low: { color: "text-green-600 dark:text-green-400", bars: 1, label: t.analysis_detail.risk_level_low },
    medium: { color: "text-yellow-600 dark:text-yellow-400", bars: 2, label: t.analysis_detail.risk_level_medium },
    high: { color: "text-red-600 dark:text-red-400", bars: 3, label: t.analysis_detail.risk_level_high },
  };
  return meta[key];
}

type BiasKey =
  | "bearish_strong"
  | "bearish"
  | "neutral"
  | "bullish"
  | "bullish_strong";

const LEGACY_BIAS_MAP: Record<string, BiasKey> = {
  strong_sell: "bearish_strong",
  sell: "bearish",
  neutral: "neutral",
  buy: "bullish",
  strong_buy: "bullish_strong",
};

function normalizeBias(raw: string | null | undefined): BiasKey | null {
  if (!raw) return null;
  if (raw in LEGACY_BIAS_MAP) return LEGACY_BIAS_MAP[raw]!;
  const valid: BiasKey[] = ["bearish_strong", "bearish", "neutral", "bullish", "bullish_strong"];
  return valid.includes(raw as BiasKey) ? (raw as BiasKey) : null;
}

const BIAS_ORDER: BiasKey[] = ["bearish_strong", "bearish", "neutral", "bullish", "bullish_strong"];

function biasIndex(bias: BiasKey): number {
  return BIAS_ORDER.indexOf(bias);
}

function biasColor(bias: BiasKey): string {
  switch (bias) {
    case "bearish_strong":
      return "text-red-700 dark:text-red-400";
    case "bearish":
      return "text-red-600 dark:text-red-400";
    case "neutral":
      return "text-yellow-600 dark:text-yellow-400";
    case "bullish":
      return "text-green-600 dark:text-green-400";
    case "bullish_strong":
      return "text-green-700 dark:text-green-400";
  }
}

function biasFillColor(bias: BiasKey): string {
  switch (bias) {
    case "bearish_strong":
      return "bg-red-600";
    case "bearish":
      return "bg-red-400";
    case "neutral":
      return "bg-yellow-400";
    case "bullish":
      return "bg-green-400";
    case "bullish_strong":
      return "bg-green-600";
  }
}

function biasLabel(bias: BiasKey, mode: string, t: T): string {
  const isBeginner = mode === "beginner";
  const dict = t.analysis_detail;
  if (isBeginner) {
    switch (bias) {
      case "bearish_strong":
        return dict.bias_beginner_bearish_strong;
      case "bearish":
        return dict.bias_beginner_bearish;
      case "neutral":
        return dict.bias_beginner_neutral;
      case "bullish":
        return dict.bias_beginner_bullish;
      case "bullish_strong":
        return dict.bias_beginner_bullish_strong;
    }
  }
  switch (bias) {
    case "bearish_strong":
      return dict.bias_bearish_strong;
    case "bearish":
      return dict.bias_bearish;
    case "neutral":
      return dict.bias_neutral;
    case "bullish":
      return dict.bias_bullish;
    case "bullish_strong":
      return dict.bias_bullish_strong;
  }
}

function BiasIcon({ bias, className }: { bias: BiasKey; className?: string }) {
  if (bias === "bullish" || bias === "bullish_strong") {
    return <TrendingUp className={className} />;
  }
  if (bias === "bearish" || bias === "bearish_strong") {
    return <TrendingDown className={className} />;
  }
  return <Minus className={className} />;
}

function BiasIndicator({ bias, mode, timeframe }: { bias: BiasKey; mode: string; timeframe: string }) {
  const { t } = useTranslation();
  const idx = biasIndex(bias);
  const color = biasColor(bias);
  const fill = biasFillColor(bias);
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
            {t.analysis_detail.bias_title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <BiasIcon bias={bias} className={cn("w-5 h-5", color)} />
            <span className={cn("text-lg font-bold", color)} data-testid="text-bias-label">
              {biasLabel(bias, mode, t)}
            </span>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wide"
              data-testid="text-bias-timeframe"
            >
              {timeframe}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {t.analysis_detail.bias_for_timeframe.replace("{timeframe}", timeframe)}
          </p>
        </div>
      </div>
      <div className="flex gap-1" data-testid="bias-gauge">
        {BIAS_ORDER.map((b, i) => (
          <div
            key={b}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-opacity",
              i === idx ? fill : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{t.analysis_detail.bias_bearish_strong}</span>
        <span>{t.analysis_detail.bias_neutral}</span>
        <span>{t.analysis_detail.bias_bullish_strong}</span>
      </div>
      <p className="text-[11px] text-muted-foreground italic leading-snug">
        {t.analysis_detail.bias_subtitle}
      </p>
    </div>
  );
}

function ValidityBadge({ validUntil }: { validUntil: string }) {
  const { t, lang } = useTranslation();
  const date = new Date(validUntil);
  const valid = date > new Date();
  const dateLocale = lang === "id" ? idLocale : undefined;
  if (valid) {
    return (
      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
        <Clock className="w-4 h-4" />
        <span className="text-xs font-medium">
          {t.analysis_detail.validity_active_prefix}{" "}
          {formatDistanceToNow(date, { addSuffix: false, locale: dateLocale })}{" "}
          {t.analysis_detail.validity_active_suffix}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span className="text-xs font-medium">{t.analysis_detail.validity_expired}</span>
    </div>
  );
}

function Section({ title, content }: { title: string; content?: string | null }) {
  if (!content) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{title}</h3>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function parseConditions(raw?: string | null): string[] {
  if (!raw) return [];
  // Split only on real list delimiters: newlines, "; " (semicolon followed by whitespace),
  // or bullet markers (• or " - " surrounded by spaces). Avoids splitting URLs/numbers
  // that contain bare semicolons or ampersands.
  return raw
    .split(/\n+|;\s+|(?:^|\s)[•]\s+|(?:\s)-\s+/g)
    .map((s) => s.trim().replace(/^[-*•]\s*/, ""))
    .filter((s) => s.length > 0);
}

function scenarioCText(bias: BiasKey, t: T): string {
  if (bias === "neutral") {
    return t.analysis_detail.scenario_c_template_neutral;
  }
  return t.analysis_detail.scenario_c_template_directional;
}

function executionScenarioAText(bias: BiasKey, t: T): string {
  if (bias === "bullish" || bias === "bullish_strong") {
    return t.analysis_detail.execution_scenario_a_template_bullish;
  }
  if (bias === "bearish" || bias === "bearish_strong") {
    return t.analysis_detail.execution_scenario_a_template_bearish;
  }
  return t.analysis_detail.execution_scenario_a_template_neutral;
}

export default function AnalysisDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t, lang } = useTranslation();
  const submitFeedback = useSubmitFeedback();
  const { refresh, isRefreshing: isRowRefreshing } = useRefreshAnalysis();
  const isRefreshing = isRowRefreshing(id);

  const [feedbackType, setFeedbackType] = useState<"useful" | "not_useful" | null>(null);
  const [outcome, setOutcome] = useState<"correct" | "wrong" | "unknown" | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [refreshMsgIndex, setRefreshMsgIndex] = useState(0);
  const [refreshDialogOpen, setRefreshDialogOpen] = useState(false);
  const [refreshNotes, setRefreshNotes] = useState("");
  const [executionOpen, setExecutionOpen] = useState(false);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const carriedOver = typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("carried_over") === "1";

  useEffect(() => {
    if (isRefreshing) {
      refreshIntervalRef.current = setInterval(() => {
        setRefreshMsgIndex((i) => (i + 1) % t.analyze.loading.length);
      }, 1800);
    } else {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      setRefreshMsgIndex(0);
    }
    return () => { if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current); };
  }, [isRefreshing, t]);

  const { data, isLoading } = useGetAnalysis(id, {
    query: {
      enabled: !!id,
      queryKey: getGetAnalysisQueryKey(id),
    },
  });

  type AnalysisWithFeedback = Analysis & { feedback?: Feedback | null };
  const analysis = data as AnalysisWithFeedback | undefined;

  const existingFeedback = analysis?.feedback;

  const openRefreshDialog = () => {
    if (!analysis) return;
    setRefreshNotes(analysis.userInputContext ?? "");
    setRefreshDialogOpen(true);
  };

  const handleRefresh = () => {
    if (!analysis) return;
    const trimmedNotes = refreshNotes.trim();
    const carriedFromOriginal =
      !!analysis.userInputContext &&
      trimmedNotes === (analysis.userInputContext ?? "").trim();
    setRefreshDialogOpen(false);
    refresh({
      id: analysis.id,
      instrument: analysis.instrument,
      timeframe: analysis.timeframe,
      mode: analysis.mode,
      userInputContext: trimmedNotes ? trimmedNotes : null,
      carriedOver: carriedFromOriginal,
    });
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackType && !existingFeedback) return;

    try {
      await submitFeedback.mutateAsync({
        id,
        data: {
          feedbackType: (feedbackType ?? existingFeedback?.feedbackType) as "useful" | "not_useful",
          outcome: (outcome ?? existingFeedback?.outcome ?? undefined) as "correct" | "wrong" | "unknown" | null | undefined,
          note: feedbackNote || existingFeedback?.note || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetAnalysisQueryKey(id) });
      setFeedbackSubmitted(true);
      toast({ title: t.analysis_detail.feedback_saved });
    } catch {
      toast({ title: t.analysis_detail.feedback_save_error, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!analysis) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <p className="text-muted-foreground mb-4">{t.analysis_detail.not_found}</p>
          <Button variant="outline" onClick={() => setLocation("/history")}>
            {t.analysis_detail.back_to_history}
          </Button>
        </div>
      </Layout>
    );
  }

  const mc = getMarketConditionMeta(analysis.marketCondition, t);
  const rl = getRiskLevelMeta(analysis.riskLevel, t);
  const isBeginnerMode = analysis.mode === "beginner";
  const isExpired = new Date(analysis.validUntil) <= new Date();
  const bias = normalizeBias(analysis.tradingBias);

  const displayFeedbackType = feedbackType ?? existingFeedback?.feedbackType ?? null;
  const displayOutcome = outcome ?? existingFeedback?.outcome ?? null;

  const invalidationRaw = isBeginnerMode
    ? analysis.failureConditions
    : analysis.invalidationConditions;
  const invalidationItems = parseConditions(invalidationRaw);

  const confidenceReason = isBeginnerMode
    ? analysis.whyReason
    : analysis.uncertaintyNotes;

  const scenarioAContent = isBeginnerMode ? analysis.mainScenario : analysis.baseCase;
  const scenarioBContent = isBeginnerMode
    ? analysis.alternativeScenario
    : (bias === "bearish" || bias === "bearish_strong"
        ? analysis.bullishScenario
        : analysis.bearishScenario);

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/history")}
            className="p-2 rounded-lg hover:bg-muted"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-foreground" data-testid="text-instrument">
                {analysis.instrument}
              </h1>
              <Badge variant="outline" className="text-xs">
                {analysis.timeframe}
              </Badge>
              {mc && (
                <Badge className={cn("text-xs border-0", mc.color)}>
                  {mc.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ValidityBadge validUntil={analysis.validUntil} />
            </div>
          </div>
        </div>

        {/* PRIMARY METRICS: Bias + Confidence + Risk */}
        <Card className="p-4 space-y-4" data-testid="card-primary-metrics">
          {bias && <BiasIndicator bias={bias} mode={analysis.mode} timeframe={analysis.timeframe} />}

          {bias && <div className="border-t border-border" />}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t.analysis_detail.confidence}</p>
              <p className="text-base font-bold text-foreground" data-testid="text-confidence">
                {analysis.confidenceMin ?? "--"}% – {analysis.confidenceMax ?? "--"}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t.analysis_detail.risk_title}</p>
              <p className={cn("text-sm font-bold", rl?.color)} data-testid="text-risk-level">
                {rl?.label}
              </p>
            </div>
          </div>

          <div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-2 flex-1 rounded-full",
                    n <= (rl?.bars ?? 0)
                      ? analysis.riskLevel === "low"
                        ? "bg-green-500"
                        : analysis.riskLevel === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{
                  left: `${analysis.confidenceMin ?? 0}%`,
                  width: `${(analysis.confidenceMax ?? 0) - (analysis.confidenceMin ?? 0)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {confidenceReason && (
            <div className="bg-muted/40 rounded-md p-2.5 flex gap-2" data-testid="card-confidence-reason">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                  {t.analysis_detail.confidence_reason_label}
                </p>
                <p className="text-xs text-foreground leading-relaxed">{confidenceReason}</p>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {t.analysis_detail.analyzed_prefix}{" "}
            {format(new Date(analysis.createdAt), "d MMM yyyy, HH:mm", {
              locale: lang === "id" ? idLocale : undefined,
            })}{" "}
            • {t.analysis_detail.mode_prefix}{" "}
            {isBeginnerMode ? t.analysis_detail.beginner_mode : t.analysis_detail.pro_mode}
          </div>

          {isExpired && (
            <Button
              className="w-full mt-2"
              onClick={openRefreshDialog}
              disabled={isRefreshing}
              data-testid="button-refresh-analysis"
            >
              {isRefreshing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t.analyze.loading[refreshMsgIndex]}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.analysis_detail.refresh_btn}</span>
                </div>
              )}
            </Button>
          )}
        </Card>

        {/* Market Context Summary — same card the user saw on the Analyze tab,
            rendered from the indicator-tally snapshot stored at analysis time. */}
        {analysis.techBuyCount != null &&
          analysis.techSellCount != null &&
          analysis.techNeutralCount != null && (
            <MarketContextSummary
              buy={analysis.techBuyCount}
              sell={analysis.techSellCount}
              neutral={analysis.techNeutralCount}
              mode={isBeginnerMode ? "beginner" : "pro"}
            />
          )}

        {analysis.userInputContext && (
          <Card className="p-4 space-y-2" data-testid="card-user-notes">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                {t.analysis_detail.your_notes}
              </h3>
              {carriedOver && (
                <Badge
                  variant="outline"
                  className="text-[10px] border-primary/40 text-primary bg-primary/5"
                  data-testid="badge-notes-carried-over"
                >
                  {t.analysis_detail.notes_carried_over}
                </Badge>
              )}
            </div>
            <p
              className="text-sm text-foreground leading-relaxed whitespace-pre-wrap"
              data-testid="text-user-notes"
            >
              {analysis.userInputContext}
            </p>
          </Card>
        )}

        {/* HIGH PRIORITY: Invalidation conditions */}
        {invalidationItems.length > 0 && (
          <Card
            className="p-4 border-l-4 border-l-red-500 dark:border-l-red-400 bg-red-50/40 dark:bg-red-950/20"
            data-testid="card-invalidation"
          >
            <div className="flex gap-2.5">
              <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
                    {t.analysis_detail.invalidation_title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t.analysis_detail.invalidation_subtitle}
                  </p>
                </div>
                <ul className="space-y-1.5" data-testid="list-invalidation">
                  {invalidationItems.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* OPPORTUNITY vs RISK */}
        {(analysis.opportunity || analysis.risk) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="grid-opp-risk">
            {analysis.opportunity && (
              <Card
                className="p-4 border-l-4 border-l-emerald-500 dark:border-l-emerald-400"
                data-testid="card-opportunity"
              >
                <div className="flex gap-2 mb-2">
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    {t.analysis_detail.opportunity_title}
                  </h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{analysis.opportunity}</p>
              </Card>
            )}
            {analysis.risk && (
              <Card
                className="p-4 border-l-4 border-l-amber-500 dark:border-l-amber-400"
                data-testid="card-risk"
              >
                <div className="flex gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400">
                    {t.analysis_detail.risk_title}
                  </h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{analysis.risk}</p>
              </Card>
            )}
          </div>
        )}

        {/* SCENARIOS A / B / C */}
        <Card className="p-4 space-y-4" data-testid="card-scenarios">
          {scenarioAContent && (
            <Section title={t.analysis_detail.scenario_a} content={scenarioAContent} />
          )}
          {scenarioBContent && (
            <Section title={t.analysis_detail.scenario_b} content={scenarioBContent} />
          )}
          <div data-testid="section-scenario-c">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {t.analysis_detail.scenario_c}
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {scenarioCText(bias ?? "neutral", t)}
            </p>
          </div>
        </Card>

        {/* PRO MODE: Technical + Fundamental + Market context */}
        {!isBeginnerMode && (analysis.keyDriversTechnical || analysis.keyDriversFundamental || analysis.marketContext) && (
          <Card className="p-4 space-y-4" data-testid="card-pro-details">
            <Section title={t.analysis_detail.pro_factor_technical} content={analysis.keyDriversTechnical} />
            <Section title={t.analysis_detail.pro_factor_fundamental} content={analysis.keyDriversFundamental} />
            <Section title={t.analysis_detail.pro_factor_market_context} content={analysis.marketContext} />
          </Card>
        )}

        {/* EXECUTION INSIGHT (Step 2 — collapsible) */}
        <Card className="overflow-hidden" data-testid="card-execution-insight">
          <Collapsible open={executionOpen} onOpenChange={setExecutionOpen}>
            <CollapsibleTrigger
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              data-testid="button-toggle-execution"
            >
              <div className="flex items-center gap-2 text-left">
                {executionOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.analysis_detail.execution_insight_title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.analysis_detail.execution_insight_intro}
                  </p>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 pt-0 space-y-3 border-t border-border">
                <div className="space-y-3 pt-3">
                  <div data-testid="exec-scenario-a">
                    <h4 className="text-xs font-semibold text-foreground mb-1">
                      {t.analysis_detail.execution_scenario_a_label}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {executionScenarioAText(bias ?? "neutral", t)}
                    </p>
                  </div>
                  <div data-testid="exec-scenario-b">
                    <h4 className="text-xs font-semibold text-foreground mb-1">
                      {t.analysis_detail.execution_scenario_b_label}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.analysis_detail.execution_scenario_b_template}
                    </p>
                  </div>
                  <div data-testid="exec-scenario-c">
                    <h4 className="text-xs font-semibold text-foreground mb-1">
                      {t.analysis_detail.execution_scenario_c_label}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.analysis_detail.execution_scenario_c_template}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex gap-2 mt-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                    {t.analysis_detail.execution_insight_disclaimer}
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card className="p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1.5">
              <p
                className="text-xs font-bold text-amber-800 dark:text-amber-300 leading-relaxed"
                data-testid="text-risk-disclaimer-short"
              >
                {t.analysis_detail.risk_disclaimer_short}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                {t.analysis_detail.disclaimer_full}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {existingFeedback || feedbackSubmitted
              ? t.analysis_detail.feedback_your
              : t.analysis_detail.feedback_title}
          </h3>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setFeedbackType("useful")}
              data-testid="button-feedback-useful"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                displayFeedbackType === "useful"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                  : "border-border text-muted-foreground hover:border-green-400"
              )}
            >
              <ThumbsUp className="w-4 h-4" />
              {t.analysis_detail.feedback_useful}
            </button>
            <button
              onClick={() => setFeedbackType("not_useful")}
              data-testid="button-feedback-not-useful"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                displayFeedbackType === "not_useful"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                  : "border-border text-muted-foreground hover:border-red-400"
              )}
            >
              <ThumbsDown className="w-4 h-4" />
              {t.analysis_detail.feedback_not_useful}
            </button>
          </div>

          {(feedbackType || existingFeedback) && (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">{t.analysis_detail.feedback_outcome_label}</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["correct", "wrong", "unknown"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOutcome(o)}
                      data-testid={`button-outcome-${o}`}
                      className={cn(
                        "py-2 text-xs font-medium rounded-lg border transition-all",
                        displayOutcome === o
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {o === "correct"
                        ? t.analysis_detail.feedback_outcome_correct
                        : o === "wrong"
                        ? t.analysis_detail.feedback_outcome_wrong
                        : t.analysis_detail.feedback_outcome_unknown}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder={t.analysis_detail.feedback_note_placeholder}
                value={feedbackNote || existingFeedback?.note || ""}
                onChange={(e) => setFeedbackNote(e.target.value)}
                rows={2}
                className="resize-none text-sm"
                data-testid="textarea-feedback-note"
              />

              {!feedbackSubmitted && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleFeedbackSubmit}
                  disabled={submitFeedback.isPending}
                  data-testid="button-submit-feedback"
                >
                  {submitFeedback.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {t.analysis_detail.feedback_submit}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      <Dialog open={refreshDialogOpen} onOpenChange={setRefreshDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-refresh">
          <DialogHeader>
            <DialogTitle>{t.analysis_detail.refresh_dialog_title}</DialogTitle>
            <DialogDescription>
              {analysis.userInputContext
                ? t.analysis_detail.refresh_dialog_desc
                : t.analysis_detail.refresh_dialog_no_notes_desc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              value={refreshNotes}
              onChange={(e) => setRefreshNotes(e.target.value)}
              placeholder={t.analysis_detail.refresh_notes_placeholder}
              rows={4}
              className="resize-none text-sm"
              data-testid="textarea-refresh-notes"
            />
            {refreshNotes && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRefreshNotes("")}
                className="h-7 px-2 text-xs text-muted-foreground"
                data-testid="button-clear-refresh-notes"
              >
                {t.analysis_detail.refresh_clear_notes}
              </Button>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRefreshDialogOpen(false)}
              data-testid="button-cancel-refresh"
            >
              {t.analysis_detail.refresh_cancel}
            </Button>
            <Button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              data-testid="button-confirm-refresh"
            >
              {isRefreshing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t.analysis_detail.refresh_confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
