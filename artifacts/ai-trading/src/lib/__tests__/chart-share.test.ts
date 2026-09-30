import { afterEach, describe, expect, it, vi } from "vitest";
import { renderChartSharePng, selectAnalysisCandles } from "../chart-share";
import type { TradePlan } from "@workspace/api-client-react";

const candle = (hour: number) => ({
  date: new Date(Date.UTC(2026, 8, 9, hour)).toISOString(),
  open: 2300 + hour, high: 2302 + hour, low: 2299 + hour, close: 2301 + hour,
});

const copy = {
  title: "Analysis chart", analyzed: "Analyzed", made: "Image created",
  bias: "Bias", suggested: "Suggested", buy: "Buy scenario", sell: "Sell scenario",
  both: "WAIT — review Buy & Sell", entry: "Entry", stop: "Stop Loss", tp1: "TP1", tp2: "TP2",
  sourceNote: "Historical candles before analysis. Levels from saved analysis.",
  warning: "Not an entry instruction. Check risks and invalidation.",
  accessibleRange: "Historical candles from {start} to {end} ({count} candles).",
  accessibleLevels: "Standard Plan levels drawn: {levels}.",
  accessibleNoLevels: "No Standard Plan levels are drawn.",
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("selectAnalysisCandles", () => {
  it("excludes the incomplete analysis-time bucket and every later candle", () => {
    const result = selectAnalysisCandles(
      Array.from({ length: 14 }, (_, i) => candle(i)),
      "1h",
      "2026-09-09T10:25:00.000Z",
    );
    expect(result).toHaveLength(10);
    expect(result.at(-1)?.date).toBe(candle(9).date);
  });

  it("fails closed rather than exporting only current candles as an old analysis", () => {
    expect(() => selectAnalysisCandles(
      Array.from({ length: 14 }, (_, i) => candle(i)),
      "1h",
      "2026-09-08T10:25:00.000Z",
    )).toThrow(/unavailable/);
  });

  it("filters broken bars, sorts timestamps, and rejects sparse history", () => {
    const source = Array.from({ length: 9 }, (_, i) => candle(i)).reverse();
    const result = selectAnalysisCandles([null, { ...candle(5), high: null }, ...source], "1h", "2026-09-09T09:05:00.000Z");
    expect(result).toHaveLength(9);
    expect(result[0].date).toBe(candle(0).date);
    expect(() => selectAnalysisCandles(source.slice(0, 3), "1h", "2026-09-09T09:05:00.000Z")).toThrow(/unavailable/);
  });
});

it("renders the saved WAIT status, both plan sides, original time and warnings into one PNG", async () => {
  const text = vi.fn();
  const ctx = {
    fillText: text,
    fillRect: vi.fn(),
    stroke: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    setLineDash: vi.fn(),
    measureText: (value: string) => ({ width: value.length * 10 }),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,aW1hZ2U=");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ candles: Array.from({ length: 14 }, (_, i) => candle(i)) }),
  }));
  const side = {
    entryZone: "Above 2300 after H1 breakout",
    stopLoss: "2290",
    takeProfit1: "2320",
    takeProfit2: "2340",
    riskRewardRatio: "1:2",
    rationale: "Reference only",
  };
  const plan = { preferredSide: "wait", buy: side, sell: { ...side, entryZone: "Below 2280 after H1 breakdown" } } as TradePlan;
  const result = await renderChartSharePng({
    instrument: "XAU/USD",
    timeframe: "1h",
    analyzedAt: "2026-09-09T10:25:00.000Z",
    bias: "Neutral / Wait",
    plan,
    locale: "en-US",
    copy,
  });
  const drawn = text.mock.calls.map(([value]) => String(value)).join(" | ");
  expect(drawn).toContain("Neutral / Wait");
  expect(drawn).toContain("WAIT — review Buy & Sell");
  expect(drawn).toContain("Above 2300 after H1 breakout");
  expect(drawn).toContain("Below 2280 after H1 breakdown");
  expect(drawn).toContain("Historical candles before analysis");
  expect(drawn).toContain("Check risks and invalidation");
  expect(drawn).toContain("Image created");
  expect(result.blob.type).toBe("image/png");
  expect(result.blob.size).toBeGreaterThan(0);
  expect(result.description).toContain("Historical candles from Sep 9, 2026, 12:00 AM UTC to Sep 9, 2026, 09:00 AM UTC (10 candles)");
  expect(result.description).toContain("Buy scenario Entry: 2,300");
  expect(result.description).toContain("Sell scenario TP2: 2,340");
  expect(result.description).not.toContain("live price");
});

it("describes an Indonesian historical chart without inventing plan levels", async () => {
  const ctx = {
    fillText: vi.fn(), fillRect: vi.fn(), stroke: vi.fn(), beginPath: vi.fn(),
    moveTo: vi.fn(), lineTo: vi.fn(), setLineDash: vi.fn(),
    measureText: (value: string) => ({ width: value.length * 10 }),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,aW1hZ2U=");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ candles: Array.from({ length: 14 }, (_, i) => candle(i)) }),
  }));
  const result = await renderChartSharePng({
    instrument: "XAU/USD", timeframe: "1h", analyzedAt: "2026-09-09T10:25:00.000Z",
    bias: "Netral", plan: null, locale: "id-ID",
    copy: {
      ...copy,
      title: "Grafik analisis",
      accessibleRange: "Candle historis dari {start} sampai {end} ({count} candle).",
      accessibleNoLevels: "Tidak ada level Standard Plan yang digambar.",
      sourceNote: "Bukan harga live.",
    },
  });
  expect(result.description).toContain("Candle historis dari 9 Sep 2026");
  expect(result.description).toContain("(10 candle)");
  expect(result.description).toContain("Tidak ada level Standard Plan yang digambar.");
  expect(result.description).toContain("Bukan harga live.");
});