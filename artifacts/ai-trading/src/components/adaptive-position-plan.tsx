import { useEffect, useState } from "react";
import { AlertTriangle, Calculator, ChevronDown, ChevronRight, Info, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnalysisLevelsChart } from "@/components/analysis-levels-chart";
import { useGetStandardTradingRules, type TradePlan } from "@workspace/api-client-react";
import type { Translations } from "@/locales/en";
import {
  buildAdaptivePlanRecommendation,
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
  existingExposure: string;
  preference: AdaptiveRiskPreference;
  maxLossAmount: string;
}

const DEFAULT_FORM: FormState = {
  availableMargin: "",
  existingExposure: "",
  preference: "safe",
  maxLossAmount: "",
};

function storageKey(analysisId: number): string {
  return `trade-pilot:adaptive-plan:v4:${analysisId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredForm(value: unknown): value is Partial<FormState> {
  if (!isRecord(value)) return false;
  return (value.availableMargin === undefined || typeof value.availableMargin === "string") &&
    (value.existingExposure === undefined || typeof value.existingExposure === "string") &&
    (value.maxLossAmount === undefined || typeof value.maxLossAmount === "string") &&
    (value.preference === undefined || ["safe", "balanced", "active", "aggressive", "custom"].includes(String(value.preference)));
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
  return `$${formatNumber(value, lang, maximumFractionDigits)}`;
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
    case "live_market_caution": return "Kondisi pasar live perlu kehati-hatian; gunakan entry awal saja.";
    case "live_scaling_hold": return "Scaling ditahan sampai harga, teknikal, dan fundamental kembali selaras.";
    case "live_plan_invalidated": return "Pemeriksaan live menandai rencana ini tidak lagi valid.";
    case "directional_conflict": return copy.adaptive_reason_directional_conflict;
    case "staged_add_condition": return copy.adaptive_reason_staged_add_condition;
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
        <span className="text-muted-foreground">{copy.adaptive_cycle_loss}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.estimatedCycleLoss, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_margin_required}</span><span className="text-right font-semibold tabular-nums">{formatMoney(plan.marginRequired, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_potential_result}</span><span className="text-right font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatMoney(plan.potentialProfit, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_break_even_rate}</span><span className="text-right font-semibold tabular-nums">{plan.breakEvenWinRate == null ? "—" : `${formatNumber(plan.breakEvenWinRate * 100, lang, 1)}%`}</span>
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground border-t border-border/60 pt-2">{stageGuidance}</p>
      <div className="grid gap-2">
        {plan.ladder.map((level) => (
          <div key={`${plan.side}-${level.level}`} className="rounded-md border border-border/70 bg-background/60 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold">{level.level === 0 ? copy.adaptive_initial : `L${level.level}`}</span>
              <span className="text-xs font-semibold tabular-nums">{formatNumber(level.lot, lang)} {copy.adaptive_lot}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="block text-muted-foreground">{copy.adaptive_price}</span><strong className="block tabular-nums">{formatNumber(level.price, lang, 4)}</strong></div>
              <div><span className="block text-muted-foreground">{copy.adaptive_cumulative}</span><strong className="block tabular-nums">{formatNumber(level.cumulativeLots, lang)} {copy.adaptive_lot}</strong></div>
              <div><span className="block text-muted-foreground">{copy.adaptive_stage_margin}</span><strong className="block tabular-nums">{formatMoney(level.marginRequired, lang)}</strong></div>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{level.level === 0 ? copy.adaptive_stage_initial_reason : copy.adaptive_stage_add_reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdaptivePositionPlan({ analysisId, instrument, tradePlan, context, lang, copy }: Props) {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [recommendation, setRecommendation] = useState<AdaptivePlanRecommendation | null>(null);
  const { data: standardRules, isLoading: rulesLoading, isError: rulesError } = useGetStandardTradingRules({
    query: { queryKey: ["/api/trading-rules/standard"], staleTime: 5 * 60_000 },
  });
  const instrumentCode = instrument.toUpperCase().includes("XAU") || instrument.toUpperCase().includes("GOLD")
    ? "XUL10"
    : instrument.toUpperCase().includes("BRENT") || instrument.toUpperCase().includes("BCO") || instrument.toUpperCase().includes("OIL")
      ? "BCO10_BBJ"
      : null;
  const marginRule = standardRules?.instruments.find((rule) => rule.code === instrumentCode);
  const marginPerLot = marginRule?.initialMarginUsdPerLot ?? null;

  useEffect(() => {
    setForm(DEFAULT_FORM);
    setRecommendation(null);
    try {
      const stored = localStorage.getItem(storageKey(analysisId));
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (!isRecord(parsed)) return;
      if (isStoredForm(parsed.form)) setForm({ ...DEFAULT_FORM, ...parsed.form });
    } catch {
      // A malformed local draft should not block Standard Analysis.
    }
  }, [analysisId]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setRecommendation(null);
  };
  const calculate = () => {
    const next = buildAdaptivePlanRecommendation({
      instrument,
      tradePlan,
      availableMargin: numberValue(form.availableMargin),
      existingExposure: numberValue(form.existingExposure) ?? 0,
      marginPerLot,
      minimumLot: standardRules?.account?.minimumLot,
      maximumLot: standardRules?.account?.maximumLot,
      facilityFeeUsdPerLotPerSide: marginRule?.facilityFeeUsdPerLotPerSide,
      vatPercent: marginRule?.vatPercent,
      preference: form.preference,
      maxLossAmount: form.preference === "custom" ? numberValue(form.maxLossAmount) : null,
      context,
    });
    setRecommendation(next);
    localStorage.setItem(storageKey(analysisId), JSON.stringify({ form }));
  };
  const reset = () => {
    setForm(DEFAULT_FORM);
    setRecommendation(null);
    localStorage.removeItem(storageKey(analysisId));
  };
  const selected = recommendation?.recommendation;

  return (
    <Card className="overflow-hidden" data-testid="card-adaptive-position-plan">
      <button type="button" onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/50 transition-colors" data-testid="button-toggle-adaptive-plan" aria-expanded={open}>
        <span className="flex items-center gap-2 min-w-0">
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          <span className="min-w-0"><span className="block text-sm font-bold text-foreground flex items-center gap-1.5"><Calculator className="w-4 h-4 text-primary" />{copy.adaptive_title}</span><span className="block text-[11px] text-muted-foreground mt-0.5">{copy.adaptive_subtitle}</span></span>
        </span>
      </button>
      {open && <div className="border-t border-border p-4 space-y-4" data-testid="adaptive-plan-content">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md p-3 space-y-1.5">
          <ul className="list-disc space-y-1 pl-4 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            <li>{copy.adaptive_description}</li>
            <li>{copy.adaptive_standard_unchanged}</li>
          </ul>
        </div>
        <div className="space-y-2">
          <label className="block max-w-sm space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground">{copy.adaptive_available_margin}</span>
            <Input type="number" min="0" step="any" value={form.availableMargin} placeholder="0" onChange={(event) => updateField("availableMargin", event.target.value)} className="h-9 text-sm" data-testid="input-adaptive-available-margin" />
            <span className="block text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_available_margin_help}</span>
          </label>
          <label className="block max-w-sm space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground">{copy.adaptive_existing_exposure}</span>
            <Input type="number" min="0" step="0.01" value={form.existingExposure} placeholder="0" onChange={(event) => updateField("existingExposure", event.target.value)} className="h-9 text-sm" data-testid="input-adaptive-existing-exposure" />
            <span className="block text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_existing_exposure_help}</span>
          </label>
          {rulesLoading && <p className="text-[11px] text-muted-foreground">{copy.adaptive_rules_loading}</p>}
          {rulesError || (!rulesLoading && !marginRule) ? <p className="text-[11px] text-amber-700 dark:text-amber-300">{copy.adaptive_rules_error}</p> : null}
          {marginRule && <p className="text-[11px] text-muted-foreground">{copy.adaptive_margin_rule.replace("{amount}", formatMoney(marginPerLot, lang)).replace("{instrument}", marginRule.product)}</p>}
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.adaptive_preference_title}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={copy.adaptive_preference_title}>
            {(["safe", "balanced", "aggressive", "custom"] as const).map((preference) => {
              const labels = {
                safe: [copy.adaptive_preference_safe, copy.adaptive_preference_safe_desc],
                balanced: [copy.adaptive_preference_balanced, copy.adaptive_preference_balanced_desc],
                aggressive: [copy.adaptive_preference_aggressive, copy.adaptive_preference_aggressive_desc],
                custom: [copy.adaptive_preference_custom, copy.adaptive_preference_custom_desc],
              } as const;
              const selectedPreference = form.preference === preference;
              return <button key={preference} type="button" role="radio" aria-checked={selectedPreference} onClick={() => updateField("preference", preference)} className={`rounded-md border p-3 text-left transition-colors ${selectedPreference ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-muted/50"}`} data-testid={`button-adaptive-preference-${preference}`}>
                <span className="block text-xs font-bold text-foreground">{labels[preference][0]}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{labels[preference][1]}</span>
              </button>;
            })}
          </div>
          {form.preference === "custom" && (
            <label className="block max-w-sm space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground">{copy.adaptive_max_loss}</span>
              <Input type="number" min="0.01" step="any" value={form.maxLossAmount} placeholder="0" onChange={(event) => updateField("maxLossAmount", event.target.value)} className="h-9 text-sm" data-testid="input-adaptive-max-loss" />
              <span className="block text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_max_loss_help}</span>
            </label>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={calculate} disabled={rulesLoading || rulesError || !marginRule} data-testid="button-calculate-adaptive-plan"><ShieldCheck className="w-4 h-4 mr-1.5" />{copy.adaptive_calculate}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset} data-testid="button-reset-adaptive-plan">{copy.adaptive_reset}</Button>
        </div>
        {!recommendation && <p className="text-[11px] text-muted-foreground flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />{copy.adaptive_ready}</p>}
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
          {recommendation.result.errors.length > 0 && <ul className="list-disc space-y-0.5 pl-4 text-[10px] leading-relaxed text-amber-800 dark:text-amber-300">{recommendation.result.errors.map((error) => <li key={error}>{error}</li>)}</ul>}
        </div>}
        {recommendation?.result.valid && (recommendation.result.buy || recommendation.result.sell) && selected && <div className="space-y-3" data-testid="adaptive-plan-valid">
          <Badge className="bg-emerald-600 hover:bg-emerald-600">{copy.adaptive_valid}</Badge>
          <div className="rounded-md border border-primary/20 bg-primary/[0.03] p-3 space-y-1"><p className="text-xs font-bold text-foreground">{copy.adaptive_recommendation_title}</p><p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_recommendation_summary.replace("{lot}", formatNumber(selected.initialLot, lang, 2)).replace("{levels}", String(selected.levels)).replace("{loss}", formatMoney(selected.maximumLoss, lang))}</p></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" data-testid="adaptive-plan-metrics">
            {[
              [copy.adaptive_margin_available, formatMoney(numberValue(form.availableMargin), lang)],
              [copy.adaptive_existing_exposure, `${formatNumber(numberValue(form.existingExposure) ?? 0, lang, 2)} ${copy.adaptive_lot}`],
              [copy.adaptive_margin_allocated, formatMoney(recommendation.result.marginAllocated, lang)],
              [copy.adaptive_margin_buffer, formatMoney(recommendation.result.marginBuffer, lang)],
              [copy.adaptive_maximum_loss, formatMoney(recommendation.result.maximumLoss, lang)],
              [copy.adaptive_potential_result, formatMoney(selected.potentialResult, lang)],
              [copy.adaptive_break_even_rate, selected.breakEvenWinRate == null ? "—" : `${formatNumber(selected.breakEvenWinRate * 100, lang, 1)}%`],
              [copy.adaptive_confidence, `${formatNumber(recommendation.context.confidenceMin, lang, 0)}–${formatNumber(recommendation.context.confidenceMax, lang, 0)}%`],
            ].map(([label, value]) => <div key={label} className="rounded-md border border-border/70 bg-background/60 p-2"><span className="block text-[10px] text-muted-foreground">{label}</span><strong className="block text-xs tabular-nums">{value}</strong></div>)}
          </div>
          <div className="rounded-md border border-border/70 p-2" data-testid="adaptive-plan-chart">
            <p className="mb-1.5 text-[11px] font-semibold text-foreground">{copy.adaptive_chart_title}</p>
            <AnalysisLevelsChart instrument={instrument} timeframe={context.timeframe ?? "1h"} tradePlan={tradePlan} adaptivePlan={recommendation.result} height={220} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{recommendation.result.buy && <PlanSide plan={recommendation.result.buy} lang={lang} copy={copy} decision={recommendation.decision} />}{recommendation.result.sell && <PlanSide plan={recommendation.result.sell} lang={lang} copy={copy} decision={recommendation.decision} />}</div>
          <div className="space-y-1.5 rounded-md border border-border p-3"><p className="text-xs font-bold text-foreground">{copy.adaptive_how_to_use}</p><ol className="list-decimal pl-5 space-y-1 text-[11px] leading-relaxed text-muted-foreground"><li>{copy.adaptive_step_choose}</li><li>{copy.adaptive_step_entry}</li><li>{copy.adaptive_step_add}</li><li>{copy.adaptive_step_stop}</li></ol></div>
          <div className="flex items-start gap-2 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3"><AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" /><p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">{copy.adaptive_external_liquidation} {copy.adaptive_fee_included} {copy.adaptive_manual_only}</p></div>
        </div>}
      </div>}
    </Card>
  );
}