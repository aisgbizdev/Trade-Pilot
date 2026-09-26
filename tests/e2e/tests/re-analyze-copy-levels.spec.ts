/**
 * E2E tests for the current Analyze flow, Copy Levels, Standard Plan, and
 * Adaptive Plan safeguards.
 *
 * Analyze now uses a quick instrument chooser with a 1h default timeframe.
 * A completed result is embedded inline; choosing another instrument
 * re-analyzes in place rather than navigating to /analyses/:id.
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
 *     TradePlanCard (and its copy button) renders in the embedded result.
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
const STUB_ID_RESPONSIVE_ADAPTIVE = 9_999_910;

const QUICK_INSTRUMENTS = ["XAU/USD", "BRENT", "HSI", "NIKKEI"];

function isIgnorableTradingViewConsoleError(message: string): boolean {
  // TradingView's embed loader reports an unavailable optional widget-sheriff
  // rules feed through console.error. This external diagnostic must not make
  // unrelated application-flow tests fail, while errors from every other
  // source remain actionable.
  return message.includes("https://widget-sheriff.tradingview-widget.com/")
    || message === "Cannot listen to the event from the provided iframe, contentWindow is not available";
}

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

/** Create an analysis through Analyze and wait for its inline result. */
async function reachInlineAnalysis(
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

  // XAU/USD and 1h are selected by default in the current quick chooser.
  await expect(page.getByTestId("button-instrument-XAU/USD")).toHaveClass(/bg-primary\/10/);
  await expect(page.getByTestId("instrument-chart-layout")).toContainText(/Timeframe:\s*1h/);
  // Invoke the DOM click directly so TradingView iframe layout shifts cannot
  // swallow the coordinate-based click.
  await page.getByTestId("button-submit-analysis").evaluate((button) => {
    (button as HTMLButtonElement).click();
  });

  // The result is embedded below the Analyze form; the URL remains /analyze.
  await expect(page.getByTestId("embedded-analysis-result")).toBeVisible({ timeout: 30_000 });

  // Wait for the embedded detail to finish rendering.
  await expect(page.getByTestId("bias-gauge")).toBeAttached({ timeout: 15_000 });
}

// ---------------------------------------------------------------------------

