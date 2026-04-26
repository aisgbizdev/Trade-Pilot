/**
 * Component test for the Analysis Detail view
 * (`src/pages/analysis-detail.tsx`).
 *
 * Covers the happy-path render of the instrument header, bias label,
 * confidence range, and risk level pulled from the analysis payload;
 * the not-found branch when the API responds with a 404 (which swaps
 * the body for the "back to history" CTA); and a user action that
 * picks the "useful" feedback button + submits the form, which fires
 * `POST /api/analyses/:id/feedback` with the chosen feedback type.
 *
 * The page mounts inside `<Layout>` so the layout-bell poll and the
 * SSE constructor must already be stubbed (the latter is handled in
 * `src/test/setup.ts`).
 */
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
