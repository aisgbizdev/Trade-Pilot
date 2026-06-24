// Tests for the trade-plan numeric hygiene helpers in lib/openai:
// - parseLevelPrice: extract a representative price from free-text levels
// - computeRiskReward: derive "1:X.X" from entry/SL/TP1
// - reconcileTradePlanRiskReward: rewrite each side's ratio from its own levels
import { describe, expect, it } from "vitest";

import {
  parseLevelPrice,
  computeRiskReward,
  reconcileTradePlanRiskReward,
  type TradePlan,
} from "../openai";

describe("parseLevelPrice", () => {
  it("parses a single price", () => {
    expect(parseLevelPrice("1.0850")).toBeCloseTo(1.085, 6);
  });

  it("averages a range to its midpoint", () => {
    expect(parseLevelPrice("1.0850 - 1.0865")).toBeCloseTo(1.08575, 6);
    expect(parseLevelPrice("1.0850 – 1.0865")).toBeCloseTo(1.08575, 6);
  });

  it("ignores thousands separators", () => {
    expect(parseLevelPrice("4,650.50")).toBeCloseTo(4650.5, 6);
  });

  it("pulls the number out of descriptive text", () => {
    expect(parseLevelPrice("di atas 1.0880 setelah breakout")).toBeCloseTo(
      1.088,
      6,
    );
  });

  it("ignores timeframe tokens so their digits aren't read as prices", () => {
    expect(parseLevelPrice("di atas 4680 setelah breakout H1")).toBeCloseTo(
      4680,
      6,
    );
    expect(parseLevelPrice("entry 4650 - 4665 di 4H")).toBeCloseTo(4657.5, 6);
    expect(parseLevelPrice("tunggu konfirmasi candle 30m di 2305")).toBeCloseTo(
      2305,
      6,
    );
  });

  it("returns null for purely descriptive levels", () => {
    expect(parseLevelPrice("menunggu konfirmasi di area support")).toBeNull();
    expect(parseLevelPrice("")).toBeNull();
    expect(parseLevelPrice("n/a")).toBeNull();
  });
});

describe("computeRiskReward", () => {
  it("computes a 1:2 setup", () => {
    // entry 100, SL 95 (risk 5), TP1 110 (reward 10) → 1:2
    expect(computeRiskReward("100", "95", "110")).toBe("1:2.0");
  });

  it("computes a fractional ratio from zones", () => {
    // entry mid 2305, SL 2290 (risk 15), TP1 2330 (reward 25) → 1.666...
    expect(computeRiskReward("2300-2310", "2290", "2330")).toBe("1:1.7");
  });

  it("works for a short setup (entry above SL/TP order reversed)", () => {
    // entry 100, SL 105 (risk 5), TP1 90 (reward 10) → 1:2
    expect(computeRiskReward("100", "105", "90")).toBe("1:2.0");
  });

  it("returns null when a level is non-numeric", () => {
    expect(computeRiskReward("menunggu konfirmasi", "95", "110")).toBeNull();
  });

  it("returns null when the risk leg is zero", () => {
    expect(computeRiskReward("100", "100", "110")).toBeNull();
  });

  it("returns null when levels contradict the side direction", () => {
    // buy with SL above entry / TP below entry is internally inconsistent
    expect(computeRiskReward("100", "110", "90", "buy")).toBeNull();
    // sell with SL below entry / TP above entry is inconsistent too
    expect(computeRiskReward("100", "90", "110", "sell")).toBeNull();
  });

  it("accepts levels that straddle entry in the correct direction", () => {
    expect(computeRiskReward("100", "95", "110", "buy")).toBe("1:2.0");
    expect(computeRiskReward("100", "105", "90", "sell")).toBe("1:2.0");
  });
});

describe("reconcileTradePlanRiskReward", () => {
  it("overrides a drifted ratio with the value implied by the levels", () => {
    const plan: TradePlan = {
      preferredSide: "buy",
      buy: {
        entryZone: "100",
        stopLoss: "95",
        takeProfit1: "110",
        takeProfit2: "120",
        riskRewardRatio: "1:5", // wrong on purpose
        rationale: "x",
      },
      sell: {
        entryZone: "100",
        stopLoss: "105",
        takeProfit1: "90",
        takeProfit2: "80",
        riskRewardRatio: "1:9", // wrong on purpose
        rationale: "y",
      },
    };

    const fixed = reconcileTradePlanRiskReward(plan);
    expect(fixed.buy.riskRewardRatio).toBe("1:2.0");
    expect(fixed.sell.riskRewardRatio).toBe("1:2.0");
    // Other fields untouched.
    expect(fixed.preferredSide).toBe("buy");
    expect(fixed.buy.rationale).toBe("x");
  });

  it("falls back to n/a for descriptive (no-number) levels", () => {
    const plan: TradePlan = {
      preferredSide: "wait",
      buy: {
        entryZone: "di sekitar support terdekat",
        stopLoss: "menunggu konfirmasi",
        takeProfit1: "resistance terdekat",
        takeProfit2: "resistance berikutnya",
        riskRewardRatio: "1:2",
        rationale: "x",
      },
      sell: {
        entryZone: "di sekitar resistance terdekat",
        stopLoss: "menunggu konfirmasi",
        takeProfit1: "support terdekat",
        takeProfit2: "support berikutnya",
        riskRewardRatio: "1:2",
        rationale: "y",
      },
    };

    const fixed = reconcileTradePlanRiskReward(plan);
    expect(fixed.buy.riskRewardRatio).toBe("n/a");
    expect(fixed.sell.riskRewardRatio).toBe("n/a");
  });
});
