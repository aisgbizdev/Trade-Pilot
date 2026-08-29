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
} from "./adaptive-position-plan";

const CHART_CANDIDATES = {
  buy: [2299, 2297, 2295, 2293, 2291],
  sell: [2303, 2305, 2307, 2309, 2311],
};

function buildAdaptivePlanRecommendation(
  input: Parameters<typeof buildAdaptivePlanRecommendationCore>[0],
) {
  return buildAdaptivePlanRecommendationCore({
    ...input,
    checkpointPrices: input.checkpointPrices ?? CHART_CANDIDATES,
  });
}

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

const HANG_SENG_RULE: StandardTradingRuleInstrument = {
  code: "HKK50_BBJ",
  product: "Hang Seng Index",
  contractSize: 5,
  contractUnit: "USD/point",
  tradingDays: "Monday–Friday",
  tradingHours: { summer: "08:15–11:00, 12:00–15:30, 16:00–02:00 WIB", winter: "08:15–11:00, 12:00–15:30, 16:00–02:00 WIB" },
  initialMarginUsdPerLot: 100,
  facilityFeeUsdPerLotPerSide: null,
  vatPercent: 11,
  rolloverUsdPerLotPerNight: 0.3,
  priceSource: "Telequote",
  priceGuidance: "Last Trade",
  minimumSpread: "5 points / side",
  maximumSpread: "25 points / side",
  hecticSpread: "Based on market conditions",
  minimumPriceMovement: "1 point",
  limitStopRange: "20–500 points",
  deliveryBy: "Cash settlement",
};

const NIKKEI_RULE: StandardTradingRuleInstrument = {
  ...HANG_SENG_RULE,
  code: "JPK50_BBJ",
  product: "Nikkei Index",
  tradingHours: { summer: "06:30–13:55, 14:10–03:45 WIB", winter: "06:30–13:55, 14:10–03:45 WIB" },
  rolloverUsdPerLotPerNight: 0.2,
  minimumSpread: "10 points / side",
  minimumPriceMovement: "5 points",
};

const INDEX_TRADE_PLAN: TradePlan = {
  preferredSide: "buy",
  buy: {
    entryZone: "20,000–20,020",
    stopLoss: "19,900",
    takeProfit1: "20,150",
    takeProfit2: "20,300",
    riskRewardRatio: "1:1.3",
    rationale: "Example index plan",
  },
  sell: {
    entryZone: "20,000–20,020",
    stopLoss: "20,120",
    takeProfit1: "19,850",
    takeProfit2: "19,700",
    riskRewardRatio: "1:1.3",
    rationale: "Example index plan",
  },
};

