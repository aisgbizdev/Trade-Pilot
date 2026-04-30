// Component tests for `src/pages/analysis-detail.tsx`. The page
// mounts inside `<Layout>`, so the layout-bell poll and the SSE
// constructor are stubbed in `src/test/setup.ts`.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import AnalysisDetailPage from "../analysis-detail";
import {
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

const ANALYSIS_ID = 555;
const NOW = Date.now();

const ANALYSIS_PAYLOAD = {
  id: ANALYSIS_ID,
  instrument: "XAU/USD",
  timeframe: "1h",
  mode: "beginner",
  marketCondition: "trending_up",
  riskLevel: "medium",
  tradingBias: "bullish",
  confidenceMin: 60,
  confidenceMax: 75,
  validUntil: new Date(NOW + 24 * 3_600_000).toISOString(),
  createdAt: new Date(NOW - 60_000).toISOString(),
  mainScenario: "Price likely continues higher into resistance.",
  alternativeScenario: "If we lose the swing low, scenario flips bearish.",
  failureConditions: "H1 close below 2300; ; rejection at 2360 with volume.",
  whyReason: "Trend structure aligned across H1 and H4.",
  techBuyCount: 12,
  techSellCount: 4,
  techNeutralCount: 6,
  feedback: null,
};

function getAnalysisHandler(opts: {
  status?: number;
  body?: unknown;
}): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "GET") return null;
    // Match the exact `/api/analyses/<id>` URL, not the sibling list /
    // summary / quota routes that share the prefix.
    if (!new RegExp(`/api/analyses/${ANALYSIS_ID}(?:\\?|$)`).test(url)) {
      return null;
    }
    const status = opts.status ?? 200;
    if (status >= 400) {
      return jsonResponse(opts.body ?? { error: "not found" }, status);
    }
    return jsonResponse(opts.body ?? ANALYSIS_PAYLOAD);
  };
}

function feedbackHandler(): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "POST") return null;
    if (!new RegExp(`/api/analyses/${ANALYSIS_ID}/feedback$`).test(url)) {
      return null;
    }
    return jsonResponse({
      id: 1,
      analysisId: ANALYSIS_ID,
      feedbackType: "useful",
      outcome: null,
      note: null,
      createdAt: new Date(NOW).toISOString(),
    });
  };
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", `/analyses/${ANALYSIS_ID}`);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AnalysisDetailPage: happy-path render", () => {
  it("renders the instrument header, bias label, confidence range and risk level from the payload", async () => {
    installFetchMock([getAnalysisHandler({}), feedbackHandler()]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const instrument = await screen.findByTestId("text-instrument");
    expect(instrument.textContent).toBe(ANALYSIS_PAYLOAD.instrument);

    // Bias label resolves from the bullish key — the actual rendered
    // string depends on locale, so just assert the element exists and
    // is non-empty.
    const bias = screen.getByTestId("text-bias-label");
    expect(bias.textContent?.trim().length ?? 0).toBeGreaterThan(0);

    // Confidence range shows both the min and the max with a dash.
    const confidence = screen.getByTestId("text-confidence");
    expect(confidence.textContent).toMatch(/60/);
    expect(confidence.textContent).toMatch(/75/);

    // Risk level renders the medium label.
    const risk = screen.getByTestId("text-risk-level");
    expect(risk.textContent?.trim().length ?? 0).toBeGreaterThan(0);

    // Feedback CTAs render — the user can pick useful / not-useful.
    expect(screen.getByTestId("button-feedback-useful")).toBeInTheDocument();
    expect(screen.getByTestId("button-feedback-not-useful")).toBeInTheDocument();
  });
});

describe("AnalysisDetailPage: not-found branch", () => {
  it("renders the localized not-found copy and the 'back to history' CTA when the API responds with a 404", async () => {
    installFetchMock([getAnalysisHandler({ status: 404 }), feedbackHandler()]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // Positive assertions: the not-found view should render BOTH the
    // localized copy and the outline-variant CTA back to /history.
    // (English is the default language in the test wrapper.)
    expect(
      await screen.findByText(/Analysis not found/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Back to History/i }),
    ).toBeInTheDocument();

    // And the happy-path widgets should NOT render in this branch.
    expect(screen.queryByTestId("text-instrument")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("button-feedback-useful"),
    ).not.toBeInTheDocument();
  });
});

