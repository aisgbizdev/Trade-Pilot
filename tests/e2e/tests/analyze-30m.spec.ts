/**
 * Real-browser smoke test for the new "30m" (30 menit) timeframe added in
 * task #83. Covers the full user-visible contract end-to-end:
 *
 *   1. Sign in.
 *   2. Open the Analyze page.
 *   3. Pick "30m" from the timeframe selector.
 *   4. Submit.
 *   5. Land on the saved analysis page and assert the bias gauge
 *      (`data-testid="bias-gauge"`) renders with a non-empty `data-lean`.
 *
 * Why we stub the OpenAI-backed analyses endpoints instead of letting them
 * hit the real upstream:
 *   - The CI test container does not have a stable OPENAI_API_KEY budget,
 *     and the live model can take 30s+ which blows past Playwright's
 *     per-test timeout under load.
 *   - We are intentionally testing the *visual contract* of the saved
 *     analysis page (bias gauge mounts with a non-empty lean for a 30m
 *     analysis), not the model's reasoning. The route-level integration
 *     test in `artifacts/api-server/src/__tests__/analyses-30m.test.ts`
 *     already covers the backend wiring.
 *
 * The stub returns a fully-shaped Analysis row (matching the Drizzle
 * schema in `lib/db/src/schema/index.ts`) with `timeframe: "30m"` and a
 * `tradingBias` of `"bullish"`, so `analysis-detail.tsx` normalizes it to
 * the `bullish` lean and `signal-speedometer.tsx` writes
 * `data-lean="bullish"` on the gauge.
 */
import { test, expect, request as pwRequest, type Page } from "@playwright/test";

interface TestUser {
  email: string;
  password: string;
}

