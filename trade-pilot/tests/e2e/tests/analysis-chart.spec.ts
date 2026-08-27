/**
 * Real-browser end-to-end coverage for the TradingView chart section on
 * the analysis detail page (added in task #98).
 *
 * Scenarios:
 *   1. Happy path — TradingView CDN reachable. Asserts the chart card
 *      mounts with the expected symbol/interval data attributes and an
 *      iframe gets injected (Symbol Overview widget rendered).
 *   2. Open full chart — clicks "Open full chart", asserts the modal
 *      opens, the Advanced Chart container has non-zero rendered height
 *      (regression guard for the zero-height bug architect caught), and
 *      the dialog closes cleanly via the Escape key.
 *   3. CDN blocked — aborts every `s3.tradingview.com` request and
 *      asserts the friendly fallback message renders inside the card.
 *
 * The analysis itself is stubbed at the network layer so the test does
 * not need a live OpenAI key or any persisted row (same pattern as
 * `analyze-30m.spec.ts`). We render an analysis for `XAU/USD` on `1h`
 * so the chart resolves to `OANDA:XAUUSD` and TradingView interval `60`,
 * keyed off `lib/tradingview-symbols.ts`.
 */
import { test, expect, request as pwRequest, type Page } from "@playwright/test";

interface TestUser {
  email: string;
  password: string;
}

