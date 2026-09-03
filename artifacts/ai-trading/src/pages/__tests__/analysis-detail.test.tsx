// Component tests for `src/pages/analysis-detail.tsx`. The page
// mounts inside `<Layout>`, so the layout-bell poll and the SSE
// constructor are stubbed in `src/test/setup.ts`.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import AnalysisDetailPage from "../analysis-detail";
import {
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

const ANALYSIS_ID = 555;
const NOW = Date.now();

const TRADE_PLAN = {
  preferredSide: "buy",
  buy: {
    entryZone: "2,300.00–2,302.00",
    stopLoss: "2,290.00",
    takeProfit1: "2,315.00",
    takeProfit2: "2,325.00",
    riskRewardRatio: "1:1.5",
    rationale: "Bullish structure remains intact.",
  },
  sell: {
    entryZone: "2,300.00–2,302.00",
    stopLoss: "2,312.00",
    takeProfit1: "2,290.00",
    takeProfit2: "2,280.00",
    riskRewardRatio: "1:1.2",
    rationale: "Alternative bearish scenario.",
  },
};

const ANALYSIS_PAYLOAD = {
  id: ANALYSIS_ID,
  instrument: "XAU/USD",
  timeframe: "1h",
  mode: "beginner",
  marketCondition: "trending_up",
  riskLevel: "medium",
  tradingBias: "bullish",
  confidenceMin: 60,
  confidenceMax: 75,
  validUntil: new Date(NOW + 24 * 3_600_000).toISOString(),
  createdAt: new Date(NOW - 60_000).toISOString(),
  mainScenario: "Price likely continues higher into resistance.",
  alternativeScenario: "If we lose the swing low, scenario flips bearish.",
  failureConditions: "H1 close below 2300; ; rejection at 2360 with volume.",
  whyReason: "Trend structure aligned across H1 and H4.",
  techBuyCount: 12,
  techSellCount: 4,
  techNeutralCount: 6,
  feedback: null,
};

const STANDARD_RULES_PAYLOAD = {
  name: "TP Standard Trading Rules",
  version: "2026.02",
  effectiveDate: "2026-02-01",
  sourceDocument: "Test source",
  fixedRate: { usd: 1, idr: 10_000, label: "USD 1 = IDR 10.000" },
  account: {
    minimumDepositUsd: 500,
    minimumLot: 0.1,
    maximumLot: 0.9,
    maintenanceMarginPercent: 70,
    marginCallBelowPercent: 70,
    marginCallRestorePercent: 100,
    autoLiquidationAtOrBelowPercent: 30,
    equityReviewThresholdUsd: 2_500,
    equityReviewThresholdIdr: 25_000_000,
  },
  transactionFormula: "Test formula",
  instruments: [
    {
      code: "XUL10",
      product: "Gold (Loco London)",
      contractSize: 10,
      contractUnit: "troy ounce",
      tradingDays: "Monday–Friday",
      tradingHours: { summer: "06:00–03:30 WIB", winter: "06:00–04:30 WIB" },
      initialMarginUsdPerLot: 100,
      facilityFeeUsdPerLotPerSide: 1.5,
      vatPercent: 11,
      rolloverUsdPerLotPerNight: 0.5,
      priceSource: "Telequote",
      priceGuidance: "Last Trade",
      minimumSpread: "USD 0.40 / troy ounce / side",
      maximumSpread: "USD 1.00 / troy ounce / side",
      hecticSpread: "Based on market conditions",
      minimumPriceMovement: "USD 0.01 / troy ounce",
      limitStopRange: "USD 6–USD 20",
      deliveryBy: "Cash settlement",
    },
    {
      code: "HKK50_BBJ",
      product: "Hang Seng Index",
      contractSize: 5,
      contractUnit: "USD/point",
      tradingDays: "Monday–Friday",
      tradingHours: { summer: "08:15–11:00, 12:00–15:30, 16:00–02:00 WIB", winter: "08:15–11:00, 12:00–15:30, 16:00–02:00 WIB" },
      initialMarginUsdPerLot: 100,
      facilityFeeUsdPerLotPerSide: null,
      vatPercent: 11,
      rolloverUsdPerLotPerNight: 0.3,
      priceSource: "Telequote",
      priceGuidance: "Last Trade",
      minimumSpread: "5 points / side",
      maximumSpread: "25 points / side",
      hecticSpread: "Based on market conditions",
      minimumPriceMovement: "1 point",
      limitStopRange: "20–500 points",
      deliveryBy: "Cash settlement",
    },
  ],
  disclaimer: { id: "Test disclaimer", en: "Test disclaimer" },
  relationshipDisclosure: { id: "Test disclosure", en: "Test disclosure" },
};

function standardRulesHandler(status = 200): FetchHandler {
  return (url, init) => {
    if ((init?.method ?? "GET").toUpperCase() !== "GET") return null;
    if (url.includes("/api/trading-rules/standard")) {
      return jsonResponse(
        status >= 400 ? { error: "Rules temporarily unavailable" } : STANDARD_RULES_PAYLOAD,
        status,
      );
    }
    if (url.includes("/api/historical/candles") && url.includes("purpose=adaptive-layering")) {
      return jsonResponse({
        candles: [
          { date: "2026-08-29T01:00:00.000Z", open: 2304, high: 2305, low: 2300, close: 2302 },
          { date: "2026-08-29T02:00:00.000Z", open: 2302, high: 2304, low: 2298, close: 2300 },
          { date: "2026-08-29T03:00:00.000Z", open: 2300, high: 2302, low: 2295, close: 2297 },
          { date: "2026-08-29T04:00:00.000Z", open: 2297, high: 2301, low: 2297, close: 2300 },
          { date: "2026-08-29T05:00:00.000Z", open: 2300, high: 2307, low: 2299, close: 2305 },
          { date: "2026-08-29T06:00:00.000Z", open: 2305, high: 2309, low: 2301, close: 2303 },
          { date: "2026-08-29T07:00:00.000Z", open: 2303, high: 2306, low: 2299, close: 2301 },
        ],
      });
    }
    return null;
  };
}

function getAnalysisHandler(opts: {
  status?: number;
  body?: unknown;
}): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "GET") return null;
    // Match the exact `/api/analyses/<id>` URL, not the sibling list /
    // summary / quota routes that share the prefix.
    if (!new RegExp(`/api/analyses/${ANALYSIS_ID}(?:\\?|$)`).test(url)) {
      return null;
    }
    const status = opts.status ?? 200;
    if (status >= 400) {
      return jsonResponse(opts.body ?? { error: "not found" }, status);
    }
    return jsonResponse(opts.body ?? ANALYSIS_PAYLOAD);
  };
}

