# AI Trading Assistant — Technical Documentation

> Internal engineering reference for the AI Trading Assistant MVP.
> Last updated: 25 April 2026.

---

## 1. Product Summary

A mobile-first PWA that helps retail traders make better decisions by combining
OpenAI-powered chart analysis with macro context (news + economic calendar) and
technical indicators. It is **decision-support**, not a signal generator.

- **User persona**: "DR" (the trader)
- **Agent persona**: "Rere" (the AI assistant)
- **Languages**: English (default) + Indonesian, switchable per user
- **Default theme**: white-dominant light (primary `#1e3a5f`), deep navy dark
- **Data partner**: Newsmaker.id (news + economic calendar feed)

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (PWA)                                                  │
│  ─ React 19 + Vite 7  + Wouter routing                          │
│  ─ shadcn/ui + Tailwind v4                                      │
│  ─ TanStack Query v5 (auto-generated hooks via Orval)           │
│  ─ Service Worker (Workbox + Web Push handler)                  │
│  ─ EventSource → /api/notifications/stream (SSE)                │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTPS (cookie session_token)
┌──────────────────────────▼──────────────────────────────────────┐
│  Express 5 API server (port 8080)                               │
│  ─ Routes: auth, analyses, notifications, push, admin,          │
│            quotes, historical, news, calendar                   │
│  ─ Background jobs (hourly + daily)                             │
│  ─ In-process Notification EventEmitter (per-user channels)     │
│  ─ In-memory rate limiter (forgot-password endpoints)           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   PostgreSQL         OpenAI API         Newsmaker.id API
   (Drizzle ORM)      (gpt-4o)           (news + calendar)
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
| `ANALYSIS_QUOTA_PER_DAY`        | no (20)  | Per-user analysis quota / day (admins bypass)      |
| `NEWSMAKER_API_KEY`             | optional | If supplied, enables live newsmaker.id integration |
| `PORT`                          | yes      | Web/API port (set by Replit per artifact)          |
| `BASE_PATH`                     | yes      | Web base path (set by Replit per artifact)         |

---

## 5. Database Schema

PostgreSQL via Drizzle ORM. Source: `lib/db/src/schema/index.ts`.

### Tables

- **users** — `id`, `email` (unique), `password_hash`, `display_name`, `role`
  (`user`/`admin`/`super_admin`), `selected_mode` (`beginner`/`pro`),
  `theme_preference`, `language`, `security_question`, `security_answer_hash`,
  `push_expiry` (bool, default true), `push_broadcast` (bool, default true),
  `created_at`, `updated_at`.
- **sessions** — `id`, `user_id`, `token` (unique), `expires_at`.
- **password_reset_tokens** — short-lived single-use tokens for the 3-step
  forgot-password flow.
- **analyses** — `id`, `user_id`, `instrument`, `timeframe`, `mode`,
  `image_url`, `ai_output` (JSON), `confidence`, `market_condition`,
  `valid_until`, `created_at`.
- **feedback** — `id`, `analysis_id`, `outcome` (`win`/`loss`/`break_even`),
  `notes`, `created_at`.
- **notifications** — `id`, `user_id`, `target_role` (nullable), `title`,
  `message`, `type` (`info`/`warning`/`error`), `read_at`, `created_at`.
- **push_subscriptions** — Web Push VAPID subscription per user/device.

### Enums

- `user_role`: `user`, `admin`, `super_admin`
- `user_mode`: `beginner`, `pro`
- `theme_preference`: `light`, `dark`, `system`
- `market_condition`: `bullish`, `bearish`, `sideways`
- `confidence_level`: `low`, `medium`, `high`, `very_high`

### Timeframe validity periods

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

Single source of truth: `lib/api-spec/openapi.yaml`. All client hooks and Zod
validators are auto-generated from it; never hand-edit the generated files.

### Auth

- `POST /api/auth/register` — body validated by zod (email, password ≥ 6,
  displayName, `selectedMode` ∈ {`beginner`,`pro`}, `securityQuestion` ∈
  allow-list, `securityAnswer`).