test.describe("Re-Analyze through the quick instrument chooser (real Chromium + stubbed analysis)", () => {
  test("choosing another instrument re-analyzes inline using the default 1h timeframe", async ({
    page,
    baseURL,
  }) => {
    const initialAnalysis = buildStubAnalysis(STUB_ID_RE_ANALYZE);
    const secondAnalysis = {
      ...buildStubAnalysis(STUB_ID_RE_ANALYZE - 1),
      instrument: "BRENT",
    };

    const user = await registerUser(baseURL!, "re-analyze");
    await signIn(page, user);
    await reachInlineAnalysis(page, STUB_ID_RE_ANALYZE, initialAnalysis);

    const secondRequests: Array<{ instrument?: string; timeframe?: string }> = [];
    await page.route("**/api/analyses", async (route: Route) => {
      if (route.request().method() === "POST") {
        secondRequests.push(route.request().postDataJSON());
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(secondAnalysis),
        });
        return;
      }
      await route.fallback();
    });
    await page.route(`**/api/analyses/${secondAnalysis.id}`, async (route: Route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(secondAnalysis),
        });
        return;
      }
      await route.fallback();
    });

    // Switching a preset instrument after a result is present starts a new
    // analysis automatically, without a detail-page route transition.
    await page.getByTestId("button-instrument-BRENT").click();
    await expect(page.getByTestId("text-instrument")).toHaveText("BRENT", { timeout: 30_000 });
    expect(new URL(page.url()).pathname).toBe("/analyze");
    expect(new URL(page.url()).searchParams.get("result")).toBe(String(secondAnalysis.id));
    expect(secondRequests[0]?.instrument).toBe("BRENT");
    expect(secondRequests[0]?.timeframe).toBe("1h");
    await expect(page.getByTestId("embedded-analysis-result")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------

test.describe("Analyze quick instrument chooser (authenticated Chromium)", () => {
  test("keeps the available instruments and current selection clear at desktop and mobile widths", async ({
    page,
    baseURL,
  }) => {
    const browserErrors: string[] = [];
    page.on("console", (message) => {
      // The Playwright config blocks service workers so browser route stubs
      // remain authoritative. The production PWA registration reports that
      // expected harness condition through console.error; keep the check
      // focused on unexpected errors from the authenticated Analyze flow.
      const isBlockedServiceWorkerError = message
        .text()
        .includes("[pwa] service worker registration failed");
      const isTradingViewWidgetError = isIgnorableTradingViewConsoleError(
        message.text(),
      );
      if (
        message.type() === "error" &&
        !isBlockedServiceWorkerError &&
        !isTradingViewWidgetError
      ) {
        browserErrors.push(`console: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => {
      browserErrors.push(`pageerror: ${error.message}`);
    });

    const user = await registerUser(baseURL!, "quick-instrument");
    await signIn(page, user);
    // Login intentionally makes an unauthenticated /api/auth/me request
    // before the session exists. Only collect errors from /analyze below.
    browserErrors.length = 0;
    // Keep the embedded TradingView widget deterministic. Its calendar feed
    // is unrelated to the accordion and can be unavailable in headless runs.
    await page.route("https://chartevents-reuters.tradingview.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ result: [] }),
      });
    });

    for (const viewport of [
      { width: 1280, height: 720 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/analyze");

      const instrumentOptions = page.getByTestId("instrument-options");

      // The current allowlist presents its available preset instruments
      // directly; there are no empty category tabs to expand.
      await expect(instrumentOptions).toBeVisible();
      await expect(
        instrumentOptions.locator('button[data-testid^="button-instrument-"]'),
      ).toHaveText(QUICK_INSTRUMENTS);

      const initialSelection = page.getByTestId("button-instrument-XAU/USD");
      await expect(initialSelection).toHaveClass(/bg-primary\/10/);
      const otherSelection = page.getByTestId("button-instrument-BRENT");
      await otherSelection.click();
      await expect(otherSelection).toHaveClass(/bg-primary\/10/);
      await expect(initialSelection).not.toHaveClass(/bg-primary\/10/);
      await initialSelection.click();
      await expect(initialSelection).toHaveClass(/bg-primary\/10/);
    }

    expect(browserErrors, browserErrors.join("\n")).toEqual([]);
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
    await reachInlineAnalysis(page, STUB_ID_COPY_LEVELS, stubAnalysis);

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
    await reachInlineAnalysis(page, STUB_ID_STANDARD_REGRESSION, stubAnalysis);

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
      (analysisId) => window.localStorage.getItem(`trade-pilot:adaptive-plan:v24:${analysisId}`),
      STUB_ID_STANDARD_REGRESSION,
    );
    expect(adaptiveStorage).toBeNull();
  });
});

// ---------------------------------------------------------------------------

test.describe("Adaptive product boundary (real Chromium + stubbed analyses)", () => {
  test("keeps Adaptive on official products and custom products analysis-only", async ({
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
    await expect(page.getByTestId("card-adaptive-position-plan")).toBeVisible();
    await expect(page.getByTestId("input-adaptive-available-margin")).toBeVisible();
    await expect(page.getByTestId("button-calculate-adaptive-plan")).toBeVisible();

    await page.goto(`/analyses/${STUB_ID_UNSUPPORTED_ADAPTIVE}`);
    await expect(page.getByTestId("text-instrument")).toHaveText("EUR/USD");
    await expect(page.getByTestId("card-trade-plan")).toBeVisible();
    await expect(page.getByTestId("card-adaptive-position-plan")).toHaveCount(0);
    await expect(page.getByTestId("input-adaptive-available-margin")).toHaveCount(0);
    await expect(page.getByTestId("button-calculate-adaptive-plan")).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------

test.describe("Adaptive settings at narrow and desktop widths", () => {
  test("keeps the three choices readable and explanations compact at 320px, 390px, and desktop", async ({
    page,
    baseURL,
  }, testInfo) => {
    const user = await registerUser(baseURL!, "adaptive-responsive");
    await signIn(page, user);
    await page.route(`**/api/analyses/${STUB_ID_RESPONSIVE_ADAPTIVE}`, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(buildStubAnalysis(STUB_ID_RESPONSIVE_ADAPTIVE)),
      });
    });
    await page.goto(`/analyses/${STUB_ID_RESPONSIVE_ADAPTIVE}`);

    const card = page.getByTestId("card-adaptive-position-plan");
    await expect(card).toBeVisible();
    const account = page.getByTestId("adaptive-account-selector");
    const risk = page.getByTestId("adaptive-risk-style-selector");
    const explanations = [
      page.getByTestId("adaptive-account-explanation"),
      page.getByTestId("adaptive-funds-explanation"),
      page.getByTestId("adaptive-risk-explanation"),
    ];

    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      for (const [group, names] of [
        [account, ["Micro", "Mini", "Regular"]],
        [risk, ["Conservative", "Moderate", "Aggressive"]],
      ] as const) {
        const buttons = group.getByRole("button");
        await expect(buttons).toHaveCount(3);
        const layout = await buttons.evaluateAll((nodes) => nodes.map((node) => {
          const button = node as HTMLButtonElement;
          const box = button.getBoundingClientRect();
          const text = document.createRange();
          text.selectNodeContents(button);
          const textBox = text.getBoundingClientRect();
          return {
            label: button.textContent?.trim(),
            left: box.left, right: box.right, top: box.top, bottom: box.bottom,
            textLeft: textBox.left, textRight: textBox.right,
          };
        }));
        expect(layout.map(({ label }) => label)).toEqual(names);
        for (const [index, box] of layout.entries()) {
          expect(box.right - box.left, `${width}px: ${box.label} touch width`).toBeGreaterThanOrEqual(70);
          expect(box.bottom - box.top, `${width}px: ${box.label} touch height`).toBeGreaterThanOrEqual(40);
          expect(box.textLeft, `${width}px: ${box.label} text starts within button`).toBeGreaterThanOrEqual(box.left - 1);
          expect(box.textRight, `${width}px: ${box.label} text ends within button`).toBeLessThanOrEqual(box.right + 1);
          expect(box.left, `${width}px: ${box.label} starts on screen`).toBeGreaterThanOrEqual(-1);
          expect(box.right, `${width}px: ${box.label} ends on screen`).toBeLessThanOrEqual(width + 1);
          if (index > 0) {
            expect(box.top, `${width}px: ${box.label} stays in one row`).toBeCloseTo(layout[0].top, 0);
            expect(box.left, `${width}px: ${box.label} does not overlap`).toBeGreaterThanOrEqual(layout[index - 1].right);
          }
        }
      }
      for (const details of explanations) {
        await expect(details).not.toHaveAttribute("open", "");
        const summary = details.locator("summary");
        await expect(summary).toBeVisible();
        const box = await details.boundingBox();
        expect(box, `${width}px: collapsed explanation is laid out`).not.toBeNull();
        expect(box!.height, `${width}px: closed explanation remains compact`).toBeLessThanOrEqual(44);
        await summary.click();
        await expect(details).toHaveAttribute("open", "");
        await expect(details.locator("p").first()).toBeVisible();
        await summary.click();
        await expect(details).not.toHaveAttribute("open", "");
      }
      await expect(card).toBeVisible();
      await testInfo.attach(`adaptive-settings-${width}px`, {
        body: await card.screenshot(),
        contentType: "image/png",
      });
    }
  });
});

// ---------------------------------------------------------------------------

test.describe("Adaptive result layout (authenticated Chromium)", () => {
  test("keeps prices, lots, totals and next broker funds legible at 320px, 390px and desktop", async ({
    page,
    baseURL,
  }, testInfo) => {
    const user = await registerUser(baseURL!, "adaptive-result-layout");
    await signIn(page, user);
    const analysis = {
      ...buildStubAnalysis(STUB_ID_RESPONSIVE_ADAPTIVE),
      validUntil: new Date(Date.now() + 24 * 3_600_000).toISOString(),
      fundamentalContext: { newsItems: [], calendarEvents: [] },
      tradePlan: {
        preferredSide: "buy" as const,
        buy: {
          entryZone: "2,300.00–2,302.00",
          stopLoss: "2,290.00",
          takeProfit1: "2,315.00",
          takeProfit2: "2,325.00",
          riskRewardRatio: "1:1.5",
          rationale: "Bullish structure.",
        },
        sell: {
          entryZone: "2,300.00–2,302.00",
          stopLoss: "2,312.00",
          takeProfit1: "2,290.00",
          takeProfit2: "2,280.00",
          riskRewardRatio: "1:1.2",
          rationale: "Bearish alternative.",
        },
      },
    };
    await page.route(`**/api/analyses/${STUB_ID_RESPONSIVE_ADAPTIVE}`, async (route: Route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(analysis) });
    });
    await page.route("**/api/historical/candles?*purpose=adaptive-layering*", async (route: Route) => {
      const now = Date.now();
      const candles = [
        { open: 2304, high: 2305, low: 2300, close: 2302 },
        { open: 2302, high: 2304, low: 2298, close: 2300 },
        { open: 2300, high: 2302, low: 2295, close: 2297 },
        { open: 2297, high: 2301, low: 2297, close: 2300 },
        { open: 2300, high: 2307, low: 2299, close: 2305 },
        { open: 2305, high: 2309, low: 2301, close: 2303 },
        { open: 2303, high: 2306, low: 2299, close: 2301 },
      ].map((candle, index) => ({
        ...candle, date: new Date(now - (7 - index) * 3_600_000).toISOString(),
      }));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          candles,
          sourceFetchedAt: new Date(now).toISOString(),
          sourceMaxAgeMs: 5 * 60_000,
          isStale: false,
          staleReason: null,
        }),
      });
    });
    await page.goto(`/analyses/${STUB_ID_RESPONSIVE_ADAPTIVE}`);
    const card = page.getByTestId("card-adaptive-position-plan");
    await expect(card).toBeVisible();
    const margin = page.getByTestId("input-adaptive-available-margin");
    const loss = page.getByTestId("input-adaptive-maximum-loss");
    await expect(page.getByTestId("button-calculate-adaptive-plan")).toBeEnabled();

    // Check actual glyph rectangles, not just DOM presence or document scrollWidth:
    // the card itself has overflow-hidden and can mask an overflowing child.
    async function expectTextFits(testId: string, width: number) {
      const measurements = await page.getByTestId(testId).evaluate((element) => {
        const card = element.closest('[data-testid="card-adaptive-position-plan"]')!;
        const cardBox = card.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const lines: { left: number; right: number }[] = [];
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (!node.textContent?.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of Array.from(range.getClientRects())) lines.push({ left: rect.left, right: rect.right });
        }
        return {
          cardLeft: cardBox.left, cardRight: cardBox.right,
          left: box.left, right: box.right, lines,
          viewportWidth: document.documentElement.clientWidth,
          pageWidth: document.documentElement.scrollWidth,
        };
      });
      expect(measurements.lines.length, `${width}px: ${testId} contains visible text`).toBeGreaterThan(0);
      expect(measurements.pageWidth, `${width}px: page does not scroll sideways`).toBeLessThanOrEqual(width + 1);
      for (const line of measurements.lines) {
        expect(line.left, `${width}px: ${testId} text inside card`).toBeGreaterThanOrEqual(Math.max(0, measurements.cardLeft) - 1);
        expect(line.right, `${width}px: ${testId} text inside card`).toBeLessThanOrEqual(Math.min(measurements.viewportWidth, measurements.cardRight) + 1);
        expect(line.left, `${width}px: ${testId} text inside element`).toBeGreaterThanOrEqual(measurements.left - 1);
        expect(line.right, `${width}px: ${testId} text inside element`).toBeLessThanOrEqual(measurements.right + 1);
      }
    }

    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await margin.fill("20000");
      await loss.fill("2000");
      await page.getByTestId("button-calculate-adaptive-plan").click();
      const result = page.getByTestId("adaptive-plan-valid");
      await expect(result).toBeVisible();
      const positions = page.locator('[data-testid^="adaptive-snapshot-position-buy-"]');
      expect(await positions.count(), `${width}px: multiple calculated positions`).toBeGreaterThan(1);
      for (let index = 0; index < await positions.count(); index++) {
        const position = page.getByTestId(`adaptive-snapshot-position-buy-${index}`);
        await expect(position).toContainText(/lot/i);
        await expectTextFits(`adaptive-snapshot-position-buy-${index}`, width);
      }
      const total = page.getByTestId("adaptive-snapshot-all-filled-buy");
      await expect(total).toContainText(/lot/i);
      await expectTextFits("adaptive-snapshot-all-filled-buy", width);

      const ladder = page.getByTestId("adaptive-ladder-buy");
      const fillScenarios = page.getByTestId("adaptive-fill-scenarios-buy");
      await expect(ladder).not.toHaveAttribute("open", "");
      await expect(fillScenarios).not.toHaveAttribute("open", "");
      await ladder.locator("summary").first().click();
      await expect(ladder).toHaveAttribute("open", "");
      await expect(page.getByTestId("adaptive-layer-financial-buy-0")).toBeVisible();
      await ladder.locator("summary").first().click();
      await fillScenarios.locator("summary").click();
      await expect(fillScenarios.locator("dd").first()).toBeVisible();
      await fillScenarios.locator("summary").click();

      // A funds-only next position has a long, visible broker message.
      await page.getByTestId("button-adaptive-risk-style-balanced").click();
      await margin.fill("330");
      await loss.fill("300");
      await page.getByTestId("button-calculate-adaptive-plan").click();
      await expect(result).toBeVisible();
      await expect(page.getByTestId("adaptive-next-layer-funds-buy")).toContainText(/lot.*broker funds|lot.*dana bebas broker/i);
      await expectTextFits("adaptive-snapshot-position-buy-0", width);
      await expectTextFits("adaptive-snapshot-all-filled-buy", width);
      await expectTextFits("adaptive-next-layer-funds-buy", width);
      await testInfo.attach(`adaptive-result-${width}px`, {
        body: await card.screenshot(),
        contentType: "image/png",
      });
    }
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
      confidenceMin: 65,
      fundamentalContext: { newsItems: [], calendarEvents: [] },
      tradePlan: {
        ...buildStubAnalysis(STUB_ID_ADAPTIVE_REFRESH).tradePlan!,
        buy: {
          ...buildStubAnalysis(STUB_ID_ADAPTIVE_REFRESH).tradePlan!.buy!,
          entryZone: "2301.0",
          stopLoss: "2290.0",
          takeProfit1: "2315.0",
          takeProfit2: "2325.0",
        },
      },
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
               date: new Date().toISOString().slice(0, 10),
               time: new Date().toISOString().slice(11, 16),
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
    await page.route("**/api/historical/candles?*purpose=adaptive-layering*", async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          candles: [
            { high: 2305, low: 2302 },
            { high: 2304, low: 2301 },
            { high: 2303, low: 2300 },
            { high: 2304, low: 2301 },
            { high: 2303, low: 2301 },
            { high: 2299, low: 2295 },
            { high: 2300, low: 2297 },
            { high: 2300, low: 2296 },
            { high: 2301, low: 2297 },
          ].map(({ high, low }, index) => ({
            date: new Date(Date.now() - (9 - index) * 3_600_000).toISOString(),
            open: low,
            high,
            low,
            close: high,
          })),
          sourceFetchedAt: new Date().toISOString(),
          sourceMaxAgeMs: 5 * 60_000,
          isStale: false,
          staleReason: null,
        }),
      });
    });

    await page.goto("/analyze");
    await page.getByTestId("button-instrument-XAU/USD").click();
    await expect(page.getByTestId("instrument-chart-layout")).toContainText(/Timeframe:\s*1h/);
    await page.getByTestId("button-submit-analysis").evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(page.getByTestId("embedded-analysis-result")).toBeVisible({ timeout: 30_000 });

    const marginInput = page.getByTestId("input-adaptive-available-margin");
    const maximumLossInput = page.getByTestId("input-adaptive-maximum-loss");
    await expect(marginInput).toBeVisible();
    const accountRule = page.getByTestId("adaptive-account-rule");
    await expect(page.getByTestId("adaptive-daytrade-only")).toContainText(/day trade only/i);
    await expect(accountRule).toContainText("Mini");
    await expect(accountRule).toContainText(/0[.,]1(?:0)? lot/);
    await expect(accountRule).toContainText(/100/);
    await expect(accountRule).toContainText(/0[.,]9(?:0)? lot/);
    await expect(accountRule).toContainText(/each position|setiap posisi/i);

    await marginInput.fill("5000");
    await maximumLossInput.fill("125");
    await expect(page.getByTestId("button-adaptive-risk-style-conservative")).toHaveAttribute("aria-pressed", "true");
    await page.getByTestId("button-adaptive-risk-style-aggressive").click();
    await expect(page.getByTestId("button-adaptive-risk-style-aggressive")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("button-calculate-adaptive-plan")).toBeEnabled();
    await page.getByTestId("button-calculate-adaptive-plan").click();
    await expect(page.getByTestId("adaptive-plan-valid")).toBeVisible();
    await expect(page.getByTestId("adaptive-plan-buy")).toBeVisible();
    await expect(page.getByTestId("adaptive-risk-style-active")).toContainText(/Aggressive|Agresif/i);
    await expect(page.getByTestId("adaptive-usable-risk-budget")).toContainText(/125/);
    await expect(page.getByTestId("adaptive-unused-risk-buffer")).toContainText(/0/);
    await maximumLossInput.fill("15");
    await page.getByTestId("button-calculate-adaptive-plan").click();
    await expect(page.getByTestId("adaptive-plan-invalid")).toBeVisible();
    await expect(page.getByTestId("adaptive-review-side-buy")).toContainText(/minimum-lot loss|rugi lot minimum/i);
    await expect(page.getByTestId("adaptive-review-side-buy")).toContainText(/\$110/);
    await expect(page.getByTestId("adaptive-blocked-dialog")).toBeVisible();
    await expect(page.getByTestId("adaptive-blocked-figures")).toContainText(/\$110/);
    await page.getByTestId("adaptive-blocked-edit-loss").click();
    await expect(page.getByTestId("adaptive-blocked-dialog")).toBeHidden();
    await maximumLossInput.fill("125");
    await expect(maximumLossInput).toHaveValue("125");
    await page.getByTestId("button-calculate-adaptive-plan").click();
    await expect(page.getByTestId("adaptive-plan-snapshot")).toContainText(/position|posisi/i);
    await expect(page.getByTestId("adaptive-plan-buy")).toContainText(/Final Stop Loss|Stop Loss final/i);
    await expect(page.getByTestId("adaptive-layer-financial-buy-0")).toContainText(/Margin this position|Margin posisi ini/i);
    await expect(page.getByTestId("adaptive-layer-financial-buy-0")).toContainText(/Funds remaining|Sisa dana/i);
    await expect(page.getByTestId("adaptive-plan-comparison")).toHaveCount(0);

    const storedBeforeRefresh = await page.evaluate(
      (analysisId) => (
        globalThis as unknown as { localStorage: { getItem: (key: string) => string | null } }
      ).localStorage.getItem(`trade-pilot:adaptive-plan:v24:${analysisId}`),
      STUB_ID_ADAPTIVE_REFRESH,
    );
    expect(storedBeforeRefresh).not.toBeNull();

    await page.getByTestId("button-refresh-fundamentals").click();
    await page.getByTestId("fundamental-calendar-toggle").click();
    await expect(page.getByTestId("fundamental-calendar-list")).toContainText("Central-bank rate decision");
    await expect(page.getByTestId("adaptive-plan-reasoning")).toHaveCount(0);
    await expect(marginInput).toHaveValue("5000");
    await expect(maximumLossInput).toHaveValue("125");
    await expect(page.getByTestId("button-adaptive-risk-style-aggressive")).toHaveAttribute("aria-pressed", "true");
    const storedAfterRefresh = await page.evaluate(
      (analysisId) => (
        globalThis as unknown as { localStorage: { getItem: (key: string) => string | null } }
      ).localStorage.getItem(`trade-pilot:adaptive-plan:v24:${analysisId}`),
      STUB_ID_ADAPTIVE_REFRESH,
    );
    expect(storedAfterRefresh).toBeNull();

    await page.getByTestId("button-calculate-adaptive-plan").click();
    await expect(page.getByTestId("adaptive-plan-invalid")).toBeVisible();
    await expect(page.getByTestId("adaptive-plan-valid")).toHaveCount(0);
    await expect(page.getByTestId("adaptive-review-side-buy")).toContainText(/\$110/);
    await expect(page.getByTestId("adaptive-review-side-buy")).toContainText(/\$62[.,]5/);
    await expect(page.getByTestId("adaptive-insight-button-buy")).toContainText(/Blocked|Diblokir/i);
    await expect(page.getByTestId("adaptive-insight-button-sell")).toContainText(/Conditional|Kondisional/i);
    await expect(page.getByTestId("adaptive-plan-reasoning")).toHaveCount(0);
    await page.getByTestId("adaptive-insight-button-reasoning").click();
    await expect(page.getByTestId("adaptive-plan-reasoning")).toContainText(/high-impact|dampak tinggi/i);

    // Standard Plan levels remain the source plan throughout; only the
    // optional adaptive recommendation has been discarded and re-evaluated.
    await expect(page.getByTestId("trade-plan-buy-entry")).toHaveText("2301.0");
    await expect(page.getByTestId("trade-plan-buy-sl")).toHaveText("2290.0");
  });
});
