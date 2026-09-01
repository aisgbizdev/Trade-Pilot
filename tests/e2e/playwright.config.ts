import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_TEST_PORT) || 4380;
const API_PORT = PORT + 1;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const RUN_ID = String(process.env.E2E_TEST_PORT || "default");

// CI-style settings: serial workers, no .only, retries on first failure.
// Keeping a single worker also avoids two e2e specs racing on the same
// in-memory rate limiters in the api-server child process.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  outputDir: `./test-results/${RUN_ID}`,
  reporter: process.env.CI
    ? [
        ["list"],
        [
          "html",
          {
            open: "never",
            outputFolder: `playwright-report/${RUN_ID}`,
          },
        ],
      ]
    : "list",
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
    // A completion-validation run may begin while a previous manual run's
    // server is still tearing down. Reusing that listener lets the first test
    // pass and then drops every later request with ECONNREFUSED. Each suite run
    // must own the server lifecycle to keep login fixtures repeatable.
    reuseExistingServer: false,
    env: {
      PORT: String(PORT),
      E2E_API_PORT: String(API_PORT),
    },
    stdout: "pipe",
    stderr: "pipe",
  },
});
