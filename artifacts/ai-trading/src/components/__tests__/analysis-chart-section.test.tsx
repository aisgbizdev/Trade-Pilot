import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { LanguageProvider } from "@/lib/i18n";
import type { LiveQuote } from "@/hooks/use-live-quotes";

vi.mock("@/components/tradingview-symbol-overview", () => ({
  TradingViewSymbolOverview: () => <div data-testid="symbol-overview" />,
}));

vi.mock("@/components/tradingview-advanced-chart", () => ({
  TradingViewAdvancedChart: () => <div data-testid="advanced-chart" />,
}));

vi.mock("@/components/analysis-levels-chart", () => ({
  AnalysisLevelsChart: () => <div data-testid="levels-chart" />,
}));

import {
  AnalysisChartSection,
  LIVE_QUOTE_STALE_AFTER_MS,
} from "../analysis-chart-section";

const QUOTE: LiveQuote = {
  instrument: "XAU/USD",
  symbol: "XUL10",
  price: 2345.67,
  buy: 2345.8,
  sell: 2345.5,
  spread: 0.3,
  high: 2350,
  low: 2320,
  open: 2330,
  changePercent: "+0.42%",
  direction: "up",
  serverTime: "08:00:00",
  updatedAt: "2026-09-09T08:00:00.000Z",
};

function renderSection(quote?: LiveQuote, receivedAt?: number) {
  return render(
    <LanguageProvider>
      <AnalysisChartSection
        instrument="XAU/USD"
        timeframe="1h"
        liveQuote={quote}
        liveQuoteReceivedAt={receivedAt}
      />
    </LanguageProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("AnalysisChartSection live quote snapshot", () => {
  it("shows the same fresh quote in the inline and full-chart headers without fetching", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderSection(QUOTE, Date.now());

    expect(screen.getByTestId("chart-live-quote-price")).toHaveTextContent("2345.67");
    expect(screen.getByTestId("chart-live-quote-direction")).toHaveTextContent("+0.42%");
    expect(screen.getByTestId("chart-live-quote-fresh")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-open-full-chart"));
    expect(screen.getAllByTestId("chart-live-quote-price")).toHaveLength(2);
    expect(screen.getAllByTestId("chart-live-quote-fresh")).toHaveLength(2);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("updates the subtle direction indicator when the cached quote changes", () => {
    const { rerender } = renderSection(QUOTE, Date.now());
    expect(screen.getByTestId("chart-live-quote-direction")).toHaveClass("text-emerald-600");

    rerender(
      <LanguageProvider>
        <AnalysisChartSection
          instrument="XAU/USD"
          timeframe="1h"
          liveQuote={{ ...QUOTE, price: 2338.1, changePercent: "-0.31%", direction: "down" }}
          liveQuoteReceivedAt={Date.now()}
        />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("chart-live-quote-price")).toHaveTextContent("2338.10");
    expect(screen.getByTestId("chart-live-quote-direction")).toHaveTextContent("-0.31%");
    expect(screen.getByTestId("chart-live-quote-direction")).toHaveClass("text-red-600");
  });

  it("marks an old cached quote as delayed instead of presenting it as fresh", () => {
    renderSection(QUOTE, Date.now() - LIVE_QUOTE_STALE_AFTER_MS - 1);

    expect(screen.getByTestId("chart-live-quote-price")).toHaveTextContent("2345.67");
    expect(screen.getByTestId("chart-live-quote-stale")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-live-quote-fresh")).not.toBeInTheDocument();
  });

  it("states that live price is unavailable and never falls back to a plan price", () => {
    renderSection(undefined, 0);

    expect(screen.getByTestId("chart-live-quote-unavailable")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-live-quote-price")).not.toBeInTheDocument();
  });
});