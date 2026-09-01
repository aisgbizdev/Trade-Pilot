/**
 * Repeatable logged-in browser coverage for the saved analysis detail page.
 *
 * The login is real: every test registers a uniquely named account and uses
 * the public login form. The detail response is a deterministic browser
 * fixture, so the test never depends on a shared History row, writes no
 * analysis, and never calls the OpenAI-backed create endpoint.
 *
 * Both viewport checks intentionally use the same fixture and selectors:
 * - desktop keeps Buy and Sell side-by-side;
 * - mobile stacks Buy above Sell;
 * - both preserve the Suggested Levels card, right-aligned values, and copy
 *   feedback for each side.
 */
import { expect, test, type Page } from "@playwright/test";

import {
  registerE2ETestUser,
  signInE2ETestUser,
  STABLE_ANALYSIS_ID,
  stubStableAnalysis,
} from "./fixtures/analysis-detail";

async function openStableAnalysis(
  page: Page,
  baseURL: string,
  label: string,
) {
  await stubStableAnalysis(page);
  const user = await registerE2ETestUser(baseURL, label);
  await signInE2ETestUser(page, user);
  await page.goto(`/analyses/${STABLE_ANALYSIS_ID}`);

  const card = page.getByTestId("card-trade-plan");
  await expect(card).toBeVisible();
  await expect(page.getByTestId("trade-plan-preferred-side")).toContainText(
    /Buy|Beli/i,
  );
  await expect(page.getByTestId("trade-plan-buy-entry")).toHaveText(
    "1.0840–1.0850",
  );
  await expect(page.getByTestId("trade-plan-sell-entry")).toHaveText(
    "1.0800–1.0810",
  );

  return card;
}

async function assertAlignedValues(page: Page) {
  for (const side of ["buy", "sell"] as const) {
    const valueBoxes = await Promise.all(
      ["entry", "sl", "tp1", "tp2", "rr"].map((value) =>
        page.getByTestId(`trade-plan-${side}-${value}`).boundingBox(),
      ),
    );

    expect(valueBoxes.every((box) => box !== null)).toBe(true);
    const rightEdges = valueBoxes.map((box) => box!.x + box!.width);
    expect(Math.max(...rightEdges) - Math.min(...rightEdges)).toBeLessThanOrEqual(
      2,
    );
  }
}

async function assertCopyFeedback(page: Page) {
  for (const side of ["buy", "sell"] as const) {
    const button = page.getByTestId(`button-copy-levels-${side}`);
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toContainText(/Copied|Disalin/i);
  }
}

test.describe("Logged-in analysis detail fixture", () => {
  test("desktop keeps Suggested Levels and Buy/Sell aligned", async ({
    page,
    baseURL,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openStableAnalysis(page, baseURL!, "analysis-desktop");

    const buy = page.getByTestId("trade-plan-buy");
    const sell = page.getByTestId("trade-plan-sell");
    const buyBox = await buy.boundingBox();
    const sellBox = await sell.boundingBox();

    expect(buyBox).not.toBeNull();
    expect(sellBox).not.toBeNull();
    expect(Math.abs(buyBox!.y - sellBox!.y)).toBeLessThanOrEqual(8);
    await assertAlignedValues(page);
    await assertCopyFeedback(page);
  });

  test("mobile keeps Suggested Levels readable with Buy above Sell", async ({
    page,
    baseURL,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openStableAnalysis(page, baseURL!, "analysis-mobile");

    const buy = page.getByTestId("trade-plan-buy");
    const sell = page.getByTestId("trade-plan-sell");
    const buyBox = await buy.boundingBox();
    const sellBox = await sell.boundingBox();

    expect(buyBox).not.toBeNull();
    expect(sellBox).not.toBeNull();
    expect(sellBox!.y).toBeGreaterThan(buyBox!.y + buyBox!.height - 8);
    await assertAlignedValues(page);
    await assertCopyFeedback(page);
  });
});