- `POST /api/auth/login` — sets `session_token` cookie (HttpOnly, SameSite=Lax).
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/forgot-password/question` — **rate-limited 10/15min per IP+email**.
- `POST /api/auth/forgot-password/verify` — **rate-limited 5/15min per IP+email**.
- `POST /api/auth/forgot-password/reset`
- `PATCH /api/auth/profile`
- `POST /api/auth/change-password`
- `POST /api/auth/change-security-question`

Both forgot-password limiters return HTTP 429 with `Retry-After` header.
The Express app sets `trust proxy: 1` so `req.ip` reflects the real client IP.

### Analyses

- `POST /api/analyses` — generate a new analysis (enforces hourly + daily quota).
- `GET /api/analyses` — paginated list.
- `GET /api/analyses/:id`
- `GET /api/analyses/summary`
- `GET /api/analyses/recent-instruments`
- `GET /api/analyses/personal-analytics`
- `GET /api/analyses/quota` — returns `{hourly:{remaining,limit}, daily:{remaining,limit}, unlimited}`.
  Admin/super_admin receive `unlimited:true`.
- `POST /api/analyses/:id/feedback`

### Notifications

- `GET /api/notifications` — query `?unreadOnly=true` for unread filter.
- `POST /api/notifications/:id/read`
- `POST /api/notifications/mark-all-read`
- `GET /api/notifications/stream` — **Server-Sent Events**. Emits
  `event: notification` with the inserted row whenever any background job,
  admin broadcast, analysis-completion, or AI-error alert inserts a
  notification row for the authenticated user. Heartbeat every 25s.

### Push

- `GET /api/push/public-key` — public.
- `POST /api/push/subscribe`
- `POST /api/push/unsubscribe`
- `GET /api/push/subscription-status`
- `GET /api/push/prefs` — returns `{pushExpiry, pushBroadcast}` booleans.
- `PATCH /api/push/prefs` — partial update.

### Admin (admin / super_admin only)

- `GET /api/admin/stats` — returns `totalUsersToday`, `totalAnalysesToday`,
  `totalAnalysesThisWeek`, `totalAnalysesThisMonth`, `totalUsers`,
  `instrumentBreakdown`, `modeBreakdown`.
- `GET /api/admin/analyses` — paginated, all users.
- `POST /api/admin/notifications` — broadcast (also dispatches Web Push to
  every target who hasn't disabled `pushBroadcast`).
- `GET /api/superadmin/users`, `POST /api/superadmin/users`,
  `DELETE /api/superadmin/users/:id`,
  `PATCH /api/superadmin/users/:id/password`,
  `PATCH /api/superadmin/users/:id/role`.

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
> deployments, swap to Redis pub/sub (see follow-up #15).

---

## 8. Rate Limiting

- Implementation: `artifacts/api-server/src/middleware/rate-limit.ts` —
  in-memory `Map<key, {count, resetAt}>`.
- Key: `${clientIp(req)}|${email.toLowerCase()}` (per-IP and per-account).
- Trust proxy: enabled at the Express level (`app.set("trust proxy", 1)`),
  so `req.ip` is the real client IP and not arbitrary `x-forwarded-for`.
- Eviction: stale buckets are pruned every 60s.

> Same caveat: in-memory store does not span multiple instances.

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

Every notification insert is mirrored via `notificationsEmitter.emitForUser`
so connected SSE clients receive realtime updates.

---

## 13. Internationalization

- Locale dictionaries: `artifacts/ai-trading/src/locales/{en,id}.ts`.
- Hook: `useTranslation()` returns `{t, lang, setLang}`.
- New keys for prefs (added in this milestone):
  `notifications.push_prefs_title`, `push_prefs_desc`,
  `push_pref_expiry_title`, `push_pref_expiry_desc`,
  `push_pref_broadcast_title`, `push_pref_broadcast_desc`,
  `push_prefs_error`.

---

## 14. Deployment Notes

- Replit Autoscale or Reserved-VM Deployments. Build runs
  `pnpm --filter @workspace/ai-trading run build` then serves
  `artifacts/ai-trading/dist/public` as static.
- API server is its own artifact (Node, port 8080).
- After merging, run the post-merge setup if the script is present
  (`.local/post_merge_setup.sh`).
- All secrets must be configured in the Replit environment-variables UI
  before the first deployment.
- Health endpoint: `GET /api/health`.

---

## 15. Open Follow-ups

1. **Multi-instance reliability** — Move SSE pub/sub and the rate-limit store
   to Redis so notifications and limits stay correct when scaled out
   (follow-up task #15).
2. **Automated regression tests** — Integration tests for sign-up validation,
   forgot-password 429 behavior, push-prefs persistence, and SSE delivery
   (follow-up task #16).

---

## 16. Troubleshooting

| Symptom                                  | Likely cause / fix                                                |
|------------------------------------------|-------------------------------------------------------------------|
| Workflow fails with `EADDRINUSE`         | Old process not yet released the port. Restart the workflow.      |
| Bell icon doesn't update without reload  | Confirm `/api/notifications/stream` returns 200 and the SSE       |
|                                          | reaches the browser (DevTools → Network → EventStream tab).       |
| "Pertanyaan keamanan tidak valid"        | `securityQuestion` must match an entry in `SECURITY_QUESTIONS`    |
|                                          | (`artifacts/api-server/src/routes/auth.ts`).                      |
| Push delivery fails silently             | Check VAPID env vars are set and that the user actually has an    |
|                                          | active subscription (`/api/push/subscription-status`).            |
| Stats card shows zeros                   | The `/api/admin/stats` payload was renamed to `totalUsersToday`,  |
|                                          | `totalAnalysesToday`, `totalAnalysesThisWeek`,                    |
|                                          | `totalAnalysesThisMonth`. Regenerate the API client if stale.     |
