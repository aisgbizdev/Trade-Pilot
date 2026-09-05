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
  isAdaptivePositionInstrument,
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

const BRENT_RULE: StandardTradingRuleInstrument = {
  ...GOLD_RULE,
  code: "BCO10_BBJ",
  product: "Brent Crude Oil",
  contractSize: 100,
  contractUnit: "barrel",
  minimumSpread: "USD 0.10 / pip / barrel / side",
  maximumSpread: "USD 0.30 / pip / barrel / side",
  minimumPriceMovement: "USD 0.01 / barrel",
  limitStopRange: "USD 1–USD 20",
};

const BRENT_TRADE_PLAN: TradePlan = {
  preferredSide: "buy",
  buy: {
    ...TRADE_PLAN.buy,
    entryZone: "80.10–80.20",
    stopLoss: "79.00",
    takeProfit1: "81.50",
    takeProfit2: "82.40",
  },
  sell: {
    ...TRADE_PLAN.sell,
    entryZone: "80.10–80.20",
    stopLoss: "81.20",
    takeProfit1: "79.00",
    takeProfit2: "78.20",
  },
};

const HSI_RULE: StandardTradingRuleInstrument = {
  ...GOLD_RULE,
  code: "HKK50_BBJ",
  product: "Hang Seng Index",
  contractSize: 5,
  contractUnit: "USD/point",
  facilityFeeUsdPerLotPerSide: null,
  minimumSpread: "5 points / side",
  maximumSpread: "25 points / side",
  minimumPriceMovement: "1 point",
  limitStopRange: "20–500 points",
};

const NIKKEI_RULE: StandardTradingRuleInstrument = {
  ...HSI_RULE,
  code: "JPK50_BBJ",
  product: "Nikkei Index",
  minimumSpread: "10 points / side",
  minimumPriceMovement: "5 points",
};

function indexTradePlan(entryLow: number, entryHigh: number): TradePlan {
  return {
    preferredSide: "buy",
    buy: {
      ...TRADE_PLAN.buy,
      entryZone: `${entryLow}–${entryHigh}`,
      stopLoss: String(entryLow - 100),
      takeProfit1: String(entryHigh + 150),
      takeProfit2: String(entryHigh + 250),
    },
    sell: {
      ...TRADE_PLAN.sell,
      entryZone: `${entryLow}–${entryHigh}`,
      stopLoss: String(entryHigh + 100),
      takeProfit1: String(entryLow - 150),
      takeProfit2: String(entryLow - 250),
    },
  };
}

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

