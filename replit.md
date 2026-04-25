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

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
