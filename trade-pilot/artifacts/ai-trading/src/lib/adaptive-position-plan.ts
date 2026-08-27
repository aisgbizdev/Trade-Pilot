import type { FundamentalContext, TradePlan, TradeSide } from "@workspace/api-client-react";

export type AdaptiveMarket = "gold" | "brent";
export type AccountTier = "micro" | "mini" | "regular";
export type AdaptiveRiskPreference = "safe" | "balanced" | "active";
export type AdaptivePlanPosture = "scaling_allowed" | "entry_only" | "not_recommended";
export type AdaptivePlanReasonCode =
  | "context_unavailable"
  | "short_timeframe"
  | "high_risk"
  | "volatile_market"
  | "low_confidence"
  | "range_supports_scaling"
  | "trend_favors_buy"
  | "trend_favors_sell"
  | "trend_opposes_buy"
  | "trend_opposes_sell"
  | "technical_supports_buy"
  | "technical_supports_sell"
  | "technical_mixed"
  | "technical_unavailable"
  | "neutral_bias"
  | "fundamental_high_impact"
  | "fundamental_present"
  | "fundamental_clear"
  | "fundamental_unavailable"
  | "directional_conflict"
  | "staged_add_condition";

export interface AdaptiveAnalysisContext {
  timeframe?: string | null;
  marketCondition?: string | null;
  riskLevel?: string | null;
  tradingBias?: string | null;
  confidenceMin?: number | null;
  confidenceMax?: number | null;
  techBuyCount?: number | null;
  techSellCount?: number | null;
  techNeutralCount?: number | null;
  fundamentalContext?: FundamentalContext | null;
}

export interface AdaptivePlanContext {
  timeframe: string | null;
  marketCondition: string | null;
  riskLevel: string | null;
  tradingBias: string | null;
  confidenceMin: number | null;
  confidenceMax: number | null;
  technical: { buy: number; sell: number; neutral: number } | null;
  fundamental: {
    available: boolean;
    newsCount: number;
    eventCount: number;
    highImpactCount: number;
  };
}

export interface AdaptivePlanDecision {
  posture: AdaptivePlanPosture;
  preferredSide: "buy" | "sell" | "both" | "none";
  reasonCodes: AdaptivePlanReasonCode[];
}

export interface AdaptiveRule {
  market: AdaptiveMarket;
  label: string;
  contractSize: number;
  minMovement: number;
  maxGapPercent: number;
}

export interface AdaptivePositionPlanInput {
  instrument: string;
  tradePlan: TradePlan;
  equity: number | null;
  freeMargin: number | null;
  existingExposure: number | null;
  marginPerLot: number | null;
  initialLot: number | null;
  accountTier: AccountTier;
  levels: number;
  maxCycleLossPercent: number;
  sideLevels?: { buy?: number; sell?: number };
}

export interface AdaptiveLadderLevel {
  level: number;
  price: number;
  lot: number;
  cumulativeLots: number;
  estimatedRiskToStop: number;
  reason: string;
}

export interface AdaptiveSidePositionPlan {
  side: "buy" | "sell";
  entry: number;
  stopLoss: number;
  takeProfit1: number | null;
  takeProfit2: number | null;
  totalLots: number;
  marginRequired: number;
  estimatedCycleLoss: number;
  ladder: AdaptiveLadderLevel[];
}

export interface AdaptivePositionPlanResult {
  valid: boolean;
  market: AdaptiveMarket | null;
  rule: AdaptiveRule | null;
  errors: string[];
  assumptions: string[];
  buy: AdaptiveSidePositionPlan | null;
  sell: AdaptiveSidePositionPlan | null;
}

export interface AdaptivePlanRecommendation {
  result: AdaptivePositionPlanResult;
  recommendation: {
    initialLot: number;
    levels: number;
    marginBudget: number;
    maximumLoss: number;
  } | null;
  context: AdaptivePlanContext;
  decision: AdaptivePlanDecision;
}

