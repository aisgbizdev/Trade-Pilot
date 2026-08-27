/**
 * Real-browser end-to-end coverage for the History page filter & URL
 * sync flow (built across task #112 and extended in #129).
 *
 * Filter state lives in the URL — this suite is the regression guard
 * that the round-trip between the chip UI and `?instruments=…&timeframes=…`
 * stays glued together:
 *
 *   1. Toggling instrument + timeframe chips writes repeated query keys
 *      to the URL (the backend's contract for array params).
 *   2. Reloading a URL with filters baked in rehydrates the chip state
 *      from scratch (proves URL → state, not just state → URL).
 *   3. Removing a single active-filter chip clears only that one filter
 *      and leaves the rest intact.
 *   4. "Clear all" wipes every filter at once.
 *   5. When filters return zero rows, the empty state shows the
 *      filter-specific copy and a clear-filters CTA (not the generic
 *      "you have no analyses yet" message).
 *
 * Network is stubbed at `page.route` for both `/api/analyses` and
 * `/api/filter-presets` so the suite does not depend on seeded DB rows
 * or the OpenAI key. The empty-state response is enough to exercise the
 * filter UI — the chips render from `ALL_INSTRUMENTS` / `ALL_TIMEFRAMES`
 * in the component, not from the analyses list.
 */
import { test, expect, request as pwRequest, type Page } from "@playwright/test";

interface TestUser {
  email: string;
  password: string;
}

async function registerUser(baseURL: string): Promise<TestUser> {
  const ts = Date.now();
  const slug = Math.random().toString(36).slice(2, 8);
  const email = `e2e-hist-${ts}-${slug}@trade-pilot.test`;
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
 * Stub the network surfaces the history page reads from. We return an
 * empty list so the filter UI never depends on real seeded data; the
 * instrument/timeframe chips come from the component's static lists.
 *
 * The captured `lastAnalysesUrl` lets a single test assert that a
 * particular filter combo was forwarded to the API verbatim (repeated
 * `instruments` / `timeframes` keys), without needing to introspect
 * the React state directly.
 */
async function stubHistoryNetwork(page: Page): Promise<{
  getLastAnalysesUrl: () => string | null;
}> {
  let lastAnalysesUrl: string | null = null;

  await page.route("**/api/analyses?**", async (route) => {
    lastAnalysesUrl = route.request().url();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ analyses: [], total: 0 }),
    });
  });
  // Some clients hit `/api/analyses` with no query string; cover that too.
  await page.route("**/api/analyses", async (route) => {
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }
    lastAnalysesUrl = route.request().url();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ analyses: [], total: 0 }),
    });
  });

  await page.route("**/api/filter-presets**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ presets: [] }),
    });
  });

  return { getLastAnalysesUrl: () => lastAnalysesUrl };
}

function parseHistoryQuery(url: string): URLSearchParams {
  // wouter writes `?…` after the path; URL constructor handles both.
  return new URL(url, "http://x").searchParams;
}