describe("AnalysisDetailPage: fundamental context card", () => {
  it("renders the fundamental card with the headline + calendar event when fundamentalContext has items", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "newsmaker-1",
                title: "Gold rallies as Fed signals pause",
                summary: "Statement softer than expected.",
                source: "Newsmaker.id",
                url: "https://newsmaker.id/article-1",
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [
              {
                date: "2026-04-30",
                time: "12:00",
                currency: "USD",
                event: "FOMC rate decision",
                impact: "★★★",
                actual: "no change",
                forecast: "no change",
                previous: "no change",
              },
            ],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const card = await screen.findByTestId("card-fundamental-context");
    expect(card).toBeInTheDocument();
    expect(card.textContent).toMatch(/Gold rallies as Fed signals pause/);
    expect(card.textContent).toMatch(/FOMC rate decision/);
  });

  it("caps news at 3 items and calendar at 5 items, and opens news links in a new tab with safe rel attrs", async () => {
    // 5 news items + 7 calendar events — only 3 + 5 should render.
    const newsItems = Array.from({ length: 5 }).map((_, i) => ({
      id: `news-${i}`,
      title: `Headline number ${i}`,
      summary: `Summary ${i}`,
      source: "Newsmaker.id",
      url: `https://newsmaker.id/article-${i}`,
      publishedAt: new Date(NOW - (i + 1) * 60_000).toISOString(),
    }));
    const events = Array.from({ length: 7 }).map((_, i) => ({
      date: "2026-04-30",
      time: `0${i}:00`,
      currency: "USD",
      event: `Event number ${i}`,
      impact: "★★",
      actual: null,
      forecast: null,
      previous: null,
    }));
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: { newsItems, calendarEvents: events },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const card = await screen.findByTestId("card-fundamental-context");
    // News link rows are tagged `fundamental-news-link` (the anchor).
    const links = card.querySelectorAll("[data-testid='fundamental-news-link']");
    expect(links.length).toBe(3);
    // Each link must open in a new tab with the noopener noreferrer
    // protection — outbound feed links are upstream-controlled and we
    // never want them tab-napping the user.
    links.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel") ?? "").toMatch(/noopener/);
      expect(a.getAttribute("rel") ?? "").toMatch(/noreferrer/);
    });

    // Calendar list under the card should render exactly 5 of the 7
    // events (top-N cap) — count the impact badges as a stand-in for
    // a row marker that's stable across locales.
    const calendarList = card.querySelector(
      "[data-testid='fundamental-calendar-list']",
    );
    expect(calendarList).not.toBeNull();
    const eventRows = calendarList?.querySelectorAll("li") ?? [];
    expect(eventRows.length).toBe(5);
  });

  it("renders the empty-state message when fundamentalContext is present with empty arrays", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: { newsItems: [], calendarEvents: [] },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // The card itself must render so the user knows fundamentals were
    // checked but nothing surfaced — this is the explicit honesty the
    // task requires (no silent omission of the section).
    const card = await screen.findByTestId("card-fundamental-context");
    expect(card).toBeInTheDocument();
    // News + calendar list wrappers should NOT render in the empty state.
    expect(
      screen.queryByTestId("fundamental-news-list"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("fundamental-calendar-list"),
    ).not.toBeInTheDocument();
  });
});

