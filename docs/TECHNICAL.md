# AI Trading Assistant — Technical Documentation

> Internal engineering reference for the AI Trading Assistant ("Trade Pilot") MVP.
> Last updated: 26 April 2026.

---

## 1. Product Summary

A mobile-first PWA that helps retail traders make better decisions by combining
OpenAI-powered chart analysis with macro context (news + economic calendar) and
technical indicators. It is **decision-support**, not a signal generator.

- **User persona**: "DR" (the trader)
- **Agent persona**: "Rere" (the AI assistant)
- **Languages**: English (default) + Indonesian, switchable per user
- **Default theme**: white-dominant light (primary `#1e3a5f`), deep navy dark
- **Data partners**:
  - **Newsmaker.id** — news + economic calendar
  - **Yahoo Finance** — intraday OHLC fallback (1m–4h)
  - **TradingView** — embedded market-quotes widget on Dashboard

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (PWA)                                                  │
│  ─ React 19 + Vite 7  + Wouter routing                          │
│  ─ shadcn/ui + Tailwind v4                                      │
│  ─ TanStack Query v5 (auto-generated hooks via Orval)           │
│  ─ react-hook-form + @hookform/resolvers v5 + Zod v4            │
│  ─ Service Worker (Workbox + Web Push handler)                  │
│  ─ EventSource → /api/notifications/stream (SSE)                │
│  ─ TradingView embed (Dashboard market-quotes widget)           │
│  ─ ContinuousTicker (sticky header ticker; uses /api/quotes/live│
│    + /api/news, NOT TradingView)                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTPS (cookie session_token)
┌──────────────────────────▼──────────────────────────────────────┐
│  Express 5 API server                                           │
│  ─ Routes: auth, analyses, notifications, push, admin,          │
│            quotes, historical, news, calendar, healthz          │
│  ─ Background jobs (hourly + daily, incl. retention sweep)      │
│  ─ In-process Notification EventEmitter (per-user channels)     │
│  ─ In-memory rate limiter + persistent per-account lockout      │
│  ─ Graceful SIGTERM/SIGINT shutdown (drains jobs + pool)        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼─────────────────┬──────────────────┐
        ▼                  ▼                 ▼                  ▼
   PostgreSQL         OpenAI API        Newsmaker.id       Yahoo Finance
   (Drizzle ORM)      (gpt-4o)          (news+calendar)    (intraday OHLC)
```

**Monorepo layout** (pnpm workspaces):

| Path                       | Purpose                                        |
|----------------------------|------------------------------------------------|
| `artifacts/ai-trading`     | React + Vite PWA (frontend)                    |
| `artifacts/api-server`     | Express API server                             |
| `artifacts/mockup-sandbox` | Internal Vite preview server for UI mockups    |
| `lib/db`                   | Drizzle schema + migration push                |
| `lib/api-spec`             | Single source-of-truth OpenAPI YAML            |
| `lib/api-client-react`     | Orval-generated React Query hooks              |
| `lib/api-zod`              | Orval-generated Zod schemas                    |
| `tests/e2e`                | Playwright real-browser regression suite       |

---

## 3. Key Commands

```bash
# Install
pnpm install

# Type-check everything
pnpm run typecheck

# Build everything (typecheck + bundle)
pnpm run build

# Regenerate API client + Zod schemas from openapi.yaml
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (development)
pnpm --filter @workspace/db run push

# Run individual workflows
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/ai-trading run dev

