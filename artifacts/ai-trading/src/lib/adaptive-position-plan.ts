import type {
  FundamentalContext,
  StandardTradingRuleInstrument,
  TradePlan,
  TradeSide,
} from "@workspace/api-client-react";

export type AdaptiveMarket = "gold" | "brent" | "hang_seng" | "nikkei";
export type AccountTier = "micro" | "mini" | "regular";
export type AdaptiveRiskStyle = "conservative" | "balanced" | "aggressive";
export type AdaptivePlanPosture = "scaling_allowed" | "entry_only" | "not_recommended";
export type AdaptiveLayerBasis = "analysis_entry" | "entry_zone_edge" | "current_chart_swing";
export type AdaptiveLayerRejectReason = "day_margin" | "loss_ceiling" | "tier_limit" | "analysis_limit";
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
  accountTier: AccountTier;
  marginBasis: "day";
  contractSize: number;
  minMovement: number;
  marginPerLot: number;
  marginAtMinimumLot: number;
  minimumLot: number;
  maximumLot: number | null;
  lotStep: number;
  minimumOpeningFunds: number | null;
  maxGapPercent: number | null;
  source: "TP Standard Trading Rules";
}

export interface AdaptivePositionPlanInput {
  instrument: string;
  tradePlan: TradePlan;
  standardRule: StandardTradingRuleInstrument | null;
  availableFunds: number | null;
  maximumLoss: number | null;
  existingExposure: number | null;
  initialLot: number | null;
  accountTier: AccountTier;
  levels: number;
  sideLevels?: { buy?: number; sell?: number };
  includedSides?: { buy: boolean; sell: boolean };
  layerLotFactors?: readonly number[];
  checkpointPrices?: { buy?: number[]; sell?: number[] };
}

export interface AdaptiveChartCandle {
  high: number;
  low: number;
}

export interface AdaptiveLadderLevel {
  level: number;
  price: number;
  lot: number;
  cumulativeLots: number;
  estimatedRiskToStop: number;
  distanceFromEntry: number;
  riskToStopForLot: number;
  dayMarginForLot: number;
  cumulativeDayMargin: number;
  profitToTakeProfit1: number | null;
  profitToTakeProfit2: number | null;
  cumulativeProfitToTakeProfit1: number | null;
  cumulativeProfitToTakeProfit2: number | null;
  basis: AdaptiveLayerBasis;
  invalidationProgress: number;
  reason: string;
}

export interface AdaptiveRejectedLadderLevel extends AdaptiveLadderLevel {
  rejectReason: AdaptiveLayerRejectReason;
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
  weightedAverageEntry: number;
  totalFundsAtStop: number;
  profitToTakeProfit1: number | null;
  profitToTakeProfit2: number | null;
  riskRewardToTakeProfit1: number | null;
  riskRewardToTakeProfit2: number | null;
  ladder: AdaptiveLadderLevel[];
  rejectedLadder: AdaptiveRejectedLadderLevel[];
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
    positions: number;
    marginBudget: number;
    maximumLoss: number;
    riskStyle: AdaptiveRiskStyle;
  } | null;
  context: AdaptivePlanContext;
  decision: AdaptivePlanDecision;
}

const ADAPTIVE_RISK_STYLE_FACTORS: Record<AdaptiveRiskStyle, readonly number[]> = {
  conservative: [0.75, 0.5],
  balanced: [1, 0.75],
  aggressive: [1, 1],
};

export function isAdaptiveRiskStyle(value: unknown): value is AdaptiveRiskStyle {
  return value === "conservative" || value === "balanced" || value === "aggressive";
}

export function getAdaptiveLayerLotFactors(
  riskStyle: AdaptiveRiskStyle = "conservative",
): readonly number[] {
  return ADAPTIVE_RISK_STYLE_FACTORS[riskStyle];
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
  hang_seng: {
    label: "Hang Seng Index",
    maxGapPercent: null,
  },
  nikkei: {
    label: "Nikkei Index",
    maxGapPercent: null,
  },
};

const ACCOUNT_TIER_SPECS: Record<AccountTier, {
  minimumLot: number;
  maximumLot: number | null;
  lotStep: number;
  marginMultiplierFromMini: number;
  contractMultiplierFromMini: number;
  minimumOpeningFunds: number | null;
}> = {
  micro: {
    minimumLot: 0.01,
    maximumLot: 0.09,
    lotStep: 0.01,
    marginMultiplierFromMini: 0.1,
    contractMultiplierFromMini: 0.1,
    minimumOpeningFunds: 50,
  },
  mini: {
    minimumLot: 0.1,
    maximumLot: 0.9,
    lotStep: 0.1,
    marginMultiplierFromMini: 1,
    contractMultiplierFromMini: 1,
    minimumOpeningFunds: null,
  },
  regular: {
    minimumLot: 1,
    maximumLot: null,
    lotStep: 1,
    marginMultiplierFromMini: 10,
    contractMultiplierFromMini: 10,
    minimumOpeningFunds: null,
  },
};