describe("XAU/USD Micro, Mini, and Regular Adaptive Plan", () => {
  it("uses only the exact canonical XAU/USD identity for Adaptive", () => {
    expect(isXauUsdMiniAdaptiveInstrument("XAU/USD")).toBe(true);
    expect(isXauUsdMiniAdaptiveInstrument(" xau/usd ")).toBe(true);

    for (const alias of ["XAUUSD", "GOLD", "XUL10", "EUR/USD"]) {
      expect(isXauUsdMiniAdaptiveInstrument(alias)).toBe(false);
      expect(getAdaptiveStandardRuleCode(alias)).toBeNull();
    }
    expect(isXauUsdMiniAdaptiveInstrument("HSI")).toBe(false);
    expect(isXauUsdMiniAdaptiveInstrument("NIKKEI")).toBe(false);
    expect(isXauUsdMiniAdaptiveInstrument("BRENT")).toBe(false);
    expect(getAdaptiveStandardRuleCode("XAU/USD")).toBe("XUL10");
  });

  it("enables only supported canonical identities for Adaptive", () => {
    expect(isAdaptivePositionInstrument("XAU/USD")).toBe(true);
    expect(isAdaptivePositionInstrument("BRENT")).toBe(true);
    expect(isAdaptivePositionInstrument("HSI")).toBe(true);
    expect(isAdaptivePositionInstrument("NIKKEI")).toBe(true);
    expect(isAdaptivePositionInstrument(" xau/usd ")).toBe(false);
    expect(isAdaptivePositionInstrument("brent")).toBe(false);
    expect(isAdaptivePositionInstrument("nikkei")).toBe(false);
    expect(getAdaptiveStandardRuleCode("BRENT")).toBe("BCO10_BBJ");
    expect(getAdaptiveStandardRuleCode("HSI")).toBe("HKK50_BBJ");
    expect(getAdaptiveStandardRuleCode("NIKKEI")).toBe("JPK50_BBJ");

    for (const alias of [
      "BCO10_BBJ",
      "BCO",
      "OIL",
      "BRENT CRUDE",
      "HKK50_BBJ",
      "HANG SENG",
      "JPK50_BBJ",
      "NIKKEI 225",
      "EUR/USD",
    ]) {
      expect(isAdaptivePositionInstrument(alias)).toBe(false);
      expect(getAdaptiveStandardRuleCode(alias)).toBeNull();
    }
  });

  it("builds Brent from its own contract, margin, movement, and gap rules", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      instrument: "BRENT",
      tradePlan: BRENT_TRADE_PLAN,
      standardRule: BRENT_RULE,
      checkpointPrices: { buy: [79.83], sell: [80.47] },
    });

    expect(result.valid).toBe(true);
    expect(result.market).toBe("brent");
    expect(result.rule).toMatchObject({
      contractSize: 100,
      minimumLot: 0.1,
      marginAtMinimumLot: 100,
      minMovement: 0.01,
      maxGapPercent: 2,
    });
    const isTickAligned = (price: number) =>
      Math.abs(price / 0.01 - Math.round(price / 0.01)) < 1e-8;
    expect(result.buy?.ladder.every((level) => isTickAligned(level.price))).toBe(true);
    expect(result.sell?.ladder.every((level) => isTickAligned(level.price))).toBe(true);
    expect(result.assumptions.join(" ")).toContain("Current open BRENT mini exposure");
  });

  it.each([
    {
      instrument: "HSI",
      market: "hang_seng",
      rule: HSI_RULE,
      tradePlan: indexTradePlan(18_500, 18_510),
      checkpoints: { buy: [18_477.4], sell: [18_533.8] },
      movement: 1,
    },
    {
      instrument: "NIKKEI",
      market: "nikkei",
      rule: NIKKEI_RULE,
      tradePlan: indexTradePlan(38_500, 38_510),
      checkpoints: { buy: [38_477], sell: [38_533] },
      movement: 5,
    },
  ])("builds $instrument with isolated index sizing and tick alignment", ({
    instrument,
    market,
    rule,
    tradePlan,
    checkpoints,
    movement,
  }) => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      instrument,
      tradePlan,
      standardRule: rule,
      checkpointPrices: checkpoints,
      maximumLoss: 5_000,
    });

    expect(result.valid).toBe(true);
    expect(result.market).toBe(market);
    expect(result.rule).toMatchObject({
      contractSize: 5,
      minimumLot: 0.1,
      marginAtMinimumLot: 100,
      minMovement: movement,
      maxGapPercent: null,
    });
    const aligned = (price: number) => price % movement === 0;
    expect(result.buy?.ladder.every((level) => aligned(level.price))).toBe(true);
    expect(result.sell?.ladder.every((level) => aligned(level.price))).toBe(true);
    expect(result.assumptions.join(" ")).toMatch(/no percentage gap limit is assumed/i);
    expect(result.assumptions.join(" ")).toMatch(/facility fee.*external risks/i);
  });

  it("fails closed when an index is paired with another product rule", () => {
    const hsiWithNikkeiRule = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      instrument: "HSI",
      tradePlan: indexTradePlan(18_500, 18_510),
      standardRule: NIKKEI_RULE,
    });
    const nikkeiWithGoldRule = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      instrument: "NIKKEI",
      tradePlan: indexTradePlan(38_500, 38_510),
      standardRule: GOLD_RULE,
    });

    expect(hsiWithNikkeiRule.valid).toBe(false);
    expect(hsiWithNikkeiRule.rule).toBeNull();
    expect(nikkeiWithGoldRule.valid).toBe(false);
    expect(nikkeiWithGoldRule.rule).toBeNull();
  });

  it("scales index contract and margin by account tier without using Gold sizing", () => {
    expect(getAdaptiveMarketRule("HSI", HSI_RULE, "micro")).toMatchObject({
      contractSize: 0.5,
      marginAtMinimumLot: 10,
      minimumLot: 0.01,
    });
    expect(getAdaptiveMarketRule("HSI", HSI_RULE, "mini")).toMatchObject({
      contractSize: 5,
      marginAtMinimumLot: 100,
      minimumLot: 0.1,
    });
    expect(getAdaptiveMarketRule("NIKKEI", NIKKEI_RULE, "regular")).toMatchObject({
      contractSize: 50,
      marginAtMinimumLot: 1_000,
      minimumLot: 1,
    });
  });

  it("keeps the broader Standard Plan resolver independent from Adaptive", () => {
    expect(getStandardTradingRuleCode("XAU/USD")).toBe("XUL10");
    expect(getStandardTradingRuleCode("BRENT")).toBe("BCO10_BBJ");
    expect(getStandardTradingRuleCode("HSI")).toBe("HKK50_BBJ");
    expect(getStandardTradingRuleCode("HANG SENG")).toBe("HKK50_BBJ");
    expect(getStandardTradingRuleCode("NIKKEI")).toBe("JPK50_BBJ");
    expect(getStandardTradingRuleCode("EUR/USD")).toBeNull();
  });

  it("exposes exact tier sizing and caps Regular at 50 lots", () => {
    const micro = getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "micro");
    const mini = getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "mini");
    const regular = getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "regular");

    expect(micro).toMatchObject({
      accountTier: "micro",
      minimumLot: 0.01,
      maximumLot: 0.09,
      lotStep: 0.01,
      contractSize: 1,
      marginAtMinimumLot: 10,
      marginPerLot: 1_000,
      minimumOpeningFunds: 50,
    });
    expect(mini).toMatchObject({
      accountTier: "mini",
      minimumLot: 0.1,
      maximumLot: 0.9,
      lotStep: 0.1,
      contractSize: 10,
      marginAtMinimumLot: 100,
      marginPerLot: 1_000,
    });
    expect(regular).toMatchObject({
      accountTier: "regular",
      minimumLot: 1,
      maximumLot: 50,
      lotStep: 1,
      contractSize: 100,
      marginAtMinimumLot: 1_000,
      marginPerLot: 1_000,
    });
    expect(getAdaptiveMarginCapacity(500, micro)).toBe(0.09);
    expect(getAdaptiveMarginCapacity(500, mini)).toBe(0.5);
    expect(getAdaptiveMarginCapacity(100_000, regular)).toBe(50);
  });

  it("scales Micro lot, margin, contract value, and risk from the Mini rule", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "micro",
      initialLot: 0.01,
    });

    expect(result.valid).toBe(true);
    expect(result.rule).toMatchObject({
      accountTier: "micro",
      minimumLot: 0.01,
      maximumLot: 0.09,
      contractSize: 1,
      marginAtMinimumLot: 10,
    });
    expect(result.buy?.ladder.map((level) => level.lot)).toEqual([0.01, 0.01]);
    expect(result.buy?.marginRequired).toBe(20);
    expect(result.buy?.estimatedCycleLoss).toBeCloseTo(0.21);
    expect(result.buy?.totalFundsAtStop).toBeCloseTo(20.21);
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
    expect(assessment.result.buy?.totalLots).toBe(2.3);
    expect(assessment.result.buy?.ladder.every((level) => level.lot <= 0.9)).toBe(true);
    expect(assessment.result.buy?.ladder[1]).toMatchObject({
      price: 2300,
      basis: "entry_zone_edge",
    });
    expect(assessment.result.buy?.ladder.map((level) => level.lot)).toEqual([0.9, 0.8, 0.6]);
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

  it("applies Model C risk utilization and whole-plan layer allocation", () => {
    const conservative = buildRecommendation({ riskStyle: "conservative" });
    const balanced = buildRecommendation({ riskStyle: "balanced" });
    const aggressive = buildRecommendation({ riskStyle: "aggressive" });

    expect(conservative.recommendation?.riskStyle).toBe("conservative");
    expect(conservative.recommendation?.lotProfile).toBe("decreasing");
    expect(conservative.recommendation).toMatchObject({
      usableRiskBudget: 250,
      riskUtilizationRate: 0.5,
      unusedRiskBuffer: 250,
    });
    expect(balanced.recommendation?.riskStyle).toBe("balanced");
    expect(balanced.recommendation?.lotProfile).toBe("mixed");
    expect(balanced.recommendation).toMatchObject({
      usableRiskBudget: 375,
      riskUtilizationRate: 0.75,
      unusedRiskBuffer: 125,
    });
    expect(aggressive.recommendation?.riskStyle).toBe("aggressive");
    expect(aggressive.recommendation?.lotProfile).toBe("increasing");
    expect(aggressive.recommendation).toMatchObject({
      usableRiskBudget: 500,
      riskUtilizationRate: 1,
      unusedRiskBuffer: 0,
    });

    for (const assessment of [conservative, balanced, aggressive]) {
      const ladder = assessment.result.buy?.ladder ?? [];
      expect(ladder.every((level) => level.lot <= 0.9)).toBe(true);
      expect(assessment.result.buy?.totalLots).toBeGreaterThan(0.9);
      expect(assessment.result.buy?.estimatedCycleLoss)
        .toBeLessThanOrEqual(assessment.recommendation!.usableRiskBudget);
    }
  });

  it("makes Regular Layer 1 visibly different across risk styles instead of always using 50 lots", () => {
    const common = {
      accountTier: "regular" as const,
      availableMargin: 200_000,
      maximumLoss: 70_000,
    };
    const conservative = buildRecommendation({ ...common, riskStyle: "conservative" });
    const balanced = buildRecommendation({ ...common, riskStyle: "balanced" });
    const aggressive = buildRecommendation({ ...common, riskStyle: "aggressive" });
    const initialLots = [
      conservative.result.buy?.ladder[0]?.lot,
      balanced.result.buy?.ladder[0]?.lot,
      aggressive.result.buy?.ladder[0]?.lot,
    ];

    expect(conservative.result.valid).toBe(true);
    expect(balanced.result.valid).toBe(true);
    expect(aggressive.result.valid).toBe(true);
    expect(initialLots[0]).toBeLessThan(initialLots[1]!);
    expect(initialLots[1]).toBeLessThan(initialLots[2]!);
    expect(initialLots).not.toEqual([50, 50, 50]);
  });

  it("derives lot per layer from allocated risk and distance to Stop Loss", () => {
    const assessment = buildRecommendation({
      riskStyle: "aggressive",
      maximumLoss: 150,
    });

    expect(assessment.recommendation).toMatchObject({
      riskStyle: "aggressive",
      lotProfile: "increasing",
      positions: 3,
    });
    expect(assessment.result.buy?.ladder.map((level) => level.lot)).toEqual([0.8, 0.3, 0.2]);
    expect(assessment.result.buy?.totalLots).toBe(1.3);
    expect(assessment.result.buy?.estimatedCycleLoss).toBeLessThanOrEqual(150);
  });

  it("changes an aggressive lot profile when the saved analysis is ranging", () => {
    const assessment = buildRecommendation({
      riskStyle: "aggressive",
      maximumLoss: 150,
      context: { ...SUPPORTIVE_CONTEXT, marketCondition: "ranging" },
    });

    expect(assessment.recommendation?.lotProfile).toBe("mixed");
    expect(assessment.result.buy?.ladder.map((level) => level.lot)).toEqual([0.8, 0.3, 0.2]);
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

    expect(sell.result.sell?.ladder.map((level) => level.lot)).toEqual([0.9, 0.9, 0.8]);
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
    expect(assessment.result.assumptions.join(" ")).toMatch(/used directly.*reserve part/i);
  });

  it("uses the entered maximum loss as an absolute hard ceiling", () => {
    const entryOnly = buildRecommendation({ maximumLoss: 30 });

    expect(entryOnly.result.valid).toBe(true);
    expect(entryOnly.recommendation).toMatchObject({
      levels: 0,
      positions: 1,
      maximumLoss: 30,
      usableRiskBudget: 15,
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

  it("keeps unavailable take-profit profit values null", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      tradePlan: {
        ...TRADE_PLAN,
        buy: { ...TRADE_PLAN.buy, takeProfit2: "n/a" },
      },
    });
    const buy = result.buy!;

    expect(result.valid).toBe(true);
    expect(buy.takeProfit1).toBe(2315);
    expect(buy.takeProfit2).toBeNull();
    expect(buy.profitToTakeProfit1).toBeGreaterThan(0);
    expect(buy.profitToTakeProfit2).toBeNull();
    expect(buy.ladder.every((level) => level.cumulativeProfitToTakeProfit2 === null)).toBe(true);
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
      financialAlternative: {
        additionalFundsRequired: 80,
        additionalLossBudgetRequired: 0,
      },
    });
  });

  it("does not offer a financial alternative for analysis-only rejection", () => {
    const assessment = buildRecommendation({
      context: {
        ...SUPPORTIVE_CONTEXT,
        fundamentalContext: {
          newsItems: [],
          calendarEvents: [{
            date: "2026-08-27",
            time: "14:30",
            currency: "USD",
            event: "Central-bank rate decision",
            impact: "★★★",
            actual: null,
            forecast: null,
            previous: null,
          }],
        },
      },
    });

    expect(assessment.result.buy?.rejectedLadder[0]?.rejectReason).toBe("analysis_limit");
    expect(assessment.result.buy?.rejectedLadder[0]?.financialAlternative).toBeNull();
  });

  it("rejects more than two additions and accepts a valid Regular tier plan", () => {
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
    const regular = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "regular",
      initialLot: 1,
      levels: 0,
      maximumLoss: 5_000,
    });

    expect(tooManyLayers.valid).toBe(false);
    expect(tooManyLayers.errors.join(" ")).toMatch(/between 0 and 2/i);
    expect(buySideBypass.valid).toBe(false);
    expect(buySideBypass.errors.join(" ")).toMatch(/Buy additional levels/i);
    expect(sellSideBypass.valid).toBe(false);
    expect(sellSideBypass.errors.join(" ")).toMatch(/Sell additional levels/i);
    expect(regular.valid).toBe(true);
    expect(regular.rule).toMatchObject({ maximumLot: 50, contractSize: 100, marginAtMinimumLot: 1_000 });
  });

  it("scales Regular margin, profit, and loss tenfold from the Mini rule", () => {
    const miniMinimum = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "mini",
      initialLot: 0.1,
      levels: 0,
      maximumLoss: 5_000,
    });
    const regularMinimum = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "regular",
      initialLot: 1,
      levels: 0,
      maximumLoss: 5_000,
    });
    // P/L is a per-lot value, so compare both tiers at the same lot size.
    // Mini correctly rejects one lot as above its 0.9 per-position cap, but
    // still exposes the calculated candidate for this direct scaling check.
    const miniPerLot = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "mini",
      initialLot: 1,
      levels: 0,
      maximumLoss: 5_000,
    });
    const regularPerLot = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "regular",
      initialLot: 1,
      levels: 0,
      maximumLoss: 5_000,
    });

    expect(miniMinimum.valid).toBe(true);
    expect(regularMinimum.valid).toBe(true);
    expect(regularMinimum.buy?.marginRequired).toBeCloseTo((miniMinimum.buy?.marginRequired ?? 0) * 10);
    expect(miniPerLot.valid).toBe(false);
    expect(regularPerLot.valid).toBe(true);
    expect(regularPerLot.buy?.estimatedCycleLoss).toBeCloseTo((miniPerLot.buy?.estimatedCycleLoss ?? 0) * 10);
    expect(regularPerLot.buy?.profitToTakeProfit1).toBeCloseTo((miniPerLot.buy?.profitToTakeProfit1 ?? 0) * 10);
    expect(regularPerLot.buy?.profitToTakeProfit2).toBeCloseTo((miniPerLot.buy?.profitToTakeProfit2 ?? 0) * 10);
  });

  it("preserves Regular insufficient-funds and maximum-loss blockers", () => {
    const insufficientFunds = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "regular",
      initialLot: 1,
      levels: 0,
      availableFunds: 999,
      maximumLoss: 999,
    });
    const insufficientLossBudget = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "regular",
      initialLot: 1,
      levels: 0,
      availableFunds: 5_000,
      maximumLoss: 1_099,
    });

    expect(insufficientFunds.valid).toBe(false);
    expect(insufficientFunds.errors.join(" ")).toMatch(/margin exceeds available trading funds/i);
    expect(insufficientLossBudget.valid).toBe(false);
    expect(insufficientLossBudget.errors.join(" ")).toMatch(/loss at the final Stop Loss exceeds/i);
  });

  it("rejects unsupported products from the Adaptive calculator", () => {
    for (const instrument of ["HANG SENG", "NIKKEI 225", "EUR/USD"]) {
      const result = buildAdaptivePositionPlan({ ...VALID_INPUT, instrument });
      expect(result.valid).toBe(false);
      expect(result.buy).toBeNull();
      expect(result.errors.join(" ")).toMatch(/only for supported canonical instruments/i);
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
    expect(createAdaptivePlanFingerprint({
      ...base,
      accountTier: "micro",
    })).not.toBe(original);
  });
});