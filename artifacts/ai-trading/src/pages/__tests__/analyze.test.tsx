/**
 * Component test for the Analyze form (`src/pages/analyze.tsx`).
 *
 * Covers happy-path render of the instrument category selector / timeframe grid, the
 * loading-of-quota chip, the disabled-state of the submit button until
 * both an instrument and a timeframe are chosen, the absence of the
 * duplicated Recent Analyses section, and a real form submission that hits the
 * `POST /api/analyses` endpoint and direct navigation to the new detail page.
 *
 * Mocks `globalThis.fetch` for every API route consumed by the page and
 * by the surrounding `<Layout>` (`/api/auth/me`, unread-notifications
 * poll). `wouter` redirects are observed via `window.location` rather
 * than asserted directly because jsdom retains the URL after
 * `setLocation()`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import AnalyzePage from "../analyze";
import {
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

vi.mock("@/components/analysis-levels-chart", () => ({
  AnalysisLevelsChart: ({
    instrument,
    timeframe,
  }: {
    instrument: string;
    timeframe: string;
  }) => (
    <div
      data-testid="analysis-levels-chart"
      data-instrument={instrument}
      data-timeframe={timeframe}
    />
  ),
}));

const QUOTA_PAYLOAD = {
  unlimited: false,
  hourly: { remaining: 4, limit: 5 },
  daily: { remaining: 9, limit: 10 },
};

const LIVE_QUOTES_PAYLOAD = {
  status: "ok",
  updatedAt: "2026-04-26T00:00:00Z",
  serverTime: "00:00:00",
  data: [
    {
      instrument: "XAU/USD",
      symbol: "XAUUSD",
      price: 2345.12,
      buy: 2345.5,
      sell: 2344.74,
      spread: 0.76,
      high: 2350,
      low: 2340,
      open: 2342,
      changePercent: "+0.45%",
      direction: "up" as const,
      serverTime: "00:00:00",
      updatedAt: "2026-04-26T00:00:00Z",
    },
  ],
};

const PROGRESSION_PAYLOAD = {
  level: 1,
  masteryLevel: 0,
  rank: "Seedling",
};

function restoredAnalysisFixture(
  id: number,
  instrument: string,
  timeframe: string,
) {
  return {
    id,
    instrument,
    timeframe,
    mode: "pro",
    marketCondition: "trending_up",
    riskLevel: "medium",
    tradingBias: "bullish",
    confidenceMin: 60,
    confidenceMax: 75,
    validUntil: new Date(Date.now() + 24 * 3_600_000).toISOString(),
    createdAt: new Date().toISOString(),
    baseCase: "Price likely continues higher into resistance.",
    bullishScenario: "A clean break above resistance extends the move.",
    bearishScenario: "Losing the swing low flips the bias bearish.",
    techBuyCount: 12,
    techSellCount: 4,
    techNeutralCount: 6,
    feedback: null,
    tradePlan: null,
  };
}

function pageHandlers(opts: {
  quota?: typeof QUOTA_PAYLOAD | { unlimited: true };
  createResult?: { id: number };
  createStatus?: number;
}): FetchHandler[] {
  return [
    (url) => {
      if (url.includes("/api/analyses/quota")) {
        return jsonResponse(opts.quota ?? QUOTA_PAYLOAD);
      }
      return null;
    },
    (url) => {
      if (url.includes("/api/progression/summary")) {
        return jsonResponse(PROGRESSION_PAYLOAD);
      }
      return null;
    },
    (url) => {
      if (url.includes("/api/quotes/live")) {
        return jsonResponse(LIVE_QUOTES_PAYLOAD);
      }
      return null;
    },
    // Calendar preview kicks in once an instrument is selected on the
    // Analyze page. Default to an empty list so the component renders its
    // empty-state without making network noise in tests.
    (url) => {
      if (url.includes("/api/calendar/relevant")) {
        return jsonResponse({ status: "success", instrument: "", events: [] });
      }
      return null;
    },
    (url, init) => {
      // POST /api/analyses (createAnalysis)
      const method = (init?.method ?? "GET").toUpperCase();
      if (method === "POST" && /\/api\/analyses(\?|$)/.test(url)) {
        const status = opts.createStatus ?? 200;
        if (status >= 400) {
          return jsonResponse({ error: "boom" }, status);
        }
        // Real API returns the full Analysis row. The Analyze page now
        // renders an inline trade-plan chart against the response, so the
        // mock has to include at least the fields the chart section reads
        // (instrument/timeframe/createdAt). tradePlan stays null — that's
        // valid and exercises the no-overlay fallback path.
        const baseRow = {
          id: 42,
          instrument: "XAU/USD",
          timeframe: "1h",
          createdAt: new Date().toISOString(),
          tradePlan: null,
        };
        return jsonResponse({ ...baseRow, ...(opts.createResult ?? {}) });
      }
      return null;
    },
  ];
}

beforeEach(() => {
  localStorage.clear();
  // Reset wouter's perceived path so the page-level redirect on submit
  // does not leak into the next test.
  window.history.replaceState({}, "", "/analyze");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AnalyzePage: happy-path render", () => {
  it("keeps long progress messages below the narrow submit button", async () => {
    let finishAnalysis!: (response: Response) => void;
    const pendingAnalysis = new Promise<Response>((resolve) => { finishAnalysis = resolve; });
    installFetchMock([
      (url, init) => (init?.method ?? "GET").toUpperCase() === "POST" &&
        /\/api\/analyses(\?|$)/.test(url) ? pendingAnalysis : null,
      ...pageHandlers({}),
    ], { strict: false });
    const { Wrapper } = makeWrapper();
    render(<Wrapper><AnalyzePage /></Wrapper>);

    const button = await screen.findByTestId("button-submit-analysis");
    fireEvent.click(button);
    const progress = await screen.findByTestId("analysis-loading-status");
    expect(progress).toHaveAttribute("role", "status");
    expect(progress).toHaveTextContent(/Analyzing market conditions/i);
    expect(button).toHaveTextContent("Processing");
    expect(button).not.toHaveTextContent(/Analyzing market conditions/i);

    await act(async () => {
      finishAnalysis(jsonResponse({
        id: 42, instrument: "XAU/USD", timeframe: "1h",
        createdAt: new Date().toISOString(), tradePlan: null,
      }));
    });
    expect(screen.queryByTestId("analysis-loading-status")).not.toBeInTheDocument();
  });

  it(
    "renders XAU/USD and its chart by default with the analysis action ready",
    async () => {
      const { calls } = installFetchMock(pageHandlers({}));
      const { Wrapper } = makeWrapper();

      render(
        <Wrapper>
          <AnalyzePage />
        </Wrapper>,
      );

      // The default picker retains its four core choices. Additional
      // verified choices and their search remain collapsed until requested.
      expect(screen.queryByTestId("tab-futures")).not.toBeInTheDocument();
      expect(screen.queryByTestId("tab-forex")).not.toBeInTheDocument();
      expect(screen.getByTestId("instrument-options")).toBeInTheDocument();
      expect(screen.getByTestId("button-instrument-XAU/USD")).toBeInTheDocument();
      expect(screen.getByTestId("button-instrument-BRENT")).toBeInTheDocument();
      expect(screen.getByTestId("button-instrument-HSI")).toBeInTheDocument();
      expect(screen.getByTestId("button-instrument-NIKKEI")).toBeInTheDocument();
      expect(screen.getAllByTestId(/^button-instrument-/)).toHaveLength(4);
      expect(screen.queryByTestId("button-instrument-EUR/USD")).not.toBeInTheDocument();
      expect(screen.queryByTestId("input-instrument-search")).not.toBeInTheDocument();
      expect(screen.queryByTestId("other-instrument-options")).not.toBeInTheDocument();
      expect(screen.getByTestId("button-other-instruments")).toHaveAttribute("aria-expanded", "false");
      expect(screen.getByTestId("button-instrument-XAU/USD")).toHaveClass("border-primary");
      expect(screen.getByTestId("mini-chart-section")).toBeInTheDocument();
      expect(screen.getByTestId("mini-chart-section")).toHaveAttribute(
        "data-chart-source",
        "tradingview",
      );
      expect(screen.getByTestId("tradingview-advanced-chart")).toHaveAttribute(
        "data-symbol",
        "OANDA:XAUUSD",
      );

      fireEvent.click(screen.getByTestId("button-instrument-BRENT"));
      expect(screen.getByTestId("mini-chart-section")).toHaveAttribute(
        "data-chart-source",
        "analysis-backend",
      );
      expect(screen.getByTestId("analysis-levels-chart")).toHaveAttribute(
        "data-instrument",
        "BRENT",
      );
      expect(
        screen.queryByTestId("tradingview-advanced-chart"),
      ).not.toBeInTheDocument();

      // The timeframe picker is hidden — every first analysis defaults to
      // 1h (SHOW_TIMEFRAME_PICKER = false in analyze.tsx).
      for (const tf of ["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W"] as const) {
        expect(screen.queryByTestId(`button-timeframe-${tf}`)).not.toBeInTheDocument();
      }

      // Quota chip resolves once the query settles.
      const chip = await screen.findByTestId("chip-quota");
      expect(chip.textContent).toMatch(/4\/5/);
      expect(chip.textContent).toMatch(/9\/10/);

      const progression = await screen.findByTestId("button-dashboard-progression");
      expect(progression).toHaveTextContent(/Level 1/i);
      expect(progression).toHaveTextContent(/Seedling/i);

      // Saved analyses belong exclusively to History. Analyze must not
      // render the duplicated section or request the paginated list.
      // (The shared <Layout> does fetch `?page=1&limit=1` — just the id of
      // the last analysis, to point the "Analisis" nav tab at it — which
      // is not "the list", so it's excluded here.)
      expect(
        screen.queryByTestId("section-recent-analyses"),
      ).not.toBeInTheDocument();
      expect(
        calls.filter(
          (c) =>
            c.method === "GET" &&
            /\/api\/analyses(\?|$)/.test(c.url) &&
            !/[?&]limit=1(&|$)/.test(c.url),
        ),
      ).toHaveLength(0);

      // XAU/USD and 1h are the initial defaults, so the chart is visible and
      // the user can run the analysis without an extra selection click.
      const submit = screen.getByTestId(
        "button-submit-analysis",
      ) as HTMLButtonElement;
      expect(submit.disabled).toBe(false);

      // Optional context is intentionally hidden in Beginner mode so the
      // first analysis flow stays focused on the required choices.
      expect(screen.queryByTestId("textarea-notes")).not.toBeInTheDocument();
      expect(screen.queryByTestId("notes-helper-text")).not.toBeInTheDocument();
      expect(screen.queryByTestId("notes-broker-hint")).not.toBeInTheDocument();
      expect(
        screen.queryByText("This analysis is for decision support only, not a trading signal."),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("text-risk-disclaimer-short")).not.toBeInTheDocument();
    },
  );
});

describe("AnalyzePage: empty / loading branches", () => {
  it("skips the quota chip when unlimited", async () => {
    installFetchMock(
      pageHandlers({
        quota: { unlimited: true },
      }),
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    await screen.findByTestId("instrument-options");

    // Unlimited quota -> chip is hidden.
    await waitFor(() => {
      expect(screen.queryByTestId("chip-quota")).not.toBeInTheDocument();
    });
  });

  it("hides the progression badge when summary data is unavailable", async () => {
    installFetchMock([
      (url) => {
        if (url.includes("/api/progression/summary")) {
          return jsonResponse({ error: "unavailable" }, 503);
        }
        return null;
      },
      ...pageHandlers({}),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    await screen.findByTestId("instrument-options");
    expect(screen.queryByTestId("button-dashboard-progression")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-submit-analysis")).toBeEnabled();
  });
});

describe("AnalyzePage: user actions", () => {
  it("opens the progression page from the dashboard badge", async () => {
    installFetchMock(pageHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    fireEvent.click(await screen.findByTestId("button-dashboard-progression"));
    expect(window.location.pathname).toBe("/progression");
  });

   it("filters verified instruments by search and preserves the selected choice", async () => {
    installFetchMock(pageHandlers({}), { strict: false });
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    fireEvent.click(await screen.findByTestId("button-instrument-XAU/USD"));
    fireEvent.click(screen.getByTestId("button-other-instruments"));
    const search = screen.getByTestId("input-instrument-search");
    fireEvent.change(search, { target: { value: "EUR" } });

    const filteredOptions = screen.getByTestId("other-instrument-options");
    expect(filteredOptions).toHaveTextContent("EUR/USD");
    expect(filteredOptions).not.toHaveTextContent("BRENT");
    expect(screen.getByTestId("button-request-instrument")).toHaveTextContent("EUR");
    expect(screen.getByTestId("button-instrument-XAU/USD")).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByTestId("button-instrument-EUR/USD"));
    expect(screen.getByTestId("button-instrument-EUR/USD")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("button-instrument-EUR/USD")).toHaveTextContent(/^EUR\/USD$/);
    expect(search).toHaveValue("");
    expect(screen.getByTestId("button-instrument-XAU/USD")).toBeInTheDocument();
  });

  it("enables the submit button once both instrument and timeframe are chosen, renders the result inline (no navigation) on submit", async () => {
    const createdId = 4242;
    const { calls } = installFetchMock(
      [
        ...pageHandlers({ createResult: { id: createdId } }),
        // The embedded result view re-fetches the analysis by id — a
        // realistic-enough payload lets it render without crashing.
        // strict:false below covers everything else it touches
        // (alerts, push status, journal, chart candles, etc.) with a
        // benign 404, since exercising that internals is already
        // covered by analysis-detail.test.tsx.
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method !== "GET") return null;
          if (!new RegExp(`/api/analyses/${createdId}(?:\\?|$)`).test(url)) return null;
          return jsonResponse({
            id: createdId,
            instrument: "XAU/USD",
            timeframe: "1h",
            mode: "pro",
            marketCondition: "trending_up",
            riskLevel: "medium",
            tradingBias: "bullish",
            confidenceMin: 60,
            confidenceMax: 75,
            validUntil: new Date(Date.now() + 24 * 3_600_000).toISOString(),
            createdAt: new Date().toISOString(),
            baseCase: "Price likely continues higher into resistance.",
            bullishScenario: "A clean break above resistance extends the move.",
            bearishScenario: "Losing the swing low flips the bias bearish.",
            techBuyCount: 12,
            techSellCount: 4,
            techNeutralCount: 6,
            feedback: null,
          });
        },
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    const submit = (await screen.findByTestId(
      "button-submit-analysis",
    )) as HTMLButtonElement;
    expect(submit.disabled).toBe(false);

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-submit-analysis"));
    });

    // The POST eventually fires with the picked instrument + default timeframe.
    await waitFor(() => {
      const posts = calls.filter(
        (c) => c.method === "POST" && /\/api\/analyses(\?|$)/.test(c.url),
      );
      expect(posts).toHaveLength(1);
      const post = posts[0];
      const payload = post.body ? JSON.parse(post.body) : null;
      expect(payload?.instrument).toBe("XAU/USD");
      expect(payload?.timeframe).toBe("1h");
      expect(payload?.mode).toBe("pro");
      expect(payload?.userInputContext).toBeUndefined();
    });

    // The result renders inline right on the Analyze page — no navigation
    // to a separate /analyses/:id route.
    expect(await screen.findByTestId("embedded-analysis-result")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/analyze");
  });

  // Skipped: the mode toggle was removed from the Analyze page (every
  // analysis now runs in "pro" mode, hardcoded — see analyze.tsx) and the
  // Notes field it used to reveal is separately hidden behind
  // SHOW_NOTES_INPUT. Kept rather than deleted so restoring either toggle
  // brings this coverage back immediately.
  it("does not analyze on instrument selection, including after a result exists", async () => {
    const idByInstrument: Record<string, number> = { "XAU/USD": 4242, "BRENT": 4243 };

    const analysisFixture = (id: number, instrument: string) => ({
      id,
      instrument,
      timeframe: "1h",
      mode: "pro",
      marketCondition: "trending_up",
      riskLevel: "medium",
      tradingBias: "bullish",
      confidenceMin: 60,
      confidenceMax: 75,
      validUntil: new Date(Date.now() + 24 * 3_600_000).toISOString(),
      createdAt: new Date().toISOString(),
      baseCase: "Price likely continues higher into resistance.",
      bullishScenario: "A clean break above resistance extends the move.",
      bearishScenario: "Losing the swing low flips the bias bearish.",
      techBuyCount: 12,
      techSellCount: 4,
      techNeutralCount: 6,
      feedback: null,
    });

    const { calls } = installFetchMock(
      [
        (url) => {
          if (url.includes("/api/analyses/quota")) return jsonResponse(QUOTA_PAYLOAD);
          return null;
        },
        (url) => {
          if (url.includes("/api/quotes/live")) return jsonResponse(LIVE_QUOTES_PAYLOAD);
          return null;
        },
        (url) => {
          if (url.includes("/api/calendar/relevant")) {
            return jsonResponse({ status: "success", instrument: "", events: [] });
          }
          return null;
        },
        // POST /api/analyses — the id it returns depends on the requested
        // instrument, making an explicit follow-up submit observable.
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method !== "POST" || !/\/api\/analyses(\?|$)/.test(url)) return null;
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const id = idByInstrument[body.instrument as string];
          return jsonResponse(analysisFixture(id, body.instrument));
        },
        // GET /api/analyses/:id — the embedded result view re-fetches by id.
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method !== "GET") return null;
          for (const [instrument, id] of Object.entries(idByInstrument)) {
            if (new RegExp(`/api/analyses/${id}(?:\\?|$)`).test(url)) {
              return jsonResponse(analysisFixture(id, instrument));
            }
          }
          return null;
        },
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    // First analysis still requires the explicit button tap.
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-XAU/USD"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-submit-analysis"));
    });
    await screen.findByTestId("embedded-analysis-result");
    await waitFor(() => {
      expect(
        calls.filter((c) => c.method === "POST" && /\/api\/analyses(\?|$)/.test(c.url)),
      ).toHaveLength(1);
    });

    // Choosing a different verified instrument changes the selection only.
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-BRENT"));
    });

    expect(screen.getByTestId("button-instrument-BRENT")).toHaveAttribute("aria-pressed", "true");
    expect(
      calls.filter((c) => c.method === "POST" && /\/api\/analyses(\?|$)/.test(c.url)),
    ).toHaveLength(1);
  });

  it("stays on /analyze (no navigation) when using 'Ganti Timeframe' inside the embedded result", async () => {
    let nextId = 5001;
    const created: Array<{ id: number; instrument: string; timeframe: string }> = [];
    const analysisFixture = (row: { id: number; instrument: string; timeframe: string }) => ({
      id: row.id,
      instrument: row.instrument,
      timeframe: row.timeframe,
      mode: "pro",
      marketCondition: "trending_up",
      riskLevel: "medium",
      tradingBias: "bullish",
      confidenceMin: 60,
      confidenceMax: 75,
      validUntil: new Date(Date.now() + 24 * 3_600_000).toISOString(),
      createdAt: new Date().toISOString(),
      baseCase: "Price likely continues higher into resistance.",
      bullishScenario: "A clean break above resistance extends the move.",
      bearishScenario: "Losing the swing low flips the bias bearish.",
      techBuyCount: 12,
      techSellCount: 4,
      techNeutralCount: 6,
      feedback: null,
    });

    installFetchMock(
      [
        (url) => {
          if (url.includes("/api/analyses/quota")) return jsonResponse(QUOTA_PAYLOAD);
          return null;
        },
        (url) => {
          if (url.includes("/api/quotes/live")) return jsonResponse(LIVE_QUOTES_PAYLOAD);
          return null;
        },
        (url) => {
          if (url.includes("/api/calendar/relevant")) {
            return jsonResponse({ status: "success", instrument: "", events: [] });
          }
          return null;
        },
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method !== "POST" || !/\/api\/analyses(\?|$)/.test(url)) return null;
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const row = { id: nextId++, instrument: body.instrument, timeframe: body.timeframe };
          created.push(row);
          return jsonResponse(analysisFixture(row));
        },
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method !== "GET") return null;
          const match = /\/api\/analyses\/(\d+)(?:\?|$)/.exec(url);
          if (!match) return null;
          const row = created.find((r) => r.id === Number(match[1]));
          return row ? jsonResponse(analysisFixture(row)) : null;
        },
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-XAU/USD"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-submit-analysis"));
    });
    await screen.findByTestId("embedded-analysis-result");
    expect(created).toHaveLength(1);

    // "Ganti Timeframe" debounces 650ms before firing the re-analysis.
    vi.useFakeTimers();
    fireEvent.click(screen.getByTestId("button-quick-timeframe-4h"));
    await act(async () => {
      vi.advanceTimersByTime(700);
      await Promise.resolve();
    });
    vi.useRealTimers();

    await waitFor(() => {
      expect(created).toHaveLength(2);
      expect(created[1]).toMatchObject({ instrument: "XAU/USD", timeframe: "4h" });
    });

    // The refresh must update the embedded result in place, not navigate
    // away to /analyses/:id.
    expect(window.location.pathname).toBe("/analyze");
    expect(screen.getByTestId("embedded-analysis-result")).toBeInTheDocument();
  });

  it.skip("switches the analysis mode and submits the selected Pro mode", async () => {
    const { calls } = installFetchMock(pageHandlers({}), { strict: false });
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    const proButton = await screen.findByTestId("button-analyze-mode-pro");
    expect(proButton).toHaveAttribute("aria-pressed", "false");

    await act(async () => {
      fireEvent.click(proButton);
    });

    await waitFor(() => {
      expect(proButton).toHaveAttribute("aria-pressed", "true");
      const patch = calls.find(
        (c) => c.method === "PATCH" && c.url.includes("/api/auth/profile"),
      );
      expect(patch?.body ? JSON.parse(patch.body) : null).toEqual({ selectedMode: "pro" });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-XAU/USD"));
      fireEvent.click(screen.getByTestId("button-timeframe-1h"));
    });
    await act(async () => {
      fireEvent.change(screen.getByTestId("textarea-notes"), {
        target: { value: "I see a double-top on H4" },
      });
    });
    await waitFor(() => {
      expect(
        (screen.getByTestId("button-submit-analysis") as HTMLButtonElement).disabled,
      ).toBe(false);
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-submit-analysis"));
    });

    await waitFor(() => {
      const posts = calls.filter(
        (c) => c.method === "POST" && /\/api\/analyses(\?|$)/.test(c.url),
      );
      expect(posts).toHaveLength(1);
      expect(posts[0]?.body ? JSON.parse(posts[0].body) : null).toMatchObject({ mode: "pro" });
      expect(posts[0]?.body ? JSON.parse(posts[0].body) : null).toMatchObject({
        userInputContext: "I see a double-top on H4",
      });
      expect(window.location.pathname).toBe("/analyses/42");
    });
    expect(screen.queryByTestId("analyze-result-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-view-full-analysis")).not.toBeInTheDocument();
  });

  // Skipped: the Notes field is now hidden unconditionally
  // (SHOW_NOTES_INPUT = false in analyze.tsx), not gated by mode/language
  // anymore. Kept rather than deleted so re-enabling the field restores
  // this coverage immediately.
  it.skip("hides optional analysis context for Indonesian beginners but keeps it available in Pro mode", async () => {
    localStorage.setItem("app_lang", "id");
    installFetchMock(pageHandlers({}), { strict: false });
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    await screen.findByTestId("instrument-options");
    expect(screen.queryByTestId("textarea-notes")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-analyze-mode-pro"));
    });
    await screen.findByTestId("textarea-notes");

    expect(screen.getByTestId("textarea-notes")).toHaveAttribute(
      "placeholder",
      "Mis. breakout di atas resistance",
    );
    expect(screen.getByText(
      "Ada pengamatan dari chart atau berita? Tulis di sini — AI akan memakainya sebagai konteks tambahan. Boleh dikosongkan.",
    )).toBeInTheDocument();
    expect(screen.getByText(
      "Jangan gunakan kolom ini untuk pertanyaan tentang broker atau perusahaan pialang.",
    )).toBeInTheDocument();
    expect((screen.getByTestId("textarea-notes") as HTMLTextAreaElement).value).toBe("");
  });

  it("uses search only to filter verified choices, not as free-text instrument input", async () => {
    installFetchMock(pageHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    fireEvent.click(await screen.findByTestId("button-other-instruments"));
    const searchInput = (await screen.findByTestId(
      "input-instrument-search",
    )) as HTMLInputElement;

    // Search text filters the verified options; it never becomes an
    // instrument selection or an analysis input.
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "PLATINUM" } });
    });
    expect(searchInput.value).toBe("PLATINUM");
    expect(screen.getByTestId("instrument-no-match")).toBeInTheDocument();
    expect(screen.queryByTestId("button-instrument-PLATINUM")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-instrument-XAU/USD")).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByTestId("input-custom-instrument")).not.toBeInTheDocument();
  });

  it("allows selecting a verified forex instrument without starting an analysis", async () => {
    const { calls } = installFetchMock(pageHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    fireEvent.click(await screen.findByTestId("button-other-instruments"));
    const forex = await screen.findByTestId("button-instrument-EUR/USD");
    fireEvent.click(forex);

    expect(forex).toHaveAttribute("aria-pressed", "true");
    expect(forex).toHaveTextContent(/^EUR\/USD$/);
    expect(screen.getByTestId("selected-instrument-status")).toHaveTextContent(/EUR\/USD.*Analysis only/i);
    expect(screen.getByTestId("button-submit-analysis")).toBeEnabled();
    expect(
      calls.filter((call) => call.method === "POST" && /\/api\/analyses(\?|$)/.test(call.url)),
    ).toHaveLength(0);
  });

  it("requires confirmation to request an unsupported code and does not analyze it", async () => {
    const { calls } = installFetchMock(
      [
        (url, init) => {
          if (
            url.includes("/api/instrument-requests") &&
            (init?.method ?? "GET").toUpperCase() === "POST"
          ) {
            return jsonResponse({ ok: true });
          }
          return null;
        },
        ...pageHandlers({}),
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    fireEvent.click(await screen.findByTestId("button-other-instruments"));
    fireEvent.change(await screen.findByTestId("input-instrument-search"), {
      target: { value: "PLATINUM" },
    });
    fireEvent.click(screen.getByTestId("button-request-instrument"));

    const dialog = await screen.findByTestId("dialog-request-instrument");
    expect(dialog).toHaveTextContent("PLATINUM");
    expect(screen.getByTestId("button-confirm-instrument-request")).toBeInTheDocument();
    expect(
      calls.filter((call) => call.method === "POST" && /\/api\/analyses(\?|$)/.test(call.url)),
    ).toHaveLength(0);

    fireEvent.click(screen.getByTestId("button-confirm-instrument-request"));
    await screen.findByTestId("instrument-request-status");

    const requests = calls.filter(
      (call) => call.method === "POST" && call.url.includes("/api/instrument-requests"),
    );
    expect(requests).toHaveLength(1);
    expect(requests[0]?.body ? JSON.parse(requests[0].body) : null).toEqual({ code: "PLATINUM" });
    expect(
      calls.filter((call) => call.method === "POST" && /\/api\/analyses(\?|$)/.test(call.url)),
    ).toHaveLength(0);
  });
});

describe("AnalyzePage: restoring an inline result", () => {
  it("hydrates the instrument, chart, price context, and timeframe from a BRENT result", async () => {
    const analysisId = 7701;
    window.history.replaceState({}, "", `/analyze?result=${analysisId}`);
    installFetchMock(
      [
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method === "GET" && new RegExp(`/api/analyses/${analysisId}(?:\\?|$)`).test(url)) {
            return jsonResponse(restoredAnalysisFixture(analysisId, "BRENT", "4h"));
          }
          return null;
        },
        ...pageHandlers({}),
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    expect(await screen.findByTestId("embedded-analysis-result")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("button-instrument-BRENT")).toHaveClass("border-primary");
      expect(screen.getByTestId("analysis-levels-chart")).toHaveAttribute("data-instrument", "BRENT");
      expect(screen.getByTestId("analysis-levels-chart")).toHaveAttribute("data-timeframe", "4h");
    });
  });

  it("keeps explicit instrument and timeframe URL parameters ahead of the restored record", async () => {
    const analysisId = 7702;
    window.history.replaceState(
      {},
      "",
      `/analyze?result=${analysisId}&instrument=HSI&timeframe=1D`,
    );
    installFetchMock(
      [
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method === "GET" && new RegExp(`/api/analyses/${analysisId}(?:\\?|$)`).test(url)) {
            return jsonResponse(restoredAnalysisFixture(analysisId, "BRENT", "4h"));
          }
          return null;
        },
        ...pageHandlers({}),
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("button-instrument-HSI")).toHaveClass("border-primary");
      expect(screen.getByTestId("analysis-levels-chart")).toHaveAttribute("data-instrument", "HSI");
      expect(screen.getByTestId("analysis-levels-chart")).toHaveAttribute("data-timeframe", "1D");
    });
  });

  it("does not overwrite an explicit user instrument choice when restore resolves late", async () => {
    const analysisId = 7703;
    let resolveAnalysis!: (response: Response) => void;
    const delayedAnalysis = new Promise<Response>((resolve) => {
      resolveAnalysis = resolve;
    });
    window.history.replaceState({}, "", `/analyze?result=${analysisId}`);
    installFetchMock(
      [
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method === "GET" && new RegExp(`/api/analyses/${analysisId}(?:\\?|$)`).test(url)) {
            return delayedAnalysis;
          }
          return null;
        },
        ...pageHandlers({}),
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    await screen.findByTestId("button-instrument-NIKKEI");
    fireEvent.click(screen.getByTestId("button-instrument-NIKKEI"));
    expect(screen.getByTestId("button-instrument-NIKKEI")).toHaveAttribute("aria-pressed", "true");

    await act(async () => {
      resolveAnalysis(jsonResponse(restoredAnalysisFixture(analysisId, "BRENT", "4h")));
    });

    await waitFor(() => {
      expect(screen.getByTestId("button-instrument-NIKKEI")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByTestId("analysis-levels-chart")).toHaveAttribute("data-instrument", "NIKKEI");
    });
  });

  it("does not create a new analysis when an instrument is picked while the restored result is loading", async () => {
    const analysisId = 7704;
    let resolveAnalysis!: (response: Response) => void;
    const delayedAnalysis = new Promise<Response>((resolve) => {
      resolveAnalysis = resolve;
    });
    let createCount = 0;
    window.history.replaceState({}, "", `/analyze?result=${analysisId}`);
    installFetchMock(
      [
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method === "GET" && new RegExp(`/api/analyses/${analysisId}(?:\\?|$)`).test(url)) {
            return delayedAnalysis;
          }
          if (method === "POST" && /\/api\/analyses(\?|$)/.test(url)) {
            createCount += 1;
          }
          return null;
        },
        ...pageHandlers({}),
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    const brentButton = await screen.findByTestId("button-instrument-BRENT");
    fireEvent.click(brentButton);

    expect(brentButton).toHaveClass("border-primary");
    expect(createCount).toBe(0);

    await act(async () => {
      resolveAnalysis(jsonResponse(restoredAnalysisFixture(analysisId, "XAU/USD", "1h")));
    });

    await waitFor(() => {
      expect(brentButton).toHaveClass("border-primary");
      expect(createCount).toBe(0);
    });
  });
});

// Risk-map interaction moved to AnalysisDetailPage beside the timeframe pills.
describe.skip("AnalyzePage: legacy Timeframe Risk Map placement", () => {
  const mockRiskMap = {
    instrument: "XAU/USD",
    generatedAt: new Date().toISOString(),
    timeframes: [
      {
        timeframe: "1h",
        status: "available",
        riskScore: 20,
        riskCategory: "low",
        reasonCodes: ["trend_aligned"],
        metrics: null,
        dataQuality: "good",
        confidence: "high",
        recommendation: "eligible",
      },
      {
        timeframe: "4h",
        status: "available",
        riskScore: 85,
        riskCategory: "high",
        reasonCodes: ["overbought", "resistance_near"],
        metrics: null,
        dataQuality: "good",
        confidence: "medium",
        recommendation: "wait",
      },
    ],
    overall: {
      state: "wait",
      reasonCode: "mixed_signals",
    },
  };

  it("does not fetch initially, explicitly loads on click, updates state without submitting, and handles errors gracefully", async () => {
    const { calls } = installFetchMock(
      [
        ...pageHandlers({}),
        (url) => {
          if (url.includes("/api/risk-map/timeframes")) {
            if (url.includes("error=true")) {
              return jsonResponse({ error: "fail" }, 500);
            }
            return jsonResponse(mockRiskMap);
          }
          return null;
        },
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>
    );

    // Initial state: closed, no fetch
    await screen.findByTestId("instrument-options");
    expect(screen.getByTestId("button-open-risk-map")).toBeInTheDocument();
    expect(screen.queryByTestId("section-risk-map-open")).not.toBeInTheDocument();
    
    // Wait a tick to ensure no background fetches fire
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    
    expect(
      calls.filter((c) => c.url.includes("/api/risk-map/timeframes"))
    ).toHaveLength(0);

    // Open it
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-open-risk-map"));
    });
    
    // Wait for the open state
    await screen.findByTestId("section-risk-map-open");
    
    // Should have fetched
    expect(
      calls.filter((c) => c.url.includes("/api/risk-map/timeframes"))
    ).toHaveLength(1);

    // Renders data
    expect(await screen.findByText("Overall: Wait")).toBeInTheDocument();
    expect(
      screen.getByText("Use the comparison below to choose a suitable risk level."),
    ).toBeInTheDocument();
    
    // Timeframes
    expect(screen.getByTestId("risk-map-tf-1h")).toBeInTheDocument();
    expect(screen.getByTestId("risk-map-tf-4h")).toBeInTheDocument();

    // The '1h' is the default timeframe, so its select button should be disabled
    const select1hBtn = screen.getByTestId("btn-select-tf-1h") as HTMLButtonElement;
    expect(select1hBtn.disabled).toBe(true);
    expect(select1hBtn).toHaveTextContent("Selected");

    // The '4h' is not selected
    const select4hBtn = screen.getByTestId("btn-select-tf-4h") as HTMLButtonElement;
    expect(select4hBtn.disabled).toBe(false);
    expect(select4hBtn).toHaveTextContent("Select 4h");

    // Click to select 4h
    await act(async () => {
      fireEvent.click(select4hBtn);
    });

    // Selecting a timeframe closes the optional dialog.
    await waitFor(() => {
      expect(screen.queryByTestId("section-risk-map-open")).not.toBeInTheDocument();
    });

    // The POST /api/analyses should NOT have been called due to this click
    expect(
      calls.filter((c) => c.method === "POST" && c.url.includes("/api/analyses"))
    ).toHaveLength(0);
    
    // If we change instrument, the risk map should close automatically
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-BRENT"));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId("button-open-risk-map")).toBeInTheDocument();
      expect(screen.queryByTestId("section-risk-map-open")).not.toBeInTheDocument();
    });
  });

  it("handles failure without blocking the rest of the page", async () => {
    installFetchMock(
      [
        ...pageHandlers({}),
        (url) => {
          if (url.includes("/api/risk-map/timeframes")) {
            return jsonResponse({ error: "fail" }, 500);
          }
          return null;
        },
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>
    );

    await screen.findByTestId("instrument-options");
    
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-open-risk-map"));
    });

    expect(await screen.findByText("Could not load risk map.")).toBeInTheDocument();
    
    // The main submit button should still be available
    expect(screen.getByTestId("button-submit-analysis")).toBeInTheDocument();
    expect((screen.getByTestId("button-submit-analysis") as HTMLButtonElement).disabled).toBe(false);
  });

  it("searching for an unsupported instrument does not change the selected advisor", async () => {
    installFetchMock(pageHandlers({}), { strict: false });
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>
    );

    await screen.findByTestId("instrument-options");
    
    // Official instrument has it
    expect(screen.getByTestId("button-open-risk-map")).toBeInTheDocument();

    // An unsupported search is a request action, not a selection.
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-other-instruments"));
      fireEvent.change(screen.getByTestId("input-instrument-search"), { target: { value: "PLATINUM" } });
    });
    
    expect(screen.getByTestId("instrument-no-match")).toBeInTheDocument();
    expect(screen.getByTestId("button-instrument-XAU/USD")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("button-open-risk-map")).toBeInTheDocument();
  });
});
