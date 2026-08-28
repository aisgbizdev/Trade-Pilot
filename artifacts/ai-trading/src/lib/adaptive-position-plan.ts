import type {
  FundamentalContext,
  StandardTradingRuleInstrument,
  TradePlan,
  TradeSide,
} from "@workspace/api-client-react";

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
  marginPerLot: number;
  maxGapPercent: number;
  source: "TP Standard Trading Rules";
}

export interface AdaptivePositionPlanInput {
  instrument: string;
  tradePlan: TradePlan;
  standardRule: StandardTradingRuleInstrument | null;
  equity: number | null;
  freeMargin: number | null;
  existingExposure: number | null;
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
  distanceFromEntry: number;
  riskToStopForLot: number;
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

const MARKET_GUARDRAILS: Record<AdaptiveMarket, Pick<AdaptiveRule, "label" | "maxGapPercent">> = {
  gold: {
    label: "Gold",
    maxGapPercent: 1,
  },
  brent: {
    label: "Brent Oil",
    maxGapPercent: 2,
  },
};

const TIER_RANGES: Record<AccountTier, { min: number; max: number | null }> = {
  micro: { min: 0.01, max: 0.09 },
  mini: { min: 0.1, max: 0.9 },
  regular: { min: 1, max: null },
};

const TIER_LOT_STEPS: Record<AccountTier, number> = {
  micro: 0.01,
  mini: 0.1,
  regular: 1,
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
  if (normalized.includes("XUL10") || normalized.includes("XAU") || normalized.includes("GOLD")) {
    return "gold";
  }
  if (
    normalized.includes("BCO10BBJ") ||
    normalized.includes("BCO") ||
    normalized.includes("BRENT") ||
    normalized.includes("OIL")
  ) {
    return "brent";
  }
  return null;
}

function standardCodeForMarket(market: AdaptiveMarket): StandardTradingRuleInstrument["code"] {
  return market === "gold" ? "XUL10" : "BCO10_BBJ";
}

export function getAdaptiveStandardRuleCode(
  instrument: string,
): StandardTradingRuleInstrument["code"] | null {
  const market = marketForInstrument(instrument);
  return market ? standardCodeForMarket(market) : null;
}

function numericValues(value: string | number | null | undefined): number[] {
  if (value == null) return [];
  return String(value)
    .replace(/,/g, "")
    .match(/-?\d+(?:\.\d+)?/g)
    ?.map(Number)
    .filter(Number.isFinite) ?? [];
}

function ruleFromStandardTradingRules(
  instrument: string,
  standardRule: StandardTradingRuleInstrument | null | undefined,
): AdaptiveRule | null {
  const market = marketForInstrument(instrument);
  if (!market || !standardRule || standardRule.code !== standardCodeForMarket(market)) return null;

  const minMovement = numericValues(standardRule.minimumPriceMovement)[0];
  if (
    !Number.isFinite(standardRule.contractSize) ||
    standardRule.contractSize <= 0 ||
    !Number.isFinite(minMovement) ||
    minMovement <= 0 ||
    !Number.isFinite(standardRule.initialMarginUsdPerLot) ||
    standardRule.initialMarginUsdPerLot <= 0
  ) {
    return null;
  }

  return {
    market,
    label: MARKET_GUARDRAILS[market].label,
    contractSize: standardRule.contractSize,
    minMovement,
    marginPerLot: standardRule.initialMarginUsdPerLot,
    maxGapPercent: MARKET_GUARDRAILS[market].maxGapPercent,
    source: "TP Standard Trading Rules",
  };
}

function priceFromTradeSide(side: TradeSide, field: "entryZone" | "stopLoss" | "takeProfit1" | "takeProfit2"): number | null {
  const values = numericValues(side[field]);
  if (values.length === 0) return null;
  if (field === "entryZone" && values.length > 1) {
    return (values[0] + values[1]) / 2;
  }
  return values[0];
}

function roundPrice(value: number, minMovement: number): number {
  const decimals = Math.max(0, (String(minMovement).split(".")[1] ?? "").length);
  return Number(value.toFixed(decimals));
}

function roundLot(value: number, step = 0.01): number {
  return Number((Math.round(value / step) * step).toFixed(2));
}

function isLotAligned(value: number, step: number): boolean {
  const scaled = value / step;
  return Math.abs(scaled - Math.round(scaled)) < 1e-9;
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
  if (entry == null || stopLoss == null || entry === stopLoss) {
    return `${side === "buy" ? "Buy" : "Sell"} levels are incomplete in the Standard Plan.`;
  }
  if (side === "buy" && stopLoss >= entry) {
    return "Buy stop loss must be below the Standard Plan entry.";
  }
  if (side === "sell" && stopLoss <= entry) {
    return "Sell stop loss must be above the Standard Plan entry.";
  }
  return null;
}

function sidePlan(
  side: "buy" | "sell",
  tradeSide: TradeSide,
  input: AdaptivePositionPlanInput,
  rule: AdaptiveRule,
  levels = input.levels,
): AdaptiveSidePositionPlan | null {
  const entry = priceFromTradeSide(tradeSide, "entryZone");
  const stopLoss = priceFromTradeSide(tradeSide, "stopLoss");
  if (entry == null || stopLoss == null || entry === stopLoss || input.initialLot == null) return null;

  const distance = side === "buy" ? entry - stopLoss : stopLoss - entry;
  const ladder: AdaptiveLadderLevel[] = [];
  const lotStep = TIER_LOT_STEPS[input.accountTier];
  let cumulativeLots = input.initialLot;
  const initialLot = roundLot(input.initialLot, lotStep);
  let estimatedCycleLoss = distance * rule.contractSize * initialLot;

  ladder.push({
    level: 0,
    price: roundPrice(entry, rule.minMovement),
    lot: initialLot,
    cumulativeLots: initialLot,
    estimatedRiskToStop: estimatedCycleLoss,
    distanceFromEntry: 0,
    riskToStopForLot: estimatedCycleLoss,
    reason: "Initial market entry from the Standard Plan.",
  });
  cumulativeLots = initialLot;

  for (let level = 1; level <= levels; level += 1) {
    const adverseFraction = level / (input.levels + 1);
    const price =
      side === "buy"
        ? entry - distance * adverseFraction
        : entry + distance * adverseFraction;
    // Every add uses the same conservative lot as the initial entry. This
    // keeps staging from becoming a mechanically escalating martingale.
    const lot = initialLot;
    cumulativeLots = roundLot(cumulativeLots + lot, lotStep);
    const riskToStop = (side === "buy" ? price - stopLoss : stopLoss - price) * rule.contractSize * lot;
    estimatedCycleLoss += riskToStop;
    ladder.push({
      level,
      price: roundPrice(price, rule.minMovement),
      lot,
      cumulativeLots,
      estimatedRiskToStop: estimatedCycleLoss,
      distanceFromEntry: Math.abs(entry - price),
      riskToStopForLot: riskToStop,
      reason: `Manual checkpoint ${level}: level must be reachable, the analysis must remain aligned, invalidation must be clear, and no new fundamental risk may require review. The adverse price move alone is not a trigger; equal lot sizing trades lower escalation risk for a higher cumulative exposure if every checkpoint is used.`,
    });
  }

  return {
    side,
    entry,
    stopLoss,
    takeProfit1: priceFromTradeSide(tradeSide, "takeProfit1"),
    takeProfit2: priceFromTradeSide(tradeSide, "takeProfit2"),
    totalLots: cumulativeLots,
    marginRequired: cumulativeLots * rule.marginPerLot,
    estimatedCycleLoss,
    ladder,
  };
}

export function getAdaptiveMarketRule(
  instrument: string,
  standardRule: StandardTradingRuleInstrument | null | undefined,
): AdaptiveRule | null {
  return ruleFromStandardTradingRules(instrument, standardRule);
}

/**
 * A saved browser recommendation is only valid for the exact saved analysis
 * snapshot and source-rule inputs that produced it. This includes the full
 * fundamental snapshot, which changes after a fundamental refresh.
 */
export function createAdaptivePlanFingerprint({
  instrument,
  tradePlan,
  context,
  standardRule,
}: {
  instrument: string;
  tradePlan: TradePlan;
  context: AdaptiveAnalysisContext;
  standardRule: StandardTradingRuleInstrument | null | undefined;
}): string {
  return JSON.stringify({
    instrument,
    tradePlan,
    context: {
      timeframe: context.timeframe ?? null,
      marketCondition: context.marketCondition ?? null,
      riskLevel: context.riskLevel ?? null,
      tradingBias: context.tradingBias ?? null,
      confidenceMin: context.confidenceMin ?? null,
      confidenceMax: context.confidenceMax ?? null,
      techBuyCount: context.techBuyCount ?? null,
      techSellCount: context.techSellCount ?? null,
      techNeutralCount: context.techNeutralCount ?? null,
      fundamentalContext: context.fundamentalContext ?? null,
    },
    standardRule: standardRule
      ? {
          code: standardRule.code,
          contractSize: standardRule.contractSize,
          initialMarginUsdPerLot: standardRule.initialMarginUsdPerLot,
          minimumPriceMovement: standardRule.minimumPriceMovement,
        }
      : null,
  });
}

export function buildAdaptivePositionPlan(input: AdaptivePositionPlanInput): AdaptivePositionPlanResult {
  const market = marketForInstrument(input.instrument);
  const rule = ruleFromStandardTradingRules(input.instrument, input.standardRule);
  const errors: string[] = [];

  if (!market) errors.push("Adaptive position planning requires a supported TP Standard Trading Rules instrument.");
  else if (!rule) errors.push("TP Standard Trading Rules are unavailable for this instrument.");
  if (input.equity == null || input.equity <= 0) errors.push("Account equity is required.");
  if (input.freeMargin == null || input.freeMargin <= 0) errors.push("Free margin is required.");
  if (input.existingExposure == null || input.existingExposure < 0) errors.push("Existing exposure is required.");
  if (input.initialLot == null || input.initialLot <= 0) errors.push("Initial lot is required.");
  if (!Number.isInteger(input.levels) || input.levels < 0 || input.levels > 6) {
    errors.push("Number of levels must be between 0 and 6.");
  }
  if (input.maxCycleLossPercent <= 0 || input.maxCycleLossPercent > 10) {
    errors.push("Maximum cycle loss must be between 0.1% and 10%.");
  }

  const tier = TIER_RANGES[input.accountTier];
  const lotStep = TIER_LOT_STEPS[input.accountTier];
  if (input.initialLot != null && (input.initialLot < tier.min || (tier.max != null && input.initialLot > tier.max))) {
    errors.push(`Initial lot must be within the ${input.accountTier} tier range.`);
  }
  if (input.initialLot != null && input.initialLot > 0 && !isLotAligned(input.initialLot, lotStep)) {
    errors.push(`Initial lot must use ${lotStep.toFixed(2)} lot increments for the ${input.accountTier} tier.`);
  }

  if (!rule) {
    return { valid: false, market, rule: null, errors, assumptions: [], buy: null, sell: null };
  }

  const maxCycleLoss = (input.equity ?? 0) * (input.maxCycleLossPercent / 100);
  const buyGeometryError = sideGeometryError("buy", input.tradePlan.buy);
  const sellGeometryError = sideGeometryError("sell", input.tradePlan.sell);
  if (buyGeometryError) errors.push(buyGeometryError);
  if (sellGeometryError) errors.push(sellGeometryError);
  const buy = buyGeometryError ? null : sidePlan("buy", input.tradePlan.buy, input, rule, input.sideLevels?.buy);
  const sell = sellGeometryError ? null : sidePlan("sell", input.tradePlan.sell, input, rule, input.sideLevels?.sell);

  const tierMax = tier.max;
  const plans = [buy, sell].filter((plan): plan is AdaptiveSidePositionPlan => plan != null);
  for (const plan of plans) {
    if (tierMax != null && plan.ladder.some((level) => level.lot > tierMax)) {
      errors.push(`The ${input.accountTier} tier caps each ladder entry at ${tierMax.toFixed(2)} lot.`);
    }
    if ((input.existingExposure ?? 0) + plan.totalLots > (input.freeMargin ?? 0) / rule.marginPerLot) {
      errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} exposure exceeds free-margin capacity.`);
    }
    if (plan.estimatedCycleLoss > maxCycleLoss) {
      errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} cycle loss exceeds the configured maximum.`);
    }
    if (plan.ladder.some((level) => level.price === plan.stopLoss)) {
      errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} ladder overlaps the Standard Plan stop loss.`);
    }
  }

  const tierText = tierMax == null ? `${tier.min.toFixed(2)} lot and above` : `${tier.min.toFixed(2)}–${tierMax.toFixed(2)} lot`;
  const assumptions = [
    `Contract size: ${rule.contractSize} ${input.standardRule?.contractUnit ?? "units"} per lot; margin: USD ${rule.marginPerLot} per lot from ${rule.source}.`,
    `Minimum movement from ${rule.source}: ${rule.minMovement}; a gap above ${rule.maxGapPercent}% is treated as an external execution risk.`,
    `Initial entry uses the Standard Plan; each manual add keeps the initial lot unchanged (${tierText}) to avoid a martingale multiplier. This trades lower escalation risk for less capacity as cumulative exposure grows.`,
    `Maximum cycle loss is ${input.maxCycleLossPercent}% of equity and includes the initial entry plus every planned add.`,
    "Broker auto-liquidation, spread, rollover, facility fee, VAT, slippage, and rejected orders are external risks and are not used to move ladder levels.",
  ];

  return {
    valid: errors.length === 0,
    market,
    rule,
    errors,
    assumptions,
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
  standardRule,
  preference,
  context: analysisContext,
}: {
  instrument: string;
  tradePlan: TradePlan;
  availableMargin: number | null;
  standardRule: StandardTradingRuleInstrument | null;
  preference: AdaptiveRiskPreference;
  context?: AdaptiveAnalysisContext;
}): AdaptivePlanRecommendation {
  const market = marketForInstrument(instrument);
  const rule = ruleFromStandardTradingRules(instrument, standardRule);
  const context = normalizeContext(analysisContext);
  const reasonCodes: AdaptivePlanReasonCode[] = [];
  let posture: AdaptivePlanPosture = "scaling_allowed";
  let preferredSide: AdaptivePlanDecision["preferredSide"] = "both";
  if (availableMargin == null || availableMargin <= 0) {
    return {
      result: {
        valid: false,
        market,
        rule,
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
  if (!rule) {
    return {
      result: {
        valid: false,
        market,
        rule: null,
        errors: ["TP Standard Trading Rules are unavailable for this instrument."],
        assumptions: [],
        buy: null,
        sell: null,
      },
      recommendation: null,
      context,
      decision: { posture: "entry_only", preferredSide: "none", reasonCodes: ["context_unavailable"] },
    };
  }
  const marginPerLot = rule.marginPerLot;

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
  const lotCandidates = [
    1,
    ...Array.from({ length: 9 }, (_, index) => (9 - index) / 10),
    ...Array.from({ length: 9 }, (_, index) => (9 - index) / 100),
  ];
  for (const initialLot of lotCandidates) {
    const accountTier: AccountTier = initialLot >= 1 ? "regular" : initialLot < 0.1 ? "micro" : "mini";
    const result = buildAdaptivePositionPlan({
      instrument,
      tradePlan,
      standardRule,
      equity: normalizedEquity,
      freeMargin: marginBudget,
      existingExposure: 0,
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
      rule,
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