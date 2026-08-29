import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Calculator, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetStandardTradingRules, type TradePlan } from "@workspace/api-client-react";
import type { Translations } from "@/locales/en";
import {
  buildAdaptivePlanRecommendation,
  createAdaptivePlanFingerprint,
  getAdaptiveChartCandidatePrices,
  getAdaptiveMarginCapacity,
  getAdaptiveMarketRule,
  getAdaptiveStandardRuleCode,
  type AccountTier,
  type AdaptiveAnalysisContext,
  type AdaptiveLadderLevel,
  type AdaptiveLayerRejectReason,
  type AdaptivePlanContext,
  type AdaptivePlanDecision,
  type AdaptivePlanRecommendation,
  type AdaptivePlanReasonCode,
  type AdaptiveRiskPreference,
  type AdaptiveChartCandle,
  type AdaptiveSidePositionPlan,
} from "@/lib/adaptive-position-plan";

type AdaptiveCopy = Translations["analysis_detail"];

interface Props {
  analysisId: number;
  instrument: string;
  tradePlan: TradePlan;
  context: AdaptiveAnalysisContext;
  lang: "en" | "id";
  copy: AdaptiveCopy;
}

interface FormState {
  availableMargin: string;
  accountTier: AccountTier;
  preference: AdaptiveRiskPreference;
}

const DEFAULT_FORM: FormState = {
  availableMargin: "",
  accountTier: "mini",
  preference: "safe",
};

const ACCOUNT_TIERS = ["micro", "mini", "regular"] as const;

