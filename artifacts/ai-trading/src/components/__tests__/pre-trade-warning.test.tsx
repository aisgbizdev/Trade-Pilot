import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import type { ReactNode } from "react";

import { LanguageProvider } from "@/lib/i18n";

vi.mock("@/components/tradingview-economic-calendar", () => ({
  TradingViewEconomicCalendar: () => null,
}));

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

const mockRelevantCalendar = vi.fn();
vi.mock("@/hooks/use-relevant-calendar", () => ({
  useRelevantCalendar: (
    instrument: string | null | undefined,
    opts?: { maxItems?: number },
  ) => mockRelevantCalendar(instrument, opts),
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

import AnalyzePage from "../../pages/analyze";

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

// Build a date/time string aligned with how the calendar feed encodes
// events (server local wall clock, no TZ offset). Using offset relative
// to `now` keeps the assertions stable regardless of which TZ the test
// runner happens to live in.
function offsetEvent(offsetMs: number, overrides: Record<string, unknown> = {}) {
  const target = new Date(Date.now() + offsetMs);
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`;
  const time = `${pad(target.getHours())}:${pad(target.getMinutes())}`;
  return {
    date,
    time,
    currency: "USD",
    impact: "★★★",
    event: "Non-Farm Payrolls",
    actual: "",
    forecast: "180k",
    previous: "175k",
    whyTraderCare: "",
    ...overrides,
  };
}

describe("PreTradeWarning on Analyze page", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockRelevantCalendar.mockReset();
    // The test runs Analyze with no pre-selected instrument; switch into
    // a deterministic instrument via the URL so the warning has an
    // instrument to key on.
    window.history.replaceState({}, "", "/analyze?instrument=EUR/USD");
  });
  afterEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, "", "/");
    vi.useRealTimers();
  });

  it("does not render when there are no high-impact events in the window", () => {
    mockRelevantCalendar.mockReturnValue({
      data: { events: [offsetEvent(2 * 60 * 60 * 1000)] }, // 2h away
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.queryByTestId("pre-trade-warning")).toBeNull();
  });

  it("renders a warning when a ★★★ event is within 30 minutes", () => {
    mockRelevantCalendar.mockReturnValue({
      data: { events: [offsetEvent(10 * 60 * 1000)] }, // 10 min away
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    const warning = screen.getByTestId("pre-trade-warning");
    expect(warning).toBeTruthy();
    expect(warning.getAttribute("data-event-currency")).toBe("USD");
    expect(warning.textContent).toContain("Non-Farm Payrolls");
  });

  it("ignores lower-impact events even if they are within the window", () => {
    mockRelevantCalendar.mockReturnValue({
      data: {
        events: [
          offsetEvent(5 * 60 * 1000, { impact: "★★", event: "PMI" }),
          offsetEvent(15 * 60 * 1000, { impact: "★", event: "Sentiment" }),
        ],
      },
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.queryByTestId("pre-trade-warning")).toBeNull();
  });

  it("ignores events that have already printed (have an actual value)", () => {
    mockRelevantCalendar.mockReturnValue({
      data: {
        events: [
          offsetEvent(5 * 60 * 1000, { actual: "190k" }),
        ],
      },
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.queryByTestId("pre-trade-warning")).toBeNull();
  });

  it("picks the soonest event when multiple ★★★ events are within the window", () => {
    mockRelevantCalendar.mockReturnValue({
      data: {
        events: [
          offsetEvent(25 * 60 * 1000, { event: "CPI" }),
          offsetEvent(7 * 60 * 1000, { event: "FOMC" }),
        ],
      },
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    const warning = screen.getByTestId("pre-trade-warning");
    expect(warning.textContent).toContain("FOMC");
    expect(warning.textContent).not.toContain("CPI");
  });

  it("requests a wider maxItems cap so packed weeks don't truncate the imminent event", () => {
    mockRelevantCalendar.mockReturnValue({
      data: { events: [] },
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    // The hook is mounted by both the preview card and the warning. At
    // least one call must pass the warning's wider cap (> default 6).
    const callWithMaxItems = mockRelevantCalendar.mock.calls.find(
      (args) => args[1] && typeof args[1].maxItems === "number" && args[1].maxItems > 6,
    );
    expect(callWithMaxItems).toBeTruthy();
  });

  it("renders at the 30-minute boundary but not beyond it", () => {
    // 30 minutes exactly is within the window per the spec.
    mockRelevantCalendar.mockReturnValue({
      data: { events: [offsetEvent(30 * 60 * 1000)] },
      isLoading: false,
      isError: false,
    });
    const { unmount } = render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.getByTestId("pre-trade-warning")).toBeTruthy();
    unmount();

    // 31 minutes is outside.
    mockRelevantCalendar.mockReturnValue({
      data: { events: [offsetEvent(31 * 60 * 1000)] },
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.queryByTestId("pre-trade-warning")).toBeNull();
  });

  it("renders Indonesian copy when the language is set to id", () => {
    localStorage.setItem("app_lang", "id");
    mockRelevantCalendar.mockReturnValue({
      data: { events: [offsetEvent(10 * 60 * 1000, { event: "CPI" })] },
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    const warning = screen.getByTestId("pre-trade-warning");
    expect(warning.textContent).toContain("Rilis berdampak tinggi");
    expect(warning.textContent).toContain("menit");
    localStorage.removeItem("app_lang");
  });

  it("auto-clears once the event time has passed (tick advances)", () => {
    vi.useFakeTimers();
    const setupNow = Date.now();
    vi.setSystemTime(setupNow);
    // Event 1 minute away — visible at mount.
    mockRelevantCalendar.mockReturnValue({
      data: { events: [offsetEvent(60_000)] },
      isLoading: false,
      isError: false,
    });
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );
    expect(screen.getByTestId("pre-trade-warning")).toBeTruthy();

    // Advance past event time + one tick interval so the warning's
    // internal `now` state refreshes via setInterval.
    act(() => {
      vi.setSystemTime(setupNow + 2 * 60_000);
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.queryByTestId("pre-trade-warning")).toBeNull();
  });
});
