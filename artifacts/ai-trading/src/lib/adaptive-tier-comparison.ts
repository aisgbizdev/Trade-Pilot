import {
  buildAdaptivePlanRecommendation,
  buildAdaptivePositionPlan,
  type AccountTier,
  type AdaptivePlanRecommendation,
} from "./adaptive-position-plan";

export const ADAPTIVE_ACCOUNT_TIERS = ["micro", "mini", "regular"] as const;

export type AdaptiveTierFit =
  | "within_target"
  | "limited"
  | "blocked_risk"
  | "blocked_funds"
  | "blocked_both"
  | "unavailable";

export interface AdaptiveTierSide {
  fit: AdaptiveTierFit;
  lot: number | null;
  margin: number | null;
  riskAtStop: number | null;
  fundsAtStop: number | null;
  effectiveBudget: number | null;
  marketAligned: boolean;
  entry: number | null;
}

export interface AdaptiveTierRow {
  tier: AccountTier;
  recommendation: AdaptivePlanRecommendation;
  buy: AdaptiveTierSide;
  sell: AdaptiveTierSide;
  action: "buy" | "sell" | "wait" | "skip";
  actionReason: "ready" | "market_conflict" | "market_unconfirmed" | "limited" |
    "hard_risk" | "funds" | "both" | "unavailable";
  preferredSide: "buy" | "sell" | null;
}

export type AdaptiveTierComparisonInput = Parameters<typeof buildAdaptivePlanRecommendation>[0];

/**
 * Compare the same saved analysis and broker snapshot at all three contract
 * sizes. The entered loss is always the hard ceiling; the style utilization
 * rate is a recommendation target, not proof that a tier is impossible.
 * This only calculates locally. It never requests another AI analysis.
 */
export function compareAdaptiveAccountTiers(
  input: AdaptiveTierComparisonInput,
): Record<AccountTier, AdaptiveTierRow> {
  const rows = ADAPTIVE_ACCOUNT_TIERS.map((tier): AdaptiveTierRow => {
    const recommendation = buildAdaptivePlanRecommendation({ ...input, accountTier: tier });
    const rule = recommendation.result.rule;
    const preferred = recommendation.decision.preferredSide;
    const preferredSide = preferred === "buy" || preferred === "sell" ? preferred : null;
    const marketConflict = recommendation.decision.reasonCodes.includes("directional_conflict");
    const marketSupported = preferredSide !== null &&
      !marketConflict &&
      !recommendation.decision.reasonCodes.includes("context_unavailable");

    const evaluate = (side: "buy" | "sell"): AdaptiveTierSide => {
      const empty: AdaptiveTierSide = {
        fit: "unavailable", lot: null, margin: null, riskAtStop: null,
        fundsAtStop: null, effectiveBudget: null, marketAligned: marketSupported && preferredSide === side,
        entry: null,
      };
      if (!rule || input.availableMargin == null || input.availableMargin <= 0 ||
          input.maximumLoss == null || input.maximumLoss <= 0 ||
          input.existingExposure == null || input.existingExposure < 0 ||
          input.maximumLoss > input.availableMargin) return empty;
      const minimum = buildAdaptivePositionPlan({
        instrument: input.instrument,
        tradePlan: input.tradePlan,
        standardRule: input.standardRule,
        accountTier: tier,
        availableFunds: input.availableMargin,
        maximumLoss: input.maximumLoss,
        existingExposure: input.existingExposure,
        initialLot: rule.minimumLot,
        levels: 0,
        includedSides: { buy: side === "buy", sell: side === "sell" },
      })[side];
      if (!minimum || !Number.isFinite(minimum.estimatedCycleLoss) ||
          minimum.estimatedCycleLoss <= 0 || !Number.isFinite(minimum.totalFundsAtStop)) return empty;

      // The diagnostic exists even when the style target rejects the minimum
      // plan. It already includes market-context reductions (e.g. high impact).
      const budget = recommendation.sideEvaluations[side].diagnostic?.effectiveLossBudget ??
        (recommendation.recommendation?.usableRiskBudget ?? null);
      if (budget == null || !Number.isFinite(budget) || budget <= 0) return empty;
      const exceedsRisk = minimum.estimatedCycleLoss > input.maximumLoss;
      const exceedsFunds = minimum.totalFundsAtStop > input.availableMargin;
      const fit: AdaptiveTierFit = exceedsRisk && exceedsFunds ? "blocked_both"
        : exceedsRisk ? "blocked_risk"
        : exceedsFunds ? "blocked_funds"
        : minimum.estimatedCycleLoss > budget ? "limited"
        : "within_target";
      return {
        fit,
        lot: rule.minimumLot,
        margin: minimum.marginRequired,
        riskAtStop: minimum.estimatedCycleLoss,
        fundsAtStop: minimum.totalFundsAtStop,
        effectiveBudget: budget,
        marketAligned: marketSupported && preferredSide === side,
        entry: minimum.entry,
      };
    };
    const buy = evaluate("buy");
    const sell = evaluate("sell");
    const selected = preferredSide ? (preferredSide === "buy" ? buy : sell) : null;
    const actionable = preferredSide && recommendation.result.valid &&
      recommendation.sideEvaluations[preferredSide].status === "viable";
    let action: AdaptiveTierRow["action"] = "wait";
    let actionReason: AdaptiveTierRow["actionReason"] = "market_unconfirmed";
    if (marketConflict) {
      action = "skip";
      actionReason = "market_conflict";
    } else if (actionable) {
      action = preferredSide;
      actionReason = "ready";
    } else if (marketSupported && selected) {
      if (selected.fit === "limited") {
        actionReason = "limited";
      } else if (selected.fit === "blocked_risk" || selected.fit === "blocked_both") {
        action = "skip";
        actionReason = selected.fit === "blocked_both" ? "both" : "hard_risk";
      } else if (selected.fit === "blocked_funds") {
        action = "skip";
        actionReason = "funds";
      } else if (selected.fit === "unavailable") {
        actionReason = "unavailable";
      } else {
        actionReason = "market_unconfirmed";
      }
    }
    return { tier, recommendation, buy, sell, action, actionReason, preferredSide };
  });
  return { micro: rows[0], mini: rows[1], regular: rows[2] };
}