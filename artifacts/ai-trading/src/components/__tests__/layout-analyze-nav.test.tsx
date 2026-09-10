/**
 * The "Analisis" nav tab and the header back button both route to the
 * user's last *already generated* analysis (reopening costs no AI tokens)
 * rather than a blank New-Analysis form. A first-timer with no analyses
 * still lands on the form.
 */
import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { Layout } from "../layout";
import {
  TEST_USER,
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "@/pages/__tests__/test-helpers";

const authAs: FetchHandler = (url) =>
  url.includes("/api/auth/me") ? jsonResponse({ ...TEST_USER }) : null;

const summaryHandler: FetchHandler = (url) =>
  url.includes("/api/analyses/summary")
    ? jsonResponse({ totalAnalyses: 3, beginnerCount: 3, proCount: 0, recentAnalyses: [] })
    : null;

function lastAnalysisHandler(latest: { id: number } | null): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "GET") return null;
    if (!/\/api\/analyses\?/.test(url)) return null;
    if (url.includes("/summary") || url.includes("/recent-instruments") || url.includes("/quota")) {
      return null;
    }
    return jsonResponse({
      analyses: latest ? [{ id: latest.id, instrument: "XAU/USD", timeframe: "1h" }] : [],
      total: latest ? 1 : 0,
      page: 1,
      limit: 1,
    });
  };
}

function renderLayoutAt(path: string, latest: { id: number } | null) {
  window.history.replaceState({}, "", path);
  installFetchMock([authAs, summaryHandler, lastAnalysisHandler(latest)], { strict: false });
  const { Wrapper } = makeWrapper();
  return render(
    <Wrapper>
      <Layout>
        <div>child</div>
      </Layout>
    </Wrapper>,
  );
}

describe("Layout — Analisis nav / back go to the last analysis", () => {
  it("points the Analisis tab at /analyze?result=<lastId> when the user has analyses", async () => {
    renderLayoutAt("/journal", { id: 42 });

    await waitFor(() =>
      expect(screen.getByTestId("nav-desktop-analyze")).toHaveAttribute("href", "/analyze?result=42"),
    );
    expect(screen.getByTestId("nav-analyze").closest("a")).toHaveAttribute("href", "/analyze?result=42");
    expect(screen.getByTestId("nav-analyze").tagName).toBe("A");
    expect(screen.getByTestId("nav-analyze").querySelector("button")).toBeNull();
  });

  it("falls back to /analyze when the user has no analyses yet", async () => {
    renderLayoutAt("/journal", null);

    await waitFor(() =>
      expect(screen.getByTestId("nav-desktop-analyze")).toHaveAttribute("href", "/analyze"),
    );
  });

  it("header back button navigates to the analyze page with the last analysis", async () => {
    renderLayoutAt("/notifications", { id: 42 });

    const back = await screen.findByTestId("button-back-header");
    await waitFor(() =>
      expect(screen.getByTestId("nav-desktop-analyze")).toHaveAttribute("href", "/analyze?result=42"),
    );
    await act(async () => {
      fireEvent.click(back);
    });
    expect(window.location.pathname).toBe("/analyze");
    expect(window.location.search).toBe("?result=42");
  });

  it("header back button falls back to /dashboard with no analyses", async () => {
    renderLayoutAt("/notifications", null);

    const back = await screen.findByTestId("button-back-header");
    await act(async () => {
      fireEvent.click(back);
    });
    expect(window.location.pathname).toBe("/dashboard");
  });
});
