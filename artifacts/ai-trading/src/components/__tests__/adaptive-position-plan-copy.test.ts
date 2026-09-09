import { describe, expect, it } from "vitest";
import { buildAdaptivePlanCopyText } from "../adaptive-position-plan";
import type { AdaptiveSidePositionPlan } from "@/lib/adaptive-position-plan";
import { en } from "@/locales/en";

describe("Adaptive Plan copy text", () => {
  it("copies only accepted ladder positions and preserves the visible risk snapshot", () => {
    const plan = {
      side: "buy",
      entry: 2301,
      stopLoss: 2290,
      takeProfit1: 2315,
      takeProfit2: 2325,
      totalLots: 0.2,
      marginRequired: 200,
      estimatedCycleLoss: 220,
      weightedAverageEntry: 2300.5,
      totalFundsAtStop: 1220,
      remainingFundsAtStop: 9780,
      profitToTakeProfit1: 280,
      profitToTakeProfit2: 480,
      riskRewardToTakeProfit1: 1.2,
      riskRewardToTakeProfit2: 2,
      ladder: [
        { level: 0, price: 2301, lot: 0.1 },
        { level: 1, price: 2300, lot: 0.1 },
      ],
      rejectedLadder: [
        { level: 2, price: 9999, lot: 9.9, rejectReason: "loss_ceiling" },
      ],
    } as AdaptiveSidePositionPlan;

    const text = buildAdaptivePlanCopyText({
      instrument: "XAU/USD",
      plan,
      summary: {
        initialLot: 0.1,
        levels: 2,
        positions: 2,
        marginBudget: 10_000,
        maximumLoss: 500,
        usableRiskBudget: 250,
        riskUtilizationRate: 0.5,
        contextRiskMultiplier: 1,
        unusedRiskBuffer: 250,
        riskStyle: "conservative",
        lotProfile: "decreasing",
      },
      lang: "en",
      copy: en.analysis_detail,
    });

    expect(text).toContain("Direction: BUY");
    expect(text).toContain("1. 2,301 · 0.1 lot");
    expect(text).toContain("2. 2,300 · 0.1 lot");
    expect(text).toContain("SL: 2,290");
    expect(text).toContain("TP1: 2,315");
    expect(text).toContain("TP2: 2,325");
    expect(text).toContain("Usable risk budget: $250");
    expect(text).toContain("This is not an automated order.");
    expect(text).not.toContain("9,999");
    expect(text).not.toContain("9.9 lot");
  });
});