function standardMarketForInstrument(instrument: string): AdaptiveMarket | null {
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
  if (
    normalized.includes("HKK50BBJ") ||
    normalized === "HSI" ||
    normalized.includes("HANGSENG")
  ) {
    return "hang_seng";
  }
  if (
    normalized.includes("JPK50BBJ") ||
    normalized.includes("NIKKEI")
  ) {
    return "nikkei";
  }
  return null;
}

/**
 * Adaptive is intentionally narrower than the Standard Plan. The saved
 * analysis identity must be the canonical XAU/USD symbol; aliases such as
 * GOLD, XAUUSD, or the broker rule code must not silently enable it.
 */
export function isXauUsdMiniAdaptiveInstrument(instrument: string): boolean {
  return instrument.trim().toUpperCase() === "XAU/USD";
}

function adaptiveMarketForInstrument(instrument: string): AdaptiveMarket | null {
  return isXauUsdMiniAdaptiveInstrument(instrument) ? "gold" : null;
}

function standardCodeForMarket(market: AdaptiveMarket): StandardTradingRuleInstrument["code"] {
  switch (market) {
    case "gold": return "XUL10";
    case "brent": return "BCO10_BBJ";
    case "hang_seng": return "HKK50_BBJ";
    case "nikkei": return "JPK50_BBJ";
  }
}

export function getStandardTradingRuleCode(
  instrument: string,
): StandardTradingRuleInstrument["code"] | null {
  const market = standardMarketForInstrument(instrument);
  return market ? standardCodeForMarket(market) : null;
}

export function getAdaptiveStandardRuleCode(
  instrument: string,
): StandardTradingRuleInstrument["code"] | null {
  const market = adaptiveMarketForInstrument(instrument);
  return market ? standardCodeForMarket(market) : null;
}

function numericValues(value: string | number | null | undefined): number[] {
  if (value == null) return [];
  return String(value)
    .replace(/,/g, "")
    // Level descriptions from Pro commonly include a timeframe, such as
    // "di atas 4680 setelah breakout H1" or "pullback 4H". Those digits are
    // metadata, not part of the price. Without stripping them, an entry
    // zone can be parsed as a range between the price and the timeframe
    // number, producing an incorrect distance and a false "no safe plan".
    .replace(/\b[HMDWhmdw]\d{1,3}\b/g, " ")
    .replace(/\b\d{1,3}[mhdwMHDW]\b/g, " ")
    .match(/-?\d+(?:\.\d+)?/g)
    ?.map(Number)
    .filter(Number.isFinite) ?? [];
}