function feedbackHandler(): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "POST") return null;
    if (!new RegExp(`/api/analyses/${ANALYSIS_ID}/feedback$`).test(url)) {
      return null;
    }
    return jsonResponse({
      id: 1,
      analysisId: ANALYSIS_ID,
      feedbackType: "useful",
      outcome: null,
      note: null,
      createdAt: new Date(NOW).toISOString(),
    });
  };
}

function createAnalysisHandler(
  respond: (
    body: Record<string, unknown>,
  ) => Response | Promise<Response>,
): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "POST" || !/\/api\/analyses(?:\?|$)/.test(url)) {
      return null;
    }
    const body =
      typeof init?.body === "string"
        ? JSON.parse(init.body) as Record<string, unknown>
        : {};
    return respond(body);
  };
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", `/analyses/${ANALYSIS_ID}`);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AnalysisDetailPage: happy-path render", () => {
  it("renders the instrument header, bias label, confidence range and risk level from the payload", async () => {
    installFetchMock([getAnalysisHandler({}), feedbackHandler()]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const instrument = await screen.findByTestId("text-instrument");
    expect(instrument.textContent).toBe(ANALYSIS_PAYLOAD.instrument);

    // Bias label resolves from the bullish key — the actual rendered
    // string depends on locale, so just assert the element exists and
    // is non-empty.
    const bias = screen.getByTestId("text-bias-label");
    expect(bias.textContent?.trim().length ?? 0).toBeGreaterThan(0);

    // Confidence range shows both the min and the max with a dash.
    const confidence = screen.getByTestId("text-confidence");
    expect(confidence.textContent).toMatch(/60/);
    expect(confidence.textContent).toMatch(/75/);

    // Risk level renders the medium label.
    const risk = screen.getByTestId("text-risk-level");
    expect(risk.textContent?.trim().length ?? 0).toBeGreaterThan(0);

    // Feedback CTAs render — the user can pick useful / not-useful.
    expect(screen.getByTestId("button-feedback-useful")).toBeInTheDocument();
    expect(screen.getByTestId("button-feedback-not-useful")).toBeInTheDocument();
  });

  it("uses progressive disclosure for scenarios, pro factors, and execution insight", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          mode: "pro",
          baseCase: "The primary bullish path remains valid above support.",
          bearishScenario: "A break below support would shift the path bearish.",
          keyDriversTechnical: "Momentum and trend structure currently support the bullish case.",
          keyDriversFundamental: "Upcoming macro releases may increase volatility.",
          marketContext: "Price remains inside the broader weekly range.",
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // The Scenarios card itself is a collapsed section now — open it first.
    fireEvent.click(await screen.findByTestId("scenarios-trigger"));

    expect(await screen.findByTestId("scenario-a-disclosure-content")).toHaveTextContent(
      /primary bullish path/i,
    );
    expect(screen.getByTestId("scenario-b-disclosure-content")).not.toBeVisible();
    expect(screen.getByTestId("scenario-c-disclosure-content")).not.toBeVisible();

    fireEvent.click(screen.getByTestId("scenario-b-disclosure-trigger"));
    expect(screen.getByTestId("scenario-a-disclosure-content")).not.toBeVisible();
    expect(screen.getByTestId("scenario-b-disclosure-content")).toHaveTextContent(
      /shift the path bearish/i,
    );
    expect(screen.getByTestId("scenario-b-disclosure-content")).toBeVisible();

    // "Why this analysis" is likewise a collapsed section — open it first.
    fireEvent.click(screen.getByTestId("pro-details-trigger"));

    expect(screen.getByTestId("pro-factor-technical-content")).not.toBeVisible();
    expect(screen.getByTestId("pro-factor-fundamental-content")).not.toBeVisible();
    fireEvent.click(screen.getByTestId("pro-factor-technical-trigger"));
    expect(screen.getByTestId("pro-factor-technical-content")).toHaveTextContent(
      /momentum and trend structure/i,
    );
    fireEvent.click(screen.getByTestId("pro-factor-fundamental-trigger"));
    expect(screen.getByTestId("pro-factor-technical-content")).not.toBeVisible();
    expect(screen.getByTestId("pro-factor-fundamental-content")).toHaveTextContent(
      /macro releases/i,
    );
    expect(screen.getByTestId("pro-factor-fundamental-content")).toBeVisible();

    expect(screen.queryByTestId("execution-insight-content")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("execution-insight-trigger"));
    expect(screen.getByTestId("execution-insight-content")).toBeVisible();
  });

  it("turns legacy 1m wait-plan n/a values into actionable observation guidance", async () => {
    const waitPlan = {
      preferredSide: "wait",
      buy: {
        entryZone: "tunggu pullback terkonfirmasi",
        stopLoss: "n/a",
        takeProfit1: "n/a",
        takeProfit2: "n/a",
        riskRewardRatio: "n/a",
        rationale: "Timeframe sangat cepat, noise tinggi.",
      },
      sell: {
        entryZone: "tunggu rejection terkonfirmasi",
        stopLoss: "n/a",
        takeProfit1: "n/a",
        takeProfit2: "n/a",
        riskRewardRatio: "n/a",
        rationale: "Timeframe sangat cepat, noise tinggi.",
      },
    };
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          timeframe: "1m",
          tradingBias: "neutral",
          riskLevel: "high",
          confidenceMin: 25,
          confidenceMax: 40,
          tradePlan: waitPlan,
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    expect(await screen.findByTestId("fast-plan-wait-guidance")).toHaveTextContent(
      /No entry yet/i,
    );
    expect(screen.getByTestId("trade-plan-buy-sl")).toHaveTextContent(
      /confirmation swing/i,
    );
    expect(screen.getByTestId("trade-plan-sell-rr")).toHaveTextContent(
      /after entry and stop form/i,
    );
    expect(screen.getByTestId("card-trade-plan")).not.toHaveTextContent(/\bn\/a\b/i);
  });
});

