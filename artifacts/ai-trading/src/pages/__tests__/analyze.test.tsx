/**
 * Component test for the Analyze form (`src/pages/analyze.tsx`).
 *
 * Covers happy-path render of the instrument tabs / timeframe grid, the
 * loading-of-quota chip, the disabled-state of the submit button until
 * both an instrument and a timeframe are chosen, the empty "no recent
 * instruments" branch, and a real form submission that hits the
 * `POST /api/analyses` endpoint.
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

const RECENT_PAYLOAD = {
  instruments: [
    { instrument: "XAU/USD", mode: "beginner" },
    { instrument: "EUR/USD", mode: "pro" },
  ],
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
  recent?: typeof RECENT_PAYLOAD;
  quota?: typeof QUOTA_PAYLOAD | { unlimited: true };
  createResult?: { id: number };
  createStatus?: number;
}): FetchHandler[] {
  return [
    (url) => {
      if (url.includes("/api/analyses/recent-instruments")) {
        return jsonResponse(opts.recent ?? RECENT_PAYLOAD);
      }
      return null;
    },
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
        return jsonResponse(opts.createResult ?? { id: 42 });
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
    "renders the futures tab, timeframe grid, quota chip, recent instruments, and a disabled submit button",
    async () => {
      installFetchMock(pageHandlers({}));
      const { Wrapper } = makeWrapper();

      render(
        <Wrapper>
          <AnalyzePage />
        </Wrapper>,
      );

      // Futures tab is the default and renders its instrument grid.
      const futuresTab = await screen.findByTestId("tab-futures");
      expect(futuresTab).toBeInTheDocument();
      expect(screen.getByTestId("tab-forex")).toBeInTheDocument();
      expect(screen.getByTestId("button-instrument-XAU/USD")).toBeInTheDocument();
      expect(screen.getByTestId("button-instrument-BRENT")).toBeInTheDocument();

      // Forex symbols are not yet rendered.
      expect(
        screen.queryByTestId("button-instrument-EUR/USD"),
      ).not.toBeInTheDocument();

      // All seven timeframes appear.
      for (const tf of ["1m", "5m", "15m", "1h", "4h", "1D", "1W"] as const) {
        expect(screen.getByTestId(`button-timeframe-${tf}`)).toBeInTheDocument();
      }

      // Quota chip resolves once the query settles.
      const chip = await screen.findByTestId("chip-quota");
      expect(chip.textContent).toMatch(/4\/5/);
      expect(chip.textContent).toMatch(/9\/10/);

      // Recent instruments come from the API payload.
      expect(
        screen.getByTestId("button-recent-XAU/USD"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("button-recent-EUR/USD"),
      ).toBeInTheDocument();

      // Submit is disabled until both instrument and timeframe are chosen.
      // The default state has no instrument selected yet.
      const submit = screen.getByTestId(
        "button-submit-analysis",
      ) as HTMLButtonElement;
      expect(submit.disabled).toBe(true);
    },
  );
});

describe("AnalyzePage: empty / loading branches", () => {
  it("hides the recent-instruments section when none are returned and skips the quota chip when unlimited", async () => {
    installFetchMock(
      pageHandlers({
        recent: { instruments: [] },
        quota: { unlimited: true },
      }),
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    await screen.findByTestId("tab-futures");

    // No recent instruments -> no recent buttons render.
    expect(
      screen.queryByTestId("button-recent-XAU/USD"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("button-recent-EUR/USD"),
    ).not.toBeInTheDocument();

    // Unlimited quota -> chip is hidden.
    await waitFor(() => {
      expect(screen.queryByTestId("chip-quota")).not.toBeInTheDocument();
    });
  });
});

describe("AnalyzePage: user actions", () => {
  it("switches between futures and forex tabs and updates the visible instrument grid", async () => {
    installFetchMock(pageHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <AnalyzePage />
      </Wrapper>,
    );

    await screen.findByTestId("tab-forex");

    await act(async () => {
      fireEvent.click(screen.getByTestId("tab-forex"));
    });

    expect(screen.getByTestId("button-instrument-EUR/USD")).toBeInTheDocument();
    expect(screen.getByTestId("button-instrument-USD/JPY")).toBeInTheDocument();
    // Futures-only instruments are gone after the tab switch.
    expect(
      screen.queryByTestId("button-instrument-BRENT"),
    ).not.toBeInTheDocument();
  });

  it("enables the submit button once both instrument and timeframe are chosen, and POSTs to /api/analyses on submit", async () => {
    const { calls } = installFetchMock(
      pageHandlers({ createResult: { id: 4242 } }),
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

    // Pick an instrument and a timeframe.
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-instrument-XAU/USD"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-timeframe-1h"));
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

    // The POST eventually fires with the picked instrument + timeframe.
    await waitFor(() => {
      const post = calls.find(
        (c) => c.method === "POST" && /\/api\/analyses(\?|$)/.test(c.url),
      );
      expect(post).toBeDefined();
      const payload = post?.body ? JSON.parse(post.body) : null;
      expect(payload?.instrument).toBe("XAU/USD");
      expect(payload?.timeframe).toBe("1h");
      expect(payload?.mode).toBe("beginner");
    });
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

    // Pick a timeframe to make the submit button eligible.
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-timeframe-1D"));
    });
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
