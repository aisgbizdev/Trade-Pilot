/**
 * Regression coverage for the trade-plan overlay on the analysis detail
 * chart (task #99). The component fetches historical OHLC candles and
 * draws color-coded price lines for entry / SL / TP1 / TP2.
 *
 * Why we mock lightweight-charts:
 *   The library renders on a real <canvas> element; jsdom only provides
 *   a stub 2D context, so calling the real `createChart` either crashes
 *   or silently no-ops in our setup. We do not care about pixels here —
 *   we care that the parser maps trade-plan strings to the right number
 *   of price lines with the right titles / prices, and that the host
 *   reports `data-state="ready"` so consumers (and the e2e suite) can
 *   wait on it. The mock captures each `createPriceLine` call so the
 *   test asserts on the structured intent.
 *
 * Scenarios:
 *   1. Buy plan with a zone entry "2350.0-2356.0" → midpoint 2353.0
 *      plus SL / TP1 / TP2 ⇒ exactly 4 price lines.
 *   2. Sell plan whose entryZone is descriptive copy
 *      ("menunggu konfirmasi…") ⇒ entry line is omitted; the remaining
 *      numeric levels still render.
 *   3. "wait" preferredSide draws lines for BOTH sides so the user can
 *      see structure either way.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";

// --- lightweight-charts mock --------------------------------------------
// Capture every createPriceLine invocation so the test can assert the
// structured trade-plan overlay rather than pixel output.
const createdPriceLines: Array<{
  price: number;
  title: string;
  color: string;
  lineStyle: number;
}> = [];

vi.mock("lightweight-charts", () => {
  const CandlestickSeries = Symbol("CandlestickSeries");
  const LineStyle = { Solid: 0, Dotted: 1, Dashed: 2 };
  return {
    createChart: () => {
      const series = {
        setData: vi.fn(),
        createPriceLine: vi.fn((opts: {
          price: number;
          title: string;
          color: string;
          lineStyle: number;
        }) => {
          createdPriceLines.push({
            price: opts.price,
            title: opts.title,
            color: opts.color,
            lineStyle: opts.lineStyle,
          });
          return { __id: createdPriceLines.length };
        }),
        removePriceLine: vi.fn(),
      };
      return {
        addSeries: vi.fn(() => series),
        timeScale: () => ({ fitContent: vi.fn() }),
        remove: vi.fn(),
      };
    },
    CandlestickSeries,
    LineStyle,
  };
});

// Theme provider depends on matchMedia (stubbed by setup.ts) and is
// lightweight; importing the real one keeps the test honest.
import { ThemeProvider } from "../theme-provider";
import { AnalysisLevelsChart } from "../analysis-levels-chart";
import type { TradePlan } from "@workspace/api-client-react";
import type { AdaptivePositionPlanResult } from "@/lib/adaptive-position-plan";

function renderChart(props: {
  tradePlan: TradePlan | null;
  instrument?: string;
  timeframe?: string;
  adaptivePlan?: AdaptivePositionPlanResult | null;
  selectedAdaptiveSide?: "buy" | "sell" | null;
}) {
  return render(
    <ThemeProvider>
      <AnalysisLevelsChart
        instrument={props.instrument ?? "EUR/USD"}
        timeframe={props.timeframe ?? "1h"}
        tradePlan={props.tradePlan}
        adaptivePlan={props.adaptivePlan}
        selectedAdaptiveSide={props.selectedAdaptiveSide}
        height={300}
      />
    </ThemeProvider>,
  );
}

function makeSide(overrides: Partial<{
  entryZone: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
}>) {
  return {
    entryZone: overrides.entryZone ?? "1.0850",
    stopLoss: overrides.stopLoss ?? "1.0830",
    takeProfit1: overrides.takeProfit1 ?? "1.0880",
    takeProfit2: overrides.takeProfit2 ?? "1.0900",
    riskRewardRatio: "1:2",
    rationale: "stub",
  };
}

function stubCandlesFetch() {
  const candles = Array.from({ length: 12 }, (_, i) => {
    const t = new Date(2026, 0, 1, 9 + i, 0, 0).toISOString();
    const base = 1.0850 + i * 0.0005;
    return {
      date: t,
      open: base,
      high: base + 0.0010,
      low: base - 0.0010,
      close: base + 0.0002,
    };
  });
  return vi.fn(async () =>
    new Response(JSON.stringify({ candles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

beforeEach(() => {
  createdPriceLines.length = 0;
  vi.stubGlobal("fetch", stubCandlesFetch());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AnalysisLevelsChart", () => {
  it("draws all four levels for a buy plan and uses the zone midpoint for entry", async () => {
    const plan: TradePlan = {
      preferredSide: "buy",
      buy: makeSide({
        entryZone: "2350.0-2356.0", // midpoint 2353.0
        stopLoss: "2345.0",
        takeProfit1: "2360.0",
        takeProfit2: "2370.0",
      }),
      sell: makeSide({}),
    };

    renderChart({ tradePlan: plan, instrument: "XAU/USD", timeframe: "1h" });

    const host = await screen.findByTestId("analysis-levels-chart");
    await waitFor(() => expect(host.getAttribute("data-state")).toBe("ready"));

    // 4 lines for the buy side, none for the sell side.
    expect(createdPriceLines).toHaveLength(4);

    const byTitle = Object.fromEntries(
      createdPriceLines.map((l) => [l.title, l]),
    );
    expect(byTitle["BUY Entry"].price).toBeCloseTo(2353.0, 5);
    expect(byTitle["SL"].price).toBe(2345.0);
    expect(byTitle["TP1"].price).toBe(2360.0);
    expect(byTitle["TP2"].price).toBe(2370.0);

    // Entry line is dashed; the rest are solid.
    expect(byTitle["BUY Entry"].lineStyle).toBe(2);
    expect(byTitle["SL"].lineStyle).toBe(0);

    // Colors follow the documented palette (amber entry, red SL, emerald TP).
    expect(byTitle["BUY Entry"].color).toBe("#f59e0b");
    expect(byTitle["SL"].color).toBe("#ef4444");
    expect(byTitle["TP1"].color).toBe("#10b981");
    expect(byTitle["TP2"].color).toBe("#10b981");
  });

  it("omits the entry line when entryZone is descriptive text, keeping the numeric levels", async () => {
    const plan: TradePlan = {
      preferredSide: "sell",
      buy: makeSide({}),
      sell: makeSide({
        entryZone: "menunggu konfirmasi rejection di resistance",
        stopLoss: "2360.0",
        takeProfit1: "2340.0",
        takeProfit2: "2330.0",
      }),
    };

    renderChart({ tradePlan: plan, instrument: "XAU/USD", timeframe: "1h" });

    await waitFor(() =>
      expect(
        screen.getByTestId("analysis-levels-chart").getAttribute("data-state"),
      ).toBe("ready"),
    );

    // Entry skipped, SL + TP1 + TP2 remain ⇒ 3 lines, none labelled Entry.
    await waitFor(() => expect(createdPriceLines).toHaveLength(3));
    expect(createdPriceLines.map((l) => l.title)).toEqual(["SL", "TP1", "TP2"]);
    expect(createdPriceLines.find((l) => l.title.includes("Entry"))).toBeUndefined();
  });

  it("draws lines for BOTH sides when the AI says 'wait'", async () => {
    const plan: TradePlan = {
      preferredSide: "wait",
      buy: makeSide({
        entryZone: "1.0850",
        stopLoss: "1.0830",
        takeProfit1: "1.0880",
        takeProfit2: "1.0900",
      }),
      sell: makeSide({
        entryZone: "1.0900",
        stopLoss: "1.0920",
        takeProfit1: "1.0870",
        takeProfit2: "1.0850",
      }),
    };

    renderChart({ tradePlan: plan });

    await waitFor(() =>
      expect(
        screen.getByTestId("analysis-levels-chart").getAttribute("data-state"),
      ).toBe("ready"),
    );

    // 4 levels × 2 sides = 8 price lines.
    expect(createdPriceLines).toHaveLength(8);
    const titles = createdPriceLines.map((l) => l.title);
    expect(titles.filter((t) => t === "BUY Entry")).toHaveLength(1);
    expect(titles.filter((t) => t === "SELL Entry")).toHaveLength(1);
    expect(titles.filter((t) => t === "SL")).toHaveLength(2);
    expect(titles.filter((t) => t === "TP1")).toHaveLength(2);
    expect(titles.filter((t) => t === "TP2")).toHaveLength(2);
  });

  it("overlays every manual stage alongside the unchanged Standard Plan levels", async () => {
    const plan: TradePlan = {
      preferredSide: "buy",
      buy: makeSide({ entryZone: "2350", stopLoss: "2345", takeProfit1: "2360", takeProfit2: "2370" }),
      sell: makeSide({}),
    };
    const adaptivePlan: AdaptivePositionPlanResult = {
      valid: true, market: "gold", rule: null, errors: [], sideErrors: { buy: [], sell: [] }, assumptions: [],
      sell: null,
      buy: {
        side: "buy", entry: 2350, stopLoss: 2345, takeProfit1: 2360, takeProfit2: 2370,
        totalLots: 0.16, marginRequired: 16, estimatedCycleLoss: 6, potentialProfit: 24,
        breakEvenWinRate: 0.2,
        ladder: [
          { level: 0, price: 2350, lot: 0.1, cumulativeLots: 0.1, marginRequired: 10, estimatedRiskToStop: 5, reason: "Initial" },
          { level: 1, price: 2347.5, lot: 0.06, cumulativeLots: 0.16, marginRequired: 16, estimatedRiskToStop: 6, reason: "Validated stage" },
        ],
      },
      marginAllocated: 16, marginBuffer: 84, maximumLoss: 10, potentialResult: 24, breakEvenWinRate: 0.2,
    };

    renderChart({ tradePlan: plan, instrument: "XAU/USD", timeframe: "1h", adaptivePlan });

    await waitFor(() => expect(screen.getByTestId("analysis-levels-chart").getAttribute("data-state")).toBe("ready"));
    expect(createdPriceLines.map((line) => line.title)).toEqual(expect.arrayContaining(["BUY Entry", "SL", "TP1", "TP2", "BUY Start", "BUY L1"]));
  });

  it("shows the user-selected scenario on the adaptive chart", async () => {
    const plan: TradePlan = {
      preferredSide: "buy",
      buy: makeSide({ entryZone: "2350", stopLoss: "2345", takeProfit1: "2360", takeProfit2: "2370" }),
      sell: makeSide({ entryZone: "2352", stopLoss: "2357", takeProfit1: "2342", takeProfit2: "2335" }),
    };
    const adaptivePlan: AdaptivePositionPlanResult = {
      valid: true, market: "gold", rule: null, errors: [], sideErrors: { buy: [], sell: [] }, assumptions: [],
      buy: {
        side: "buy", entry: 2350, stopLoss: 2345, takeProfit1: 2360, takeProfit2: 2370,
        totalLots: 0.1, marginRequired: 10, estimatedCycleLoss: 5, potentialProfit: 20, breakEvenWinRate: 0.2,
        ladder: [{ level: 0, price: 2350, lot: 0.1, cumulativeLots: 0.1, marginRequired: 10, estimatedRiskToStop: 5, reason: "Initial" }],
      },
      sell: {
        side: "sell", entry: 2352, stopLoss: 2357, takeProfit1: 2342, takeProfit2: 2335,
        totalLots: 0.1, marginRequired: 10, estimatedCycleLoss: 5, potentialProfit: 20, breakEvenWinRate: 0.2,
        ladder: [{ level: 0, price: 2352, lot: 0.1, cumulativeLots: 0.1, marginRequired: 10, estimatedRiskToStop: 5, reason: "Initial" }],
      },
      marginAllocated: 10, marginBuffer: 90, maximumLoss: 10, potentialResult: 20, breakEvenWinRate: 0.2,
    };

    renderChart({ tradePlan: plan, instrument: "XAU/USD", adaptivePlan, selectedAdaptiveSide: "sell" });

    await waitFor(() => expect(screen.getByTestId("analysis-levels-chart").getAttribute("data-state")).toBe("ready"));
    expect(createdPriceLines.map((line) => line.title)).toEqual(expect.arrayContaining(["SELL Entry", "SELL Start"]));
    expect(createdPriceLines.map((line) => line.title)).not.toContain("BUY Start");
  });
});