const MARKET_RULES: Record<AdaptiveMarket, AdaptiveRule> = {
  gold: { market: "gold", label: "Gold", contractSize: 10, minMovement: 0.01, maxGapPercent: 1 },
  brent: { market: "brent", label: "Brent Oil", contractSize: 100, minMovement: 0.01, maxGapPercent: 2 },
};

const TIER_RANGES: Record<AccountTier, { min: number; max: number | null }> = {
  micro: { min: 0.01, max: 0.09 },
  mini: { min: 0.1, max: 0.9 },
  regular: { min: 1, max: null },
};

const RECOMMENDATION_PROFILES: Record<AdaptiveRiskPreference, {
  levels: number;
  marginUsage: number;
  riskBudget: number;
}> = {
  safe: { levels: 1, marginUsage: 0.5, riskBudget: 0.1 },
  balanced: { levels: 2, marginUsage: 0.65, riskBudget: 0.15 },
  active: { levels: 3, marginUsage: 0.75, riskBudget: 0.2 },
};

function marketForInstrument(instrument: string): AdaptiveMarket | null {
  const normalized = instrument.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (normalized.includes("XUL10") || normalized.includes("XAU") || normalized.includes("GOLD")) return "gold";
  if (normalized.includes("BCO10BBJ") || normalized.includes("BCO") || normalized.includes("BRENT") || normalized.includes("OIL")) return "brent";
  return null;
}

function numericValues(value: string | number | null | undefined): number[] {
  if (value == null) return [];
  return String(value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/g)?.map(Number).filter(Number.isFinite) ?? [];
}

function priceFromTradeSide(side: TradeSide, field: "entryZone" | "stopLoss" | "takeProfit1" | "takeProfit2"): number | null {
  const values = numericValues(side[field]);
  if (values.length === 0) return null;
  return field === "entryZone" && values.length > 1 ? (values[0] + values[1]) / 2 : values[0];
}

function roundPrice(value: number, minMovement: number): number {
  return Number(value.toFixed(Math.max(0, (String(minMovement).split(".")[1] ?? "").length)));
}

function roundLot(value: number): number {
  return Number(value.toFixed(2));
}

function normalizeBias(value: string | null | undefined): "bearish" | "bullish" | "neutral" | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === "strong_sell" || normalized === "bearish" || normalized === "bearish_strong" || normalized === "sell") return "bearish";
  if (normalized === "strong_buy" || normalized === "bullish" || normalized === "bullish_strong" || normalized === "buy") return "bullish";
  if (normalized === "neutral") return "neutral";
  return null;
}

function normalizeContext(input?: AdaptiveAnalysisContext): AdaptivePlanContext {
  const technicalValues = [input?.techBuyCount, input?.techSellCount, input?.techNeutralCount];
  const hasTechnical = technicalValues.every((value) => value != null && Number.isFinite(value) && value >= 0);
  const fundamentalContext = input?.fundamentalContext;
  return {
    timeframe: input?.timeframe ?? null,
    marketCondition: input?.marketCondition ?? null,
    riskLevel: input?.riskLevel ?? null,
    tradingBias: normalizeBias(input?.tradingBias),
    confidenceMin: input?.confidenceMin ?? null,
    confidenceMax: input?.confidenceMax ?? null,
    technical: hasTechnical
      ? { buy: input!.techBuyCount!, sell: input!.techSellCount!, neutral: input!.techNeutralCount! }
      : null,
    fundamental: {
      available: fundamentalContext != null,
      newsCount: fundamentalContext?.newsItems?.length ?? 0,
      eventCount: fundamentalContext?.calendarEvents?.length ?? 0,
      highImpactCount: fundamentalContext?.calendarEvents?.filter((event) => event.impact === "★★★").length ?? 0,
    },
  };
}