describe("AnalysisDetailPage: refresh fundamentals", () => {
  it("POSTs to /refresh-fundamentals and renders the drift banner with the missing citation when the server reports drift", async () => {
    const refreshedAt = new Date(NOW - 60_000).toISOString();
    let refreshCalls = 0;
    const refreshHandler: FetchHandler = (url, init) => {
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "POST") return null;
      if (
        !new RegExp(
          `/api/analyses/${ANALYSIS_ID}/refresh-fundamentals$`,
        ).test(url)
      ) {
        return null;
      }
      refreshCalls += 1;
      return jsonResponse({
        fundamentalContext: {
          newsItems: [
            {
              id: "newsmaker-fresh",
              title: "Brand new headline",
              summary: "Just hit the wire.",
              source: "Newsmaker.id",
              url: "https://newsmaker.id/fresh",
              publishedAt: refreshedAt,
            },
          ],
          calendarEvents: [],
        },
        refreshedAt,
        drift: {
          totalCitations: 2,
          missingCitations: [
            { kind: "news", label: "Old headline the AI cited" },
          ],
        },
      });
    };

    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "newsmaker-old",
                title: "Old headline the AI cited",
                summary: "Stale.",
                source: "Newsmaker.id",
                url: "https://newsmaker.id/old",
                publishedAt: new Date(NOW - 6 * 3_600_000).toISOString(),
              },
            ],
            calendarEvents: [],
          },
        },
      }),
      feedbackHandler(),
      refreshHandler,
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // Find and click the refresh button on the fundamental card.
    const refreshBtn = await screen.findByTestId("button-refresh-fundamentals");
    await act(async () => {
      fireEvent.click(refreshBtn);
    });

    // The mutation should fire exactly once and the drift banner should
    // surface the server-returned drift label so the user can see which
    // cited item is no longer in the window.
    await waitFor(() => {
      expect(refreshCalls).toBe(1);
    });
    const banner = await screen.findByTestId("fundamental-refresh-banner");
    expect(banner).toBeInTheDocument();
    const driftText = banner.querySelector(
      "[data-testid='fundamental-refresh-drift-text']",
    );
    expect(driftText?.textContent).toMatch(/1.*2/);
    const items = banner.querySelectorAll(
      "[data-testid='fundamental-refresh-drift-item']",
    );
    expect(items.length).toBe(1);
    expect(items[0].textContent).toMatch(/Old headline the AI cited/);
  });
});

