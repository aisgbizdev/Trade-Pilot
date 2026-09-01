import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { TradingViewEconomicCalendar } from "../tradingview-economic-calendar";
import {
  calendarDateWindow,
  eventIsWithinCalendarWindow,
} from "@/lib/calendar-window";
import { LanguageProvider } from "@/lib/i18n";

vi.mock("@/components/theme-provider", () => ({
  useTheme: () => ({ theme: "light" }),
}));

const { mockUseCalendar } = vi.hoisted(() => ({
  mockUseCalendar: vi.fn(),
}));

vi.mock("@/hooks/use-calendar", () => ({
  useCalendar: mockUseCalendar,
}));

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

afterEach(() => {
  vi.useRealTimers();
  mockUseCalendar.mockReset();
});

describe("TradingViewEconomicCalendar date window", () => {
  it("calculates an inclusive seven-day window on each side of today", () => {
    expect(calendarDateWindow(new Date("2026-09-01T18:00:00Z"))).toEqual({
      startDate: "2026-08-25",
      endDate: "2026-09-08",
    });
  });

  it("checks dates inclusively at both boundaries", () => {
    const window = { startDate: "2026-08-25", endDate: "2026-09-08" };
    expect(eventIsWithinCalendarWindow({ date: "2026-08-24" }, window)).toBe(false);
    expect(eventIsWithinCalendarWindow({ date: "2026-08-25" }, window)).toBe(true);
    expect(eventIsWithinCalendarWindow({ date: "2026-09-08" }, window)).toBe(true);
    expect(eventIsWithinCalendarWindow({ date: "2026-09-09" }, window)).toBe(false);
  });

  it("renders all in-range impact levels matching the selected currency by default", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T12:00:00Z"));
    mockUseCalendar.mockReturnValue({
      data: {
        events: [
          { date: "2026-08-24", time: "09:00", currency: "USD", impact: "★★★", event: "Too old" },
          { date: "2026-08-25", time: "09:00", currency: "USD", impact: "★★★", event: "Start boundary" },
          { date: "2026-09-01", time: "10:00", currency: "EUR", impact: "★★★", event: "Wrong currency" },
          { date: "2026-09-08", time: "11:00", currency: "USD", impact: "★★★", event: "End boundary" },
          { date: "2026-09-09", time: "12:00", currency: "USD", impact: "★★★", event: "Too new" },
          { date: "2026-09-03", time: "13:00", currency: "USD", impact: "★★", event: "Medium impact" },
          { date: "2026-09-04", time: "14:00", currency: "USD", impact: "★", event: "Low impact" },
        ],
      },
      isLoading: false,
      isError: false,
    });

    const { container } = render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} currencyFilter={["USD"]} />
      </Wrapper>,
    );

    const wrapper = screen.getByTestId("tradingview-economic-calendar-wrapper");
    expect(wrapper).toHaveAttribute("data-window-start", "2026-08-25");
    expect(wrapper).toHaveAttribute("data-window-end", "2026-09-08");
    expect(screen.getByText("Start boundary")).toBeTruthy();
    expect(screen.getByText("End boundary")).toBeTruthy();
    expect(screen.queryByText("Too old")).toBeNull();
    expect(screen.queryByText("Wrong currency")).toBeNull();
    expect(screen.queryByText("Too new")).toBeNull();
    expect(screen.getByText("Medium impact")).toBeTruthy();
    expect(screen.getByText("Low impact")).toBeTruthy();
    expect(container.querySelector("a[href='https://www.tradingview.com/economic-calendar/']")).not.toBeNull();
  });

  it("filters medium and high impact events separately", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T12:00:00Z"));
    mockUseCalendar.mockReturnValue({
      data: {
        events: [
          { date: "2026-09-02", time: "09:00", currency: "USD", impact: "★★★", event: "High event" },
          { date: "2026-09-03", time: "10:00", currency: "USD", impact: "★★", event: "Medium event" },
          { date: "2026-09-04", time: "11:00", currency: "USD", impact: "★", event: "Low event" },
        ],
      },
      isLoading: false,
      isError: false,
    });

    const { rerender } = render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} importanceFilter="0" />
      </Wrapper>,
    );
    expect(screen.getByText("High event")).toBeTruthy();
    expect(screen.getByText("Medium event")).toBeTruthy();
    expect(screen.queryByText("Low event")).toBeNull();

    rerender(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} importanceFilter="1" />
      </Wrapper>,
    );
    expect(screen.getByText("High event")).toBeTruthy();
    expect(screen.queryByText("Medium event")).toBeNull();
    expect(screen.queryByText("Low event")).toBeNull();
  });

  it("explains when the feed returned no events without leaving a large blank panel", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T12:00:00Z"));
    mockUseCalendar.mockReturnValue({
      data: { events: [] },
      isLoading: false,
      isError: false,
    });

    const { container } = render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} />
      </Wrapper>,
    );

    const empty = screen.getByTestId("calendar-empty-state");
    expect(empty).toHaveAttribute("data-empty-reason", "source-empty");
    expect(empty).toHaveTextContent("No calendar events were returned");
    expect(empty).toHaveTextContent("Aug 25, 2026");
    expect(empty).toHaveTextContent("Sep 8, 2026");
    expect(container.querySelector("[style='height: 300px;']")).toBeNull();
  });

  it("explains when active currency filters remove all events and offers to clear them", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T12:00:00Z"));
    const onClearFilters = vi.fn();
    mockUseCalendar.mockReturnValue({
      data: {
        events: [
          { date: "2026-09-02", time: "09:00", currency: "EUR", impact: "★★★", event: "Euro event" },
        ],
      },
      isLoading: false,
      isError: false,
    });

    render(
      <Wrapper>
        <TradingViewEconomicCalendar
          height={300}
          currencyFilter={["USD"]}
          onClearFilters={onClearFilters}
        />
      </Wrapper>,
    );

    const empty = screen.getByTestId("calendar-empty-state");
    expect(empty).toHaveAttribute("data-empty-reason", "currency-empty");
    expect(empty).toHaveTextContent("No events for USD");
    fireEvent.click(screen.getByTestId("button-calendar-clear-filters"));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("offers retry when the calendar request fails", () => {
    const refetch = vi.fn();
    mockUseCalendar.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });

    render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} />
      </Wrapper>,
    );

    expect(screen.getByTestId("calendar-error-state")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-calendar-retry"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("keeps the loading state compact", () => {
    mockUseCalendar.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { container } = render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} />
      </Wrapper>,
    );
    expect(screen.getByText("Loading calendar...")).toBeTruthy();
    expect(container.querySelector("[style='height: 300px;']")).toBeNull();
  });
});
