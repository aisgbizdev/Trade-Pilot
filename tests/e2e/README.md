# Trade Pilot end-to-end tests (`@workspace/e2e`)

Real-browser regression suite that boots the api-server + the built
ai-trading SPA inside one origin and drives Chromium through Playwright.

This complements (does not replace) the unit / component tests:

| Layer                 | Where                                                                   | What it catches                                  |
|-----------------------|-------------------------------------------------------------------------|--------------------------------------------------|
| api unit              | `pnpm --filter @workspace/api-server run test`                          | Express route logic                              |
| ai-trading component  | `pnpm --filter @workspace/ai-trading run test`                          | React components in jsdom                        |
| **end-to-end (here)** | `pnpm --filter @workspace/e2e run test`                                 | Real auth flow + real `/dashboard` + real CDN    |

## Layout

```
tests/e2e/
├── playwright.config.ts        # Single chromium project, single worker
├── server/test-server.mjs      # Spawns api-server, proxies /api, serves SPA
└── tests/dashboard-prices.spec.ts
```

The harness server keeps everything on one origin (`http://127.0.0.1:4380`)
so that `sameSite=lax` session cookies behave the same as in production.
Internally it spawns the bundled api-server on `:4381` and reverse-proxies
`/api/*` to it.

## Running locally

One-time browser install (the @playwright/test version in `package.json`
pins the chromium revision, so re-running is reproducible):

```bash
./scripts/install-e2e-browsers.sh
```

Then:

```bash
pnpm --filter @workspace/e2e run test
```

The `test` script builds api-server and ai-trading first; once built you
can iterate faster with:

```bash
pnpm --filter @workspace/e2e run test:no-build
```

## CI / regression workflow

The `.replit` workflow `e2e-test` runs alongside `api-server-test` and
`ai-trading-test`. It assumes browsers were installed by
`scripts/post-merge.sh`, which calls `install-e2e-browsers.sh` after every
merge.

## What the suite asserts

1. **Happy path** — sign in, land on `/dashboard`, the
   `data-testid="tradingview-market-quotes"` host mounts and its inner
   `.tradingview-widget-container__widget` gets populated by the embed
   script.
2. **CDN blocked** — Playwright `context.route()` aborts every request to
   `s3.tradingview.com`. After the component's two retry attempts, the
   widget drops to the fallback ticker; we assert
   `data-testid="live-prices-fallback"` is mounted and at least one
   `live-quote-*` card is shown.
