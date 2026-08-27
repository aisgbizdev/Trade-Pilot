/**
 * Component test for the Dashboard (`src/pages/dashboard.tsx`).
 *
 * Covers the happy-path render of the welcome strip, the mode toggle,
 * the analyses-summary stat tiles, the recent-analyses list and the
 * "view history" link; the empty branch where the API returns zero
 * analyses (which swaps the list for the "Start first analysis" CTA);
 * and a user action that toggles the user from beginner → pro mode and
 * fires `PATCH /api/auth/profile` with the new selected mode.
 *
 * The Dashboard renders inside `<Layout>`, which mounts widgets with
 * their own data dependencies (`/api/calendar`, `/api/news`,
 * `/api/quotes/live`). Strict-mode `installFetchMock` would fail the
 * test the moment one of those fires unmatched, so every endpoint the
 * mounted tree touches has an explicit handler below.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import DashboardPage from "../dashboard";
import {
  TEST_USER,
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

const NOW = Date.now();
const FUTURE_ISO = new Date(NOW + 24 * 3_600_000).toISOString();

const SUMMARY_PAYLOAD = {
  totalAnalyses: 7,
  beginnerCount: 4,
  proCount: 3,
  avgConfidenceMin: 55,
  avgConfidenceMax: 75,
};

const RECENT_INSTRUMENTS_PAYLOAD = {
  instruments: [
    { instrument: "XAU/USD", mode: "beginner" },
    { instrument: "EUR/USD", mode: "pro" },
  ],
};

const ANALYSES_PAYLOAD = {
  analyses: [
    {
      id: 201,
      instrument: "XAU/USD",
      timeframe: "1h",
      mode: "beginner",
      marketCondition: "trending_up",
      confidenceMin: 60,
      confidenceMax: 75,
      createdAt: new Date(NOW - 60_000).toISOString(),
      validUntil: FUTURE_ISO,
    },
  ],
  total: 1,
};

const CALENDAR_PAYLOAD = {
  events: [],
  total: 0,
  updatedAt: new Date(NOW).toISOString(),
};

const NEWS_PAYLOAD = { articles: [], total: 0 };

const LIVE_QUOTES_PAYLOAD = {
  status: "ok",
  updatedAt: new Date(NOW).toISOString(),
  serverTime: "00:00:00",
  data: [],
};

function dashboardHandlers(opts: {
  summary?: typeof SUMMARY_PAYLOAD;
  recent?: typeof RECENT_INSTRUMENTS_PAYLOAD;
  analyses?: typeof ANALYSES_PAYLOAD;
  updatedUser?: typeof TEST_USER;
}): FetchHandler[] {
  return [
    (url, init) => {
      const method = (init?.method ?? "GET").toUpperCase();
      // PATCH /api/auth/profile (mode toggle, theme pref, etc.)
      if (method === "PATCH" && url.includes("/api/auth/profile")) {
        return jsonResponse(opts.updatedUser ?? TEST_USER);
      }
      return null;
    },
    (url) => {
      if (url.includes("/api/analyses/summary")) {
        return jsonResponse(opts.summary ?? SUMMARY_PAYLOAD);
      }
      return null;
    },
    (url) => {
      if (url.includes("/api/analyses/recent-instruments")) {
        return jsonResponse(opts.recent ?? RECENT_INSTRUMENTS_PAYLOAD);
      }
      return null;
    },
    (url, init) => {
      // The dashboard list query is `/api/analyses?page=1&limit=5`.
      // Filter out the sibling endpoints that share the prefix.
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "GET") return null;
      if (!/\/api\/analyses(\?|$)/.test(url)) return null;
      if (
        url.includes("/summary") ||
        url.includes("/recent-instruments") ||
        url.includes("/quota")
      ) {
        return null;
      }
      return jsonResponse(opts.analyses ?? ANALYSES_PAYLOAD);
    },
    (url) => {
      if (url.includes("/api/calendar")) return jsonResponse(CALENDAR_PAYLOAD);
      return null;
    },
    (url) => {
      if (url.includes("/api/news")) return jsonResponse(NEWS_PAYLOAD);
      return null;
    },
    (url) => {
      if (url.includes("/api/quotes/live")) {
        return jsonResponse(LIVE_QUOTES_PAYLOAD);
      }
      return null;
    },
  ];
}

beforeEach(() => {
  localStorage.clear();
  // The OnboardingModal renders a portal-based dialog when its flag is
  // unset. Force "completed" so the rest of the dashboard mounts.
  localStorage.setItem(`onboarding_done_${TEST_USER.id}`, "1");
  window.history.replaceState({}, "", "/dashboard");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("DashboardPage: happy-path render", () => {
  it("renders the welcome strip, mode toggle, summary stats and the recent-analysis card", async () => {
    installFetchMock(dashboardHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    // Welcome strip pulls the display name from `/api/auth/me`. The
    // `<h1>` mounts immediately as an empty element while the auth
    // query is in flight, so wait until the name actually paints
    // before asserting.
    await waitFor(async () => {
      const node = await screen.findByTestId("text-display-name");
      expect(node.textContent).toBe(TEST_USER.displayName);
    });

    // The "new analysis" CTA renders unconditionally.
    expect(screen.getByTestId("button-new-analysis")).toBeInTheDocument();

    // Mode toggle exposes both tabs.
    expect(screen.getByTestId("button-mode-beginner")).toBeInTheDocument();
    expect(screen.getByTestId("button-mode-pro")).toBeInTheDocument();

    // The recent analysis card from ANALYSES_PAYLOAD eventually appears.
    expect(await screen.findByTestId("card-analysis-201")).toBeInTheDocument();

    // The "view history" link is present in the recent-analyses header.
    expect(screen.getByTestId("link-view-history")).toBeInTheDocument();
  });
});

describe("DashboardPage: empty branch", () => {
  it("renders the 'Start first analysis' CTA when the recent-analyses list is empty", async () => {
    installFetchMock(
      dashboardHandlers({
        analyses: { analyses: [], total: 0 },
        recent: { instruments: [] },
      }),
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    // The empty-state CTA only renders once the list query settles to
    // an empty array.
    expect(
      await screen.findByTestId("button-start-first-analysis"),
    ).toBeInTheDocument();

    // The non-empty branch must not render.
    expect(screen.queryByTestId("card-analysis-201")).not.toBeInTheDocument();
  });
});

describe("DashboardPage: user actions", () => {
  it("PATCHes /api/auth/profile with the new selectedMode when the mode toggle is clicked", async () => {
    const { calls } = installFetchMock(
      dashboardHandlers({
        updatedUser: { ...TEST_USER, selectedMode: "pro" },
      }),
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );

    const proButton = await screen.findByTestId("button-mode-pro");

    await act(async () => {
      fireEvent.click(proButton);
    });

    await waitFor(() => {
      const patched = calls.find(
        (c) => c.method === "PATCH" && c.url.includes("/api/auth/profile"),
      );
      expect(patched).toBeDefined();
      const payload = patched?.body ? JSON.parse(patched.body) : null;
      expect(payload?.selectedMode).toBe("pro");
    });
  });
});
