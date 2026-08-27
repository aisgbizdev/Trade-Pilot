# Trade Pilot — Master Documentation

Single consolidated reference for what Trade Pilot **does** and how it's
**built**, merged from `TECHNICAL.md`, `USER_MANUAL.md`, `docs/user-guide/*`,
`PANDUAN_SDK_FLUTTER.md`, `STORE_RELEASE_WEB_BACKEND_CHECKLIST.md`, and
`replit.md`, cross-checked directly against the current codebase (schema,
routes, and frontend source) rather than trusted at face value — several of
those source docs had gone stale or contradicted each other and each other's
claims are reconciled below, with the disagreements called out explicitly
in §9 rather than silently picked.

This file is the **one place to start**. The older docs are left in place
(nothing was deleted) as deeper references:
- `docs/TECHNICAL.md` — engineering reference (some sections now superseded
  by this file where noted)
- `docs/USER_MANUAL.md` — an early/stale end-user draft (see §9 — supersede
  with `docs/user-guide/` for anything user-facing)
- `docs/user-guide/*.md` — 15 detailed, current, per-feature Indonesian
  user guides — this is the right place for step-by-step "how do I..."
  content; this master doc summarizes the same features but doesn't
  replace the walkthroughs
- `docs/PANDUAN_SDK_FLUTTER.md` — the Dart/Flutter SDK client (for the
  external **SOLID** partner app, not an in-house Flutter app)
- `docs/STORE_RELEASE_WEB_BACKEND_CHECKLIST.md` — app-store readiness work
  (account deletion, native push, actionable notifications) and its manual
  follow-up steps
- `replit.md` — Replit-agent-facing operational notes (production
  deployment/publish mechanics)

---

## 1. What Trade Pilot is

**Trade Pilot** is a mobile-first PWA that helps retail traders *understand*
market conditions — it explicitly is **decision support, not a signal
generator or broker**: no order execution, no guaranteed-profit claims. A
user picks an instrument + timeframe, the backend calls OpenAI (GPT-4o)
with live price data, technical indicators, and fundamental context (news +
economic calendar), and returns a structured analysis: directional bias,
confidence, key levels, a two-sided (buy/sell) trade plan with concrete
entry/SL/TP prices, and plain-language reasoning. Every analysis is saved,
can be marked with real-world outcomes, and feeds back into personal
analytics, a trader-behavior "Mirror," and a trade journal.

Supported instruments: **Futures/commodities & indices** (XAU/USD, XAG/USD,
BRENT, HSI, NIKKEI, DJIA, NASDAQ, DXY), **Forex** (AUD/USD, EUR/USD,
GBP/USD, USD/CHF, USD/JPY, USD/IDR), **Crypto** (BTC/USD, ETH/USD, SOL/USD,
BNB/USD, XRP/USD), plus a free-text custom-instrument field. Two experience
modes: **Beginner** (simpler language, visual confidence bar) and **Pro**
(denser technical detail, full driver breakdown) — chosen at signup (see
§9 for a real gap: there is currently no reachable in-app way to change it
afterward).

Data partners: **Newsmaker.id** (news + economic calendar), **Yahoo
Finance** (intraday OHLC for 1m-4h, and per-symbol news RSS as a secondary
source), **TradingView** (embedded chart/quote widgets), **OpenAI**
(GPT-4o analysis generation).

---

## 2. Feature reference (functional)

Organized by page/area. Route column is the actual `wouter` path in
`artifacts/ai-trading/src/App.tsx` — verified directly against the router,
not assumed from a doc.