function storageKey(analysisId: number): string {
  return `trade-pilot:adaptive-plan:v9:${analysisId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredForm(value: unknown): value is Partial<FormState> {
  if (!isRecord(value)) return false;
  return (value.availableMargin === undefined || typeof value.availableMargin === "string") &&
    (value.accountTier === undefined || value.accountTier === "micro" || value.accountTier === "mini" || value.accountTier === "regular") &&
    (value.preference === undefined || value.preference === "safe" || value.preference === "balanced" || value.preference === "active");
}

function isStoredRecommendation(value: unknown): value is AdaptivePlanRecommendation {
  if (!isRecord(value) || !isRecord(value.result) || !isRecord(value.context) || !isRecord(value.decision)) return false;
  const fundamental = value.context.fundamental;
  const rule = value.result.rule;
  return typeof value.result.valid === "boolean" &&
    isRecord(fundamental) &&
    typeof fundamental.available === "boolean" &&
    (!value.result.valid || (isRecord(rule) && rule.marginBasis === "day")) &&
    (value.decision.posture === "scaling_allowed" || value.decision.posture === "entry_only" || value.decision.posture === "not_recommended") &&
    (value.decision.preferredSide === "buy" || value.decision.preferredSide === "sell" || value.decision.preferredSide === "both" || value.decision.preferredSide === "none") &&
    Array.isArray(value.decision.reasonCodes) &&
    value.decision.reasonCodes.every((code) => typeof code === "string");
}

function numberValue(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number | null | undefined, lang: "en" | "id", maximumFractionDigits = 2): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", {
    maximumFractionDigits,
  }).format(value);
}

function formatMoney(value: number | null | undefined, lang: "en" | "id", maximumFractionDigits = 2): string {
  const formatted = formatNumber(value, lang, maximumFractionDigits);
  return formatted === "—" ? formatted : `$${formatted}`;
}

function reasonText(code: AdaptivePlanReasonCode, context: AdaptivePlanContext, copy: AdaptiveCopy): string {
  const technical = context.technical;
  switch (code) {
    case "context_unavailable": return copy.adaptive_reason_context_unavailable;
    case "short_timeframe": return copy.adaptive_reason_short_timeframe.replace("{timeframe}", context.timeframe ?? "—");
    case "high_risk": return copy.adaptive_reason_high_risk;
    case "volatile_market": return copy.adaptive_reason_volatile_market;
    case "low_confidence": return copy.adaptive_reason_low_confidence.replace("{confidence}", String(context.confidenceMax ?? "—"));
    case "range_supports_scaling": return copy.adaptive_reason_range_supports_scaling;
    case "trend_favors_buy": return copy.adaptive_reason_trend_favors_buy;
    case "trend_favors_sell": return copy.adaptive_reason_trend_favors_sell;
    case "trend_opposes_buy": return copy.adaptive_reason_trend_opposes_buy;
    case "trend_opposes_sell": return copy.adaptive_reason_trend_opposes_sell;
    case "technical_supports_buy": return copy.adaptive_reason_technical_supports_buy.replace("{buy}", String(technical?.buy ?? 0)).replace("{sell}", String(technical?.sell ?? 0));
    case "technical_supports_sell": return copy.adaptive_reason_technical_supports_sell.replace("{buy}", String(technical?.buy ?? 0)).replace("{sell}", String(technical?.sell ?? 0));
    case "technical_mixed": return copy.adaptive_reason_technical_mixed;
    case "technical_unavailable": return copy.adaptive_reason_technical_unavailable;
    case "neutral_bias": return copy.adaptive_reason_neutral_bias;
    case "fundamental_high_impact": return copy.adaptive_reason_fundamental_high_impact.replace("{count}", String(context.fundamental.highImpactCount));
    case "fundamental_present": return copy.adaptive_reason_fundamental_present.replace("{news}", String(context.fundamental.newsCount)).replace("{events}", String(context.fundamental.eventCount));
    case "fundamental_clear": return copy.adaptive_reason_fundamental_clear;
    case "fundamental_unavailable": return copy.adaptive_reason_fundamental_unavailable;
    case "directional_conflict": return copy.adaptive_reason_directional_conflict;
    case "staged_add_condition": return copy.adaptive_reason_staged_add_condition;
  }
}

function stageReason(
  level: AdaptiveLadderLevel,
  lang: "en" | "id",
  copy: AdaptiveCopy,
): string {
  if (level.level === 0) return copy.adaptive_stage_initial_reason;
  const basis = level.basis === "entry_zone_edge"
    ? copy.adaptive_stage_basis_entry_edge
    : copy.adaptive_stage_basis_risk_checkpoint.replace(
        "{progress}",
        formatNumber(level.invalidationProgress * 100, lang, 0),
      );
  return copy.adaptive_stage_add_reason
    .replace("{level}", String(level.level))
    .replace("{price}", formatNumber(level.price, lang, 4))
    .replace("{distance}", formatNumber(level.distanceFromEntry, lang, 4))
    .replace("{lot}", formatNumber(level.lot, lang))
    .replace("{risk}", formatMoney(level.riskToStopForLot, lang))
    .replace("{basis}", basis);
}

function rejectedReason(reason: AdaptiveLayerRejectReason, copy: AdaptiveCopy): string {
  switch (reason) {
    case "analysis_limit": return copy.adaptive_rejected_analysis;
    case "day_margin": return copy.adaptive_rejected_margin;
    case "loss_ceiling": return copy.adaptive_rejected_loss;
    case "tier_limit": return copy.adaptive_rejected_tier;
  }
}

function PlanSide({ plan, lang, copy, decision }: { plan: AdaptiveSidePositionPlan; lang: "en" | "id"; copy: AdaptiveCopy; decision: AdaptivePlanDecision }) {
  const isBuy = plan.side === "buy";
  const scenarioIsPreferred = decision.preferredSide === "both" || decision.preferredSide === plan.side;
  const stageGuidance = plan.ladder.length > 1 && scenarioIsPreferred
    ? copy.adaptive_side_scaling_allowed
    : copy.adaptive_side_entry_only;
  return (
    <div className={`rounded-md border-l-4 p-3 space-y-3 bg-muted/20 ${isBuy ? "border-l-emerald-500" : "border-l-red-500"}`} data-testid={`adaptive-plan-${plan.side}`}>
      <div className="flex items-center justify-between gap-2">
        <h4 className={`text-sm font-bold flex items-center gap-1.5 ${isBuy ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isBuy ? copy.adaptive_buy : copy.adaptive_sell}
        </h4>
        <Badge variant="outline" className="text-[10px]">{formatNumber(plan.totalLots, lang)} {copy.adaptive_lot}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-foreground">{copy.adaptive_entry}</span><span className="text-right font-semibold tabular-nums">{formatNumber(plan.entry, lang, 4)}</span>
        <span className="text-muted-foreground">{copy.adaptive_stop}</span><span className="text-right font-semibold text-red-600 dark:text-red-400 tabular-nums">{formatNumber(plan.stopLoss, lang, 4)}</span>
        <span className="text-muted-foreground">{copy.adaptive_weighted_entry}</span><span className="text-right font-semibold tabular-nums">{formatNumber(plan.weightedAverageEntry, lang, 4)}</span>
        <span className="text-muted-foreground">{copy.adaptive_cycle_loss}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.estimatedCycleLoss, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_margin_required}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.marginRequired, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_funds_at_stop}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.totalFundsAtStop, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_profit_tp1}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.profitToTakeProfit1, lang)}{plan.riskRewardToTakeProfit1 == null ? "" : ` · 1:${formatNumber(plan.riskRewardToTakeProfit1, lang, 2)}`}</span>
        <span className="text-muted-foreground">{copy.adaptive_profit_tp2}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.profitToTakeProfit2, lang)}{plan.riskRewardToTakeProfit2 == null ? "" : ` · 1:${formatNumber(plan.riskRewardToTakeProfit2, lang, 2)}`}</span>
      </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground border-t border-border/60 pt-2">{stageGuidance}</p>
      <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-[11px]">
            <thead className="text-muted-foreground border-b border-border/70"><tr><th className="text-left whitespace-nowrap py-1 pr-3 font-medium">{copy.adaptive_level}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_price}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_lot}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_cumulative}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_day_margin}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_stop_risk}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_profit_tp1}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_profit_tp2}</th></tr></thead>
          <tbody>{plan.ladder.map((level) => (
            <tr key={`${plan.side}-${level.level}`} className="border-b border-border/40 last:border-0 align-top">
                <td className="py-1.5 pr-3 font-semibold whitespace-nowrap">{level.level === 0 ? copy.adaptive_initial : `L${level.level}`}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatNumber(level.price, lang, 4)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatNumber(level.lot, lang)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatNumber(level.cumulativeLots, lang)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatMoney(level.cumulativeDayMargin, lang)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatMoney(level.estimatedRiskToStop, lang)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatMoney(level.cumulativeProfitToTakeProfit1, lang)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatMoney(level.cumulativeProfitToTakeProfit2, lang)}</td>
            </tr>
          ))}</tbody>
        </table>
          <div className="mt-3 space-y-2 border-t border-border/60 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{copy.adaptive_stage_reason}</p>
            {plan.ladder.map((level) => (
              <div key={`${plan.side}-guidance-${level.level}`} className="rounded-md bg-background/60 px-2.5 py-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-semibold text-foreground">
                  <span>{level.level === 0 ? copy.adaptive_initial : `L${level.level}`}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="tabular-nums">{formatNumber(level.price, lang, 4)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="tabular-nums">{formatNumber(level.lot, lang)} {copy.adaptive_lot}</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{stageReason(level, lang, copy)}</p>
              </div>
            ))}
          </div>
          {plan.rejectedLadder.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-amber-300/60 pt-2" data-testid={`adaptive-rejected-${plan.side}`}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">{copy.adaptive_rejected_title}</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_rejected_help}</p>
              {plan.rejectedLadder.map((level) => (
                <div key={`${plan.side}-rejected-${level.level}`} className="rounded-md border border-dashed border-amber-300 bg-amber-50/60 px-2.5 py-2 text-[11px] dark:border-amber-900 dark:bg-amber-950/20">
                  <div className="flex flex-wrap justify-between gap-2 font-semibold">
                    <span>L{level.level} · {formatNumber(level.price, lang, 4)} · {formatNumber(level.lot, lang)} {copy.adaptive_lot}</span>
                    <span className="text-amber-700 dark:text-amber-400">{copy.adaptive_rejected_badge}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{rejectedReason(level.rejectReason, copy)}</p>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export function AdaptivePositionPlan({ analysisId, instrument, tradePlan, context, lang, copy }: Props) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [recommendation, setRecommendation] = useState<AdaptivePlanRecommendation | null>(null);
  const restoredStateKeyRef = useRef<string | null>(null);
  const [chartCandidateState, setChartCandidateState] = useState<{
    status: "loading" | "ready" | "error";
    prices: { buy: number[]; sell: number[] };
  }>({ status: "loading", prices: { buy: [], sell: [] } });
  const { data: standardRules, isLoading: isRulesLoading, isError: isRulesError } = useGetStandardTradingRules({
    query: { queryKey: ["/api/trading-rules/standard"], staleTime: 5 * 60_000 },
  });
  const standardRuleCode = getAdaptiveStandardRuleCode(instrument);
  const isAdaptiveInstrument = standardRuleCode !== null;
  const standardRule = standardRules?.instruments.find((rule) => rule.code === standardRuleCode) ?? null;
  const rulesAvailable = isAdaptiveInstrument && !isRulesLoading && !isRulesError && standardRule !== null;
  const availableMargin = numberValue(form.availableMargin);
  const selectedRule = rulesAvailable
    ? getAdaptiveMarketRule(instrument, standardRule, form.accountTier)
    : null;
  useEffect(() => {
    if (!rulesAvailable || !context.timeframe || !selectedRule) {
      setChartCandidateState({ status: "error", prices: { buy: [], sell: [] } });
      return;
    }
    let cancelled = false;
    setChartCandidateState({ status: "loading", prices: { buy: [], sell: [] } });
    fetch(
      `/api/historical/candles?instrument=${encodeURIComponent(instrument)}&timeframe=${encodeURIComponent(context.timeframe)}&purpose=adaptive-layering`,
      { credentials: "include" },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ candles?: unknown[] }>;
      })
      .then((payload) => {
        if (cancelled) return;
        const candles = (Array.isArray(payload.candles) ? payload.candles : [])
          .filter((value): value is AdaptiveChartCandle => {
            if (!isRecord(value)) return false;
            return typeof value.high === "number" &&
              Number.isFinite(value.high) &&
              typeof value.low === "number" &&
              Number.isFinite(value.low);
          });
        setChartCandidateState({
          status: "ready",
          prices: getAdaptiveChartCandidatePrices(candles, tradePlan, selectedRule.minMovement),
        });
      })
      .catch(() => {
        if (!cancelled) setChartCandidateState({ status: "error", prices: { buy: [], sell: [] } });
      });
    return () => {
      cancelled = true;
    };
  }, [context.timeframe, instrument, rulesAvailable, selectedRule?.minMovement, tradePlan]);
  const marginCapacity = getAdaptiveMarginCapacity(availableMargin, selectedRule);
  const tierAssessments = rulesAvailable && availableMargin != null && availableMargin > 0
    ? Object.fromEntries(ACCOUNT_TIERS.map((accountTier) => {
        const rule = getAdaptiveMarketRule(instrument, standardRule, accountTier);
        const capacity = getAdaptiveMarginCapacity(availableMargin, rule);
        const assessment = buildAdaptivePlanRecommendation({
          instrument,
          tradePlan,
          availableMargin,
          standardRule,
          accountTier,
          preference: form.preference,
          context,
          checkpointPrices: chartCandidateState.prices,
        });
        return [accountTier, {
          capacity,
          safe: assessment.result.valid && assessment.recommendation !== null,
        }];
      })) as Record<AccountTier, { capacity: number; safe: boolean }>
    : null;
  const planMatrix = rulesAvailable && availableMargin != null && availableMargin > 0
    ? ACCOUNT_TIERS.flatMap((accountTier) =>
        (["safe", "balanced", "active"] as const).map((preference) => ({
          accountTier,
          preference,
          assessment: buildAdaptivePlanRecommendation({
            instrument,
            tradePlan,
            availableMargin,
            standardRule,
            accountTier,
            preference,
            context,
            checkpointPrices: chartCandidateState.prices,
          }),
        })),
      )
    : [];
  const fingerprint = createAdaptivePlanFingerprint({
    instrument,
    tradePlan,
    context,
    standardRule: rulesAvailable ? standardRule : null,
    checkpointPrices: chartCandidateState.prices,
  });
  const unsupportedInstrument = !isAdaptiveInstrument;
  const rulesUnavailable = isAdaptiveInstrument && !isRulesLoading && !rulesAvailable;

  useEffect(() => {
    if (isRulesLoading) return;
    const restoreKey = `${analysisId}:${rulesAvailable ? "ready" : "unavailable"}`;
    const shouldRestore = restoredStateKeyRef.current !== restoreKey;
    if (shouldRestore) {
      restoredStateKeyRef.current = restoreKey;
      setForm(DEFAULT_FORM);
      setRecommendation(null);
    }
    if (!rulesAvailable) {
      localStorage.removeItem(storageKey(analysisId));
      return;
    }
    try {
      const stored = localStorage.getItem(storageKey(analysisId));
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (!isRecord(parsed)) return;
      if (parsed.fingerprint !== fingerprint) {
        setRecommendation(null);
        localStorage.removeItem(storageKey(analysisId));
        return;
      }
      if (shouldRestore && isStoredForm(parsed.form)) setForm({ ...DEFAULT_FORM, ...parsed.form });
      if (shouldRestore && isStoredRecommendation(parsed.recommendation)) {
        setRecommendation(parsed.recommendation);
      }
    } catch {
      // A malformed local draft should not block Standard Analysis.
    }
  }, [analysisId, fingerprint, isRulesLoading, rulesAvailable]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setRecommendation(null);
  };
  const selectCombination = (accountTier: AccountTier, preference: AdaptiveRiskPreference) => {
    setForm((previous) => ({ ...previous, accountTier, preference }));
    setRecommendation(null);
  };
  const calculate = () => {
    if (!rulesAvailable) {
      setRecommendation(null);
      localStorage.removeItem(storageKey(analysisId));
      return;
    }
    const next = buildAdaptivePlanRecommendation({
      instrument,
      tradePlan,
      availableMargin,
      standardRule,
      accountTier: form.accountTier,
      preference: form.preference,
      context,
      checkpointPrices: chartCandidateState.prices,
    });
    setRecommendation(next);
    localStorage.setItem(storageKey(analysisId), JSON.stringify({ fingerprint, form, recommendation: next }));
  };
  const reset = () => {
    setForm(DEFAULT_FORM);
    setRecommendation(null);
    localStorage.removeItem(storageKey(analysisId));
  };
  const selected = recommendation?.recommendation;
  const primaryPlan = recommendation?.decision.preferredSide === "sell"
    ? recommendation.result.sell
    : recommendation?.decision.preferredSide === "buy"
      ? recommendation.result.buy
      : recommendation?.result.buy ?? recommendation?.result.sell ?? null;

  return (
    <Card className="overflow-hidden" data-testid="card-adaptive-position-plan">
      <div className="flex items-start gap-2 border-b border-border p-4">
        <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{copy.adaptive_title}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{copy.adaptive_subtitle}</p>
        </div>
      </div>
      <div className="p-4 space-y-4" data-testid="adaptive-plan-content">
        {unsupportedInstrument ? (
          <div className="rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3 space-y-1.5 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300" data-testid="adaptive-plan-unsupported">
            <p className="text-xs font-bold">{copy.adaptive_unsupported_title}</p>
            <p>{copy.adaptive_unsupported_description}</p>
          </div>
        ) : (
        <>
        <p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_ready}</p>
         <p className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-[11px] leading-relaxed text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300" data-testid="adaptive-disclaimer">{copy.adaptive_disclaimer}</p>
        <div className="rounded-md border border-primary/20 bg-primary/[0.03] p-3 text-[11px] leading-relaxed text-muted-foreground" data-testid="adaptive-analysis-basis">
          <p className="font-semibold text-foreground">{copy.adaptive_analysis_basis_title}</p>
          <p className="mt-1">{copy.adaptive_analysis_basis}</p>
          <p className="mt-1">{copy.adaptive_chart_confirmation}</p>
          <p className="mt-1 font-medium text-foreground" data-testid="adaptive-chart-candidate-status">
            {chartCandidateState.status === "loading"
              ? copy.adaptive_chart_candidates_loading
              : chartCandidateState.status === "error"
                ? copy.adaptive_chart_candidates_unavailable
                : copy.adaptive_chart_candidates_ready
                    .replace("{buy}", String(chartCandidateState.prices.buy.length))
                    .replace("{sell}", String(chartCandidateState.prices.sell.length))}
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.adaptive_account_title}</h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label={copy.adaptive_account_title}>
            {ACCOUNT_TIERS.map((accountTier) => {
              const labels = {
                micro: [copy.adaptive_account_micro, copy.adaptive_account_micro_desc],
                mini: [copy.adaptive_account_mini, copy.adaptive_account_mini_desc],
                regular: [copy.adaptive_account_regular, copy.adaptive_account_regular_desc],
              } as const;
              const selectedAccount = form.accountTier === accountTier;
              const assessment = tierAssessments?.[accountTier] ?? null;
              const status = assessment == null
                ? null
                : assessment.safe
                  ? copy.adaptive_tier_safe
                  : assessment.capacity > 0
                    ? copy.adaptive_tier_risk_blocked
                    : copy.adaptive_tier_margin_blocked;
              return (
                <button
                  key={accountTier}
                  type="button"
                  role="radio"
                  aria-checked={selectedAccount}
                  onClick={() => updateField("accountTier", accountTier)}
                  className={`rounded-md border p-3 text-left transition-colors ${selectedAccount ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-muted/50"}`}
                  data-testid={`button-adaptive-account-${accountTier}`}
                >
                  <span className="block text-xs font-bold text-foreground">{labels[accountTier][0]}</span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{labels[accountTier][1]}</span>
                  {status && (
                    <span className={`mt-2 block text-[10px] font-semibold ${assessment?.safe ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                      {status}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedRule && (
            <div className="rounded-md bg-muted/50 p-2.5 text-[11px] leading-relaxed text-muted-foreground" data-testid="adaptive-account-rule">
              <p>{copy.adaptive_account_rule
                .replace("{tier}", copy[`adaptive_account_${form.accountTier}`])
                .replace("{lot}", formatNumber(selectedRule.minimumLot, lang, 2))
                .replace("{amount}", formatMoney(selectedRule.marginAtMinimumLot, lang))
                .replace("{size}", formatNumber(selectedRule.contractSize, lang, 2))
                .replace("{unit}", standardRule?.contractUnit ?? "")}</p>
              {selectedRule.minimumOpeningFunds != null && (
                <p className="mt-1">{copy.adaptive_account_opening_minimum.replace("{amount}", formatMoney(selectedRule.minimumOpeningFunds, lang))}</p>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="block max-w-sm space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{copy.adaptive_available_margin}</span>
            <span className="relative block max-w-sm">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span>
              <Input type="number" min="0" step="any" value={form.availableMargin} placeholder="0" onChange={(event) => updateField("availableMargin", event.target.value)} className="h-9 pl-7 text-sm" data-testid="input-adaptive-available-margin" />
            </span>
            <span className="block text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_available_margin_help}</span>
            <span className="block rounded-md border border-sky-200 bg-sky-50 px-2.5 py-2 text-[10px] leading-relaxed text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300" data-testid="adaptive-daytrade-only">{copy.adaptive_day_trade_only}</span>
          </label>
          {isRulesLoading && <p className="text-[11px] text-muted-foreground" data-testid="adaptive-plan-rules-loading">{copy.adaptive_rules_loading}</p>}
          {selectedRule && availableMargin != null && availableMargin > 0 && (
            <div className="rounded-md border border-border p-2.5 text-[11px] leading-relaxed" data-testid="adaptive-margin-capacity">
              <p className="font-semibold text-foreground">{copy.adaptive_capacity_title}</p>
              <p className="mt-0.5 text-muted-foreground">
                {marginCapacity > 0
                  ? copy.adaptive_capacity_value.replace("{lot}", formatNumber(marginCapacity, lang, 2))
                  : copy.adaptive_capacity_none.replace("{tier}", copy[`adaptive_account_${form.accountTier}`])}
              </p>
            </div>
          )}
          {planMatrix.length > 0 && (
            <div className="space-y-2" data-testid="adaptive-plan-comparison">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.adaptive_comparison_title}</h4>
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_comparison_help}</p>
              </div>
              <p className="rounded-md border border-border/70 bg-muted/30 px-2.5 py-2 text-[10px] leading-relaxed text-muted-foreground" data-testid="adaptive-comparison-alternatives">
                <span className="font-semibold text-foreground">{copy.adaptive_comparison_safe_label}:</span> {copy.adaptive_comparison_safe_help}{" "}
                <span className="ml-1 font-semibold text-foreground">{copy.adaptive_comparison_capacity_label}:</span> {copy.adaptive_comparison_capacity_help}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {planMatrix.map(({ accountTier, preference, assessment }) => {
                  const recommendation = assessment.recommendation;
                  const label = copy[`adaptive_account_${accountTier}`];
                  const riskLabel = copy[`adaptive_preference_${preference}`];
                  const status = recommendation == null
                    ? copy.adaptive_comparison_unavailable
                    : assessment.result.valid
                      ? copy.adaptive_comparison_ready
                          .replace("{levels}", String(recommendation.levels))
                          .replace("{side}", assessment.decision.preferredSide === "buy"
                            ? copy.adaptive_buy
                            : assessment.decision.preferredSide === "sell"
                              ? copy.adaptive_sell
                              : copy.adaptive_both)
                      : copy.adaptive_comparison_wait;
                  const isSelected = form.accountTier === accountTier && form.preference === preference;
                  const posture = assessment.decision.preferredSide === "buy"
                    ? copy.adaptive_buy
                    : assessment.decision.preferredSide === "sell"
                      ? copy.adaptive_sell
                      : assessment.decision.preferredSide === "both"
                        ? copy.adaptive_both
                        : copy.adaptive_comparison_no_posture;
                  const postureState = assessment.decision.posture === "scaling_allowed"
                    ? copy.adaptive_comparison_scaling_allowed
                    : assessment.decision.posture === "entry_only"
                      ? copy.adaptive_comparison_entry_only
                      : copy.adaptive_comparison_not_recommended;
                  const sidePlans = [
                    { side: "buy" as const, plan: assessment.result.buy },
                    { side: "sell" as const, plan: assessment.result.sell },
                  ].filter((side): side is { side: "buy" | "sell"; plan: AdaptiveSidePositionPlan } => side.plan !== null);
                  return (
                    <button
                      key={`${accountTier}-${preference}`}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => selectCombination(accountTier, preference)}
                      className={`w-full rounded-md border p-2.5 text-left transition-colors ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-muted/20 hover:bg-muted/50"}`}
                      data-testid={`adaptive-comparison-${accountTier}-${preference}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-foreground">{label}</span>
                        <span className="text-[10px] text-muted-foreground">{riskLabel}</span>
                      </div>
                      <p className={`mt-1 text-[10px] leading-relaxed ${assessment.result.valid ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>{status}</p>
                      {recommendation ? (
                        <div className="mt-2 space-y-2 border-t border-border/60 pt-2 text-[10px] leading-relaxed" data-testid={`adaptive-comparison-details-${accountTier}-${preference}`}>
                          <div className="flex flex-wrap justify-between gap-x-2">
                            <span className="text-muted-foreground">{copy.adaptive_comparison_posture}</span>
                            <span className="font-semibold text-foreground">{posture} · {postureState}</span>
                          </div>
                          {sidePlans.length > 0 ? sidePlans.map(({ side, plan }) => {
                            const sideLabel = side === "buy" ? copy.adaptive_buy : copy.adaptive_sell;
                            const extraLayers = Math.max(0, plan.ladder.length - 1);
                            return (
                              <div key={side} className="rounded-md bg-background/70 p-2" data-testid={`adaptive-comparison-${accountTier}-${preference}-${side}`}>
                                <p className="font-semibold text-foreground">{sideLabel}</p>
                                <dl className="mt-1 grid gap-0.5">
                                  <div className="flex justify-between gap-2"><dt className="text-muted-foreground">{copy.adaptive_comparison_margin}</dt><dd className="text-right tabular-nums">{formatMoney(plan.marginRequired, lang)} / {formatMoney(recommendation.marginBudget, lang)}</dd></div>
                                  <div className="flex justify-between gap-2"><dt className="text-muted-foreground">{copy.adaptive_comparison_capacity}</dt><dd className="text-right tabular-nums">{formatNumber(recommendation.initialLot, lang)} {copy.adaptive_lot} + {extraLayers} {copy.adaptive_snapshot_layers} · {formatNumber(plan.totalLots, lang)} {copy.adaptive_lot}</dd></div>
                                  <div className="flex justify-between gap-2"><dt className="text-muted-foreground">{copy.adaptive_comparison_loss}</dt><dd className="text-right tabular-nums">{formatMoney(plan.estimatedCycleLoss, lang)} / {formatMoney(recommendation.maximumLoss, lang)}</dd></div>
                                  <div className="flex justify-between gap-2"><dt className="text-muted-foreground">{copy.adaptive_comparison_profit}</dt><dd className="text-right tabular-nums">{copy.adaptive_profit_tp1} {formatMoney(plan.profitToTakeProfit1, lang)} · {copy.adaptive_profit_tp2} {formatMoney(plan.profitToTakeProfit2, lang)}</dd></div>
                                </dl>
                              </div>
                            );
                          }) : (
                            <p className="text-muted-foreground">{copy.adaptive_comparison_no_plan}</p>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 border-t border-border/60 pt-2 text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_comparison_no_plan}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {rulesUnavailable && <div className="rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300" data-testid="adaptive-plan-rules-unavailable">{copy.adaptive_rules_error}</div>}
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.adaptive_preference_title}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={copy.adaptive_preference_title}>
            {(["safe", "balanced", "active"] as const).map((preference) => {
              const labels = {
                safe: [copy.adaptive_preference_safe, copy.adaptive_preference_safe_desc],
                balanced: [copy.adaptive_preference_balanced, copy.adaptive_preference_balanced_desc],
                active: [copy.adaptive_preference_active, copy.adaptive_preference_active_desc],
              } as const;
              const selectedPreference = form.preference === preference;
              return <button key={preference} type="button" role="radio" aria-checked={selectedPreference} onClick={() => updateField("preference", preference)} className={`rounded-md border p-3 text-left transition-colors ${selectedPreference ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-muted/50"}`} data-testid={`button-adaptive-preference-${preference}`}>
                <span className="block text-xs font-bold text-foreground">{labels[preference][0]}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{labels[preference][1]}</span>
              </button>;
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={calculate} disabled={!rulesAvailable || chartCandidateState.status === "loading"} data-testid="button-calculate-adaptive-plan"><ShieldCheck className="w-4 h-4 mr-1.5" />{copy.adaptive_calculate}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset} data-testid="button-reset-adaptive-plan">{copy.adaptive_reset}</Button>
        </div>
         {recommendation && selected && primaryPlan && (
           <div className="rounded-md border border-primary/30 bg-primary/[0.05] p-3 space-y-3" data-testid="adaptive-plan-snapshot">
             <div className="flex flex-wrap items-center justify-between gap-2">
               <div>
                 <p className="text-xs font-bold text-foreground">{copy.adaptive_snapshot_title}</p>
                 <p className="mt-0.5 text-[11px] text-muted-foreground">
                   {recommendation.result.valid
                     ? copy.adaptive_snapshot_ready
                     : copy.adaptive_snapshot_wait}
                 </p>
               </div>
               <Badge variant="outline" className={primaryPlan.side === "buy" ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                 {primaryPlan.side === "buy" ? copy.adaptive_buy : copy.adaptive_sell}
               </Badge>
             </div>
             <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
               <div className="rounded-md bg-background/70 p-2">
                 <p className="text-[10px] text-muted-foreground">{copy.adaptive_entry}</p>
                 <p className="mt-0.5 text-sm font-bold tabular-nums">{formatNumber(primaryPlan.entry, lang, 4)}</p>
               </div>
               <div className="rounded-md bg-background/70 p-2">
                 <p className="text-[10px] text-muted-foreground">{copy.adaptive_snapshot_lot_layers}</p>
                 <p className="mt-0.5 text-sm font-bold tabular-nums">{formatNumber(selected.initialLot, lang)} {copy.adaptive_lot} · {selected.levels} {copy.adaptive_snapshot_layers}</p>
               </div>
               <div className="rounded-md bg-background/70 p-2">
                 <p className="text-[10px] text-muted-foreground">{copy.adaptive_stop}</p>
                 <p className="mt-0.5 text-sm font-bold text-red-600 dark:text-red-400 tabular-nums">{formatNumber(primaryPlan.stopLoss, lang, 4)}</p>
               </div>
               <div className="rounded-md bg-background/70 p-2">
                 <p className="text-[10px] text-muted-foreground">{copy.adaptive_cycle_loss}</p>
                 <p className="mt-0.5 text-sm font-bold tabular-nums">{formatMoney(primaryPlan.estimatedCycleLoss, lang)}</p>
               </div>
               <div className="rounded-md bg-background/70 p-2">
                 <p className="text-[10px] text-muted-foreground">{copy.adaptive_profit_tp1}</p>
                 <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatMoney(primaryPlan.profitToTakeProfit1, lang)}</p>
               </div>
               <div className="rounded-md bg-background/70 p-2">
                 <p className="text-[10px] text-muted-foreground">{copy.adaptive_profit_tp2}</p>
                 <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatMoney(primaryPlan.profitToTakeProfit2, lang)}</p>
               </div>
             </div>
           </div>
         )}
        {recommendation && (
          <div className="rounded-md border border-primary/20 bg-primary/[0.03] p-3 space-y-2.5" data-testid="adaptive-plan-reasoning">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-foreground">{copy.adaptive_reasoning_title}</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {recommendation.decision.posture === "scaling_allowed"
                    ? copy.adaptive_posture_scaling_allowed
                    : recommendation.decision.posture === "entry_only"
                      ? copy.adaptive_posture_entry_only
                      : copy.adaptive_posture_not_recommended}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 text-[10px]">{recommendation.context.timeframe ?? copy.adaptive_context_missing}</Badge>
            </div>
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {[...new Set(recommendation.decision.reasonCodes)].map((code) => (
                <li key={code} className="flex gap-1.5"><span aria-hidden="true">•</span><span>{reasonText(code, recommendation.context, copy)}</span></li>
              ))}
            </ul>
            <div className="border-t border-border/60 pt-2 grid gap-1 text-[10px] text-muted-foreground">
              <p>{copy.adaptive_context_technical.replace("{buy}", String(recommendation.context.technical?.buy ?? "—")).replace("{sell}", String(recommendation.context.technical?.sell ?? "—")).replace("{neutral}", String(recommendation.context.technical?.neutral ?? "—"))}</p>
              <p>{recommendation.context.fundamental.available
                ? copy.adaptive_context_fundamental.replace("{news}", String(recommendation.context.fundamental.newsCount)).replace("{events}", String(recommendation.context.fundamental.eventCount)).replace("{highImpact}", String(recommendation.context.fundamental.highImpactCount))
                : copy.adaptive_context_fundamental_unavailable}</p>
            </div>
          </div>
        )}
        {recommendation && !recommendation.result.valid && <div className="border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-md p-3 space-y-2" data-testid="adaptive-plan-invalid">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" />{copy.adaptive_invalid_title}</p>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">{copy.adaptive_invalid_description}</p>
        </div>}
         {recommendation && !recommendation.result.valid && (recommendation.result.buy || recommendation.result.sell) && (
           <div className="space-y-2" data-testid="adaptive-plan-scenarios-review">
             <p className="text-xs font-bold text-foreground">{copy.adaptive_scenarios_review_title}</p>
             <p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_scenarios_review_help}</p>
             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
               {recommendation.result.buy && <PlanSide plan={recommendation.result.buy} lang={lang} copy={copy} decision={recommendation.decision} />}
               {recommendation.result.sell && <PlanSide plan={recommendation.result.sell} lang={lang} copy={copy} decision={recommendation.decision} />}
             </div>
           </div>
         )}
        {recommendation?.result.valid && (recommendation.result.buy || recommendation.result.sell) && selected && <div className="space-y-3" data-testid="adaptive-plan-valid">
          <Badge className="bg-emerald-600 hover:bg-emerald-600">{copy.adaptive_valid}</Badge>
          <div className="rounded-md border border-primary/20 bg-primary/[0.03] p-3 space-y-1"><p className="text-xs font-bold text-foreground">{copy.adaptive_recommendation_title}</p><p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_recommendation_summary.replace("{lot}", formatNumber(selected.initialLot, lang, 2)).replace("{levels}", String(selected.levels)).replace("{loss}", formatMoney(selected.maximumLoss, lang))}</p></div>
          <div className={`grid grid-cols-1 gap-3 ${recommendation.result.buy && recommendation.result.sell ? "sm:grid-cols-2" : ""}`}>
            {recommendation.result.buy && <PlanSide plan={recommendation.result.buy} lang={lang} copy={copy} decision={recommendation.decision} />}
            {recommendation.result.sell && <PlanSide plan={recommendation.result.sell} lang={lang} copy={copy} decision={recommendation.decision} />}
          </div>
          <div className="space-y-1.5 rounded-md border border-border p-3"><p className="text-xs font-bold text-foreground">{copy.adaptive_how_to_use}</p><ol className="list-decimal pl-5 space-y-1 text-[11px] leading-relaxed text-muted-foreground"><li>{copy.adaptive_step_choose}</li><li>{copy.adaptive_step_entry}</li><li>{copy.adaptive_step_add}</li><li>{copy.adaptive_step_stop}</li></ol></div>
        </div>}
        </>
        )}
      </div>
    </Card>
  );
}