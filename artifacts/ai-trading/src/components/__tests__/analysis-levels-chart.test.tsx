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
 *   4. Directional entry text containing timeframe tokens keeps the actual
 *      price instead of treating the timeframe digits as a range bound.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import type { AutoscaleInfoProvider } from "lightweight-charts";

// --- lightweight-charts mock --------------------------------------------
// Capture every createPriceLine invocation so the test can assert the
// structured trade-plan overlay rather than pixel output.
const createdPriceLines: Array<{
  price: number;
  title: string;
  color: string;
  lineStyle: number;
}> = [];
const createdAutoscaleProviders: AutoscaleInfoProvider[] = [];

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
        addSeries: vi.fn((
          _seriesType: unknown,
          options?: { autoscaleInfoProvider?: AutoscaleInfoProvider },
        ) => {
          if (options?.autoscaleInfoProvider) {
            createdAutoscaleProviders.push(options.autoscaleInfoProvider);
          }
          return series;
        }),
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
import { createLevelAwareAutoscaleInfoProvider } from "@/lib/chart-autoscale";
import { AnalysisLevelsChart } from "../analysis-levels-chart";
import type { TradePlan } from "@workspace/api-client-react";

function renderChart(props: {
  tradePlan: TradePlan | null;
  instrument?: string;
  timeframe?: string;
}) {
  return render(
    <ThemeProvider>
      <AnalysisLevelsChart
        instrument={props.instrument ?? "EUR/USD"}
        timeframe={props.timeframe ?? "1h"}
        tradePlan={props.tradePlan}
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
  createdAutoscaleProviders.length = 0;
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

  it("ignores timeframe tokens in directional Buy and Sell entries", async () => {
    const plan: TradePlan = {
      preferredSide: "wait",
      buy: makeSide({
        entryZone: "di atas 4505 setelah breakout H1",
        stopLoss: "4480",
        takeProfit1: "4550",
        takeProfit2: "4600",
      }),
      sell: makeSide({
        entryZone: "di bawah 4410 setelah breakdown 1D",
        stopLoss: "4435",
        takeProfit1: "4370",
        takeProfit2: "4328",
      }),
    };

    renderChart({ tradePlan: plan, instrument: "XAU/USD", timeframe: "1D" });

    await waitFor(() =>
      expect(
        screen.getByTestId("analysis-levels-chart").getAttribute("data-state"),
      ).toBe("ready"),
    );
    await waitFor(() => expect(createdPriceLines).toHaveLength(8));

    expect(createdPriceLines.find((line) => line.title === "BUY Entry")?.price).toBe(4505);
    expect(createdPriceLines.find((line) => line.title === "SELL Entry")?.price).toBe(4410);
  });

  it.each([
    ["H1 suffix", "di atas 4505 setelah breakout H1"],
    ["1D suffix", "di atas 4505 setelah breakout 1D"],
    ["4H suffix", "di atas 4505 setelah breakout 4H"],
    ["15m suffix", "di atas 4505 setelah breakout 15m"],
    ["30m suffix", "di atas 4505 setelah breakout 30m"],
    ["H1 prefix", "H1 breakout di atas 4505"],
  ])("keeps 4505 for a %s entry", async (_label, entryZone) => {
    const plan: TradePlan = {
      preferredSide: "buy",
      buy: makeSide({ entryZone }),
      sell: makeSide({}),
    };

    renderChart({ tradePlan: plan, instrument: "XAU/USD", timeframe: "1D" });

    await waitFor(() =>
      expect(
        screen.getByTestId("analysis-levels-chart").getAttribute("data-state"),
      ).toBe("ready"),
    );
    await waitFor(() => expect(createdPriceLines).toHaveLength(4));

    expect(createdPriceLines.find((line) => line.title === "BUY Entry")?.price).toBe(4505);
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
});

describe("level-aware chart framing", () => {
  it("centers all recommendation levels with safe label margins", () => {
    const provider = createLevelAwareAutoscaleInfoProvider(
      [4445, 4421.5, 4400, 4380],
      4418.27,
    );
    const result = provider(() => ({
      priceRange: { minValue: 4500, maxValue: 4750 },
      margins: { above: 4, below: 6 },
    }));

    expect(result?.priceRange?.minValue).toBeLessThan(4380);
    expect(result?.priceRange?.maxValue).toBeGreaterThan(4445);
    expect(result?.priceRange?.minValue).toBeGreaterThan(4300);
    expect(result?.priceRange?.maxValue).toBeLessThan(4525);
    expect(result?.margins).toEqual({ above: 28, below: 28 });
  });

  it.each(["1m", "1h", "1D", "1W"])(
    "installs level-aware autoscaling on the %s chart",
    async (timeframe) => {
      const plan: TradePlan = {
        preferredSide: "sell",
        buy: makeSide({}),
        sell: makeSide({
          entryZone: "4421.50",
          stopLoss: "4445.00",
          takeProfit1: "4400.00",
          takeProfit2: "4380.00",
        }),
      };

      renderChart({ tradePlan: plan, instrument: "XAU/USD", timeframe });
      await waitFor(() =>
        expect(
          screen.getByTestId("analysis-levels-chart").getAttribute("data-state"),
        ).toBe("ready"),
      );

      const provider = createdAutoscaleProviders.at(-1);
      expect(provider).toBeTypeOf("function");
      const result = provider?.(() => ({
        priceRange: { minValue: 4550, maxValue: 4700 },
      }));
      expect(result?.priceRange?.minValue).toBeLessThan(4380);
      expect(result?.priceRange?.maxValue).toBeGreaterThan(4445);
    },
  );

  it("keeps very close levels visible by enforcing a minimum vertical span", () => {
    const provider = createLevelAwareAutoscaleInfoProvider(
      [1.085, 1.08501, 1.08502],
      1.085015,
    );
    const result = provider(() => ({
      priceRange: { minValue: 1.0849, maxValue: 1.0851 },
    }));

    const range = result?.priceRange;
    expect(range).not.toBeNull();
    expect((range?.maxValue ?? 0) - (range?.minValue ?? 0)).toBeGreaterThan(
      0.003,
    );
  });

  it("falls back to candle autoscaling when no numeric level is displayed", () => {
    const base = {
      priceRange: { minValue: 100, maxValue: 120 },
      margins: { above: 7, below: 9 },
    };
    const provider = createLevelAwareAutoscaleInfoProvider([], 110);

    expect(provider(() => base)).toBe(base);
  });

  it("ignores incomplete invalid level values without losing valid levels", () => {
    const provider = createLevelAwareAutoscaleInfoProvider(
      [4500, Number.NaN, Number.POSITIVE_INFINITY, -1],
      null,
    );
    const result = provider(() => ({
      priceRange: { minValue: 4000, maxValue: 5000 },
    }));

    expect(result?.priceRange?.minValue).toBeLessThan(4500);
    expect(result?.priceRange?.maxValue).toBeGreaterThan(4500);
  });
});
