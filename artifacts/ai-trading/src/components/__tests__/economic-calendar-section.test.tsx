import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { LanguageProvider } from "@/lib/i18n";

vi.mock("@/components/tradingview-economic-calendar", () => ({
  TradingViewEconomicCalendar: (props: { height?: number; importanceFilter?: string }) => (
    <div
      data-testid="tradingview-economic-calendar-mock"
      data-height={props.height}
      data-importance={props.importanceFilter}
    />
  ),
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
  useGetRecentInstruments: () => ({ data: undefined }),
  getGetRecentInstrumentsQueryKey: () => ["recent"],
  useGetAnalysisQuota: () => ({ data: undefined }),
  getGetAnalysisQuotaQueryKey: () => ["quota"],
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

describe("Economic Calendar collapsible section on Analyze page", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
  afterEach(() => {
    sessionStorage.clear();
  });

  it("renders collapsed by default and does not mount the widget", () => {
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.getByTestId("card-economic-calendar")).toBeTruthy();
    expect(screen.queryByTestId("tradingview-economic-calendar-mock")).toBeNull();
  });

  it("expands when the header is clicked and persists the open state in sessionStorage", () => {
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    const toggle = screen.getByTestId("button-toggle-economic-calendar");
    fireEvent.click(toggle);
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toBeTruthy();
    expect(sessionStorage.getItem("analyze.economicCalendar.open")).toBe("true");
  });

  it("starts open when sessionStorage already has the open preference", () => {
    sessionStorage.setItem("analyze.economicCalendar.open", "true");
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.getByTestId("tradingview-economic-calendar-mock")).toBeTruthy();
  });
});
