import { describe, expect, it } from "vitest";
import type { StandardTradingRuleInstrument, TradePlan } from "@workspace/api-client-react";
import { compareAdaptiveAccountTiers } from "./adaptive-tier-comparison";

const tradePlan: TradePlan = {
  preferredSide: "buy",
  buy: {
    entryZone: "2,300.00–2,302.00", stopLoss: "2,281.00",
    takeProfit1: "2,315.00", takeProfit2: "2,325.00",
    riskRewardRatio: "1:1.5", rationale: "Saved Buy",
  },
  sell: {
    entryZone: "2,300.00–2,302.00", stopLoss: "2,336.00",
    takeProfit1: "2,290.00", takeProfit2: "2,280.00",
    riskRewardRatio: "1:1.2", rationale: "Saved Sell",
  },
};

const rule: StandardTradingRuleInstrument = {
  code: "XUL10", product: "Gold (Loco London)", contractSize: 10,
  contractUnit: "troy ounce", tradingDays: "Monday–Friday",
  tradingHours: { summer: "06:00–03:30 WIB", winter: "06:00–04:30 WIB" },
  initialMarginUsdPerLot: 100, facilityFeeUsdPerLotPerSide: 1.5,
  vatPercent: 11, rolloverUsdPerLotPerNight: 0.5, priceSource: "Telequote",
  priceGuidance: "Last Trade", minimumSpread: "USD 0.40 / troy ounce / side",
  maximumSpread: "USD 1.00 / troy ounce / side",
  hecticSpread: "Based on market conditions",
  minimumPriceMovement: "USD 0.01 / troy ounce",
  limitStopRange: "USD 6–USD 20", deliveryBy: "Cash settlement",
};

const context = {
  timeframe: "1h", validUntil: new Date(Date.now() + 86_400_000).toISOString(),
  marketCondition: "trending_up", riskLevel: "low", tradingBias: "bullish_strong",
  confidenceMin: 65, confidenceMax: 78, techBuyCount: 14,
  techSellCount: 4, techNeutralCount: 3,
  fundamentalContext: { newsItems: [], calendarEvents: [] },
};

const input = {
  instrument: "XAU/USD",
  tradePlan, standardRule: rule, context,
  availableMargin: 1_000, maximumLoss: 200, existingExposure: 0,
  checkpointPrices: { buy: [], sell: [] },
  riskStyle: "balanced" as const,
};

describe("one-analysis account-tier comparison", () => {
  it("keeps a $200 Mini Buy as a limited option, not an entry recommendation, while Sell is unsupported", () => {
    const rows = compareAdaptiveAccountTiers(input);
    expect(rows.mini.buy).toMatchObject({
      riskAtStop: 200, effectiveBudget: 150, fit: "limited", marketAligned: true,
    });
    expect(rows.mini.action).toBe("wait");
    expect(rows.mini.actionReason).toBe("limited");
    expect(rows.mini.sell).toMatchObject({
      riskAtStop: 350, fit: "blocked_risk", marketAligned: false,
    });
    expect(rows.micro.buy.riskAtStop).toBeCloseTo(20);
    expect(rows.micro.buy.fit).toBe("within_target");
    expect(rows.micro.action).toBe("buy");
    expect(rows.regular.buy.riskAtStop).toBeCloseTo(2_000);
    expect(rows.regular.action).toBe("skip");
    expect(rows.regular.actionReason).toBe("both");
    expect(rows.micro.recommendation.decision.preferredSide).toBe("buy");
    expect(rows.mini.recommendation.decision.preferredSide).toBe("buy");
    expect(rows.regular.recommendation.decision.preferredSide).toBe("buy");
  });

  it("does not confuse available broker funds with the hard maximum loss or the style target", () => {
    const rows = compareAdaptiveAccountTiers({ ...input, availableMargin: 250 });
    expect(rows.mini.buy.fit).toBe("blocked_funds");
    expect(rows.mini.buy.fundsAtStop).toBe(300);
    expect(rows.mini.action).toBe("skip");
    expect(rows.mini.actionReason).toBe("funds");
  });

  it("never promotes an unsupported direction even when the contract fits", () => {
    const rows = compareAdaptiveAccountTiers({
      ...input,
      context: { ...context, marketCondition: "trending_down" },
    });
    expect(rows.micro.buy.fit).toBe("within_target");
    expect(rows.micro.buy.marketAligned).toBe(false);
    expect(rows.micro.action).toBe("skip");
    expect(rows.micro.actionReason).toBe("market_conflict");
  });

  it("fails closed for an expired saved analysis", () => {
    const rows = compareAdaptiveAccountTiers({
      ...input,
      context: { ...context, validUntil: new Date(Date.now() - 60_000).toISOString() },
    });
    expect(rows.mini.buy.fit).toBe("unavailable");
    expect(rows.mini.action).toBe("wait");
  });
});