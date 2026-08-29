/**
 * E2E tests for the Re-Analyze button and Copy Levels button introduced in
 * the analysis detail page.
 *
 * Re-Analyze (data-testid="button-re-analyze"):
 *   1. The button is visible on the detail page.
 *   2. Its href encodes the analysis instrument and timeframe as URL params.
 *   3. Clicking it navigates to /analyze with ?instrument= and ?timeframe=
 *      pre-filled, and the correct instrument tab (futures for XAU/USD) is
 *      auto-selected.
 *
 * Copy Levels (data-testid="button-copy-levels-buy"):
 *   1. The button is visible when a trade plan is present.
 *   2. Clicking it writes the expected Entry / SL / TP1 / TP2 / R:R string
 *      to the clipboard.
 *   3. The button briefly shows "Copied!" / "Tersalin!" feedback.
 *
 * Network strategy: same as analyze-30m.spec.ts and log-trade-button-flip.spec.ts.
 *   - POST /api/analyses → stubbed (no OpenAI call required).
 *   - GET  /api/analyses/:id → stubbed with a known tradePlan so the
 *     TradePlanCard (and its copy button) renders on the detail page.
 *   - All other endpoints fall back to the real server.
 */
import { test, expect, request as pwRequest, type Page, type Route } from "@playwright/test";

interface TestUser {
  email: string;
  password: string;
}

async function registerUser(baseURL: string, tag: string): Promise<TestUser> {
  const ts = Date.now();
  const slug = Math.random().toString(36).slice(2, 8);
  const email = `e2e-${tag}-${ts}-${slug}@trade-pilot.test`;
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
      throw new Error(`Failed to register e2e user (${res.status()}): ${body}`);
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

// ID range reserved for this file. Does not collide with:
//   analyze-30m.spec.ts        → 9_999_999
//   analysis-chart.spec.ts     → 9_999_990
//   log-trade-button-flip.spec → 9_999_980
const STUB_ID_RE_ANALYZE = 9_999_970;
const STUB_ID_COPY_LEVELS = 9_999_960;
const STUB_ID_STANDARD_REGRESSION = 9_999_950;
const STUB_ID_ADAPTIVE_REFRESH = 9_999_940;
const STUB_ID_HSI_ADAPTIVE = 9_999_930;
const STUB_ID_UNSUPPORTED_ADAPTIVE = 9_999_920;

function buildStubAnalysis(id: number) {
  const now = new Date();
  const validUntil = new Date(now.getTime() + 60 * 60_000);
  return {
    id,
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
    tradePlan: {
      preferredSide: "buy" as const,
      buy: {
        entryZone: "2350.0",
        stopLoss: "2345.0",
        takeProfit1: "2358.0",
        takeProfit2: "2365.0",
        riskRewardRatio: "1:2",
        rationale: "Stub buy rationale.",
      },
      sell: {
        entryZone: "2362.0",
        stopLoss: "2368.0",
        takeProfit1: "2354.0",
        takeProfit2: "2346.0",
        riskRewardRatio: "1:1.5",
        rationale: "Stub sell rationale.",
      },
    },
    fundamentalContext: null,
    fundamentalCitations: null,
    createdAt: now.toISOString(),
    feedback: null,
  };
}

type AdaptiveRefreshAnalysis = Omit<
  ReturnType<typeof buildStubAnalysis>,
  "riskLevel" | "fundamentalContext"
> & {
  riskLevel: "low";
  fundamentalContext: {
    newsItems: Array<Record<string, string | null>>;
    calendarEvents: Array<Record<string, string | null>>;
  };
};

/** Navigate to the analysis detail page via the Analyze form submit flow. */
async function reachDetailPage(
  page: Page,
  stubAnalysisId: number,
  stubAnalysis: ReturnType<typeof buildStubAnalysis>,
) {
  await page.route("**/api/analyses", async (route: Route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(stubAnalysis),
      });
      return;
    }
    await route.fallback();
  });

  await page.route(`**/api/analyses/${stubAnalysisId}`, async (route: Route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(stubAnalysis),
      });
      return;
    }
    await route.fallback();
  });

  await page.goto("/analyze");

  // XAU/USD lives in the Futures tab (default).
  await page.getByTestId("button-instrument-XAU/USD").click();
  // Match the stubbed analysis and exercise the same explicit selection a
  // user makes before submitting, rather than relying on the page's 1D default.
  await page.getByTestId("button-timeframe-1h").click();
  // This helper sets up detail-page tests. Invoke the DOM click directly so
  // TradingView iframe layout shifts cannot swallow the coordinate-based click.
  await page.getByTestId("button-submit-analysis").evaluate((button) => {
    (button as HTMLButtonElement).click();
  });

  // A successful create navigates directly to the full analysis detail page.
  await page.waitForURL(new RegExp(`/analyses/${stubAnalysisId}$`), {
    timeout: 30_000,
  });

  // Wait for the page to be fully rendered before any assertions.
  await expect(page.getByTestId("bias-gauge")).toBeAttached({ timeout: 15_000 });
}

