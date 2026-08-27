import type { TradePlan, TradeSide } from "@workspace/api-client-react";

export type AdaptiveMarket = "gold" | "brent";
export type AccountTier = "micro" | "mini" | "regular";
export type AdaptiveRiskPreference = "safe" | "balanced" | "active";

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
): AdaptiveSidePositionPlan | null {
  const entry = priceFromTradeSide(tradeSide, "entryZone");
  const stopLoss = priceFromTradeSide(tradeSide, "stopLoss");
  if (entry == null || stopLoss == null || entry === stopLoss || input.initialLot == null) return null;

  const distance = side === "buy" ? entry - stopLoss : stopLoss - entry;
  const ladder: AdaptiveLadderLevel[] = [];
  let cumulativeLots = input.initialLot;
  let estimatedCycleLoss = distance * contractSize * input.initialLot;

  ladder.push({
    level: 0,
    price: roundPrice(entry, rule.minMovement),
    lot: input.initialLot,
    cumulativeLots,
    estimatedRiskToStop: estimatedCycleLoss,
    reason: "Initial market entry from the Standard Plan.",
  });

  for (let level = 1; level <= input.levels; level += 1) {
    const adverseFraction = level / (input.levels + 1);
    const price =
      side === "buy"
        ? entry - distance * adverseFraction
        : entry + distance * adverseFraction;
    const previousLot = ladder[ladder.length - 1].lot;
    const lot = roundLot(previousLot * 1.5);
    cumulativeLots = roundLot(cumulativeLots + lot);
    const riskToStop = (side === "buy" ? price - stopLoss : stopLoss - price) * contractSize * lot;
    estimatedCycleLoss += riskToStop;
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
  if (!Number.isInteger(input.levels) || input.levels < 1 || input.levels > 6) {
    errors.push("Number of levels must be between 1 and 6.");
  }
  if (input.maxCycleLossPercent <= 0 || input.maxCycleLossPercent > 10) {
    errors.push("Maximum cycle loss must be between 0.1% and 10%.");
  }

  const tier = TIER_RANGES[input.accountTier];
  if (input.initialLot != null && (input.initialLot < tier.min || (tier.max != null && input.initialLot > tier.max))) {
    errors.push(`Initial lot must be within the ${input.accountTier} tier range.`);
  }

  if (!baseRule) {
    return { valid: false, market, rule: null, errors, assumptions: [], buy: null, sell: null };
  }

  // Gold/Brent contract size, price precision, and gap threshold are fixed
  // market guardrails. The user supplies account-specific margin only.
  const rule = baseRule;

  const marginPerLot = input.marginPerLot ?? 0;
  const maxCycleLoss = (input.equity ?? 0) * (input.maxCycleLossPercent / 100);
  const buyGeometryError = sideGeometryError("buy", input.tradePlan.buy);
  const sellGeometryError = sideGeometryError("sell", input.tradePlan.sell);
  if (buyGeometryError) errors.push(buyGeometryError);
  if (sellGeometryError) errors.push(sellGeometryError);
  const buy = buyGeometryError ? null : sidePlan("buy", input.tradePlan.buy, input, rule, rule.contractSize, marginPerLot);
  const sell = sellGeometryError ? null : sidePlan("sell", input.tradePlan.sell, input, rule, rule.contractSize, marginPerLot);

  const tierMax = tier.max;
  const plans = [buy, sell].filter((plan): plan is AdaptiveSidePositionPlan => plan != null);
  for (const plan of plans) {
    if (tierMax != null && plan.ladder.some((level) => level.lot > tierMax)) {
      errors.push(`The ${input.accountTier} tier caps each ladder entry at ${tierMax.toFixed(2)} lot.`);
    }
    if ((input.existingExposure ?? 0) + plan.totalLots > (input.freeMargin ?? 0) / marginPerLot) {
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
    `Contract size: ${rule.contractSize} units per lot; margin is supplied by the user and is not inferred from a broker.`,
    `Price movement is rounded to ${rule.minMovement}; a gap above ${rule.maxGapPercent}% is treated as an external execution risk.`,
    `Initial entry uses the Standard Plan; each add is 1.5× the prior lot and remains subject to the ${input.accountTier} range (${tierText}).`,
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
  marginPerLot,
  preference,
}: {
  instrument: string;
  tradePlan: TradePlan;
  availableMargin: number | null;
  marginPerLot: number | null;
  preference: AdaptiveRiskPreference;
}): AdaptivePlanRecommendation {
  const market = marketForInstrument(instrument);
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
    };
  }

  const profile = RECOMMENDATION_PROFILES[preference];
  const marginBudget = availableMargin * profile.marginUsage;
  const maximumLoss = Math.max(availableMargin * profile.riskBudget, 1);
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
      levels: profile.levels,
      maxCycleLossPercent: 2,
    });
    fallback ??= result;
    if (result.valid) {
      return {
        result,
        recommendation: {
          initialLot,
          levels: profile.levels,
          marginBudget,
          maximumLoss,
        },
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
  };
}