const VALID_INPUT = {
  instrument: "XAU/USD",
  tradePlan: TRADE_PLAN,
  standardRule: GOLD_RULE,
  equity: 100_000,
  freeMargin: 100_000,
  existingExposure: 0,
  initialLot: 0.01,
  accountTier: "micro" as const,
  levels: 3,
  maxCycleLossPercent: 2,
  checkpointPrices: CHART_CANDIDATES,
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

describe("buildAdaptivePositionPlan", () => {
  it("creates a situation-aware recommendation within the explicitly selected Mini tier", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      accountTier: "mini",
      preference: "balanced",
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation).toMatchObject({
      levels: 4,
      marginBudget: 65_000,
    });
    expect(recommendation.recommendation?.initialLot).toBeGreaterThan(0);
    const initialLot = recommendation.recommendation?.initialLot ?? 0;
    expect(initialLot).toBeGreaterThanOrEqual(0.1);
    expect(initialLot).toBeLessThanOrEqual(0.9);
    expect(initialLot * 10).toBeCloseTo(Math.round(initialLot * 10), 8);
    expect(recommendation.decision).toMatchObject({
      posture: "scaling_allowed",
      preferredSide: "buy",
    });
    expect(recommendation.result.buy?.ladder).toHaveLength(5);
    expect(recommendation.result.sell?.ladder).toHaveLength(1);
    expect(recommendation.result.buy?.totalLots).toBeLessThanOrEqual(0.9);
    expect(recommendation.result.buy?.ladder[1]).toMatchObject({
      price: 2300,
      basis: "entry_zone_edge",
    });
    expect(recommendation.decision.reasonCodes).toEqual(
      expect.arrayContaining(["trend_favors_buy", "technical_supports_buy", "staged_add_condition"]),
    );
  });

  it("builds a safe Regular recommendation with USD 20,000 using the scaled contract value once", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 20_000,
      standardRule: GOLD_RULE,
      accountTier: "regular",
      preference: "safe",
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation).toMatchObject({
      initialLot: 1,
      levels: 0,
      marginBudget: 10_000,
      maximumLoss: 2_000,
    });
    expect(recommendation.result.rule).toMatchObject({
      accountTier: "regular",
      marginBasis: "day",
      contractSize: 100,
      minimumLot: 1,
      marginAtMinimumLot: 1_000,
    });
    expect(recommendation.result.buy?.estimatedCycleLoss).toBe(1_100);
    expect(recommendation.result.sell?.estimatedCycleLoss).toBe(1_100);
    expect(recommendation.result.buy?.rejectedLadder[0]?.rejectReason).toBe("loss_ceiling");
  });

  it("still rejects a Regular recommendation when the minimum lot exceeds the loss limit", () => {
    const wideStopPlan: TradePlan = {
      ...TRADE_PLAN,
      buy: { ...TRADE_PLAN.buy, stopLoss: "2,180.00" },
      sell: { ...TRADE_PLAN.sell, stopLoss: "2,422.00" },
    };
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: wideStopPlan,
      availableMargin: 10_000,
      standardRule: GOLD_RULE,
      accountTier: "regular",
      preference: "safe",
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(false);
    expect(recommendation.recommendation).toBeNull();
    expect(recommendation.result.errors.join(" ")).toMatch(/cycle loss exceeds/i);
  });

  it("reduces but does not automatically erase staged scaling on a shorter timeframe", () => {
    const hourly = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      preference: "balanced",
      context: SUPPORTIVE_CONTEXT,
    });
    const shortTimeframe = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      preference: "balanced",
      context: { ...SUPPORTIVE_CONTEXT, timeframe: "5m" },
    });

    expect(hourly.recommendation?.levels).toBe(4);
    expect(shortTimeframe.recommendation?.levels).toBe(3);
    expect(shortTimeframe.decision.posture).toBe("scaling_allowed");
    expect(shortTimeframe.result.buy?.ladder).toHaveLength(4);
    expect(shortTimeframe.result.sell?.ladder).toHaveLength(1);
    expect(shortTimeframe.decision.reasonCodes).toContain("short_timeframe");
    expect(shortTimeframe.result.buy?.rejectedLadder[0]?.rejectReason).toBe("analysis_limit");
  });

  it("falls back to an entry-only plan when the requested layers exceed the loss budget", () => {
    const wideStopPlan: TradePlan = {
      ...TRADE_PLAN,
      buy: { ...TRADE_PLAN.buy, stopLoss: "701.00" },
      sell: { ...TRADE_PLAN.sell, stopLoss: "3,901.00" },
    };
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: wideStopPlan,
      availableMargin: 100,
      standardRule: GOLD_RULE,
      accountTier: "micro",
      preference: "active",
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation?.levels).toBe(0);
    expect(recommendation.decision.posture).toBe("entry_only");
    expect(recommendation.result.buy?.ladder).toHaveLength(1);
    expect(recommendation.result.sell?.ladder).toHaveLength(1);
  });

  it("does not treat timeframe labels in Pro level descriptions as prices", () => {
    const proStylePlan: TradePlan = {
      ...TRADE_PLAN,
      buy: {
        ...TRADE_PLAN.buy,
        entryZone: "di atas 2,302 setelah breakout H1",
      },
      sell: {
        ...TRADE_PLAN.sell,
        entryZone: "di bawah 2,300 setelah breakdown 4H",
      },
    };

    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: proStylePlan,
      availableMargin: 1_000,
      standardRule: GOLD_RULE,
      preference: "safe",
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation).not.toBeNull();
    expect(recommendation.result.buy?.entry).toBe(2302);
    expect(recommendation.result.sell?.entry).toBe(2300);
  });

  it("builds the preferred Pro side when the opposite trade-plan side is unavailable", () => {
    const oneSidedProPlan: TradePlan = {
      ...TRADE_PLAN,
      preferredSide: "buy",
      buy: {
        ...TRADE_PLAN.buy,
        entryZone: "4,456 – 4,480",
        stopLoss: "4,450",
      },
      sell: {
        entryZone: "n/a",
        stopLoss: "n/a",
        takeProfit1: "n/a",
        takeProfit2: "n/a",
        riskRewardRatio: "n/a",
        rationale: "Skenario berlawanan belum memiliki level yang valid.",
      },
    };

    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: oneSidedProPlan,
      availableMargin: 1_000,
      standardRule: GOLD_RULE,
      preference: "safe",
      context: {
        ...SUPPORTIVE_CONTEXT,
        riskLevel: "high",
        tradingBias: "bullish",
        confidenceMin: 60,
        confidenceMax: 70,
      },
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation).not.toBeNull();
    expect(recommendation.decision).toMatchObject({
      posture: "scaling_allowed",
      preferredSide: "buy",
    });
    expect(recommendation.result.buy).not.toBeNull();
    expect(recommendation.result.sell).toBeNull();
    expect(recommendation.recommendation?.levels).toBe(1);
  });

  it("blocks staged plans when technical direction conflicts with market bias", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      preference: "balanced",
      context: {
        ...SUPPORTIVE_CONTEXT,
        marketCondition: "ranging",
        techBuyCount: 3,
        techSellCount: 15,
      },
    });

    expect(recommendation.result.valid).toBe(false);
    expect(recommendation.recommendation).toBeNull();
    expect(recommendation.decision.posture).toBe("not_recommended");
    expect(recommendation.decision.reasonCodes).toContain("directional_conflict");
  });

  it("fails closed when any required analysis input is unavailable", () => {
    const incompleteContexts = [
      { ...SUPPORTIVE_CONTEXT, timeframe: undefined },
      { ...SUPPORTIVE_CONTEXT, marketCondition: undefined },
      { ...SUPPORTIVE_CONTEXT, riskLevel: undefined },
      { ...SUPPORTIVE_CONTEXT, tradingBias: undefined },
      { ...SUPPORTIVE_CONTEXT, confidenceMax: undefined },
      { ...SUPPORTIVE_CONTEXT, techBuyCount: undefined },
      { ...SUPPORTIVE_CONTEXT, fundamentalContext: undefined },
    ];

    for (const context of incompleteContexts) {
      const recommendation = buildAdaptivePlanRecommendation({
        instrument: "XAU/USD",
        tradePlan: TRADE_PLAN,
        availableMargin: 100_000,
        standardRule: GOLD_RULE,
        preference: "active",
        context,
      });

      expect(recommendation.recommendation?.levels).toBe(0);
      expect(recommendation.decision.posture).toBe("entry_only");
      expect(recommendation.decision.reasonCodes).toContain("context_unavailable");
    }
  });

  it("uses high-impact calendar risk as a sizing warning instead of deleting every layer", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      preference: "active",
      context: {
        ...SUPPORTIVE_CONTEXT,
        fundamentalContext: {
          newsItems: [],
          calendarEvents: [{
            date: "2026-08-27",
            time: "14:30",
            currency: "USD",
            event: "US GDP",
            impact: "★★★",
            actual: null,
            forecast: null,
            previous: null,
          }],
        },
      },
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation?.levels).toBe(5);
    expect(recommendation.decision.posture).toBe("scaling_allowed");
    expect(recommendation.decision.reasonCodes).toContain("fundamental_high_impact");
    expect(recommendation.result.buy?.rejectedLadder[0]?.rejectReason).toBe("analysis_limit");
  });

  it("allows an Active Gold plan to exceed four total positions when analysis and hard limits support it", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      accountTier: "micro",
      preference: "active",
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation?.levels).toBe(6);
    expect(recommendation.result.buy?.ladder).toHaveLength(7);
    expect(recommendation.result.buy?.totalLots).toBeLessThanOrEqual(0.09);
    expect(recommendation.result.buy?.ladder.every((level) => level.lot <= (recommendation.recommendation?.initialLot ?? 0))).toBe(true);
  });

  it("uses real current-chart swing points inside the saved entry-to-stop path", () => {
    const candidates = getAdaptiveChartCandidatePrices(
      [
        { high: 2306, low: 2302 },
        { high: 2305, low: 2300 },
        { high: 2303, low: 2296 },
        { high: 2304, low: 2299 },
        { high: 2308, low: 2301 },
        { high: 2310, low: 2303 },
        { high: 2307, low: 2300 },
      ],
      TRADE_PLAN,
      0.1,
    );

    expect(candidates.buy).toContain(2296);
    expect(candidates.sell).toContain(2310);
    expect(candidates.buy.every((price) => price > 2290 && price < 2301)).toBe(true);
    expect(candidates.sell.every((price) => price < 2312 && price > 2301)).toBe(true);
  });

  it("does not invent extra levels when neither the saved entry zone nor current chart supplies one", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: {
        ...TRADE_PLAN,
        buy: { ...TRADE_PLAN.buy, entryZone: "2301" },
        preferredSide: "buy",
      },
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      accountTier: "micro",
      preference: "active",
      context: SUPPORTIVE_CONTEXT,
      checkpointPrices: { buy: [], sell: [] },
    });

    expect(recommendation.recommendation?.levels).toBe(0);
    expect(recommendation.result.buy?.ladder).toHaveLength(1);
    expect(recommendation.decision.posture).toBe("entry_only");
  });

  it("treats medium confidence as a soft constraint on layer count", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      accountTier: "micro",
      preference: "balanced",
      context: {
        ...SUPPORTIVE_CONTEXT,
        confidenceMin: 62,
        confidenceMax: 66,
      },
    });

    expect(recommendation.decision.reasonCodes).toContain("low_confidence");
    expect(recommendation.recommendation?.levels).toBeLessThan(4);
    expect(recommendation.recommendation?.levels).toBeGreaterThan(0);
  });

  it("shows auditable per-stage and cumulative day-trade math from the saved plan", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "mini",
      initialLot: 0.2,
      levels: 2,
      layerLotFactors: [0.5, 0.5],
      checkpointPrices: CHART_CANDIDATES,
    });

    expect(result.valid).toBe(true);
    const buy = result.buy!;
    expect(buy.ladder).toHaveLength(3);
    expect(buy.ladder[0].basis).toBe("analysis_entry");
    expect(buy.ladder[1].basis).toBe("entry_zone_edge");
    expect(buy.ladder.every((level) => level.dayMarginForLot > 0)).toBe(true);
    expect(buy.ladder.at(-1)?.cumulativeDayMargin).toBe(buy.marginRequired);
    expect(buy.totalFundsAtStop).toBeCloseTo(buy.marginRequired + buy.estimatedCycleLoss, 8);
    expect(buy.weightedAverageEntry).toBeGreaterThan(buy.stopLoss);
    expect(buy.profitToTakeProfit1).toBeGreaterThan(0);
    expect(buy.riskRewardToTakeProfit2).toBeGreaterThan(0);
    expect(result.assumptions.join(" ")).toMatch(/day trading only.*excludes overnight/i);
  });

  it("builds independent buy and sell ladders without changing Standard Plan levels", () => {
    const result = buildAdaptivePositionPlan(VALID_INPUT);

    expect(result.valid).toBe(true);
    expect(result.rule).toMatchObject({
      accountTier: "micro",
      contractSize: 1,
      minMovement: 0.01,
      marginAtMinimumLot: 10,
      marginPerLot: 1_000,
      minimumLot: 0.01,
      source: "TP Standard Trading Rules",
    });
    expect(result.buy?.ladder).toHaveLength(4);
    expect(result.sell?.ladder).toHaveLength(4);
    expect(result.buy?.ladder[0].price).toBe(2301);
    expect(result.buy?.ladder[1].price).toBeLessThan(result.buy?.ladder[0].price ?? 0);
    expect(result.sell?.ladder[1].price).toBeGreaterThan(result.sell?.ladder[0].price ?? 0);
    expect(result.buy?.marginRequired).toBe(40);
    expect(result.buy?.ladder.map((level) => level.lot)).toEqual([0.01, 0.01, 0.01, 0.01]);
    expect(TRADE_PLAN.buy.entryZone).toBe("2,300.00–2,302.00");
    expect(TRADE_PLAN.sell.stopLoss).toBe("2,312.00");
  });

  it("keeps Micro and Mini lots on their tier-specific increments", () => {
    const micro = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      initialLot: 0.03,
      accountTier: "micro",
      levels: 2,
    });
    const mini = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      initialLot: 0.3,
      accountTier: "mini",
      levels: 2,
    });
    const fractionalMini = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      initialLot: 0.35,
      accountTier: "mini",
      levels: 2,
    });

    expect(micro.valid).toBe(true);
    expect(micro.buy?.ladder.map((level) => level.lot)).toEqual([0.03, 0.03, 0.03]);
    expect(mini.valid).toBe(true);
    expect(mini.buy?.ladder.map((level) => level.lot)).toEqual([0.3, 0.3, 0.3]);
    expect(fractionalMini.valid).toBe(false);
    expect(fractionalMini.errors.join(" ")).toMatch(/0.10 lot increments.*mini tier/i);
  });

  it("uses the agreed Micro, Mini, and Regular margin scales without auto-switching tiers", () => {
    const microRule = getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "micro");
    const miniRule = getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "mini");
    const regularRule = getAdaptiveMarketRule("XAU/USD", GOLD_RULE, "regular");

    expect(microRule).toMatchObject({ minimumLot: 0.01, marginAtMinimumLot: 10 });
    expect(miniRule).toMatchObject({ minimumLot: 0.1, marginAtMinimumLot: 100 });
    expect(regularRule).toMatchObject({ minimumLot: 1, marginAtMinimumLot: 1_000 });
    expect(microRule?.contractSize).toBe(1);
    expect(miniRule?.contractSize).toBe(10);
    expect(regularRule?.contractSize).toBe(100);
    expect(getAdaptiveMarginCapacity(20, microRule)).toBe(0.02);
    expect(getAdaptiveMarginCapacity(50, miniRule)).toBe(0);
    expect(getAdaptiveMarginCapacity(1_000, regularRule)).toBe(1);
  });

  it("keeps the agreed tier choices for USD 20,000, USD 5,000, USD 500, and USD 100", () => {
    const recommendation = (availableMargin: number, accountTier: "micro" | "mini" | "regular") =>
      buildAdaptivePlanRecommendation({
        instrument: "XAU/USD",
        tradePlan: TRADE_PLAN,
        availableMargin,
        standardRule: GOLD_RULE,
        accountTier,
        preference: "safe",
        context: SUPPORTIVE_CONTEXT,
      });

    expect(recommendation(20_000, "regular").result.valid).toBe(true);
    expect(recommendation(5_000, "regular").result.valid).toBe(false);
    expect(recommendation(5_000, "mini").result.valid).toBe(true);
    expect(recommendation(500, "regular").result.valid).toBe(false);
    expect(recommendation(500, "mini").result.valid).toBe(true);
    expect(recommendation(500, "micro").result.valid).toBe(true);
    expect(recommendation(100, "mini").result.valid).toBe(false);
    expect(recommendation(100, "micro").result.valid).toBe(true);
  });

  it("marks the plan invalid when required account inputs are missing", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      equity: null,
      freeMargin: null,
      standardRule: null,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Account equity is required.",
        "Free margin is required.",
        "TP Standard Trading Rules are unavailable for this instrument.",
      ]),
    );
  });

  it("blocks a plan when tier, margin capacity, or maximum cycle loss is breached", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      freeMargin: 20,
      initialLot: 0.09,
      levels: 6,
      maxCycleLossPercent: 0.1,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/caps total open exposure|free-margin capacity|cycle loss/i);
  });

  it("enforces the selected tier on the initial entry and does not invent a Gold-only cap for Regular accounts", () => {
    const micro = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      initialLot: 0.1,
    });
    const regular = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      accountTier: "regular",
      initialLot: 1,
      equity: 1_000_000,
      freeMargin: 1_000_000,
    });

    expect(micro.valid).toBe(false);
    expect(micro.errors.join(" ")).toMatch(/micro tier range/i);
    expect(regular.valid).toBe(true);
  });

  it("rejects malformed Standard Plan stop directions for both sides", () => {
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
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Buy stop loss must be below the Standard Plan entry.",
        "Sell stop loss must be above the Standard Plan entry.",
      ]),
    );
  });

  it("uses the supplied Hang Seng and Nikkei point-based rules", () => {
    const hangSeng = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      instrument: "HSI",
      tradePlan: INDEX_TRADE_PLAN,
      standardRule: HANG_SENG_RULE,
      accountTier: "mini",
      initialLot: 0.1,
      levels: 1,
    });
    const nikkei = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      instrument: "NIKKEI",
      tradePlan: {
        ...INDEX_TRADE_PLAN,
        buy: {
          ...INDEX_TRADE_PLAN.buy,
          entryZone: "38,001–38,004",
          stopLoss: "37,900",
          takeProfit1: "38,153",
          takeProfit2: "38,307",
        },
        sell: {
          ...INDEX_TRADE_PLAN.sell,
          entryZone: "38,001–38,004",
          stopLoss: "38,105",
          takeProfit1: "37,847",
          takeProfit2: "37,693",
        },
      },
      standardRule: NIKKEI_RULE,
      accountTier: "mini",
      initialLot: 0.1,
      levels: 1,
    });

    expect(hangSeng.valid).toBe(true);
    expect(hangSeng.rule).toMatchObject({
      market: "hang_seng",
      contractSize: 5,
      minMovement: 1,
      marginAtMinimumLot: 100,
    });
    expect(hangSeng.buy?.marginRequired).toBe(200);
    expect(nikkei.valid).toBe(true);
    expect(nikkei.rule).toMatchObject({
      market: "nikkei",
      contractSize: 5,
      minMovement: 5,
      marginAtMinimumLot: 100,
      maxGapPercent: null,
    });
    expect(nikkei.buy?.ladder.every((level) => level.price % 5 === 0)).toBe(true);
    expect(nikkei.buy?.stopLoss % 5).toBe(0);
    expect(nikkei.assumptions.join(" ")).toMatch(/no percentage gap limit is assumed/i);
    expect(nikkei.rule?.marginBasis).toBe("day");
    expect(nikkei.assumptions.join(" ")).toMatch(/day trading only.*excludes overnight holding, rollover, and overnight fees/i);
  });

  it("rejects assets that do not have a transparent supported-product rule", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      instrument: "EUR/USD",
    });

    expect(result.valid).toBe(false);
    expect(result.buy).toBeNull();
    expect(result.errors).toContain("Adaptive position planning requires a supported TP Standard Trading Rules instrument.");
  });

  it("limits the adaptive calculator to instruments with supplied rules", () => {
    expect(getAdaptiveStandardRuleCode("XAU/USD")).toBe("XUL10");
    expect(getAdaptiveStandardRuleCode("BRENT")).toBe("BCO10_BBJ");
    expect(getAdaptiveStandardRuleCode("HSI")).toBe("HKK50_BBJ");
    expect(getAdaptiveStandardRuleCode("HANG SENG")).toBe("HKK50_BBJ");
    expect(getAdaptiveStandardRuleCode("NIKKEI")).toBe("JPK50_BBJ");
    for (const instrument of ["EUR/USD", "DXY", "XAG/USD", "BTC/USD"]) {
      expect(getAdaptiveStandardRuleCode(instrument)).toBeNull();
    }
  });

  it("rejects position calculations when TP Standard Trading Rules are unavailable", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      standardRule: null,
    });

    expect(result.valid).toBe(false);
    expect(result.rule).toBeNull();
    expect(result.errors).toContain("TP Standard Trading Rules are unavailable for this instrument.");
  });

  it("invalidates saved recommendations when the plan, timeframe, or refreshed fundamentals change", () => {
    const base = {
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      context: SUPPORTIVE_CONTEXT,
      standardRule: GOLD_RULE,
    };
    const original = createAdaptivePlanFingerprint(base);
    const changedTimeframe = createAdaptivePlanFingerprint({
      ...base,
      context: { ...SUPPORTIVE_CONTEXT, timeframe: "4h" },
    });
    const changedPlan = createAdaptivePlanFingerprint({
      ...base,
      tradePlan: {
        ...TRADE_PLAN,
        buy: { ...TRADE_PLAN.buy, stopLoss: "2,288.00" },
      },
    });
    const refreshedFundamentals = createAdaptivePlanFingerprint({
      ...base,
      context: {
        ...SUPPORTIVE_CONTEXT,
        fundamentalContext: {
          newsItems: [{
            id: "fresh-news",
            title: "Fresh policy update",
            summary: "New information.",
            source: "Newsmaker.id",
            url: null,
            publishedAt: "2026-08-27T12:00:00.000Z",
          }],
          calendarEvents: [],
        },
      },
    });

    expect(changedTimeframe).not.toBe(original);
    expect(changedPlan).not.toBe(original);
    expect(refreshedFundamentals).not.toBe(original);
  });
});