// ---------------------------------------------------------------------------

test.describe("Re-Analyze button (real Chromium + stubbed analysis)", () => {
  test("button is visible, href encodes instrument+timeframe, and clicking pre-fills the Analyze page", async ({
    page,
    baseURL,
  }) => {
    const stubAnalysis = buildStubAnalysis(STUB_ID_RE_ANALYZE);

    const user = await registerUser(baseURL!, "re-analyze");
    await signIn(page, user);
    await reachDetailPage(page, STUB_ID_RE_ANALYZE, stubAnalysis);

    // 1. The Re-Analyze button must be present on the detail page.
    const reAnalyzeBtn = page.getByTestId("button-re-analyze");
    await expect(reAnalyzeBtn).toBeVisible({ timeout: 10_000 });

    // 2. Its href must encode the analysis instrument and timeframe.
    const href = await reAnalyzeBtn.getAttribute("href");
    expect(href).not.toBeNull();
    // The Link href is a client-side path; URL-encoded XAU/USD → XAU%2FUSD.
    expect(decodeURIComponent(href!)).toContain("instrument=XAU/USD");
    expect(href!).toContain("timeframe=1h");

    // 3. Clicking navigates to /analyze with the correct query params.
    await reAnalyzeBtn.click();
    await page.waitForURL(/\/analyze\?/, { timeout: 10_000 });

    const url = new URL(page.url());
    expect(decodeURIComponent(url.searchParams.get("instrument") ?? "")).toBe("XAU/USD");
    expect(url.searchParams.get("timeframe")).toBe("1h");

    // 4. The "futures" tab must be auto-selected for XAU/USD (a futures
    //    instrument). The active tab renders with bg-primary CSS class.
    const futuresTab = page.getByTestId("tab-futures");
    await expect(futuresTab).toBeVisible({ timeout: 5_000 });
    await expect(futuresTab).toHaveClass(/bg-primary/);

    // 5. The instrument button is visible in the grid (confirming the correct
    //    tab is shown and the instrument list is rendered).
    await expect(page.getByTestId("button-instrument-XAU/USD")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------

test.describe("Copy Levels button (real Chromium + stubbed analysis)", () => {
  test("copies the correct entry/SL/TP string to the clipboard and shows brief feedback", async ({
    page,
    baseURL,
    context,
  }) => {
    const stubAnalysis = buildStubAnalysis(STUB_ID_COPY_LEVELS);

    // Grant clipboard read/write so navigator.clipboard.readText() works
    // inside page.evaluate() after the button click.
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const user = await registerUser(baseURL!, "copy-levels");
    await signIn(page, user);
    await reachDetailPage(page, STUB_ID_COPY_LEVELS, stubAnalysis);

    // 1. The copy buttons must be visible (requires a tradePlan to be present).
    const copyBuyBtn = page.getByTestId("button-copy-levels-buy");
    await expect(copyBuyBtn).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("button-copy-levels-sell")).toBeVisible();

    // 2. Click the buy-side copy button (user gesture required for clipboard).
    await copyBuyBtn.click();

    // 3. Read back the clipboard content immediately after the click.
    const clipboardText = await page.evaluate<string>(
      () => navigator.clipboard.readText(),
    );

    // The copy format is: "Entry: X | SL: X | TP1: X | TP2: X | R:R X"
    expect(clipboardText).toContain("Entry: 2350.0");
    expect(clipboardText).toContain("SL: 2345.0");
    expect(clipboardText).toContain("TP1: 2358.0");
    expect(clipboardText).toContain("TP2: 2365.0");
    expect(clipboardText).toContain("R:R 1:2");

    // 4. The button must briefly display copied-state feedback. The text is
    //    either "Copied!" (EN) or "Tersalin!" (ID) depending on the user's
    //    language setting. The green Check icon is also rendered alongside it.
    await expect(copyBuyBtn).toContainText(/Copied!|Tersalin!/, { timeout: 2_000 });

    // 5. After ~2 s the button reverts to "Copy levels" / "Salin level".
    await expect(copyBuyBtn).toContainText(/Copy levels|Salin level/, { timeout: 4_000 });
  });
});

// ---------------------------------------------------------------------------

test.describe("Standard Plan regression (real Chromium + stubbed analysis)", () => {
  test("shows the unchanged Standard Buy/Sell levels without selecting Adaptive Plan", async ({
    page,
    baseURL,
  }) => {
    const stubAnalysis = buildStubAnalysis(STUB_ID_STANDARD_REGRESSION);
    const user = await registerUser(baseURL!, "adaptive-refresh");
    await signIn(page, user);
    await reachDetailPage(page, STUB_ID_STANDARD_REGRESSION, stubAnalysis);

    await expect(page.getByTestId("card-trade-plan")).toBeVisible();
    await expect(page.getByTestId("trade-plan-buy")).toBeVisible();
    await expect(page.getByTestId("trade-plan-sell")).toBeVisible();
    await expect(page.getByTestId("trade-plan-buy-entry")).toHaveText("2350.0");
    await expect(page.getByTestId("trade-plan-buy-sl")).toHaveText("2345.0");
    await expect(page.getByTestId("trade-plan-buy-tp1")).toHaveText("2358.0");
    await expect(page.getByTestId("trade-plan-buy-tp2")).toHaveText("2365.0");
    await expect(page.getByTestId("trade-plan-sell-entry")).toHaveText("2362.0");
    await expect(page.getByTestId("trade-plan-sell-sl")).toHaveText("2368.0");
    await expect(page.getByTestId("trade-plan-sell-tp1")).toHaveText("2354.0");
    await expect(page.getByTestId("trade-plan-sell-tp2")).toHaveText("2346.0");

    // Adaptive is always visible, but calculation remains opt-in. Merely
    // loading Standard Analysis must not calculate or persist a ladder.
    await expect(page.getByTestId("card-adaptive-position-plan")).toBeVisible();
    await expect(page.getByTestId("adaptive-plan-content")).toBeVisible();
    await expect(page.getByTestId("button-toggle-adaptive-plan")).toHaveCount(0);
    await expect(page.getByTestId("adaptive-plan-valid")).toHaveCount(0);
    await expect(page.getByTestId("adaptive-plan-invalid")).toHaveCount(0);
    await expect(page.getByTestId("card-log-trade")).toHaveCount(0);
    await expect(page.getByTestId("card-user-journal-note")).toHaveCount(0);
    const adaptiveStorage = await page.evaluate(
      (analysisId) => window.localStorage.getItem(`trade-pilot:adaptive-plan:v6:${analysisId}`),
      STUB_ID_STANDARD_REGRESSION,
    );
    expect(adaptiveStorage).toBeNull();
  });
});

// ---------------------------------------------------------------------------

test.describe("Adaptive product boundary (real Chromium + stubbed analyses)", () => {
  test("enables Hang Seng rules while keeping unsupported products analysis-only", async ({
    page,
    baseURL,
  }) => {
    const hsiAnalysis = {
      ...buildStubAnalysis(STUB_ID_HSI_ADAPTIVE),
      instrument: "HSI",
    };
    const unsupportedAnalysis = {
      ...buildStubAnalysis(STUB_ID_UNSUPPORTED_ADAPTIVE),
      instrument: "EUR/USD",
    };

    const user = await registerUser(baseURL!, "adaptive-refresh");
    await signIn(page, user);

    await page.route(`**/api/analyses/${STUB_ID_HSI_ADAPTIVE}`, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(hsiAnalysis),
      });
    });
    await page.route(`**/api/analyses/${STUB_ID_UNSUPPORTED_ADAPTIVE}`, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(unsupportedAnalysis),
      });
    });

    await page.goto(`/analyses/${STUB_ID_HSI_ADAPTIVE}`);
    await expect(page.getByTestId("text-instrument")).toHaveText("HSI");
    await expect(page.getByTestId("card-trade-plan")).toBeVisible();
    await expect(page.getByTestId("input-adaptive-available-margin")).toBeVisible();
    await expect(page.getByTestId("button-calculate-adaptive-plan")).toBeEnabled();
    await expect(page.getByTestId("adaptive-plan-unsupported")).toHaveCount(0);

    await page.goto(`/analyses/${STUB_ID_UNSUPPORTED_ADAPTIVE}`);
    await expect(page.getByTestId("text-instrument")).toHaveText("EUR/USD");
    await expect(page.getByTestId("card-trade-plan")).toBeVisible();
    await expect(page.getByTestId("adaptive-plan-unsupported")).toBeVisible();
    await expect(page.getByTestId("input-adaptive-available-margin")).toHaveCount(0);
    await expect(page.getByTestId("button-calculate-adaptive-plan")).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------

test.describe("Adaptive plan manual safeguards (real Chromium + refreshed context)", () => {
  test("uses standard rules and re-evaluates the saved plan after a fundamental refresh", async ({
    page,
    baseURL,
  }) => {
    const user = await registerUser(baseURL!, "adaptive-refresh");
    await signIn(page, user);

    let currentAnalysis: AdaptiveRefreshAnalysis = {
      ...buildStubAnalysis(STUB_ID_ADAPTIVE_REFRESH),
      riskLevel: "low" as const,
      fundamentalContext: { newsItems: [], calendarEvents: [] },
    };
    const refreshedAt = new Date().toISOString();

    await page.route(
      `**/api/analyses/${STUB_ID_ADAPTIVE_REFRESH}/refresh-fundamentals`,
      async (route: Route) => {
        if (route.request().method() !== "POST") return route.fallback();
        currentAnalysis = {
          ...currentAnalysis,
          fundamentalContext: {
            newsItems: [],
            calendarEvents: [{
              date: "2026-08-27",
              time: "14:30",
              currency: "USD",
              event: "Central-bank rate decision",
              impact: "★★★",
              actual: null,
              forecast: null,
              previous: null,
            }],
          },
        };
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            fundamentalContext: currentAnalysis.fundamentalContext,
            refreshedAt,
            drift: { totalCitations: 0, missingCitations: [] },
          }),
        });
      },
    );
    await page.route(`**/api/analyses/${STUB_ID_ADAPTIVE_REFRESH}`, async (route: Route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(currentAnalysis),
        });
        return;
      }
      await route.fallback();
    });

    await page.route("**/api/analyses", async (route: Route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(currentAnalysis),
        });
        return;
      }
      await route.fallback();
    });

    await page.goto("/analyze");
    await page.getByTestId("button-instrument-XAU/USD").click();
    await page.getByTestId("button-timeframe-1h").click();
    await page.getByTestId("button-submit-analysis").evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await page.waitForURL(new RegExp(`/analyses/${STUB_ID_ADAPTIVE_REFRESH}$`), {
      timeout: 30_000,
    });

    const marginInput = page.getByTestId("input-adaptive-available-margin");
    await expect(marginInput).toBeVisible();
    const accountRule = page.getByTestId("adaptive-account-rule");
    await expect(page.getByTestId("adaptive-daytrade-only")).toContainText(/day trade only/i);
    await expect(accountRule).toContainText("Mini");
    await expect(accountRule).toContainText(/0[.,]1(?:0)? lot/);
    await expect(accountRule).toContainText(/100/);

    await marginInput.fill("20000");
    await page.getByTestId("button-adaptive-account-regular").click();
    await expect(accountRule).toContainText("Regular");
    await expect(accountRule).toContainText(/1(?:[.,]0+)? lot/);
    await expect(accountRule).toContainText(/1[.,]000/);
    await expect(accountRule).toContainText(/100 troy ounce/i);
    await page.getByTestId("button-calculate-adaptive-plan").click();
    await expect(page.getByTestId("adaptive-plan-valid")).toBeVisible();
    await expect(page.getByTestId("adaptive-plan-invalid")).toHaveCount(0);

    await page.getByTestId("button-adaptive-account-mini").click();
    await marginInput.fill("100000");
    await page.getByTestId("button-calculate-adaptive-plan").click();
    await expect(page.getByTestId("adaptive-plan-valid")).toBeVisible();
    await expect(page.getByTestId("adaptive-plan-buy")).toBeVisible();
    await expect(page.getByTestId("adaptive-plan-comparison")).toBeVisible();
    await expect(page.getByTestId("adaptive-account-suggestion")).toHaveCount(0);
    for (const tier of ["micro", "mini", "regular"]) {
      for (const preference of ["safe", "balanced", "active"]) {
        await expect(page.getByTestId(`adaptive-comparison-${tier}-${preference}`)).toBeVisible();
      }
    }
    await expect(page.getByTestId("adaptive-comparison-alternatives")).toContainText(/Safer option/i);
    await expect(page.getByTestId("adaptive-comparison-alternatives")).toContainText(/Maximum capacity/i);
    await expect(page.getByTestId("adaptive-comparison-alternatives")).toContainText(/alternatives, not automatic selections/i);
    const selectedComparison = page.getByTestId("adaptive-comparison-details-mini-safe");
    await expect(selectedComparison).toContainText(/Buy\/Sell posture/i);
    await expect(selectedComparison).toContainText(/Margin fit/i);
    await expect(selectedComparison).toContainText(/Lot\/layer capacity/i);
    await expect(selectedComparison).toContainText(/Loss ceiling/i);
    await expect(selectedComparison).toContainText(/Profit opportunity/i);
    await expect(page.getByTestId("button-adaptive-account-mini")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("button-adaptive-preference-safe")).toHaveAttribute("aria-checked", "true");

    const storedBeforeRefresh = await page.evaluate(
      (analysisId) => (
        globalThis as unknown as { localStorage: { getItem: (key: string) => string | null } }
      ).localStorage.getItem(`trade-pilot:adaptive-plan:v9:${analysisId}`),
      STUB_ID_ADAPTIVE_REFRESH,
    );
    expect(storedBeforeRefresh).not.toBeNull();

    await page.getByTestId("button-refresh-fundamentals").click();
    await expect(page.getByTestId("fundamental-calendar-list")).toContainText("Central-bank rate decision");
    await expect(page.getByTestId("adaptive-plan-reasoning")).toHaveCount(0);
    await expect(marginInput).toHaveValue("100000");
    await expect(page.getByTestId("button-adaptive-account-mini")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("button-adaptive-preference-safe")).toHaveAttribute("aria-checked", "true");
    const storedAfterRefresh = await page.evaluate(
      (analysisId) => (
        globalThis as unknown as { localStorage: { getItem: (key: string) => string | null } }
      ).localStorage.getItem(`trade-pilot:adaptive-plan:v9:${analysisId}`),
      STUB_ID_ADAPTIVE_REFRESH,
    );
    expect(storedAfterRefresh).toBeNull();

    await page.getByTestId("button-calculate-adaptive-plan").click();
    await expect(page.getByTestId("adaptive-plan-reasoning")).toContainText(/high-impact|dampak tinggi/i);
    await expect(page.getByTestId("adaptive-plan-buy")).toBeVisible();

    // Standard Plan levels remain the source plan throughout; only the
    // optional adaptive recommendation has been discarded and re-evaluated.
    await expect(page.getByTestId("trade-plan-buy-entry")).toHaveText("2350.0");
    await expect(page.getByTestId("trade-plan-buy-sl")).toHaveText("2345.0");
  });
});
