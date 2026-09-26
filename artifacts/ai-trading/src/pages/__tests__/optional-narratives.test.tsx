import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import PerformancePage from "../performance";
import MyAlertsPage from "../my-alerts";
import { en } from "../../locales/en";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("optional page explanations", () => {
  it("keeps performance figures and methodology visible while hiding the intro and definitions until requested", async () => {
    installFetchMock([(url) => url.includes("/api/performance/summary") ? jsonResponse({
      windowDays: 30,
      generatedAt: new Date().toISOString(),
      windowStart: null,
      minSamples: { overall: 1, bucket: 1, banner: 1 },
      overall: { total: 2, wins: 1, losses: 1, expired: 0, triggered: 2, winRate: 0.5, hitRate: 0.5 },
      banner: { severity: "ok", recentDays: 7, recentSample: 2, baselineSample: 2, recentHitRate: 0.5, baselineHitRate: 0.5, delta: 0 },
      byInstrument: { gated: true, need: 1, have: 0, buckets: [] },
      bySession: { gated: true, need: 1, have: 0, buckets: [] },
      byCondition: { gated: true, need: 1, have: 0, buckets: [] },
      byVolatility: { gated: true, need: 1, have: 0, buckets: [] },
      byNewsActivity: { gated: true, need: 1, have: 0, buckets: [] },
    }) : null]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><PerformancePage /></Wrapper>);

    const intro = screen.getByTestId("performance-intro") as HTMLDetailsElement;
    expect(intro.open).toBe(false);
    expect(screen.getByTestId("link-performance-methodology")).toBeVisible();
    expect(await screen.findByTestId("overall-win-rate")).toHaveTextContent("50%");
    const definitions = screen.getByTestId("performance-metrics-explanation") as HTMLDetailsElement;
    expect(definitions.open).toBe(false);
    fireEvent.click(within(definitions).getByText(en.performance.overall_explain_label));
    expect(definitions.open).toBe(true);
    expect(definitions).toHaveTextContent(en.performance.overall_hit_rate_explain);
  });

  it("keeps the alerts empty state visible while its optional intro starts closed", async () => {
    installFetchMock([(url) => url.includes("/api/user-price-alerts") ? jsonResponse({ alerts: [] }) : null]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><MyAlertsPage /></Wrapper>);

    const intro = screen.getByTestId("alerts-intro") as HTMLDetailsElement;
    expect(intro.open).toBe(false);
    expect(await screen.findByTestId("card-alerts-empty")).toBeVisible();
    fireEvent.click(within(intro).getByText("Show explanation"));
    expect(intro.open).toBe(true);
    expect(intro).toHaveTextContent(en.alerts.page_subtitle);
  });
});