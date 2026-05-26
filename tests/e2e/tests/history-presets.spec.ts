/**
 * Real-browser end-to-end coverage for the saved filter presets row on
 * the History page (built in task #129, atop the filter+URL flow
 * covered by history-filters.spec.ts).
 *
 * Unlike history-filters.spec.ts, this suite does NOT stub
 * `/api/filter-presets` — the whole point is to exercise the real
 * round-trip through the `filterPresets` Postgres table:
 *
 *   1. Save the current filter combo as a named preset → chip shows up
 *      with the right name + correct counts.
 *   2. From a fresh navigation to /history, tap the preset chip → URL
 *      hydrates back to the saved filters and the active-filter chips
 *      come back.
 *   3. Rename via the pencil icon (prompt) → chip label updates.
 *   4. Delete via the trash icon (confirm) → chip disappears.
 *   5. Per-user cap (20): saving the 21st preset surfaces a friendly
 *      409 message via window.alert instead of a silent failure.
 *
 * The window.prompt / window.confirm / window.alert handlers are
 * registered with `page.on("dialog", …)` so the existing handler code
 * in history.tsx is exercised verbatim — no UI rewrite required.
 */
import { test, expect, request as pwRequest, type Page } from "@playwright/test";

interface TestUser {
  email: string;
  password: string;
}

