/**
 * Regression test: "Catat di Jurnal" button flips to "Sudah dicatat ✓"
 * after saving a journal entry from the analysis detail page, and the
 * state survives a full page reload.
 *
 * What is tested end-to-end (UI contract):
 *   1. The analysis detail page initially shows the "button-log-trade" CTA.
 *   2. Clicking it opens the LogTradeDialog (modal-log-trade), pre-filled
 *      with the analysis instrument.
 *   3. Saving the form closes the dialog and immediately flips the button
 *      to the "Sudah dicatat ✓" / "button-view-journal-entry" state without
 *      a page reload. This verifies the query invalidation flow in
 *      LogTradeButton.handleSaved → queryClient.invalidateQueries.
 *   4. After a full page reload the "Sudah dicatat ✓" state is still shown
 *      (the for-analysis query returns the stubbed entry → persistence UX).
 *
 * Network strategy (mirrors analyze-30m.spec.ts for the analysis itself;
 * stubs all four journal-related calls so no real DB row is required):
 *
 *   POST /api/analyses          → stubbed (no OpenAI call needed).
 *   GET  /api/analyses/:id      → stubbed for this test's stub ID.
 *   GET  /api/journal/for-analysis/:id
 *       – returns 404 on the initial page load (no entry yet) so the
 *         LogTradeButton skeleton resolves immediately with the CTA.
 *       – returns a stub entry AFTER the POST stub sets a flag, so the
 *         invalidation refetch sees the "saved" state.
 *   POST /api/journal           → stubbed to return 201 + entry and set
 *       the flag that switches the for-analysis stub's response.
 *
 * Navigation strategy:
 *   We reach the analysis detail page via the Analyze form flow (same as
 *   analyze-30m.spec.ts: submit → "View full analysis" CTA), which is a
 *   SPA navigation and keeps the React app mounted. Persistence is tested
 *   with page.reload() on the same URL.
 */
import { test, expect, request as pwRequest, type Page, type Route } from "@playwright/test";

interface TestUser {
  email: string;
  password: string;
}

async function registerUser(baseURL: string): Promise<TestUser> {
  const ts = Date.now();
  const slug = Math.random().toString(36).slice(2, 8);
  const email = `e2e-logtrade-${ts}-${slug}@trade-pilot.test`;
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

// ID that won't collide with the IDs reserved by other test files:
//   analyze-30m.spec.ts      → 9_999_999
//   analysis-chart.spec.ts   → 9_999_990
const STUB_ANALYSIS_ID = 9_999_980;

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
    mainScenario: "Stub main scenario for log-trade test.",
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
    // Both sides must be non-null: TradePlanCard calls renderSide(plan.sell, "sell")
    // without a null guard — a null sell causes a TypeError and crashes the page.
    tradePlan: {
      preferredSide: "buy" as const,
      buy: {
        entryZone: "2350.0",
        stopLoss: "2345.0",
        takeProfit1: "2358.0",
        takeProfit2: "2365.0",
        riskRewardRatio: "1:2",
        rationale: "Stub buy entry rationale.",
      },
      sell: {
        entryZone: "2345.0",
        stopLoss: "2352.0",
        takeProfit1: "2338.0",
        takeProfit2: "2330.0",
        riskRewardRatio: "1:1.5",
        rationale: "Stub sell entry rationale.",
      },
    },
    fundamentalContext: null,
    fundamentalCitations: null,
    createdAt: now.toISOString(),
    feedback: null,
  };
}

