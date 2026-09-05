import { describe, expect, it, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import AnalyzePage from "../analyze";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

describe("AnalyzePage Progression: Checklist & Safe Wait", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("completes mental checklist and fires progression activity", async () => {
    // Enable mental checklist pref in local storage
    localStorage.setItem("tradepilot.mentalChecklist.enabled", "true");

    let progressionCalled = false;
    let progressionBody: any = null;

    installFetchMock([
      (url) => {
        if (url.includes("/api/progression/summary")) return jsonResponse({ level: 1, masteryLevel: 0, rank: "Seedling" });
        if (url.includes("/api/analyses/quota")) return jsonResponse({ hourly: { remaining: 5 }, daily: { remaining: 10 } });
        if (url.includes("/api/trading-rules/standard")) return jsonResponse({ instruments: [{ name: "XAU/USD", category: "Futures", displayRank: 1 }] });
        if (url.includes("/api/analyses") && !url.includes("quota") && !url.includes("guardrails")) return jsonResponse({ analyses: [], total: 0 });
        if (url.includes("/api/timeframe-risk-map")) return jsonResponse({
          overall: { state: "eligible" },
          timeframes: [{ timeframe: "15m", status: "eligible", riskCategory: "low", reason: "Ok" }]
        });
        if (url.includes("/api/calendar/relevant")) return jsonResponse({ events: [] });
        if (url.includes("/api/analyses/guardrails/telemetry")) return jsonResponse({ ok: true, id: 999 });
        if (url.includes("/api/analyses/guardrails") && !url.includes("telemetry") && !url.includes("wait")) return jsonResponse({ signals: [], prefs: { revenge: true, overtrading: true, highRisk: true, coolingOff: true } });
        if (url.includes("/wait") && url.includes("/api/analyses/guardrails")) return jsonResponse({ awarded: true, xp: 50 });
        if (url.includes("/api/quotes/live")) return jsonResponse({ data: [{ instrument: "XAU/USD", price: 2000, direction: "up", changePercent: "0%" }] });
        if (url.includes("/api/ticker-news")) return jsonResponse({ items: [] });
        if (url.includes("/api/events/track")) return jsonResponse({ success: true });
        return null;
      },
      (url, init) => {
        if (url.includes("/api/progression/evidence") && init?.method === "POST") {
          const body = JSON.parse(init.body as string);
          if (body.source === "pre_analysis_checklist") {
            expect(body.checklist).toEqual({ instrument: "XAU/USD", timeframe: "1h" });
          }
          return jsonResponse({
            token: "mock_checklist_token",
            source: "pre_analysis_checklist",
            subject: "XAU/USD:1h:2024-01-01",
            minimumCompleteAt: new Date(Date.now() - 1000).toISOString()
          });
        }
        if (url.includes("/api/progression/activity") && init?.method === "POST") {
          progressionCalled = true;
          progressionBody = JSON.parse(init.body as string);
          return jsonResponse({ awarded: true, xp: 50, reason: "pre_analysis_checklist" });
        }
        return null;
      }
    ]);

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>
    );

    // Wait for the form to be ready and select an instrument
    await waitFor(() => expect(screen.getByTestId("button-instrument-XAU/USD")).toBeInTheDocument());
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-XAU/USD"));
    });

    // The mental checklist should now be visible
    const checklist = await screen.findByTestId("mental-checklist");
    expect(checklist).toBeInTheDocument();

    // Click all checkboxes
    const checkRisk = screen.getByTestId("mental-check-risk");
    const checkPlan = screen.getByTestId("mental-check-plan");
    const checkChase = screen.getByTestId("mental-check-chase");
    const checkCalm = screen.getByTestId("mental-check-calm");

    await act(async () => {
      fireEvent.click(checkRisk);
      fireEvent.click(checkPlan);
      fireEvent.click(checkChase);
      fireEvent.click(checkCalm);
    });

    // Progression should have been called
    await waitFor(() => expect(progressionCalled).toBe(true));
    expect(progressionBody.token).toBe("mock_checklist_token");
  });

});
