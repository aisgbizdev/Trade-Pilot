/**
 * E2E regression guard for progressive nav threshold logic in layout.tsx.
 *
 * The bottom nav and desktop top nav filter items from FULL_NAV by
 * `totalAnalyses >= item.minCount`:
 *
 *   /analyze   minCount: 0  → always visible
 *   /history   minCount: 0  → always visible
 *   /journal   minCount: 1  → appears after first analysis
 *   /mirror    minCount: 5  → appears after fifth analysis
 *   /analytics minCount: 5  → appears after fifth analysis
 *
 * Three seeded scenarios are tested end-to-end against the real API
 * (fresh registered users), with `/api/analyses/summary` stubbed to
 * inject the desired `totalAnalyses` count without running the full
 * AI pipeline:
 *
 *   Scenario A — 0 analyses : only Analyze + History tabs visible
 *   Scenario B — 1 analysis  : Analyze + Journal + History visible
 *   Scenario C — 5 analyses  : all five tabs visible
 *
 * Each scenario also verifies that tabs hidden from the nav are still
 * reachable by typing their URL directly (the layout hides the tab
 * entry-point but never blocks the route).
 *
 * Both nav surfaces are exercised:
 *   • Desktop top nav  (hidden lg:flex)  — viewport 1280 × 720
 *   • Mobile bottom nav (lg:hidden)      — viewport 390 × 844
 */
import { test, expect, request as pwRequest, type Page } from "@playwright/test";

interface TestUser {
  email: string;
  password: string;
}

async function registerUser(baseURL: string, tag: string): Promise<TestUser> {
  const ts = Date.now();
  const slug = Math.random().toString(36).slice(2, 8);
  const email = `e2e-nav-${tag}-${ts}-${slug}@trade-pilot.test`;
  const password = "E2eTest123!";

  const ctx = await pwRequest.newContext({ baseURL });
  try {
    const res = await ctx.post("/api/auth/register", {
      data: {
        email,
        password,
        displayName: `E2E Nav ${tag} ${slug}`,
        selectedMode: "beginner",
        securityQuestion: "Nama hewan peliharaan pertama kamu?",
        securityAnswer: "kucing",
      },
    });
    if (!res.ok()) {
      const body = await res.text();
      throw new Error(`Failed to register user (status=${res.status()}): ${body}`);
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
 * Stub GET /api/analyses/summary so the nav renders with a controlled
 * totalAnalyses count rather than requiring real DB rows.
 *
 * The stub must be registered before any navigation that triggers the
 * fetch so the component never sees the real network call.
 */
async function stubAnalysesSummary(page: Page, totalAnalyses: number) {
  await page.route("**/api/analyses/summary", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        totalAnalyses,
        beginnerCount: totalAnalyses,
        proCount: 0,
        avgConfidenceMin: null,
        avgConfidenceMax: null,
        recentAnalyses: [],
      }),
    }),
  );
}

// ─── Desktop viewport helpers ──────────────────────────────────────────────

async function assertDesktopNavVisible(page: Page, slugs: string[]) {
  for (const slug of slugs) {
    await expect(
      page.getByTestId(`nav-desktop-${slug}`),
      `desktop nav tab /${slug} should be visible`,
    ).toBeVisible();
  }
}

async function assertDesktopNavHidden(page: Page, slugs: string[]) {
  for (const slug of slugs) {
    await expect(
      page.getByTestId(`nav-desktop-${slug}`),
      `desktop nav tab /${slug} should be hidden`,
    ).toBeHidden();
  }
}

// ─── Mobile viewport helpers ───────────────────────────────────────────────

async function assertMobileNavVisible(page: Page, slugs: string[]) {
  for (const slug of slugs) {
    await expect(
      page.getByTestId(`nav-${slug}`),
      `mobile nav tab /${slug} should be visible`,
    ).toBeVisible();
  }
}

async function assertMobileNavHidden(page: Page, slugs: string[]) {
  for (const slug of slugs) {
    await expect(
      page.getByTestId(`nav-${slug}`),
      `mobile nav tab /${slug} should be hidden`,
    ).toBeHidden();
  }
}

