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
  isXauUsdMiniAdaptiveInstrument,
  isAdaptiveLotProfile,
  isAdaptiveRiskStyle,
  type AdaptiveAnalysisContext,
  type AdaptiveLadderLevel,
  type AdaptiveLotProfile,
  type AdaptiveLayerRejectReason,
  type AdaptivePlanContext,
  type AdaptivePlanDecision,
  type AdaptivePlanRecommendation,
  type AdaptivePlanReasonCode,
  type AdaptiveChartCandle,
  type AdaptiveSidePositionPlan,
  type AdaptiveRiskStyle,
  type AccountTier,
} from "@/lib/adaptive-position-plan";

type AdaptiveCopy = Translations["analysis_detail"];
type AdaptiveRecommendationSummary = NonNullable<AdaptivePlanRecommendation["recommendation"]>;

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
  maximumLoss: string;
  existingExposure: string;
  accountTier: AccountTier;
  riskStyle: AdaptiveRiskStyle;
}

const DEFAULT_FORM: FormState = {
  availableMargin: "",
  maximumLoss: "",
  existingExposure: "0",
  accountTier: "mini",
  riskStyle: "conservative",
};

function storageKey(analysisId: number): string {
  return `trade-pilot:adaptive-plan:v16:${analysisId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredForm(value: unknown): value is Partial<FormState> {
  if (!isRecord(value)) return false;
  return (value.availableMargin === undefined || typeof value.availableMargin === "string") &&
    (value.maximumLoss === undefined || typeof value.maximumLoss === "string") &&
    (value.existingExposure === undefined || typeof value.existingExposure === "string") &&
    (value.accountTier === undefined || value.accountTier === "micro" || value.accountTier === "mini" || value.accountTier === "regular") &&
    (value.riskStyle === undefined || isAdaptiveRiskStyle(value.riskStyle));
}

function accountTierLabel(tier: AccountTier, copy: AdaptiveCopy): string {
  return tier === "micro"
    ? copy.adaptive_account_micro
    : tier === "mini"
      ? copy.adaptive_account_mini
      : copy.adaptive_account_regular;
}

function isStoredRecommendation(value: unknown): value is AdaptivePlanRecommendation {
  if (!isRecord(value) || !isRecord(value.result) || !isRecord(value.context) || !isRecord(value.decision)) return false;
  const fundamental = value.context.fundamental;
  const rule = value.result.rule;
  return typeof value.result.valid === "boolean" &&
    isRecord(fundamental) &&
    typeof fundamental.available === "boolean" &&
    (value.recommendation === null ||
      (isRecord(value.recommendation) &&
        typeof value.recommendation.positions === "number" &&
        value.recommendation.positions >= 1 &&
        value.recommendation.positions <= 3 &&
        isAdaptiveRiskStyle(value.recommendation.riskStyle) &&
        isAdaptiveLotProfile(value.recommendation.lotProfile))) &&
    (!value.result.valid || (isRecord(rule) && rule.marginBasis === "day")) &&
    (value.decision.posture === "scaling_allowed" || value.decision.posture === "entry_only" || value.decision.posture === "not_recommended") &&
    (value.decision.preferredSide === "buy" || value.decision.preferredSide === "sell" || value.decision.preferredSide === "both" || value.decision.preferredSide === "none") &&
    Array.isArray(value.decision.reasonCodes) &&
    value.decision.reasonCodes.every((code) => typeof code === "string");
}

function riskStyleLabel(style: AdaptiveRiskStyle, copy: AdaptiveCopy): string {
  return style === "conservative"
    ? copy.adaptive_risk_style_conservative
    : style === "balanced"
      ? copy.adaptive_risk_style_balanced
      : copy.adaptive_risk_style_aggressive;
}

function lotProfileLabel(profile: AdaptiveLotProfile, copy: AdaptiveCopy): string {
  return profile === "decreasing"
    ? copy.adaptive_lot_profile_decreasing
    : profile === "mixed"
      ? copy.adaptive_lot_profile_mixed
      : copy.adaptive_lot_profile_increasing;
}

function normalizeStoredRecommendation(
  recommendation: AdaptivePlanRecommendation,
): AdaptivePlanRecommendation {
  return recommendation;
}

function preferredAvailableSide(recommendation: AdaptivePlanRecommendation): "buy" | "sell" {
  if (recommendation.decision.preferredSide === "sell" && recommendation.result.sell) return "sell";
  if (recommendation.decision.preferredSide === "buy" && recommendation.result.buy) return "buy";
  return recommendation.result.buy ? "buy" : "sell";
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

function formatProfit(value: number | null | undefined, lang: "en" | "id"): string {
  const formatted = formatMoney(value, lang);
  return formatted === "—" ? formatted : `+${formatted}`;
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
    .replace("{level}", String(level.level + 1))
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

function LayerFinancialBreakdown({
  level,
  side,
  lang,
  copy,
  rejected = false,
}: {
  level: AdaptiveLadderLevel;
  side: "buy" | "sell";
  lang: "en" | "id";
  copy: AdaptiveCopy;
  rejected?: boolean;
}) {
  const exceedsFunds = level.remainingFundsAtStop != null && level.remainingFundsAtStop < 0;
  const remainingFunds = level.remainingFundsAtStop == null
    ? null
    : Math.max(0, level.remainingFundsAtStop);
  const breakdownClass = rejected
    ? "border-amber-200/80 bg-amber-100/40 dark:border-amber-900 dark:bg-amber-950/20"
    : "border-border/60 bg-muted/30";

  return (
    <div
      className={`mt-2 rounded border p-2 ${breakdownClass}`}
      data-testid={`${rejected ? "adaptive-rejected" : "adaptive"}-layer-financial-${side}-${level.level}`}
    >
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
        <dt className="text-muted-foreground">{copy.adaptive_layer_margin}</dt>
        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.dayMarginForLot, lang)}</dd>
        <dt className="text-muted-foreground">{copy.adaptive_layer_cumulative_margin}</dt>
        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.cumulativeDayMargin, lang)}</dd>
        <dt className="text-muted-foreground">{copy.adaptive_layer_risk}</dt>
        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.riskToStopForLot, lang)}</dd>
        <dt className="text-muted-foreground">{copy.adaptive_layer_cumulative_risk}</dt>
        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.estimatedRiskToStop, lang)}</dd>
        <dt className="text-muted-foreground">{copy.adaptive_layer_funds_at_stop}</dt>
        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.cumulativeFundsAtStop, lang)}</dd>
        <dt className="text-muted-foreground">{copy.adaptive_layer_remaining_funds}</dt>
        <dd className={`text-right font-semibold tabular-nums ${exceedsFunds ? "text-amber-700 dark:text-amber-400" : ""}`}>
          {exceedsFunds ? copy.adaptive_layer_exceeds_funds : formatMoney(remainingFunds, lang)}
        </dd>
        {level.cumulativeProfitToTakeProfit1 != null && (
          <>
            <dt className="text-muted-foreground">{copy.adaptive_layer_cumulative_profit_tp1}</dt>
            <dd className="text-right font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {formatProfit(level.cumulativeProfitToTakeProfit1, lang)}
            </dd>
          </>
        )}
        {level.cumulativeProfitToTakeProfit2 != null && (
          <>
            <dt className="text-muted-foreground">{copy.adaptive_layer_cumulative_profit_tp2}</dt>
            <dd className="text-right font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {formatProfit(level.cumulativeProfitToTakeProfit2, lang)}
            </dd>
          </>
        )}
      </dl>
      {exceedsFunds && (
        <p className="mt-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
          {copy.adaptive_layer_shortfall.replace("{amount}", formatMoney(Math.abs(level.remainingFundsAtStop!), lang))}
        </p>
      )}
    </div>
  );
}

function DirectionSwitch({
  activeSide,
  hasBuy,
  hasSell,
  copy,
  onChange,
}: {
  activeSide: "buy" | "sell";
  hasBuy: boolean;
  hasSell: boolean;
  copy: AdaptiveCopy;
  onChange: (side: "buy" | "sell") => void;
}) {
  return (
    <div className="space-y-1.5" data-testid="adaptive-direction-tabs">
      <div>
        <p className="text-xs font-bold text-foreground">{copy.adaptive_direction_title}</p>
        <p className="text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_direction_help}</p>
      </div>
      <div className="inline-flex max-w-full rounded-md bg-muted p-1" role="group" aria-label={copy.adaptive_direction_title}>
        {([
          ["buy", hasBuy, copy.adaptive_buy, TrendingUp],
          ["sell", hasSell, copy.adaptive_sell, TrendingDown],
        ] as const).map(([side, available, label, Icon]) => (
          <button
            key={side}
            type="button"
            aria-pressed={activeSide === side}
            disabled={!available}
            onClick={() => onChange(side)}
            className={`inline-flex min-w-0 items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              activeSide === side
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            } disabled:cursor-not-allowed disabled:opacity-40`}
            data-testid={`adaptive-direction-${side}`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
      {(!hasBuy || !hasSell) && (
        <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-400" data-testid="adaptive-direction-unavailable">
          {copy.adaptive_direction_unavailable.replace(
            "{side}",
            !hasBuy ? copy.adaptive_buy : copy.adaptive_sell,
          )}
        </p>
      )}
    </div>
  );
}

function PlanSide({
  plan,
  lang,
  copy,
  decision,
  summary,
}: {
  plan: AdaptiveSidePositionPlan;
  lang: "en" | "id";
  copy: AdaptiveCopy;
  decision: AdaptivePlanDecision;
  summary?: AdaptiveRecommendationSummary | null;
}) {
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
        <Badge variant="outline" className="text-[10px]">
          {plan.ladder.length} {copy.adaptive_snapshot_layers} · {formatNumber(plan.totalLots, lang)} {copy.adaptive_lot}
        </Badge>
      </div>
      {summary && (
        <div className="rounded-md border border-primary/30 bg-primary/[0.05] p-3 space-y-3" data-testid="adaptive-plan-snapshot">
          <div>
            <p className="text-xs font-bold text-foreground">{copy.adaptive_snapshot_title}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {copy.adaptive_snapshot_ready}
            </p>
            <Badge variant="outline" className="mt-2 text-[10px]" data-testid="adaptive-risk-style-active">
              {copy.adaptive_risk_style_active.replace("{style}", riskStyleLabel(summary.riskStyle, copy))}
            </Badge>
            <Badge variant="outline" className="ml-1 mt-2 text-[10px]" data-testid="adaptive-lot-profile-active">
              {copy.adaptive_lot_profile_active.replace("{profile}", lotProfileLabel(summary.lotProfile, copy))}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-md bg-background/70 p-2">
              <p className="text-[10px] text-muted-foreground">{copy.adaptive_entry}</p>
              <p className="mt-0.5 text-sm font-bold tabular-nums">{formatNumber(plan.entry, lang, 4)}</p>
            </div>
            <div className="rounded-md bg-background/70 p-2">
              <p className="text-[10px] text-muted-foreground">{copy.adaptive_snapshot_total_positions}</p>
              <p className="mt-0.5 text-sm font-bold tabular-nums">{summary.positions} {copy.adaptive_snapshot_layers}</p>
            </div>
            <div className="rounded-md bg-background/70 p-2">
              <p className="text-[10px] text-muted-foreground">{copy.adaptive_snapshot_total_lots}</p>
              <p className="mt-0.5 text-sm font-bold tabular-nums">{formatNumber(plan.totalLots, lang)} {copy.adaptive_lot}</p>
            </div>
            <div className="rounded-md bg-background/70 p-2">
              <p className="text-[10px] text-muted-foreground">{copy.adaptive_final_stop}</p>
              <p className="mt-0.5 text-sm font-bold text-red-600 dark:text-red-400 tabular-nums">{formatNumber(plan.stopLoss, lang, 4)}</p>
            </div>
            <div className="rounded-md bg-background/70 p-2">
              <p className="text-[10px] text-muted-foreground">{copy.adaptive_cycle_loss}</p>
              <p className="mt-0.5 text-sm font-bold tabular-nums">{formatMoney(plan.estimatedCycleLoss, lang)}</p>
            </div>
            <div className="rounded-md bg-background/70 p-2">
              <p className="text-[10px] text-muted-foreground">{copy.adaptive_loss_limit}</p>
              <p className="mt-0.5 text-sm font-bold tabular-nums">{formatMoney(summary.maximumLoss, lang)}</p>
            </div>
            {plan.takeProfit1 != null && (
              <div className="rounded-md bg-background/70 p-2" data-testid={`adaptive-take-profit-${plan.side}-1`}>
                <p className="text-[10px] text-muted-foreground">{copy.trade_plan_tp1}</p>
                <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatNumber(plan.takeProfit1, lang, 4)}</p>
                <p className="mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums" data-testid={`adaptive-tp-profit-${plan.side}-1`}>
                  {copy.adaptive_tp_profit}: {formatProfit(plan.profitToTakeProfit1, lang)}
                </p>
              </div>
            )}
            {plan.takeProfit2 != null && (
              <div className="rounded-md bg-background/70 p-2" data-testid={`adaptive-take-profit-${plan.side}-2`}>
                <p className="text-[10px] text-muted-foreground">{copy.trade_plan_tp2}</p>
                <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatNumber(plan.takeProfit2, lang, 4)}</p>
                <p className="mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums" data-testid={`adaptive-tp-profit-${plan.side}-2`}>
                  {copy.adaptive_tp_profit}: {formatProfit(plan.profitToTakeProfit2, lang)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <p className="text-[11px] leading-relaxed text-muted-foreground border-t border-border/60 pt-2">{stageGuidance}</p>
      <div className="space-y-2" data-testid={`adaptive-ladder-${plan.side}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{copy.adaptive_layer_plan_title}</p>
          <span className="text-[10px] font-semibold text-foreground">
            {plan.ladder.length} {copy.adaptive_snapshot_layers} · {formatNumber(plan.totalLots, lang)} {copy.adaptive_lot}
          </span>
        </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_layer_financial_help}</p>
        <ol className="space-y-1.5">
          {plan.ladder.map((level) => (
            <li key={`${plan.side}-${level.level}`} className="rounded-md bg-background/70 px-2.5 py-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-[11px] font-semibold text-foreground">
                  {copy.adaptive_position} {level.level + 1}
                  {level.level === 0 ? ` · ${copy.adaptive_initial}` : ""}
                </span>
                <span className="text-[11px] font-bold tabular-nums text-foreground">
                  {formatNumber(level.price, lang, 4)} · {formatNumber(level.lot, lang)} {copy.adaptive_lot}
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                {level.level === 0
                  ? copy.adaptive_stage_initial_reason
                  : `${copy.adaptive_layer_checkpoint} ${stageReason(level, lang, copy)}`}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                <span>{copy.adaptive_cumulative}: {formatNumber(level.cumulativeLots, lang)} {copy.adaptive_lot}</span>
                <span>{copy.adaptive_stop_risk}: {formatMoney(level.estimatedRiskToStop, lang)}</span>
              </div>
                <LayerFinancialBreakdown level={level} side={plan.side} lang={lang} copy={copy} />
            </li>
          ))}
        </ol>
        {plan.rejectedLadder.length > 0 && (
          <details className="border-t border-amber-300/60 pt-2 dark:border-amber-900" data-testid={`adaptive-rejected-${plan.side}`}>
            <summary className="cursor-pointer text-[10px] font-semibold text-amber-700 dark:text-amber-400">{copy.adaptive_rejected_title}</summary>
            <div className="mt-2 space-y-2">
              <p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_rejected_help}</p>
              {plan.rejectedLadder.map((level) => (
                <div key={`${plan.side}-rejected-${level.level}`} className="rounded-md border border-dashed border-amber-300 bg-amber-50/60 px-2.5 py-2 text-[11px] dark:border-amber-900 dark:bg-amber-950/20">
                  <div className="flex flex-wrap justify-between gap-2 font-semibold">
                    <span>{copy.adaptive_level} {level.level} · {formatNumber(level.price, lang, 4)} · {formatNumber(level.lot, lang)} {copy.adaptive_lot}</span>
                    <span className="text-amber-700 dark:text-amber-400">{copy.adaptive_rejected_badge}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{rejectedReason(level.rejectReason, copy)}</p>
                  {level.financialAlternative && (
                    <div
                      className="mt-2 rounded border border-primary/25 bg-primary/[0.04] p-2"
                      data-testid={`adaptive-conditional-${plan.side}-${level.level}`}
                    >
                      <p className="text-[10px] font-semibold text-foreground">{copy.adaptive_conditional_title}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_conditional_help}</p>
                      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                        <dt className="text-muted-foreground">{copy.adaptive_conditional_additional_funds}</dt>
                        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.financialAlternative.additionalFundsRequired, lang)}</dd>
                        <dt className="text-muted-foreground">{copy.adaptive_conditional_additional_loss}</dt>
                        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.financialAlternative.additionalLossBudgetRequired, lang)}</dd>
                        <dt className="text-muted-foreground">{copy.adaptive_conditional_total_risk}</dt>
                        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.estimatedRiskToStop, lang)}</dd>
                        <dt className="text-muted-foreground">{copy.adaptive_conditional_total_funds}</dt>
                        <dd className="text-right font-semibold tabular-nums">{formatMoney(level.cumulativeFundsAtStop, lang)}</dd>
                      </dl>
                      <p className="mt-1 text-[10px] font-medium text-primary">{copy.adaptive_conditional_manual}</p>
                    </div>
                  )}
                    <LayerFinancialBreakdown level={level} side={plan.side} lang={lang} copy={copy} rejected />
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
      <details className="border-t border-border/60 pt-2">
        <summary className="cursor-pointer text-[10px] font-semibold text-muted-foreground">{copy.adaptive_more_calculation_details}</summary>
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <dt className="text-muted-foreground">{copy.adaptive_weighted_entry}</dt><dd className="text-right font-semibold tabular-nums">{formatNumber(plan.weightedAverageEntry, lang, 4)}</dd>
          <dt className="text-muted-foreground">{copy.adaptive_margin_required}</dt><dd className="text-right font-semibold tabular-nums">{formatMoney(plan.marginRequired, lang)}</dd>
          <dt className="text-muted-foreground">{copy.adaptive_funds_at_stop}</dt><dd className="text-right font-semibold tabular-nums">{formatMoney(plan.totalFundsAtStop, lang)}</dd>
        </dl>
      </details>
    </div>
  );
}

