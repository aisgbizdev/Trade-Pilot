import { request as pwRequest, type Page } from "@playwright/test";

export interface E2ETestUser {
  email: string;
  password: string;
}

export const STABLE_ANALYSIS_ID = 9_999_981;
export const E2E_PASSWORD = "E2eTest123!";

/**
 * Create a uniquely named account for the real login flow. The account is
 * intentionally not reused between tests, so an existing development user
 * or a previous test run cannot change the result.
 */
export async function registerE2ETestUser(
  baseURL: string,
  label: string,
): Promise<E2ETestUser> {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `e2e-${label}-${suffix}@trade-pilot.test`;
  const ctx = await pwRequest.newContext({ baseURL });

  try {
    const response = await ctx.post("/api/auth/register", {
      data: {
        email,
        password: E2E_PASSWORD,
        displayName: `E2E ${label}`,
        selectedMode: "beginner",
        securityQuestion: "Nama hewan peliharaan pertama kamu?",
        securityAnswer: "kucing",
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to create isolated e2e user (status=${response.status()}): ${await response.text()}`,
      );
    }
  } finally {
    await ctx.dispose();
  }

  return { email, password: E2E_PASSWORD };
}

export async function signInE2ETestUser(
  page: Page,
  user: E2ETestUser,
) {
  await page.goto("/login");
  await page.getByTestId("input-email").fill(user.email);
  await page.getByTestId("input-password").fill(user.password);
  await page.getByTestId("button-submit-login").click();
  await page.waitForURL(/\/dashboard$/, { timeout: 15_000 });
}

/**
 * This response is the complete saved-analysis shape needed by the detail
 * page. The browser intercept means no analysis row is inserted and no
 * OpenAI request is made. Keep the values distinctive: assertions can catch
 * a stale/shared response instead of merely checking that a card exists.
 */
export function buildStableAnalysis() {
  const now = new Date();

  return {
    id: STABLE_ANALYSIS_ID,
    userId: 0,
    instrument: "EUR/USD",
    timeframe: "1h",
    mode: "beginner" as const,
    userInputContext: null,
    rawAiOutput: null,
    validUntil: new Date(now.getTime() + 60 * 60_000).toISOString(),
    marketCondition: "trending_up" as const,
    riskLevel: "medium" as const,
    confidenceMin: 62,
    confidenceMax: 78,
    mainScenario: "Stable browser fixture main scenario.",
    alternativeScenario: "Stable browser fixture alternative scenario.",
    whyReason: "Stable browser fixture reasoning.",
    failureConditions: "Stable browser fixture invalidation.",
    baseCase: null,
    bullishScenario: null,
    bearishScenario: null,
    keyDriversTechnical: null,
    keyDriversFundamental: null,
    marketContext: null,
    invalidationConditions: null,
    uncertaintyNotes: null,
    tradingBias: "bullish",
    opportunity: "Stable browser fixture opportunity.",
    risk: "Stable browser fixture risk.",
    techBuyCount: 6,
    techSellCount: 2,
    techNeutralCount: 3,
    tradePlan: {
      preferredSide: "buy" as const,
      buy: {
        entryZone: "1.0840–1.0850",
        stopLoss: "1.0800",
        takeProfit1: "1.0900",
        takeProfit2: "1.0950",
        riskRewardRatio: "1:2",
        rationale: "Fixture Buy rationale.",
      },
      sell: {
        entryZone: "1.0800–1.0810",
        stopLoss: "1.0850",
        takeProfit1: "1.0750",
        takeProfit2: "1.0700",
        riskRewardRatio: "1:1.5",
        rationale: "Fixture Sell rationale.",
      },
    },
    fundamentalContext: null,
    fundamentalCitations: null,
    createdAt: now.toISOString(),
    feedback: null,
  };
}

export async function stubStableAnalysis(page: Page) {
  const analysis = buildStableAnalysis();

  await page.route(`**/api/analyses/${STABLE_ANALYSIS_ID}`, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(analysis),
      });
      return;
    }

    await route.fallback();
  });
}