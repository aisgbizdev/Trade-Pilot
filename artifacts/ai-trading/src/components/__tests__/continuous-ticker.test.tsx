import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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
});