export function AdaptivePositionPlan(props: Props) {
  if (!isXauUsdMiniAdaptiveInstrument(props.instrument)) return null;
  return <AdaptivePositionPlanContent {...props} />;
}

function AdaptivePositionPlanContent({ analysisId, instrument, tradePlan, context, lang, copy }: Props) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [recommendation, setRecommendation] = useState<AdaptivePlanRecommendation | null>(null);
  const [activeSide, setActiveSide] = useState<"buy" | "sell">("buy");
  const restoredStateKeyRef = useRef<string | null>(null);
  useEffect(() => {
    restoredStateKeyRef.current = null;
    setForm(DEFAULT_FORM);
    setRecommendation(null);
    setActiveSide("buy");
  }, [analysisId]);
  const [chartCandidateState, setChartCandidateState] = useState<{
    status: "loading" | "ready" | "error";
    prices: { buy: number[]; sell: number[] };
  }>({ status: "loading", prices: { buy: [], sell: [] } });
  const { data: standardRules, isLoading: isRulesLoading, isError: isRulesError } = useGetStandardTradingRules({
    query: { queryKey: ["/api/trading-rules/standard"], staleTime: 5 * 60_000 },
  });
  const standardRuleCode = getAdaptiveStandardRuleCode(instrument);
  const standardRule = standardRules?.instruments.find((rule) => rule.code === standardRuleCode) ?? null;
  const rulesAvailable = !isRulesLoading && !isRulesError && standardRule !== null;
  const availableMargin = numberValue(form.availableMargin);
  const maximumLoss = numberValue(form.maximumLoss);
  const existingExposure = numberValue(form.existingExposure);
  const selectedRule = rulesAvailable
    ? getAdaptiveMarketRule(instrument, standardRule, form.accountTier)
    : null;
  useEffect(() => {
    if (isRulesLoading) return;
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
  }, [context.timeframe, instrument, isRulesLoading, rulesAvailable, selectedRule?.minMovement, tradePlan]);
  const marginCapacity = getAdaptiveMarginCapacity(availableMargin, selectedRule);
  const fingerprint = createAdaptivePlanFingerprint({
    instrument,
    tradePlan,
    context,
    standardRule: rulesAvailable ? standardRule : null,
    checkpointPrices: chartCandidateState.prices,
    accountTier: form.accountTier,
    riskStyle: form.riskStyle,
  });
  const rulesUnavailable = !isRulesLoading && !rulesAvailable;

  useEffect(() => {
    if (isRulesLoading || chartCandidateState.status === "loading") return;
    const restoreKey = `${analysisId}:${rulesAvailable ? "ready" : "unavailable"}`;
    const shouldRestore = restoredStateKeyRef.current !== restoreKey;
    if (shouldRestore) {
      restoredStateKeyRef.current = restoreKey;
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
      const parsedForm = isStoredForm(parsed.form) ? parsed.form : null;
      const storedFingerprint = parsedForm
        ? createAdaptivePlanFingerprint({
            instrument,
            tradePlan,
            context,
            standardRule: rulesAvailable ? standardRule : null,
            checkpointPrices: chartCandidateState.prices,
             accountTier: parsedForm.accountTier ?? "mini",
            riskStyle: parsedForm.riskStyle ?? "conservative",
          })
        : fingerprint;
      if (parsed.fingerprint !== storedFingerprint) {
        setRecommendation(null);
        localStorage.removeItem(storageKey(analysisId));
        return;
      }
      if (shouldRestore && parsedForm) setForm({ ...DEFAULT_FORM, ...parsedForm });
      if (shouldRestore && isStoredRecommendation(parsed.recommendation)) {
        const restored = normalizeStoredRecommendation(parsed.recommendation);
        setRecommendation(restored);
        setActiveSide(preferredAvailableSide(restored));
      }
    } catch {
      // A malformed local draft should not block Standard Analysis.
    }
  }, [analysisId, chartCandidateState.status, fingerprint, isRulesLoading, rulesAvailable]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setRecommendation(null);
    if (field === "accountTier") localStorage.removeItem(storageKey(analysisId));
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
      maximumLoss,
      existingExposure,
      standardRule,
      context,
      checkpointPrices: chartCandidateState.prices,
      accountTier: form.accountTier,
      riskStyle: form.riskStyle,
    });
    setRecommendation(next);
    setActiveSide(preferredAvailableSide(next));
    localStorage.setItem(storageKey(analysisId), JSON.stringify({ fingerprint, form, recommendation: next }));
  };
  const reset = () => {
    setForm(DEFAULT_FORM);
    setRecommendation(null);
    setActiveSide("buy");
    localStorage.removeItem(storageKey(analysisId));
  };
  const selected = recommendation?.recommendation;
  const primaryPlan = recommendation
    ? recommendation.result[activeSide] ??
      recommendation.result.buy ??
      recommendation.result.sell ??
      null
    : null;

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
        <p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_ready}</p>
        <details className="rounded-md border border-border/70 bg-muted/20 px-3 py-2" data-testid="adaptive-plan-method">
          <summary className="cursor-pointer text-xs font-semibold text-foreground">{copy.adaptive_method_summary}</summary>
          <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_method_help}</p>
          <div className="mt-2 space-y-1.5 rounded-md border border-primary/20 bg-primary/[0.03] p-2.5 text-[11px] leading-relaxed text-muted-foreground" data-testid="adaptive-analysis-basis">
            <p className="font-semibold text-foreground">{copy.adaptive_analysis_basis_title}</p>
            <p>{copy.adaptive_analysis_basis}</p>
            <p>{copy.adaptive_chart_confirmation}</p>
            <p className="font-medium text-foreground" data-testid="adaptive-chart-candidate-status">
              {chartCandidateState.status === "loading"
                ? copy.adaptive_chart_candidates_loading
                : chartCandidateState.status === "error"
                  ? copy.adaptive_chart_candidates_unavailable
                  : copy.adaptive_chart_candidates_ready
                      .replace("{buy}", String(chartCandidateState.prices.buy.length))
                      .replace("{sell}", String(chartCandidateState.prices.sell.length))}
            </p>
          </div>
          <p className="mt-2 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-2 text-[10px] leading-relaxed text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300" data-testid="adaptive-disclaimer">{copy.adaptive_disclaimer}</p>
          <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_day_trade_only}</p>
        </details>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.adaptive_account_title}</h4>
          <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label={copy.adaptive_account_title} data-testid="adaptive-account-selector">
            {([
              ["micro", copy.adaptive_account_micro, copy.adaptive_account_micro_desc],
              ["mini", copy.adaptive_account_mini, copy.adaptive_account_mini_desc],
              ["regular", copy.adaptive_account_regular, copy.adaptive_account_regular_desc],
            ] as const).map(([tier, label, description]) => (
              <button
                key={tier}
                type="button"
                aria-pressed={form.accountTier === tier}
                onClick={() => updateField("accountTier", tier)}
                className={`rounded-md border px-2.5 py-2 text-left transition-colors ${
                  form.accountTier === tier
                    ? "border-primary bg-primary/[0.08] text-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
                data-testid={`button-adaptive-account-${tier}`}
              >
                <span className="block text-[11px] font-semibold">{label}</span>
                <span className="mt-0.5 block text-[10px] leading-relaxed">{description}</span>
              </button>
            ))}
          </div>
          {selectedRule && (
            <div className="rounded-md border border-primary/20 bg-primary/[0.03] p-3 text-[11px] leading-relaxed text-muted-foreground" data-testid="adaptive-account-rule">
              <p className="mb-1 font-bold text-foreground">{copy.adaptive_fixed_scope}</p>
              <p>{copy.adaptive_account_rule
                .replace("{tier}", accountTierLabel(form.accountTier, copy))
                .replace("{lot}", formatNumber(selectedRule.minimumLot, lang, 2))
                .replace("{maximum}", formatNumber(selectedRule.maximumLot, lang, 2))
                .replace("{amount}", formatMoney(selectedRule.marginAtMinimumLot, lang))
                .replace("{size}", formatNumber(selectedRule.contractSize, lang, 2))
                .replace("{unit}", standardRule?.contractUnit ?? "")}</p>
              {selectedRule.minimumOpeningFunds != null && (
                <p className="mt-1">{copy.adaptive_account_opening_minimum.replace("{amount}", formatMoney(selectedRule.minimumOpeningFunds, lang))}</p>
              )}
            </div>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{copy.adaptive_available_margin}</span>
            <span className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span>
              <Input type="number" min="0" step="any" value={form.availableMargin} placeholder="0" onChange={(event) => updateField("availableMargin", event.target.value)} className="h-9 pl-7 text-sm" data-testid="input-adaptive-available-margin" />
            </span>
            <span className="block text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_available_margin_help}</span>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{copy.adaptive_maximum_loss}</span>
            <span className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span>
              <Input type="number" min="0" step="any" value={form.maximumLoss} placeholder="0" onChange={(event) => updateField("maximumLoss", event.target.value)} className="h-9 pl-7 text-sm" data-testid="input-adaptive-maximum-loss" />
            </span>
            <span className="block text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_maximum_loss_help}</span>
          </label>
        </div>
        <div className="space-y-2" data-testid="adaptive-risk-style-selector">
          <div>
            <p className="text-xs font-medium text-foreground">{copy.adaptive_risk_style_title}</p>
            <p className="text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_risk_style_help}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label={copy.adaptive_risk_style_title}>
            {([
              ["conservative", copy.adaptive_risk_style_conservative, copy.adaptive_risk_style_conservative_desc],
              ["balanced", copy.adaptive_risk_style_balanced, copy.adaptive_risk_style_balanced_desc],
              ["aggressive", copy.adaptive_risk_style_aggressive, copy.adaptive_risk_style_aggressive_desc],
            ] as const).map(([style, label, description]) => (
              <button
                key={style}
                type="button"
                aria-pressed={form.riskStyle === style}
                onClick={() => updateField("riskStyle", style)}
                className={`rounded-md border px-2.5 py-2 text-left transition-colors ${
                  form.riskStyle === style
                    ? "border-primary bg-primary/[0.08] text-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
                data-testid={`button-adaptive-risk-style-${style}`}
              >
                <span className="block text-[11px] font-semibold">{label}</span>
                <span className="mt-0.5 block text-[10px] leading-relaxed">
                  {description.replace("{maximum}", formatNumber(selectedRule?.maximumLot, lang, 2))}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="block rounded-md border border-sky-200 bg-sky-50 px-2.5 py-2 text-[10px] leading-relaxed text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300" data-testid="adaptive-daytrade-only">{copy.adaptive_day_trade_only}</span>
          {isRulesLoading && <p className="text-[11px] text-muted-foreground" data-testid="adaptive-plan-rules-loading">{copy.adaptive_rules_loading}</p>}
          {selectedRule && availableMargin != null && availableMargin > 0 && (
            <div className="rounded-md border border-border p-2.5 text-[11px] leading-relaxed" data-testid="adaptive-margin-capacity">
              <p className="font-semibold text-foreground">{copy.adaptive_capacity_title}</p>
              <p className="mt-0.5 text-muted-foreground">
                {marginCapacity > 0
                  ? copy.adaptive_capacity_value.replace("{lot}", formatNumber(marginCapacity, lang, 2))
                   : copy.adaptive_capacity_none.replace("{tier}", accountTierLabel(form.accountTier, copy))}
              </p>
            </div>
          )}
          {rulesUnavailable && <div className="rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300" data-testid="adaptive-plan-rules-unavailable">{copy.adaptive_rules_error}</div>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={calculate} disabled={!rulesAvailable || chartCandidateState.status === "loading"} data-testid="button-calculate-adaptive-plan"><ShieldCheck className="w-4 h-4 mr-1.5" />{copy.adaptive_calculate}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset} data-testid="button-reset-adaptive-plan">{copy.adaptive_reset}</Button>
        </div>
        {recommendation && primaryPlan && (
          <DirectionSwitch
            activeSide={primaryPlan.side}
            hasBuy={recommendation.result.buy !== null}
            hasSell={recommendation.result.sell !== null}
            copy={copy}
            onChange={setActiveSide}
          />
        )}
        {recommendation && (
          <details className="rounded-md border border-primary/20 bg-primary/[0.03] p-3" data-testid="adaptive-plan-reasoning">
            <summary className="cursor-pointer text-xs font-bold text-foreground">{copy.adaptive_reasoning_title}</summary>
            <div className="mt-2.5 flex items-start justify-between gap-3">
              <div>
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
            <ul className="mt-2.5 space-y-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {[...new Set(recommendation.decision.reasonCodes)].map((code) => (
                <li key={code} className="flex gap-1.5"><span aria-hidden="true">•</span><span>{reasonText(code, recommendation.context, copy)}</span></li>
              ))}
            </ul>
            <div className="mt-2.5 border-t border-border/60 pt-2 grid gap-1 text-[10px] text-muted-foreground">
              <p>{copy.adaptive_context_technical.replace("{buy}", String(recommendation.context.technical?.buy ?? "—")).replace("{sell}", String(recommendation.context.technical?.sell ?? "—")).replace("{neutral}", String(recommendation.context.technical?.neutral ?? "—"))}</p>
              <p>{recommendation.context.fundamental.available
                ? copy.adaptive_context_fundamental.replace("{news}", String(recommendation.context.fundamental.newsCount)).replace("{events}", String(recommendation.context.fundamental.eventCount)).replace("{highImpact}", String(recommendation.context.fundamental.highImpactCount))
                : copy.adaptive_context_fundamental_unavailable}</p>
            </div>
          </details>
        )}
        {recommendation && !recommendation.result.valid && <div className="border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-md p-3 space-y-2" data-testid="adaptive-plan-invalid">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" />{copy.adaptive_invalid_title}</p>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">{copy.adaptive_invalid_description}</p>
        </div>}
         {recommendation && !recommendation.result.valid && (recommendation.result.buy || recommendation.result.sell) && (
           <div className="space-y-2" data-testid="adaptive-plan-scenarios-review">
             <p className="text-xs font-bold text-foreground">{copy.adaptive_scenarios_review_title}</p>
             <p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_scenarios_review_help}</p>
              {primaryPlan && <PlanSide plan={primaryPlan} lang={lang} copy={copy} decision={recommendation.decision} />}
           </div>
         )}
        {recommendation?.result.valid && (recommendation.result.buy || recommendation.result.sell) && selected && <div className="space-y-3" data-testid="adaptive-plan-valid">
          <Badge className="bg-emerald-600 hover:bg-emerald-600">{copy.adaptive_valid}</Badge>
           {primaryPlan && <PlanSide plan={primaryPlan} lang={lang} copy={copy} decision={recommendation.decision} summary={selected} />}
          <details className="rounded-md border border-border p-3" data-testid="adaptive-risk-details">
            <summary className="cursor-pointer text-xs font-bold text-foreground">{copy.adaptive_how_to_use}</summary>
            <ol className="mt-2 list-decimal pl-5 space-y-1 text-[11px] leading-relaxed text-muted-foreground"><li>{copy.adaptive_step_choose}</li><li>{copy.adaptive_step_entry}</li><li>{copy.adaptive_step_add}</li><li>{copy.adaptive_step_stop}</li></ol>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_manual_only}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_external_liquidation}</p>
            {recommendation.result.assumptions.length > 0 && (
              <ul className="mt-2 space-y-1 border-t border-border/60 pt-2 text-[10px] leading-relaxed text-muted-foreground">
                {recommendation.result.assumptions.map((assumption) => <li key={assumption}>• {assumption}</li>)}
              </ul>
            )}
          </details>
        </div>}
      </div>
    </Card>
  );
}