async function registerUser(baseURL: string): Promise<TestUser> {
  const ts = Date.now();
  const slug = Math.random().toString(36).slice(2, 8);
  const email = `e2e-30m-${ts}-${slug}@trade-pilot.test`;
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

// A high integer ID we know won't collide with rows the api-server might
// have created during this test run. The stub matches both POST (create)
// and GET (read by id) so the navigation `/analyses/${id}` round-trip
// doesn't hit Postgres at all.
const STUB_ANALYSIS_ID = 9_999_999;

function buildStubAnalysis() {
  const now = new Date();
  const validUntil = new Date(now.getTime() + 30 * 60_000); // +30 min
  return {
    id: STUB_ANALYSIS_ID,
    userId: 0,
    instrument: "XAU/USD",
    timeframe: "30m",
    mode: "beginner" as const,
    userInputContext: null,
    rawAiOutput: null,
    validUntil: validUntil.toISOString(),
    marketCondition: "trending_up" as const,
    riskLevel: "medium" as const,
    confidenceMin: 60,
    confidenceMax: 75,
    mainScenario:
      "Harga emas berada dalam tren naik jangka pendek di timeframe 30 menit dan kemungkinan melanjutkan pergerakan ke atas.",
    alternativeScenario:
      "Jika harga gagal menembus resistance terdekat, kemungkinan terjadi koreksi pendek sebelum melanjutkan tren.",
    whyReason:
      "Indikator momentum 30m menunjukkan tekanan beli yang dominan dan struktur higher-high yang masih utuh.",
    failureConditions:
      "Skenario bullish ini batal jika harga break dan close di bawah swing low 30m terakhir.",
    baseCase: null,
    bullishScenario: null,
    bearishScenario: null,
    keyDriversTechnical: null,
    keyDriversFundamental: null,
    marketContext: null,
    invalidationConditions: null,
    uncertaintyNotes: null,
    tradingBias: "bullish",
    opportunity: "Lanjutan tren naik jangka pendek 30 menit.",
    risk: "Spike volatilitas mendadak dapat memicu stop hunt.",
    techBuyCount: 5,
    techSellCount: 1,
    techNeutralCount: 2,
    tradePlan: {
      preferredSide: "buy" as const,
      buy: {
        entryZone: "2350.0",
        stopLoss: "2345.0",
        takeProfit1: "2358.0",
        takeProfit2: "2365.0",
        riskRewardRatio: "1:2",
        rationale: "Entry di atas resistance kecil 30m dengan SL di bawah swing low.",
      },
      sell: {
        entryZone: "2345.0",
        stopLoss: "2352.0",
        takeProfit1: "2338.0",
        takeProfit2: "2330.0",
        riskRewardRatio: "1:1.5",
        rationale: "Hanya jika struktur bullish 30m batal.",
      },
    },
    fundamentalContext: {
      newsItems: [
        {
          id: "yahoo-stub-1",
          title: "Gold edges higher as dollar slips on Fed rate cut bets",
          summary:
            "Spot gold rose as the dollar weakened ahead of Friday's PCE inflation report.",
          source: "Yahoo Finance",
          url: "https://finance.yahoo.com/news/gold-stub",
          publishedAt: new Date(now.getTime() - 60 * 60_000).toISOString(),
        },
      ],
      calendarEvents: [
        {
          date: now.toISOString().slice(0, 10),
          time: "19:30",
          currency: "USD",
          event: "FOMC Rate Decision",
          impact: "★★★",
          actual: null,
          forecast: "5.25%",
          previous: "5.50%",
        },
      ],
    },
    createdAt: now.toISOString(),
    feedback: null,
  };
}

test.describe("Analyze flow — 30m timeframe (real Chromium)", () => {
  test("submitting a 30m analysis renders the bias gauge with a non-empty lean", async ({
    page,
    baseURL,
  }) => {
    const stubAnalysis = buildStubAnalysis();

    // Capture the body the Analyze form actually POSTs so we can assert
    // on it after the navigation completes. Without this the test would
    // silently pass even if the timeframe pill got disconnected from
    // form state, because the stub hard-codes `timeframe: "30m"` in the
    // response regardless of what the client sent.
    let createPayload:
      | {
          instrument?: string;
          timeframe?: string;
          mode?: string;
          userInputContext?: string | null;
        }
      | null = null;

    // Stub the analyses endpoints. We intercept at the browser level so
    // the api-server never has to call OpenAI for this test.
    await page.route("**/api/analyses", async (route) => {
      const req = route.request();
      if (req.method() === "POST") {
        try {
          createPayload = req.postDataJSON();
        } catch {
          createPayload = null;
        }
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(stubAnalysis),
        });
        return;
      }
      await route.fallback();
    });

    await page.route(`**/api/analyses/${STUB_ANALYSIS_ID}`, async (route) => {
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

    const user = await registerUser(baseURL!);
    await signIn(page, user);

    await page.goto("/analyze");

    // The Analyze page defaults to the "futures" tab, where XAU/USD lives.
    await page.getByTestId("button-instrument-XAU/USD").click();

    // Pick "30m" — the new timeframe added by task #83.
    const timeframe30m = page.getByTestId("button-timeframe-30m");
    await expect(timeframe30m).toBeVisible();
    await timeframe30m.click();

    await page.getByTestId("button-submit-analysis").click();

    // The Analyze page navigates to `/analyses/:id` once the POST resolves.
    await page.waitForURL(new RegExp(`/analyses/${STUB_ANALYSIS_ID}$`), {
      timeout: 30_000,
    });

    const biasGauge = page.getByTestId("bias-gauge");
    await expect(biasGauge).toBeAttached({ timeout: 15_000 });

    // The visual contract: the gauge must expose a non-empty `data-lean`
    // so downstream analytics + screenshot snapshots can read the
    // current bullish/bearish/neutral signal without scraping styles.
    await expect
      .poll(() => biasGauge.getAttribute("data-lean"), { timeout: 10_000 })
      .toMatch(/^(bullish|bearish|neutral)$/);

    // The detail page renders the analysis's timeframe in a small badge
    // next to the bias label. Asserting it shows "30m" guarantees the
    // saved analysis the user lands on is genuinely the 30m one, not a
    // stale render or a re-typed default.
    await expect(page.getByTestId("text-bias-timeframe")).toHaveText("30m");

    // Finally, prove the Analyze form actually submitted the timeframe
    // we picked. Without this assertion the test would silently pass
    // even if the `button-timeframe-30m` pill became disconnected from
    // form state, because the route stub hard-codes `timeframe: "30m"`
    // in its response.
    expect(createPayload).not.toBeNull();
    expect(createPayload!.timeframe).toBe("30m");
    expect(createPayload!.instrument).toBe("XAU/USD");

    // Fundamental context card (task #88) renders the news + calendar
    // snapshot the model saw at analysis time. Asserting the headline
    // and the FOMC event proves the saved analysis page is wired to
    // the persisted snapshot, not just the legacy AI narrative.
    const fundamentalCard = page.getByTestId("card-fundamental-context");
    await expect(fundamentalCard).toBeVisible();
    await expect(fundamentalCard).toContainText(
      "Gold edges higher as dollar slips on Fed rate cut bets",
    );
    await expect(fundamentalCard).toContainText("FOMC Rate Decision");
  });
});
