import type { FundamentalContext, TradePlan, TradeSide } from "@workspace/api-client-react";

export type AdaptiveMarket = "gold" | "brent";
export type AccountTier = "micro" | "mini" | "regular";
export type AdaptiveRiskPreference = "safe" | "balanced" | "active" | "aggressive" | "custom";
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
  | "live_market_caution"
  | "live_scaling_hold"
  | "live_plan_invalidated"
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
    marketStatus: "reaffirm" | "caution" | "hold_scaling" | "invalidate" | null;
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
  minimumLot?: number | null;
  maximumLot?: number | null;
  facilityFeeUsdPerLotPerSide?: number | null;
  vatPercent?: number | null;
  initialLot: number | null;
  accountTier: AccountTier;
  levels: number;
  maxCycleLossPercent: number;
  /** Explicit account-currency loss cap. When set, this overrides the legacy percentage cap. */
  maxLossAmount?: number | null;
  sideLevels?: { buy?: number; sell?: number };
}

export interface AdaptiveLadderLevel {
  level: number;
  price: number;
  lot: number;
  cumulativeLots: number;
  marginRequired: number;
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
  potentialProfit: number;
  breakEvenWinRate: number | null;
  ladder: AdaptiveLadderLevel[];
}

export interface AdaptivePositionPlanResult {
  valid: boolean;
  market: AdaptiveMarket | null;
  rule: AdaptiveRule | null;
  errors: string[];
  sideErrors: Record<"buy" | "sell", string[]>;
  assumptions: string[];
  buy: AdaptiveSidePositionPlan | null;
  sell: AdaptiveSidePositionPlan | null;
  marginAllocated: number;
  marginBuffer: number;
  maximumLoss: number;
  potentialResult: number;
  breakEvenWinRate: number | null;
}

export interface AdaptivePlanRecommendation {
  result: AdaptivePositionPlanResult;
  recommendation: {
    riskPercent: number;
    marginBudget: number;
    maximumLoss: number;
  } | null;
  context: AdaptivePlanContext;
  decision: AdaptivePlanDecision;
}

const MARKET_RULES: Record<AdaptiveMarket, AdaptiveRule> = {
  gold: {
    market: "gold",
    label: "Gold",
    contractSize: 10,
    minMovement: 0.01,
    maxGapPercent: 1,
  },
  brent: {
    market: "brent",
    label: "Brent Oil",
    contractSize: 100,
    minMovement: 0.01,
    maxGapPercent: 2,
  },
};

const TIER_RANGES: Record<AccountTier, { min: number; max: number | null }> = {
  micro: { min: 0.01, max: 0.09 },
  mini: { min: 0.1, max: 0.9 },
  regular: { min: 1, max: null },
};