| Area | Route | What it does |
|---|---|---|
| Landing | `/` | Public marketing page; redirects to `/analyze` or `/login` automatically in embed mode |
| Login / Register / Forgot Password | `/login`, `/register`, `/forgot-password` | Email+password auth; forgot-password is a 3-step security-question flow (email → question → new password), rate-limited |
| **Analyze** | `/analyze` | The core workspace: instrument picker (Futures/Forex/Crypto tabs + custom text), timeframe picker, live price + spread + market-session badge, mini TradingView chart (1D/1W/1M/3M/1Y range), filtered economic calendar, local community sentiment widget, optional notes, Mental Checklist (4-point pre-trade psychology check, non-blocking), Anti-Pattern Guardrails (revenge-trading/overtrading/high-risk-window/unusual-hour detection with a cooling-off breathing-exercise flow), Set Alert shortcut, quota chip, Submit → AI analysis |
| **Analysis Detail** | `/analyses/:id` | Signal speedometer (bearish-strong…bullish-strong gauge), market context summary, interactive TradingView chart, technical indicators panel (RSI/MACD/Bollinger/EMA/Stochastic, independently re-timeframeable), two-sided Trade Plan card (buy + sell scenarios: entry/SL/TP1/TP2/R:R/rationale, "wait" fallback when no reliable anchor), Fundamental Context (cited news + calendar items) with Fundamental Drift staleness detection + "Refresh Fundamentals," per-analysis price-alert arm/disarm toggle, private note field, thumbs-up/down feedback + Win/Loss/Breakeven/Skipped outcome tagging, quick timeframe re-analyze switcher, "Log this trade" shortcut into the Journal |
| **History** | `/history` | All past analyses, search, multi-field filter panel (instrument/timeframe/date/mode/outcome) with removable chips, **saved filter presets** (save/rename/delete a named filter combo), per-item refresh (re-pull indicator/fundamental data without a new analysis), delete |
| **Journal** | `/journal` | Manually logged **executed trades** (separate from AI analyses): instrument, direction, outcome (incl. an "Open"/still-running state), entry/exit price, qty, **mood** tag (Confident/Calm/Uncertain/FOMO/Revenge/Disciplined), notes, timestamp; can be pre-filled from an analysis via "Log this trade"; stats (total trades, win rate, avg PnL%) |
| **Analytics** | `/analytics` | Personal performance: time-range toggle (7d/30d/All), self-accuracy gauge (based only on analyses with an outcome set), top instruments, dominant mode, weekly bar chart |
| **Performance** | `/performance` (public) | The **AI system's own** track record (distinct from personal Analytics) — 30/90-day toggle, win/loss/expired hit-bar, per-instrument segments, a public AI-transparency dashboard anyone can view without logging in |
| **Mirror** | `/mirror` | Behavioral-insight engine over the user's own history: win rate per instrument/timeframe/day-of-week/session, mood-vs-outcome correlation, narrative AI insights; gated behind a minimum amount of logged data |
| **Mindset** | `/mindset` | Short trading-psychology education modules (FOMO, Revenge Trading, Risk Management, Discipline, Loss Acceptance, Consistency), read-time labeled, EN/ID |
| **Daily Summary** | `/daily-summary` | A scheduled per-user daily digest (bias per instrument, market condition, notable events); configurable delivery time + timezone from Notifications settings |
| **My Alerts** | `/my-alerts` | Standalone price-alert management (create via a dialog with target price/direction/note, or arm all of an analysis's levels at once from the detail page); delivered as push + in-app when triggered, not auto-removed |
| **Notifications** | `/notifications` | In-app feed across many categories (price alert, daily summary, market news, calendar event, price anomaly, weekly recap, signal flip, dormancy nudge, broadcast, **login alert**, **security alert** — the last two added in the store-readiness pass, see §7); push subscribe/unsubscribe + a "send test push" button; per-category push toggles; Anti-Pattern Guardrail toggles; Daily Digest settings; market-session-open reminder toggles; quiet-hours + notification-timezone settings (new, §7) |
| **Profile** | `/profile` | Avatar upload, display name, theme (light/dark only), change password, change security question, mental-checklist enable/disable, admin/user-management shortcuts (role-gated), **Delete Account** (new, §7), logout. **Does not** include a language or Beginner/Pro mode switch — see §9 |
| Admin dashboard | `/admin` | System stats, all-users' analyses, broadcast composer (audience: all/role/tag), broadcast history, feedback QA view |
| User management | `/admin/users` | Super-admin only: create/delete users, reset passwords, change roles, tag management |
| Legal/support (public) | `/privacy`, `/privacy-policy` (redirect), `/terms`, `/support`, `/delete-account` | Privacy Policy, Terms of Service, and (new, §7) a Support contact page and a public Delete-Account explainer, all cross-linked from every footer |

### Cross-cutting UX features
- **PWA**: installable (Add to Home Screen on Android/iOS/desktop), offline
  fallback page, Workbox-cached assets, works fullscreen without a browser
  chrome once installed.
- **Push notifications**: Web Push (VAPID) today; **native push (FCM) for
  a mobile app is now backed** as of the store-readiness pass — see §7.
- **Market Sessions badge**: Tokyo/London/New York open/closed indicator
  with WIB times, plus optional per-session "about to open" reminders.
- **Watchlist**: star an instrument from Analyze; jump straight into
  Analyze with it preselected from Dashboard's watchlist section (the
  Dashboard page itself is currently unrouted — see §9).