test.describe("History filters & URL sync (real Chromium)", () => {
  test("toggling instrument + timeframe writes repeated query keys to the URL and forwards them to the API", async ({
    page,
    baseURL,
  }) => {
    const { getLastAnalysesUrl } = await stubHistoryNetwork(page);
    const user = await registerUser(baseURL!);
    await signIn(page, user);

    await page.goto("/history");
    await page.getByTestId("button-toggle-filters").click();
    await expect(page.getByTestId("filter-panel")).toBeVisible();

    await page.getByTestId("filter-instrument-XAU/USD").click();
    await page.getByTestId("filter-instrument-EUR/USD").click();
    await page.getByTestId("filter-timeframe-1h").click();
    await page.getByTestId("filter-timeframe-4h").click();

    // URL reflects every selection, with arrays as repeated keys.
    await expect
      .poll(() => parseHistoryQuery(page.url()).getAll("instruments"), {
        timeout: 5_000,
      })
      .toEqual(["XAU/USD", "EUR/USD"]);
    expect(parseHistoryQuery(page.url()).getAll("timeframes")).toEqual([
      "1h",
      "4h",
    ]);

    // Active-filter chip row mirrors the URL: one chip per concrete value.
    const chipsRow = page.getByTestId("active-filters-row");
    await expect(chipsRow).toBeVisible();
    await expect(page.getByTestId("chip-inst-XAU/USD")).toBeVisible();
    await expect(page.getByTestId("chip-inst-EUR/USD")).toBeVisible();
    await expect(page.getByTestId("chip-tf-1h")).toBeVisible();
    await expect(page.getByTestId("chip-tf-4h")).toBeVisible();

    // The request to /api/analyses carries the same repeated keys —
    // this is the bit that proves the filter UI is actually wired to
    // the network query string, not just to local state.
    await expect
      .poll(
        () => {
          const u = getLastAnalysesUrl();
          if (!u) return null;
          return parseHistoryQuery(u).getAll("instruments");
        },
        { timeout: 5_000 },
      )
      .toEqual(["XAU/USD", "EUR/USD"]);
    expect(
      parseHistoryQuery(getLastAnalysesUrl()!).getAll("timeframes"),
    ).toEqual(["1h", "4h"]);
  });

  test("reloading a filtered URL rehydrates the chip state from the query string", async ({
    page,
    baseURL,
  }) => {
    await stubHistoryNetwork(page);
    const user = await registerUser(baseURL!);
    await signIn(page, user);

    // Land directly on a URL that already contains filters — the
    // component must derive its state from `useSearch()` on mount.
    await page.goto(
      "/history?instruments=XAU%2FUSD&instruments=GBP%2FUSD&timeframes=1h&mode=beginner",
    );

    // Active-filter chips reflect the URL on first render.
    await expect(page.getByTestId("chip-inst-XAU/USD")).toBeVisible();
    await expect(page.getByTestId("chip-inst-GBP/USD")).toBeVisible();
    await expect(page.getByTestId("chip-tf-1h")).toBeVisible();
    await expect(page.getByTestId("chip-mode-beginner")).toBeVisible();

    // The filter panel's pressed-state also hydrates — proves the
    // URL → state path covers the in-panel buttons, not just chips.
    await page.getByTestId("button-toggle-filters").click();
    await expect(
      page.getByTestId("filter-instrument-XAU/USD"),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByTestId("filter-instrument-GBP/USD"),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("filter-timeframe-1h")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Non-selected timeframe stays unpressed (regression guard against
    // "all chips look active because we forgot to scope the lookup").
    await expect(page.getByTestId("filter-timeframe-4h")).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    // Full browser reload — the state must survive because it lives in
    // the URL, not in React state.
    await page.reload();
    await expect(page.getByTestId("chip-inst-XAU/USD")).toBeVisible();
    await expect(page.getByTestId("chip-inst-GBP/USD")).toBeVisible();
    await expect(page.getByTestId("chip-tf-1h")).toBeVisible();
    await expect(page.getByTestId("chip-mode-beginner")).toBeVisible();
  });

  test("removing a single active-filter chip clears only that filter", async ({
    page,
    baseURL,
  }) => {
    await stubHistoryNetwork(page);
    const user = await registerUser(baseURL!);
    await signIn(page, user);

    await page.goto(
      "/history?instruments=XAU%2FUSD&instruments=EUR%2FUSD&timeframes=1h",
    );

    await expect(page.getByTestId("chip-inst-XAU/USD")).toBeVisible();
    await expect(page.getByTestId("chip-inst-EUR/USD")).toBeVisible();
    await expect(page.getByTestId("chip-tf-1h")).toBeVisible();

    // Tap the EUR/USD chip × — the others must stay.
    await page.getByTestId("chip-inst-EUR/USD").click();

    await expect(page.getByTestId("chip-inst-EUR/USD")).toHaveCount(0);
    await expect(page.getByTestId("chip-inst-XAU/USD")).toBeVisible();
    await expect(page.getByTestId("chip-tf-1h")).toBeVisible();

    // URL must reflect the surgical removal: one instrument left, the
    // timeframe untouched.
    const sp = parseHistoryQuery(page.url());
    expect(sp.getAll("instruments")).toEqual(["XAU/USD"]);
    expect(sp.getAll("timeframes")).toEqual(["1h"]);
  });

  test("\"Clear all\" wipes every filter and removes the chip row", async ({
    page,
    baseURL,
  }) => {
    await stubHistoryNetwork(page);
    const user = await registerUser(baseURL!);
    await signIn(page, user);

    await page.goto(
      "/history?instruments=XAU%2FUSD&timeframes=1h&timeframes=4h&mode=pro",
    );
    await expect(page.getByTestId("active-filters-row")).toBeVisible();

    await page.getByTestId("button-clear-filters-chips").click();

    // Chip row goes away entirely — there are no active filters and no
    // saved presets (stub returned empty), so the whole bar unmounts.
    await expect(page.getByTestId("active-filters-row")).toHaveCount(0);

    // URL clean: no filter params, no page param. wouter may leave the
    // bare `/history` path with no trailing `?`.
    const sp = parseHistoryQuery(page.url());
    expect(sp.getAll("instruments")).toEqual([]);
    expect(sp.getAll("timeframes")).toEqual([]);
    expect(sp.get("mode")).toBeNull();
  });

  test("empty state with active filters shows the filter-specific copy and a clear-filters button", async ({
    page,
    baseURL,
  }) => {
    await stubHistoryNetwork(page);
    const user = await registerUser(baseURL!);
    await signIn(page, user);

    await page.goto("/history?instruments=XAU%2FUSD&timeframes=1h");

    const empty = page.getByTestId("history-empty-state");
    await expect(empty).toBeVisible();
    // The filter-specific empty-state copy (EN locale at register time).
    await expect(empty).toContainText("No matches for these filters");
    await expect(empty).toContainText(
      "Try removing a filter or clearing all to see more analyses.",
    );

    // The CTA on the filtered empty state must clear filters (not the
    // "Start analysis" CTA shown on the unfiltered no-data state).
    const cta = page.getByTestId("button-clear-filters-empty");
    await expect(cta).toBeVisible();
    await expect(page.getByTestId("button-start-analysis")).toHaveCount(0);

    await cta.click();
    // After clearing, the unfiltered empty state takes over and the
    // primary CTA flips to "Start analysis".
    await expect(page.getByTestId("button-start-analysis")).toBeVisible();
    await expect(page.getByTestId("button-clear-filters-empty")).toHaveCount(0);
    expect(parseHistoryQuery(page.url()).getAll("instruments")).toEqual([]);
  });
});
