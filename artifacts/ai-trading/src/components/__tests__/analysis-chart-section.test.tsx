import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

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

vi.mock("@/lib/chart-share", () => ({
  renderChartSharePng: vi.fn(),
}));

import { renderChartSharePng } from "@/lib/chart-share";
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
  vi.mocked(renderChartSharePng).mockResolvedValue({
    blob: new Blob(["image"], { type: "image/png" }),
    url: "data:image/png;base64,aW1hZ2U=",
    description: "Historical candles and Standard Plan levels.",
  });
});

it("offers the same standard chart PNG from the card and full-chart dialog", async () => {
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  try {
    render(
      <LanguageProvider>
        <AnalysisChartSection
          instrument="XAU/USD"
          timeframe="1h"
          analysisCreatedAt="2026-09-09T08:00:00.000Z"
          savedBias="Neutral / Wait"
        />
      </LanguageProvider>,
    );
    expect(screen.queryByTestId("button-chart-share-copy-inline")).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByTestId("button-chart-share-menu-inline"), { key: "Enter", code: "Enter" });
    expect(await screen.findByTestId("button-chart-share-copy-inline")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-chart-share-download-inline"));
    await waitFor(() => expect(renderChartSharePng).toHaveBeenCalledTimes(1));
    expect(vi.mocked(renderChartSharePng).mock.calls[0][0]).toMatchObject({
      instrument: "XAU/USD",
      timeframe: "1h",
      analyzedAt: "2026-09-09T08:00:00.000Z",
      bias: "Neutral / Wait",
    });
    expect(click).toHaveBeenCalled();
    fireEvent.keyDown(screen.getByTestId("button-chart-share-menu-inline"), { key: "Enter", code: "Enter" });
    fireEvent.click(await screen.findByTestId("button-chart-share-copy-inline"));
    await waitFor(() => expect(renderChartSharePng).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByTestId("button-open-full-chart"));
    fireEvent.keyDown(screen.getByTestId("button-chart-share-menu-full"), { key: "Enter", code: "Enter" });
    expect(await screen.findByTestId("button-chart-share-copy-full")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("button-chart-share-download-full"));
    await waitFor(() => expect(renderChartSharePng).toHaveBeenCalledTimes(3));
    expect(vi.mocked(renderChartSharePng).mock.calls[2][0]).toEqual(vi.mocked(renderChartSharePng).mock.calls[0][0]);
  } finally {
    click.mockRestore();
  }
});

it("does not offer a misleading chart image for an unsupported timeframe", () => {
  render(
    <LanguageProvider>
      <AnalysisChartSection instrument="XAU/USD" timeframe="legacy" analysisCreatedAt="2026-09-09T08:00:00.000Z" />
    </LanguageProvider>,
  );
  expect(screen.getByTestId("chart-share-unavailable-inline")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("button-open-full-chart"));
  expect(screen.getByTestId("chart-share-unavailable-full")).toBeInTheDocument();
  expect(screen.queryByTestId("button-chart-share-menu-full")).not.toBeInTheDocument();
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