describe("AnalysisDetailPage: situation-aware position recommendation", () => {
  it("defaults to Mini, supports all account tiers, and keeps separate Buy and Sell ladders", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const margin = await screen.findByTestId("input-adaptive-available-margin");
    const maximumLoss = screen.getByTestId("input-adaptive-maximum-loss");
    const methodDetails = screen.getByTestId("adaptive-plan-method") as HTMLDetailsElement;
    expect(methodDetails.open).toBe(false);
    expect(screen.getByTestId("adaptive-analysis-basis")).toHaveTextContent(/saved analysis shown above/i);
    expect(screen.getByTestId("adaptive-analysis-basis")).toHaveTextContent(/Current chart.*separate layer candidates/i);
    expect(await screen.findByTestId("adaptive-account-rule")).toHaveTextContent(/Mini: a minimum 0.1 lot requires \$100 margin/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Maximum 0.9 lot applies to each position/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/limited to canonical XAU\/USD analyses/i);
    const tradePlanCard = screen.getByTestId("card-trade-plan");
    expect(tradePlanCard).toBeInTheDocument();
    expect(screen.queryByTestId("card-trade-setup-summary")).not.toBeInTheDocument();
    const chartCard = screen.getByTestId("card-analysis-chart");
    expect(chartCard.parentElement).toContainElement(tradePlanCard);
    expect(chartCard.parentElement?.lastElementChild).toBe(tradePlanCard);
    expect(tradePlanCard).toHaveTextContent(/Entry/i);
    expect(tradePlanCard).toHaveTextContent(/Stop Loss/i);
    expect(tradePlanCard).toHaveTextContent(/Take Profit 2/i);
    expect(screen.getByTestId("button-copy-levels-buy")).toBeInTheDocument();
    expect(screen.getByTestId("button-copy-levels-sell")).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-daytrade-only")).toHaveTextContent(/Day trade only/i);
    expect(screen.getByTestId("button-adaptive-account-mini")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("button-adaptive-account-micro")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("button-adaptive-account-regular")).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByTestId("button-adaptive-preference-safe")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-adaptive-risk-style-conservative")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("button-adaptive-risk-style-balanced")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("button-adaptive-risk-style-aggressive")).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByTestId("input-adaptive-existing-exposure")).not.toBeInTheDocument();
    expect(screen.queryByText(/existing AI analysis provides the direction/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-adaptive-account-micro"));
    expect(screen.getByTestId("button-adaptive-account-mini")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("button-adaptive-account-micro")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Micro: a minimum 0.01 lot requires \$10 margin/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Maximum 0.09 lot applies to each position/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Contract size is 1 troy ounce/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/minimum to open a Micro account is \$50/i);
    fireEvent.click(screen.getByTestId("button-adaptive-account-regular"));
    expect(screen.getByTestId("button-adaptive-account-regular")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Regular: a minimum 1 lot requires \$1,000 margin/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Maximum 50 lot applies to each position/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Contract size is 100 troy ounce/i);
    fireEvent.click(screen.getByTestId("button-adaptive-account-micro"));
    fireEvent.change(margin, { target: { value: "100000" } });
    fireEvent.change(maximumLoss, { target: { value: "500" } });
    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/Current chart candidates found/i));
    expect(screen.queryByTestId("adaptive-plan-comparison")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    const snapshot = await screen.findByTestId("adaptive-plan-snapshot");
    const reasoning = await screen.findByTestId("adaptive-plan-reasoning") as HTMLDetailsElement;
    expect(reasoning.open).toBe(false);
    fireEvent.click(reasoning.querySelector("summary")!);
    expect(reasoning.open).toBe(true);
    const buyPlan = screen.getByTestId("adaptive-plan-buy");
    expect(reasoning.textContent).toMatch(/Why this plan was chosen/i);
    expect(reasoning.textContent).toMatch(/favor the rise scenario/i);
    expect(reasoning.textContent).toMatch(/Technical snapshot: 12 support up, 4 support down/i);
    expect(snapshot).toHaveTextContent(/Answer at a glance/i);
    expect(snapshot).toHaveTextContent(/Entry point/i);
    expect(snapshot).toHaveTextContent(/Total planned positions/i);
    expect(snapshot).toHaveTextContent(/3 positions/i);
    expect(snapshot).toHaveTextContent(/Total planned lots/i);
    expect(snapshot).toHaveTextContent(/0.19 lot/i);
    expect(screen.getByTestId("adaptive-tp-profit-buy-1")).toHaveTextContent(/Estimated profit.*\+\$/i);
    expect(screen.getByTestId("adaptive-tp-profit-buy-2")).toHaveTextContent(/Estimated profit.*\+\$/i);
    expect(buyPlan).toHaveTextContent(/Cumulative profit to TP1/i);
    expect(buyPlan).toHaveTextContent(/Cumulative profit to TP2/i);
    expect(buyPlan.textContent).toMatch(/manual checkpoints/i);
    expect(buyPlan.textContent).toMatch(/One final Stop Loss/i);
    expect(screen.getByTestId("adaptive-ladder-buy")).toHaveTextContent(/Position 1 · Initial entry/i);
    expect(screen.getByTestId("adaptive-ladder-buy")).toHaveTextContent(/Position 2/i);
    expect(screen.getByTestId("adaptive-ladder-buy")).toHaveTextContent(/Position 3/i);
    expect(screen.getByTestId("adaptive-ladder-buy")).toHaveTextContent(/2,301/);
    expect(screen.getByTestId("adaptive-ladder-buy")).toHaveTextContent(/2,300/);
    expect(buyPlan.textContent).toMatch(/\$/);
    expect(screen.getByTestId("adaptive-direction-buy")).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByTestId("adaptive-plan-sell")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("adaptive-direction-sell"));
    const sellPlan = screen.getByTestId("adaptive-plan-sell");
    expect(screen.getByTestId("adaptive-direction-sell")).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByTestId("adaptive-plan-buy")).not.toBeInTheDocument();
    expect(sellPlan.textContent).toMatch(/initial entry only/i);
    expect(sellPlan.textContent).toMatch(/One final Stop Loss/i);
    expect(sellPlan.textContent).toMatch(/\$/);
    expect(screen.getByTestId("adaptive-tp-profit-sell-1")).toHaveTextContent(/Estimated profit.*\+\$/i);
    expect(screen.getByTestId("adaptive-tp-profit-sell-2")).toHaveTextContent(/Estimated profit.*\+\$/i);
    expect((screen.getByTestId("adaptive-risk-details") as HTMLDetailsElement).open).toBe(false);

    const storedKey = `trade-pilot:adaptive-plan:v16:${ANALYSIS_ID}`;
    await waitFor(() => expect(localStorage.getItem(storedKey)).not.toBeNull());
    expect(JSON.parse(localStorage.getItem(storedKey)!).form.accountTier).toBe("micro");

    fireEvent.click(screen.getByTestId("button-adaptive-account-mini"));
    expect(screen.queryByTestId("adaptive-plan-valid")).not.toBeInTheDocument();
    expect(localStorage.getItem(storedKey)).toBeNull();
  });

  it("keeps visible account inputs when chart candidates finish loading", async () => {
    const candleResolvers: Array<(response: Response) => void> = [];
    const delayedCandles: FetchHandler = (url, init) => {
      if ((init?.method ?? "GET").toUpperCase() !== "GET") return null;
      if (!url.includes("/api/historical/candles") || !url.includes("purpose=adaptive-layering")) return null;
      return new Promise<Response>((resolve) => candleResolvers.push(resolve));
    };
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      delayedCandles,
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const margin = await screen.findByTestId("input-adaptive-available-margin");
    const maximumLoss = screen.getByTestId("input-adaptive-maximum-loss");
    await screen.findByTestId("adaptive-account-rule", {}, { timeout: 5_000 });
    fireEvent.change(margin, { target: { value: "5000" } });
    fireEvent.change(maximumLoss, { target: { value: "250" } });
    expect(screen.queryByTestId("input-adaptive-existing-exposure")).not.toBeInTheDocument();
    await waitFor(() => expect(candleResolvers.length).toBeGreaterThan(0));

    await act(async () => {
      candleResolvers.forEach((resolve) => resolve(jsonResponse({ candles: [] })));
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/Current chart candidates found/i));
    expect(margin).toHaveValue(5000);
    expect(maximumLoss).toHaveValue(250);
  });

  it("renders a valid fixed-Mini recommendation from explicit limits", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const margin = await screen.findByTestId("input-adaptive-available-margin");
    const maximumLoss = screen.getByTestId("input-adaptive-maximum-loss");
    await screen.findByTestId("adaptive-account-rule");
    fireEvent.change(margin, { target: { value: "20000" } });
    fireEvent.change(maximumLoss, { target: { value: "2000" } });
    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/Current chart candidates found/i));

    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Mini: a minimum 0.1 lot requires \$100 margin/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/contract size is 10 troy ounce/i);

    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    expect(await screen.findByTestId("adaptive-plan-valid")).toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-plan-invalid")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-plan-buy")).toHaveTextContent(/0\.[1-9] lot/i);
    expect(screen.getByTestId("adaptive-plan-buy")).toHaveTextContent(/Weighted average entry/i);
    expect(screen.getByTestId("adaptive-layer-financial-buy-0")).toHaveTextContent(/Margin this position/i);
    expect(screen.getByTestId("adaptive-layer-financial-buy-0")).toHaveTextContent(/Risk this position at final SL/i);
    expect(screen.getByTestId("adaptive-layer-financial-buy-0")).toHaveTextContent(/Funds remaining/i);

    fireEvent.change(maximumLoss, { target: { value: "15" } });
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(await screen.findByTestId("adaptive-rejected-buy")).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-rejected-layer-financial-buy-1")).toHaveTextContent(/Margin this position/i);
    expect(screen.getByTestId("adaptive-rejected-layer-financial-buy-1")).toHaveTextContent(/Funds remaining/i);
    expect(screen.getByTestId("adaptive-conditional-buy-1")).toHaveTextContent(/Conditional financial plan/i);
    expect(screen.getByTestId("adaptive-conditional-buy-1")).toHaveTextContent(/Additional loss budget needed/i);
  });

  it("ignores malformed saved adaptive-plan data instead of crashing the analysis page", async () => {
    localStorage.setItem(
      `trade-pilot:adaptive-plan:v16:${ANALYSIS_ID}`,
      JSON.stringify({ form: { availableMargin: "100000" }, recommendation: {} }),
    );
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("adaptive-account-rule");
    expect(screen.getByTestId("input-adaptive-available-margin")).toHaveValue(null);
    expect(screen.queryByTestId("adaptive-plan-reasoning")).not.toBeInTheDocument();
    expect(localStorage.getItem(`trade-pilot:adaptive-plan:v16:${ANALYSIS_ID}`)).toBeNull();
  });

  it("does not restore an adaptive plan saved under the cumulative-cap v12 namespace", async () => {
    localStorage.setItem(
      `trade-pilot:adaptive-plan:v12:${ANALYSIS_ID}`,
      JSON.stringify({ form: { availableMargin: "100000", maximumLoss: "500", riskStyle: "aggressive" } }),
    );
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("adaptive-account-rule");
    expect(screen.getByTestId("input-adaptive-available-margin")).toHaveValue(null);
    expect(screen.getByTestId("button-adaptive-risk-style-conservative")).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByTestId("adaptive-plan-reasoning")).not.toBeInTheDocument();
  });

  it("restores the preferred Sell direction from a saved recommendation", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ], { strict: false });
    const first = makeWrapper();
    const firstView = render(
      <first.Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </first.Wrapper>,
    );

    const margin = await screen.findByTestId("input-adaptive-available-margin");
    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/Current chart candidates found/i));
    fireEvent.change(margin, { target: { value: "100000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "500" } });
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    await waitFor(() => expect(screen.getByTestId("button-adaptive-risk-style-balanced")).toHaveAttribute("aria-pressed", "true"));
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    expect(await screen.findByTestId("adaptive-plan-valid")).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-risk-style-active")).toHaveTextContent(/Balanced style/i);
    expect(screen.getByTestId("adaptive-lot-profile-active")).toHaveTextContent(/Lot profile: decreasing/i);
    const key = `trade-pilot:adaptive-plan:v16:${ANALYSIS_ID}`;
    await waitFor(() => expect(localStorage.getItem(key)).not.toBeNull());
    const stored = JSON.parse(localStorage.getItem(key)!) as {
      recommendation: {
        decision: { preferredSide: string };
        result: {
          buy: ({ side: string } & Record<string, unknown>) | null;
          sell: ({ side: string } & Record<string, unknown>) | null;
        };
      };
    };
    const storedPlan = (side: "buy" | "sell") => ({
      side,
      entry: 2301,
      stopLoss: side === "buy" ? 2290 : 2312,
      takeProfit1: side === "buy" ? 2315 : 2290,
      takeProfit2: side === "buy" ? 2325 : 2280,
      totalLots: 0.1,
      marginRequired: 100,
      estimatedCycleLoss: 11,
      weightedAverageEntry: 2301,
      totalFundsAtStop: 111,
       remainingFundsAtStop: 99889,
      profitToTakeProfit1: 14,
      profitToTakeProfit2: 24,
      riskRewardToTakeProfit1: 1.2,
      riskRewardToTakeProfit2: 2.1,
      ladder: [{
        level: 0,
        price: 2301,
        lot: 0.1,
        cumulativeLots: 0.1,
        estimatedRiskToStop: 11,
        distanceFromEntry: 0,
        riskToStopForLot: 11,
        dayMarginForLot: 100,
        cumulativeDayMargin: 100,
         cumulativeFundsAtStop: 111,
         remainingFundsAtStop: 99889,
        profitToTakeProfit1: 14,
        profitToTakeProfit2: 24,
        cumulativeProfitToTakeProfit1: 14,
        cumulativeProfitToTakeProfit2: 24,
        basis: "initial",
        invalidationProgress: 0,
        reason: "Initial entry",
      }],
      rejectedLadder: [],
    });
    stored.recommendation.result.buy = storedPlan("buy");
    stored.recommendation.result.sell = storedPlan("sell");
    stored.recommendation.decision.preferredSide = "sell";
    localStorage.setItem(key, JSON.stringify(stored));
    firstView.unmount();
    const second = makeWrapper();

    render(
      <second.Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </second.Wrapper>,
    );

    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/Current chart candidates found/i));
    await waitFor(() => expect(screen.getByTestId("adaptive-direction-sell")).toHaveAttribute("aria-pressed", "true"));
    expect(screen.getByTestId("button-adaptive-risk-style-balanced")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("adaptive-risk-style-active")).toHaveTextContent(/Balanced style/i);
    expect(screen.getByTestId("adaptive-lot-profile-active")).toHaveTextContent(/Lot profile: decreasing/i);
    expect(screen.getByTestId("adaptive-plan-sell")).toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-plan-buy")).not.toBeInTheDocument();
  });

  it("fails closed when TP Standard Trading Rules cannot be loaded", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(503),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("adaptive-plan-rules-unavailable", {}, { timeout: 5_000 });
    expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeDisabled();
    expect(screen.queryByTestId("adaptive-plan-reasoning")).not.toBeInTheDocument();
  });

  it("keeps the full analysis available while hiding position calculations for other products", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          instrument: "EUR/USD",
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    expect(await screen.findByTestId("text-instrument")).toHaveTextContent("EUR/USD");
    expect(screen.getByTestId("text-instrument")).toHaveTextContent("EUR/USD");
    expect(screen.getByTestId("card-trade-plan")).toBeInTheDocument();
    expect(screen.queryByTestId("input-adaptive-available-margin")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-calculate-adaptive-plan")).not.toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-plan-valid")).not.toBeInTheDocument();
  });

  it("keeps Hang Seng on Standard TP/SL without mounting Adaptive", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          instrument: "HSI",
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    expect(await screen.findByTestId("card-trade-plan")).toBeInTheDocument();
    expect(screen.getByTestId("card-trade-plan")).toHaveTextContent(/Stop Loss/i);
    expect(screen.getByTestId("card-trade-plan")).toHaveTextContent(/Take Profit 1/i);
    expect(screen.getByTestId("card-trade-plan")).toHaveTextContent(/Take Profit 2/i);
    expect(screen.queryByTestId("input-adaptive-available-margin")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-calculate-adaptive-plan")).not.toBeInTheDocument();
  });
});

