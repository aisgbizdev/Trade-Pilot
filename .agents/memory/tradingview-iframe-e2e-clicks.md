---
name: TradingView iframe e2e clicks
description: How to keep Analyze-flow browser tests reliable around third-party TradingView iframe layout shifts.
---

For browser tests whose real subject is the analysis detail page, use a direct DOM click to submit the Analyze form during setup if coordinate-based Playwright clicks are intermittent. Keep at least one dedicated Analyze smoke test using a real pointer click.

**Why:** TradingView iframe layout shifts can intermittently swallow the coordinate-based submit click in headless Chromium even though the button is visible and enabled. A DOM click stabilizes setup-only flows without weakening the separate end-to-end pointer test.

**How to apply:** Use this only when Analyze is a fixture-creation step for a downstream detail-page test. Tests specifically covering Analyze interaction must continue to use a normal browser click.