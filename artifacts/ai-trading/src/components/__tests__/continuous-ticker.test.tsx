import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { ContinuousTicker } from "../continuous-ticker";
import { LanguageProvider } from "@/lib/i18n";
import { useLiveQuotes } from "@/hooks/use-live-quotes";
import { useTickerNews, type NewsArticle } from "@/hooks/use-news";

vi.mock("@/hooks/use-live-quotes", () => ({
  useLiveQuotes: vi.fn(),
}));

vi.mock("@/hooks/use-news", () => ({
  useTickerNews: vi.fn(),
}));

const mockedLiveQuotes = vi.mocked(useLiveQuotes);
const mockedTickerNews = vi.mocked(useTickerNews);

function renderTicker() {
  return render(
    <LanguageProvider>
      <ContinuousTicker />
    </LanguageProvider>,
  );
}

function article(overrides: Partial<NewsArticle>): NewsArticle {
  return {
    id: "newsmaker-1",
    title: "Default headline",
    summary: "",
    category: "GLOBAL",
    date: "2026-08-28T10:00:00Z",
    publishedAt: "2026-08-28T10:00:00Z",
    sourceName: "Newsmaker.id",
    link: "https://newsmaker.id/default",
    image: "",
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  mockedLiveQuotes.mockReturnValue({ data: { data: [] } } as ReturnType<typeof useLiveQuotes>);
  mockedTickerNews.mockReturnValue({
    data: {
      total: 2,
      articles: [
        article({ id: "newsmaker-1", title: "Newsmaker market headline" }),
        article({
          id: "yahoo-1",
          title: "Yahoo Finance market headline",
          sourceName: "Yahoo Finance",
          link: "https://finance.yahoo.com/article",
        }),
      ],
    },
  } as ReturnType<typeof useTickerNews>);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("ContinuousTicker", () => {
  it("renders both source labels and preserves each article link", () => {
    renderTicker();

    expect(screen.getAllByTestId("ticker-news-item-newsmaker-1")[0]).toHaveTextContent(
      /Newsmaker\.id/,
    );
    expect(screen.getAllByTestId("ticker-news-item-yahoo-1")[0]).toHaveTextContent(
      /Yahoo Finance/,
    );
    expect(screen.getAllByTestId("ticker-news-item-yahoo-1")[0]).toHaveAttribute(
      "href",
      "https://finance.yahoo.com/article",
    );
  });

  it("does not render a breaking-news section when the merged feed is empty", () => {
    mockedTickerNews.mockReturnValue({
      data: { total: 0, articles: [] },
    } as ReturnType<typeof useTickerNews>);

    renderTicker();

    expect(screen.queryByTestId("ticker-breaking-news-badge")).not.toBeInTheDocument();
  });

  it("pauses and resumes the marquee without removing its content", () => {
    renderTicker();

    const track = screen.getByTestId("continuous-ticker-track");
    const pauseButton = screen.getByTestId("button-ticker-pause");
    fireEvent.click(pauseButton);

    expect(track).toHaveStyle({ animationPlayState: "paused" });
    expect(pauseButton).toHaveAttribute("aria-pressed", "true");
    expect(pauseButton).toHaveAccessibleName("Resume ticker");
    expect(localStorage.getItem("tradepilot_ticker_paused")).toBe("true");
    expect(screen.getAllByTestId("ticker-news-item-newsmaker-1")).toHaveLength(2);

    fireEvent.click(pauseButton);
    expect(track).toHaveStyle({ animationPlayState: "running" });
    expect(localStorage.getItem("tradepilot_ticker_paused")).toBe("false");
  });

  it("persists hidden state and keeps a keyboard-accessible show control", () => {
    const first = renderTicker();
    fireEvent.click(screen.getByTestId("button-ticker-hide"));

    expect(screen.queryByTestId("continuous-ticker")).not.toBeInTheDocument();
    expect(screen.getByTestId("continuous-ticker-hidden")).toBeInTheDocument();
    expect(localStorage.getItem("tradepilot_ticker_hidden")).toBe("true");

    first.unmount();
    renderTicker();
    const showButton = screen.getByTestId("button-ticker-show");
    expect(showButton).toHaveAccessibleName("Show ticker");

    fireEvent.click(showButton);
    expect(screen.getByTestId("continuous-ticker")).toBeInTheDocument();
    expect(localStorage.getItem("tradepilot_ticker_hidden")).toBe("false");
  });
});