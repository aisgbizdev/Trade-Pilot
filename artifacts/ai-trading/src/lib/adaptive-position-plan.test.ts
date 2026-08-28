import { describe, expect, it } from "vitest";
import type { StandardTradingRuleInstrument, TradePlan } from "@workspace/api-client-react";
import {
  buildAdaptivePlanRecommendation,
  buildAdaptivePositionPlan,
  createAdaptivePlanFingerprint,
} from "./adaptive-position-plan";

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
  it("creates a situation-aware recommendation from available margin without account-form inputs", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      standardRule: GOLD_RULE,
      preference: "balanced",
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation).toMatchObject({
      levels: 2,
      marginBudget: 65_000,
    });
    expect(recommendation.recommendation?.initialLot).toBeGreaterThan(0);
    const initialLot = recommendation.recommendation?.initialLot ?? 0;
    expect(initialLot).toBeGreaterThanOrEqual(1);
    const lotScale = initialLot >= 0.1 ? 10 : 100;
    expect(initialLot * lotScale).toBeCloseTo(Math.round(initialLot * lotScale), 8);
    expect(recommendation.decision).toMatchObject({
      posture: "scaling_allowed",
      preferredSide: "buy",
    });
    expect(recommendation.result.buy?.ladder).toHaveLength(3);
    expect(recommendation.result.sell?.ladder).toHaveLength(1);
    expect(recommendation.decision.reasonCodes).toEqual(
      expect.arrayContaining(["trend_favors_buy", "technical_supports_buy", "staged_add_condition"]),
    );
  });

  it("changes from staged scaling to entry-only on a shorter timeframe", () => {
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

    expect(hourly.recommendation?.levels).toBe(2);
    expect(shortTimeframe.recommendation?.levels).toBe(0);
    expect(shortTimeframe.decision.posture).toBe("entry_only");
    expect(shortTimeframe.result.buy?.ladder).toHaveLength(1);
    expect(shortTimeframe.result.sell?.ladder).toHaveLength(1);
    expect(shortTimeframe.decision.reasonCodes).toContain("short_timeframe");
  });

  it("falls back to an entry-only plan when the requested layers exceed the loss budget", () => {
    const wideStopPlan: TradePlan = {
      ...TRADE_PLAN,
      buy: { ...TRADE_PLAN.buy, stopLoss: "800.00" },
      sell: { ...TRADE_PLAN.sell, stopLoss: "3,800.00" },
    };
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: wideStopPlan,
      availableMargin: 1_000,
      standardRule: GOLD_RULE,
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
      posture: "entry_only",
      preferredSide: "buy",
    });
    expect(recommendation.result.buy).not.toBeNull();
    expect(recommendation.result.sell).toBeNull();
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

  it("uses high-impact calendar risk to reduce a complete plan to entry-only", () => {
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
    expect(recommendation.recommendation?.levels).toBe(0);
    expect(recommendation.decision.reasonCodes).toContain("fundamental_high_impact");
  });

  it("builds independent buy and sell ladders without changing Standard Plan levels", () => {
    const result = buildAdaptivePositionPlan(VALID_INPUT);

    expect(result.valid).toBe(true);
    expect(result.rule).toMatchObject({
      contractSize: GOLD_RULE.contractSize,
      minMovement: 0.01,
      marginPerLot: GOLD_RULE.initialMarginUsdPerLot,
      source: "TP Standard Trading Rules",
    });
    expect(result.buy?.ladder).toHaveLength(4);
    expect(result.sell?.ladder).toHaveLength(4);
    expect(result.buy?.ladder[0].price).toBe(2301);
    expect(result.buy?.ladder[1].price).toBeLessThan(result.buy?.ladder[0].price ?? 0);
    expect(result.sell?.ladder[1].price).toBeGreaterThan(result.sell?.ladder[0].price ?? 0);
    expect(result.buy?.marginRequired).toBe(4);
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
    expect(result.errors.join(" ")).toMatch(/caps each ladder entry|free-margin capacity|cycle loss/i);
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

  it("rejects assets that do not have a transparent Gold or Brent rule", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      instrument: "EUR/USD",
    });

    expect(result.valid).toBe(false);
    expect(result.buy).toBeNull();
    expect(result.errors).toContain("Adaptive position planning requires a supported TP Standard Trading Rules instrument.");
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