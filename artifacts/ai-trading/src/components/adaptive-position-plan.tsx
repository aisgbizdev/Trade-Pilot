import { useEffect, useState } from "react";
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
  getAdaptiveMarginCapacity,
  getAdaptiveMarketRule,
  getAdaptiveStandardRuleCode,
  type AccountTier,
  type AdaptiveAnalysisContext,
  type AdaptivePlanContext,
  type AdaptivePlanDecision,
  type AdaptivePlanRecommendation,
  type AdaptivePlanReasonCode,
  type AdaptiveRiskPreference,
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

function storageKey(analysisId: number): string {
  return `trade-pilot:adaptive-plan:v6:${analysisId}`;
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
  return typeof value.result.valid === "boolean" &&
    isRecord(fundamental) &&
    typeof fundamental.available === "boolean" &&
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

function suggestedAccountTier(availableMargin: number | null): AccountTier | null {
  if (availableMargin == null || availableMargin <= 0) return null;
  if (availableMargin < 100) return "micro";
  if (availableMargin < 1_000) return "mini";
  return "regular";
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
  level: AdaptiveSidePositionPlan["ladder"][number],
  lang: "en" | "id",
  copy: AdaptiveCopy,
): string {
  if (level.level === 0) return copy.adaptive_stage_initial_reason;
  return copy.adaptive_stage_add_reason
    .replace("{level}", String(level.level))
    .replace("{price}", formatNumber(level.price, lang, 4))
    .replace("{distance}", formatNumber(level.distanceFromEntry, lang, 4))
    .replace("{lot}", formatNumber(level.lot, lang))
    .replace("{risk}", formatMoney(level.riskToStopForLot, lang));
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
        <span className="text-muted-foreground">{copy.adaptive_cycle_loss}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.estimatedCycleLoss, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_margin_required}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.marginRequired, lang)}</span>
      </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground border-t border-border/60 pt-2">{stageGuidance}</p>
      <div className="overflow-x-auto">
          <table className="w-full min-w-[24rem] text-[11px]">
            <thead className="text-muted-foreground border-b border-border/70"><tr><th className="text-left whitespace-nowrap py-1 pr-3 font-medium">{copy.adaptive_level}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_price}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_lot}</th><th className="text-right whitespace-nowrap px-2 py-1 font-medium">{copy.adaptive_cumulative}</th></tr></thead>
          <tbody>{plan.ladder.map((level) => (
            <tr key={`${plan.side}-${level.level}`} className="border-b border-border/40 last:border-0 align-top">
                <td className="py-1.5 pr-3 font-semibold whitespace-nowrap">{level.level === 0 ? copy.adaptive_initial : `L${level.level}`}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatNumber(level.price, lang, 4)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatNumber(level.lot, lang)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{formatNumber(level.cumulativeLots, lang)}</td>
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
      </div>
    </div>
  );
}

export function AdaptivePositionPlan({ analysisId, instrument, tradePlan, context, lang, copy }: Props) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [recommendation, setRecommendation] = useState<AdaptivePlanRecommendation | null>(null);
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
  const marginCapacity = getAdaptiveMarginCapacity(availableMargin, selectedRule);
  const suggestedTier = suggestedAccountTier(availableMargin);
  const fingerprint = createAdaptivePlanFingerprint({
    instrument,
    tradePlan,
    context,
    standardRule: rulesAvailable ? standardRule : null,
  });
  const unsupportedInstrument = !isAdaptiveInstrument;
  const rulesUnavailable = isAdaptiveInstrument && !isRulesLoading && !rulesAvailable;

  useEffect(() => {
    if (isRulesLoading) return;
    setForm(DEFAULT_FORM);
    setRecommendation(null);
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
        localStorage.removeItem(storageKey(analysisId));
        return;
      }
      if (isStoredForm(parsed.form)) setForm({ ...DEFAULT_FORM, ...parsed.form });
      if (isStoredRecommendation(parsed.recommendation)) {
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
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.adaptive_account_title}</h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label={copy.adaptive_account_title}>
            {(["micro", "mini", "regular"] as const).map((accountTier) => {
              const labels = {
                micro: [copy.adaptive_account_micro, copy.adaptive_account_micro_desc],
                mini: [copy.adaptive_account_mini, copy.adaptive_account_mini_desc],
                regular: [copy.adaptive_account_regular, copy.adaptive_account_regular_desc],
              } as const;
              const selectedAccount = form.accountTier === accountTier;
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
                </button>
              );
            })}
          </div>
          {selectedRule && (
            <div className="rounded-md bg-muted/50 p-2.5 text-[11px] leading-relaxed text-muted-foreground" data-testid="adaptive-account-rule">
              <p>{copy.adaptive_account_rule
                .replace("{tier}", copy[`adaptive_account_${form.accountTier}`])
                .replace("{lot}", formatNumber(selectedRule.minimumLot, lang, 2))
                .replace("{amount}", formatMoney(selectedRule.marginAtMinimumLot, lang))}</p>
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
          {suggestedTier && suggestedTier !== form.accountTier && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 p-2.5 text-[11px] text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300" data-testid="adaptive-account-suggestion">
              <p>{copy.adaptive_account_suggestion.replace("{tier}", copy[`adaptive_account_${suggestedTier}`])}</p>
              <Button type="button" size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => updateField("accountTier", suggestedTier)}>
                {copy.adaptive_account_use_suggestion.replace("{tier}", copy[`adaptive_account_${suggestedTier}`])}
              </Button>
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
          <Button type="button" size="sm" onClick={calculate} disabled={!rulesAvailable} data-testid="button-calculate-adaptive-plan"><ShieldCheck className="w-4 h-4 mr-1.5" />{copy.adaptive_calculate}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset} data-testid="button-reset-adaptive-plan">{copy.adaptive_reset}</Button>
        </div>
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