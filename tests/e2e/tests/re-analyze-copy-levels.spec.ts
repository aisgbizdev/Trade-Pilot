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
  await page.getByTestId("button-submit-analysis").click();

  // Task #102: the Analyze page shows an inline result first; the user
  // opts into the full detail view via "View full analysis".
  const viewFull = page.getByTestId("button-view-full-analysis");
  await expect(viewFull).toBeVisible({ timeout: 30_000 });
  await viewFull.click();

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
    const user = await registerUser(baseURL!, "standard-regression");
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

    // Adaptive is opt-in. Merely loading Standard Analysis must not calculate
    // or persist a ladder, and the Standard card remains the only plan state.
    await expect(page.getByTestId("button-toggle-adaptive-plan")).toBeVisible();
    await expect(page.getByTestId("adaptive-plan-valid")).toHaveCount(0);
    await expect(page.getByTestId("adaptive-plan-invalid")).toHaveCount(0);
    const adaptiveStorage = await page.evaluate(
      (analysisId) => window.localStorage.getItem(`trade-pilot:adaptive-plan:${analysisId}`),
      STUB_ID_STANDARD_REGRESSION,
    );
    expect(adaptiveStorage).toBeNull();
  });
});