async function registerUser(baseURL: string): Promise<TestUser> {
  const ts = Date.now();
  const slug = Math.random().toString(36).slice(2, 8);
  const email = `e2e-presets-${ts}-${slug}@trade-pilot.test`;
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

/**
 * Register a one-shot `dialog` handler that auto-responds to the next
 * dialog and resolves with its message. Using a one-shot keeps tests
 * independent: a stray dialog from a later step never accidentally
 * gets consumed by a stale handler.
 */
function awaitNextDialog(
  page: Page,
  respond: "accept" | "dismiss" = "accept",
  textForPrompt?: string,
): Promise<string> {
  return new Promise((resolve) => {
    page.once("dialog", async (dialog) => {
      const msg = dialog.message();
      if (respond === "accept") {
        await dialog.accept(textForPrompt ?? "");
      } else {
        await dialog.dismiss();
      }
      resolve(msg);
    });
  });
}

test.describe("History saved-filter presets (real Chromium + real DB)", () => {
  test("save → apply → rename → delete round-trip works against the real API", async ({
    page,
    baseURL,
  }) => {
    const user = await registerUser(baseURL!);
    await signIn(page, user);

    // Land on /history with a real filter combo so "Save preset" is enabled.
    await page.goto("/history?instruments=XAU%2FUSD&timeframes=1h");
    await expect(page.getByTestId("active-filters-row")).toBeVisible();

    // --- 1. SAVE -----------------------------------------------------
    const savePrompt = awaitNextDialog(page, "accept", "XAU 1h scalp");
    await page.getByTestId("button-save-preset").click();
    await savePrompt; // window.prompt fired and was accepted

    // The new chip wrapper must show up with the typed name. The wrapper
    // testid is `preset-<numericId>`; sibling buttons are
    // `preset-apply-…` / `preset-rename-…` / `preset-delete-…`, so a
    // `^="preset-"` prefix selector matches all of them and trips
    // strict-mode. Use `getByTestId(/^preset-\d+$/)` to hit only the
    // wrapper.
    const savedChip = page
      .getByTestId(/^preset-\d+$/)
      .filter({ hasText: "XAU 1h scalp" });
    await expect(savedChip).toBeVisible({ timeout: 5_000 });

    // --- 2. APPLY ----------------------------------------------------
    // Navigate away with no filters, then re-apply via chip tap.
    await page.goto("/history");
    await expect(page.getByTestId("active-filters-row")).toHaveCount(0);

    const applyTarget = page.locator('[data-testid^="preset-apply-"]', {
      hasText: "XAU 1h scalp",
    });
    await applyTarget.click();

    // URL hydrates from the saved preset and the chips come back.
    await expect
      .poll(() => new URL(page.url()).searchParams.getAll("instruments"), {
        timeout: 5_000,
      })
      .toEqual(["XAU/USD"]);
    expect(new URL(page.url()).searchParams.getAll("timeframes")).toEqual([
      "1h",
    ]);
    await expect(page.getByTestId("chip-inst-XAU/USD")).toBeVisible();
    await expect(page.getByTestId("chip-tf-1h")).toBeVisible();

    // --- 3. RENAME ---------------------------------------------------
    // Resolve the preset row's numeric id from the wrapper testid so we
    // can target the pencil/trash buttons (their ids include the id).
    const presetTestId = await savedChip.first().getAttribute("data-testid");
    const presetId = presetTestId?.replace(/^preset-/, "");
    expect(presetId).toMatch(/^\d+$/);

    const renamePrompt = awaitNextDialog(page, "accept", "XAU 1h v2");
    await page.getByTestId(`preset-rename-${presetId}`).click();
    await renamePrompt;

    await expect(
      page.getByTestId(/^preset-\d+$/).filter({ hasText: "XAU 1h v2" }),
    ).toBeVisible({ timeout: 5_000 });
    await expect(
      page.getByTestId(/^preset-\d+$/).filter({ hasText: "XAU 1h scalp" }),
    ).toHaveCount(0);

    // --- 4. DELETE ---------------------------------------------------
    const deleteConfirm = awaitNextDialog(page, "accept");
    await page.getByTestId(`preset-delete-${presetId}`).click();
    await deleteConfirm;

    await expect(
      page.getByTestId(/^preset-\d+$/).filter({ hasText: "XAU 1h v2" }),
    ).toHaveCount(0);
  });

  test("hitting the 20-preset per-user cap surfaces a friendly message instead of silently failing", async ({
    page,
    baseURL,
  }) => {
    const user = await registerUser(baseURL!);
    await signIn(page, user);

    // Pre-fill the user up to the cap via the API (using the session
    // cookies the browser context already holds). Saving 20 via the UI
    // would mean answering 20 prompts — not the point of this test.
    const apiRequest = page.context().request;
    for (let i = 1; i <= 20; i += 1) {
      const res = await apiRequest.post("/api/filter-presets", {
        data: {
          name: `Preset ${i}`,
          filters: {
            mode: "",
            instruments: ["XAU/USD"],
            timeframes: ["1h"],
            from: "",
            to: "",
            q: "",
          },
        },
      });
      expect(res.status(), `seed preset ${i}`).toBe(201);
    }

    await page.goto("/history?instruments=XAU%2FUSD&timeframes=1h");
    await expect(page.getByTestId("active-filters-row")).toBeVisible();

    // The 21st save should be rejected by the server (409) and the UI
    // must surface that via window.alert.
    //
    // Two dialogs fire here in sequence: a `prompt` (for the preset
    // name) and then — after the mutation's async onError runs — an
    // `alert` carrying the server message. Registering two `page.once`
    // listeners up-front races them on the first dialog; registering
    // the alert listener AFTER awaiting the prompt loses the alert
    // when the onError chain fires faster than the test catches up.
    // A single long-lived `page.on` keyed on `dialog.type()` handles
    // both reliably.
    const seenAlerts: string[] = [];
    const alertSeen = new Promise<string>((resolve) => {
      page.on("dialog", async (dialog) => {
        const msg = dialog.message();
        if (dialog.type() === "prompt") {
          await dialog.accept("Over the cap");
        } else {
          // alert (or confirm) — onError surfaces server copy here.
          seenAlerts.push(msg);
          await dialog.accept();
          resolve(msg);
        }
      });
    });

    await page.getByTestId("button-save-preset").click();
    const alertMsg = await alertSeen;

    // Backend error mentions the cap ("20"); UI surfaces it verbatim
    // via the ApiError.data.error path now read in history.tsx.
    expect(alertMsg).toContain("20");

    // No new chip should have been added.
    await expect(
      page.getByTestId(/^preset-\d+$/).filter({ hasText: "Over the cap" }),
    ).toHaveCount(0);
  });
});
