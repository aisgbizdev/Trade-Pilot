/**
 * Real-browser end-to-end coverage for the Dashboard "Live Price" widget.
 *
 * These tests complement (not duplicate) the Vitest+jsdom component test
 * at `artifacts/ai-trading/src/components/__tests__/dashboard-live-prices.test.tsx`.
 * The component test runs the React tree in isolation with mocked fetch;
 * this suite exercises the real auth flow, the real `/dashboard` route,
 * the real CSS / layout, and real network behavior of the TradingView
 * CDN inside Chromium.
 *
 * Two scenarios:
 *   1. Happy path — TradingView CDN reachable. Asserts
 *      `data-testid="tradingview-market-quotes"` is mounted and its inner
 *      `.tradingview-widget-container__widget` becomes populated.
 *   2. CDN blocked — request routing aborts every `s3.tradingview.com`
 *      request. Asserts the widget falls back, `data-testid="live-prices-fallback"`
 *      mounts, and at least one `live-quote-*` card renders.
 *
 * Both tests sign a fresh user in via the real login form so we also
 * exercise route mounting + protected-route gating along the way.
 */
import { test, expect, request as pwRequest, type Page } from "@playwright/test";

interface TestUser {
  email: string;
  password: string;
}

async function registerUser(baseURL: string): Promise<TestUser> {
  const ts = Date.now();
  const slug = Math.random().toString(36).slice(2, 8);
  const email = `e2e-${ts}-${slug}@trade-pilot.test`;
  const password = "E2eTest123!";

  const ctx = await pwRequest.newContext({ baseURL });
  try {
    const res = await ctx.post("/api/auth/register", {
      data: {
        email,
        password,
        displayName: `E2E ${slug}`,
        selectedMode: "beginner",
        // Must match one of the SECURITY_QUESTIONS in
        // artifacts/api-server/src/routes/auth.ts.
        securityQuestion: "Nama hewan peliharaan pertama kamu?",
        securityAnswer: "kucing",
      },
    });
    if (!res.ok()) {
      const body = await res.text();
      throw new Error(
        `Failed to seed e2e user (status=${res.status()}): ${body}`,
      );
    }
  } finally {
    await ctx.dispose();
  }

  return { email, password };
}

async function signIn(page: Page, user: TestUser) {
  await page.goto("/login");
  await page.getByTestId("input-email").fill(user.email);
  await page.getByTestId("input-password").fill(user.password);
  await page.getByTestId("button-submit-login").click();
  await page.waitForURL(/\/dashboard$/, { timeout: 15_000 });
}

/**
 * Browsers running headless inside a sandboxed Linux container execute
 * heavy third-party JS (the TradingView embed loader) noticeably slower
 * than a real desktop browser. The widget's production default of 6s is
 * fine for users; for the happy-path e2e it lets the embed lose the race
 * before it has a chance to populate. We override the timeout via a
 * window flag honored by `tradingview-market-quotes.tsx`.
 */
const E2E_TV_LOAD_TIMEOUT_MS = 45_000;
void E2E_TV_LOAD_TIMEOUT_MS;

test.describe("Dashboard live prices (real Chromium)", () => {
  test("renders the TradingView widget when the CDN is reachable", async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addInitScript((ms) => {
      (window as unknown as { __TV_LOAD_TIMEOUT_MS_OVERRIDE__: number })
        .__TV_LOAD_TIMEOUT_MS_OVERRIDE__ = ms;
    }, E2E_TV_LOAD_TIMEOUT_MS);

    const user = await registerUser(baseURL!);
    await signIn(page, user);

    const widget = page.getByTestId("tradingview-market-quotes");
    // The OnboardingModal overlays the dashboard for new users, so we
    // assert DOM attachment rather than visual visibility.
    await expect(widget).toBeAttached({ timeout: 15_000 });

    // The TradingView embed loader either populates the inner
    // `.tradingview-widget-container__widget` div (older versions) OR
    // replaces it with an <iframe> (current behavior at the time of
    // writing). We accept either as a "rendered" state and assert via
    // the iframe count, which is the real user-visible signal that the
    // widget came up.
    await expect
      .poll(
        async () =>
          await widget.evaluate(
            (el) => el.querySelectorAll("iframe").length,
          ),
        {
          timeout: 20_000,
          message: "TradingView widget never rendered an iframe",
        },
      )
      .toBeGreaterThan(0);

    // Sanity: we did not silently drop into the fallback path.
    await expect(page.getByTestId("live-prices-fallback")).toHaveCount(0);

    // The widget container should still hold the iframe (i.e. the embed
    // is wired through `.tradingview-widget-container`, not floating in
    // some unexpected DOM location).
    await expect(
      widget.locator(".tradingview-widget-container iframe"),
    ).toHaveCount(1);
  });

  test("falls back to the live-prices ticker when the TradingView CDN is blocked", async ({
    page,
    context,
    baseURL,
  }) => {
    // Block every TradingView asset host the embed script touches before
    // the page even loads. `s3.tradingview.com` hosts the embed loader;
    // adding the others keeps the fallback hermetic if the embed tries
    // alternate hostnames.
    await context.route(/(?:^|\/\/)s3\.tradingview\.com\//, (route) =>
      route.abort("blockedbyclient"),
    );

    const user = await registerUser(baseURL!);
    await signIn(page, user);

    // Component does 2 attempts × 6s timeout + 2s retry delay before
    // giving up = ~14s. Allow generous headroom.
    const fallback = page.getByTestId("live-prices-fallback");
    await expect(fallback).toBeAttached({ timeout: 30_000 });

    const root = page.getByTestId("dashboard-live-prices");
    await expect
      .poll(() => root.getAttribute("data-load-phase"), { timeout: 30_000 })
      .toBe("fallback");

    const quotes = page.locator('[data-testid^="live-quote-"]');
    await expect
      .poll(() => quotes.count(), { timeout: 15_000 })
      .toBeGreaterThan(0);

    // The original tradingview host should be gone (or at least not
    // re-mounting) once we are in fallback.
    await expect(page.getByTestId("tradingview-market-quotes")).toHaveCount(0);
  });
});
