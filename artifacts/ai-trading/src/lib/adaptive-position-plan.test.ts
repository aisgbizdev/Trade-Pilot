import { describe, expect, it } from "vitest";
import type { StandardTradingRuleInstrument, TradePlan } from "@workspace/api-client-react";
import {
  buildAdaptivePlanRecommendation as buildAdaptivePlanRecommendationCore,
  buildAdaptivePositionPlan,
  createAdaptivePlanFingerprint,
  getAdaptiveChartCandidatePrices,
  getAdaptiveMarginCapacity,
  getAdaptiveMarketRule,
  getAdaptiveStandardRuleCode,
  getStandardTradingRuleCode,
  isXauUsdMiniAdaptiveInstrument,
} from "./adaptive-position-plan";

const CHART_CANDIDATES = {
  buy: [2299, 2297, 2295],
  sell: [2303, 2305, 2307],
};

const TRADE_PLAN: TradePlan = {
  preferredSide: "buy",
  buy: {
    entryZone: "2,300.00–2,302.00",
    stopLoss: "2,290.00",
    takeProfit1: "2,315.00",
    takeProfit2: "2,325.00",
    riskRewardRatio: "1:1.5",
    rationale: "Example",
  },
  sell: {
    entryZone: "2,300.00–2,302.00",
    stopLoss: "2,312.00",
    takeProfit1: "2,290.00",
    takeProfit2: "2,280.00",
    riskRewardRatio: "1:1.2",
    rationale: "Example",
  },
};

const GOLD_RULE: StandardTradingRuleInstrument = {
  code: "XUL10",
  product: "Gold (Loco London)",
  contractSize: 10,
  contractUnit: "troy ounce",
  tradingDays: "Monday–Friday",
  tradingHours: { summer: "06:00–03:30 WIB", winter: "06:00–04:30 WIB" },
  initialMarginUsdPerLot: 100,
  facilityFeeUsdPerLotPerSide: 1.5,
  vatPercent: 11,
  rolloverUsdPerLotPerNight: 0.5,
  priceSource: "Telequote",
  priceGuidance: "Last Trade",
  minimumSpread: "USD 0.40 / troy ounce / side",
  maximumSpread: "USD 1.00 / troy ounce / side",
  hecticSpread: "Based on market conditions",
  minimumPriceMovement: "USD 0.01 / troy ounce",
  limitStopRange: "USD 6–USD 20",
  deliveryBy: "Cash settlement",
};

const SUPPORTIVE_CONTEXT = {
  timeframe: "1h",
  marketCondition: "trending_up",
  riskLevel: "low",
  tradingBias: "bullish_strong",
  confidenceMin: 65,
  confidenceMax: 78,
  techBuyCount: 14,
  techSellCount: 4,
  techNeutralCount: 3,
  fundamentalContext: { newsItems: [], calendarEvents: [] },
};

const VALID_INPUT = {
  instrument: "XAU/USD",
  tradePlan: TRADE_PLAN,
  standardRule: GOLD_RULE,
  availableFunds: 5_000,
  maximumLoss: 500,
  existingExposure: 0,
  initialLot: 0.1,
  accountTier: "mini" as const,
  levels: 1,
  checkpointPrices: CHART_CANDIDATES,
};

function buildRecommendation(
  input: Partial<Parameters<typeof buildAdaptivePlanRecommendationCore>[0]> = {},
) {
  return buildAdaptivePlanRecommendationCore({
    instrument: "XAU/USD",
    tradePlan: TRADE_PLAN,
    availableMargin: 5_000,
    maximumLoss: 500,
    existingExposure: 0,
    standardRule: GOLD_RULE,
    context: SUPPORTIVE_CONTEXT,
    checkpointPrices: CHART_CANDIDATES,
    ...input,
  });
}