# Run test suites
pnpm --filter @workspace/api-server run test     # Vitest, ~187 tests
pnpm --filter @workspace/ai-trading run test     # Vitest + RTL, ~36 tests
pnpm --filter @workspace/e2e run test            # Playwright, real browser
```

---

## 4. Environment Variables

| Variable                        | Required | Description                                        |
|---------------------------------|----------|----------------------------------------------------|
| `DATABASE_URL`                  | yes      | Postgres connection string                         |
| `OPENAI_API_KEY`                | yes      | OpenAI API key (gpt-4o)                            |
| `VAPID_PUBLIC_KEY`              | yes      | Web Push VAPID public key                          |
| `VAPID_PRIVATE_KEY`             | yes      | Web Push VAPID private key                         |
| `VAPID_EMAIL`                   | yes      | Contact email for VAPID                            |
| `SESSION_SECRET`                | yes      | Used to sign session cookies                       |
| `ANALYSIS_QUOTA_PER_HOUR`       | no (5)   | Per-user analysis quota / hour (admins bypass)     |
| `ANALYSIS_QUOTA_PER_DAY`        | no (20)  | Per-user analysis quota / day (admins bypass)     |
| `ANALYSES_RETENTION_DAYS`       | no (90)  | Hard delete cutoff for old analyses (min 30, max 365) |
| `PORT`                          | yes      | Web/API port (set by Replit per artifact)          |
| `BASE_PATH`                     | yes      | Web base path (set by Replit per artifact)         |

---

## 5. Database Schema

PostgreSQL via Drizzle ORM. Source: `lib/db/src/schema/index.ts`.

### Tables

- **users** — `id`, `email` (unique), `password_hash`, `display_name`,
  `role` (`user`/`admin`/`super_admin`), `selected_mode`
  (`beginner`/`pro`), `theme_preference`, `onboarding_completed`,
  `security_question`, `security_answer_hash`,
  `push_expiry` (bool, default true), `push_broadcast` (bool, default true),
  `failed_reset_attempts` (int, default 0), `reset_locked_until` (nullable
  timestamp — persistent forgot-password brute-force lockout),
  `created_at`, `updated_at`.
- **sessions** — `id`, `user_id`, `token` (unique), `expires_at`.
- **password_reset_tokens** — short-lived single-use tokens for the 3-step
  forgot-password flow.
- **analyses** — rich row for each AI analysis: `id`, `user_id`,
  `instrument`, `timeframe`, `mode`, `user_input_context`, `raw_ai_output`,
  `valid_until`, `market_condition`, `risk_level`,
  `confidence_min` / `confidence_max` (Pro band), `main_scenario`,
  `alternative_scenario`, `why_reason`, `failure_conditions`, `base_case`,
  `bullish_scenario`, `bearish_scenario`, `key_drivers_technical`,
  `key_drivers_fundamental`, `market_context`, `invalidation_conditions`,
  `uncertainty_notes`, `trading_bias`, `opportunity`, `risk`, plus a
  snapshot of the technical-indicator tally taken at analysis time.
- **feedback** — `id`, `analysis_id`, `user_id`, `feedback_type`
  (`useful`/`not_useful`), `outcome` (`correct`/`wrong`/`unknown`),
  `note`, `created_at`.
- **notifications** — `id`, `user_id` (nullable for role-targeted rows),
  `target_role` (nullable), `title`, `message`, `type`
  (`info`/`warning`/`error`), `read_at`, `created_at`.
- **push_subscriptions** — Web Push VAPID subscription per user/device.
- **user_tags** — `(user_id, tag)` unique pair. Lets super-admins group
  users (e.g. `vip`, `beta-tester`) for targeted broadcasts.
- **broadcasts** — audit row for every super-admin broadcast: `sender_id`,
  `title`, `message`, `audience_type` (`all`/`role`/`tag`),
  `audience_value`, `recipient_count`, `created_at`.

### Enums

- `role`: `user`, `admin`, `super_admin`
- `mode`: `beginner`, `pro`
- `market_condition`: `trending_up`, `trending_down`, `ranging`, `volatile`
- `risk_level`: `low`, `medium`, `high`
- `feedback_type`: `useful`, `not_useful`
- `outcome`: `correct`, `wrong`, `unknown`
- `notification_type`: `info`, `warning`, `error`
- `audience_type`: `all`, `role`, `tag`

### Timeframe validity periods

Intraday timeframes (1m–4h) use Yahoo Finance as the OHLC source; daily
and weekly use Newsmaker/Yahoo depending on availability.

| Timeframe | Validity   |
|-----------|------------|
| 1m        | 15 minutes |
| 5m        | 1 hour     |
| 15m       | 2.5 hours  |
| 1h        | 5 hours    |
| 4h        | 18 hours   |
| 1D        | 36 hours   |
| 1W        | 96 hours   |

---

## 6. API Surface

Primary source of truth: `lib/api-spec/openapi.yaml`. The auth, analyses,
notifications, push, admin, and superadmin routes have generated React Query
hooks (`@workspace/api-client-react`) and Zod schemas (`@workspace/api-zod`) —
**never hand-edit the generated files**.

> **Caveat — not yet in OpenAPI:** the public market-data routes
> (`/quotes/live`, `/historical/indicators`, `/news`, `/calendar`) are still
> consumed via hand-written hooks under `artifacts/ai-trading/src/hooks/`
> (`use-live-quotes.ts`, `use-technical-indicators.ts`, `use-news.ts`,
> `use-calendar.ts`). Their request/response shapes are validated only by
> the route handlers themselves. Folding them into `openapi.yaml` is a known
> follow-up.
>
> **Spec drift to fix in a follow-up code task** (do not silently rewrite
> the spec to match — both sides need a deliberate decision):
> - `POST /auth/forgot-password/reset` actually returns **401** for an
>   invalid/expired reset token (treated as an authn failure); the spec
>   currently documents 400.
> - `GET /notifications` returns `{ notifications: [...] }` only — the
>   `unreadCount` field is computed client-side from the list.

### Auth

- `POST /api/auth/register` — body validated by zod (email, password ≥ 6,
  displayName, `selectedMode` ∈ {`beginner`,`pro`}, `securityQuestion` ∈
  allow-list, `securityAnswer`).
- `POST /api/auth/login` — sets `session_token` cookie (HttpOnly, SameSite=Lax).
- `POST /api/auth/logout`
- `GET  /api/auth/me`
- `PATCH /api/auth/profile`
- `PATCH /api/auth/password` — change password (current + new).
- `PATCH /api/auth/security-question` — change security Q/A (gated by
  current password).
- `POST /api/auth/forgot-password/question` — **rate-limited 10/15min**.
- `POST /api/auth/forgot-password/verify`   — **rate-limited 5/15min**.
  Wrong answers also increment `users.failed_reset_attempts`; after the
  threshold the account is locked via `reset_locked_until` (survives
  process restarts and IP rotation).
- `POST /api/auth/forgot-password/reset`    — **rate-limited 5/15min**.

All forgot-password limiters return HTTP 429 with `Retry-After`. The Express
app sets `trust proxy: 1` so `req.ip` reflects the real client IP.

### Analyses

- `POST /api/analyses` — generate a new analysis (enforces hourly + daily quota).
- `GET  /api/analyses` — paginated list.
- `GET  /api/analyses/:id`
- `GET  /api/analyses/summary`
- `GET  /api/analyses/recent-instruments`
- `GET  /api/analyses/personal-analytics`
- `GET  /api/analyses/quota` — returns `{hourly:{remaining,limit}, daily:{remaining,limit}, unlimited}`.
  Admin/super_admin receive `unlimited:true`.
- `POST /api/analyses/:id/feedback`

### Market data (public, server-side proxied)

- `GET /api/quotes/live`            — live spot quotes for the sticky
  ticker / Dashboard fallback when TradingView fails to populate.
- `GET /api/historical/indicators`  — Yahoo-backed intraday OHLC + derived
  technical indicators per timeframe.
- `GET /api/news`                   — Newsmaker.id news feed.
- `GET /api/calendar`               — Newsmaker.id economic calendar.

### Notifications

- `GET   /api/notifications` — query `?unreadOnly=true` for unread filter.
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`
- `GET   /api/notifications/stream` — **Server-Sent Events**. Emits
  `event: notification` with the inserted row whenever any background job,
  admin broadcast, analysis-completion, or AI-error alert inserts a
  notification row for the authenticated user. Heartbeat every 25s.