function hasCompleteContext(context: AdaptivePlanContext): boolean {
  const hasValidMarketCondition = ["trending_up", "trending_down", "ranging", "volatile"].includes(context.marketCondition ?? "");
  const hasValidRiskLevel = ["low", "medium", "high"].includes(context.riskLevel ?? "");
  const hasValidConfidence = Number.isFinite(context.confidenceMin) &&
    Number.isFinite(context.confidenceMax) &&
    context.confidenceMin! >= 0 &&
    context.confidenceMax! <= 100 &&
    context.confidenceMin! <= context.confidenceMax!;
  return Boolean(
    context.timeframe &&
      hasValidMarketCondition &&
      hasValidRiskLevel &&
      context.tradingBias &&
      hasValidConfidence &&
      context.technical &&
      context.fundamental.available,
  );
}

function timeframeIsShort(timeframe: string | null): boolean {
  return timeframe != null && ["1m", "5m", "15m"].includes(timeframe.toLowerCase());
}

function sideGeometryError(side: "buy" | "sell", tradeSide: TradeSide): string | null {
  const entry = priceFromTradeSide(tradeSide, "entryZone");
  const stopLoss = priceFromTradeSide(tradeSide, "stopLoss");
  if (entry == null || stopLoss == null || entry === stopLoss) return `${side === "buy" ? "Buy" : "Sell"} levels are incomplete in the Standard Plan.`;
  if (side === "buy" && stopLoss >= entry) return "Buy stop loss must be below the Standard Plan entry.";
  if (side === "sell" && stopLoss <= entry) return "Sell stop loss must be above the Standard Plan entry.";
  return null;
}

function sidePlan(
  side: "buy" | "sell",
  tradeSide: TradeSide,
  input: AdaptivePositionPlanInput,
  rule: AdaptiveRule,
  contractSize: number,
  marginPerLot: number,
  levels = input.levels,
): AdaptiveSidePositionPlan | null {
  const entry = priceFromTradeSide(tradeSide, "entryZone");
  const stopLoss = priceFromTradeSide(tradeSide, "stopLoss");
  if (entry == null || stopLoss == null || entry === stopLoss || input.initialLot == null) return null;

  const distance = side === "buy" ? entry - stopLoss : stopLoss - entry;
  const ladder: AdaptiveLadderLevel[] = [];
  let cumulativeLots = input.initialLot;
  let estimatedCycleLoss = distance * contractSize * input.initialLot;
  ladder.push({ level: 0, price: roundPrice(entry, rule.minMovement), lot: input.initialLot, cumulativeLots, estimatedRiskToStop: estimatedCycleLoss, reason: "Initial market entry from the Standard Plan." });

  for (let level = 1; level <= levels; level += 1) {
    const price = side === "buy" ? entry - distance * (level / (input.levels + 1)) : entry + distance * (level / (input.levels + 1));
    const lot = roundLot(ladder[ladder.length - 1].lot * 1.5);
    cumulativeLots = roundLot(cumulativeLots + lot);
    estimatedCycleLoss += (side === "buy" ? price - stopLoss : stopLoss - price) * contractSize * lot;
    ladder.push({
      level,
      price: roundPrice(price, rule.minMovement),
      lot,
      cumulativeLots,
      estimatedRiskToStop: estimatedCycleLoss,
      reason: `Add only after price reaches predefined adverse level ${level}; stop adding at the next invalidation or guardrail breach.`,
    });
  }

  return {
    side,
    entry,
    stopLoss,
    takeProfit1: priceFromTradeSide(tradeSide, "takeProfit1"),
    takeProfit2: priceFromTradeSide(tradeSide, "takeProfit2"),
    totalLots: cumulativeLots,
    marginRequired: cumulativeLots * marginPerLot,
    estimatedCycleLoss,
    ladder,
  };
}

export function getAdaptiveMarketRule(instrument: string): AdaptiveRule | null {
  const market = marketForInstrument(instrument);
  return market ? MARKET_RULES[market] : null;
}