describe("AnalysisDetailPage: not-found branch", () => {
  it("renders the localized not-found copy and the 'back to history' CTA when the API responds with a 404", async () => {
    installFetchMock([getAnalysisHandler({ status: 404 }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // Positive assertions: the not-found view should render BOTH the
    // localized copy and the outline-variant CTA back to /history.
    // (English is the default language in the test wrapper.)
    expect(
      await screen.findByText(/Analysis not found/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Back to History/i }),
    ).toBeInTheDocument();

    // And the happy-path widgets should NOT render in this branch.
    expect(screen.queryByTestId("text-instrument")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("button-feedback-useful"),
    ).not.toBeInTheDocument();
  });
});

describe("AnalysisDetailPage: fundamental context card", () => {
  it("renders the fundamental card with the headline + calendar event when fundamentalContext has items", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "newsmaker-1",
                title: "Gold rallies as Fed signals pause",
                summary: "Statement softer than expected.",
                source: "Newsmaker.id",
                url: "https://newsmaker.id/article-1",
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [
              {
                date: "2026-04-30",
                time: "12:00",
                currency: "USD",
                event: "FOMC rate decision",
                impact: "★★★",
                actual: "no change",
                forecast: "no change",
                previous: "no change",
              },
            ],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const card = await screen.findByTestId("card-fundamental-context");
    expect(card).toBeInTheDocument();
    expect(card.textContent).toMatch(/Gold rallies as Fed signals pause/);
    expect(card.textContent).toMatch(/FOMC rate decision/);
  });

  it("caps news at 3 items and calendar at 5 items, and opens news links in a new tab with safe rel attrs", async () => {
    // 5 news items + 7 calendar events — only 3 + 5 should render.
    const newsItems = Array.from({ length: 5 }).map((_, i) => ({
      id: `news-${i}`,
      title: `Headline number ${i}`,
      summary: `Summary ${i}`,
      source: "Newsmaker.id",
      url: `https://newsmaker.id/article-${i}`,
      publishedAt: new Date(NOW - (i + 1) * 60_000).toISOString(),
    }));
    const events = Array.from({ length: 7 }).map((_, i) => ({
      date: "2026-04-30",
      time: `0${i}:00`,
      currency: "USD",
      event: `Event number ${i}`,
      impact: "★★",
      actual: null,
      forecast: null,
      previous: null,
    }));
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: { newsItems, calendarEvents: events },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const card = await screen.findByTestId("card-fundamental-context");
    expect(screen.getByTestId("fundamental-news-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByTestId("fundamental-calendar-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    fireEvent.click(screen.getByTestId("fundamental-news-toggle"));
    await waitFor(() =>
      expect(screen.getByTestId("fundamental-news-toggle")).toHaveAttribute(
        "aria-expanded",
        "true",
      ),
    );

    // News link rows are tagged `fundamental-news-link` (the anchor).
    const links = card.querySelectorAll("[data-testid='fundamental-news-link']");
    expect(links.length).toBe(3);
    // Each link must open in a new tab with the noopener noreferrer
    // protection — outbound feed links are upstream-controlled and we
    // never want them tab-napping the user.
    links.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel") ?? "").toMatch(/noopener/);
      expect(a.getAttribute("rel") ?? "").toMatch(/noreferrer/);
    });

    // Calendar list under the card should render exactly 5 of the 7
    // events (top-N cap) — count the impact badges as a stand-in for
    // a row marker that's stable across locales.
    const calendarList = card.querySelector(
      "[data-testid='fundamental-calendar-list']",
    );
    expect(calendarList).not.toBeNull();
    const eventRows = calendarList?.querySelectorAll("li") ?? [];
    expect(eventRows.length).toBe(5);
  });

  it("prioritizes Newsmaker and keeps only one Yahoo headline in the visible fundamental list", async () => {
    const newsItems = [
      "Yahoo Finance",
      "Newsmaker.id",
      "Yahoo Finance",
      "Newsmaker.id",
      "Newsmaker.id",
    ].map((source, i) => ({
      id: `mixed-news-${i}`,
      title: `${source} headline ${i}`,
      summary: `Summary ${i}`,
      source,
      url: `https://example.com/article-${i}`,
      publishedAt: new Date(NOW - (i + 1) * 60_000).toISOString(),
    }));
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: { newsItems, calendarEvents: [] },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const card = await screen.findByTestId("card-fundamental-context");
    fireEvent.click(screen.getByTestId("fundamental-news-toggle"));

    expect(card).toHaveTextContent("Yahoo Finance headline 0");
    expect(card).toHaveTextContent("Newsmaker.id headline 1");
    expect(card).toHaveTextContent("Newsmaker.id headline 3");
    expect(card).not.toHaveTextContent("Yahoo Finance headline 2");
    expect(card).not.toHaveTextContent("Newsmaker.id headline 4");
    expect(screen.getAllByTestId("fundamental-news-link")).toHaveLength(3);
  });

  it("renders the empty-state message when fundamentalContext is present with empty arrays", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // The card itself must render so the user knows fundamentals were
    // checked but nothing surfaced — this is the explicit honesty the
    // task requires (no silent omission of the section).
    const card = await screen.findByTestId("card-fundamental-context");
    expect(card).toBeInTheDocument();
    // News + calendar list wrappers should NOT render in the empty state.
    expect(
      screen.queryByTestId("fundamental-news-list"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("fundamental-calendar-list"),
    ).not.toBeInTheDocument();
  });
});

describe("AnalysisDetailPage: refresh fundamentals", () => {
  it("POSTs to /refresh-fundamentals and renders the drift banner with the missing citation when the server reports drift", async () => {
    const refreshedAt = new Date(NOW - 60_000).toISOString();
    let refreshCalls = 0;
    const refreshHandler: FetchHandler = (url, init) => {
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "POST") return null;
      if (
        !new RegExp(
          `/api/analyses/${ANALYSIS_ID}/refresh-fundamentals$`,
        ).test(url)
      ) {
        return null;
      }
      refreshCalls += 1;
      return jsonResponse({
        fundamentalContext: {
          newsItems: [
            {
              id: "newsmaker-fresh",
              title: "Brand new headline",
              summary: "Just hit the wire.",
              source: "Newsmaker.id",
              url: "https://newsmaker.id/fresh",
              publishedAt: refreshedAt,
            },
          ],
          calendarEvents: [],
        },
        refreshedAt,
        drift: {
          totalCitations: 2,
          missingCitations: [
            { kind: "news", label: "Old headline the AI cited" },
          ],
        },
      });
    };

    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "newsmaker-old",
                title: "Old headline the AI cited",
                summary: "Stale.",
                source: "Newsmaker.id",
                url: "https://newsmaker.id/old",
                publishedAt: new Date(NOW - 6 * 3_600_000).toISOString(),
              },
            ],
            calendarEvents: [],
          },
        },
      }),
      feedbackHandler(),
      refreshHandler,
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // Find and click the refresh button on the fundamental card.
    const refreshBtn = await screen.findByTestId("button-refresh-fundamentals");
    await act(async () => {
      fireEvent.click(refreshBtn);
    });

    // The mutation should fire exactly once and the drift banner should
    // surface the server-returned drift label so the user can see which
    // cited item is no longer in the window.
    await waitFor(() => {
      expect(refreshCalls).toBe(1);
    });
    const banner = await screen.findByTestId("fundamental-refresh-banner");
    expect(banner).toBeInTheDocument();
    const driftText = banner.querySelector(
      "[data-testid='fundamental-refresh-drift-text']",
    );
    expect(driftText?.textContent).toMatch(/1.*2/);
    const items = banner.querySelectorAll(
      "[data-testid='fundamental-refresh-drift-item']",
    );
    expect(items.length).toBe(1);
    expect(items[0].textContent).toMatch(/Old headline the AI cited/);
  });
});

