import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("renders only in-range, high-impact events matching the selected currency", () => {
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
    expect(screen.queryByText("Medium impact")).toBeNull();
    expect(container.querySelector("a[href='https://www.tradingview.com/economic-calendar/']")).not.toBeNull();
  });

  it("keeps the loading and error states inside the fixed-height panel", () => {
    mockUseCalendar.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { container } = render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} />
      </Wrapper>,
    );
    expect(screen.getByText("Loading calendar...")).toBeTruthy();
    expect(container.querySelector("[style='height: 300px;']")).not.toBeNull();

    mockUseCalendar.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    render(
      <Wrapper>
        <TradingViewEconomicCalendar height={300} />
      </Wrapper>,
    );
    expect(screen.getByText(/Unable to load the economic calendar widget/)).toBeTruthy();
  });
});
