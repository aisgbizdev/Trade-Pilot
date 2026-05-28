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

vi.mock("@/hooks/use-anti-pattern-signals", () => ({
  useAntiPatternSignals: () => ({ data: { signals: [], prefs: {} } }),
  useLogGuardrailEvent: () => ({ mutate: vi.fn() }),
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
  // LocalSentimentWidget on the Analyze page calls this; the widget
  // hides itself when `data` is undefined, which is exactly what we
  // want in these tests — they aren't asserting on sentiment UI.
  useGetJournalSentiment: () => ({ data: undefined, isLoading: false }),
  getGetJournalSentimentQueryKey: () => ["sentiment"],
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

// Build an event keyed on an absolute Unix epoch (`epochMs`) so the
// warning logic reads its "time until release" without re-parsing the
// `date`/`time` strings. This means the assertions hold identically
// regardless of which TZ the test runner — or, more importantly, the
// end user's browser — happens to live in.
function offsetEvent(offsetMs: number, overrides: Record<string, unknown> = {}) {
  const epochMs = Date.now() + offsetMs;
  const target = new Date(epochMs);
  const pad = (n: number) => String(n).padStart(2, "0");
  // UTC formatting matches the server-side normalizer's TZ assumption.
  const date = `${target.getUTCFullYear()}-${pad(target.getUTCMonth() + 1)}-${pad(target.getUTCDate())}`;
  const time = `${pad(target.getUTCHours())}:${pad(target.getUTCMinutes())}`;
  return {
    date,
    time,
    epochMs,
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

  it("reads the absolute epochMs so the warning is identical across user time zones", () => {
    // Pin "now" to a fixed UTC instant so the assertion does not drift
    // with the runner's clock. The event sits exactly 10 minutes ahead
    // in absolute time, regardless of what wall-clock TZ a user is in.
    vi.useFakeTimers();
    const fixedNow = Date.UTC(2026, 4, 27, 12, 0, 0, 0);
    vi.setSystemTime(fixedNow);
    const eventEpoch = fixedNow + 10 * 60_000;

    // Build the event with date/time strings that look like Tokyo
    // (UTC+9) wall-clock — what a JST-based feed renderer might emit.
    // The warning must IGNORE those strings and read `epochMs`, so the
    // displayed "10 min" holds whether the user is in JST, WIB, or NY.
    const tokyoWall = new Date(eventEpoch + 9 * 60 * 60_000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const misleadingEvent = {
      date: `${tokyoWall.getUTCFullYear()}-${pad(tokyoWall.getUTCMonth() + 1)}-${pad(tokyoWall.getUTCDate())}`,
      time: `${pad(tokyoWall.getUTCHours())}:${pad(tokyoWall.getUTCMinutes())}`,
      epochMs: eventEpoch,
      currency: "USD",
      impact: "★★★",
      event: "CPI",
      actual: "",
      forecast: "",
      previous: "",
      whyTraderCare: "",
    };
    mockRelevantCalendar.mockReturnValue({
      data: { events: [misleadingEvent] },
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
    // 10 min before the event, the warning should report "10" minutes
    // — proving the absolute epoch was used and the wall-clock strings
    // (which would say ~9h away if parsed as local) were ignored.
    expect(warning.getAttribute("data-event-minutes")).toBe("10");
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