async function registerUser(baseURL: string): Promise<TestUser> {
  const ts = Date.now();
  const slug = Math.random().toString(36).slice(2, 8);
  const email = `e2e-chart-${ts}-${slug}@trade-pilot.test`;
  const password = "E2eTest123!";

  const ctx = await pwRequest.newContext({ baseURL });
  try {
    const res = await ctx.post("/api/auth/register", {
      data: {
        email,
        password,
        displayName: `E2E ${slug}`,
        selectedMode: "beginner",
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

const STUB_ANALYSIS_ID = 9_999_990;
const EXPECTED_TV_SYMBOL = "OANDA:XAUUSD";
const EXPECTED_TV_INTERVAL = "60"; // 1h → "60" per tradingview-symbols.ts

function buildStubAnalysis() {
  const now = new Date();
  const validUntil = new Date(now.getTime() + 60 * 60_000);
  return {
    id: STUB_ANALYSIS_ID,
    userId: 0,
    instrument: "XAU/USD",
    timeframe: "1h",
    mode: "beginner" as const,
    userInputContext: null,
    rawAiOutput: null,
    validUntil: validUntil.toISOString(),
    marketCondition: "trending_up" as const,
    riskLevel: "medium" as const,
    confidenceMin: 60,
    confidenceMax: 75,
    mainScenario: "Stub main scenario.",
    alternativeScenario: "Stub alternative scenario.",
    whyReason: "Stub reasoning.",
    failureConditions: "Stub invalidation.",
    baseCase: null,
    bullishScenario: null,
    bearishScenario: null,
    keyDriversTechnical: null,
    keyDriversFundamental: null,
    marketContext: null,
    invalidationConditions: null,
    uncertaintyNotes: null,
    tradingBias: "bullish",
    opportunity: "Stub opportunity.",
    risk: "Stub risk.",
    techBuyCount: 4,
    techSellCount: 2,
    techNeutralCount: 2,
    tradePlan: null,
    fundamentalContext: null,
    fundamentalCitations: null,
    createdAt: now.toISOString(),
    feedback: null,
  };
}

async function stubAnalysisRoute(page: Page) {
  await page.route(`**/api/analyses/${STUB_ANALYSIS_ID}`, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(buildStubAnalysis()),
      });
      return;
    }
    await route.fallback();
  });
}

// Headless Chromium inside a sandboxed container can be slower than a
// real desktop browser at executing the TradingView embed loader; bump
// the per-widget load-timeout override the components honor.
const E2E_TV_LOAD_TIMEOUT_MS = 45_000;

test.describe("Analysis chart section (real Chromium)", () => {
  test("mounts the chart card with the expected TradingView symbol & interval", async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addInitScript((ms) => {
      (window as unknown as { __TV_LOAD_TIMEOUT_MS_OVERRIDE__: number })
        .__TV_LOAD_TIMEOUT_MS_OVERRIDE__ = ms;
    }, E2E_TV_LOAD_TIMEOUT_MS);

    await stubAnalysisRoute(page);

    const user = await registerUser(baseURL!);
    await signIn(page, user);

    await page.goto(`/analyses/${STUB_ANALYSIS_ID}`);

    const card = page.getByTestId("card-analysis-chart");
    await expect(card).toBeAttached({ timeout: 15_000 });
    await expect(card).toHaveAttribute("data-tv-symbol", EXPECTED_TV_SYMBOL);
    await expect(card).toHaveAttribute(
      "data-tv-interval",
      EXPECTED_TV_INTERVAL,
    );

    const overview = page.getByTestId("tradingview-symbol-overview");
    await expect(overview).toBeAttached({ timeout: 15_000 });
    await expect(overview).toHaveAttribute("data-symbol", EXPECTED_TV_SYMBOL);

    // Either the embed populates the inner container OR replaces it with
    // an iframe — both count as "rendered" (same convention as the
    // dashboard-prices spec).
    await expect
      .poll(
        async () =>
          await overview.evaluate(
            (el) => el.querySelectorAll("iframe").length,
          ),
        {
          timeout: 25_000,
          message: "Symbol Overview widget never rendered an iframe",
        },
      )
      .toBeGreaterThan(0);

    // No fallback should have triggered on the happy path.
    await expect(page.getByTestId("chart-overview-fallback")).toHaveCount(0);
  });

  test("Open full chart button opens a usable full-screen modal", async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addInitScript((ms) => {
      (window as unknown as { __TV_LOAD_TIMEOUT_MS_OVERRIDE__: number })
        .__TV_LOAD_TIMEOUT_MS_OVERRIDE__ = ms;
    }, E2E_TV_LOAD_TIMEOUT_MS);

    await stubAnalysisRoute(page);

    const user = await registerUser(baseURL!);
    await signIn(page, user);

    await page.goto(`/analyses/${STUB_ANALYSIS_ID}`);

    const trigger = page.getByTestId("button-open-full-chart");
    await expect(trigger).toBeVisible({ timeout: 15_000 });
    await trigger.click();

    const dialog = page.getByTestId("dialog-full-chart");
    await expect(dialog).toBeVisible({ timeout: 10_000 });

    const advanced = page.getByTestId("tradingview-advanced-chart");
    await expect(advanced).toBeAttached({ timeout: 10_000 });
    await expect(advanced).toHaveAttribute("data-symbol", EXPECTED_TV_SYMBOL);
    await expect(advanced).toHaveAttribute(
      "data-interval",
      EXPECTED_TV_INTERVAL,
    );

    // Regression guard for the zero-height bug architect caught during
    // task #98: the advanced chart container must occupy real visible
    // space inside the modal, not collapse to 0px.
    await expect
      .poll(
        async () =>
          await advanced.evaluate(
            (el) => (el as HTMLElement).getBoundingClientRect().height,
          ),
        {
          timeout: 10_000,
          message: "Advanced chart container collapsed to zero height",
        },
      )
      .toBeGreaterThan(200);

    // Dialog must be dismissible (Escape closes the Radix dialog).
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 5_000 });
  });

  test("shows the friendly fallback when the TradingView CDN is blocked", async ({
    page,
    context,
    baseURL,
  }) => {
    // Force a short load timeout so we don't sit at the default 6s twice.
    await context.addInitScript(() => {
      (window as unknown as { __TV_LOAD_TIMEOUT_MS_OVERRIDE__: number })
        .__TV_LOAD_TIMEOUT_MS_OVERRIDE__ = 1500;
    });
    await context.route(/(?:^|\/\/)s3\.tradingview\.com\//, (route) =>
      route.abort("blockedbyclient"),
    );

    await stubAnalysisRoute(page);

    const user = await registerUser(baseURL!);
    await signIn(page, user);

    await page.goto(`/analyses/${STUB_ANALYSIS_ID}`);

    // The Symbol Overview widget should give up and the card should
    // render the inline fallback message.
    const fallback = page.getByTestId("chart-overview-fallback");
    await expect(fallback).toBeVisible({ timeout: 30_000 });
    await expect(fallback).toContainText(/chart/i);

    // The original TradingView host must be gone once we fell back.
    await expect(page.getByTestId("tradingview-symbol-overview")).toHaveCount(
      0,
    );
  });
});
