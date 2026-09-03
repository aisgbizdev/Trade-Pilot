import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { LanguageProvider } from "@/lib/i18n";

vi.mock("@/components/tradingview-economic-calendar", () => ({
  TradingViewEconomicCalendar: (props: {
    height?: number;
    importanceFilter?: string;
    currencyFilter?: string[];
    onClearFilters?: () => void;
  }) => (
    <>
      <div
        data-testid="tradingview-economic-calendar-mock"
        data-height={props.height}
        data-importance={props.importanceFilter}
        data-currencies={props.currencyFilter?.join(",") ?? ""}
      />
      <button type="button" onClick={props.onClearFilters} data-testid="calendar-mock-clear-filters">
        Clear calendar filters
      </button>
    </>
  ),
}));

vi.mock("@/hooks/use-anti-pattern-signals", () => ({
  useAntiPatternSignals: () => ({ data: { signals: [], prefs: {} } }),
  useLogGuardrailEvent: () => ({ mutate: vi.fn() }),
}));

import AnalyzePage from "../../pages/analyze";

vi.mock("@/components/layout", () => ({
  Layout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/auth-provider", () => ({
  useAuth: () => ({ user: { selectedMode: "beginner" } }),
}));

vi.mock("@/components/set-alert-modal", () => ({
  SetAlertModal: () => null,
}));

vi.mock("@/components/market-sessions-badge", () => ({
  MarketSessionsBadge: () => null,
}));

vi.mock("@/components/analysis-chart-section", () => ({
  AnalysisChartSection: () => null,
}));

vi.mock("@/components/tradingview-mini-chart", () => ({
  TradingViewMiniChart: () => null,
}));

vi.mock("@/components/watchlist-star", () => ({
  WatchlistStar: () => null,
  useWatchlist: () => ({ data: undefined }),
}));

vi.mock("@/hooks/use-live-quotes", () => ({
  useQuoteByInstrument: () => ({ quote: null, isLoading: false }),
}));

vi.mock("@/hooks/use-relevant-calendar", () => ({
  useRelevantCalendar: () => ({ data: { events: [] }, isLoading: false, isError: false }),
}));

vi.mock("@workspace/api-client-react", () => ({
  useCreateAnalysis: () => ({ mutateAsync: vi.fn() }),
  useUpdateProfile: () => ({ mutate: vi.fn() }),
  getGetMeQueryKey: () => ["me"],
  useGetRecentInstruments: () => ({ data: undefined }),
  getGetRecentInstrumentsQueryKey: () => ["recent"],
  useGetAnalysisQuota: () => ({ data: undefined }),
  getGetAnalysisQuotaQueryKey: () => ["quota"],
  useListAnalyses: () => ({ data: undefined }),
  getListAnalysesQueryKey: () => ["analyses"],
}));

vi.mock("wouter", () => ({
  useLocation: () => ["/analyze", vi.fn()],
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: vi.fn() }),
  };
});

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

// The Economic Calendar section is currently hidden on the Analyze page
// (SHOW_ECONOMIC_CALENDAR_SECTION = false in analyze.tsx) — the component
// still exists but is no longer reachable through AnalyzePage's render
// tree, so these tests can't run against it right now. Skipped rather than
// deleted/rewritten so flipping the flag back on restores full coverage
// immediately.
describe.skip("Economic Calendar section on Analyze page", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("renders open by default and mounts the widget immediately", () => {
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.getByTestId("card-economic-calendar")).toBeTruthy();
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toBeTruthy();
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toHaveAttribute("data-importance", "-1");
    expect(screen.getByTestId("chip-economic-calendar-impact--1")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("chip-economic-calendar-impact-0")).toBeTruthy();
    expect(screen.getByTestId("chip-economic-calendar-impact-1")).toBeTruthy();
    expect(screen.queryByTestId("button-toggle-economic-calendar")).toBeNull();
  });

  it("passes the selected impact filter to the calendar", () => {
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId("chip-economic-calendar-impact-0"));
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toHaveAttribute("data-importance", "0");
    expect(screen.getByTestId("chip-economic-calendar-impact-0")).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByTestId("chip-economic-calendar-impact-1"));
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toHaveAttribute("data-importance", "1");
    expect(screen.getByTestId("chip-economic-calendar-impact-1")).toHaveAttribute("aria-pressed", "true");
  });

  it("lets the calendar empty state reset currency and impact filters together", () => {
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId("chip-economic-calendar-currency-USD"));
    fireEvent.click(screen.getByTestId("chip-economic-calendar-impact-1"));
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toHaveAttribute("data-currencies", "USD");
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toHaveAttribute("data-importance", "1");

    fireEvent.click(screen.getByTestId("calendar-mock-clear-filters"));
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toHaveAttribute("data-currencies", "");
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toHaveAttribute("data-importance", "-1");
    expect(screen.getByTestId("chip-economic-calendar-currency-all")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("chip-economic-calendar-impact--1")).toHaveAttribute("aria-pressed", "true");
  });
});
