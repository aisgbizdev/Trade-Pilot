import { chromium } from "@playwright/test";

const URL = process.env.TARGET_URL || "http://127.0.0.1:4380/";

const browser = await chromium.launch({ channel: "chromium" });
const context = await browser.newContext({ viewport: { width: 414, height: 740 } });
const page = await context.newPage();

await page.goto(URL, { waitUntil: "networkidle" });
// Wait for splash to dismiss.
await page.waitForFunction(() => !document.querySelector('[data-testid="splash-screen"]'), null, { timeout: 5000 });
await page.waitForSelector('[data-testid="continuous-ticker"]');

const before = await page.locator('[data-testid="continuous-ticker"]').boundingBox();
const beforeViewport = await page.evaluate(() => window.scrollY);
console.log("BEFORE scroll: scrollY=", beforeViewport, "ticker rect=", before);

await page.mouse.wheel(0, 600);
await page.waitForTimeout(500);

const after = await page.locator('[data-testid="continuous-ticker"]').boundingBox();
const afterViewport = await page.evaluate(() => window.scrollY);
console.log("AFTER scroll:  scrollY=", afterViewport, "ticker rect=", after);

const stillVisible = after && after.y >= 0 && after.y < 200;
console.log("RESULT: ticker still pinned near top =", stillVisible);

await browser.close();
process.exit(stillVisible ? 0 : 1);