const RECOMMENDATION_PROFILES: Record<AdaptiveRiskPreference, {
  levels: number;
  marginUsage: number;
}> = {
  safe: { levels: 1, marginUsage: 0.5 },
  balanced: { levels: 2, marginUsage: 0.65 },
  active: { levels: 3, marginUsage: 0.75 },
  aggressive: { levels: 3, marginUsage: 0.75 },
  custom: { levels: 2, marginUsage: 0.65 },
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

function numericValues(value: string | number | null | undefined): number[] {
  if (value == null) return [];
  return String(value)
    .replace(/,/g, "")
    .match(/-?\d+(?:\.\d+)?/g)
    ?.map(Number)
    .filter(Number.isFinite) ?? [];
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
      marketStatus: fundamentalContext?.marketState?.status ?? null,
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
  contractSize: number,
  marginPerLot: number,
  levels = input.levels,
): AdaptiveSidePositionPlan | null {
  const entry = priceFromTradeSide(tradeSide, "entryZone");
  const stopLoss = priceFromTradeSide(tradeSide, "stopLoss");
  if (entry == null || stopLoss == null || entry === stopLoss || input.initialLot == null) return null;

  const distance = side === "buy" ? entry - stopLoss : stopLoss - entry;
  const ladder: AdaptiveLadderLevel[] = [];
  let cumulativeLots = roundLot(input.initialLot);
  const costPerLot = Math.max(0, input.facilityFeeUsdPerLotPerSide ?? 0) * 2 * (1 + Math.max(0, input.vatPercent ?? 0) / 100);
  let estimatedCycleLoss = distance * contractSize * cumulativeLots + cumulativeLots * costPerLot;

  ladder.push({
    level: 0,
    price: roundPrice(entry, rule.minMovement),
    lot: input.initialLot,
    cumulativeLots,
    marginRequired: input.initialLot * marginPerLot,
    estimatedRiskToStop: estimatedCycleLoss,
    reason: "Initial market entry from the Standard Plan.",
  });

  for (let level = 1; level <= levels; level += 1) {
    const adverseFraction = level / (levels + 1);
    const price =
      side === "buy"
        ? entry - distance * adverseFraction
        : entry + distance * adverseFraction;
    const previousLot = ladder[ladder.length - 1].lot;
    // Additions deliberately get smaller. This is staged exposure, not
    // martingale: a losing move never increases the next order size.
    const lot = Math.min(previousLot, Math.max(0.01, roundLot(previousLot * 0.65)));
    cumulativeLots = roundLot(cumulativeLots + lot);
    const riskToStop = (side === "buy" ? price - stopLoss : stopLoss - price) * contractSize * lot;
    estimatedCycleLoss += riskToStop + lot * costPerLot;
    ladder.push({
      level,
      price: roundPrice(price, rule.minMovement),
      lot,
      cumulativeLots,
      marginRequired: lot * marginPerLot,
      estimatedRiskToStop: estimatedCycleLoss,
      reason: `Add only after price reaches predefined adverse level ${level}; stop adding at the next invalidation or guardrail breach.`,
    });
  }

  const takeProfit1 = priceFromTradeSide(tradeSide, "takeProfit1");
  const takeProfit2 = priceFromTradeSide(tradeSide, "takeProfit2");
  const potentialProfit = takeProfit2 == null
    ? 0
    : ladder.reduce((total, level) => {
      const move = side === "buy" ? takeProfit2 - level.price : level.price - takeProfit2;
      return total + Math.max(0, move) * contractSize * level.lot;
    }, 0) - cumulativeLots * costPerLot;
  const breakEvenWinRate = potentialProfit > 0
    ? estimatedCycleLoss / (estimatedCycleLoss + potentialProfit)
    : null;

  return {
    side,
    entry,
    stopLoss,
    takeProfit1,
    takeProfit2,
    totalLots: cumulativeLots,
    marginRequired: cumulativeLots * marginPerLot,
    estimatedCycleLoss,
    potentialProfit,
    breakEvenWinRate,
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
  const globalErrors: string[] = [];
  const sideErrors: Record<"buy" | "sell", string[]> = { buy: [], sell: [] };
  const addGlobalError = (message: string) => {
    errors.push(message);
    globalErrors.push(message);
  };

  if (!baseRule) addGlobalError("Adaptive rules are currently defined for Gold and Brent only.");
  if (input.equity == null || input.equity <= 0) addGlobalError("Account equity is required.");
  if (input.freeMargin == null || input.freeMargin <= 0) addGlobalError("Free margin is required.");
  if (input.existingExposure == null || input.existingExposure < 0) addGlobalError("Existing exposure is required.");
  if (input.marginPerLot == null || input.marginPerLot <= 0) addGlobalError("Margin per lot is required.");
  if (input.initialLot == null || input.initialLot <= 0) addGlobalError("Initial lot is required.");
  if (!Number.isInteger(input.levels) || input.levels < 0 || input.levels > 6) {
    addGlobalError("Number of levels must be between 0 and 6.");
  }
  if (input.maxCycleLossPercent <= 0 || input.maxCycleLossPercent > 10) {
    addGlobalError("Maximum cycle loss must be between 0.1% and 10%.");
  }
  if (input.maxLossAmount != null && (!Number.isFinite(input.maxLossAmount) || input.maxLossAmount <= 0)) {
    addGlobalError("Maximum loss amount must be greater than zero.");
  }

  const tier = TIER_RANGES[input.accountTier];
  const minimumLot = input.minimumLot ?? 0;
  const initialMinimumLot = input.minimumLot ?? tier.min;
  const maximumLot = input.maximumLot ?? tier.max;
  if (input.initialLot != null && (input.initialLot < initialMinimumLot || (maximumLot != null && input.initialLot > maximumLot))) {
    addGlobalError(`Initial lot must be within the ${input.accountTier} tier range.`);
  }

  if (!baseRule) {
    return {
      valid: false, market, rule: null, errors, sideErrors, assumptions: [], buy: null, sell: null,
      marginAllocated: 0, marginBuffer: input.freeMargin ?? 0, maximumLoss: input.maxLossAmount ?? 0,
      potentialResult: 0, breakEvenWinRate: null,
    };
  }

  // Gold/Brent contract size, price precision, and gap threshold are fixed
  // market guardrails. The user supplies account-specific margin only.
  const rule = baseRule;

  const marginPerLot = input.marginPerLot ?? 0;
  const maxCycleLoss = input.maxLossAmount ?? (input.equity ?? 0) * (input.maxCycleLossPercent / 100);
  const buyGeometryError = sideGeometryError("buy", input.tradePlan.buy);
  const sellGeometryError = sideGeometryError("sell", input.tradePlan.sell);
  // Older analyses can contain only one complete Standard Plan scenario. It
  // must not make the usable, directionally aligned scenario unavailable.
  // A malformed stop direction remains a hard error, however.
  const buyIsIncomplete = buyGeometryError?.includes("incomplete") ?? false;
  const sellIsIncomplete = sellGeometryError?.includes("incomplete") ?? false;
  if (buyGeometryError) sideErrors.buy.push(buyGeometryError);
  if (sellGeometryError) sideErrors.sell.push(sellGeometryError);
  if (buyGeometryError && !buyIsIncomplete) errors.push(buyGeometryError);
  if (sellGeometryError && !sellIsIncomplete) errors.push(sellGeometryError);
  if (buyGeometryError && sellGeometryError && (buyIsIncomplete || sellIsIncomplete)) {
    if (buyIsIncomplete) errors.push(buyGeometryError);
    if (sellIsIncomplete) errors.push(sellGeometryError);
  }
  const buy = buyGeometryError ? null : sidePlan("buy", input.tradePlan.buy, input, rule, rule.contractSize, marginPerLot, input.sideLevels?.buy);
  const sell = sellGeometryError ? null : sidePlan("sell", input.tradePlan.sell, input, rule, rule.contractSize, marginPerLot, input.sideLevels?.sell);

  const tierMax = tier.max;
  const plans = [buy, sell].filter((plan): plan is AdaptiveSidePositionPlan => plan != null);
  for (const plan of plans) {
    const planErrors = sideErrors[plan.side];
    const addSideError = (message: string) => {
      errors.push(message);
      planErrors.push(message);
    };
    if (minimumLot > 0 && plan.ladder.some((level) => level.lot < minimumLot)) {
      addSideError(`Each ladder entry must be at least ${minimumLot.toFixed(2)} lot.`);
    }
    if (maximumLot != null && plan.ladder.some((level) => level.lot > maximumLot)) {
      addSideError(`Each ladder entry is capped at ${maximumLot.toFixed(2)} lot.`);
    }
    if (maximumLot != null && (input.existingExposure ?? 0) + plan.totalLots > maximumLot) {
      addSideError(`${plan.side === "buy" ? "Buy" : "Sell"} total open exposure exceeds the ${maximumLot.toFixed(2)} lot limit.`);
    }
    if ((input.existingExposure ?? 0) + plan.totalLots > (input.freeMargin ?? 0) / marginPerLot) {
      addSideError(`${plan.side === "buy" ? "Buy" : "Sell"} exposure exceeds free-margin capacity.`);
    }
    if (plan.estimatedCycleLoss > maxCycleLoss) {
      addSideError(`${plan.side === "buy" ? "Buy" : "Sell"} cycle loss exceeds the configured maximum.`);
    }
    if (plan.ladder.some((level) => level.price === plan.stopLoss)) {
      addSideError(`${plan.side === "buy" ? "Buy" : "Sell"} ladder overlaps the Standard Plan stop loss.`);
    }
  }
  const marginAllocated = Math.max(...plans.map((plan) => plan.marginRequired), 0);
  const potentialResult = Math.max(...plans.map((plan) => plan.potentialProfit), 0);
  const plannedLoss = Math.max(...plans.map((plan) => plan.estimatedCycleLoss), 0);
  const breakEvenWinRate = potentialResult > 0
    ? plannedLoss / (plannedLoss + potentialResult)
    : null;

  const tierText = tierMax == null ? `${tier.min.toFixed(2)} lot and above` : `${tier.min.toFixed(2)}–${tierMax.toFixed(2)} lot`;
  const assumptions = [
    `Contract size: ${rule.contractSize} units per lot; margin and lot limits are supplied by TP Standard Rules.`,
    `Price movement is rounded to ${rule.minMovement}; a gap above ${rule.maxGapPercent}% is treated as an external execution risk.`,
    `Initial entry uses the Standard Plan; each add is 65% of the prior lot and remains subject to the ${input.accountTier} range (${tierText}).`,
    `Maximum cycle loss is ${input.maxLossAmount != null ? "the selected account-currency cap" : `${input.maxCycleLossPercent}% of equity`} and includes the initial entry plus every planned add.`,
    "The loss estimate includes TP facility fees plus VAT for entry and exit. Spread, gaps, rollover, slippage, auto-liquidation, and rejected orders remain external risks.",
  ];

  return {
    valid: globalErrors.length === 0 && [buy, sell].some((plan) => plan != null && sideErrors[plan.side].length === 0),
    market,
    rule,
    errors,
    sideErrors,
    assumptions,
    buy,
    sell,
    marginAllocated,
    marginBuffer: Math.max(0, (input.freeMargin ?? 0) - marginAllocated),
    maximumLoss: maxCycleLoss,
    potentialResult,
    breakEvenWinRate,
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
  existingExposure,
  marginPerLot,
  minimumLot,
  maximumLot,
  facilityFeeUsdPerLotPerSide,
  vatPercent,
  preference,
  riskPercent,
  context: analysisContext,
}: {
  instrument: string;
  tradePlan: TradePlan;
  availableMargin: number | null;
  existingExposure?: number | null;
  marginPerLot: number | null;
  minimumLot?: number | null;
  maximumLot?: number | null;
  facilityFeeUsdPerLotPerSide?: number | null;
  vatPercent?: number | null;
  preference: AdaptiveRiskPreference;
  riskPercent: number | null;
  context?: AdaptiveAnalysisContext;
}): AdaptivePlanRecommendation {
  const market = marketForInstrument(instrument);
  const context = normalizeContext(analysisContext);
  const reasonCodes: AdaptivePlanReasonCode[] = [];
  let posture: AdaptivePlanPosture = "scaling_allowed";
  let preferredSide: AdaptivePlanDecision["preferredSide"] = "both";
  let scalingSide: "buy" | "sell" | null = null;
  if (availableMargin == null || availableMargin <= 0) {
    return {
      result: {
        valid: false,
        market,
        rule: market ? MARKET_RULES[market] : null,
        errors: ["Available margin is required."],
        sideErrors: { buy: [], sell: [] },
        assumptions: [],
        buy: null,
        sell: null,
        marginAllocated: 0,
        marginBuffer: 0,
        maximumLoss: 0,
        potentialResult: 0,
        breakEvenWinRate: null,
      },
      recommendation: null,
      context,
      decision: { posture: "entry_only", preferredSide: "none", reasonCodes: ["context_unavailable"] },
    };
  }
  if (existingExposure != null && (!Number.isFinite(existingExposure) || existingExposure < 0)) {
    return {
      result: {
        valid: false, market, rule: market ? MARKET_RULES[market] : null,
        errors: ["Current open lots must be zero or greater."], assumptions: [], buy: null, sell: null,
        sideErrors: { buy: [], sell: [] },
        marginAllocated: 0, marginBuffer: availableMargin ?? 0, maximumLoss: 0, potentialResult: 0, breakEvenWinRate: null,
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
        sideErrors: { buy: [], sell: [] },
        assumptions: [],
        buy: null,
        sell: null,
        marginAllocated: 0,
        marginBuffer: availableMargin,
        maximumLoss: 0,
        potentialResult: 0,
        breakEvenWinRate: null,
      },
      recommendation: null,
      context,
      decision: { posture: "entry_only", preferredSide: "none", reasonCodes: ["context_unavailable"] },
    };
  }

  if (riskPercent == null || !Number.isFinite(riskPercent) || riskPercent <= 0 || riskPercent > 100) {
    return {
      result: {
        valid: false,
        market,
        rule: market ? MARKET_RULES[market] : null,
        errors: ["Enter a margin risk percentage between 0.01% and 100%."],
        sideErrors: { buy: [], sell: [] },
        assumptions: [],
        buy: null,
        sell: null,
        marginAllocated: 0,
        marginBuffer: availableMargin,
        maximumLoss: 0,
        potentialResult: 0,
        breakEvenWinRate: null,
      },
      recommendation: null,
      context,
      decision: { posture: "entry_only", preferredSide: "none", reasonCodes: ["context_unavailable"] },
    };
  }

  const profile = RECOMMENDATION_PROFILES[preference];
  let levels = profile.levels;
  let marginUsage = profile.marginUsage;

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
      posture = "entry_only";
      reasonCodes.push("short_timeframe");
    }
    if (context.riskLevel === "high") {
      levels = 0;
      marginUsage = Math.min(marginUsage, 0.5);
      posture = "entry_only";
      reasonCodes.push("high_risk");
    }
    if (context.marketCondition === "volatile") {
      levels = 0;
      marginUsage = Math.min(marginUsage, 0.5);
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
      reasonCodes.push("trend_favors_buy", "trend_opposes_sell");
      scalingSide = "buy";
    } else if (biasDirection === "sell") {
      reasonCodes.push("trend_favors_sell", "trend_opposes_buy");
      scalingSide = "sell";
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
        if (scalingSide === "sell") {
          hasDirectionalConflict = true;
        } else {
          scalingSide = "buy";
        }
      } else {
        reasonCodes.push("technical_supports_sell");
        if (scalingSide === "buy") {
          hasDirectionalConflict = true;
        } else {
          scalingSide = "sell";
        }
      }
    }
    if (hasDirectionalConflict) {
      levels = 0;
      posture = "entry_only";
      reasonCodes.push("directional_conflict");
    }

    if (context.fundamental.highImpactCount > 0) {
      levels = 0;
      marginUsage = Math.min(marginUsage, 0.5);
      posture = "entry_only";
      reasonCodes.push("fundamental_high_impact");
    } else if (context.fundamental.newsCount + context.fundamental.eventCount > 0) {
      reasonCodes.push("fundamental_present");
    } else {
      reasonCodes.push("fundamental_clear");
    }
    if (context.fundamental.marketStatus === "invalidate") {
      levels = 0;
      posture = "entry_only";
      reasonCodes.push("live_plan_invalidated");
    } else if (context.fundamental.marketStatus === "hold_scaling") {
      levels = 0;
      posture = "entry_only";
      reasonCodes.push("live_scaling_hold");
    } else if (context.fundamental.marketStatus === "caution") {
      levels = 0;
      posture = "entry_only";
      reasonCodes.push("live_market_caution");
    }
  }

  if (levels > 0) reasonCodes.push("staged_add_condition");

  const marginBudget = availableMargin * marginUsage;
  const maximumLoss = availableMargin * (riskPercent / 100);
  const normalizedMinimumLot = minimumLot ?? 0.1;
  const normalizedMaximumLot = maximumLot ?? 0.9;
  const sideLevels = levels > 0 && typeof scalingSide === "string"
    ? { buy: scalingSide === "buy" ? levels : 0, sell: scalingSide === "sell" ? levels : 0 }
    : { buy: 0, sell: 0 };
  const candidates: Partial<Record<"buy" | "sell", AdaptivePositionPlanResult>> = {};
  const sideInitialLots: Partial<Record<"buy" | "sell", number>> = {};
  let fallback: AdaptivePositionPlanResult | null = null;

  for (const side of ["buy", "sell"] as const) {
    for (let units = Math.floor(normalizedMaximumLot * 100); units >= Math.ceil(normalizedMinimumLot * 100); units -= 1) {
      const initialLot = units / 100;
      const accountTier: AccountTier = initialLot < 0.1 ? "micro" : initialLot <= 0.9 ? "mini" : "regular";
      const result = buildAdaptivePositionPlan({
        instrument,
        tradePlan,
        equity: maximumLoss,
        freeMargin: marginBudget,
        existingExposure: existingExposure ?? 0,
        marginPerLot,
        minimumLot: normalizedMinimumLot,
        maximumLot: normalizedMaximumLot,
        facilityFeeUsdPerLotPerSide,
        vatPercent,
        initialLot,
        accountTier,
        levels,
        sideLevels,
        maxCycleLossPercent: 2,
        maxLossAmount: maximumLoss,
      });
      fallback ??= result;
      if (result[side] && result.sideErrors[side].length === 0) {
        candidates[side] = result;
        sideInitialLots[side] = initialLot;
        break;
      }
    }
  }

  const buyResult = candidates.buy;
  const sellResult = candidates.sell;
  const buy = buyResult?.buy ?? null;
  const sell = sellResult?.sell ?? null;
  const result = buyResult ?? sellResult ?? fallback;
  if (!result) {
    return {
      result: {
        valid: false,
        market,
        rule: market ? MARKET_RULES[market] : null,
        errors: ["No safe position size is available."],
        sideErrors: { buy: [], sell: [] },
        assumptions: [],
        buy: null,
        sell: null,
        marginAllocated: 0,
        marginBuffer: marginBudget,
        maximumLoss,
        potentialResult: 0,
        breakEvenWinRate: null,
      },
      recommendation: null,
      context,
      decision: { posture, preferredSide: "both", reasonCodes },
    };
  }

  const sideErrors = {
    buy: buyResult?.sideErrors.buy ?? result.sideErrors.buy,
    sell: sellResult?.sideErrors.sell ?? result.sideErrors.sell,
  };
  const errors = [...new Set([...sideErrors.buy, ...sideErrors.sell])];
  const valid = Boolean(buy || sell);
  const marginAllocated = Math.max(buy?.marginRequired ?? 0, sell?.marginRequired ?? 0);
  const potentialResult = Math.max(buy?.potentialProfit ?? 0, sell?.potentialProfit ?? 0);
  const plannedLoss = Math.max(buy?.estimatedCycleLoss ?? 0, sell?.estimatedCycleLoss ?? 0);

  return {
    result: {
      ...result,
      valid,
      errors,
      sideErrors,
      buy,
      sell,
      marginAllocated,
      marginBuffer: Math.max(0, marginBudget - marginAllocated),
      maximumLoss,
      potentialResult,
      breakEvenWinRate: potentialResult > 0 ? plannedLoss / (plannedLoss + potentialResult) : null,
    },
    recommendation: valid ? { riskPercent, marginBudget, maximumLoss } : null,
    context,
    decision: { posture: valid ? posture : "entry_only", preferredSide: "both", reasonCodes },
  };
}