describe("AnalysisDetailPage: inline citation chips", () => {
  it("renders an inline news chip + an inline calendar chip below the AI's whyReason for beginner mode, matched against fundamentalContext", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          whyReason:
            "Trend bullish + Fed dovish memperkuat tesis cenderung naik.",
          fundamentalContext: {
            newsItems: [
              {
                id: "n-1",
                title: "Gold rallies as Fed signals pause",
                summary: "Statement softer than expected.",
                source: "Newsmaker.id",
                url: "https://newsmaker.id/article-1",
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [
              {
                date: "2026-04-30",
                time: "12:00",
                currency: "USD",
                event: "FOMC rate decision",
                impact: "★★★",
                actual: "no change",
                forecast: "no change",
                previous: "no change",
              },
            ],
          },
          fundamentalCitations: {
            newsTitles: ["Gold rallies as Fed signals pause"],
            // Mimic the AI emitting a star-prefixed event name — the chip
            // matcher must normalize past the "★★★ USD —" decoration.
            calendarEvents: ["★★★ USD — FOMC rate decision"],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // The chips should land inside the confidence-reason block (which
    // for beginner mode renders the whyReason text).
    const reasonCard = await screen.findByTestId("card-confidence-reason");
    const chipBlock = reasonCard.querySelector(
      "[data-testid='citation-chips']",
    );
    expect(chipBlock).not.toBeNull();

    const newsChip = chipBlock?.querySelector(
      "[data-testid='citation-chip-news']",
    );
    expect(newsChip).not.toBeNull();
    // News with a safe http(s) URL renders as an anchor that opens in
    // a new tab — same safe-rel guarantees as the FundamentalContextCard.
    expect(newsChip?.getAttribute("href")).toBe(
      "https://newsmaker.id/article-1",
    );
    expect(newsChip?.getAttribute("target")).toBe("_blank");
    expect(newsChip?.getAttribute("rel") ?? "").toMatch(/noopener/);

    const eventChip = chipBlock?.querySelector(
      "[data-testid='citation-chip-event']",
    );
    expect(eventChip).not.toBeNull();
    expect(eventChip?.textContent).toMatch(/FOMC rate decision/);
  });

  it("uses the ORIGINAL calendar index (not the matched-list index) for the chip slug, so click-to-scroll lines up when only a subset is cited", async () => {
    // Three events in the snapshot, AI cites only the THIRD one.
    // The chip slug must end with `-2` (index in full list), not `-0`
    // (index in matched list), or scrollToCitation finds nothing.
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [],
            calendarEvents: [
              {
                date: "2026-04-30",
                time: "08:00",
                currency: "EUR",
                event: "ECB press conference",
                impact: "★★",
                actual: null,
                forecast: null,
                previous: null,
              },
              {
                date: "2026-04-30",
                time: "10:00",
                currency: "GBP",
                event: "BoE bank rate",
                impact: "★★",
                actual: null,
                forecast: null,
                previous: null,
              },
              {
                date: "2026-04-30",
                time: "12:00",
                currency: "USD",
                event: "FOMC rate decision",
                impact: "★★★",
                actual: null,
                forecast: null,
                previous: null,
              },
            ],
          },
          fundamentalCitations: {
            newsTitles: [],
            calendarEvents: ["FOMC rate decision"],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const chips = await screen.findByTestId("citation-chips");
    const eventChip = chips.querySelector(
      "[data-testid='citation-chip-event']",
    ) as HTMLElement | null;
    expect(eventChip).not.toBeNull();

    // Build the slug the same way the component does, using the
    // ORIGINAL index (2) for the third event in the snapshot.
    const expectedSlug =
      "cite-event-" +
      "2026-04-30-fomc-rate-decision-2"
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

    // The same slug must exist as an `id` somewhere in the calendar
    // card (i.e. on the matching <li> row), proving the chip click
    // would actually find a target.
    const target = document.getElementById(expectedSlug);
    expect(target).not.toBeNull();
  });

  it("drops AI-cited items that don't match any row in fundamentalContext (no dangling chips)", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "n-1",
                title: "Gold rallies as Fed signals pause",
                summary: "",
                source: "Newsmaker.id",
                url: null,
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [],
          },
          fundamentalCitations: {
            // Cited title is NOT in the snapshot — must be dropped.
            newsTitles: ["Some hallucinated headline that doesn't exist"],
            calendarEvents: [],
          },
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    // Wait for the page to mount, then assert no chips rendered.
    await screen.findByTestId("text-instrument");
    expect(
      screen.queryByTestId("citation-chips"),
    ).not.toBeInTheDocument();
  });

  it("renders no chip block at all when fundamentalCitations is null (legacy rows)", async () => {
    installFetchMock([
      getAnalysisHandler({
        body: {
          ...ANALYSIS_PAYLOAD,
          fundamentalContext: {
            newsItems: [
              {
                id: "n-1",
                title: "Gold rallies as Fed signals pause",
                summary: "",
                source: "Newsmaker.id",
                url: "https://newsmaker.id/article-1",
                publishedAt: new Date(NOW - 30 * 60_000).toISOString(),
              },
            ],
            calendarEvents: [],
          },
          fundamentalCitations: null,
        },
      }),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    await screen.findByTestId("text-instrument");
    expect(
      screen.queryByTestId("citation-chips"),
    ).not.toBeInTheDocument();
    // The FundamentalContextCard itself should still render (the
    // snapshot is still there for the user to audit).
    expect(
      screen.getByTestId("card-fundamental-context"),
    ).toBeInTheDocument();
  });
});

describe("AnalysisDetailPage: user actions", () => {
  it("POSTs to /api/analyses/:id/feedback with feedbackType=useful when the user picks useful + submits", async () => {
    const { calls } = installFetchMock([
      getAnalysisHandler({}),
      feedbackHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalysisDetailPage params={{ id: String(ANALYSIS_ID) }} />
      </Wrapper>,
    );

    const useful = await screen.findByTestId("button-feedback-useful");

    await act(async () => {
      fireEvent.click(useful);
    });

    // After picking a feedback type the submit button materialises.
    const submit = await screen.findByTestId("button-submit-feedback");

    await act(async () => {
      fireEvent.click(submit);
    });

    await waitFor(() => {
      const post = calls.find(
        (c) =>
          c.method === "POST" &&
          c.url.endsWith(`/api/analyses/${ANALYSIS_ID}/feedback`),
      );
      expect(post).toBeDefined();
      const payload = post?.body ? JSON.parse(post.body) : null;
      expect(payload?.feedbackType).toBe("useful");
    });
  });
});