describe("AnalysisDetailPage: inline citation chips", () => {
  it("renders an inline news chip + an inline calendar chip below the AI's whyReason for beginner mode, matched against fundamentalContext", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          whyReason:
            "Trend bullish + Fed dovish memperkuat tesis cenderung naik.",
          fundamentalContext: {
            newsItems: [
              {
                id: "n-1",
                title: "Gold rallies as Fed signals pause",
                summary: "Statement softer than expected.",
                source: "Newsmaker.id",
                url: "https://newsmaker.id/article-1",
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [
              {
                date: "2026-04-30",
                time: "12:00",
                currency: "USD",
                event: "FOMC rate decision",
                impact: "★★★",
                actual: "no change",
                forecast: "no change",
                previous: "no change",
              },
            ],
          },
          fundamentalCitations: {
            newsTitles: ["Gold rallies as Fed signals pause"],
            // Mimic the AI emitting a star-prefixed event name — the chip
            // matcher must normalize past the "★★★ USD —" decoration.
            calendarEvents: ["★★★ USD — FOMC rate decision"],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // The chips should land inside the confidence-reason block (which
    // for beginner mode renders the whyReason text).
    const reasonCard = await screen.findByTestId("card-confidence-reason");
    const chipBlock = reasonCard.querySelector(
      "[data-testid='citation-chips']",
    );
    expect(chipBlock).not.toBeNull();

    const newsChip = chipBlock?.querySelector(
      "[data-testid='citation-chip-news']",
    );
    expect(newsChip).not.toBeNull();
    // News with a safe http(s) URL renders as an anchor that opens in
    // a new tab — same safe-rel guarantees as the FundamentalContextCard.
    expect(newsChip?.getAttribute("href")).toBe(
      "https://newsmaker.id/article-1",
    );
    expect(newsChip?.getAttribute("target")).toBe("_blank");
    expect(newsChip?.getAttribute("rel") ?? "").toMatch(/noopener/);

    const eventChip = chipBlock?.querySelector(
      "[data-testid='citation-chip-event']",
    );
    expect(eventChip).not.toBeNull();
    expect(eventChip?.textContent).toMatch(/FOMC rate decision/);
  });

  it("opens the closed news panel and highlights a cited news row when the news chip has no URL", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "n-no-url",
                title: "Gold rallies as Fed signals pause",
                summary: "Statement softer than expected.",
                source: "Newsmaker.id",
                url: null,
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [],
          },
          fundamentalCitations: {
            newsTitles: ["Gold rallies as Fed signals pause"],
            calendarEvents: [],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const chips = await screen.findByTestId("citation-chips");
    const newsChip = chips.querySelector(
      "[data-testid='citation-chip-news']",
    ) as HTMLButtonElement | null;
    expect(newsChip).not.toBeNull();
    expect(newsChip).not.toHaveAttribute("href");

    const newsToggle = screen.getByTestId("fundamental-news-toggle");
    const newsList = screen.getByTestId("fundamental-news-list");
    expect(newsToggle).toHaveAttribute("aria-expanded", "false");
    expect(newsList).toHaveAttribute("data-state", "closed");

    const newsRow = document.getElementById(
      "cite-news-gold-rallies-as-fed-signals-pause",
    );
    expect(newsRow).not.toBeNull();

    fireEvent.click(newsChip as HTMLButtonElement);

    await waitFor(() => {
      expect(newsToggle).toHaveAttribute("aria-expanded", "true");
      expect(newsList).toHaveAttribute("data-state", "open");
      expect(newsRow).toHaveClass("ring-2", "ring-primary/60", "rounded-md");
    });
  });

  it("uses the ORIGINAL calendar index (not the matched-list index) for the chip slug, so click-to-scroll lines up when only a subset is cited", async () => {
    // Three events in the snapshot, AI cites only the THIRD one.
    // The chip slug must end with `-2` (index in full list), not `-0`
    // (index in matched list), or scrollToCitation finds nothing.
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [],
            calendarEvents: [
              {
                date: "2026-04-30",
                time: "08:00",
                currency: "EUR",
                event: "ECB press conference",
                impact: "★★",
                actual: null,
                forecast: null,
                previous: null,
              },
              {
                date: "2026-04-30",
                time: "10:00",
                currency: "GBP",
                event: "BoE bank rate",
                impact: "★★",
                actual: null,
                forecast: null,
                previous: null,
              },
              {
                date: "2026-04-30",
                time: "12:00",
                currency: "USD",
                event: "FOMC rate decision",
                impact: "★★★",
                actual: null,
                forecast: null,
                previous: null,
              },
            ],
          },
          fundamentalCitations: {
            newsTitles: [],
            calendarEvents: ["FOMC rate decision"],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const chips = await screen.findByTestId("citation-chips");
    const eventChip = chips.querySelector(
      "[data-testid='citation-chip-event']",
    ) as HTMLElement | null;
    expect(eventChip).not.toBeNull();

    const calendarToggle = screen.getByTestId("fundamental-calendar-toggle");
    const calendarList = screen.getByTestId("fundamental-calendar-list");
    expect(calendarToggle).toHaveAttribute("aria-expanded", "false");
    expect(calendarList).toHaveAttribute("data-state", "closed");

    // Build the slug the same way the component does, using the
    // ORIGINAL index (2) for the third event in the snapshot.
    const expectedSlug =
      "cite-event-" +
      "2026-04-30-fomc-rate-decision-2"
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

    // The same slug must exist as an `id` somewhere in the calendar
    // card (i.e. on the matching <li> row), proving the chip click
    // would actually find a target.
    const target = document.getElementById(expectedSlug);
    expect(target).not.toBeNull();

    fireEvent.click(eventChip as HTMLElement);

    await waitFor(() => {
      expect(calendarToggle).toHaveAttribute("aria-expanded", "true");
      expect(calendarList).toHaveAttribute("data-state", "open");
      expect(target).toHaveClass("ring-2", "ring-primary/60", "rounded-md");
    });
  });

  it("drops AI-cited items that don't match any row in fundamentalContext (no dangling chips)", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "n-1",
                title: "Gold rallies as Fed signals pause",
                summary: "",
                source: "Newsmaker.id",
                url: null,
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [],
          },
          fundamentalCitations: {
            // Cited title is NOT in the snapshot — must be dropped.
            newsTitles: ["Some hallucinated headline that doesn't exist"],
            calendarEvents: [],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // Wait for the page to mount, then assert no chips rendered.
    await screen.findByTestId("text-instrument");
    expect(
      screen.queryByTestId("citation-chips"),
    ).not.toBeInTheDocument();
  });

  it("renders no chip block at all when fundamentalCitations is null (legacy rows)", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "n-1",
                title: "Gold rallies as Fed signals pause",
                summary: "",
                source: "Newsmaker.id",
                url: "https://newsmaker.id/article-1",
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [],
          },
          fundamentalCitations: null,
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("text-instrument");
    expect(
      screen.queryByTestId("citation-chips"),
    ).not.toBeInTheDocument();
    // The FundamentalContextCard itself should still render (the
    // snapshot is still there for the user to audit).
    expect(
      screen.getByTestId("card-fundamental-context"),
    ).toBeInTheDocument();
  });
});

