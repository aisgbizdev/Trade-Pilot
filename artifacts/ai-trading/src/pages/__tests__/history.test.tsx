/**
 * Component test for the History list (`src/pages/history.tsx`).
 *
 * Covers happy-path rendering of the analyses list (with valid/expired
 * badges and the one-tap Re-analyze button on every row regardless of
 * validity — task #108), the empty state with both "no data ever" and
 * "no data after a filter" branches, the loading spinner, and the
 * filters panel toggle which causes the list query to refetch with new
 * query params.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import HistoryPage from "../history";
import {
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

// One valid + one expired analysis so we can assert both badge variants
// and the refresh button (rendered only for expired rows).
const NOW = Date.now();
const FUTURE_ISO = new Date(NOW + 24 * 3_600_000).toISOString();
const PAST_ISO = new Date(NOW - 3_600_000).toISOString();

const SAMPLE_ANALYSES = [
  {
    id: 101,
    instrument: "XAU/USD",
    timeframe: "1h",
    mode: "beginner",
    marketCondition: "trending_up",
    createdAt: new Date(NOW - 60_000).toISOString(),
    validUntil: FUTURE_ISO,
  },
  {
    id: 102,
    instrument: "EUR/USD",
    timeframe: "1D",
    mode: "pro",
    marketCondition: "ranging",
    createdAt: new Date(NOW - 7_200_000).toISOString(),
    validUntil: PAST_ISO,
  },
];

function listHandler(payload: {
  analyses: typeof SAMPLE_ANALYSES;
  total: number;
  delayMs?: number;
}): FetchHandler {
  return async (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "GET") return null;
    if (!/\/api\/analyses(\?|$)/.test(url)) return null;
    if (url.includes("recent-instruments") || url.includes("/quota")) return null;
    if (payload.delayMs) {
      await new Promise((r) => setTimeout(r, payload.delayMs));
    }
    return jsonResponse({
      analyses: payload.analyses,
      total: payload.total,
    });
  };
}

function summaryHandler(): FetchHandler {
  return async (url, init) => {
    if ((init?.method ?? "GET").toUpperCase() !== "GET") return null;
    if (!url.includes("/api/analyses/history-summary")) return null;
    const stats = {
      pending: 0, activeValid: 0, tp1Hit: 6, tp2Hit: 2,
      slHit: 2, expired: 0, invalidated: 0, winRate: 0.8, completionRate: 0.8,
    };
    return jsonResponse({
      range: "30",
      minSamples: 10,
      overall: { total: 15, ...stats },
      byInstrument: [
        {
          instrument: "XAU/USD", total: 10, ...stats,
          byTimeframe: [{ timeframe: "1h", total: 10, ...stats }],
        },
        {
          instrument: "BRENT", total: 5, ...stats,
          byTimeframe: [{ timeframe: "4h", total: 5, ...stats }],
        },
        {
          instrument: "EUR/USD", total: 3, ...stats,
          byTimeframe: [{ timeframe: "1h", total: 3, ...stats }],
        },
        {
          instrument: "NASDAQ", total: 2, ...stats,
          byTimeframe: [{ timeframe: "4h", total: 2, ...stats }],
        },
      ],
      byTimeframe: [
        { timeframe: "1h", total: 10, ...stats },
        { timeframe: "4h", total: 5, ...stats },
      ],
    });
  };
}

beforeEach(() => {
  localStorage.clear();
  // Legacy list assertions intentionally open the Riwayat tab. The unified
  // page now defaults to the Ringkasan tab at bare /history.
  window.history.replaceState({}, "", "/history?view=history");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("HistoryPage: instrument performance", () => {
  it("defaults to the summary and focuses timeframe performance by selected instrument", async () => {
    window.history.replaceState({}, "", "/history");
    installFetchMock([summaryHandler()]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <HistoryPage />
      </Wrapper>,
    );

    expect(await screen.findByText("Performance by instrument")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /BRENT.*5 sample/i }));
    expect(await screen.findByText("Performance by timeframe · BRENT")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Other Instruments.*5 sample/i }));
    expect(await screen.findByText("Performance by timeframe · Other Instruments")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /EUR\/USD.*3 sample/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /NASDAQ.*2 sample/i })).not.toBeInTheDocument();
  });
});

describe("HistoryPage: happy-path render", () => {
  it("renders one card per analysis with valid/expired badges and a Re-analyze button on every row", async () => {
    installFetchMock([
      listHandler({ analyses: SAMPLE_ANALYSES, total: SAMPLE_ANALYSES.length }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <HistoryPage />
      </Wrapper>,
    );

    // Both cards eventually render.
    expect(await screen.findByTestId("card-analysis-101")).toBeInTheDocument();
    expect(screen.getByTestId("card-analysis-102")).toBeInTheDocument();

    const valid = screen.getByTestId("card-analysis-101");
    const expired = screen.getByTestId("card-analysis-102");

    expect(valid.textContent).toMatch(/XAU\/USD/);
    expect(valid.textContent).toMatch(/1h/);
    expect(valid.querySelector('a[href="/analyses/101"]')).not.toBeNull();
    expect(expired.textContent).toMatch(/EUR\/USD/);

    // One-tap Re-analyze is available on every row, valid or expired.
    expect(screen.getByTestId("button-reanalyze-row-101")).toBeInTheDocument();
    expect(screen.getByTestId("button-reanalyze-row-102")).toBeInTheDocument();

    // Pagination controls render once data is in. With total=2 and
    // limit=5 there is no next page and we are on the first page.
    expect(
      (screen.getByTestId("button-prev-page") as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByTestId("button-next-page") as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(screen.getByTestId("history-pagination-status")).toHaveTextContent(
      "Page 1 of 1",
    );
    expect(screen.getByTestId("history-pagination-range")).toHaveTextContent(
      "Showing 1–2 of 2",
    );
  });
});

describe("HistoryPage: pagination size", () => {
  it("enables the next-page button when total exceeds the 5-per-page size", async () => {
    // total=6 with limit=5 → second page exists → next is enabled.
    installFetchMock([
      listHandler({ analyses: SAMPLE_ANALYSES, total: 6 }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <HistoryPage />
      </Wrapper>,
    );

    await screen.findByTestId("card-analysis-101");
    expect(
      (screen.getByTestId("button-next-page") as HTMLButtonElement).disabled,
    ).toBe(false);
    expect(
      (screen.getByTestId("button-prev-page") as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it.each([
    { page: 2, total: 12, expectedPage: "Page 2 of 3", expectedRange: "Showing 6–10 of 12", nextDisabled: false },
    { page: 3, total: 12, expectedPage: "Page 3 of 3", expectedRange: "Showing 11–12 of 12", nextDisabled: true },
  ])(
    "shows the correct page and result range on page $page",
    async ({ page, total, expectedPage, expectedRange, nextDisabled }) => {
      window.history.replaceState({}, "", `/history?view=history&page=${page}`);
      installFetchMock([listHandler({ analyses: SAMPLE_ANALYSES, total })]);
      const { Wrapper } = makeWrapper();

      render(
        <Wrapper>
          <HistoryPage />
        </Wrapper>,
      );

      await screen.findByTestId("card-analysis-101");
      expect(screen.getByTestId("history-pagination-status")).toHaveTextContent(
        expectedPage,
      );
      expect(screen.getByTestId("history-pagination-range")).toHaveTextContent(
        expectedRange,
      );
      expect(
        (screen.getByTestId("button-prev-page") as HTMLButtonElement).disabled,
      ).toBe(false);
      expect(
        (screen.getByTestId("button-next-page") as HTMLButtonElement).disabled,
      ).toBe(nextDisabled);
    },
  );
});

describe("HistoryPage: loading + empty branches", () => {
  it("shows a loading spinner while the analyses query is in flight", async () => {
    installFetchMock([
      listHandler({ analyses: [], total: 0, delayMs: 50 }),
    ]);
    const { Wrapper } = makeWrapper();

    const { container } = render(
      <Wrapper>
        <HistoryPage />
      </Wrapper>,
    );

    // The spinner uses `animate-spin` while the React Query is pending.
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  it("renders the empty state with the 'Start Analysis' link when no analyses and no active filters", async () => {
    installFetchMock([listHandler({ analyses: [], total: 0 })]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <HistoryPage />
      </Wrapper>,
    );

    expect(
      await screen.findByTestId("button-start-analysis"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("history-pagination-status"),
    ).not.toBeInTheDocument();
    // Without active filters the alternate "clear filters" CTA should not
    // appear.
    expect(
      screen.queryByTestId("button-clear-filters-empty"),
    ).not.toBeInTheDocument();
  });

  it("swaps the empty-state CTA to 'Clear filters' when filters are active and no analyses match", async () => {
    installFetchMock([listHandler({ analyses: [], total: 0 })]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <HistoryPage />
      </Wrapper>,
    );

    // Open the filters panel and pick a timeframe filter.
    fireEvent.click(await screen.findByTestId("button-toggle-filters"));
    expect(screen.getByTestId("filter-panel")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("filter-timeframe-1h"));

    // Now an empty result with active filters should expose the "Clear
    // filters" CTA in the empty state.
    expect(
      await screen.findByTestId("button-clear-filters-empty"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("button-start-analysis"),
    ).not.toBeInTheDocument();
  });
});

describe("HistoryPage: user actions", () => {
  it("toggles the filters panel and refetches with the picked timeframe in the query string", async () => {
    const { calls } = installFetchMock([
      listHandler({ analyses: SAMPLE_ANALYSES, total: SAMPLE_ANALYSES.length }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <HistoryPage />
      </Wrapper>,
    );

    await screen.findByTestId("card-analysis-101");

    // Filters panel is closed by default.
    expect(screen.queryByTestId("filter-panel")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-toggle-filters"));
    });
    expect(screen.getByTestId("filter-panel")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("filter-timeframe-1h"));
    });

    // The list query should fire again with timeframes=1h in the URL.
    await waitFor(() => {
      const filtered = calls.find(
        (c) =>
          c.method === "GET" &&
          /\/api\/analyses\?/.test(c.url) &&
          c.url.includes("timeframes=1h"),
      );
      expect(filtered).toBeDefined();
    });
  });

  it("shows four core instrument choices plus one combined Other Instruments filter", async () => {
    const { calls } = installFetchMock([
      listHandler({ analyses: SAMPLE_ANALYSES, total: SAMPLE_ANALYSES.length }),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <HistoryPage />
      </Wrapper>,
    );

    await screen.findByTestId("card-analysis-101");
    const filterButton = screen.getByTestId("button-toggle-filters");
    expect(filterButton).toHaveTextContent("Filters");
    fireEvent.click(filterButton);

    expect(screen.getByTestId("filter-instrument-XAU/USD")).toBeInTheDocument();
    expect(screen.getByTestId("filter-instrument-BRENT")).toBeInTheDocument();
    expect(screen.getByTestId("filter-instrument-HSI")).toBeInTheDocument();
    expect(screen.getByTestId("filter-instrument-NIKKEI")).toBeInTheDocument();
    expect(screen.getByTestId("filter-instrument-other")).toBeInTheDocument();
    expect(screen.queryByTestId("filter-instrument-EUR/USD")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("filter-instrument-other"));
    await waitFor(() => {
      const filtered = calls.find(
        (call) =>
          call.method === "GET" &&
          /\/api\/analyses\?/.test(call.url) &&
          call.url.includes("instruments=__other__"),
      );
      expect(filtered).toBeDefined();
    });
    expect(screen.getByTestId("button-toggle-filters")).toHaveTextContent("1");
    expect(screen.getByTestId("chip-inst-other")).toHaveTextContent("Other Instruments");
    expect(await screen.findByTestId("card-analysis-102")).toHaveTextContent("EUR/USD");
  });
});
