# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Projects

### AI Trading Assistant MVP (`artifacts/ai-trading`)
Mobile-first PWA (React+Vite) for trading decision-support (NOT a signal generator).

**Features:**
- Custom auth: register/login with httpOnly cookies, security questions, remember me (30d/24h), show/hide password
- Two user modes: Pemula (Beginner) and Pro
- Dark/light mode toggle in header (deep navy #0f172a / white dominant)
- Dashboard with statistics cards
- AI Analysis page: GPT-4o analysis, timeframe validity badges, animated loading messages
  - Per-user quota: max 5 analyses/hour and 20/day (configurable via `ANALYSIS_QUOTA_PER_HOUR` / `ANALYSIS_QUOTA_PER_DAY` env vars). Returns 429 with Indonesian message on overrun. Admins/super_admins bypass.
- Analysis detail with confidence bar, validity countdown, feedback system
- History with filtering
- Personal Analytics with recharts charts
- Notification system (user/admin/super_admin roles)
- Onboarding modal for new users (non-dismissable until completed)
- Admin panel: stats, all analyses, broadcast, user CRUD
- PWA: vite-plugin-pwa with injectManifest strategy, custom service worker (`src/sw.ts`), Workbox caching + push event handler
- Web Push Notifications: VAPID keys (env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL), push subscription management, opt-in toggle on notifications page
- Push sent on admin broadcast + analysis expiry alerts (background jobs, hourly)

**Colors:** Primary light `#1e3a5f`, Primary dark `#3b82f6`, Dark bg `#0f172a`
**Language:** All UI text in Indonesian
**Users:** DR (main user), Rere (AI agent name)

**Brand sponsor (SOLID PRIME).** Trade Pilot is co-branded with **SOLID PRIME**, the mini-account product of PT Solid Gold Berjangka (BAPPEBTI-regulated futures broker, Member JFX & ICH) — the actual revenue source. SP appears as the sponsor in the chrome (splash footer, layout footer, landing header badge & footer) with the link `https://www.sg-berjangka.com`, plus dedicated CTA cards on `landing.tsx` (`section-solid-prime-cta`) and `profile.tsx` (`card-solid-prime-cta`), and a "Live Analisa" banner on the dashboard linking to `https://www.tiktok.com/@solid.prime`. New locale keys live under `t.brand.*` (sponsored_by, news_data_via, solid_prime_subline, solid_prime_regulated, open_account_cta, open_account_subtitle, live_analisa_*). **Newsmaker.id is now content-source attribution only** (news widget, calendar widget, technical-indicators panel, dashboard live-prices fallback) and is referenced in chrome via the secondary "News data via newsmaker.id" line; the operator-of-record reference in legal intros and `CONTACT_EMAIL=support@newsmaker.id` are unchanged. A "Sponsorship Disclosure" paragraph is appended to **section 6 of the Terms** (EN + ID) describing the SP relationship and editorial independence. The `.btn-premium` button class already bakes a dark text color (`#1a1208`) — never combine it with `text-white`. SP CTAs use `btn-premium` with an `ArrowUpRight` icon.

### API Server (`artifacts/api-server`)
Express backend serving all APIs.

**Routes:**
- `/api/auth/*` — register, login, logout, me, forgot-password (3-step via security question), profile, change-password, change-security-question
- `/api/analyses/*` — CRUD + summary + recent-instruments + personal-analytics + feedback
- `/api/notifications/*` — list, mark-read, mark-all-read, count, **stream (SSE realtime push)**
- `/api/push/*` — public-key (public), subscribe/unsubscribe/subscription-status (authenticated), **prefs (GET/PATCH per-channel toggles: pushExpiry, pushBroadcast)**
- `/api/admin/*` — stats, all-analyses, broadcast (now also sends Web Push), user CRUD (admin/super_admin only)

**Key libs:** bcryptjs, openai (gpt-4o), cookie-parser, drizzle-orm, pg, web-push (VAPID Web Push notifications)

### Database (`lib/db`)
PostgreSQL with Drizzle ORM. Tables: users, sessions, passwordResetTokens, analyses, feedback, notifications, push_subscriptions.

**Enums:** user_role (user/admin/super_admin), user_mode (beginner/pro), theme_preference (light/dark/system), market_condition (bullish/bearish/sideways), confidence_level (low/medium/high/very_high).

### API Spec + Codegen (`lib/api-spec`, `lib/api-client-react`, `lib/api-zod`)
OpenAPI spec → Orval codegen → React Query hooks + Zod schemas.
After codegen: fix `lib/api-zod/src/index.ts` to only export from `"./generated/api"` (avoids duplicate export error).

## Timeframe Validity Periods
- 1m: 15 min | 5m: 1h | 15m: 2.5h | 1h: 5h | 4h: 18h | 1D: 36h | 1W: 96h

## Historical Data Retention
- **Analyses**: 90-day retention (env-overridable via `ANALYSES_RETENTION_DAYS`, clamped 30–365). A daily background job deletes analyses older than the window; `feedback` rows cascade automatically. A second daily job sends an in-app notification 7 days before deletion.
- **Sessions / password reset tokens**: pruned by their own `expiresAt` columns (no TTL job needed).
- **Notifications**: kept indefinitely (user-driven cleanup via mark-read / delete UI).

## Production Database Resilience
- Single shared `pg.Pool` lives in `lib/db/src/index.ts` (api-server re-exports it). No duplicate pools.
- `pool.on('error')` handler swallows idle-client TCP drops from managed Postgres providers (Neon etc.) so Node never crashes from an unhandled error event.
- TLS: strict cert verification by default whenever `sslmode=require/verify-*` is in `DATABASE_URL` or in production. Set `PGSSL_INSECURE=true` ONLY for self-signed dev DBs (logs a loud warning if used in production).
- Graceful shutdown: SIGTERM/SIGINT stops background jobs first, then closes the HTTP server, then drains the pool (10s force-exit fallback). Prevents lingering connections after deploy restarts.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Before You Publish

Production gets its own Postgres database (separate `DATABASE_URL` from dev). Two things must be in place before clicking Publish:

**1. Schema push runs automatically.**
`artifacts/api-server/.replit-artifact/artifact.toml` is wired so the production build first runs `pnpm --filter @workspace/db run push-force` against the production DB, then bundles the api-server. No manual migration step needed.

**2. Add these secrets yourself in the Publishing → Secrets pane:**
- `OPENAI_API_KEY` — **required**. Without it, every `/api/analyses` request fails (no AI analysis).
- `VAPID_PRIVATE_KEY` — **required for push notifications**. Without it the server logs a warning and silently skips Web Push (but the app still runs).

Auto-provided by the platform — do not set manually:
- `DATABASE_URL` — injected automatically when the deployment's database is attached.

Already covered by `[userenv.shared]` in `.replit` and carried into production automatically: `OPENAI_MODEL`, `VAPID_PUBLIC_KEY`, `VAPID_EMAIL`. No action needed for these.

Optional tuning vars (defaults are fine for most cases): `ANALYSIS_QUOTA_PER_HOUR` (default 5), `ANALYSIS_QUOTA_PER_DAY` (default 20), `LOG_LEVEL` (default `info`).