// ══════════════════════════════════════════════════════════════════════════
// Scenario A — 0 analyses
// ══════════════════════════════════════════════════════════════════════════
test.describe("Nav thresholds – 0 analyses (brand-new user)", () => {
  test("desktop: only Analyze and History are visible; Journal/Mirror/Analytics are hidden", async ({
    page,
    baseURL,
  }) => {
    const user = await registerUser(baseURL!, "0a");
    await stubAnalysesSummary(page, 0);
    await signIn(page, user);

    // Navigate to a main-nav page so the layout header / bottom bar render.
    await page.goto("/analyze");

    // Desktop viewport (1280×720 default) → header nav is visible
    await assertDesktopNavVisible(page, ["analyze", "history"]);
    await assertDesktopNavHidden(page, ["journal", "mirror", "analytics"]);
  });

  test("mobile: only Analyze and History are visible; Journal/Mirror/Analytics are hidden", async ({
    page,
    baseURL,
  }) => {
    const user = await registerUser(baseURL!, "0b");
    await stubAnalysesSummary(page, 0);
    await signIn(page, user);

    // Shrink to a phone viewport so the bottom nav renders.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/analyze");

    await assertMobileNavVisible(page, ["analyze", "history"]);
    await assertMobileNavHidden(page, ["journal", "mirror", "analytics"]);
  });

  test("hidden tabs (/journal, /mirror, /analytics) are still reachable by direct URL", async ({
    page,
    baseURL,
  }) => {
    const user = await registerUser(baseURL!, "0c");
    await stubAnalysesSummary(page, 0);
    await signIn(page, user);

    // /journal — the layout hides the tab entry-point but never blocks the route.
    await page.goto("/journal");
    await expect(page.getByTestId("text-journal-title")).toBeVisible();

    // /mirror
    await page.goto("/mirror");
    await expect(page.getByTestId("page-mirror")).toBeVisible();

    // /analytics — for a 0-analysis user the page shows the empty state
    await page.goto("/analytics");
    await expect(page).toHaveURL(/\/analytics$/);
    // Empty-state CTA from analytics.tsx confirms the page mounted.
    await expect(page.getByTestId("button-start-analysis")).toBeVisible();
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Scenario B — 1 analysis
// ══════════════════════════════════════════════════════════════════════════
test.describe("Nav thresholds – 1 analysis", () => {
  test("desktop: Analyze, Journal, and History visible; Mirror and Analytics are hidden", async ({
    page,
    baseURL,
  }) => {
    const user = await registerUser(baseURL!, "1a");
    await stubAnalysesSummary(page, 1);
    await signIn(page, user);
    await page.goto("/analyze");

    await assertDesktopNavVisible(page, ["analyze", "journal", "history"]);
    await assertDesktopNavHidden(page, ["mirror", "analytics"]);
  });

  test("mobile: Analyze, Journal, and History visible; Mirror and Analytics are hidden", async ({
    page,
    baseURL,
  }) => {
    const user = await registerUser(baseURL!, "1b");
    await stubAnalysesSummary(page, 1);
    await signIn(page, user);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/analyze");

    await assertMobileNavVisible(page, ["analyze", "journal", "history"]);
    await assertMobileNavHidden(page, ["mirror", "analytics"]);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Scenario C — 5 analyses
// ══════════════════════════════════════════════════════════════════════════
test.describe("Nav thresholds – 5 analyses", () => {
  test("desktop: all five tabs are visible", async ({ page, baseURL }) => {
    const user = await registerUser(baseURL!, "5a");
    await stubAnalysesSummary(page, 5);
    await signIn(page, user);
    await page.goto("/analyze");

    await assertDesktopNavVisible(page, [
      "analyze",
      "journal",
      "mirror",
      "history",
      "analytics",
    ]);
  });

  test("mobile: all five tabs are visible", async ({ page, baseURL }) => {
    const user = await registerUser(baseURL!, "5b");
    await stubAnalysesSummary(page, 5);
    await signIn(page, user);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/analyze");

    await assertMobileNavVisible(page, [
      "analyze",
      "journal",
      "mirror",
      "history",
      "analytics",
    ]);
  });
});
