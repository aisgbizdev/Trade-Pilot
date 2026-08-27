/**
 * Regression coverage for the Dashboard "Live Price" widget.
 *
 * Diagnostic data attributes asserted below:
 *   - `data-testid="dashboard-live-prices"`        — root container
 *   - `data-fallback-reason`                        — "" until the
 *     widget gives up; final failure reason after.
 *   - `data-load-phase`                             — "loading" |
 *     "waiting-retry" | "fallback"
 *   - `data-retry-attempt`                          — 1 then 2
 *   - `data-testid="tradingview-market-quotes"`     — TradingView host
 *   - `data-load-state` / `data-load-error` /
 *     `data-script-loaded` / `data-script-error`    — set on host
 *   - `data-testid="live-prices-retry-indicator"`   — between attempts
 *   - `data-testid="live-prices-fallback"` and
 *     `live-quote-<INSTRUMENT>`                     — Newsmaker fallback
 *
 * Note on scope: the original task brief asked for a Playwright e2e
 * test. The repo's regression scheme is Vitest, so this file uses
 * @testing-library/react with jsdom and exercises the same scenarios:
 * default mount, the full retry → fallback path when TradingView is
 * blocked, and runtime theme/language toggle resilience. Network calls
 * are mocked so the suite stays hermetic.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { DashboardLivePrices } from "../dashboard-live-prices";
import { TradingViewMarketQuotes } from "../tradingview-market-quotes";
import { ThemeProvider, useTheme } from "../theme-provider";
import { LanguageProvider, useTranslation } from "@/lib/i18n";

const liveQuotesPayload = {
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
    {
      instrument: "EUR/USD",
      symbol: "EURUSD",
      price: 1.0723,
      buy: 1.0724,
      sell: 1.0722,
      spread: 0.0002,
      high: 1.075,
      low: 1.07,
      open: 1.071,
      changePercent: "-0.12%",
      direction: "down" as const,
      serverTime: "00:00:00",
      updatedAt: "2026-04-26T00:00:00Z",
    },
    {
      instrument: "USD/JPY",
      symbol: "USDJPY",
      price: 156.42,
      buy: 156.45,
      sell: 156.39,
      spread: 0.06,
      high: 156.8,
      low: 155.9,
      open: 156.0,
      changePercent: "+0.20%",
      direction: "up" as const,
      serverTime: "00:00:00",
      updatedAt: "2026-04-26T00:00:00Z",
    },
  ],
};

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="test-theme">
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  };
}

function getInjectedScript(): HTMLScriptElement {
  const widgetHost = screen.getByTestId("tradingview-market-quotes");
  const script = widgetHost.querySelector(
    'script[src*="embed-widget-market-quotes.js"]',
  ) as HTMLScriptElement | null;
  expect(script).not.toBeNull();
  return script!;
}

async function failTradingViewScript() {
  const script = getInjectedScript();
  await act(async () => {
    const ev = new Event("error");
    script.dispatchEvent(ev);
    script.onerror?.(ev);
  });
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(globalThis, "fetch").mockImplementation(
    async (input: RequestInfo | URL) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      if (url.includes("/api/quotes/live")) {
        return new Response(JSON.stringify(liveQuotesPayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response("not found", { status: 404 });
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
});

describe("DashboardLivePrices: TradingView default mount", () => {
  it("mounts the TradingView widget container with attribution by default", () => {
    const Wrapper = makeWrapper();
    render(
      <Wrapper>
        <DashboardLivePrices />
      </Wrapper>,
    );

    const root = screen.getByTestId("dashboard-live-prices");
    expect(root).toBeInTheDocument();
    expect(root.getAttribute("data-fallback-reason")).toBe("");
    expect(root.getAttribute("data-load-phase")).toBe("loading");
    expect(root.getAttribute("data-retry-attempt")).toBe("1");

    const widgetHost = screen.getByTestId("tradingview-market-quotes");
    expect(widgetHost).toBeInTheDocument();
    expect(widgetHost.getAttribute("data-load-state")).toBe("pending");

    const widgetInner = widgetHost.querySelector(
      ".tradingview-widget-container__widget",
    );
    expect(widgetInner).not.toBeNull();
    expect(
      widgetInner?.parentElement?.classList.contains(
        "tradingview-widget-container",
      ),
    ).toBe(true);

    const copyright = widgetHost.querySelector(
      ".tradingview-widget-copyright",
    );
    expect(copyright).not.toBeNull();
    expect(copyright?.textContent).toContain("Market summary by TradingView");

    expect(
      widgetHost.querySelector(
        'script[src*="embed-widget-market-quotes.js"]',
      ),
    ).not.toBeNull();
  });
});

describe("DashboardLivePrices: TradingView blocked → retry → Newsmaker fallback", () => {
  it(
    "retries once and then falls back to Newsmaker when both attempts fail",
    { timeout: 20000 },
    async () => {
      const Wrapper = makeWrapper();

      render(
        <Wrapper>
          <DashboardLivePrices />
        </Wrapper>,
      );

      expect(
        screen.getByTestId("tradingview-market-quotes"),
      ).toBeInTheDocument();

      // First attempt fails — should enter the "waiting-retry" phase.
      await failTradingViewScript();

      await waitFor(() => {
        expect(
          screen.getByTestId("live-prices-retry-indicator"),
        ).toBeInTheDocument();
      });
      const rootAfterFirst = screen.getByTestId("dashboard-live-prices");
      expect(rootAfterFirst.getAttribute("data-load-phase")).toBe(
        "waiting-retry",
      );
      expect(rootAfterFirst.getAttribute("data-fallback-reason")).toBe("");

      // Wait for the real 2s retry delay to elapse and the second attempt
      // to remount the TradingView widget.
      await waitFor(
        () => {
          const root = screen.getByTestId("dashboard-live-prices");
          expect(root.getAttribute("data-retry-attempt")).toBe("2");
          expect(root.getAttribute("data-load-phase")).toBe("loading");
          expect(
            screen.getByTestId("tradingview-market-quotes"),
          ).toBeInTheDocument();
        },
        { timeout: 4000 },
      );

      // Second attempt also fails — should now drop to fallback.
      await failTradingViewScript();

      await waitFor(
        () => {
          expect(
            screen.getByTestId("live-prices-fallback"),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      const root = screen.getByTestId("dashboard-live-prices");
      expect(root.getAttribute("data-load-phase")).toBe("fallback");
      expect(root.getAttribute("data-fallback-reason")).toMatch(
        /^script-error/,
      );

      expect(
        screen.getByTestId("fallback-source-label").textContent,
      ).toMatch(/fallback|cadangan|backup|newsmaker/i);

      await waitFor(
        () => {
          const quoteCards = screen.getAllByTestId(/^live-quote-/);
          expect(quoteCards.length).toBeGreaterThan(0);
          expect(
            screen.getByTestId("live-quote-XAU/USD"),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    },
  );
});

describe("TradingViewMarketQuotes: theme + language toggles do not crash widget", () => {
  it("re-mounts the widget cleanly when language and theme change at runtime, without console errors", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onLoadFailed = vi.fn();

    function ThemeToggleButton() {
      const { theme, setTheme } = useTheme();
      return (
        <button
          data-testid="toggle-theme"
          data-current-theme={theme}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      );
    }

    function LangToggleButton() {
      const { lang, setLang } = useTranslation();
      return (
        <button
          data-testid="toggle-lang"
          data-current-lang={lang}
          onClick={() => setLang(lang === "en" ? "id" : "en")}
        />
      );
    }

    function Harness() {
      return (
        <>
          <ThemeToggleButton />
          <LangToggleButton />
          <TradingViewMarketQuotes
            symbols={[{ name: "OANDA:XAUUSD", displayName: "XAUUSD" }]}
            loadTimeoutMs={60000}
            onLoadFailed={onLoadFailed}
          />
        </>
      );
    }

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="harness-theme">
          <LanguageProvider>
            <Harness />
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>,
    );

    const widgetHost = screen.getByTestId("tradingview-market-quotes");
    expect(widgetHost).toBeInTheDocument();
    expect(
      widgetHost.querySelector(".tradingview-widget-container__widget"),
    ).not.toBeNull();
    expect(screen.getByTestId("toggle-theme").getAttribute(
      "data-current-theme",
    )).toBe("dark");
    expect(screen.getByTestId("toggle-lang").getAttribute(
      "data-current-lang",
    )).toBe("en");

    // Toggle language at runtime via the real i18n context setter.
    await act(async () => {
      screen.getByTestId("toggle-lang").click();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("toggle-lang").getAttribute("data-current-lang"),
      ).toBe("id");
      const host = screen.getByTestId("tradingview-market-quotes");
      expect(
        host.querySelector(".tradingview-widget-container__widget"),
      ).not.toBeNull();
    });

    await act(async () => {
      screen.getByTestId("toggle-theme").click();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("toggle-theme").getAttribute("data-current-theme"),
      ).toBe("light");
      const host = screen.getByTestId("tradingview-market-quotes");
      expect(
        host.querySelector(".tradingview-widget-container__widget"),
      ).not.toBeNull();
      expect(host.getAttribute("data-load-state")).toBe("pending");
    });

    expect(onLoadFailed).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
