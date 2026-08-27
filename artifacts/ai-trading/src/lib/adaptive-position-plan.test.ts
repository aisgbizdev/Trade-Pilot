import { describe, expect, it } from "vitest";
import type { TradePlan } from "@workspace/api-client-react";
import { buildAdaptivePlanRecommendation, buildAdaptivePositionPlan } from "./adaptive-position-plan";

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

const VALID_INPUT = {
  instrument: "XAU/USD",
  tradePlan: TRADE_PLAN,
  equity: 100_000,
  freeMargin: 100_000,
  existingExposure: 0,
  marginPerLot: 1_000,
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
      marginPerLot: 1_000,
      preference: "balanced",
      riskPercent: 2,
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation).toMatchObject({
      marginBudget: 65_000,
      maximumLoss: 2_000,
    });
    expect(recommendation.decision).toMatchObject({
      posture: "scaling_allowed",
      preferredSide: "both",
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
      marginPerLot: 1_000,
      preference: "balanced",
      riskPercent: 2,
      context: SUPPORTIVE_CONTEXT,
    });
    const shortTimeframe = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      marginPerLot: 1_000,
      preference: "balanced",
      riskPercent: 2,
      context: { ...SUPPORTIVE_CONTEXT, timeframe: "5m" },
    });

    expect(hourly.result.buy?.ladder).toHaveLength(3);
    expect(shortTimeframe.decision.posture).toBe("entry_only");
    expect(shortTimeframe.result.buy?.ladder).toHaveLength(1);
    expect(shortTimeframe.result.sell?.ladder).toHaveLength(1);
    expect(shortTimeframe.decision.reasonCodes).toContain("short_timeframe");
  });

  it("blocks staged plans when technical direction conflicts with market bias", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      marginPerLot: 1_000,
      preference: "balanced",
      riskPercent: 2,
      context: {
        ...SUPPORTIVE_CONTEXT,
        marketCondition: "ranging",
        techBuyCount: 3,
        techSellCount: 15,
      },
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.result.buy?.ladder).toHaveLength(1);
    expect(recommendation.result.sell?.ladder).toHaveLength(1);
    expect(recommendation.decision.posture).toBe("entry_only");
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
        marginPerLot: 1_000,
        preference: "active",
        riskPercent: 2,
        context,
      });

      expect(recommendation.result.buy?.ladder).toHaveLength(1);
      expect(recommendation.result.sell?.ladder).toHaveLength(1);
      expect(recommendation.decision.posture).toBe("entry_only");
      expect(recommendation.decision.reasonCodes).toContain("context_unavailable");
    }
  });

  it("uses high-impact calendar risk to reduce a complete plan to entry-only", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      marginPerLot: 1_000,
      preference: "active",
      riskPercent: 2,
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
    expect(recommendation.result.buy?.ladder).toHaveLength(1);
    expect(recommendation.result.sell?.ladder).toHaveLength(1);
    expect(recommendation.decision.reasonCodes).toContain("fundamental_high_impact");
  });

  it("builds independent buy and sell ladders without changing Standard Plan levels", () => {
    const result = buildAdaptivePositionPlan(VALID_INPUT);

    expect(result.valid).toBe(true);
    expect(result.buy?.ladder).toHaveLength(4);
    expect(result.sell?.ladder).toHaveLength(4);
    expect(result.buy?.ladder[0].price).toBe(2301);
    expect(result.buy?.ladder[1].price).toBeLessThan(result.buy?.ladder[0].price ?? 0);
    expect(result.sell?.ladder[1].price).toBeGreaterThan(result.sell?.ladder[0].price ?? 0);
    expect(TRADE_PLAN.buy.entryZone).toBe("2,300.00–2,302.00");
    expect(TRADE_PLAN.sell.stopLoss).toBe("2,312.00");
  });

  it("keeps each additional stage at or below the prior lot and records stage margin", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      initialLot: 0.09,
      levels: 3,
      maxLossAmount: 100,
    });

    const ladder = result.buy?.ladder ?? [];
    expect(ladder).toHaveLength(4);
    expect(ladder.slice(1).every((level, index) => level.lot <= ladder[index]!.lot)).toBe(true);
    expect(ladder.every((level) => level.marginRequired > 0)).toBe(true);
    expect(result.buy?.estimatedCycleLoss).toBeLessThanOrEqual(100);
  });

  it("calculates the maximum loss from the margin risk percentage", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      marginPerLot: 100,
      preference: "custom",
      riskPercent: 0.075,
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.recommendation?.maximumLoss).toBe(75);
    expect(recommendation.result.maximumLoss).toBe(75);
    expect(recommendation.result.marginAllocated).toBeGreaterThan(0);
    expect(recommendation.result.marginBuffer).toBeGreaterThanOrEqual(0);
    expect(recommendation.result.breakEvenWinRate).toBeGreaterThan(0);
    expect(recommendation.result.breakEvenWinRate).toBeLessThan(1);
  });

  it("requires a positive margin risk percentage before calculating a plan", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      marginPerLot: 100,
      preference: "custom",
      riskPercent: null,
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(false);
    expect(recommendation.result.errors).toContain("Enter a margin risk percentage between 0.01% and 100%.");
  });

  it("allows the complete Standard Plan side when the opposing legacy scenario is incomplete", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: { ...TRADE_PLAN, sell: { ...TRADE_PLAN.sell, entryZone: "", stopLoss: "" } },
      availableMargin: 100_000,
      marginPerLot: 100,
      preference: "custom",
      riskPercent: 5,
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(true);
    expect(recommendation.result.buy).not.toBeNull();
    expect(recommendation.result.sell).toBeNull();
  });

  it("includes mandatory TP fees and VAT in the loss cap and never recommends below the TP minimum lot", () => {
    const recommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      marginPerLot: 100,
      minimumLot: 0.1,
      maximumLot: 0.9,
      facilityFeeUsdPerLotPerSide: 1.5,
      vatPercent: 11,
      preference: "custom",
      riskPercent: 0.01,
      context: SUPPORTIVE_CONTEXT,
    });

    expect(recommendation.result.valid).toBe(false);
    expect(recommendation.result.errors.join(" ")).toMatch(/cycle loss exceeds/i);

    const feeAwarePlan = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      minimumLot: 0.1,
      maximumLot: 0.9,
      initialLot: 0.1,
      levels: 0,
      maxLossAmount: 100,
      facilityFeeUsdPerLotPerSide: 1.5,
      vatPercent: 11,
    });
    // Buy distance is $11/oz × 10 units × 0.1 lot = $11; costs add $0.333.
    expect(feeAwarePlan.buy?.estimatedCycleLoss).toBeCloseTo(11.333, 3);

    const executableRecommendation = buildAdaptivePlanRecommendation({
      instrument: "XAU/USD",
      tradePlan: TRADE_PLAN,
      availableMargin: 100_000,
      marginPerLot: 100,
      minimumLot: 0.1,
      maximumLot: 0.9,
      facilityFeeUsdPerLotPerSide: 1.5,
      vatPercent: 11,
      preference: "balanced",
      riskPercent: 2,
      context: SUPPORTIVE_CONTEXT,
    });
    expect(executableRecommendation.result.buy?.ladder.every((level) => level.lot >= 0.1)).toBe(true);
    expect(executableRecommendation.result.buy?.totalLots).toBeLessThanOrEqual(0.9);

    // Existing open-lot input is intentionally not part of the user-facing
    // flow; the selected scenario is calculated from margin and risk percent.
  });

  it("marks the plan invalid when required account inputs are missing", () => {
    const result = buildAdaptivePositionPlan({
      ...VALID_INPUT,
      equity: null,
      freeMargin: null,
      marginPerLot: null,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Account equity is required.",
        "Free margin is required.",
        "Margin per lot is required.",
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
      marginPerLot: 1_000,
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
    expect(result.errors).toContain("Adaptive rules are currently defined for Gold and Brent only.");
  });
});