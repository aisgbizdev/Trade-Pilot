import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import PerformancePage from "../performance";
import MyAlertsPage from "../my-alerts";
import MirrorPage from "../mirror";
import { en } from "../../locales/en";
import { id } from "../../locales/id";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("optional page explanations", () => {
  it("shows the short performance intro but keeps long definitions collapsed", async () => {
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

    const intro = screen.getByTestId("performance-intro");
    expect(intro).toBeVisible();
    expect(intro).toHaveTextContent(en.performance.subtitle);
    expect(intro.querySelector("summary")).toBeNull();
    expect(screen.getByTestId("link-performance-methodology")).toBeVisible();
    expect(await screen.findByTestId("overall-win-rate")).toHaveTextContent("50%");
    const definitions = screen.getByTestId("performance-metrics-explanation") as HTMLDetailsElement;
    expect(definitions.open).toBe(false);
    fireEvent.click(within(definitions).getByText(en.performance.overall_explain_label));
    expect(definitions.open).toBe(true);
    expect(definitions).toHaveTextContent(en.performance.overall_hit_rate_explain);
  });

  it("shows the short alerts intro beside the empty state without a disclosure", async () => {
    installFetchMock([(url) => url.includes("/api/user-price-alerts") ? jsonResponse({ alerts: [] }) : null]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><MyAlertsPage /></Wrapper>);

    const intro = screen.getByTestId("alerts-intro");
    expect(intro).toBeVisible();
    expect(await screen.findByTestId("card-alerts-empty")).toBeVisible();
    expect(intro.querySelector("summary")).toBeNull();
    expect(intro).toHaveTextContent(en.alerts.page_subtitle);
  });

  it.each(["en", "id"] as const)("shows all three short Mirror category subtitles directly in %s", async (lang) => {
    localStorage.setItem("app_lang", lang);
    installFetchMock([(url) => url.includes("/api/mirror/insights") ? jsonResponse({
      insights: {
        overallGated: false,
        totalResolved: 5,
        sessions: { gated: true, have: 0, need: 5 },
        instruments: { gated: true, have: 0, need: 5 },
        timing: { gated: true, have: 0, need: 5 },
        postLoss: { gated: true, have: 0, need: 5 },
        exitDiscipline: { gated: true, have: 0, need: 5 },
      },
      highlights: [],
    }) : null]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><MirrorPage /></Wrapper>);

    const copy = lang === "id" ? id.mirror : en.mirror;
    for (const [category, subtitle] of [
      ["sessions", copy.sessions_subtitle],
      ["instruments", copy.instruments_subtitle],
      ["timing", copy.timing_subtitle],
    ] as const) {
      const card = await screen.findByTestId(`card-mirror-${category}`);
      expect(within(card).getByText(subtitle)).toBeVisible();
      expect(card.querySelector("summary")).toBeNull();
    }
  });
});