- **Quota**: default 5 analyses/hour, 20/day per user (admin/super_admin
  exempt), configurable via env vars, shown as a color-coded chip.

---

## 3. Architecture

Monorepo (pnpm workspaces). **Verified current package list** (this
differs from `TECHNICAL.md`'s table, which predates two of these):

| Path | Purpose |
|---|---|
| `artifacts/ai-trading` | React 19 + Vite 7 + Wouter PWA frontend |
| `artifacts/api-server` | Express 5 API server |
| `artifacts/mobile` | **Expo/React Native** mobile app (not Flutter — see §9) |
| `artifacts/mockup-sandbox` | Internal Vite UI-mockup preview, not shipped |
| `lib/db` | Drizzle ORM schema + `push`/`push-force` scripts (no separate migration files — schema is pushed directly) |
| `lib/api-spec` | `openapi.yaml` — single source of truth for every API client |
| `lib/api-client-react` | Orval-generated TanStack Query hooks (web frontend) |
| `lib/api-zod` | Orval-generated Zod schemas (shared) |
| `lib/api-client-dart` | `openapi-generator-cli`-generated Dart/Dio client — for the external **SOLID** Flutter app, see §8 |
| `scripts`, `tests/e2e` | Repo scripts; Playwright e2e smoke suite |

**Frontend stack**: React 19, Vite 7, `wouter` routing, Tailwind v4 +
shadcn/ui (Radix primitives), TanStack Query v5 (generated hooks),
`react-hook-form` + Zod v4 via `@hookform/resolvers` v5, `framer-motion`,
`lightweight-charts` (TradingView) + TradingView embed widgets,
`vite-plugin-pwa` (injectManifest) + Workbox, custom service worker
(`src/sw.ts`), `next-themes`-style theme provider, i18n via
`src/locales/{en,id}.ts` + `useTranslation()`.

**Backend stack**: Express 5, Drizzle ORM + Postgres (Neon), `bcryptjs`
(password/security-answer hashing, cost 12), raw random-token sessions in
a `sessions` table (cookie `session_token`, `httpOnly`+`sameSite=lax`+
`secure` in prod), `web-push` (VAPID), `google-auth-library` (FCM HTTP v1,
new), OpenAI SDK, in-process `EventEmitter` for SSE notifications, custom
in-memory rate limiter with per-account persistent lockout for
forgot-password.

**Auth model**: cookie (`session_token`) or `Authorization: Bearer`
header, checked manually in `requireAuth`/`requireAdmin`/`requireSuperAdmin`
middleware (`artifacts/api-server/src/middleware/auth.ts`) against the
`sessions` table — **not** a formal OpenAPI `securityScheme` (relevant for
SDK consumers, see §8).

---

## 4. Data model

**19 tables** in `lib/db/src/schema/index.ts` (verified directly against
the schema file — both `TECHNICAL.md` and `replit.md` list fewer and
disagree with each other on enum values; this list supersedes both):

| Table | Purpose |
|---|---|
| `users` | Account, role, mode, theme, language, **notification preferences (extensive — see §7)**, quota overrides, dormancy/disengage tracking |
| `sessions` | Auth session tokens |
| `password_reset_tokens` | Short-lived forgot-password reset tokens |
| `analyses` | Every AI analysis: inputs, full narrative fields, trade plan (JSONB), fundamental context snapshot + citations (JSONB), outcome resolution |
| `feedback` | Thumbs-up/down + outcome + note per analysis |
| `notifications` | In-app notification feed; `category`, `dedupe_key`, and (new) `action_type`/`action_id` for tap-to-navigate |
| `push_subscriptions` | Web Push (VAPID) browser subscriptions |
| `native_push_devices` | **New** — FCM device tokens for the mobile app, platform android/ios, globally-unique token with ownership transfer on re-register |
| `user_tags` | Free-form tags for broadcast-audience targeting |
| `outbound_clicks` | Sponsor/partner link click telemetry (anonymized on user delete, not cascaded) |
| `price_alerts` | Alerts armed from an analysis's own trade-plan levels |
| `daily_digests` | One row per user per local day for the Daily Summary feature (idempotency + landing-page replay) |
| `filter_presets` | Saved History-page filter combinations |
| `watchlist_items` | Starred instruments |
| `user_price_alerts` | Standalone alerts created via the "Set Alert" dialog (distinct from `price_alerts`, which are analysis-derived) |
| `trade_journal` | Manually logged executed trades (mood, PnL, links back to the source analysis) |
| `broadcasts` | Audit row per admin broadcast (audience type/value, recipient count) |
| `guardrail_events` | Anti-Pattern Guardrail trigger history (revenge/overtrading/high-risk/cooling-off) |
| `analytics_events` | Product analytics telemetry (anonymized on user delete, not cascaded) |
| `ai_token_usage` | OpenAI token/cost tracking, feeds the admin analytics dashboard |

**Deletion behavior**: every user-owned table above cascades on
`users.id` delete (`onDelete: "cascade"`) except `outbound_clicks` and
`analytics_events`, which use `onDelete: "set null"` (anonymized, not
removed) — this is what makes self-service account deletion (§7) a single
`DELETE FROM users WHERE id = ...` plus a couple of explicit pre-deletes
for tables that also need a storage-side cleanup.

---

## 5. API surface

`lib/api-spec/openapi.yaml` is the single source of truth; three clients
generate from it (`pnpm --filter @workspace/api-spec run codegen`):
React Query hooks, Zod schemas, and a Dart/Dio client. **Never hand-edit a
generated file** — change the spec and regenerate.

Route groups mounted in `artifacts/api-server/src/routes/index.ts`:
`health`, `auth` (incl. **account deletion**, new), `analyses`,
`filter-presets`, `notifications`, `admin`/`superadmin`, `quotes`,
`historical`, `news`, `calendar`, `push`, `native-push` (**new**),
`events`, `daily-summary`, `watchlist`, `user-price-alerts`,
`trade-journal`, `trader-mirror`, `performance`, `storage`.

**Known, deliberate spec/implementation caveats** (documented rather than
silently "fixed" where fixing would be a bigger, riskier change):
- `/quotes/live`, `/historical/indicators`, `/news`, `/calendar` are public
  market-data routes **not yet in the OpenAPI spec** — consumed via
  hand-written `fetch()` hooks on the frontend (`use-live-quotes.ts`,
  `use-technical-indicators.ts`, `use-news.ts`, `use-calendar.ts`).
- `POST /auth/forgot-password/reset` returns **401** for an invalid/expired
  token even though the spec says 400 (a reset token failure is an authn
  failure, not a field-validation error — tracked, not yet reconciled).
- `GET /notifications`'s `unreadCount` **used to** be spec'd but never
  implemented — this was fixed as part of the store-readiness pass (§7),
  no longer a caveat.

---

## 6. Notifications, push, and background jobs

- **Realtime**: `GET /api/notifications/stream` (SSE) backed by an
  in-process `EventEmitter` (`lib/notifications-emitter.ts`) — single-
  instance only; scaling to multiple server instances would need Redis
  pub/sub instead (tracked, not built).
- **Web Push**: VAPID (`lib/webpush.ts`), per-device subscriptions in
  `push_subscriptions`, dead subscriptions (410/404) auto-removed.
- **Native Push (new)**: FCM HTTP v1 (`lib/native-push.ts`), via
  `google-auth-library` + Application Default Credentials — **not** the
  Firebase Admin SDK. Devices in `native_push_devices`. Both push channels
  are dispatched independently from the single choke point
  `createNotification()`/`createNotificationsForUsers()`
  (`lib/create-notification.ts`) — one channel failing never blocks the
  other or the in-app notification row itself.
- **Background jobs** (`lib/jobs.ts`, started on boot): hourly feedback
  reminders, hourly analysis-expiry warnings, daily admin digest, daily
  retention purge (`ANALYSES_RETENTION_DAYS`, default 90, with a 7-day
  advance warning notice) — plus per-feature dispatchers living in their
  own files: `dormancy.ts`, `weekly-recap.ts`, `trader-mirror-weekly.ts`,
  `onboarding-nudge.ts`, `market-open.ts`, `price-anomaly.ts`,
  `watchlist-alerts.ts`, `signal-flip.ts`, `price-alerts.ts`,
  `user-price-alerts.ts`, `daily-summary.ts`.
- **Anti-spam guards** (`lib/notification-guards.ts`): quiet hours
  (22:00-07:00 default, now per-user configurable — see §7), per-category
  frequency caps, cross-run dedupe keys.
- **Notification preferences**: all on `users` (no separate preferences
  table) — see §7 for the full, current field list.

---

## 7. Store-readiness additions (this session)

Implemented so the mobile app can go through Play Store / App Store
review; full detail and manual follow-up steps in
`docs/STORE_RELEASE_WEB_BACKEND_CHECKLIST.md`. Summary:

- **Public pages**: `/support`, `/delete-account` (new), `/privacy-policy`
  (redirect alias) — all cross-linked from every footer.
- **Self-service account deletion**: `DELETE /api/auth/account`
  (password re-auth, rate-limited 5/24h, cascades everywhere per §4) + a
  Profile UI (explicit password + checkbox confirmation, no dark
  patterns).
- **Actionable notifications**: `notifications.actionType` (closed
  allowlist: `open_notification`, `open_analysis`) + `actionId`; `GET
  /notifications` now genuinely computes `unreadCount` server-side.
- **Native push backend**: see §6.
- **Notification preferences — 9 new `users` columns**:
  `pushAnalysisCompleted`, `pushTpSlHit`, `pushLoginAlert`,
  `nativePushEnabled`, `webPushEnabled`, `quietHoursEnabled`,
  `quietHoursStart`/`quietHoursEnd` ("HH:MM"), `notificationTimezone`
  (IANA) — surfaced through the existing `GET`/`PATCH /push/prefs`.
- **New always-on security notifications**: password changed, security
  question changed (bypass preferences + quiet hours), and a login alert
  (respects `pushLoginAlert`).
- **Security hardening**: CORS allowlist (was reflecting any origin),
  new rate limiters (account deletion, native-push register), strict Zod
  on every new endpoint.

**As of this writing, the schema changes above have not been pushed to
the database and native push has no Firebase project configured yet** —
see the checklist doc's manual-steps section before relying on either in
production.

---

## 8. Mobile / Flutter situation (important — resolves a real ambiguity)

Two unrelated things both touch "mobile" in this repo:

1. **`artifacts/mobile`** — an in-house **Expo/React Native** app
   (TypeScript, `expo-router`), consuming `@workspace/api-client-react`
   directly. This is the actual buildable native-feeling app in this
   monorepo. It has no Firebase/push/store-metadata configuration yet.
2. **`lib/api-client-dart`** — a generated **Dart/Dio API client
   library** (not an app), built for a separate, external partner team
   ("**SOLID**") building their own Flutter app that wants to embed Trade
   Pilot as a feature. Documented fully in `docs/PANDUAN_SDK_FLUTTER.md`.
   Regenerate via `pnpm --filter @workspace/api-spec run codegen:dart`.
   A hand-written wrapper (`lib/api-client-dart/lib/trade_pilot_client.dart`,
   the one file in that package safe from being overwritten by codegen)
   adds a bearer-token interceptor, since the OpenAPI spec has no formal
   `securityScheme` for the generator to wire up automatically.
   **Explicitly not yet built**: account merging/SSO between Trade Pilot
   and SOLID accounts, and publishing the package to a pub server (it's
   consumed via a local path or git dependency today).

If a task says "the Flutter app," clarify which of these it means — they
are not the same thing, and this monorepo does not contain a real,
shippable Flutter application of its own.

---

## 9. Known gaps, discrepancies, and open follow-ups

Found while reconciling the older docs against the actual codebase:

- **Beginner/Pro mode has no reachable way to change it after signup.**
  The mode-toggle UI (with its `updateProfile` mutation) exists only in
  `src/pages/dashboard.tsx` — a page with **no live route** (`/dashboard`
  just `<Redirect to="/analyze">`). `profile.tsx` shows the mode only as
  a read-only label. Both `USER_MANUAL.md` and `docs/user-guide/01-...md`
  claim it's changeable "from the Dashboard"; that claim is stale/wrong
  today. An admin can still change any user's mode via User Management.
  **This is worth a product decision**: either re-route `/dashboard` to
  something live, move the toggle into Profile, or explicitly accept
  mode as signup-only.
- **Language switching**: only the persistent header `LanguageToggle`
  (visible on every page, including while on Profile) actually changes
  it — there's no dedicated language control inside Profile's own
  settings list. `docs/user-guide/01-...md` and `14-profile.md` describe
  it as "Profile → Bahasa," which overstates it as a Profile-page
  feature; `USER_MANUAL.md`'s "header only" claim is the accurate one.
- **`USER_MANUAL.md` is a stale early draft**, not a description of the
  current app: it uses a different product name/persona framing ("AI
  Trading Assistant" / AI persona "Rere" / named user "DR") that doesn't
  match the shipped "Trade Pilot" branding anywhere else in the repo, and
  it's missing well over a dozen shipped features entirely (Journal,
  Mirror, Mindset, Daily Summary, Performance, My Alerts as a dedicated
  page, Filter Presets, Watchlist, Market Sessions, Mental Checklist,
  Anti-Pattern Guardrails, avatar upload, the Crypto instrument tab, and
  several notification categories). `docs/user-guide/*.md` is the
  current, accurate functional reference — this master doc's §2 follows
  the user-guide version wherever the two disagreed.
- **`TECHNICAL.md` and `replit.md` schema/enum sections are stale**
  relative to the actual schema (both list far fewer tables than the 19
  now in `lib/db/src/schema/index.ts`, and disagree with each other on
  `market_condition` enum values). §4 above reflects the real schema;
  those two docs' DB sections should be treated as historical snapshots,
  not current truth, until someone updates them.
- **Multi-instance scaling**: SSE fan-out and the in-memory rate limiter
  are both single-process; a Redis-backed version would be needed before
  running more than one API server instance.
- **Regression test coverage gap** (per `TECHNICAL.md`, not re-verified
  this pass): forgot-password/reset flow, onboarding, and personal
  analytics have thinner automated coverage than the rest of the app.
- **No CSRF token middleware** exists (relies on `sameSite=lax` cookies
  only) — flagged as a real gap in the store-readiness checklist, not
  fixed in that pass.
- Everything under §7 that's still pending a manual step (DB migration,
  Firebase project setup, legal-content review) — see that section's own
  checklist doc for the actionable list.
