import { describe, expect, it } from "vitest";
import { assessAdaptiveCandleFreshness } from "./adaptive-position-plan";

const now = Date.parse("2026-09-24T12:00:00.000Z");
const source = {
  sourceFetchedAt: new Date(now - 60_000).toISOString(),
  sourceMaxAgeMs: 60 * 60_000,
  isStale: false,
  staleReason: null,
};

describe("Adaptive candle freshness", () => {
  it("accepts a recently fetched daily bar even if the market is closed", () => {
    const result = assessAdaptiveCandleFreshness(
      [{ date: new Date(now - 2 * 24 * 60 * 60_000).toISOString() }],
      "1D", source, now,
    );
    expect(result.reason).toBeNull();
    expect(result.expiresAt).toBe(now - 60_000 + 60 * 60_000);
  });

  it("distinguishes a bar too old for intraday from an old cache", () => {
    const oldBar = [{ date: new Date(now - 2 * 24 * 60 * 60_000).toISOString() }];
    expect(assessAdaptiveCandleFreshness(oldBar, "1h", source, now).reason).toBe("bar_old");
    const recentBar = [{ date: new Date(now - 60_000).toISOString() }];
    expect(assessAdaptiveCandleFreshness(recentBar, "1D", {
      ...source, sourceFetchedAt: new Date(now - 2 * 60 * 60_000).toISOString(),
    }, now).reason).toBe("source_old");
  });

  it("rejects an upstream failure even when its cached bars and retrieval time are recent", () => {
    const candles = [{ date: new Date(now - 60_000).toISOString() }];
    expect(assessAdaptiveCandleFreshness(candles, "1D", {
      ...source, isStale: true, staleReason: "feed_unavailable",
    }, now).reason).toBe("feed_unavailable");
    expect(assessAdaptiveCandleFreshness(candles, "1D", {}, now).reason).toBe("source_missing");
  });
});