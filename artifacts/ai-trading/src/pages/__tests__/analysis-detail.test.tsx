// Component tests for `src/pages/analysis-detail.tsx`. The page
// mounts inside `<Layout>`, so the layout-bell poll and the SSE
// constructor are stubbed in `src/test/setup.ts`.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import AnalysisDetailPage from "../analysis-detail";
import { AdaptivePositionPlan } from "../../components/adaptive-position-plan";
import { en } from "../../locales/en";
import {
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

const ANALYSIS_ID = 555;
const NOW = Date.now();
const SAVED_MARKET_SNAPSHOT = {
  instrument: "XAU/USD",
  timeframe: "1h",
  capturedAt: new Date(NOW - 60_000).toISOString(),
  sourceFetchedAt: new Date(NOW - 2 * 60 * 60_000).toISOString(),
  priceAtAnalysis: 2304,
  sourceStatus: "fresh",
  candles: [
    { date: new Date(NOW - 7 * 3_600_000).toISOString(), open: 2304, high: 2305, low: 2300, close: 2302 },
    { date: new Date(NOW - 6 * 3_600_000).toISOString(), open: 2302, high: 2304, low: 2298, close: 2300 },
    { date: new Date(NOW - 5 * 3_600_000).toISOString(), open: 2300, high: 2302, low: 2295, close: 2297 },
    { date: new Date(NOW - 4 * 3_600_000).toISOString(), open: 2297, high: 2301, low: 2297, close: 2300 },
    { date: new Date(NOW - 3 * 3_600_000).toISOString(), open: 2300, high: 2307, low: 2299, close: 2305 },
    { date: new Date(NOW - 2 * 3_600_000).toISOString(), open: 2305, high: 2309, low: 2301, close: 2303 },
    { date: new Date(NOW - 3_600_000).toISOString(), open: 2303, high: 2306, low: 2299, close: 2301 },
  ],
};

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
  marketSnapshot: SAVED_MARKET_SNAPSHOT,
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
      code: "BCO10_BBJ",
      product: "Brent Crude Oil",
      contractSize: 100,
      contractUnit: "barrel",
      tradingDays: "Monday–Friday",
      tradingHours: { summer: "07:00–03:45 WIB", winter: "08:00–03:45 WIB" },
      initialMarginUsdPerLot: 100,
      facilityFeeUsdPerLotPerSide: 1.5,
      vatPercent: 11,
      rolloverUsdPerLotPerNight: 0.5,
      priceSource: "Telequote",
      priceGuidance: "Last Trade",
      minimumSpread: "USD 0.10 / pip / barrel / side",
      maximumSpread: "USD 0.30 / pip / barrel / side",
      hecticSpread: "Based on market conditions",
      minimumPriceMovement: "USD 0.01 / barrel",
      limitStopRange: "USD 1–USD 20",
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
    {
      code: "JPK50_BBJ",
      product: "Nikkei Index",
      contractSize: 5,
      contractUnit: "USD/point",
      tradingDays: "Monday–Friday",
      tradingHours: { summer: "06:30–13:55, 14:10–03:45 WIB", winter: "06:30–13:55, 14:10–03:45 WIB" },
      initialMarginUsdPerLot: 100,
      facilityFeeUsdPerLotPerSide: null,
      vatPercent: 11,
      rolloverUsdPerLotPerNight: 0.2,
      priceSource: "Telequote",
      priceGuidance: "Last Trade",
      minimumSpread: "10 points / side",
      maximumSpread: "25 points / side",
      hecticSpread: "Based on market conditions",
      minimumPriceMovement: "5 points",
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
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("AnalysisDetailPage: happy-path render", () => {
  it("explains a legacy 1h side without levels instead of offering n/a as a plan", async () => {
    installFetchMock([getAnalysisHandler({
      body: {
        ...ANALYSIS_PAYLOAD,
        tradePlan: {
          ...TRADE_PLAN,
          preferredSide: "sell",
          buy: {
            entryZone: "tunggu konfirmasi ulang",
            stopLoss: "n/a",
            takeProfit1: "n/a",
            takeProfit2: "n/a",
            riskRewardRatio: "n/a",
            rationale: "Level untuk skenario ini tidak konsisten dari AI.",
          },
        },
      },
    }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    const card = await screen.findByTestId("card-trade-plan");
    expect(card).not.toHaveTextContent(/\bn\/a\b/i);
    expect(screen.getByTestId("trade-plan-buy-pending")).toHaveTextContent(/No entry yet/i);
    expect(screen.queryByTestId("button-copy-levels-buy")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-copy-levels-sell")).toBeInTheDocument();
    expect(screen.getByTestId("trade-plan-sell-sl")).toHaveTextContent("2,312.00");
  });

  it("does not offer Copy for a new pending-quote plan without numeric levels", async () => {
    const pendingSide = {
      entryZone: "Menunggu quote dan konfirmasi struktur; level belum dapat ditentukan",
      stopLoss: "Menunggu quote dan konfirmasi struktur; level belum dapat ditentukan",
      takeProfit1: "Menunggu quote dan konfirmasi struktur; level belum dapat ditentukan",
      takeProfit2: "Menunggu quote dan konfirmasi struktur; level belum dapat ditentukan",
      riskRewardRatio: "Belum dihitung — entry masih pending",
      rationale: "Tunggu harga terkini untuk memvalidasi struktur.",
    };
    installFetchMock([getAnalysisHandler({
      body: { ...ANALYSIS_PAYLOAD, tradePlan: { ...TRADE_PLAN, preferredSide: "wait", buy: pendingSide, sell: pendingSide } },
    }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    await screen.findByTestId("card-trade-plan");
    expect(screen.getByTestId("trade-plan-buy-pending")).toBeInTheDocument();
    expect(screen.getByTestId("trade-plan-sell-pending")).toBeInTheDocument();
    expect(screen.queryByTestId("button-copy-levels-buy")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-copy-levels-sell")).not.toBeInTheDocument();
  });

  it("keeps invalidation and risk cues visible while opening one compact detail at a time", async () => {
    installFetchMock([getAnalysisHandler({
      body: {
        ...ANALYSIS_PAYLOAD,
        opportunity: "The trend can continue.",
        risk: "A break below support invalidates the setup.",
      },
    }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    const invalidation = await screen.findByTestId("invalidation-heading");
    const risk = screen.getByTestId("risk-heading");
    expect(invalidation).toHaveTextContent("2");
    expect(invalidation).toHaveAttribute("aria-expanded", "false");
    expect(risk).toHaveTextContent("Risk");
    expect(screen.queryByTestId("list-invalidation")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card-risk")).not.toBeInTheDocument();
    expect(screen.getByTestId("text-risk-disclaimer-short")).toBeVisible();

    fireEvent.click(invalidation);
    expect(invalidation).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("list-invalidation").children).toHaveLength(2);
    fireEvent.click(risk);
    expect(invalidation).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("list-invalidation")).not.toBeInTheDocument();
    expect(screen.getByTestId("card-risk")).toHaveTextContent(/break below support/i);
    fireEvent.click(risk);
    expect(screen.queryByTestId("card-risk")).not.toBeInTheDocument();
    expect(screen.getByTestId("text-risk-disclaimer-short")).toBeVisible();
  });

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

  it("keeps long free-form confidence rationale visible alongside the confidence range", async () => {
    const longReason = "Trend structure aligns across H1 and H4. The candle pattern and momentum readings point in the same direction over several sessions, which explains the confidence estimate.";
    installFetchMock([getAnalysisHandler({ body: { ...ANALYSIS_PAYLOAD, whyReason: longReason } }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    expect(await screen.findByTestId("confidence-reason-safety")).toHaveTextContent(longReason);
    expect(screen.getByTestId("text-confidence")).toBeVisible();
    const trigger = screen.getByTestId("confidence-reason-disclosure");
    expect(trigger).toHaveTextContent("See full reasoning");
    expect(screen.queryByTestId("confidence-reason-dialog")).not.toBeInTheDocument();
    fireEvent.click(trigger);
    const dialog = screen.getByTestId("confidence-reason-dialog");
    expect(dialog).toHaveAttribute("role", "dialog");
    expect(within(dialog).getByTestId("confidence-reason-details")).toHaveTextContent("Price likely continues higher");
    expect(within(dialog).getByTestId("confidence-reason-details")).toHaveTextContent("H1 close below 2300");
    expect(dialog).toHaveTextContent("XAU/USD · 1h");
    expect(within(dialog).getByTestId("confidence-reason-details")).toHaveClass("overflow-y-auto");
    fireEvent.click(within(dialog).getByRole("button", { name: "Collapse" }));
    expect(screen.queryByTestId("confidence-reason-dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("confidence-reason-safety")).toHaveTextContent(longReason);
  });

  it("keeps a long warning visible even without any fixed safety keywords", async () => {
    const warning = "Signal reliability is poor because historical pricing is incomplete; execution may slip materially, so this setup is unsuitable for live orders. Review the source data before acting.";
    installFetchMock([getAnalysisHandler({ body: { ...ANALYSIS_PAYLOAD, whyReason: warning } }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    expect(await screen.findByTestId("confidence-reason-safety")).toHaveTextContent(warning);
    expect(screen.queryByTestId("confidence-reason-dialog")).not.toBeInTheDocument();
  });

  it("does not hide a caution inside AI-written confidence rationale", async () => {
    installFetchMock([getAnalysisHandler({
      body: { ...ANALYSIS_PAYLOAD, whyReason: "Momentum is strong, but stop loss must be respected." },
    }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    expect(await screen.findByTestId("confidence-reason-safety")).toHaveTextContent(/stop loss must be respected/i);
    expect(screen.queryByTestId("confidence-reason-dialog")).not.toBeInTheDocument();
  });

  it("keeps short rationale and pro uncertainty notes visible without requiring an extra click", async () => {
    installFetchMock([getAnalysisHandler({
      body: { ...ANALYSIS_PAYLOAD, mode: "pro", uncertaintyNotes: "The data is mixed, so the estimate depends on confirmation." },
    }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    expect(await screen.findByTestId("confidence-reason-safety")).toHaveTextContent(/data is mixed/i);
    fireEvent.click(screen.getByTestId("confidence-reason-disclosure"));
    expect(screen.getByTestId("confidence-reason-details")).toHaveTextContent(/data is mixed/i);
    expect(screen.getByTestId("confidence-copy-text")).toBeInTheDocument();
    expect(screen.getByTestId("confidence-copy-image")).toBeInTheDocument();
  });

  it("uses the saved product and timeframe evidence in the optional pro breakdown", async () => {
    installFetchMock([getAnalysisHandler({
      body: {
        ...ANALYSIS_PAYLOAD,
        instrument: "BRENT",
        timeframe: "4h",
        mode: "pro",
        uncertaintyNotes: "• Basis: BRENT 4h momentum is improving.\n• Limit: Event risk remains.",
        keyDriversTechnical: "BRENT 4h closed above its prior range.",
        keyDriversFundamental: "A scheduled oil inventory report may shift the setup.",
        risk: "A break below the range would weaken this thesis.",
        invalidationConditions: "4h close below the range; Oil inventory surprise",
      },
    }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    expect(await screen.findByTestId("confidence-reason-safety")).toHaveTextContent(/BRENT 4h momentum/);
    expect(screen.queryByTestId("confidence-reason-dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("confidence-reason-disclosure"));
    const dialog = screen.getByTestId("confidence-reason-dialog");
    const details = within(dialog).getByTestId("confidence-reason-details");
    expect(dialog).toHaveTextContent("BRENT · 4h");
    expect(details).toHaveTextContent("BRENT 4h closed above its prior range.");
    expect(details).toHaveTextContent("A scheduled oil inventory report");
    expect(details).toHaveTextContent("4h close below the range");
    expect(details).not.toHaveTextContent(/Fed|Gold/);
  });

  it("copies the full explanation and only cited sources found in the saved snapshot", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    installFetchMock([getAnalysisHandler({
      body: {
        ...ANALYSIS_PAYLOAD,
        whyReason: "• Basis: Harga 1h masih didukung struktur naik.\n• Batasan: Risiko event tetap ada.",
        fundamentalContext: {
          newsItems: [{ id: "n-1", title: "Gold rallies after statement", url: "https://example.com/gold", publishedAt: new Date(NOW).toISOString() }],
          calendarEvents: [{ date: "2026-09-27", time: "12:00", currency: "USD", event: "Inventory report", impact: "★★" }],
        },
        fundamentalCitations: {
          newsTitles: ["Gold rallies after statement", "Unverified invented headline"],
          calendarEvents: ["Inventory report"],
        },
      },
    }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    fireEvent.click(await screen.findByTestId("confidence-reason-disclosure"));
    fireEvent.click(screen.getByTestId("confidence-copy-text"));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const copied = String(writeText.mock.calls[0]?.[0]);
    expect(copied).toContain("XAU/USD · 1h");
    expect(copied).toContain("• Batasan: Risiko event tetap ada.");
    expect(copied).toContain("Price likely continues higher into resistance.");
    expect(copied).toContain("H1 close below 2300");
    expect(copied).toContain("Gold rallies after statement — https://example.com/gold");
    expect(copied).toContain("Inventory report · 2026-09-27");
    expect(copied).not.toContain("Unverified invented headline");
  });

  it("copies a PNG when supported and downloads one if the browser rejects image clipboard access", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      fillRect: vi.fn(),
      fillText: vi.fn(),
      measureText: (text: string) => ({ width: text.length * 12 }),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,UE5H");
    const downloads: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      downloads.push(this.download);
    });
    class TestClipboardItem {
      constructor(public readonly items: Record<string, Blob>) {}
    }
    vi.stubGlobal("ClipboardItem", TestClipboardItem);
    const write = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("Permission denied"));
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { write } });
    installFetchMock([getAnalysisHandler({ body: ANALYSIS_PAYLOAD }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    fireEvent.click(await screen.findByTestId("confidence-reason-disclosure"));
    const button = screen.getByTestId("confidence-copy-image");
    fireEvent.click(button);
    await waitFor(() => expect(write).toHaveBeenCalledTimes(1));
    const item = write.mock.calls[0]?.[0]?.[0] as TestClipboardItem;
    expect(item.items["image/png"]).toHaveProperty("type", "image/png");
    expect(item.items["image/png"].size).toBeGreaterThan(0);
    expect(downloads).toHaveLength(0);

    fireEvent.click(button);
    await waitFor(() => expect(downloads).toEqual(["tradepilot-XAU-USD-1h.png"]));
    expect(screen.getByTestId("confidence-reason-dialog")).toBeInTheDocument();
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
    const scenarioA = screen.getByTestId("exec-scenario-a") as HTMLDetailsElement;
    const scenarioB = screen.getByTestId("exec-scenario-b") as HTMLDetailsElement;
    expect(scenarioA.open).toBe(false);
    expect(scenarioB.open).toBe(false);
    fireEvent.click(within(scenarioA).getByText(en.analysis_detail.execution_scenario_a_label));
    expect(scenarioA.open).toBe(true);
    expect(scenarioB.open).toBe(false);
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

  it("passes the existing live-quote cache snapshot to both chart headers without starting a quote request", async () => {
    const { calls } = installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper, queryClient } = makeWrapper();
    queryClient.setQueryData(["live-quotes"], {
      status: "success",
      updatedAt: new Date(NOW).toISOString(),
      serverTime: "08:00:00",
      data: [{
        instrument: "XAU/USD",
        symbol: "XUL10",
        price: 2345.67,
        buy: 2345.8,
        sell: 2345.5,
        spread: 0.3,
        high: 2350,
        low: 2320,
        open: 2330,
        changePercent: "+0.42%",
        direction: "up",
        serverTime: "08:00:00",
        updatedAt: new Date(NOW).toISOString(),
      }],
    });

    render(
      <Wrapper>
        <AnalysisDetailPage
          params={{ id: String(ANALYSIS_ID) }}
          embedded
        />
      </Wrapper>,
    );

    expect(await screen.findByTestId("chart-live-quote-price")).toHaveTextContent("2345.67");
    fireEvent.click(screen.getByTestId("button-open-full-chart"));
    expect(screen.getAllByTestId("chart-live-quote-price")).toHaveLength(2);
    expect(calls.filter((call) => call.url.includes("/api/quotes/live"))).toHaveLength(0);
  });
});

describe("AnalysisDetailPage: situation-aware position recommendation", () => {
  it("custom analysis has no Adaptive", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          instrument: "PLATINUM",
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ], { strict: false });
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("text-instrument"); // Wait for load
    expect(screen.getByTestId("text-instrument")).toHaveTextContent("PLATINUM");
    
    // AdaptivePositionPlan should NOT be mounted
    expect(screen.queryByTestId("card-adaptive-position-plan")).not.toBeInTheDocument();
  });

  it("mounts Adaptive for canonical BRENT and uses the Brent trading rule", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          instrument: "BRENT",
          tradePlan: {
            ...TRADE_PLAN,
            buy: { ...TRADE_PLAN.buy, entryZone: "80.10–80.20", stopLoss: "79.00" },
            sell: { ...TRADE_PLAN.sell, entryZone: "80.10–80.20", stopLoss: "81.20" },
          },
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ], { strict: false });
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    expect(await screen.findByTestId("card-adaptive-position-plan")).toBeInTheDocument();
    expect(await screen.findByTestId("adaptive-account-rule")).toHaveTextContent(
      /contract size is 100 barrel/i,
    );
    expect(screen.getByTestId("adaptive-contract-micro")).toHaveTextContent(/10 barrel/i);
    expect(screen.getByTestId("adaptive-contract-mini")).toHaveTextContent(/100 barrel/i);
    expect(screen.getByTestId("adaptive-contract-regular")).toHaveTextContent(/1,000 barrel/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(
      /supports XAU\/USD, BRENT, HSI, and NIKKEI analyses/i,
    );
  });

  it("keeps Adaptive explanations and warnings in the selected language across live language changes", async () => {
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
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    const account = await screen.findByTestId("adaptive-account-explanation") as HTMLDetailsElement;
    const funds = screen.getByTestId("adaptive-funds-explanation") as HTMLDetailsElement;
    const risk = screen.getByTestId("adaptive-risk-explanation") as HTMLDetailsElement;
    const disclaimer = screen.getByTestId("adaptive-disclaimer");
    const dayTrade = screen.getByTestId("adaptive-daytrade-only");
    const toggle = screen.getByTestId("button-language-toggle");
    const intro = screen.getByTestId("adaptive-intro");
    expect(intro).toBeVisible();
    expect(intro).toHaveTextContent(/Review an analysis-driven, manual position plan/i);
    expect(intro.querySelector("summary")).toBeNull();

    expect(account.open).toBe(false);
    expect(funds.open).toBe(false);
    expect(risk.open).toBe(false);
    expect(within(account).getByText("Minimum 0.10 lot · $100 margin")).not.toBeVisible();
    expect(within(funds).getByText(/Enter free funds that can cover/)).not.toBeVisible();
    expect(within(risk).getByText(/Uses at most 50% of the loss ceiling/)).not.toBeVisible();
    expect(disclaimer).toBeVisible();
    expect(disclaimer).toHaveTextContent(/not a profit guarantee or automatic order/);
    expect(dayTrade).toBeVisible();
    expect(dayTrade).toHaveTextContent(/Overnight holding and rollover fees are excluded/);

    fireEvent.click(within(account).getByText("Show account explanation"));
    fireEvent.click(within(funds).getByText("Show funds and risk explanation"));
    fireEvent.click(within(risk).getByText("Show risk style explanation"));
    expect(account.open).toBe(true);
    expect(funds.open).toBe(true);
    expect(risk.open).toBe(true);
    expect(within(account).getByText("Minimum 0.10 lot · $100 margin")).toBeVisible();
    expect(within(funds).getByText(/Enter free funds that can cover/)).toBeVisible();
    expect(within(risk).getByText(/Uses at most 50% of the loss ceiling/)).toBeVisible();

    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName("Beralih ke Bahasa Inggris");
    expect(intro).toBeVisible();
    expect(intro).toHaveTextContent(/Susun ukuran posisi manual/i);
    expect(account.open).toBe(true);
    expect(funds.open).toBe(true);
    expect(risk.open).toBe(true);
    expect(within(account).getByText("Lihat penjelasan tipe akun")).toBeVisible();
    expect(within(funds).getByText("Lihat penjelasan dana dan risiko")).toBeVisible();
    expect(within(risk).getByText("Lihat penjelasan gaya risiko")).toBeVisible();
    expect(within(account).getByText("Minimum 0,10 lot · margin $100")).toBeVisible();
    expect(within(account).queryByText("Minimum 0.10 lot · $100 margin")).not.toBeInTheDocument();
    expect(within(funds).getByText(/Masukkan dana bebas yang dapat menutup/)).toBeVisible();
    expect(within(funds).queryByText(/Enter free funds that can cover/)).not.toBeInTheDocument();
    expect(within(risk).getByText(/Memakai maksimal 50% batas rugi/)).toBeVisible();
    expect(within(risk).queryByText(/Uses at most 50% of the loss ceiling/)).not.toBeInTheDocument();
    expect(disclaimer).toBeVisible();
    expect(disclaimer).toHaveTextContent(/bukan jaminan profit atau order otomatis/);
    expect(dayTrade).toBeVisible();
    expect(dayTrade).toHaveTextContent(/Posisi overnight dan biaya menginap tidak dihitung/);

    fireEvent.click(screen.getByTestId("button-adaptive-account-micro"));
    expect(within(account).getByText("Minimum 0,01 lot · margin $10")).toBeVisible();
    expect(within(account).queryByText("Minimum 0,10 lot · margin $100")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-adaptive-account-regular"));
    expect(within(account).getByText("Minimum 1,00 lot · margin $1.000")).toBeVisible();
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    expect(within(risk).getByText(/Memakai maksimal 75% batas rugi/)).toBeVisible();
    expect(within(risk).queryByText(/Memakai maksimal 50% batas rugi/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-aggressive"));
    expect(within(risk).getByText(/Dapat memakai sampai 100% batas rugi.*dana bebas/)).toBeVisible();

    fireEvent.click(within(account).getByText("Lihat penjelasan tipe akun"));
    fireEvent.click(within(funds).getByText("Lihat penjelasan dana dan risiko"));
    fireEvent.click(within(risk).getByText("Lihat penjelasan gaya risiko"));
    expect(account.open).toBe(false);
    expect(funds.open).toBe(false);
    expect(risk.open).toBe(false);
    expect(within(account).getByText("Minimum 1,00 lot · margin $1.000")).not.toBeVisible();
    expect(within(funds).getByText(/Masukkan dana bebas yang dapat menutup/)).not.toBeVisible();
    expect(within(risk).getByText(/Dapat memakai sampai 100% batas rugi/)).not.toBeVisible();
    expect(disclaimer).toBeVisible();
    expect(dayTrade).toBeVisible();

    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName("Switch to Indonesian");
    expect(account.open).toBe(false);
    expect(funds.open).toBe(false);
    expect(risk.open).toBe(false);
    expect(within(account).getByText("Show account explanation")).toBeVisible();
    expect(within(funds).getByText("Show funds and risk explanation")).toBeVisible();
    expect(within(risk).getByText("Show risk style explanation")).toBeVisible();
    expect(within(account).getByText("Minimum 1.00 lot · $1,000 margin")).not.toBeVisible();
    expect(within(risk).getByText(/May use up to 100% of the loss ceiling.*free funds/)).not.toBeVisible();
    expect(disclaimer).toBeVisible();
    expect(disclaimer).toHaveTextContent(/not a profit guarantee or automatic order/);
    expect(dayTrade).toBeVisible();
    expect(dayTrade).toHaveTextContent(/Overnight holding and rollover fees are excluded/);

    fireEvent.click(within(account).getByText("Show account explanation"));
    fireEvent.click(within(funds).getByText("Show funds and risk explanation"));
    fireEvent.click(within(risk).getByText("Show risk style explanation"));
    expect(within(account).getByText("Minimum 1.00 lot · $1,000 margin")).toBeVisible();
    expect(within(funds).getByText(/Enter free funds that can cover/)).toBeVisible();
    expect(within(risk).getByText(/May use up to 100% of the loss ceiling.*free funds/)).toBeVisible();
    fireEvent.click(screen.getByTestId("button-adaptive-account-micro"));
    expect(within(account).getByText("Minimum 0.01 lot · $10 margin")).toBeVisible();
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    expect(within(risk).getByText(/Uses at most 75% of the loss ceiling/)).toBeVisible();
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-conservative"));
    expect(within(risk).getByText(/Uses at most 50% of the loss ceiling/)).toBeVisible();
  });

  it("defaults to Mini, supports all account tiers, and keeps separate Buy and Sell ladders", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const execCommand = vi.fn(() => false);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });
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
    const accountExplanation = screen.getByTestId("adaptive-account-explanation") as HTMLDetailsElement;
    const fundsExplanation = screen.getByTestId("adaptive-funds-explanation") as HTMLDetailsElement;
    const riskExplanation = screen.getByTestId("adaptive-risk-explanation") as HTMLDetailsElement;
    expect(accountExplanation.open).toBe(false);
    expect(fundsExplanation.open).toBe(false);
    expect(riskExplanation.open).toBe(false);
    expect(within(accountExplanation).getByText(/Minimum 0.10 lot · \$100 margin/i)).not.toBeVisible();
    expect(within(fundsExplanation).getByText(/Enter free funds that can cover/i)).not.toBeVisible();
    expect(within(riskExplanation).getByText(/at most 50%/i)).not.toBeVisible();
    expect(screen.getByTestId("button-adaptive-account-mini")).toHaveTextContent(/^Mini$/);
    expect(screen.getByTestId("button-adaptive-risk-style-conservative")).toHaveTextContent(/^Conservative$/);
    expect(margin).toBeVisible();
    expect(maximumLoss).toBeVisible();
    expect(screen.getByTestId("adaptive-disclaimer")).toBeVisible();
    fireEvent.click(within(accountExplanation).getByText("Show account explanation"));
    expect(accountExplanation.open).toBe(true);
    expect(screen.getByTestId("adaptive-account-rule")).toBeVisible();
    fireEvent.click(within(fundsExplanation).getByText("Show funds and risk explanation"));
    expect(within(fundsExplanation).getByText(/Enter free funds that can cover/i)).toBeVisible();
    fireEvent.click(within(riskExplanation).getByText("Show risk style explanation"));
    expect(within(riskExplanation).getByText(/at most 50%/i)).toBeVisible();
    const methodDetails = screen.getByTestId("adaptive-plan-method") as HTMLDetailsElement;
    expect(methodDetails.open).toBe(false);
    expect(screen.getByTestId("adaptive-analysis-basis")).toHaveTextContent(/saved analysis shown above/i);
    expect(screen.getByTestId("adaptive-analysis-basis")).toHaveTextContent(/Current chart.*separate layer candidates/i);
    expect(await screen.findByTestId("adaptive-account-rule")).toHaveTextContent(/Mini: a minimum 0.1 lot requires \$100 margin/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Maximum 0.9 lot applies to each position/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/supports XAU\/USD, BRENT, HSI, and NIKKEI analyses/i);
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
    expect(within(accountExplanation).getByText(/Minimum 0.01 lot · \$10 margin/i)).toBeVisible();
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Micro: a minimum 0.01 lot requires \$10 margin/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Maximum 0.09 lot applies to each position/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Contract size is 1 troy ounce/i);
    expect(screen.getByTestId("adaptive-contract-table")).toHaveTextContent(/Micro is an assumed 1\/10 of Mini.*not an official broker rule/i);
    expect(screen.getByTestId("adaptive-contract-micro")).toHaveTextContent(/1 troy ounce/i);
    expect(screen.getByTestId("adaptive-contract-mini")).toHaveTextContent(/10 troy ounce/i);
    expect(screen.getByTestId("adaptive-contract-regular")).toHaveTextContent(/100 troy ounce/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/minimum to open a Micro account is \$50/i);
    fireEvent.click(screen.getByTestId("button-adaptive-account-regular"));
    expect(screen.getByTestId("button-adaptive-account-regular")).toHaveAttribute("aria-pressed", "true");
    expect(within(accountExplanation).getByText(/Minimum 1.00 lot · \$1,000 margin/i)).toBeVisible();
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Regular: a minimum 1 lot requires \$1,000 margin/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/no per-position maximum for Regular/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Contract size is 100 troy ounce/i);
    fireEvent.click(screen.getByTestId("button-adaptive-account-micro"));
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    expect(screen.getByTestId("button-adaptive-risk-style-balanced")).toHaveAttribute("aria-pressed", "true");
    expect(within(riskExplanation).getByText(/at most 75%/i)).toBeVisible();
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-conservative"));
    fireEvent.click(within(accountExplanation).getByText("Show account explanation"));
    expect(accountExplanation.open).toBe(false);
    expect(screen.getByTestId("adaptive-account-rule")).not.toBeVisible();
    expect(screen.getByTestId("adaptive-disclaimer")).toBeVisible();
    fireEvent.change(margin, { target: { value: "100000" } });
    fireEvent.change(maximumLoss, { target: { value: "500" } });
    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/From this analysis snapshot:/i));
    expect(screen.getByTestId("adaptive-candle-source-time")).toHaveTextContent(/Analysis candle snapshot fetched/i);
    expect(screen.queryByTestId("adaptive-plan-comparison")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    const snapshot = await screen.findByTestId("adaptive-plan-snapshot");
    const snapshotExplanation = screen.getByTestId("adaptive-snapshot-explanation");
    expect(snapshotExplanation).toBeVisible();
    expect(snapshot).toHaveTextContent(/Stop Loss/i);
    expect(snapshotExplanation).toHaveTextContent(/selected tier and risk style/i);
    expect(snapshotExplanation.querySelector("summary")).toBeNull();
    const whyButton = await screen.findByTestId("adaptive-insight-button-reasoning");
    const volatilityButton = screen.getByTestId("adaptive-insight-button-volatility");
    expect(whyButton).toHaveAttribute("aria-expanded", "false");
    expect(volatilityButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("adaptive-timeframe-volatility")).not.toBeInTheDocument();
    fireEvent.click(volatilityButton);
    expect(volatilityButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("adaptive-timeframe-volatility")).toHaveTextContent(/Typical candle range/i);
    fireEvent.click(whyButton);
    expect(volatilityButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("adaptive-timeframe-volatility")).not.toBeInTheDocument();
    const reasoning = screen.getByTestId("adaptive-plan-reasoning");
    expect(whyButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(whyButton);
    expect(screen.queryByTestId("adaptive-plan-reasoning")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("adaptive-insight-button-buy"));
    expect(screen.getByTestId("adaptive-side-status-buy")).toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-side-status-sell")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("adaptive-insight-button-sell"));
    expect(screen.queryByTestId("adaptive-side-status-buy")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-side-status-sell")).toBeInTheDocument();
    const buyPlan = screen.getByTestId("adaptive-plan-buy");
    expect(reasoning.textContent).toMatch(/Why this plan was chosen/i);
    expect(reasoning.textContent).toMatch(/favor the rise scenario/i);
    expect(reasoning.textContent).toMatch(/Technical snapshot: 12 support up, 4 support down/i);
    expect(snapshot).toHaveTextContent(/Answer at a glance/i);
    expect(snapshot).toHaveTextContent(/Entry point/i);
    expect(snapshot).toHaveTextContent(/If all entries fill: 3 positions · 0\.26 lot/i);
    expect(snapshot).toHaveTextContent(/One final Stop Loss/i);
    expect(snapshot).toHaveTextContent(/Estimated maximum loss/i);
    expect(screen.getByTestId("adaptive-usable-risk-budget")).toHaveTextContent(/\$250/);
    expect(screen.getByTestId("adaptive-usable-risk-budget")).toHaveTextContent(/50% of loss ceiling/i);
    expect(screen.getByTestId("adaptive-unused-risk-buffer")).toHaveTextContent(/\$250/);
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
    expect(screen.getAllByTestId("adaptive-direction-tabs")).toHaveLength(1);
    expect(screen.getByTestId("adaptive-plan-valid").firstElementChild).toBe(screen.getByTestId("adaptive-direction-tabs"));
    expect(screen.queryByTestId("adaptive-plan-sell")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-copy-adaptive-plan"));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const buyCopy = String(writeText.mock.calls[0]?.[0]);
    expect(buyCopy).toContain("Instrument: XAU/USD");
    expect(buyCopy).toContain("Direction: BUY");
    expect(buyCopy).toMatch(/1\. .+ · .+ lot/);
    expect(buyCopy).toContain("SL:");
    expect(buyCopy).toContain("TP1:");
    expect(buyCopy).toContain("TP2:");
    expect(buyCopy).toContain("Risk context:");
    expect(buyCopy).toContain("This is not an automated order.");
    expect(buyCopy).not.toContain("Not included");
    expect(await screen.findByTestId("adaptive-copy-status")).toHaveTextContent("Copied");

    fireEvent.click(screen.getByTestId("adaptive-direction-sell"));
    const sellPlan = screen.getByTestId("adaptive-plan-sell");
    expect(screen.getByTestId("adaptive-direction-sell")).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByTestId("adaptive-plan-buy")).not.toBeInTheDocument();
    expect(sellPlan.textContent).toMatch(/Conditional scenario · not actionable now/i);
    expect(sellPlan.textContent).toMatch(/One final Stop Loss/i);
    expect(sellPlan.textContent).toMatch(/\$/);
    expect(screen.getByText(/not actionable now.*copying as an entry plan is disabled/i)).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-tp-profit-sell-1")).toHaveTextContent(/Estimated profit.*\+\$/i);
    expect(screen.getByTestId("adaptive-tp-profit-sell-2")).toHaveTextContent(/Estimated profit.*\+\$/i);
    expect((screen.getByTestId("adaptive-risk-details") as HTMLDetailsElement).open).toBe(false);

    expect(screen.getByTestId("button-copy-adaptive-plan")).toBeDisabled();
    fireEvent.click(screen.getByTestId("button-copy-adaptive-plan"));
    expect(writeText).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("adaptive-direction-buy"));
    writeText.mockRejectedValueOnce(new Error("permission denied"));
    fireEvent.click(screen.getByTestId("button-copy-adaptive-plan"));
    expect(await screen.findByTestId("adaptive-copy-status")).toHaveTextContent("Copy failed");
    expect(execCommand).toHaveBeenCalledWith("copy");

    const storedKey = `trade-pilot:adaptive-plan:v24:${ANALYSIS_ID}`;
    await waitFor(() => expect(localStorage.getItem(storedKey)).not.toBeNull());
    expect(JSON.parse(localStorage.getItem(storedKey)!).form.accountTier).toBe("micro");

    fireEvent.click(screen.getByTestId("button-adaptive-account-mini"));
    expect(screen.queryByTestId("adaptive-plan-valid")).not.toBeInTheDocument();
    expect(localStorage.getItem(storedKey)).toBeNull();
  });

  it("uses the analysis's persisted market snapshot without a separate candle request", async () => {
    const { calls } = installFetchMock([
      getAnalysisHandler({ body: { ...ANALYSIS_PAYLOAD, tradePlan: TRADE_PLAN } }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    expect(ANALYSIS_PAYLOAD.marketSnapshot).toMatchObject({
      instrument: "XAU/USD",
      timeframe: "1h",
      capturedAt: expect.any(String),
      sourceFetchedAt: expect.any(String),
      candles: expect.any(Array),
      priceAtAnalysis: 2304,
    });
    expect(await screen.findByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/From this analysis snapshot:/i);
    expect(screen.getByTestId("adaptive-candle-source-time")).toHaveTextContent(/Analysis candle snapshot fetched/i);
    expect(screen.queryByTestId("button-refresh-adaptive-candles")).not.toBeInTheDocument();
    await screen.findByTestId("adaptive-account-rule");
    fireEvent.change(await screen.findByTestId("input-adaptive-available-margin"), { target: { value: "20000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "2000" } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    await waitFor(() => expect(
      screen.queryByTestId("adaptive-plan-valid") ?? screen.queryByTestId("adaptive-plan-invalid"),
    ).not.toBeNull());
    expect(calls.filter((call) => call.url.includes("/api/historical/candles") && call.url.includes("purpose=adaptive-layering"))).toHaveLength(0);
  });

  it("calculates a legacy analysis from saved Standard Plan levels without claiming candle-derived swings", async () => {
    const { calls } = installFetchMock([
      getAnalysisHandler({ body: { ...ANALYSIS_PAYLOAD, marketSnapshot: null, tradePlan: TRADE_PLAN } }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);

    expect(await screen.findByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/Using saved Standard Plan levels/i);
    expect(screen.getByTestId("adaptive-snapshot-warning")).toHaveTextContent(/cannot confirm candle-based swings or volatility/i);
    await screen.findByTestId("adaptive-account-rule");
    fireEvent.change(await screen.findByTestId("input-adaptive-available-margin"), { target: { value: "20000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "2000" } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    await waitFor(() => expect(
      screen.queryByTestId("adaptive-plan-valid") ?? screen.queryByTestId("adaptive-plan-invalid"),
    ).not.toBeNull());
    fireEvent.click(screen.getByTestId("adaptive-direction-buy"));
    expect(screen.getByTestId("adaptive-plan-buy")).toHaveTextContent(/2,300/);
    fireEvent.click(screen.getByTestId("adaptive-insight-button-volatility"));
    expect(screen.getByTestId("adaptive-timeframe-volatility")).toHaveTextContent(/Comparable candle data is unavailable/i);
    expect(calls.filter((call) => call.url.includes("/api/historical/candles") && call.url.includes("purpose=adaptive-layering"))).toHaveLength(0);
  });

  it("requires a new analysis after expiry without requesting a candle feed", async () => {
    const { calls } = installFetchMock([standardRulesHandler()]);
    const { Wrapper } = makeWrapper();
    const key = `trade-pilot:adaptive-plan:v24:${ANALYSIS_ID}`;
    localStorage.setItem(key, JSON.stringify({ recommendation: { valid: true } }));
    render(
      <Wrapper>
        <AdaptivePositionPlan
          analysisId={ANALYSIS_ID}
          instrument="XAU/USD"
          tradePlan={TRADE_PLAN as Parameters<typeof AdaptivePositionPlan>[0]["tradePlan"]}
          context={{ timeframe: "1h", validUntil: new Date(NOW - 60_000).toISOString() }}
          lang="en"
          copy={en.analysis_detail}
        />
      </Wrapper>,
    );
    expect(await screen.findByTestId("adaptive-analysis-expired")).toHaveTextContent(/run a new analysis/i);
    expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeDisabled();
    expect(screen.queryByTestId("button-refresh-adaptive-candles")).not.toBeInTheDocument();
    expect(localStorage.getItem(key)).toBeNull();
    expect(calls.filter((call) => call.url.includes("/api/historical/candles") && call.url.includes("purpose=adaptive-layering"))).toHaveLength(0);
  });

  it("shows one conditional scenario at a time when the main analysis says Neutral/Wait", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradingBias: "neutral",
          marketCondition: "ranging",
          tradePlan: TRADE_PLAN,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(), standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    const view = render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    fireEvent.change(await screen.findByTestId("input-adaptive-available-margin"), { target: { value: "20000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "2000" } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    expect(screen.getByTestId("adaptive-plan-invalid")).toHaveTextContent(/Entry direction is unconfirmed/i);
    const reviewExplanation = screen.getByTestId("adaptive-scenarios-review-explanation");
    expect(reviewExplanation).toBeInTheDocument();
    expect(reviewExplanation.querySelector("summary")).not.toBeNull();
    expect(reviewExplanation).not.toHaveAttribute("open");
    expect(reviewExplanation).toHaveTextContent(/not an instruction to enter/i);
    expect(screen.getByTestId("adaptive-direction-buy")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("adaptive-review-side-buy")).toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-review-side-sell")).not.toBeInTheDocument();
    const alternativeButton = screen.getByTestId("adaptive-insight-button-alternative");
    expect(alternativeButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("adaptive-alternative")).not.toBeInTheDocument();
    fireEvent.click(alternativeButton);
    expect(screen.getByTestId("adaptive-alternative")).toHaveTextContent(/Alternative/i);
    fireEvent.click(screen.getByTestId("adaptive-insight-button-buy"));
    expect(screen.queryByTestId("adaptive-alternative")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-side-status-buy")).toHaveTextContent(/BUY/i);
    expect(screen.queryByTestId("adaptive-side-status-sell")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-review-side-buy")).toHaveTextContent(/Conditional scenario/i);
    expect(screen.queryByTestId("adaptive-review-side-sell")).not.toBeInTheDocument();
    for (const side of ["buy", "sell"] as const) {
      fireEvent.click(screen.getByTestId(`adaptive-direction-${side}`));
      const review = screen.getByTestId(`adaptive-review-side-${side}`);
      expect(screen.queryByTestId(`adaptive-review-side-${side === "buy" ? "sell" : "buy"}`)).not.toBeInTheDocument();
      expect(within(review).getByTestId("adaptive-plan-snapshot")).toHaveTextContent(/Answer at a glance/i);
      expect(within(review).getByTestId("adaptive-plan-snapshot")).toHaveTextContent(/Reference numbers only/i);
      expect(within(review).getByTestId("adaptive-plan-snapshot")).toHaveTextContent(/Entry point/i);
      expect(within(review).getByTestId("adaptive-plan-snapshot")).toHaveTextContent(/One final Stop Loss/i);
      expect(within(review).getByTestId("adaptive-usable-risk-budget")).toHaveTextContent(/\$1,000/);
      expect(within(review).getByTestId("adaptive-unused-risk-buffer")).toHaveTextContent(/\$1,000/);
      expect(within(review).getByTestId(`adaptive-tp-profit-${side}-1`)).toHaveTextContent(/Estimated profit/i);
      expect(within(review).getByTestId(`adaptive-tp-profit-${side}-2`)).toHaveTextContent(/Estimated profit/i);
    }
    expect(screen.queryByTestId("adaptive-plan-valid")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-copy-adaptive-plan")).not.toBeInTheDocument();
    view.unmount();
    const restored = makeWrapper();
    render(<restored.Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></restored.Wrapper>);
    await waitFor(() => expect(screen.getByTestId("adaptive-review-side-buy")).toBeInTheDocument());
    expect(screen.getAllByTestId("adaptive-plan-snapshot")).toHaveLength(1);
    expect(screen.getByTestId("adaptive-direction-buy")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("adaptive-review-side-buy")).toHaveTextContent(/Reference numbers only/i);
    expect(screen.queryByTestId("adaptive-review-side-sell")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-copy-adaptive-plan")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("adaptive-direction-sell"));
    expect(screen.getByTestId("adaptive-review-side-sell")).toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-review-side-buy")).not.toBeInTheDocument();
  });

  it.each([
    { preferredSide: "sell", initialSide: "sell" },
    { preferredSide: "wait", initialSide: "buy" },
  ])("defaults to $initialSide for a neutral analysis with saved $preferredSide preference", async ({ preferredSide, initialSide }) => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradingBias: "neutral",
          marketCondition: "ranging",
          tradePlan: { ...TRADE_PLAN, preferredSide },
        },
      }),
      feedbackHandler(), standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    fireEvent.change(await screen.findByTestId("input-adaptive-available-margin"), { target: { value: "20000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "2000" } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(screen.getByTestId(`adaptive-direction-${initialSide}`)).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId(`adaptive-review-side-${initialSide}`)).toHaveTextContent(/Conditional scenario/i);
    expect(screen.queryByTestId(`adaptive-review-side-${initialSide === "buy" ? "sell" : "buy"}`)).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-plan-invalid")).toHaveTextContent(/Entry direction is unconfirmed/i);
  });

  it("does not invent figures for an uncalculable side alongside a conditional plan", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradingBias: "neutral",
          marketCondition: "ranging",
          tradePlan: { ...TRADE_PLAN, sell: { ...TRADE_PLAN.sell, stopLoss: "2,290.00" } },
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(), standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    fireEvent.change(await screen.findByTestId("input-adaptive-available-margin"), { target: { value: "20000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "2000" } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    fireEvent.click(screen.getByTestId("adaptive-direction-buy"));
    expect(within(screen.getByTestId("adaptive-review-side-buy")).getByTestId("adaptive-plan-snapshot")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("adaptive-direction-sell"));
    expect(screen.getByTestId("adaptive-plan-snapshot-unavailable-sell")).toHaveTextContent(/No safe figures can be calculated/i);
    expect(screen.queryByTestId("adaptive-review-side-buy")).not.toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-plan-sell")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-copy-adaptive-plan")).not.toBeInTheDocument();
  });

  it("keeps calculations tied to the saved snapshot rather than a later clock or feed", async () => {
    const { calls } = installFetchMock([
      getAnalysisHandler({ body: { ...ANALYSIS_PAYLOAD, tradePlan: TRADE_PLAN, fundamentalContext: { newsItems: [], calendarEvents: [] } } }),
      feedbackHandler(), standardRulesHandler(),
    ]);
    const first = makeWrapper();
    const view = render(<first.Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></first.Wrapper>);
    fireEvent.change(await screen.findByTestId("input-adaptive-available-margin"), { target: { value: "20000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "2000" } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(screen.getByTestId("adaptive-plan-valid")).toBeInTheDocument();
    const key = `trade-pilot:adaptive-plan:v24:${ANALYSIS_ID}`;
    expect(localStorage.getItem(key)).not.toBeNull();

    view.unmount();
    vi.spyOn(Date, "now").mockReturnValue(NOW + 60 * 60_000);
    const second = makeWrapper();
    render(<second.Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></second.Wrapper>);
    expect(await screen.findByTestId("adaptive-plan-valid")).toBeInTheDocument();
    expect(screen.getByTestId("input-adaptive-available-margin")).toHaveValue(20000);
    expect(localStorage.getItem(key)).not.toBeNull();
    expect(calls.filter((call) => call.url.includes("/api/historical/candles") && call.url.includes("purpose=adaptive-layering"))).toHaveLength(0);
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
    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/From this analysis snapshot:/i));

    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/Mini: a minimum 0.1 lot requires \$100 margin/i);
    expect(screen.getByTestId("adaptive-account-rule")).toHaveTextContent(/contract size is 10 troy ounce/i);

    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    expect(await screen.findByTestId("adaptive-plan-valid")).toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-plan-invalid")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-plan-buy")).toHaveTextContent(/0\.[1-9] lot/i);
    expect(screen.getByTestId("adaptive-plan-buy")).toHaveTextContent(/Weighted average entry/i);
    const summary = screen.getByTestId("adaptive-snapshot-positions-buy");
    const positions = within(summary).getAllByTestId(/^adaptive-snapshot-position-buy-\d+$/);
    expect(positions.length).toBeGreaterThan(1);
    expect(positions[0]).toHaveTextContent(/Position 1 · Initial entry.*2,301.*lot/i);
    expect(positions[1]).toHaveTextContent(/Position 2 · Additional.*lot/i);
    expect(screen.getByTestId("adaptive-snapshot-all-filled-buy")).toHaveTextContent(
      new RegExp(`If all entries fill: ${positions.length} positions`),
    );
    expect(screen.getByTestId("adaptive-ladder-buy")).not.toHaveAttribute("open");
    expect(screen.getByTestId("adaptive-fill-scenarios-buy")).not.toHaveAttribute("open");
    expect(screen.getByTestId("adaptive-layer-financial-buy-0")).toHaveTextContent(/Margin this position/i);
    expect(screen.getByTestId("adaptive-layer-financial-buy-0")).toHaveTextContent(/Risk this position at final SL/i);
    expect(screen.getByTestId("adaptive-layer-financial-buy-0")).toHaveTextContent(/Funds remaining/i);

    fireEvent.change(maximumLoss, { target: { value: "220" } });
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(await screen.findByTestId("adaptive-rejected-buy")).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-rejected-layer-financial-buy-1")).toHaveTextContent(/Margin this position/i);
    expect(screen.getByTestId("adaptive-rejected-layer-financial-buy-1")).toHaveTextContent(/Funds remaining/i);
    expect(screen.getByTestId("adaptive-conditional-buy-1")).toHaveTextContent(/Conditional financial plan/i);
    expect(screen.getByTestId("adaptive-conditional-buy-1")).toHaveTextContent(/Additional loss budget needed/i);
    expect(screen.queryByTestId("adaptive-next-layer-funds-buy")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-next-layer-blocked-buy")).toHaveTextContent(/not included/i);

    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    fireEvent.change(margin, { target: { value: "330" } });
    fireEvent.change(maximumLoss, { target: { value: "300" } });
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(screen.getByTestId("adaptive-plan-valid")).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-next-layer-funds-buy")).toHaveTextContent(
      /Position 2.*lot: about \$[\d,.]+ more free broker funds needed to review/i,
    );
    expect(screen.getByTestId("adaptive-next-layer-buy")).toHaveTextContent(
      /not a TradePilot analysis-credit top-up/i,
    );
    expect(screen.getByTestId("adaptive-snapshot-all-filled-buy")).toHaveTextContent(/1 position · 0\.1 lot/i);
    fireEvent.click(screen.getByTestId("button-language-toggle"));
    expect(screen.getByTestId("adaptive-snapshot-positions-buy")).toHaveTextContent(/Harga entry & lot tiap posisi/i);
    expect(screen.getByTestId("adaptive-snapshot-all-filled-buy")).toHaveTextContent(/Jika semua entry terisi: 1 posisi · 0,1 lot/i);
    expect(screen.getByTestId("adaptive-next-layer-funds-buy")).toHaveTextContent(/perkiraan perlu tambahan dana bebas broker/i);
    fireEvent.change(margin, { target: { value: "450" } });
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(screen.getByTestId("adaptive-snapshot-position-buy-1")).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-snapshot-all-filled-buy")).toHaveTextContent(/2 posisi/i);
  });

  it.each([
    { tier: "micro", funds: "50", loss: "40", nextPosition: 3, nextLot: "0.01", expectedExtra: 6, riskBlockedLoss: "15" },
    { tier: "regular", funds: "4000", loss: "3000", nextPosition: 2, nextLot: "1", expectedExtra: 100, riskBlockedLoss: "2000" },
    { tier: "micro", funds: "50.006", loss: "40", nextPosition: 3, nextLot: "0.01", expectedExtra: 6, riskBlockedLoss: "15" },
    { tier: "regular", funds: "4000.006", loss: "3000", nextPosition: 2, nextLot: "1", expectedExtra: 100, riskBlockedLoss: "2000" },
  ] as const)(
    "only shows the $tier broker-funds alternative with $funds available while funds are the sole next-layer blocker",
    async ({ tier, funds, loss, nextPosition, nextLot, expectedExtra, riskBlockedLoss }) => {
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
      render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
      const margin = await screen.findByTestId("input-adaptive-available-margin");
      const maximumLoss = screen.getByTestId("input-adaptive-maximum-loss");
      await screen.findByTestId("adaptive-account-rule");
      fireEvent.click(screen.getByTestId(`button-adaptive-account-${tier}`));
      fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
      fireEvent.change(margin, { target: { value: funds } });
      fireEvent.change(maximumLoss, { target: { value: loss } });
      await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/From this analysis snapshot:/i));
      fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

      expect(await screen.findByTestId("adaptive-plan-valid")).toBeInTheDocument();
      const nextLayerText = screen.getByTestId("adaptive-next-layer-funds-buy").textContent ?? "";
      expect(nextLayerText).toMatch(
        new RegExp(`Position ${nextPosition}.*${nextLot.replace(".", "\\.")} lot: about \\$[\\d,]+ more free broker funds needed to review`),
      );
      const extra = Number(nextLayerText.match(/about \$([\d,]+) more free broker funds/)?.[1].replaceAll(",", ""));
      expect(extra).toBe(expectedExtra);
      expect(screen.getByTestId(`adaptive-conditional-buy-${nextPosition - 1}`)).toHaveTextContent(`$${extra}`);
      expect(screen.getByTestId("adaptive-next-layer-buy")).toHaveTextContent(/not a TradePilot analysis-credit top-up/i);
      expect(within(screen.getByTestId("adaptive-snapshot-positions-buy")).getAllByTestId(/^adaptive-snapshot-position-buy-\d+$/))
        .toHaveLength(nextPosition - 1);

      fireEvent.change(maximumLoss, { target: { value: riskBlockedLoss } });
      fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
      expect(screen.getByTestId("adaptive-plan-valid")).toBeInTheDocument();
      expect(screen.queryByTestId("adaptive-next-layer-funds-buy")).not.toBeInTheDocument();
      expect(screen.getByTestId("adaptive-next-layer-blocked-buy")).toHaveTextContent(/loss limit/i);

      fireEvent.change(maximumLoss, { target: { value: loss } });
      fireEvent.change(margin, { target: { value: String(Number(funds) + extra) } });
      fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
      expect(screen.getByTestId(`adaptive-snapshot-position-buy-${nextPosition - 1}`)).toBeInTheDocument();
      expect(within(screen.getByTestId("adaptive-snapshot-positions-buy")).getAllByTestId(/^adaptive-snapshot-position-buy-\d+$/))
        .toHaveLength(nextPosition);
    },
  );

  it.each([
    { tier: "micro", funds: "50", loss: "40", nextPosition: 3, nextLot: "0.01", riskBlockedLoss: "15" },
    { tier: "regular", funds: "4000", loss: "3000", nextPosition: 2, nextLot: "1", riskBlockedLoss: "2000" },
  ] as const)(
    "keeps the $tier Sell funding alternative tied to Sell checkpoints",
    async ({ tier, funds, loss, nextPosition, nextLot, riskBlockedLoss }) => {
      installFetchMock([
        getAnalysisHandler({
          body: {
            ...ANALYSIS_PAYLOAD,
            marketSnapshot: {
              ...SAVED_MARKET_SNAPSHOT,
              candles: [2301, 2302, 2304, 2302, 2301, 2302, 2306, 2302, 2301].map((high, index) => ({
                date: new Date(NOW - (9 - index) * 3_600_000).toISOString(),
                open: 2301, high, low: 2300, close: 2301,
              })),
            },
            tradePlan: { ...TRADE_PLAN, preferredSide: "sell" },
            marketCondition: "trending_down",
            tradingBias: "bearish_strong",
            riskLevel: "low",
            confidenceMin: 65,
            confidenceMax: 78,
            techBuyCount: 4,
            techSellCount: 14,
            fundamentalContext: { newsItems: [], calendarEvents: [] },
          },
        }),
        feedbackHandler(),
        standardRulesHandler(),
      ]);
      const { Wrapper } = makeWrapper();
      render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
      const margin = await screen.findByTestId("input-adaptive-available-margin");
      const maximumLoss = screen.getByTestId("input-adaptive-maximum-loss");
      fireEvent.click(screen.getByTestId(`button-adaptive-account-${tier}`));
      fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
      fireEvent.change(margin, { target: { value: funds } });
      fireEvent.change(maximumLoss, { target: { value: loss } });
      await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/From this analysis snapshot:/i));
      fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

      expect(await screen.findByTestId("adaptive-plan-valid")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("adaptive-direction-sell"));
      expect(screen.getByTestId("adaptive-plan-sell")).toBeInTheDocument();
      expect(screen.queryByTestId("adaptive-plan-buy")).not.toBeInTheDocument();
      const nextLayerText = screen.getByTestId("adaptive-next-layer-funds-sell").textContent ?? "";
      const match = nextLayerText.match(
        new RegExp(`Position ${nextPosition} · ([\\d,.]+) · ${nextLot.replace(".", "\\.")} lot: about \\$([\\d,.]+) more free broker funds needed to review`),
      );
      expect(match).not.toBeNull();
      const nextPrice = Number(match![1].replaceAll(",", ""));
      const extra = Number(match![2].replaceAll(",", ""));
      expect(nextPrice).toBeGreaterThan(2301);
      expect(extra).toBeGreaterThan(0);
      expect(screen.getByTestId(`adaptive-conditional-sell-${nextPosition - 1}`)).toHaveTextContent(`$${extra}`);
      expect(screen.getByTestId("adaptive-next-layer-sell")).toHaveTextContent(/not a TradePilot analysis-credit top-up/i);

      fireEvent.change(maximumLoss, { target: { value: riskBlockedLoss } });
      fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
      expect(screen.queryByTestId("adaptive-next-layer-funds-sell")).not.toBeInTheDocument();
      expect(screen.getByTestId("adaptive-next-layer-blocked-sell")).toHaveTextContent(/loss limit/i);

      fireEvent.change(maximumLoss, { target: { value: loss } });
      fireEvent.change(margin, { target: { value: String(Number(funds) + extra) } });
      fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
      expect(screen.getByTestId(`adaptive-snapshot-position-sell-${nextPosition - 1}`)).toHaveTextContent(
        new RegExp(`${match![1]} · ${nextLot.replace(".", "\\.")} lot`),
      );
      expect(within(screen.getByTestId("adaptive-snapshot-positions-sell")).getAllByTestId(/^adaptive-snapshot-position-sell-\d+$/))
        .toHaveLength(nextPosition);
      fireEvent.click(screen.getByTestId("adaptive-direction-buy"));
      expect(screen.getByTestId("button-copy-adaptive-plan")).toBeDisabled();
      expect(screen.queryByTestId("adaptive-plan-sell")).not.toBeInTheDocument();
      expect(screen.queryByTestId("adaptive-next-layer-funds-buy")).not.toBeInTheDocument();
    },
  );

  it.each([
    { tier: "micro", funds: "50", loss: "40", side: "buy" },
    { tier: "regular", funds: "4000", loss: "3000", side: "buy" },
    { tier: "micro", funds: "50", loss: "40", side: "sell" },
    { tier: "regular", funds: "4000", loss: "3000", side: "sell" },
  ] as const)("does not suggest more broker funds for an unaligned $tier $side analysis", async ({ tier, funds, loss, side }) => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: { ...TRADE_PLAN, preferredSide: side },
          marketCondition: side === "sell" ? "trending_down" : "trending_up",
          tradingBias: side === "sell" ? "bearish_strong" : "bullish_strong",
          techBuyCount: side === "sell" ? 4 : 14,
          techSellCount: side === "sell" ? 14 : 4,
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    const margin = await screen.findByTestId("input-adaptive-available-margin");
    fireEvent.click(screen.getByTestId(`button-adaptive-account-${tier}`));
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    fireEvent.change(margin, { target: { value: funds } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: loss } });
    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/From this analysis snapshot:/i));
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    fireEvent.click(screen.getByTestId(`adaptive-direction-${side}`));
    expect(screen.getByTestId(`adaptive-review-side-${side}`)).toHaveTextContent(/Conditional scenario/i);
    expect(screen.queryByTestId("adaptive-blocked-dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId(`adaptive-next-layer-funds-${side}`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`adaptive-next-layer-${side}`)).not.toBeInTheDocument();
  });

  it("shows a limited $200 Mini Buy against Moderate's $150 target without recommending Sell or another AI credit", async () => {
    const { calls } = installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: {
            ...TRADE_PLAN,
            buy: { ...TRADE_PLAN.buy, stopLoss: "2,281.00" },
            sell: { ...TRADE_PLAN.sell, stopLoss: "2,336.00" },
          },
          riskLevel: "low",
          tradingBias: "bullish_strong",
          confidenceMin: 65,
          confidenceMax: 78,
          techBuyCount: 14,
          techSellCount: 4,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    const margin = await screen.findByTestId("input-adaptive-available-margin");
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    expect(screen.getByTestId("button-adaptive-risk-style-balanced")).toHaveTextContent("Moderate");
    fireEvent.change(margin, { target: { value: "1000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "200" } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    expect(screen.getByTestId("adaptive-selected-action")).toHaveTextContent("WAIT");
    expect(screen.getByTestId("adaptive-selected-limited")).toHaveTextContent("Limited option only");
    expect(screen.getByTestId("adaptive-selected-decision")).toHaveTextContent("$150");
    expect(screen.getByTestId("adaptive-selected-decision")).toHaveTextContent("$200");
    expect(screen.getByTestId("adaptive-selected-decision")).toHaveAccessibleName("Adaptive decision");
    expect(screen.queryByTestId("adaptive-blocked-dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Account tier comparison")).not.toBeInTheDocument();
    expect(screen.queryByText(/hypothetical only/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-compare-tier-micro")).not.toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-compare-tier-mini")).not.toBeInTheDocument();
    expect(screen.queryByTestId("adaptive-compare-tier-regular")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-insights")).not.toHaveTextContent("run a fresh analysis");

    fireEvent.click(screen.getByTestId("button-adaptive-account-micro"));
    expect(screen.queryByTestId("adaptive-selected-decision")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(screen.getByTestId("adaptive-selected-action")).toHaveTextContent(/buy/i);
    expect(screen.queryByTestId("adaptive-compare-tier-mini")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-adaptive-account-mini"));
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(screen.getByTestId("adaptive-selected-action")).toHaveTextContent("WAIT");
    fireEvent.click(screen.getByTestId("button-language-toggle"));
    expect(screen.getByTestId("adaptive-selected-decision")).toHaveAccessibleName("Keputusan Adaptive");
    expect(screen.getByTestId("adaptive-selected-action")).toHaveTextContent("TUNGGU");
    expect(screen.queryByText("Perbandingan tier akun")).not.toBeInTheDocument();
    expect(calls.filter((call) => (call.init?.method ?? "GET") === "POST" && /\/api\/analyses(?:\?|$)/.test(call.url))).toHaveLength(0);
  });

  it.each([
    { name: "funds only", tier: "mini", funds: "250", loss: "200", risk: false, funding: true, message: /available broker funds/i },
    { name: "hard risk only", tier: "regular", funds: "5000", loss: "200", risk: true, funding: false, message: /minimum lot exceeds your loss limit/i },
    { name: "both limits", tier: "regular", funds: "1000", loss: "200", risk: true, funding: true, message: /minimum lot exceeds your loss limit and needs more broker funds/i },
  ] as const)("explains $name for the selected account without changing inputs or charging AI", async ({ tier, funds, loss, risk, funding, message }) => {
    const { calls } = installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: {
            ...TRADE_PLAN,
            buy: { ...TRADE_PLAN.buy, stopLoss: "2,281.00" },
            sell: { ...TRADE_PLAN.sell, stopLoss: "2,336.00" },
          },
          riskLevel: "low",
          tradingBias: "bullish_strong",
          confidenceMin: 65,
          confidenceMax: 78,
          techBuyCount: 14,
          techSellCount: 4,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
      standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    const margin = await screen.findByTestId("input-adaptive-available-margin");
    fireEvent.click(screen.getByTestId(`button-adaptive-account-${tier}`));
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    fireEvent.change(margin, { target: { value: funds } });
    const maximumLoss = screen.getByTestId("input-adaptive-maximum-loss");
    fireEvent.change(maximumLoss, { target: { value: loss } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    const dialog = await screen.findByTestId("adaptive-blocked-dialog");
    expect(dialog).toHaveAccessibleName("Why can't I enter?");
    expect(dialog).toHaveTextContent(message);
    expect(screen.getByTestId("adaptive-selected-action")).toHaveTextContent("SKIP");
    expect(within(dialog).queryByTestId("adaptive-blocked-edit-loss") !== null).toBe(risk);
    expect(within(dialog).queryByTestId("adaptive-blocked-edit-funds") !== null).toBe(funding);
    if (risk) {
      expect(within(dialog).getByTestId("adaptive-blocked-figures")).toHaveTextContent("Over loss limit");
      expect(within(dialog).getByTestId("adaptive-blocked-figures")).toHaveTextContent("$2,000");
    }
    if (funding) {
      expect(within(dialog).getByTestId("adaptive-blocked-figures")).toHaveTextContent("Funds short");
      expect(within(dialog).getByTestId("adaptive-blocked-figures")).toHaveTextContent(`$${Number(funds).toLocaleString("en-US")}`);
    }
    const field = risk ? maximumLoss : margin;
    fireEvent.click(within(dialog).getByTestId(risk ? "adaptive-blocked-edit-loss" : "adaptive-blocked-edit-funds"));
    await waitFor(() => expect(field).toHaveFocus());
    expect(margin).toHaveValue(Number(funds));
    expect(maximumLoss).toHaveValue(Number(loss));
    expect(screen.queryByTestId("adaptive-blocked-dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-selected-decision")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-adaptive-account-micro"));
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(screen.getByTestId("adaptive-selected-action")).toHaveTextContent(/buy/i);
    expect(screen.queryByTestId("adaptive-blocked-dialog")).not.toBeInTheDocument();
    expect(calls.filter((call) => (call.init?.method ?? "GET") === "POST" && /\/api\/analyses(?:\?|$)/.test(call.url))).toHaveLength(0);
  });

  it("opens the financial explanation only on manual calculation, not restoration or language change", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: { ...TRADE_PLAN, buy: { ...TRADE_PLAN.buy, stopLoss: "2,281.00" } },
          riskLevel: "low", tradingBias: "bullish_strong",
          confidenceMin: 65, confidenceMax: 78, techBuyCount: 14, techSellCount: 4,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(), standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    const view = render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    const margin = await screen.findByTestId("input-adaptive-available-margin");
    fireEvent.change(margin, { target: { value: "250" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "200" } });
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    const dialog = await screen.findByTestId("adaptive-blocked-dialog");
    fireEvent.click(within(dialog).getByTestId("adaptive-blocked-dismiss"));
    expect(screen.queryByTestId("adaptive-blocked-dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-language-toggle"));
    expect(screen.queryByTestId("adaptive-blocked-dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-selected-decision")).toBeInTheDocument();
    view.unmount();
    const { Wrapper: NewWrapper } = makeWrapper();
    render(<NewWrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></NewWrapper>);
    await screen.findByTestId("adaptive-selected-decision");
    expect(screen.queryByTestId("adaptive-blocked-dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));
    expect(await screen.findByTestId("adaptive-blocked-dialog")).toHaveAccessibleName("Kenapa belum bisa entry?");
    expect(screen.getByTestId("adaptive-blocked-dialog")).toHaveTextContent(/dana broker/i);
  });

  it("ignores malformed saved adaptive-plan data instead of crashing the analysis page", async () => {
    localStorage.setItem(
      `trade-pilot:adaptive-plan:v24:${ANALYSIS_ID}`,
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
    expect(localStorage.getItem(`trade-pilot:adaptive-plan:v24:${ANALYSIS_ID}`)).toBeNull();
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
    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/From this analysis snapshot:/i));
    fireEvent.change(margin, { target: { value: "100000" } });
    fireEvent.change(screen.getByTestId("input-adaptive-maximum-loss"), { target: { value: "500" } });
    fireEvent.click(screen.getByTestId("button-adaptive-risk-style-balanced"));
    await waitFor(() => expect(screen.getByTestId("button-adaptive-risk-style-balanced")).toHaveAttribute("aria-pressed", "true"));
    fireEvent.click(screen.getByTestId("button-calculate-adaptive-plan"));

    expect(await screen.findByTestId("adaptive-plan-valid")).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-risk-style-active")).toHaveTextContent(/Moderate style/i);
    expect(screen.queryByTestId("adaptive-lot-profile-active")).not.toBeInTheDocument();
    const key = `trade-pilot:adaptive-plan:v24:${ANALYSIS_ID}`;
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

    await waitFor(() => expect(screen.getByTestId("adaptive-chart-candidate-status")).toHaveTextContent(/From this analysis snapshot:/i));
    await waitFor(() => expect(screen.getByTestId("adaptive-direction-sell")).toHaveAttribute("aria-pressed", "true"));
    expect(screen.getByTestId("button-adaptive-risk-style-balanced")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("adaptive-risk-style-active")).toHaveTextContent(/Moderate style/i);
    expect(screen.queryByTestId("adaptive-lot-profile-active")).not.toBeInTheDocument();
    expect(screen.getByTestId("adaptive-plan-sell")).toBeInTheDocument();
    expect(screen.getByTestId("adaptive-snapshot-positions-sell")).toHaveTextContent(/Position 1 · Initial entry.*lot/i);
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
    expect(screen.getByTestId("button-refresh-adaptive-rules")).toBeEnabled();
    expect(screen.queryByTestId("adaptive-plan-reasoning")).not.toBeInTheDocument();
  });

  it("recovers unavailable trading rules without starting a new paid analysis", async () => {
    let rulesRequests = 0;
    const rules: FetchHandler = (url) => {
      if (!url.includes("/api/trading-rules/standard")) return null;
      rulesRequests++;
      return jsonResponse(rulesRequests === 1 ? { error: "rules unavailable" } : STANDARD_RULES_PAYLOAD,
        rulesRequests === 1 ? 503 : 200);
    };
    const { calls } = installFetchMock([
      getAnalysisHandler({ body: { ...ANALYSIS_PAYLOAD, tradePlan: TRADE_PLAN } }),
      rules, standardRulesHandler(),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    fireEvent.click(await screen.findByTestId("button-refresh-adaptive-rules"));
    await waitFor(() => expect(screen.getByTestId("button-calculate-adaptive-plan")).toBeEnabled());
    expect(rulesRequests).toBe(2);
    expect(calls.filter((call) => (call.init?.method ?? "GET") === "POST" && /\/api\/analyses(?:\?|$)/.test(call.url))).toHaveLength(0);
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

  it.each([
    ["HSI", "18,500–18,510", "18,450", "18,560", /contract size is 5 USD\/point/i],
    ["NIKKEI", "38,500–38,510", "38,450", "38,560", /contract size is 5 USD\/point/i],
  ])("mounts Adaptive for canonical %s with its index rule", async (instrument, entryZone, buyStop, sellStop, ruleText) => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          instrument,
          tradePlan: {
            ...TRADE_PLAN,
            buy: { ...TRADE_PLAN.buy, entryZone, stopLoss: buyStop },
            sell: { ...TRADE_PLAN.sell, entryZone, stopLoss: sellStop },
          },
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
    expect(await screen.findByTestId("input-adaptive-available-margin")).toBeInTheDocument();
    expect(await screen.findByTestId("adaptive-account-rule")).toHaveTextContent(ruleText);
    expect(screen.getByTestId("adaptive-contract-micro")).toHaveTextContent(/0.5 USD\/point/i);
    expect(screen.getByTestId("adaptive-contract-mini")).toHaveTextContent(/5 USD\/point/i);
    expect(screen.getByTestId("adaptive-contract-regular")).toHaveTextContent(/5 USD\/point/i);
    expect(screen.getByTestId("adaptive-contract-table")).toHaveTextContent(/USD 0.50\/point for indices.*not an official broker rule/i);
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
  it.each([
    ["id", "Berita Terkini", "Kalender Ekonomi", "Daftar tersimpan"],
    ["en", "Recent News", "Economic Calendar", "Saved list"],
  ])("provides %s-language keyboard-accessible controls and honest saved status", async (lang, newsTitle, calendarTitle, status) => {
    localStorage.setItem("app_lang", lang);
    installFetchMock([getAnalysisHandler({ body: {
      ...ANALYSIS_PAYLOAD,
      fundamentalContext: { newsItems: [], calendarEvents: [{
        date: "2026-04-30", time: "12:00", currency: "USD", event: "FOMC rate decision",
        impact: "★★★", actual: null, forecast: null, previous: null,
      }] },
    } }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} /></Wrapper>);
    const card = await screen.findByTestId("card-fundamental-context");
    expect(card).toHaveTextContent(status);
    const news = screen.getByTestId("fundamental-news-toggle");
    const calendar = screen.getByTestId("fundamental-calendar-toggle");
    expect(news.tagName).toBe("BUTTON");
    expect(news).toHaveAttribute("type", "button");
    expect(news).toHaveAccessibleName(`${newsTitle} (0)`);
    expect(calendar).toHaveAccessibleName(`${calendarTitle} (1)`);
    expect(screen.getByTestId("fundamental-section-buttons")).toHaveClass("grid-cols-2");
    expect(screen.queryByTestId("fundamental-news-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fundamental-calendar-list")).not.toBeInTheDocument();
    fireEvent.click(news);
    expect(screen.getByTestId("fundamental-news-list")).toHaveTextContent(
      lang === "id" ? "Belum ada berita relevan" : "No relevant news",
    );
    expect(calendar).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(calendar);
    expect(screen.getByTestId("fundamental-calendar-list")).toHaveTextContent("FOMC rate decision");
    expect(screen.queryByTestId("fundamental-news-list")).not.toBeInTheDocument();
    expect(news).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(calendar);
    expect(screen.queryByTestId("fundamental-calendar-list")).not.toBeInTheDocument();
  });

  it("renders natural trader terminology for Indonesian calendar and trade-plan copy", async () => {
    localStorage.setItem("app_lang", "id");
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          tradePlan: TRADE_PLAN,
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
    fireEvent.click(screen.getByTestId("fundamental-news-toggle"));
    expect(card.textContent).toMatch(/Gold rallies as Fed signals pause/);
    fireEvent.click(screen.getByTestId("fundamental-calendar-toggle"));
    expect(card.textContent).not.toMatch(/Gold rallies as Fed signals pause/);
    expect(card.textContent).toMatch(/FOMC rate decision/);
    expect(card).toHaveTextContent(/Forecast/);
    expect(card).toHaveTextContent(/Actual/);
    expect(card).not.toHaveTextContent(/Prakiraan|Aktual/);

    const tradePlan = screen.getByTestId("card-trade-plan");
    expect(tradePlan).toHaveTextContent(/Level Entry, Stop Loss, dan Take Profit/);
    expect(tradePlan).not.toHaveTextContent(/titik masuk|batas berhenti/i);
  });

  it("starts closed, opens panels independently and caps both lists at 5 with safe news links", async () => {
    const newsItems = Array.from({ length: 7 }).map((_, i) => ({
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
    const newsToggle = screen.getByTestId("fundamental-news-toggle");
    const calendarToggle = screen.getByTestId("fundamental-calendar-toggle");
    expect(newsToggle).toHaveAttribute("aria-expanded", "false");
    expect(calendarToggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("fundamental-news-list")).not.toBeInTheDocument();
    expect(card).toHaveTextContent("5 news");
    fireEvent.click(newsToggle);
    expect(newsToggle).toHaveAttribute("aria-expanded", "true");
    expect(calendarToggle).toHaveAttribute("aria-expanded", "false");
    // News link rows are tagged `fundamental-news-link` (the anchor).
    const links = card.querySelectorAll("[data-testid='fundamental-news-link']");
    expect(links.length).toBe(5);
    // Each link must open in a new tab with the noopener noreferrer
    // protection — outbound feed links are upstream-controlled and we
    // never want them tab-napping the user.
    links.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel") ?? "").toMatch(/noopener/);
      expect(a.getAttribute("rel") ?? "").toMatch(/noreferrer/);
    });
    fireEvent.click(calendarToggle);
    expect(screen.queryByTestId("fundamental-news-list")).not.toBeInTheDocument();

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

  it("preserves the saved AI snapshot order and count without replacing cited items", async () => {
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
    expect(card).toHaveTextContent("Yahoo Finance headline 2");
    expect(card).toHaveTextContent("Newsmaker.id headline 4");
    expect(screen.getAllByTestId("fundamental-news-link")).toHaveLength(5);
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
    expect(card).toHaveTextContent("0 news");
    expect(card).toHaveTextContent("not live news");
    // News + calendar list wrappers should NOT render in the empty state.
    expect(
      screen.queryByTestId("fundamental-news-list"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("fundamental-calendar-list"),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("fundamental-news-toggle"));
    expect(screen.getByTestId("fundamental-news-list")).toHaveTextContent("No relevant news");
    fireEvent.click(screen.getByTestId("fundamental-calendar-toggle"));
    expect(screen.getByTestId("fundamental-calendar-list")).toHaveTextContent("No relevant economic events");
    expect(screen.getByTestId("button-refresh-fundamentals")).toBeEnabled();
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

    expect(screen.getByTestId("fundamental-news-toggle")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("fundamental-news-list")).not.toBeInTheDocument();

    fireEvent.click(newsChip as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("fundamental-news-toggle")).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByTestId("fundamental-news-list")).toBeVisible();
      const newsRow = document.getElementById("cite-news-gold-rallies-as-fed-signals-pause");
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

    expect(screen.getByTestId("fundamental-calendar-toggle")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("fundamental-calendar-list")).not.toBeInTheDocument();

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
    fireEvent.click(eventChip as HTMLElement);

    await waitFor(() => {
      expect(screen.getByTestId("fundamental-calendar-toggle")).toHaveAttribute("aria-expanded", "true");
      const target = document.getElementById(expectedSlug);
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
        isTimeframeSwitch: true,
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

  it("opens risk comparison beside timeframe pills and analyzes only after confirmation", async () => {
    const requestBodies: Record<string, unknown>[] = [];
    const { calls } = installFetchMock([
      getAnalysisHandler({}),
      feedbackHandler(),
      (url) => {
        if (!url.includes("/api/risk-map/timeframes")) return null;
        return jsonResponse({
          instrument: "XAU/USD",
          generatedAt: new Date().toISOString(),
          overall: { state: "wait", reasonCode: "mixed_signals" },
          timeframes: [
            {
              timeframe: "1h",
              status: "available",
              riskScore: 20,
              riskCategory: "low",
              reasonCodes: ["trend_aligned"],
              metrics: null,
              dataQuality: "good",
              confidence: "high",
              recommendation: "eligible",
            },
            {
              timeframe: "4h",
              status: "available",
              riskScore: 72,
              riskCategory: "high",
              reasonCodes: ["resistance_near"],
              metrics: null,
              dataQuality: "good",
              confidence: "medium",
              recommendation: "wait",
            },
          ],
        });
      },
      createAnalysisHandler((body) => {
        requestBodies.push(body);
        return jsonResponse({ id: 780 });
      }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("text-instrument");
    expect(calls.filter((call) => call.url.includes("/api/risk-map/timeframes"))).toHaveLength(0);

    fireEvent.click(screen.getByTestId("button-detail-risk-map"));
    expect(await screen.findByTestId("detail-risk-map-dialog")).toBeInTheDocument();
    expect(await screen.findByTestId("detail-risk-map-4h")).toBeInTheDocument();
    expect(requestBodies).toHaveLength(0);

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-risk-analyze-4h"));
      await Promise.resolve();
    });

    await waitFor(() => expect(requestBodies).toHaveLength(1));
    expect(requestBodies[0]).toMatchObject({ instrument: "XAU/USD", timeframe: "4h" });
    expect(screen.queryByTestId("detail-risk-map-dialog")).not.toBeInTheDocument();
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
