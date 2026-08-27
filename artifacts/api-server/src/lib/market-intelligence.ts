import type { CalendarEvent } from "./calendar";
import type { NewsItem, NewsSourceStatus } from "./news";

export type MarketIntelligenceStatus =
  | "reaffirm"
  | "caution"
  | "hold_scaling"
  | "invalidate";

export type MarketIntelligenceReasonCode =
  | "analysis_expired"
  | "stop_level_breached"
  | "price_unavailable"
  | "technical_unavailable"
  | "technical_conflict"
  | "high_impact_event"
  | "fresh_high_impact_news"
  | "source_unavailable"
  | "stale_news"
  | "volatile_market"
  | "high_risk";

export interface MarketIntelligence {
  status: MarketIntelligenceStatus;
  evaluatedAt: string;
  reasonCodes: MarketIntelligenceReasonCode[];
  livePrice: number | null;
  priceChangePercent: string | null;
  technical: { buy: number; sell: number; neutral: number } | null;
}

interface AnalysisForMarketCheck {
  timeframe: string;
  marketCondition: string | null;
  riskLevel: string | null;
  tradingBias: string | null;
  validUntil: Date;
  tradePlan: unknown;
}

interface MarketCheckInput {
  analysis: AnalysisForMarketCheck;
  news: NewsItem[];
  sourceStatuses: NewsSourceStatus[];
  calendar: CalendarEvent[];
  livePrice: number | null;
  priceChangePercent: string | null;
  technical: { buy: number; sell: number; neutral: number } | null;
}

function numericValue(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const match = String(value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeBias(value: string | null): "buy" | "sell" | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "bullish" || normalized === "bullish_strong" || normalized === "buy" || normalized === "strong_buy") return "buy";
  if (normalized === "bearish" || normalized === "bearish_strong" || normalized === "sell" || normalized === "strong_sell") return "sell";
  return null;
}

function stopLevelForPreferredSide(tradePlan: unknown): { side: "buy" | "sell"; stop: number } | null {
  if (!tradePlan || typeof tradePlan !== "object") return null;
  const plan = tradePlan as { preferredSide?: unknown; buy?: { stopLoss?: unknown }; sell?: { stopLoss?: unknown } };
  const side = plan.preferredSide === "buy" || plan.preferredSide === "sell" ? plan.preferredSide : null;
  if (!side) return null;
  const stop = numericValue(plan[side]?.stopLoss);
  return stop === null ? null : { side, stop };
}

function isNearHighImpactEvent(event: CalendarEvent, now: number): boolean {
  if (event.impact !== "★★★") return false;
  if (event.epochMs === null) return event.date === new Date(now).toISOString().slice(0, 10);
  return Math.abs(event.epochMs - now) <= 2 * 60 * 60 * 1000;
}

function hasFreshHighImpactNews(news: NewsItem[], now: number): boolean {
  return news.some((item) => {
    const published = new Date(item.publishedAt).getTime();
    return item.impact === "high" && Number.isFinite(published) && now - published <= 2 * 60 * 60 * 1000;
  });
}

function hasStaleNews(news: NewsItem[], now: number): boolean {
  if (news.length === 0) return false;
  const latest = Math.max(...news.map((item) => new Date(item.publishedAt).getTime()).filter(Number.isFinite));
  return !Number.isFinite(latest) || now - latest > 24 * 60 * 60 * 1000;
}

export function evaluateMarketIntelligence(input: MarketCheckInput): MarketIntelligence {
  const now = Date.now();
  const reasons: MarketIntelligenceReasonCode[] = [];
  const preferredStop = stopLevelForPreferredSide(input.analysis.tradePlan);

  if (input.analysis.validUntil.getTime() <= now) reasons.push("analysis_expired");
  if (input.livePrice === null) {
    reasons.push("price_unavailable");
  } else if (
    preferredStop &&
    ((preferredStop.side === "buy" && input.livePrice <= preferredStop.stop) ||
      (preferredStop.side === "sell" && input.livePrice >= preferredStop.stop))
  ) {
    reasons.push("stop_level_breached");
  }

  const configuredPrimary = input.sourceStatuses.filter(
    (source) => source.tier === "primary" && source.configured,
  );
  if (configuredPrimary.length > 0 && configuredPrimary.some((source) => !source.available)) {
    reasons.push("source_unavailable");
  }
  if (hasStaleNews(input.news, now)) reasons.push("stale_news");
  if (input.calendar.some((event) => isNearHighImpactEvent(event, now))) {
    reasons.push("high_impact_event");
  }
  if (hasFreshHighImpactNews(input.news, now)) reasons.push("fresh_high_impact_news");

  const bias = normalizeBias(input.analysis.tradingBias);
  if (!input.technical) {
    reasons.push("technical_unavailable");
  } else if (bias) {
    const technicalDirection = input.technical.buy === input.technical.sell
      ? null
      : input.technical.buy > input.technical.sell ? "buy" : "sell";
    if (technicalDirection !== null && technicalDirection !== bias) reasons.push("technical_conflict");
  }
  if (input.analysis.marketCondition === "volatile") reasons.push("volatile_market");
  if (input.analysis.riskLevel === "high") reasons.push("high_risk");

  const invalid = reasons.includes("analysis_expired") || reasons.includes("stop_level_breached");
  const hold = reasons.some((reason) =>
    ["price_unavailable", "technical_unavailable", "technical_conflict", "high_impact_event", "fresh_high_impact_news", "source_unavailable", "stale_news"].includes(reason),
  );
  const caution = reasons.some((reason) => reason === "volatile_market" || reason === "high_risk");

  return {
    status: invalid ? "invalidate" : hold ? "hold_scaling" : caution ? "caution" : "reaffirm",
    evaluatedAt: new Date(now).toISOString(),
    reasonCodes: reasons,
    livePrice: input.livePrice,
    priceChangePercent: input.priceChangePercent,
    technical: input.technical,
  };
}