function ruleFromStandardTradingRules(
  instrument: string,
  standardRule: StandardTradingRuleInstrument | null | undefined,
  accountTier: AccountTier,
): AdaptiveRule | null {
  const market = adaptiveMarketForInstrument(instrument);
  if (accountTier !== "mini") return null;
  if (!market || !standardRule || standardRule.code !== standardCodeForMarket(market)) return null;

  const minMovement = numericValues(standardRule.minimumPriceMovement)[0];
  const tier = ACCOUNT_TIER_SPECS[accountTier];
  const marginAtMinimumLot = standardRule.initialMarginUsdPerLot * tier.marginMultiplierFromMini;
  const marginPerLot = marginAtMinimumLot / tier.minimumLot;
  // The supplied trading-rule table is the Mini profile. Micro is one tenth
  // of Mini and Regular is ten times Mini for both margin and contract value.
  const contractSize = standardRule.contractSize * tier.contractMultiplierFromMini;
  if (
    !Number.isFinite(contractSize) ||
    contractSize <= 0 ||
    !Number.isFinite(minMovement) ||
    minMovement <= 0 ||
    !Number.isFinite(marginAtMinimumLot) ||
    marginAtMinimumLot <= 0 ||
    !Number.isFinite(marginPerLot) ||
    marginPerLot <= 0
  ) {
    return null;
  }

  return {
    market,
    label: MARKET_GUARDRAILS[market].label,
    accountTier,
    marginBasis: "day",
    contractSize,
    minMovement,
    marginPerLot,
    marginAtMinimumLot,
    minimumLot: tier.minimumLot,
    maximumLot: tier.maximumLot,
    lotStep: tier.lotStep,
    minimumOpeningFunds: tier.minimumOpeningFunds,
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

function entryRangeFromTradeSide(side: TradeSide): { low: number; high: number; midpoint: number } | null {
  const values = numericValues(side.entryZone);
  if (values.length === 0) return null;
  const low = Math.min(values[0], values[1] ?? values[0]);
  const high = Math.max(values[0], values[1] ?? values[0]);
  return { low, high, midpoint: (low + high) / 2 };
}

function roundPrice(value: number, minMovement: number): number {
  const decimals = Math.max(0, (String(minMovement).split(".")[1] ?? "").length);
  return Number((Math.round(value / minMovement) * minMovement).toFixed(decimals));
}

function roundLot(value: number, step = 0.01): number {
  return Number((Math.round(value / step) * step).toFixed(2));
}

function floorLot(value: number, step = 0.01): number {
  return Number((Math.floor((value + Number.EPSILON) / step) * step).toFixed(2));
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

export function getAdaptiveChartCandidatePrices(
  candles: AdaptiveChartCandle[],
  tradePlan: TradePlan,
  minMovement: number,
): { buy: number[]; sell: number[] } {
  const recent = candles
    .filter((candle) => Number.isFinite(candle.high) && Number.isFinite(candle.low) && candle.high >= candle.low)
    .slice(-160);
  const candidates: { buy: number[]; sell: number[] } = { buy: [], sell: [] };
  if (recent.length < 5 || !Number.isFinite(minMovement) || minMovement <= 0) return candidates;

  const collect = (side: "buy" | "sell"): number[] => {
    const tradeSide = tradePlan[side];
    const entry = priceFromTradeSide(tradeSide, "entryZone");
    const stop = priceFromTradeSide(tradeSide, "stopLoss");
    if (entry == null || stop == null) return [];
    const distance = Math.abs(entry - stop);
    const minimumSeparation = Math.max(minMovement * 2, distance * 0.025);
    const raw: number[] = [];
    for (let index = 2; index < recent.length - 2; index += 1) {
      const candle = recent[index];
      const neighbors = [
        recent[index - 2],
        recent[index - 1],
        recent[index + 1],
        recent[index + 2],
      ];
      const isSwing = side === "buy"
        ? neighbors.every((neighbor) => candle.low <= neighbor.low)
        : neighbors.every((neighbor) => candle.high >= neighbor.high);
      const price = side === "buy" ? candle.low : candle.high;
      const insideSavedRiskPath = side === "buy"
        ? price > stop && price < entry
        : price < stop && price > entry;
      if (isSwing && insideSavedRiskPath) raw.push(roundPrice(price, minMovement));
    }
    const ordered = [...new Set(raw)].sort((a, b) =>
      side === "buy" ? b - a : a - b,
    );
    return ordered.filter((price, index, accepted) =>
      index === 0 || accepted.slice(0, index).every((other) => Math.abs(other - price) >= minimumSeparation),
    ).slice(0, 6);
  };

  candidates.buy = collect("buy");
  candidates.sell = collect("sell");
  return candidates;
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
  const entryRange = entryRangeFromTradeSide(tradeSide);
  const rawEntry = entryRange?.midpoint ?? null;
  const rawStopLoss = priceFromTradeSide(tradeSide, "stopLoss");
  if (rawEntry == null || rawStopLoss == null || rawEntry === rawStopLoss || input.initialLot == null) return null;
  const entry = roundPrice(rawEntry, rule.minMovement);
  const stopLoss = roundPrice(rawStopLoss, rule.minMovement);
  const takeProfit1Value = priceFromTradeSide(tradeSide, "takeProfit1");
  const takeProfit2Value = priceFromTradeSide(tradeSide, "takeProfit2");
  const takeProfit1 = takeProfit1Value == null ? null : roundPrice(takeProfit1Value, rule.minMovement);
  const takeProfit2 = takeProfit2Value == null ? null : roundPrice(takeProfit2Value, rule.minMovement);

  const distance = side === "buy" ? entry - stopLoss : stopLoss - entry;
  const ladder: AdaptiveLadderLevel[] = [];
  const lotStep = rule.lotStep;
  const initialLot = roundLot(input.initialLot, lotStep);
  const profitForLot = (price: number, target: number | null, lot: number): number | null => {
    if (target == null) return null;
    const move = side === "buy" ? target - price : price - target;
    return move > 0 ? move * rule.contractSize * lot : null;
  };
  const checkpointProgress: Array<{ progress: number; basis: AdaptiveLayerBasis }> = [];
  const adverseEdge = entryRange == null
    ? entry
    : roundPrice(side === "buy" ? entryRange.low : entryRange.high, rule.minMovement);
  const edgeProgress = Math.abs(entry - adverseEdge) / distance;
  if (adverseEdge !== entry && adverseEdge !== stopLoss && edgeProgress > 0 && edgeProgress < 1) {
    checkpointProgress.push({ progress: edgeProgress, basis: "entry_zone_edge" });
  }
  for (const price of input.checkpointPrices?.[side] ?? []) {
    const progress = Math.abs(entry - roundPrice(price, rule.minMovement)) / distance;
    if (!Number.isFinite(progress) || progress <= 0 || progress >= 1) continue;
    if (checkpointProgress.some((candidate) => Math.abs(candidate.progress - progress) < 1e-6)) continue;
    checkpointProgress.push({ progress, basis: "current_chart_swing" });
  }
  checkpointProgress.sort((a, b) => a.progress - b.progress);

  const plannedEntries = [
    { price: entry, lot: initialLot, basis: "analysis_entry" as const, invalidationProgress: 0 },
    ...checkpointProgress.slice(0, levels).map(({ progress, basis }, index) => {
      const requestedFactor = input.layerLotFactors?.[index] ?? 1;
      const requestedLot = initialLot * Math.min(1, Math.max(0, requestedFactor));
      return {
        price: roundPrice(
          side === "buy" ? entry - distance * progress : entry + distance * progress,
          rule.minMovement,
        ),
        lot: Math.max(rule.minimumLot, floorLot(requestedLot, lotStep)),
        basis,
        invalidationProgress: progress,
      };
    }),
  ];

  let cumulativeLots = 0;
  let cumulativeRisk = 0;
  let cumulativeDayMargin = 0;
  let cumulativeProfitToTakeProfit1: number | null = takeProfit1 == null ? null : 0;
  let cumulativeProfitToTakeProfit2: number | null = takeProfit2 == null ? null : 0;
  let weightedEntryTotal = 0;
  for (const [level, planned] of plannedEntries.entries()) {
    cumulativeLots = roundLot(cumulativeLots + planned.lot, lotStep);
    const riskToStopForLot =
      (side === "buy" ? planned.price - stopLoss : stopLoss - planned.price) *
      rule.contractSize *
      planned.lot;
    const dayMarginForLot = planned.lot * rule.marginPerLot;
    const profitToTakeProfit1 = profitForLot(planned.price, takeProfit1, planned.lot);
    const profitToTakeProfit2 = profitForLot(planned.price, takeProfit2, planned.lot);
    cumulativeRisk += riskToStopForLot;
    cumulativeDayMargin += dayMarginForLot;
    weightedEntryTotal += planned.price * planned.lot;
    cumulativeProfitToTakeProfit1 =
      cumulativeProfitToTakeProfit1 == null || profitToTakeProfit1 == null
        ? null
        : cumulativeProfitToTakeProfit1 + profitToTakeProfit1;
    cumulativeProfitToTakeProfit2 =
      cumulativeProfitToTakeProfit2 == null || profitToTakeProfit2 == null
        ? null
        : cumulativeProfitToTakeProfit2 + profitToTakeProfit2;
    ladder.push({
      level,
      price: planned.price,
      lot: planned.lot,
      cumulativeLots,
      estimatedRiskToStop: cumulativeRisk,
      distanceFromEntry: Math.abs(entry - planned.price),
      riskToStopForLot,
      dayMarginForLot,
      cumulativeDayMargin,
      profitToTakeProfit1,
      profitToTakeProfit2,
      cumulativeProfitToTakeProfit1,
      cumulativeProfitToTakeProfit2,
      basis: planned.basis,
      invalidationProgress: planned.invalidationProgress,
      reason: planned.basis === "analysis_entry"
        ? "Initial entry from the saved Standard Plan."
        : planned.basis === "entry_zone_edge"
          ? "Conditional checkpoint at the adverse edge of the saved analysis entry zone."
          : `Conditional current-chart swing inside the saved analysis entry-to-stop path (${Math.round(planned.invalidationProgress * 100)}% toward the final stop).`,
    });
  }

  const weightedAverageEntry = weightedEntryTotal / cumulativeLots;
  const profitToTakeProfit1 = ladder.at(-1)?.cumulativeProfitToTakeProfit1 ?? null;
  const profitToTakeProfit2 = ladder.at(-1)?.cumulativeProfitToTakeProfit2 ?? null;

  return {
    side,
    entry,
    stopLoss,
    takeProfit1,
    takeProfit2,
    totalLots: cumulativeLots,
    marginRequired: cumulativeLots * rule.marginPerLot,
    estimatedCycleLoss: cumulativeRisk,
    weightedAverageEntry: roundPrice(weightedAverageEntry, rule.minMovement),
    totalFundsAtStop: cumulativeDayMargin + cumulativeRisk,
    profitToTakeProfit1,
    profitToTakeProfit2,
    riskRewardToTakeProfit1:
      profitToTakeProfit1 == null || cumulativeRisk <= 0 ? null : profitToTakeProfit1 / cumulativeRisk,
    riskRewardToTakeProfit2:
      profitToTakeProfit2 == null || cumulativeRisk <= 0 ? null : profitToTakeProfit2 / cumulativeRisk,
    ladder,
    rejectedLadder: [],
  };
}

export function getAdaptiveMarketRule(
  instrument: string,
  standardRule: StandardTradingRuleInstrument | null | undefined,
  accountTier: AccountTier = "mini",
): AdaptiveRule | null {
  return ruleFromStandardTradingRules(instrument, standardRule, accountTier);
}

export function getAdaptiveMarginCapacity(
  availableMargin: number | null,
  rule: AdaptiveRule | null,
): number {
  if (availableMargin == null || availableMargin <= 0 || !rule) return 0;
  const affordable = availableMargin / rule.marginPerLot;
  const capped = rule.maximumLot == null
    ? affordable
    : Math.min(affordable, rule.maximumLot);
  const units = Math.floor((capped + Number.EPSILON) / rule.lotStep);
  const lot = roundLot(units * rule.lotStep, rule.lotStep);
  return lot >= rule.minimumLot ? lot : 0;
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
  checkpointPrices,
  riskStyle = "conservative",
}: {
  instrument: string;
  tradePlan: TradePlan;
  context: AdaptiveAnalysisContext;
  standardRule: StandardTradingRuleInstrument | null | undefined;
  checkpointPrices?: { buy?: number[]; sell?: number[] };
  riskStyle?: AdaptiveRiskStyle;
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
    checkpointPrices: checkpointPrices ?? null,
    riskStyle,
  });
}

export function buildAdaptivePositionPlan(input: AdaptivePositionPlanInput): AdaptivePositionPlanResult {
  const market = adaptiveMarketForInstrument(input.instrument);
  const rule = ruleFromStandardTradingRules(input.instrument, input.standardRule, input.accountTier);
  const errors: string[] = [];
  const includeBuy = input.includedSides?.buy ?? true;
  const includeSell = input.includedSides?.sell ?? true;

  if (!market) errors.push("Adaptive position planning is available only for the canonical XAU/USD instrument.");
  if (input.accountTier !== "mini") errors.push("Adaptive position planning is temporarily available only for the Mini tier.");
  else if (!rule) errors.push("TP Standard Trading Rules are unavailable for this instrument.");
  if (!includeBuy && !includeSell) errors.push("At least one trade-plan side must be included.");
  if (input.availableFunds == null || input.availableFunds <= 0) errors.push("Available trading funds are required.");
  if (input.maximumLoss == null || input.maximumLoss <= 0) errors.push("Maximum acceptable loss is required.");
  if (
    input.availableFunds != null &&
    input.maximumLoss != null &&
    input.maximumLoss > input.availableFunds
  ) {
    errors.push("Maximum acceptable loss cannot exceed available trading funds.");
  }
  if (input.existingExposure == null || input.existingExposure < 0) errors.push("Existing exposure is required.");
  if (input.initialLot == null || input.initialLot <= 0) errors.push("Initial lot is required.");
  if (!Number.isInteger(input.levels) || input.levels < 0 || input.levels > 2) {
    errors.push("Number of additional levels must be between 0 and 2.");
  }
  for (const [side, sideLevel] of Object.entries(input.sideLevels ?? {})) {
    if (
      sideLevel !== undefined &&
      (!Number.isInteger(sideLevel) || sideLevel < 0 || sideLevel > 2 || sideLevel > input.levels)
    ) {
      errors.push(`${side === "buy" ? "Buy" : "Sell"} additional levels must be an integer between 0 and the requested level count.`);
    }
  }

  const minimumLot = rule?.minimumLot ?? ACCOUNT_TIER_SPECS[input.accountTier].minimumLot;
  const maximumLot = rule?.maximumLot ?? ACCOUNT_TIER_SPECS[input.accountTier].maximumLot;
  const lotStep = rule?.lotStep ?? ACCOUNT_TIER_SPECS[input.accountTier].lotStep;
  if (input.initialLot != null && (input.initialLot < minimumLot || (maximumLot != null && input.initialLot > maximumLot))) {
    errors.push(`Initial lot must be within the ${input.accountTier} tier range.`);
  }
  if (input.initialLot != null && input.initialLot > 0 && !isLotAligned(input.initialLot, lotStep)) {
    errors.push(`Initial lot must use ${lotStep.toFixed(2)} lot increments for the ${input.accountTier} tier.`);
  }

  if (!rule) {
    return { valid: false, market, rule: null, errors, assumptions: [], buy: null, sell: null };
  }

  const maxCycleLoss = input.maximumLoss ?? 0;
  const buyGeometryError = includeBuy ? sideGeometryError("buy", input.tradePlan.buy) : null;
  const sellGeometryError = includeSell ? sideGeometryError("sell", input.tradePlan.sell) : null;
  if (buyGeometryError) errors.push(buyGeometryError);
  if (sellGeometryError) errors.push(sellGeometryError);
  const buy = !includeBuy || buyGeometryError ? null : sidePlan("buy", input.tradePlan.buy, input, rule, input.sideLevels?.buy);
  const sell = !includeSell || sellGeometryError ? null : sidePlan("sell", input.tradePlan.sell, input, rule, input.sideLevels?.sell);

  const tierMax = rule.maximumLot;
  const plans = [buy, sell].filter((plan): plan is AdaptiveSidePositionPlan => plan != null);
  for (const plan of plans) {
    if (tierMax != null && plan.totalLots > tierMax) {
      errors.push(`The ${input.accountTier} tier caps total open exposure at ${tierMax.toFixed(2)} lot.`);
    }
    if (tierMax != null && (input.existingExposure ?? 0) + plan.totalLots > tierMax) {
      errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} exposure plus current open lots exceeds the Mini tier limit.`);
    }
    if (plan.marginRequired > (input.availableFunds ?? 0)) {
      errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} margin exceeds available trading funds.`);
    }
    if (plan.estimatedCycleLoss > maxCycleLoss) {
      errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} loss at the final Stop Loss exceeds the entered maximum loss.`);
    }
    if (plan.totalFundsAtStop > (input.availableFunds ?? 0)) {
      errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} day margin plus loss at the final Stop Loss exceeds available trading funds.`);
    }
    if (plan.ladder.some((level) => level.price === plan.stopLoss)) {
      errors.push(`${plan.side === "buy" ? "Buy" : "Sell"} ladder overlaps the Standard Plan stop loss.`);
    }
  }

  const tierText = tierMax == null ? `${rule.minimumLot.toFixed(2)} lot and above` : `${rule.minimumLot.toFixed(2)}–${tierMax.toFixed(2)} lot`;
  const movementAssumption = rule.maxGapPercent == null
    ? `Minimum movement from ${rule.source}: ${rule.minMovement}; no percentage gap limit is assumed because the source rule does not provide one.`
    : `Minimum movement from ${rule.source}: ${rule.minMovement}; a gap above ${rule.maxGapPercent}% is treated as an external execution risk.`;
  const assumptions = [
    `Mini profile: USD ${rule.marginAtMinimumLot} margin for ${rule.minimumLot.toFixed(2)} lot; contract size ${rule.contractSize} ${input.standardRule?.contractUnit ?? "units"} per lot from ${rule.source}.`,
    movementAssumption,
    `Initial entry uses the Standard Plan; up to two smaller manual additions can create at most three total positions (${tierText}). No add uses a martingale multiplier.`,
    `The entered USD ${maxCycleLoss} maximum loss is a hard amount for every position in the complete plan.`,
    "Available trading funds are used directly; no hidden tier or risk-style percentage reduces them.",
    `Current open XAU/USD Mini exposure is ${input.existingExposure ?? 0} lot and is included in the 0.90-lot tier limit.`,
    "This Adaptive Position Plan is for day trading only: it uses the day/initial margin and excludes overnight holding, rollover, and overnight fees from every calculation.",
    "Broker auto-liquidation, spread, facility fee, VAT, slippage, and rejected orders are external risks and are not used to move ladder levels.",
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

function addRejectedCandidates(
  accepted: AdaptivePositionPlanResult,
  candidate: AdaptivePositionPlanResult,
  marginBudget: number,
  maximumLoss: number,
  analysisLevelLimit: number,
): AdaptivePositionPlanResult {
  const decorate = (
    acceptedSide: AdaptiveSidePositionPlan | null,
    candidateSide: AdaptiveSidePositionPlan | null,
  ): AdaptiveSidePositionPlan | null => {
    if (!acceptedSide || !candidateSide) return acceptedSide;
    const rejectedLadder = candidateSide.ladder
      .slice(acceptedSide.ladder.length)
      .map((level): AdaptiveRejectedLadderLevel => ({
        ...level,
        rejectReason:
          candidate.rule?.maximumLot != null && level.cumulativeLots > candidate.rule.maximumLot
            ? "tier_limit"
            : level.cumulativeDayMargin > marginBudget
              ? "day_margin"
              : level.estimatedRiskToStop > maximumLoss
                ? "loss_ceiling"
                : level.level > analysisLevelLimit
                  ? "analysis_limit"
                  : "analysis_limit",
      }));
    return { ...acceptedSide, rejectedLadder };
  };

  return {
    ...accepted,
    buy: decorate(accepted.buy, candidate.buy),
    sell: decorate(accepted.sell, candidate.sell),
  };
}

/**
 * Builds a practical position-size recommendation from the user's available
 * margin and the entry/stop levels already produced by the AI analysis.
 * The user enters a hard USD loss cap directly, so there is no synthetic
 * equity or hidden risk-style allocation.
 */
export function buildAdaptivePlanRecommendation({
  instrument,
  tradePlan,
  availableMargin,
  maximumLoss,
  existingExposure,
  standardRule,
  context: analysisContext,
  checkpointPrices,
  riskStyle = "conservative",
}: {
  instrument: string;
  tradePlan: TradePlan;
  availableMargin: number | null;
  maximumLoss: number | null;
  existingExposure: number | null;
  standardRule: StandardTradingRuleInstrument | null;
  context?: AdaptiveAnalysisContext;
  checkpointPrices?: { buy?: number[]; sell?: number[] };
  riskStyle?: AdaptiveRiskStyle;
}): AdaptivePlanRecommendation {
  const accountTier: AccountTier = "mini";
  const market = adaptiveMarketForInstrument(instrument);
  const rule = ruleFromStandardTradingRules(instrument, standardRule, accountTier);
  const context = normalizeContext(analysisContext);
  const reasonCodes: AdaptivePlanReasonCode[] = [];
  let posture: AdaptivePlanPosture = "scaling_allowed";
  let preferredSide: AdaptivePlanDecision["preferredSide"] = "both";
  if (
    availableMargin == null ||
    availableMargin <= 0 ||
    maximumLoss == null ||
    maximumLoss <= 0 ||
    existingExposure == null ||
    existingExposure < 0
  ) {
    const errors = [];
    if (availableMargin == null || availableMargin <= 0) errors.push("Available trading funds are required.");
    if (maximumLoss == null || maximumLoss <= 0) errors.push("Maximum acceptable loss is required.");
    if (existingExposure == null || existingExposure < 0) errors.push("Existing exposure is required.");
    return {
      result: {
        valid: false,
        market,
        rule,
        errors,
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
  if (maximumLoss > availableMargin) {
    return {
      result: {
        valid: false,
        market,
        rule,
        errors: ["Maximum acceptable loss cannot exceed available trading funds."],
        assumptions: [],
        buy: null,
        sell: null,
      },
      recommendation: null,
      context,
      decision: { posture: "entry_only", preferredSide: "none", reasonCodes: ["context_unavailable"] },
    };
  }

  const requestedLevels = 2;
  const layerLotFactors = getAdaptiveLayerLotFactors(riskStyle);
  let levels = requestedLevels;
  let softWarningCount = 0;

  if (!hasCompleteContext(context)) {
    posture = "entry_only";
    levels = 0;
    preferredSide = "none";
    reasonCodes.push("context_unavailable");
    if (!context.technical) reasonCodes.push("technical_unavailable");
    if (!context.fundamental.available) reasonCodes.push("fundamental_unavailable");
  } else {
    if (timeframeIsShort(context.timeframe)) {
      softWarningCount += 1;
      reasonCodes.push("short_timeframe");
    }
    if (context.riskLevel === "high") {
      softWarningCount += 1;
      reasonCodes.push("high_risk");
    }
    if (context.marketCondition === "volatile") {
      softWarningCount += 1;
      reasonCodes.push("volatile_market");
    }
    if (context.confidenceMax != null && context.confidenceMax < 70) {
      softWarningCount += 1;
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
      softWarningCount += 1;
      preferredSide = tradePlan.preferredSide === "buy" || tradePlan.preferredSide === "sell"
        ? tradePlan.preferredSide
        : "none";
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
        softWarningCount += 1;
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
      softWarningCount += 1;
      reasonCodes.push("fundamental_high_impact");
    } else if (context.fundamental.newsCount + context.fundamental.eventCount > 0) {
      reasonCodes.push("fundamental_present");
    } else {
      reasonCodes.push("fundamental_clear");
    }
    if (posture !== "not_recommended") {
      // Any soft warning removes all optional additions while preserving an
      // auditable entry-only result.
      levels = softWarningCount > 0 ? 0 : levels;
    }
  }

  if (levels > 0) reasonCodes.push("staged_add_condition");

  const marginBudget = availableMargin;
  const buyPlanAvailable = sideGeometryError("buy", tradePlan.buy) === null;
  const sellPlanAvailable = sideGeometryError("sell", tradePlan.sell) === null;

  const marginCapacity = getAdaptiveMarginCapacity(marginBudget, rule);
  const tierCapacity = Math.max(0, floorLot((rule.maximumLot ?? marginCapacity) - existingExposure, rule.lotStep));
  const capacity = Math.min(marginCapacity, tierCapacity);
  // The style only changes the requested taper. The solver still checks the
  // exact price-to-stop risk, day margin, and tier exposure for every row.
  const lotCandidates: number[] = [];
  for (
    let lot = capacity;
    lot >= rule.minimumLot - Number.EPSILON;
    lot = roundLot(lot - rule.lotStep, rule.lotStep)
  ) {
    lotCandidates.push(roundLot(lot, rule.lotStep));
  }
  // Try the analysis-supported three-position plan first, then degrade to two
  // or one total position until every hard limit passes.
  const levelCandidates = Array.from(
    { length: levels + 1 },
    (_, index) => levels - index,
  );
  for (const candidateLevels of levelCandidates) {
    for (const initialLot of lotCandidates) {
      const result = buildAdaptivePositionPlan({
        instrument,
        tradePlan,
        standardRule,
        availableFunds: marginBudget,
        maximumLoss,
        existingExposure,
        initialLot,
        accountTier,
        levels: candidateLevels,
        sideLevels:
          preferredSide === "buy"
            ? { buy: candidateLevels, sell: 0 }
            : preferredSide === "sell"
              ? { buy: 0, sell: candidateLevels }
              : { buy: candidateLevels, sell: candidateLevels },
        includedSides:
          preferredSide === "buy"
            ? { buy: true, sell: sellPlanAvailable }
            : preferredSide === "sell"
              ? { buy: buyPlanAvailable, sell: true }
              : { buy: buyPlanAvailable, sell: sellPlanAvailable },
        layerLotFactors: layerLotFactors.slice(0, candidateLevels),
        checkpointPrices,
      });
      if (result.valid) {
        if (posture === "not_recommended") {
          const diagnosticRecommendation = {
            initialLot,
            levels: 0,
            positions: 1,
            marginBudget,
            maximumLoss,
            riskStyle,
          };
          return {
            result: {
              ...result,
              valid: false,
              errors: [...result.errors, "The technical snapshot conflicts with the market direction."],
            },
            recommendation: diagnosticRecommendation,
            context,
            decision: { posture, preferredSide, reasonCodes },
          };
        }
        const acceptedLevels = Math.max(
          preferredSide === "buy" ? (result.buy?.ladder.length ?? 1) - 1 : 0,
          preferredSide === "sell" ? (result.sell?.ladder.length ?? 1) - 1 : 0,
          preferredSide === "both"
            ? Math.max(
                (result.buy?.ladder.length ?? 1) - 1,
                (result.sell?.ladder.length ?? 1) - 1,
              )
            : 0,
        );
        const effectivePosture =
          acceptedLevels === 0 && posture === "scaling_allowed"
            ? "entry_only"
            : posture;
        const effectiveReasonCodes =
          acceptedLevels === 0
            ? reasonCodes.filter((code) => code !== "staged_add_condition")
            : reasonCodes;
        const fullCandidate =
          candidateLevels < requestedLevels
            ? buildAdaptivePositionPlan({
                instrument,
                tradePlan,
                standardRule,
                availableFunds: marginBudget,
                maximumLoss,
                existingExposure,
                initialLot,
                accountTier,
                levels: requestedLevels,
                sideLevels:
                  preferredSide === "buy"
                    ? { buy: requestedLevels, sell: 0 }
                    : preferredSide === "sell"
                      ? { buy: 0, sell: requestedLevels }
                      : { buy: requestedLevels, sell: requestedLevels },
                includedSides:
                  preferredSide === "buy"
                    ? { buy: true, sell: sellPlanAvailable }
                    : preferredSide === "sell"
                      ? { buy: buyPlanAvailable, sell: true }
                      : { buy: buyPlanAvailable, sell: sellPlanAvailable },
                layerLotFactors,
                checkpointPrices,
              })
            : result;
        return {
          result: addRejectedCandidates(result, fullCandidate, marginBudget, maximumLoss, levels),
          recommendation: {
            initialLot,
            levels: acceptedLevels,
            positions: acceptedLevels + 1,
            marginBudget,
            maximumLoss,
            riskStyle,
          },
          context,
          decision: {
            posture: effectivePosture,
            preferredSide,
            reasonCodes: effectiveReasonCodes,
          },
        };
      }
    }
  }

  const diagnosticResult = buildAdaptivePositionPlan({
    instrument,
    tradePlan,
    standardRule,
    availableFunds: marginBudget,
    maximumLoss,
    existingExposure,
    initialLot: rule.minimumLot,
    accountTier,
    levels: 0,
    sideLevels: { buy: 0, sell: 0 },
    includedSides: { buy: buyPlanAvailable, sell: sellPlanAvailable },
    layerLotFactors: [],
    checkpointPrices,
  });
  return {
    result: diagnosticResult,
    recommendation: diagnosticResult.valid
      ? {
          initialLot: rule.minimumLot,
          levels: 0,
          positions: 1,
          marginBudget,
          maximumLoss,
          riskStyle,
        }
      : null,
    context,
    decision: { posture, preferredSide, reasonCodes },
  };
}