describe("XAU/USD Mini Adaptive Plan", () => {
  it("uses only the exact canonical XAU/USD identity for Adaptive", () => {
    expect(isXauUsdMiniAdaptiveInstrument("XAU/USD")).toBe(true);
    expect(isXauUsdMiniAdaptiveInstrument(" xau/usd ")).toBe(true);

    for (const alias of ["XAUUSD", "GOLD", "XUL10", "BRENT", "HSI", "NIKKEI", "EUR/USD"]) {
      expect(isXauUsdMiniAdaptiveInstrument(alias)).toBe(false);
      expect(getAdaptiveStandardRuleCode(alias)).toBeNull();
    }
    expect(getAdaptiveStandardRuleCode("XAU/USD")).toBe("XUL10");
  });

  it("keeps the broader Standard Plan resolver independent from Adaptive", () => {
    expect(getStandardTradingRuleCode("XAU/USD")).toBe("XUL10");
    expect(getStandardTradingRuleCode("BRENT")).toBe("BCO10_BBJ");
    expect(getStandardTradingRuleCode("HSI")).toBe("HKK50_BBJ");
    expect(getStandardTradingRuleCode("HANG SENG")).toBe("HKK50_BBJ");
    expect(getStandardTradingRuleCode("NIKKEI")).toBe("JPK50_BBJ");
    expect(getStandardTradingRuleCode("EUR/USD")).toBeNull();
  });

  it("exposes only the Mini rule to Adaptive while retaining its exact sizing", () => {
    const mini = getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "mini");

    expect(mini).toMatchObject({
      accountTier: "mini",
      minimumLot: 0.1,
      maximumLot: 0.9,
      lotStep: 0.1,
      contractSize: 10,
      marginAtMinimumLot: 100,
      marginPerLot: 1_000,
    });
    expect(getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "micro")).toBeNull();
    expect(getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "regular")).toBeNull();
    expect(getAdaptiveMarginCapacity(500, mini)).toBe(0.5);
  });

  it("builds a Buy recommendation with three total positions when analysis and limits support them", () => {
    const assessment = buildRecommendation();

    expect(assessment.result.valid).toBe(true);
    expect(assessment.recommendation).toMatchObject({
      levels: 2,
      positions: 3,
      marginBudget: 5_000,
      maximumLoss: 500,
    });
    expect(assessment.decision).toMatchObject({
      posture: "scaling_allowed",
      preferredSide: "buy",
    });
    expect(assessment.result.buy?.ladder).toHaveLength(3);
    expect(assessment.result.sell?.ladder).toHaveLength(1);
    expect(assessment.result.buy?.totalLots).toBe(1.9);
    expect(assessment.result.buy?.ladder.every((level) => level.lot <= 0.9)).toBe(true);
    expect(assessment.result.buy?.ladder[1]).toMatchObject({
      price: 2300,
      basis: "entry_zone_edge",
    });
    expect(assessment.result.buy?.ladder.map((level) => level.lot)).toEqual([0.9, 0.6, 0.4]);
  });

  it("builds the same three-position plan for a supported Sell analysis", () => {
    const assessment = buildRecommendation({
      tradePlan: { ...TRADE_PLAN, preferredSide: "sell" },
      context: {
        ...SUPPORTIVE_CONTEXT,
        marketCondition: "trending_down",
        tradingBias: "bearish_strong",
        techBuyCount: 4,
        techSellCount: 14,
      },
    });

    expect(assessment.result.valid).toBe(true);
    expect(assessment.decision.preferredSide).toBe("sell");
    expect(assessment.result.sell?.ladder).toHaveLength(3);
    expect(assessment.result.buy?.ladder).toHaveLength(1);
  });

  it("applies deterministic decreasing, mixed, and increasing lot profiles", () => {
    const conservative = buildRecommendation({ riskStyle: "conservative" });
    const balanced = buildRecommendation({ riskStyle: "balanced" });
    const aggressive = buildRecommendation({ riskStyle: "aggressive" });

    expect(conservative.recommendation?.riskStyle).toBe("conservative");
    expect(conservative.recommendation?.lotProfile).toBe("decreasing");
    expect(conservative.result.buy?.ladder.map((level) => level.lot)).toEqual([0.9, 0.6, 0.4]);
    expect(balanced.recommendation?.riskStyle).toBe("balanced");
    expect(balanced.recommendation?.lotProfile).toBe("mixed");
    expect(balanced.result.buy?.ladder.map((level) => level.lot)).toEqual([0.9, 0.9, 0.6]);
    expect(aggressive.recommendation?.riskStyle).toBe("aggressive");
    expect(aggressive.recommendation?.lotProfile).toBe("increasing");
    expect(aggressive.result.buy?.ladder.map((level) => level.lot)).toEqual([0.9, 0.9, 0.9]);

    for (const assessment of [conservative, balanced, aggressive]) {
      const ladder = assessment.result.buy?.ladder ?? [];
      expect(ladder.every((level) => level.lot <= 0.9)).toBe(true);
      expect(assessment.result.buy?.totalLots).toBeGreaterThan(0.9);
    }
  });

  it("can produce 0.4, 0.5, 0.6 while keeping the 0.9 limit on each position", () => {
    const assessment = buildRecommendation({
      riskStyle: "aggressive",
      maximumLoss: 150,
    });

    expect(assessment.recommendation).toMatchObject({
      riskStyle: "aggressive",
      lotProfile: "increasing",
      positions: 3,
    });
    expect(assessment.result.buy?.ladder.map((level) => level.lot)).toEqual([0.4, 0.5, 0.6]);
    expect(assessment.result.buy?.totalLots).toBe(1.5);
    expect(assessment.result.buy?.estimatedCycleLoss).toBeLessThanOrEqual(150);
  });

  it("changes an aggressive lot profile when the saved analysis is ranging", () => {
    const assessment = buildRecommendation({
      riskStyle: "aggressive",
      maximumLoss: 150,
      context: { ...SUPPORTIVE_CONTEXT, marketCondition: "ranging" },
    });

    expect(assessment.recommendation?.lotProfile).toBe("mixed");
    expect(assessment.result.buy?.ladder.map((level) => level.lot)).toEqual([0.5, 0.6, 0.3]);
  });

  it("uses the selected style for Sell while hard limits can still force entry-only", () => {
    const sell = buildRecommendation({
      riskStyle: "aggressive",
      tradePlan: { ...TRADE_PLAN, preferredSide: "sell" },
      context: {
        ...SUPPORTIVE_CONTEXT,
        marketCondition: "trending_down",
        tradingBias: "bearish_strong",
        techBuyCount: 4,
        techSellCount: 14,
      },
    });
    const constrained = buildRecommendation({ riskStyle: "aggressive", maximumLoss: 15 });

    expect(sell.result.sell?.ladder.map((level) => level.lot)).toEqual([0.9, 0.9, 0.9]);
    expect(constrained.recommendation).toMatchObject({
      riskStyle: "aggressive",
      lotProfile: "increasing",
      levels: 0,
      positions: 1,
    });
    expect(constrained.decision.posture).toBe("entry_only");
  });

  it("degrades from three to two total positions when the available funds cannot support all rows", () => {
    const assessment = buildRecommendation({
      availableMargin: 250,
      maximumLoss: 100,
    });

    expect(assessment.result.valid).toBe(true);
    expect(assessment.recommendation).toMatchObject({
      levels: 1,
      positions: 2,
    });
    expect(assessment.result.buy?.ladder).toHaveLength(2);
    expect(assessment.result.buy?.totalLots).toBe(0.2);
    expect(assessment.result.buy?.rejectedLadder.length).toBeGreaterThan(0);
  });

  it("uses all entered funds as the visible budget without a hidden allocation", () => {
    const assessment = buildRecommendation({ availableMargin: 1_234 });

    expect(assessment.recommendation?.marginBudget).toBe(1_234);
    expect(assessment.result.assumptions.join(" ")).toMatch(/used directly.*no hidden/i);
  });

  it("uses the entered maximum loss as an absolute hard ceiling", () => {
    const entryOnly = buildRecommendation({ maximumLoss: 15 });

    expect(entryOnly.result.valid).toBe(true);
    expect(entryOnly.recommendation).toMatchObject({
      levels: 0,
      positions: 1,
      maximumLoss: 15,
    });
    expect(entryOnly.decision.posture).toBe("entry_only");
    expect(entryOnly.result.buy?.ladder).toHaveLength(1);
    expect(entryOnly.result.buy?.rejectedLadder[0]?.rejectReason).toBe("loss_ceiling");
  });

  it("does not subtract existing exposure from the per-position Mini cap", () => {
    const assessment = buildRecommendation({ existingExposure: 0.9 });

    expect(assessment.result.valid).toBe(true);
    expect(assessment.result.buy?.ladder.every((level) => level.lot <= 0.9)).toBe(true);
    expect(assessment.result.buy?.totalLots).toBeGreaterThan(0.9);
    expect(assessment.result.assumptions.join(" ")).toMatch(/not subtracted.*per-position cap/i);
  });

  it("caps every requested layer independently instead of capping cumulative lots", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      availableFunds: 10_000,
      maximumLoss: 1_000,
      initialLot: 0.9,
      levels: 2,
      sideLevels: { buy: 2, sell: 0 },
      includedSides: { buy: true, sell: false },
      layerLotFactors: [2, 3],
    });

    expect(result.valid).toBe(true);
    expect(result.buy?.ladder.map((level) => level.lot)).toEqual([0.9, 0.9, 0.9]);
    expect(result.buy?.totalLots).toBe(2.7);
  });

  it("fails explicitly when any account input is missing", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      availableFunds: null,
      maximumLoss: null,
      existingExposure: null,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([
      "Available trading funds are required.",
      "Maximum acceptable loss is required.",
      "Existing exposure is required.",
    ]));
  });

  it("rejects a loss limit larger than the available funds", () => {
    const assessment = buildRecommendation({
      availableMargin: 100,
      maximumLoss: 101,
    });

    expect(assessment.recommendation).toBeNull();
    expect(assessment.result.errors).toContain(
      "Maximum acceptable loss cannot exceed available trading funds.",
    );
  });

  it("shows auditable lot, margin, risk, and target math", () => {
    const result = buildAdaptivePositionPlan(VALID_INPUT);
    const buy = result.buy!;

    expect(result.valid).toBe(true);
    expect(buy.ladder.map((level) => level.lot)).toEqual([0.1, 0.1]);
    expect(buy.ladder[0].basis).toBe("analysis_entry");
    expect(buy.ladder[1].basis).toBe("entry_zone_edge");
    expect(buy.marginRequired).toBe(200);
    expect(buy.estimatedCycleLoss).toBe(21);
    expect(buy.totalFundsAtStop).toBe(221);
    expect(buy.remainingFundsAtStop).toBe(4_779);
    expect(buy.ladder[0]).toMatchObject({
      dayMarginForLot: 100,
      cumulativeDayMargin: 100,
      riskToStopForLot: 11,
      estimatedRiskToStop: 11,
      cumulativeFundsAtStop: 111,
      remainingFundsAtStop: 4_889,
    });
    expect(buy.ladder[1]).toMatchObject({
      dayMarginForLot: 100,
      cumulativeDayMargin: 200,
      riskToStopForLot: 10,
      estimatedRiskToStop: 21,
      cumulativeFundsAtStop: 221,
      remainingFundsAtStop: 4_779,
    });
    expect(buy.profitToTakeProfit1).toBeGreaterThan(0);
    expect(buy.profitToTakeProfit2).toBeGreaterThan(buy.profitToTakeProfit1);
  });

  it("exposes the same financial breakdown for a rejected candidate layer", () => {
    const assessment = buildRecommendation({
      availableMargin: 250,
      maximumLoss: 100,
    });
    const rejected = assessment.result.buy?.rejectedLadder[0];

    expect(rejected).toBeDefined();
    expect(rejected).toMatchObject({
      dayMarginForLot: 100,
      cumulativeDayMargin: 300,
      riskToStopForLot: 9,
      estimatedRiskToStop: 30,
      cumulativeFundsAtStop: 330,
      remainingFundsAtStop: -80,
      rejectReason: "day_margin",
    });
  });

  it("rejects more than two additions and every non-Mini tier", () => {
    const tooManyLayers = buildAdaptivePositionPlan({ ...VALID_INPUT, levels: 3 });
    const buySideBypass = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      levels: 2,
      sideLevels: { buy: 3, sell: 0 },
    });
    const sellSideBypass = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      levels: 0,
      sideLevels: { buy: 0, sell: 1 },
    });
    const micro = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "micro",
      initialLot: 0.01,
    });

    expect(tooManyLayers.valid).toBe(false);
    expect(tooManyLayers.errors.join(" ")).toMatch(/between 0 and 2/i);
    expect(buySideBypass.valid).toBe(false);
    expect(buySideBypass.errors.join(" ")).toMatch(/Buy additional levels/i);
    expect(sellSideBypass.valid).toBe(false);
    expect(sellSideBypass.errors.join(" ")).toMatch(/Sell additional levels/i);
    expect(micro.valid).toBe(false);
    expect(micro.errors.join(" ")).toMatch(/only for the Mini tier/i);
  });

  it("rejects every non-XAU product from the Adaptive calculator", () => {
    for (const instrument of ["BRENT", "HSI", "NIKKEI", "EUR/USD"]) {
      const result = buildAdaptivePositionPlan({ ...VALID_INPUT, instrument });
      expect(result.valid).toBe(false);
      expect(result.buy).toBeNull();
      expect(result.errors.join(" ")).toMatch(/only for the canonical XAU\/USD/i);
    }
  });

  it("rejects malformed Buy and Sell stop directions", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      tradePlan: {
        ...TRADE_PLAN,
        buy: { ...TRADE_PLAN.buy, stopLoss: "2,310.00" },
        sell: { ...TRADE_PLAN.sell, stopLoss: "2,290.00" },
      },
    });

    expect(result.valid).toBe(false);
    expect(result.buy).toBeNull();
    expect(result.sell).toBeNull();
    expect(result.errors).toEqual(expect.arrayContaining([
      "Buy stop loss must be below the Standard Plan entry.",
      "Sell stop loss must be above the Standard Plan entry.",
    ]));
  });

  it("does not treat timeframe labels in Pro descriptions as prices", () => {
    const assessment = buildRecommendation({
      tradePlan: {
        ...TRADE_PLAN,
        buy: { ...TRADE_PLAN.buy, entryZone: "di atas 2,302 setelah breakout H1" },
        sell: { ...TRADE_PLAN.sell, entryZone: "di bawah 2,300 setelah breakdown 4H" },
      },
    });

    expect(assessment.result.valid).toBe(true);
    expect(assessment.result.buy?.entry).toBe(2302);
    expect(assessment.result.sell?.entry).toBe(2300);
  });

  it("uses real chart swing points only inside the saved entry-to-stop path", () => {
    const candidates = getAdaptiveChartCandidatePrices(
      [
        { high: 2306, low: 2302 },
        { high: 2305, low: 2300 },
        { high: 2303, low: 2296 },
        { high: 2304, low: 2299 },
        { high: 2308, low: 2301 },
        { high: 2310, low: 2303 },
        { high: 2307, low: 2300 },
        { high: 2306, low: 2301 },
        { high: 2305, low: 2299 },
      ],
      TRADE_PLAN,
      0.1,
    );

    expect(candidates.buy).toContain(2296);
    expect(candidates.sell).toContain(2310);
    expect(candidates.buy.every((price) => price > 2290 && price < 2301)).toBe(true);
    expect(candidates.sell.every((price) => price < 2312 && price > 2301)).toBe(true);
  });

  it("does not invent a layer when no saved-zone or chart checkpoint exists", () => {
    const assessment = buildRecommendation({
      tradePlan: {
        ...TRADE_PLAN,
        preferredSide: "buy",
        buy: { ...TRADE_PLAN.buy, entryZone: "2301" },
      },
      checkpointPrices: { buy: [], sell: [] },
    });

    expect(assessment.recommendation?.levels).toBe(0);
    expect(assessment.result.buy?.ladder).toHaveLength(1);
    expect(assessment.decision.posture).toBe("entry_only");
  });

  it("fails closed to entry-only when required analysis context is missing", () => {
    const assessment = buildRecommendation({
      context: { ...SUPPORTIVE_CONTEXT, fundamentalContext: undefined },
    });

    expect(assessment.recommendation?.levels).toBe(0);
    expect(assessment.decision.posture).toBe("entry_only");
    expect(assessment.decision.reasonCodes).toContain("context_unavailable");
  });

  it("removes the one optional layer when a soft risk warning exists", () => {
    const assessment = buildRecommendation({
      context: { ...SUPPORTIVE_CONTEXT, timeframe: "5m" },
    });

    expect(assessment.result.valid).toBe(true);
    expect(assessment.recommendation?.levels).toBe(0);
    expect(assessment.decision.posture).toBe("entry_only");
    expect(assessment.decision.reasonCodes).toContain("short_timeframe");
  });

  it("invalidates saved recommendations when analysis context changes", () => {
    const base = {
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      context: SUPPORTIVE_CONTEXT,
      standardRule: GOLD_RULE,
    };
    const original = createAdaptivePlanFingerprint(base);

    expect(createAdaptivePlanFingerprint({
      ...base,
      context: { ...SUPPORTIVE_CONTEXT, timeframe: "4h" },
    })).not.toBe(original);
    expect(createAdaptivePlanFingerprint({
      ...base,
      tradePlan: {
        ...TRADE_PLAN,
        buy: { ...TRADE_PLAN.buy, stopLoss: "2,288.00" },
      },
    })).not.toBe(original);
    expect(createAdaptivePlanFingerprint({
      ...base,
      riskStyle: "balanced",
    })).not.toBe(original);
    expect(createAdaptivePlanFingerprint({
      ...base,
      riskStyle: "aggressive",
    })).not.toBe(original);
  });
});