export function buildAdaptivePositionPlan(input: AdaptivePositionPlanInput): AdaptivePositionPlanResult {
  const market = marketForInstrument(input.instrument);
  const baseRule = market ? MARKET_RULES[market] : null;
  const errors: string[] = [];
  if (!baseRule) errors.push("Adaptive rules are currently defined for Gold and Brent only.");
  if (input.equity == null || input.equity <= 0) errors.push("Account equity is required.");
  if (input.freeMargin == null || input.freeMargin <= 0) errors.push("Free margin is required.");
  if (input.existingExposure == null || input.existingExposure < 0) errors.push("Existing exposure is required.");
  if (input.marginPerLot == null || input.marginPerLot <= 0) errors.push("Margin per lot is required.");
  if (input.initialLot == null || input.initialLot <= 0) errors.push("Initial lot is required.");
  if (!Number.isInteger(input.levels) || input.levels < 0 || input.levels > 6) errors.push("Number of levels must be between 0 and 6.");
  if (input.maxCycleLossPercent <= 0 || input.maxCycleLossPercent > 10) errors.push("Maximum cycle loss must be between 0.1% and 10%.");

  const tier = TIER_RANGES[input.accountTier];
  if (input.initialLot != null && (input.initialLot < tier.min || (tier.max != null && input.initialLot > tier.max))) {
    errors.push(`Initial lot must be within the ${input.accountTier} tier range.`);
  }
  if (!baseRule) return { valid: false, market, rule: null, errors, assumptions: [], buy: null, sell: null };

  // Gold/Brent contract size, price precision, and gap threshold are fixed
  // market guardrails. The user supplies account-specific margin only.
  const rule = baseRule;
  const marginPerLot = input.marginPerLot ?? 0;
  const maxCycleLoss = (input.equity ?? 0) * (input.maxCycleLossPercent / 100);
  const buyGeometryError = sideGeometryError("buy", input.tradePlan.buy);
  const sellGeometryError = sideGeometryError("sell", input.tradePlan.sell);
  if (buyGeometryError) errors.push(buyGeometryError);
  if (sellGeometryError) errors.push(sellGeometryError);
  const buy = buyGeometryError ? null : sidePlan("buy", input.tradePlan.buy, input, rule, rule.contractSize, marginPerLot, input.sideLevels?.buy);
  const sell = sellGeometryError ? null : sidePlan("sell", input.tradePlan.sell, input, rule, rule.contractSize, marginPerLot, input.sideLevels?.sell);

  const plans = [buy, sell].filter((plan): plan is AdaptiveSidePositionPlan => plan != null);
  const tierMax = tier.max;
  for (const plan of plans) {
    if (tierMax != null && plan.ladder.some((level) => level.lot > tierMax)) errors.push(`The ${input.accountTier} tier caps each ladder entry at ${tierMax.toFixed(2)} lot.`);
    if ((input.existingExposure ?? 0) + plan.totalLots > (input.freeMargin ?? 0) / marginPerLot) errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} exposure exceeds free-margin capacity.`);
    if (plan.estimatedCycleLoss > maxCycleLoss) errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} cycle loss exceeds the configured maximum.`);
    if (plan.ladder.some((level) => level.price === plan.stopLoss)) errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} ladder overlaps the Standard Plan stop loss.`);
  }

  const tierText = tierMax == null ? `${tier.min.toFixed(2)} lot and above` : `${tier.min.toFixed(2)}–${tierMax.toFixed(2)} lot`;
  return {
    valid: errors.length === 0,
    market,
    rule,
    errors,
    assumptions: [
      `Contract size: ${rule.contractSize} units per lot; margin is supplied by the user and is not inferred from a broker.`,
      `Price movement is rounded to ${rule.minMovement}; a gap above ${rule.maxGapPercent}% is treated as an external execution risk.`,
      `Initial entry uses the Standard Plan; each add is 1.5× the prior lot and remains subject to the ${input.accountTier} range (${tierText}).`,
      `Maximum cycle loss is ${input.maxCycleLossPercent}% of equity and includes the initial entry plus every planned add.`,
      "Broker auto-liquidation, spread, rollover, facility fee, VAT, slippage, and rejected orders are external risks and are not used to move ladder levels.",
    ],
    buy,
    sell,
  };
}

/**
 * Builds a practical position-size recommendation from the user's available
 * margin and the entry/stop levels already produced by the AI analysis.
 * The risk cap is expressed as a portion of the margin reserved for this plan,
 * so the UI does not need to ask beginners for equity, tiers, or lot math.
 */
export function buildAdaptivePlanRecommendation({
  instrument,
  tradePlan,
  availableMargin,
  marginPerLot,
  preference,
  context: analysisContext,
}: {
  instrument: string;
  tradePlan: TradePlan;
  availableMargin: number | null;
  marginPerLot: number | null;
  preference: AdaptiveRiskPreference;
  context?: AdaptiveAnalysisContext;
}): AdaptivePlanRecommendation {
  const market = marketForInstrument(instrument);
  const context = normalizeContext(analysisContext);
  const reasonCodes: AdaptivePlanReasonCode[] = [];
  let posture: AdaptivePlanPosture = "scaling_allowed";
  let preferredSide: AdaptivePlanDecision["preferredSide"] = "both";
  if (availableMargin == null || availableMargin <= 0) {
    return {
      result: {
        valid: false,
        market,
        rule: market ? MARKET_RULES[market] : null,
        errors: ["Available margin is required."],
        assumptions: [],
        buy: null,
        sell: null,
      },
      recommendation: null,
      context,
      decision: { posture: "entry_only", preferredSide: "none", reasonCodes: ["context_unavailable"] },
    };
  }
  if (marginPerLot == null || marginPerLot <= 0) {
    return {
      result: {
        valid: false,
        market,
        rule: market ? MARKET_RULES[market] : null,
        errors: ["Standard margin rules are unavailable."],
        assumptions: [],
        buy: null,
        sell: null,
      },
      recommendation: null,
      context,
      decision: { posture: "entry_only", preferredSide: "none", reasonCodes: ["context_unavailable"] },
    };
  }

  const profile = RECOMMENDATION_PROFILES[preference];
  let levels = profile.levels;
  let marginUsage = profile.marginUsage;
  let riskBudget = profile.riskBudget;

  if (!hasCompleteContext(context)) {
    posture = "entry_only";
    levels = 0;
    preferredSide = "none";
    reasonCodes.push("context_unavailable");
    if (!context.technical) reasonCodes.push("technical_unavailable");
    if (!context.fundamental.available) reasonCodes.push("fundamental_unavailable");
  } else {
    if (timeframeIsShort(context.timeframe)) {
      levels = 0;
      marginUsage = Math.min(marginUsage, 0.5);
      riskBudget = Math.min(riskBudget, 0.08);
      posture = "entry_only";
      reasonCodes.push("short_timeframe");
    }
    if (context.riskLevel === "high") {
      levels = 0;
      marginUsage = Math.min(marginUsage, 0.5);
      riskBudget = Math.min(riskBudget, 0.08);
      posture = "entry_only";
      reasonCodes.push("high_risk");
    }
    if (context.marketCondition === "volatile") {
      levels = 0;
      marginUsage = Math.min(marginUsage, 0.5);
      riskBudget = Math.min(riskBudget, 0.08);
      posture = "entry_only";
      reasonCodes.push("volatile_market");
    }
    if (context.confidenceMax != null && context.confidenceMax < 60) {
      levels = 0;
      posture = "entry_only";
      reasonCodes.push("low_confidence");
    }

    const marketDirection = context.marketCondition === "trending_up"
      ? "buy"
      : context.marketCondition === "trending_down"
        ? "sell"
        : null;
    const biasDirection = context.tradingBias === "bullish"
      ? "buy"
      : context.tradingBias === "bearish"
        ? "sell"
        : null;
    let hasDirectionalConflict = Boolean(marketDirection && biasDirection && marketDirection !== biasDirection);

    if (context.tradingBias === "neutral") {
      levels = 0;
      posture = "entry_only";
      reasonCodes.push("neutral_bias");
    } else if (biasDirection === "buy") {
      preferredSide = "buy";
      reasonCodes.push("trend_favors_buy", "trend_opposes_sell");
    } else if (biasDirection === "sell") {
      preferredSide = "sell";
      reasonCodes.push("trend_favors_sell", "trend_opposes_buy");
    }

    if (context.marketCondition === "ranging") reasonCodes.push("range_supports_scaling");

    if (context.technical && !hasDirectionalConflict) {
      const { buy, sell } = context.technical;
      const totalDirectional = buy + sell;
      const imbalance = totalDirectional > 0 ? Math.abs(buy - sell) / totalDirectional : 0;
      if (totalDirectional === 0 || imbalance < 0.2) {
        levels = 0;
        posture = "entry_only";
        reasonCodes.push("technical_mixed");
      } else if (buy > sell) {
        reasonCodes.push("technical_supports_buy");
        if (preferredSide === "sell") {
          hasDirectionalConflict = true;
        } else {
          preferredSide = "buy";
        }
      } else {
        reasonCodes.push("technical_supports_sell");
        if (preferredSide === "buy") {
          hasDirectionalConflict = true;
        } else {
          preferredSide = "sell";
        }
      }
    }
    if (hasDirectionalConflict) {
      levels = 0;
      posture = "not_recommended";
      preferredSide = "none";
      reasonCodes.push("directional_conflict");
    }

    if (context.fundamental.highImpactCount > 0) {
      levels = 0;
      marginUsage = Math.min(marginUsage, 0.5);
      riskBudget = Math.min(riskBudget, 0.08);
      if (posture !== "not_recommended") posture = "entry_only";
      reasonCodes.push("fundamental_high_impact");
    } else if (context.fundamental.newsCount + context.fundamental.eventCount > 0) {
      reasonCodes.push("fundamental_present");
    } else {
      reasonCodes.push("fundamental_clear");
    }
  }

  if (levels > 0) reasonCodes.push("staged_add_condition");

  const marginBudget = availableMargin * marginUsage;
  const maximumLoss = Math.max(availableMargin * riskBudget, 1);
  // The low-level calculator uses a percent-of-equity guardrail. Supplying a
  // normalized equity here gives it the same absolute loss ceiling without
  // requiring the user to enter a separate equity figure.
  const normalizedEquity = maximumLoss * 50;

  let fallback: AdaptivePositionPlanResult | null = null;
  for (let units = 90; units >= 1; units -= 1) {
    const initialLot = units / 100;
    const accountTier: AccountTier = initialLot < 0.1 ? "micro" : "mini";
    const result = buildAdaptivePositionPlan({
      instrument,
      tradePlan,
      equity: normalizedEquity,
      freeMargin: marginBudget,
      existingExposure: 0,
      marginPerLot,
      initialLot,
      accountTier,
      levels,
      sideLevels:
        preferredSide === "buy"
          ? { buy: levels, sell: 0 }
          : preferredSide === "sell"
            ? { buy: 0, sell: levels }
            : { buy: levels, sell: levels },
      maxCycleLossPercent: 2,
    });
    fallback ??= result;
    if (result.valid) {
      if (posture === "not_recommended") {
        return {
          result: {
            ...result,
            valid: false,
            errors: [...result.errors, "The technical snapshot conflicts with the market direction."],
          },
          recommendation: null,
          context,
          decision: { posture, preferredSide, reasonCodes },
        };
      }
      return {
        result,
        recommendation: {
          initialLot,
          levels,
          marginBudget,
          maximumLoss,
        },
        context,
        decision: { posture, preferredSide, reasonCodes },
      };
    }
  }

  return {
    result: fallback ?? {
      valid: false,
      market,
      rule: market ? MARKET_RULES[market] : null,
      errors: ["No safe position size is available."],
      assumptions: [],
      buy: null,
      sell: null,
    },
    recommendation: null,
    context,
    decision: { posture, preferredSide, reasonCodes },
  };
}