function buildStubJournalEntry() {
  return {
    id: 42_001,
    userId: 0,
    analysisId: STUB_ANALYSIS_ID,
    instrument: "XAU/USD",
    side: "buy",
    entryPrice: null,
    exitPrice: null,
    quantity: null,
    pnlAmount: null,
    pnlPercent: null,
    outcome: null,
    notes: null,
    tradeDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

test.describe("LogTradeButton flip (real Chromium + stubbed journal)", () => {
  test("button flips to 'Sudah dicatat ✓' immediately after saving and persists across reload", async ({
    page,
    baseURL,
  }) => {
    const stubAnalysis = buildStubAnalysis();
    const stubJournalEntry = buildStubJournalEntry();

    // Tracks whether the journal POST stub has been fulfilled.
    // The for-analysis GET stub reads this flag to decide what to return.
    let journalEntrySaved = false;

    // --- Stubs -----------------------------------------------------------

    // 1. POST /api/analyses → stub analysis response (no OpenAI required).
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

    // 2. GET /api/analyses/:id → always returns stub (needed on reload too).
    await page.route(
      `**/api/analyses/${STUB_ANALYSIS_ID}`,
      async (route: Route) => {
        if (route.request().method() === "GET") {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(stubAnalysis),
          });
          return;
        }
        await route.fallback();
      },
    );

    // 3. GET /api/journal/for-analysis/:id → 404 until the POST fires,
    //    then returns the stub entry.  The flag is set synchronously in
    //    the POST handler below so it is always true by the time the
    //    invalidation refetch reaches this handler.
    await page.route(
      `**/api/journal/for-analysis/${STUB_ANALYSIS_ID}`,
      async (route: Route) => {
        if (journalEntrySaved) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(stubJournalEntry),
          });
        } else {
          await route.fulfill({
            status: 404,
            contentType: "application/json",
            body: JSON.stringify({ error: "no entry" }),
          });
        }
      },
    );

    // 4. POST /api/journal → set the flag and return 201.
    //    The stub analysis doesn't exist in Postgres so the real endpoint
    //    would reject with 404 ("linked analysis not found"). We intercept
    //    at the browser level so the server is never reached.
    await page.route("**/api/journal", async (route: Route) => {
      if (route.request().method() === "POST") {
        journalEntrySaved = true;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(stubJournalEntry),
        });
        return;
      }
      await route.fallback();
    });

    // --- Sign in ---------------------------------------------------------
    const user = await registerUser(baseURL!);
    await signIn(page, user);

    // --- Drive to the analysis page via the Analyze form -----------------
    // Same pattern as analyze-30m.spec.ts: submit the form, wait for the
    // inline "View full analysis" CTA, click it → SPA navigation (no
    // full page reload, avoids cold-boot stub-interception timing issues).
    await page.goto("/analyze");

    await page.getByTestId("button-instrument-XAU/USD").click();
    await page.getByTestId("button-submit-analysis").click();

    const viewFull = page.getByTestId("button-view-full-analysis");
    await expect(viewFull).toBeVisible({ timeout: 30_000 });
    await viewFull.click();

    await page.waitForURL(
      new RegExp(`/analyses/${STUB_ANALYSIS_ID}$`),
      { timeout: 30_000 },
    );

    // --- 1. Initial state: CTA shown, no journal entry -------------------
    // bias-gauge is the sentinel for "analysis detail page fully rendered"
    // (same as analyze-30m.spec.ts).
    await expect(
      page.getByTestId("bias-gauge"),
    ).toBeAttached({ timeout: 15_000 });

    // for-analysis stub returns 404 → skeleton resolves → CTA shown.
    const logTradeCard = page.getByTestId("card-log-trade");
    await expect(logTradeCard).toBeVisible({ timeout: 10_000 });

    const logTradeBtn = page.getByTestId("button-log-trade");
    await expect(logTradeBtn).toBeVisible();

    // "Already journaled" button must NOT exist yet.
    await expect(page.getByTestId("button-view-journal-entry")).toHaveCount(0);

    // --- 2. Open dialog; verify instrument pre-fill ----------------------
    await logTradeBtn.click();

    const modal = page.getByTestId("modal-log-trade");
    await expect(modal).toBeVisible({ timeout: 5_000 });

    // Dialog must be pre-filled with the analysis instrument.
    await expect(
      page.getByTestId("input-journal-instrument"),
    ).toHaveValue("XAU/USD");

    // --- 3. Save: POST stub fires, flag flips, modal closes --------------
    await page.getByTestId("button-save-journal-entry").click();
    // POST /api/journal → stub intercepts → sets journalEntrySaved = true
    //   → returns 201 → onSaved() fires → invalidateQueries
    //   → for-analysis refetch → stub now returns the entry.
    await expect(modal).toBeHidden({ timeout: 10_000 });

    // --- 4. Immediate flip -----------------------------------------------
    // The button flips from "Catat di Jurnal" (CTA) to "Sudah dicatat ✓"
    // (already-journaled state).  The translation key is already_journaled;
    // in Indonesian it renders "Sudah dicatat ✓", in English "Already
    // journaled ✓".  We check the checkmark character (✓) which appears in
    // all locales, and the structural presence of button-view-journal-entry
    // (which is only rendered in the already-journaled state).
    const viewJournalBtn = page.getByTestId("button-view-journal-entry");
    await expect(viewJournalBtn).toBeVisible({ timeout: 10_000 });

    // The card subtitle must contain the ✓ checkmark (locale-invariant signal
    // that the already_journaled translation is rendered).
    await expect(logTradeCard).toContainText("✓");

    // Original CTA must be gone.
    await expect(page.getByTestId("button-log-trade")).toHaveCount(0);

    // --- 5. Persistence: state survives a full page reload ---------------
    // page.reload() triggers a hard reload of /analyses/9999980.
    // Both stubs remain active so:
    //   GET /api/analyses/9999980 → intercepted by stub → stub analysis
    //   GET /api/journal/for-analysis/9999980 → journalEntrySaved still
    //     true → stub returns entry → "Sudah dicatat ✓" shown again.
    await page.reload();

    await expect(
      page.getByTestId("button-view-journal-entry"),
      "already-journaled state must survive a full page reload",
    ).toBeVisible({ timeout: 15_000 });

    await expect(page.getByTestId("card-log-trade")).toContainText("✓");

    // CTA button must stay absent after reload.
    await expect(page.getByTestId("button-log-trade")).toHaveCount(0);
  });
});