describe("AnalysisDetailPage: automatic timeframe analysis", () => {
  it("waits for the debounce, sends the current context once, and hides the previous analysis while transitioning", async () => {
    const requestBodies: Record<string, unknown>[] = [];
    let resolveCreate: ((response: Response) => void) | undefined;
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          userInputContext: "Watch the H4 resistance.",
        },
      }),
      feedbackHandler(),
      createAnalysisHandler((body) => {
        requestBodies.push(body);
        return new Promise<Response>((resolve) => {
          resolveCreate = resolve;
        });
      }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("text-instrument");
    vi.useFakeTimers();
    fireEvent.click(screen.getByTestId("button-quick-timeframe-4h"));

    expect(screen.getByTestId("quick-timeframe-transition")).toHaveTextContent(/4h/i);
    expect(screen.queryByTestId("primary-metrics-chart-grid")).not.toBeInTheDocument();
    expect(requestBodies).toHaveLength(0);

    await act(async () => {
      vi.advanceTimersByTime(649);
      await Promise.resolve();
    });
    expect(requestBodies).toHaveLength(0);

    await act(async () => {
      vi.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(requestBodies).toEqual([
      {
        instrument: "XAU/USD",
        timeframe: "4h",
        mode: "beginner",
        userInputContext: "Watch the H4 resistance.",
      },
    ]);

    await act(async () => {
      resolveCreate?.(jsonResponse({ id: 777 }));
      await Promise.resolve();
    });
  });

  it("does not create a new analysis when the active timeframe is selected", async () => {
    const requestBodies: Record<string, unknown>[] = [];
    installFetchMock([
      getAnalysisHandler({}),
      feedbackHandler(),
      createAnalysisHandler((body) => {
        requestBodies.push(body);
        return jsonResponse({ id: 777 });
      }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("text-instrument");
    vi.useFakeTimers();
    fireEvent.click(screen.getByTestId("button-quick-timeframe-1h"));

    await act(async () => {
      vi.advanceTimersByTime(1_000);
      await Promise.resolve();
    });

    expect(requestBodies).toHaveLength(0);
    expect(screen.queryByTestId("quick-timeframe-transition")).not.toBeInTheDocument();
    expect(screen.getByTestId("primary-metrics-chart-grid")).toBeInTheDocument();
  });

  it("only analyzes the last timeframe selected during rapid changes", async () => {
    const requestBodies: Record<string, unknown>[] = [];
    let resolveCreate: ((response: Response) => void) | undefined;
    installFetchMock([
      getAnalysisHandler({}),
      feedbackHandler(),
      createAnalysisHandler((body) => {
        requestBodies.push(body);
        return new Promise<Response>((resolve) => {
          resolveCreate = resolve;
        });
      }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("text-instrument");
    vi.useFakeTimers();
    fireEvent.click(screen.getByTestId("button-quick-timeframe-4h"));
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    fireEvent.click(screen.getByTestId("button-quick-timeframe-1D"));

    await act(async () => {
      vi.advanceTimersByTime(650);
      await Promise.resolve();
    });

    expect(requestBodies).toHaveLength(1);
    expect(requestBodies[0]).toMatchObject({ timeframe: "1D" });

    await act(async () => {
      resolveCreate?.(jsonResponse({ id: 778 }));
      await Promise.resolve();
    });
  });

  it("restores the previous analysis after failure and exposes a manual retry", async () => {
    const requestBodies: Record<string, unknown>[] = [];
    let attempt = 0;
    let resolveRetry: ((response: Response) => void) | undefined;
    installFetchMock([
      getAnalysisHandler({}),
      feedbackHandler(),
      createAnalysisHandler((body) => {
        requestBodies.push(body);
        attempt += 1;
        if (attempt === 1) {
          return jsonResponse({ error: "Temporary analysis failure" }, 500);
        }
        return new Promise<Response>((resolve) => {
          resolveRetry = resolve;
        });
      }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("text-instrument");
    vi.useFakeTimers();
    fireEvent.click(screen.getByTestId("button-quick-timeframe-4h"));
    await act(async () => {
      vi.advanceTimersByTime(650);
      await Promise.resolve();
      await Promise.resolve();
    });
    vi.useRealTimers();

    expect(await screen.findByTestId("quick-timeframe-error")).toBeInTheDocument();
    expect(screen.getByTestId("primary-metrics-chart-grid")).toBeInTheDocument();
    const retry = screen.getByTestId("button-quick-analyze");
    expect(retry).toBeEnabled();
    expect(retry).toHaveTextContent(/try again/i);

    await act(async () => {
      fireEvent.click(retry);
      await Promise.resolve();
    });
    await waitFor(() => expect(requestBodies).toHaveLength(2));
    expect(requestBodies[1]).toMatchObject({ timeframe: "4h" });
    expect(screen.getByTestId("quick-timeframe-transition")).toBeInTheDocument();
    expect(screen.queryByTestId("primary-metrics-chart-grid")).not.toBeInTheDocument();

    await act(async () => {
      resolveRetry?.(jsonResponse({ id: 779 }));
      await Promise.resolve();
    });
  });
});

describe("AnalysisDetailPage: user actions", () => {
  it("POSTs to /api/analyses/:id/feedback with feedbackType=useful when the user picks useful + submits", async () => {
    const { calls } = installFetchMock([
      getAnalysisHandler({}),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const useful = await screen.findByTestId("button-feedback-useful");

    await act(async () => {
      fireEvent.click(useful);
    });

    // After picking a feedback type the submit button materialises.
    const submit = await screen.findByTestId("button-submit-feedback");

    await act(async () => {
      fireEvent.click(submit);
    });

    await waitFor(() => {
      const post = calls.find(
        (c) =>
          c.method === "POST" &&
          c.url.endsWith(`/api/analyses/${ANALYSIS_ID}/feedback`),
      );
      expect(post).toBeDefined();
      const payload = post?.body ? JSON.parse(post.body) : null;
      expect(payload?.feedbackType).toBe("useful");
    });
  });
});