### Push

- `GET    /api/push/public-key` — public.
- `POST   /api/push/subscribe`
- `DELETE /api/push/unsubscribe`
- `GET    /api/push/subscription-status`
- `GET    /api/push/prefs` — returns `{pushExpiry, pushBroadcast}` booleans.
- `PATCH  /api/push/prefs` — partial update.

### Admin (admin / super_admin only)

- `GET  /api/admin/stats` — returns `totalUsersToday`, `totalAnalysesToday`,
  `totalAnalysesThisWeek`, `totalAnalysesThisMonth`, `totalUsers`,
  `instrumentBreakdown`, `modeBreakdown`.
- `GET  /api/admin/analyses` — paginated, all users.
- `GET  /api/admin/feedback` — paginated feedback rows for QA review.
- `POST /api/admin/notifications` — broadcast (also dispatches Web Push to
  every target who hasn't disabled `pushBroadcast`). Records a row in
  `broadcasts` with audience metadata + final recipient count.
- `GET  /api/admin/broadcasts` — broadcast history (super_admin only).

### Super-admin only

- `GET    /api/superadmin/users`
- `POST   /api/superadmin/users`
- `DELETE /api/superadmin/users/:id`
- `PATCH  /api/superadmin/users/:id/password`
- `PATCH  /api/superadmin/users/:id/role`
- `GET    /api/superadmin/tags` — distinct tags currently in use.
- `GET    /api/superadmin/users/:id/tags`
- `POST   /api/superadmin/users/:id/tags` — attach tag to user.
- `DELETE /api/superadmin/users/:id/tags/:tag` — detach tag from user.

### Health

- `GET /api/healthz` — liveness probe used by Replit Deployments.

---

## 7. Realtime Notifications (SSE)

- Backend emitter: `artifacts/api-server/src/lib/notifications-emitter.ts` —
  wraps Node `EventEmitter` with `emitForUser(userId, payload)` and
  `subscribeForUser(userId, listener)`.
- Endpoint: `GET /api/notifications/stream` writes `event: ready`, then one
  `event: notification` per emit, plus a `: heartbeat` comment every 25s.
- Every notification insertion (`jobs.ts`, `routes/admin.ts`,
  `routes/analyses.ts`) also calls `notificationsEmitter.emitForUser(...)`.
- Frontend (`artifacts/ai-trading/src/components/layout.tsx`) opens a single
  `EventSource` while authenticated and invalidates the unread-notifications
  React Query on each `notification` event, so the bell badge updates
  without a page reload. Browsers auto-reconnect on transient failures.

> **Single-instance assumption**: the emitter is in-process. For multi-instance
> deployments, swap to Redis pub/sub (see §15).

---

## 8. Rate Limiting & Brute-force Protection

Two layered defenses guard the forgot-password endpoints:

1. **In-memory IP+email window** (`artifacts/api-server/src/middleware/rate-limit.ts`):
   - Key: `${clientIp(req)}|${email.toLowerCase()}`
   - 10 question lookups / 15min, 5 verify attempts / 15min, 5 reset attempts / 15min.
   - Stale buckets pruned every 60s. Resets on process restart.
2. **Persistent per-account lockout** (`users.failed_reset_attempts` +
   `users.reset_locked_until`): survives restarts and IP rotation, so an
   attacker rotating through proxies still hits the same account-level wall.

Both responses return 429 with `Retry-After`.

---

## 9. Push Notification Preferences

- Per-user toggles persisted on `users.push_expiry` and
  `users.push_broadcast` (boolean, default `true`).
- `jobs.ts` honors `push_expiry=false` (still inserts the in-app
  notification, but skips the Web Push send).
- `admin.ts` honors `push_broadcast=false` (broadcast is still recorded as an
  in-app notification for everyone, but Web Push fan-out is filtered).
- Frontend toggles live on `/notifications` and call `PATCH /api/push/prefs`.

---

## 10. Quota System

- Configurable: `ANALYSIS_QUOTA_PER_HOUR` (default 5), `ANALYSIS_QUOTA_PER_DAY`
  (default 20).
- Enforced in `POST /api/analyses`. Returns 429 with Indonesian-and-English
  error message when exceeded.
- `GET /api/analyses/quota` returns the current remaining counts so the UI
  can render a chip in `/analyze` (color states: red ≤ 1, amber ≤ 25%,
  primary otherwise).
- Admin and super_admin bypass the quota; the endpoint returns
  `{unlimited: true}` for them and the chip hides.

---

## 11. PWA & Web Push

- `vite-plugin-pwa` with the `injectManifest` strategy.
- Service worker source: `artifacts/ai-trading/src/sw.ts`.
  - Workbox precache + offline fallback (`offline.html`).
  - Push event handler (Web Push payload schema:
    `{title, body, url?, tag?, icon?}`).
  - Click handler navigates to `data.url`.
- VAPID keys provided via env vars (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`,
  `VAPID_EMAIL`); never expose the private key to the frontend.

---

## 12. Background Jobs

Started inside `artifacts/api-server/src/lib/jobs.ts` on server boot:

| Job                         | Cadence | Purpose                                                          |
|-----------------------------|---------|------------------------------------------------------------------|
| `sendFeedbackReminders`     | Hourly  | Reminds users to submit feedback if no analysis in 3+ days       |
| `sendDailySummary`          | Daily   | Posts ringkasan harian to admins/super-admins                    |
| `sendAnalysisExpiryAlerts`  | Hourly  | Warns users 2h before an analysis expires                        |
| `purgeOldAnalyses`          | Daily   | Hard-deletes analyses older than `ANALYSES_RETENTION_DAYS` (90d  |
|                             |         | by default), with a 7-day "about to be deleted" warning notice   |

Every notification insert is mirrored via `notificationsEmitter.emitForUser`
so connected SSE clients receive realtime updates.

On shutdown (`SIGTERM`/`SIGINT`) `index.ts` stops timers, awaits any
in-flight tick, then closes the Postgres pool — no more "ended pool" errors
when Replit Deployments rolls a new revision.

---

## 13. Internationalization

- Locale dictionaries: `artifacts/ai-trading/src/locales/{en,id}.ts`.
- Hook: `useTranslation()` returns `{t, lang, setLang}`.
- Recently-added namespaces: `notifications.push_prefs_*`,
  `analyze.intraday_data`, `dashboard.live_prices_*`,
  `analytics.*`, `admin.broadcast_*`, `admin.tags_*`.
- Mixing-language regression: see commits `a894d93` (Analysis Detail /
  Analyze / Profile) and `694fd68` (Admin Dashboard / User Management).

---

## 14. Deployment Notes

- Replit Autoscale or Reserved-VM Deployments. Build runs
  `pnpm --filter @workspace/ai-trading run build` then serves
  `artifacts/ai-trading/dist/public` as static.
- API server is its own artifact (Node).
- Liveness probe: `GET /api/healthz`.
- Graceful shutdown is handled (`SIGTERM`/`SIGINT` → drain jobs → close
  pool); the process force-exits if it can't shut down cleanly within the
  timeout window.
- After merging a task agent's branch, run `.local/post_merge_setup.sh` if
  present (handles Drizzle push + codegen drift).
- All secrets must be configured in the Replit environment-variables UI
  before the first deployment.

---

## 15. Open Follow-ups

1. **Multi-instance reliability** — Move SSE pub/sub and the rate-limit
   in-memory map to Redis so notifications and limits stay correct when
   scaled out (the persistent lockout already survives restarts; only the
   short window store and SSE fan-out remain in-process).
2. **Regression test coverage gap** — Components covered: Login, Register,
   Profile, Dashboard, Analyze, History, Notifications, Analysis Detail.
   Still uncovered: Forgot-password flow, Reset-password flow, Onboarding,
   Personal Analytics — tracked in project task #65.
3. **TradingView resilience** — `tradingview-market-quotes.tsx` polls for
   `iframe`/widget population and triggers a one-shot fallback to the
   server-side `/api/quotes/live` ticker on script error or load timeout.
   The detection is heuristic (childElementCount + iframe presence);
   revisit if upstream behavior shifts.

---

## 16. Testing & Quality

The project is validated by three test suites; all are green at the time
of writing.

| Suite                | Scope                                                  | Count |
|----------------------|--------------------------------------------------------|-------|
| `api-server` Vitest  | Routes, middleware, jobs, AI prompt builders           | 187   |
| `ai-trading` Vitest  | React component / page tests with React Testing Lib    |  36   |
| `e2e` Playwright     | Real-browser smoke (Dashboard live prices, ticker)     |   2   |

### Component test harness

- Setup file: `artifacts/ai-trading/src/test/setup.ts` polyfills the
  jsdom-shaped browser APIs that shadcn/Radix + Recharts assume:
  `ResizeObserver`, `Element.prototype.scrollIntoView`,
  `hasPointerCapture` / `setPointerCapture` / `releasePointerCapture`,
  `EventSource`, and `window.matchMedia`.
- Strict fetch mock: `src/pages/__tests__/test-helpers.tsx →
  installFetchMock(routes)` is **strict by default**. Any fetch call hitting
  an URL not declared in the route map throws and fails the test, so we
  catch silent regressions when a page starts pinging a new endpoint.
  Pass `{strict: false}` for ad-hoc cases that genuinely need a permissive
  mock.
- Radix `<Select>` is portal-rendered and unfriendly to RTL; prefer
  mocking it (`vi.mock("@/components/ui/select", …)` — see
  `register.test.tsx` for the canonical pattern) to a real interaction
  whenever possible.

### react-hook-form + Zod

- `@hookform/resolvers` is pinned to **v5.x** (was v3.10). The v3 resolver
  silently mismatched zod-v4 schemas, causing `<FormMessage>` errors to
  never render on Login / Register / Profile / Analyze. The upgrade
  restored inline form validation across the app.

---

## 17. Troubleshooting

| Symptom                                  | Likely cause / fix                                                |
|------------------------------------------|-------------------------------------------------------------------|
| Workflow fails with `EADDRINUSE`         | Old process not yet released the port. Restart the workflow.      |
| Bell icon doesn't update without reload  | Confirm `/api/notifications/stream` returns 200 and the SSE       |
|                                          | reaches the browser (DevTools → Network → EventStream tab).       |
| "Pertanyaan keamanan tidak valid"        | `securityQuestion` must match an entry in `SECURITY_QUESTIONS`    |
|                                          | (`artifacts/api-server/src/routes/auth.ts`).                      |
| Push delivery fails silently             | Check VAPID env vars are set and that the user actually has an    |
|                                          | active subscription (`/api/push/subscription-status`).            |
| Stats card shows zeros                   | The `/api/admin/stats` payload is `totalUsersToday`,              |
|                                          | `totalAnalysesToday`, `totalAnalysesThisWeek`,                    |
|                                          | `totalAnalysesThisMonth`. Regenerate the API client if stale.     |
| `<FormMessage>` errors not rendering     | `@hookform/resolvers` must be ≥ 5.x to match Zod v4 schemas.      |
| Dashboard prices stuck on "Loading…"     | TradingView script is blocked by an ad-blocker; the sticky        |
|                                          | ticker fallback hits `/api/quotes/live` after one retry.          |
| Intraday OHLC empty for an instrument    | Yahoo Finance returned an empty series; fall back to a higher     |
|                                          | timeframe or check `YAHOO_SYMBOL_MAP` in `lib/historical.ts`.     |
| Component tests flake on a new fetch URL | Strict fetch mock is doing its job — declare the new URL in the   |
|                                          | route map passed to `installFetchMock`.                           |
