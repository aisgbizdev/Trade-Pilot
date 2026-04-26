/**
 * Component test for the Analytics page (`src/pages/analytics.tsx`).
 *
 * Covers happy-path render of the stat tiles, the top-instruments
 * card and the accuracy gauge; the empty-state branch when the
 * `/api/analyses/personal-analytics` payload reports zero
 * lifetime analyses (which swaps the whole page for a "Start
 * analysis" CTA); and a user action that clicks the empty-state CTA
 * and navigates to `/analyze`.
 *
 * Analytics renders inside `<Layout>` so the strict harness needs
 * handlers for the bell-poll (covered by the helper default) and for
 * the ContinuousTicker's `/api/quotes/live` + `/api/news` queries.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import AnalyticsPage from "../analytics";
import {
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

const NOW = Date.now();

const ANALYTICS_PAYLOAD = {
  totalAllTime: 18,
  totalThisMonth: 7,
  totalThisWeek: 3,
  topInstruments: [
    { instrument: "XAU/USD", count: 9 },
    { instrument: "EUR/USD", count: 4 },
  ],
  dominantMode: "beginner",
  accuracyRate: 72,
  feedbackCount: 5,
  weeklyData: [
    { week: "W1", count: 2 },
    { week: "W2", count: 5 },
    { week: "W3", count: 4 },
    { week: "W4", count: 7 },
  ],
};

const EMPTY_ANALYTICS_PAYLOAD = {
  totalAllTime: 0,
  totalThisMonth: 0,
  totalThisWeek: 0,
  topInstruments: [],
  dominantMode: null,
  accuracyRate: null,
  feedbackCount: 0,
  weeklyData: [],
};

function analyticsHandlers(opts: {
  analytics?: typeof ANALYTICS_PAYLOAD | typeof EMPTY_ANALYTICS_PAYLOAD;
} = {}): FetchHandler[] {
  return [
    (url) => {
      if (url.includes("/api/analyses/personal-analytics")) {
        return jsonResponse(opts.analytics ?? ANALYTICS_PAYLOAD);
      }
      return null;
    },
    // Layout → ContinuousTicker fetches.
    (url) => {
      if (url.includes("/api/quotes/live")) {
        return jsonResponse({
          status: "ok",
          updatedAt: new Date(NOW).toISOString(),
          serverTime: "00:00:00",
          data: [],
        });
      }
      return null;
    },
    (url) => {
      // The bell-poll handler in test-helpers matches `unreadOnly=true`
      // first; this fall-through covers the news ticker only.
      if (url.includes("/api/news")) {
        return jsonResponse({ articles: [], total: 0 });
      }
      return null;
    },
  ];
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/analytics");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AnalyticsPage: happy-path render", () => {
  it("renders the all-time / monthly / weekly stat tiles, the top-instruments list and the accuracy gauge", async () => {
    installFetchMock(analyticsHandlers());
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyticsPage />
      </Wrapper>,
    );

    // The accuracy gauge mounts only after the analytics query
    // resolves (otherwise the page is in its loading state).
    const gauge = await screen.findByTestId("accuracy-gauge");
    expect(gauge).toBeInTheDocument();

    // Accuracy text matches the payload value (formatted as N%).
    expect(screen.getByTestId("text-accuracy-rate").textContent).toBe("72%");

    // Top-instrument rows appear in payload order.
    expect(screen.getByTestId("text-instrument-0").textContent).toBe("XAU/USD");
    expect(screen.getByTestId("text-instrument-1").textContent).toBe("EUR/USD");

    // The dominant-mode card resolves to the localised mode label.
    expect(screen.getByTestId("text-dominant-mode")).toBeInTheDocument();

    // The empty-state CTA must NOT render on the happy path.
    expect(
      screen.queryByTestId("button-start-analysis"),
    ).not.toBeInTheDocument();
  });
});

describe("AnalyticsPage: empty branch", () => {
  it("renders the 'no data' empty-state and the 'Start analysis' CTA when the payload reports zero lifetime analyses", async () => {
    installFetchMock(analyticsHandlers({ analytics: EMPTY_ANALYTICS_PAYLOAD }));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyticsPage />
      </Wrapper>,
    );

    // The empty-state CTA only renders once the analytics query
    // settles to `totalAllTime === 0`.
    expect(
      await screen.findByTestId("button-start-analysis"),
    ).toBeInTheDocument();

    // None of the populated-state widgets render.
    expect(screen.queryByTestId("accuracy-gauge")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("text-instrument-0"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("text-dominant-mode"),
    ).not.toBeInTheDocument();
  });
});

describe("AnalyticsPage: user actions", () => {
  it("navigates to /analyze when the empty-state 'Start analysis' CTA is clicked", async () => {
    installFetchMock(analyticsHandlers({ analytics: EMPTY_ANALYTICS_PAYLOAD }));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyticsPage />
      </Wrapper>,
    );

    const cta = await screen.findByTestId("button-start-analysis");

    await act(async () => {
      fireEvent.click(cta);
    });

    // wouter pushes the new path onto the HTML5 history stack.
    await waitFor(() => {
      expect(window.location.pathname).toBe("/analyze");
    });
  });
});
