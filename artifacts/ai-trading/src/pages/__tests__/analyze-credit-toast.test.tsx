/**
 * Covers the "a purchased credit was auto-consumed" toast on the Analyze
 * page (src/pages/analyze.tsx) — fired when POST /api/analyses responds
 * with `creditConsumed: true` instead of a 429, per the credit top-up
 * feature. A separate file (not analyze.test.tsx) so mocking `useToast`
 * here doesn't affect that file's other tests.
 */
import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

const { toastSpy } = vi.hoisted(() => ({ toastSpy: vi.fn() }));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastSpy, dismiss: vi.fn(), toasts: [] }),
  toast: toastSpy,
}));

import AnalyzePage from "../analyze";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

describe("AnalyzePage: credit-consumed toast", () => {
  it("shows a toast with the remaining balance when a credit was auto-consumed", async () => {
    installFetchMock(
      [
        (url) => {
          if (url.includes("/api/analyses/quota")) {
            return jsonResponse({
              unlimited: false,
              hourly: { remaining: 0, limit: 5 },
              daily: { remaining: 0, limit: 10 },
              credits: { balance: 4 },
            });
          }
          return null;
        },
        (url) => {
          if (url.includes("/api/progression/summary")) {
            return jsonResponse({ level: 1, masteryLevel: 0, rank: "Seedling" });
          }
          return null;
        },
        (url) => {
          if (url.includes("/api/quotes/live")) {
            return jsonResponse({ status: "ok", data: [] });
          }
          return null;
        },
        (url) => {
          if (url.includes("/api/calendar/relevant")) {
            return jsonResponse({ status: "success", instrument: "", events: [] });
          }
          return null;
        },
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method === "POST" && /\/api\/analyses(\?|$)/.test(url)) {
            return jsonResponse({
              id: 42,
              instrument: "XAU/USD",
              timeframe: "1h",
              createdAt: new Date().toISOString(),
              tradePlan: null,
              creditConsumed: true,
              creditBalance: 3,
            });
          }
          return null;
        },
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    const submit = (await screen.findByTestId("button-submit-analysis")) as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(submit);
    });

    await waitFor(() => {
      expect(toastSpy.mock.calls.length).toBeGreaterThan(0);
    });
    // Default test language is English (no lang override in makeWrapper()).
    expect(toastSpy.mock.calls[0]?.[0]).toEqual({ title: "1 credit used, remaining: 3" });
  });
});
