import { defineConfig, devices } from "@playwright/test";

const PORT = 4380;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// CI-style settings: serial workers, no .only, retries on first failure.
// Keeping a single worker also avoids two e2e specs racing on the same
// in-memory rate limiters in the api-server child process.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // The production build registers a workbox Service Worker that
    // intercepts navigations and `/api/*` fetches. Playwright's
    // `page.route` does NOT intercept SW-mediated network calls by
    // default, so a stubbed `GET /api/analyses/:id` would silently
    // fall through to the real api-server (which returns 404 for the
    // synthetic stub id). Blocking the SW for the test browser keeps
    // route stubs authoritative without disabling the SW in the build
    // itself. See: https://playwright.dev/docs/network#missing-network-events-and-service-workers
    serviceWorkers: "block",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Use the full Chromium binary instead of chrome-headless-shell.
        // The headless shell strips features (extensions, GPU acceleration
        // hooks) that some third-party widgets — TradingView's embed loader
        // included — depend on to populate their container. Using the full
        // browser keeps the happy-path render reliable in headless mode.
        channel: "chromium",
      },
    },
  ],
  webServer: {
    command: "pnpm run start-test-server",
    url: `${BASE_URL}/api/healthz`,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: String(PORT),
      E2E_API_PORT: "4381",
    },
    stdout: "pipe",
    stderr: "pipe",
  },
});
