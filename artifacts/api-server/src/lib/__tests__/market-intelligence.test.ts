import { describe, expect, it } from "vitest";
import { evaluateMarketIntelligence } from "../market-intelligence";
import type { CalendarEvent } from "../calendar";
import type { NewsItem, NewsSourceStatus } from "../news";

const sourceStatuses: NewsSourceStatus[] = [
  { id: "newsmaker", label: "Newsmaker.id", tier: "primary", configured: true, available: true },
  { id: "yahoo", label: "Yahoo Finance", tier: "standard", configured: true, available: true },
];

const baseAnalysis = {
  timeframe: "1D",
  marketCondition: "trending_up",
  riskLevel: "low",
  tradingBias: "bullish",
  validUntil: new Date(Date.now() + 60 * 60 * 1000),
  tradePlan: { preferredSide: "buy", buy: { stopLoss: "90" }, sell: { stopLoss: "110" } },
};

const technical = { buy: 4, sell: 1, neutral: 1 };
const normalNews: NewsItem[] = [{
  id: "n1", title: "Gold demand remains supported", summary: "", source: "Newsmaker.id",
  url: null, publishedAt: new Date().toISOString(), impact: "low",
}];
const noEvents: CalendarEvent[] = [];

function evaluate(overrides: Partial<Parameters<typeof evaluateMarketIntelligence>[0]> = {}) {
  return evaluateMarketIntelligence({
    analysis: baseAnalysis,
    news: normalNews,
    sourceStatuses,
    calendar: noEvents,
    livePrice: 100,
    priceChangePercent: "+0.20%",
    technical,
    ...overrides,
  });
}

describe("evaluateMarketIntelligence", () => {
  it("reaffirms only when price, technicals, and source coverage align", () => {
    expect(evaluate().status).toBe("reaffirm");
  });

  it("invalidates a buy plan when live price crosses its stop", () => {
    const result = evaluate({ livePrice: 89 });
    expect(result.status).toBe("invalidate");
    expect(result.reasonCodes).toContain("stop_level_breached");
  });

  it("holds scaling for missing or conflicting technical confirmation", () => {
    expect(evaluate({ technical: null }).status).toBe("hold_scaling");
    expect(evaluate({ technical: { buy: 1, sell: 4, neutral: 1 } }).reasonCodes)
      .toContain("technical_conflict");
  });

  it("holds scaling for a near high-impact event or stale news", () => {
    const highImpact: CalendarEvent = {
      date: new Date().toISOString().slice(0, 10), time: "12:00", epochMs: Date.now() + 30 * 60 * 1000,
      currency: "USD", event: "FOMC", impact: "★★★", actual: null, forecast: null, previous: null,
    };
    expect(evaluate({ calendar: [highImpact] }).reasonCodes).toContain("high_impact_event");
    expect(evaluate({
      news: [{ ...normalNews[0]!, publishedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() }],
    }).reasonCodes).toContain("stale_news");
  });
});