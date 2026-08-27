import { describe, expect, it } from "vitest";
import type { TradePlan } from "@workspace/api-client-react";
import { buildAdaptivePositionPlan } from "./adaptive-position-plan";

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

describe("buildAdaptivePositionPlan", () => {
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