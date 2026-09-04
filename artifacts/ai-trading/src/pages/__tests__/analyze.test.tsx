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
  it(
    "renders the instrument grid, timeframe grid, quota chip, and a disabled submit button",
    async () => {
      const { calls } = installFetchMock(pageHandlers({}));
      const { Wrapper } = makeWrapper();

      render(
        <Wrapper>
          <AnalyzePage />
        </Wrapper>,
      );

       // The instrument picker is currently scoped to a small futures
       // allowlist (VISIBLE_INSTRUMENTS in analyze.tsx). With only one
       // category having any visible instruments, the Futures/Forex/Crypto
       // tab toggle is skipped entirely and the instruments render
       // directly.
      expect(screen.queryByTestId("tab-futures")).not.toBeInTheDocument();
      expect(screen.queryByTestId("tab-forex")).not.toBeInTheDocument();
       expect(await screen.findByTestId("instrument-options")).toBeInTheDocument();
      expect(screen.getByTestId("button-instrument-XAU/USD")).toBeInTheDocument();
      expect(screen.getByTestId("button-instrument-BRENT")).toBeInTheDocument();

      // Forex symbols are not yet rendered.
      expect(
        screen.queryByTestId("button-instrument-EUR/USD"),
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

      // Saved analyses belong exclusively to History. Analyze must not
      // render the duplicated section or request the paginated list.
      expect(
        screen.queryByTestId("section-recent-analyses"),
      ).not.toBeInTheDocument();
      expect(
        calls.filter(
          (c) =>
            c.method === "GET" &&
            /\/api\/analyses(\?|$)/.test(c.url),
        ),
      ).toHaveLength(0);

      // Submit is disabled until an instrument is chosen (timeframe now
      // defaults to 1h since the picker is hidden).
      const submit = screen.getByTestId(
        "button-submit-analysis",
      ) as HTMLButtonElement;
      expect(submit.disabled).toBe(true);

      // Optional context is intentionally hidden in Beginner mode so the
      // first analysis flow stays focused on the required choices.
      expect(screen.queryByTestId("textarea-notes")).not.toBeInTheDocument();
      expect(screen.queryByTestId("notes-helper-text")).not.toBeInTheDocument();
      expect(screen.queryByTestId("notes-broker-hint")).not.toBeInTheDocument();
      expect(
        screen.queryByText("This analysis is for decision support only, not a trading signal."),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("text-risk-disclaimer-short")).toBeInTheDocument();
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
});

describe("AnalyzePage: user actions", () => {
   // Skipped: the instrument picker is currently scoped to a futures-only
   // allowlist (VISIBLE_INSTRUMENTS in analyze.tsx), so the Forex tab this
   // test switches to no longer renders. Kept rather than deleted/rewritten
   // so widening the allowlist back to multiple categories restores this
   // coverage immediately.
   it.skip("opens one instrument category at a time and preserves the selected instrument", async () => {
    installFetchMock(pageHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

     const futuresTab = await screen.findByTestId("tab-futures");
     const forexTab = screen.getByTestId("tab-forex");
     fireEvent.click(screen.getByTestId("button-instrument-XAU/USD"));

    await act(async () => {
       fireEvent.click(forexTab);
    });

    expect(screen.getByTestId("button-instrument-EUR/USD")).toBeInTheDocument();
    expect(screen.getByTestId("button-instrument-USD/JPY")).toBeInTheDocument();
     expect(forexTab).toHaveAttribute("aria-expanded", "true");
     expect(futuresTab).toHaveAttribute("aria-expanded", "false");
     expect(screen.queryByTestId("button-instrument-BRENT")).not.toBeInTheDocument();

     // Clicking the open category collapses its product list without
     // changing the selected instrument.
     fireEvent.click(forexTab);
     expect(forexTab).toHaveAttribute("aria-expanded", "false");
     expect(screen.queryByTestId("instrument-options")).not.toBeInTheDocument();

     fireEvent.click(forexTab);
     expect(screen.getByTestId("button-instrument-EUR/USD")).toBeInTheDocument();

     // Reopening Futures still shows the previously selected XAU/USD.
     fireEvent.click(futuresTab);
     expect(screen.getByTestId("button-instrument-XAU/USD")).toHaveClass("border-primary");
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
    expect(submit.disabled).toBe(true);

    // Pick an instrument — timeframe defaults to 1h since the picker is
    // hidden, so this alone enables submit.
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-XAU/USD"));
    });
    await waitFor(() => {
      expect(
        (screen.getByTestId("button-submit-analysis") as HTMLButtonElement)
          .disabled,
      ).toBe(false);
    });

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
  it("re-analyzes automatically when picking a different instrument after a result already exists (no button tap needed)", async () => {
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
        // instrument, so re-analyzing on a different instrument is
        // observably a *new* analysis rather than a reused one.
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

    // The Analisis button is no longer needed (and no longer shown) once
    // a result exists — switching instruments re-analyzes on its own.
    expect(screen.queryByTestId("button-submit-analysis")).not.toBeInTheDocument();

    // Now that a result exists, picking BRENT re-analyzes immediately —
    // no second tap on the Analisis button.
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-BRENT"));
    });

    await waitFor(() => {
      const posts = calls.filter(
        (c) => c.method === "POST" && /\/api\/analyses(\?|$)/.test(c.url),
      );
      expect(posts).toHaveLength(2);
      const payload = posts[1].body ? JSON.parse(posts[1].body) : null;
      expect(payload?.instrument).toBe("BRENT");
    });
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

  it("disables the submit button while a custom-instrument value is empty after clearing", async () => {
    installFetchMock(pageHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    const customInput = (await screen.findByTestId(
      "input-custom-instrument",
    )) as HTMLInputElement;

    // Type a custom instrument: that should clear any preset selection
    // *and* the field itself becomes the active instrument.
    await act(async () => {
      fireEvent.change(customInput, { target: { value: "PLATINUM" } });
    });
    expect(customInput.value).toBe("PLATINUM");

    // Timeframe defaults to 1h (picker is hidden) — submit is already
    // eligible off the custom instrument alone.
    await waitFor(() => {
      expect(
        (screen.getByTestId("button-submit-analysis") as HTMLButtonElement)
          .disabled,
      ).toBe(false);
    });

    // Clear the custom field — without any preset selected the submit
    // button must go back to disabled.
    await act(async () => {
      fireEvent.change(customInput, { target: { value: "" } });
    });
    await waitFor(() => {
      expect(
        (screen.getByTestId("button-submit-analysis") as HTMLButtonElement)
          .disabled,
      ).toBe(true);
    });
  });
});
