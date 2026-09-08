# TradePilot API — Mobile Integration Guide

How to connect a mobile app (Expo/React Native, native Android/iOS, or the
generated Flutter SDK) to the TradePilot backend.

**Source of truth for every endpoint & schema:** `lib/api-spec/openapi.yaml`
(OpenAPI 3.1). This document is the integration-oriented companion — auth
mechanics, conventions, gotchas, and a curated endpoint catalog. When they
disagree, the spec wins.

Last updated: 2026-09-08 (includes Google Sign-In, credit top-ups, unified
admin dashboard).

---

## 1. Base URL & environments

| Env | Base URL | Notes |
|---|---|---|
| Production | `https://tradepilot.id/api` | Cloud Run / Replit deploy; API + SPA on one origin |
| Dev (Replit) | `https://<REPLIT_DEV_DOMAIN>/api` | mobile sets `EXPO_PUBLIC_DOMAIN` |
| Local | `http://localhost:5000/api` (direct) or `http://localhost:5173/api` (via Vite proxy) | |

- All routes are under the `/api` prefix.
- HTTPS only in prod. CORS allows **no-Origin requests** (native HTTP clients,
  which don't send an `Origin` header) — so native apps are not blocked by CORS.
- `trust proxy` is on; the server sees the real client IP for rate limiting.

The Expo app configures this once at startup:

```ts
// artifacts/mobile/app/_layout.tsx
import { setBaseUrl } from "@workspace/api-client-react";
setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);
```

---

## 2. Authentication — mobile uses **Bearer tokens**, not cookies

The web app rides on an httpOnly `session_token` cookie. **Mobile must not rely
on cookies.** Instead:

1. `POST /api/auth/login` or `POST /api/auth/register` returns:
   ```json
   { "user": { ...User }, "token": "64-hex-char session token" }
   ```
   The `token` field is **only** present on login/register (when a new session
   row is created).
2. Store `token` in secure storage (`expo-secure-store` / Keychain / Keystore —
   the current Expo app uses `AsyncStorage` under `@trade_pilot_token`, which is
   acceptable but SecureStore is better).
3. Attach it to every authenticated request:
   ```
   Authorization: Bearer <token>
   ```
   The middleware accepts `Authorization: Bearer <token>` **or** the
   `session_token` cookie (`artifacts/api-server/src/middleware/auth.ts`).
4. On `401` (`{"error":"Session expired or invalid"}` or `"Unauthorized"`),
   drop the stored token and send the user back to the login screen.
5. `POST /api/auth/logout` (auth required) deletes the session row server-side.
   Also clear local storage.

### Session lifetime

- `rememberMe: true` → 30-day session. `false` (default) → 24h.
- Google sign-in sessions are always 30-day.
- Tokens are opaque, single-purpose, revoked on logout / password reset /
  account deletion. There is **no refresh token** — when it expires the user
  logs in again.

### The generated clients already handle this

`@workspace/api-client-react` (used by both web and the Expo app) exposes:

```ts
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

setBaseUrl("https://tradepilot.id");
setAuthTokenGetter(() => tokenFromSecureStorage);   // called before every request
```

When the getter returns a non-null string it becomes `Authorization: Bearer …`.
See `artifacts/mobile/context/AuthContext.tsx` for the working pattern.

### Google Sign-In on mobile — not supported yet

`GET /api/auth/google` is a **server-side browser-redirect** flow built for the
web (it 302s to Google and sets a cookie on the callback). It is **not usable
from a native app as-is**. To add native Google sign-in you would need:

- Native Google Identity Services / AppAuth to obtain a Google **ID token** on
  the device, and
- a new backend endpoint (e.g. `POST /api/auth/google/native`) that verifies
  the ID token and returns `{ user, token }` — same upsert logic as the web
  callback (`match google_id → link by verified email → create`).

This endpoint is **not built**. Until then, mobile users register/login with
email + password.

---

## 3. Request / response conventions

- **Content type:** `application/json` for request bodies and responses.
- **Auth errors:** `401` `{ "error": "..." }`.
- **Validation errors:** `400` `{ "error": "<first human-readable message>" }`
  (Indonesian copy). Strict schemas — unknown fields are rejected on the
  profile/journal/etc. PATCH endpoints.
- **Not found:** `404` `{ "error": "..." }`.
- **Rate limited:** `429` `{ "error": "..." }` + `Retry-After` header (seconds).
- **AI failure:** `POST /api/analyses` can return `502`
  `{ "error": "Layanan AI sedang tidak tersedia..." }` — retry later; the
  attempt does **not** count against quota or consume a credit.
- **Quota exceeded:** `POST /api/analyses` → `429` with a `quota` object:
  ```json
  { "error": "Batas analisis per jam tercapai (5 analisis/jam)...",
    "quota": { "scope": "hour", "limit": 5, "used": 5 } }
  ```
  `scope` is `"hour"`, `"day"`, or `"concurrent"` (a previous analysis is still
  running — `Retry-After: 5`).
- **Dates:** ISO 8601 UTC (`2026-09-08T02:13:30Z`). Query date filters take
  `YYYY-MM-DD`.
- **Pagination:** list endpoints take `page` (1-based) + `limit`, return
  `{ items…, total, page, limit }`.
- **Repeatable array params:** `?instruments=XAU/USD&instruments=BRENT`
  (form / explode).

---

## 4. Rate limits (per IP unless noted)

| Scope | Window | Max |
|---|---|---|
| `POST /auth/login` | 15 min | 10 (per ip+email) |
| `POST /auth/register` | 60 min | 10 |
| `GET /auth/google*` | 15 min | 20 |
| `POST /auth/forgot-password/question` | 15 min | 10 |
| `POST /auth/forgot-password/verify` | 15 min | 5 (+ per-account lockout) |
| `POST /auth/forgot-password/reset` | 15 min | 5 |
| `DELETE /auth/account` | 24 h | 5 |
| `POST /native-push/register` | 60 min | 30 |
| `POST /push/test` | 60 min | 10 (per user) |
| journal writes | 60 s | 30 (per user) |
| journal reads | 60 s | 120 (per user) |
| `GET /performance/summary` | 60 s | 60 |
| `POST /events/*` (telemetry) | 60 s | 60 |
| **Analyses** | — | not IP-limited; gated by the per-user **quota** (default 5/hour, 20/day; admins unlimited; purchased credits bypass caps) |

Limiters are disabled when `NODE_ENV=development`.

---

## 5. Endpoint catalog (mobile-relevant)

> Every route below is under `/api`. ✅ = needs `Authorization: Bearer`.
> Full request/response schemas: `lib/api-spec/openapi.yaml`.

### Auth & account

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | — | Create account → `{ user, token }` (201). Body: `email, password (≥6), displayName, securityQuestion, securityAnswer, selectedMode?, rememberMe?` |
| POST | `/auth/login` | — | `{ email, password, rememberMe? }` → `{ user, token }` |
| POST | `/auth/logout` | ✅ | Revoke the current session |
| GET | `/auth/me` | ✅ | Current `User` (use to validate a stored token on app launch) |
| PATCH | `/auth/profile` | ✅ | `displayName?, selectedMode?, themePreference?, onboardingCompleted?, lang?, avatarUrl?` |
| PATCH | `/auth/password` | ✅ | `{ currentPassword, newPassword }` — `400` for Google-only accounts |
| PATCH | `/auth/security-question` | ✅ | `{ currentPassword, securityQuestion, securityAnswer }` — `400` for Google-only accounts |
| DELETE | `/auth/account` | ✅ | `{ currentPassword }` (omittable for Google-only accounts). Cascades all user data |
| POST | `/auth/forgot-password/question` | — | `{ email }` → `{ securityQuestion, email }` |
| POST | `/auth/forgot-password/verify` | — | `{ email, securityAnswer }` → `{ resetToken }` |
| POST | `/auth/forgot-password/reset` | — | `{ resetToken, newPassword }` |
| GET | `/auth/google` | — | **Web only** — 302 to Google consent (see §2) |

`User`: `{ id, email, displayName, avatarUrl|null, role, selectedMode,
themePreference, onboardingCompleted, createdAt }`.

### Analyses (the core feature)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/analyses` | ✅ | **Create analysis — triggers the AI (~10–30 s response time).** Body: `{ instrument, timeframe (1m/5m/15m/30m/1h/4h/1D/1W), mode (beginner/pro), userInputContext? }`. Returns `Analysis` + `creditConsumed` (+ `creditBalance`). `429` on quota, `502` on AI outage |
| GET | `/analyses` | ✅ | List with filters: `mode, instrument, instruments[], timeframes[], outcomes[], q, from, to, page, limit`. → `{ analyses[], total, page, limit }` |
| GET | `/analyses/{id}` | ✅ | Full `Analysis` (narrative blocks, trade plan, confidence, validity, fundamental context) |
| GET | `/analyses/quota` | ✅ | `{ unlimited, hourly:{limit,used,remaining}, daily:{…}, credits:{balance} }` — call before enabling the "Analyze" button |
| GET | `/analyses/summary` | ✅ | Dashboard roll-up (counts, avg confidence, recent) |
| GET | `/analyses/outcomes-summary` | ✅ | AI accuracy card (tp1/tp2/sl/expired counts, hit-rate) |
| GET | `/analyses/history-summary` | ✅ | History-page header stats |
| GET | `/analyses/personal-analytics` | ✅ | Per-user analytics (charts) |
| GET | `/analyses/recent-instruments` | ✅ | Recently analysed instruments (quick-pick) |
| PUT | `/analyses/{id}/note` | ✅ | `{ note: string|null }` — private per-analysis journal note |
| POST | `/analyses/{id}/feedback` | ✅ | Thumbs up/down on an analysis |
| GET/POST | `/analyses/{id}/alerts` | ✅ | Read / arm price alerts for the analysis's AI levels |
| POST | `/analyses/{id}/refresh-fundamentals` | ✅ | Re-pull news/calendar context for an existing analysis |
| GET | `/risk-map/timeframes` | ✅ | Deterministic technical risk across timeframes (XAU/USD, BRENT, HSI, NIKKEI). No AI, no quota |

### Journal (manual post-trade log)

`GET/POST /journal`, `GET /journal/{id}`, `PATCH /journal/{id}`,
`DELETE /journal/{id}`, `GET /journal/stats`, `GET /journal/sentiment`,
`GET /journal/for-analysis/{analysisId}`. All ✅.

### Watchlist & price alerts

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/watchlist` | ✅ | Pinned instruments |
| POST | `/watchlist` | ✅ | `{ instrument }` |
| DELETE | `/watchlist/{instrument}` | ✅ | Unpin |
| GET/POST | `/user-price-alerts` | ✅ | List / create standalone price alerts |
| PATCH/DELETE | `/user-price-alerts/{id}` | ✅ | Update / delete |

### Notifications

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/notifications` | ✅ | List (unread count etc.) |
| PATCH | `/notifications/{id}/read` | ✅ | Mark one read |
| PATCH | `/notifications/read-all` | ✅ | Mark all read |

> The web app also opens an SSE stream at `/api/notifications/stream`. Native
> apps should use **FCM push** (below) + polling `/notifications` instead.

### Push (native / FCM)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/native-push/register` | ✅ | `{ token: <FCM device token>, platform: "android"\|"ios" }` |
| POST | `/native-push/unregister` | ✅ | `{ token }` — on logout / token rotation |
| GET/PATCH | `/push/prefs` | ✅ | Per-category push toggles (`pushExpiry`, `pushBroadcast`, `pushDailySummary`, `pushMarketNews`, …) |
| GET/PATCH | `/me/daily-summary` | ✅ | Daily-summary digest settings (time, timezone, enabled) |

Server-side FCM needs `FIREBASE_PROJECT_ID` + Application Default Credentials
configured on the deployment; if unset, native push is silently disabled
(in-app notification rows still land). See `artifacts/api-server/src/lib/native-push.ts`.

### Progression (gamification)

`GET /progression/summary`, `/progression/catalog`, `/progression/history`,
`POST /progression/activity`, `POST /progression/evidence`. All ✅.

### Credit top-ups

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/topups/config` | ✅ | `{ rupiahPerCredit, qrisImageUrl }` |
| GET | `/topups/balance` | ✅ | `{ balance }` |
| POST | `/topups` | ✅ | Submit a manual top-up request (QRIS payment proof) |
| GET | `/topups/mine` | ✅ | The user's top-up request history + statuses |

### Public (no auth)

| Method | Path | Purpose |
|---|---|---|
| GET | `/healthz` | Liveness probe |
| GET | `/trading-rules/standard` | TP Standard Trading Rules disclosure (lot/margin/contract-size, localized `id`/`en`) |
| GET | `/performance/summary` | Public AI transparency dashboard (aggregated outcome ledger) |
| GET | `/push/public-key` | VAPID key (web push only) |

### Storage / avatar upload

3-step signed-URL flow:

1. `POST /api/storage/uploads/request-url` (✅) → `{ url, objectPath }`
2. `PUT` the image bytes to `url` (Google Cloud Storage signed URL, no auth
   header — the signature is in the query string)
3. `PATCH /api/auth/profile` (✅) with `{ "avatarUrl": "/objects/uploads/<uuid>" }`
   (must match `^/objects/uploads/[A-Za-z0-9_-]{8,64}$`)

Render an avatar by `GET /api/storage/objects/<objectPath>` (or the
`/objects/...` path directly).

### Admin / super-admin

`/admin/*` and `/superadmin/*` require `role` `admin` / `super_admin`. Not
relevant for a consumer mobile app — see the spec if you're building an
admin console.

---

## 6. Recommended app flow

```
App launch
  ├─ read token from secure storage
  ├─ setAuthTokenGetter(() => token)
  └─ GET /auth/me
       ├─ 200 → logged in; route to dashboard
       │        └─ if !user.onboardingCompleted → onboarding
       └─ 401 → clear token, route to login

Login / Register
  └─ POST /auth/login|register → store { token, user }

Dashboard
  ├─ GET /analyses/summary
  ├─ GET /analyses/quota          (gate the "Analyze" CTA)
  ├─ GET /notifications           (badge)
  └─ GET /watchlist

Analyze
  ├─ GET /analyses/quota          (re-check)
  ├─ POST /analyses               (show a 10–30 s loading state; handle 429 / 502)
  └─ on success → GET /analyses/{id} for the full detail view

Background
  └─ POST /native-push/register on token grant / rotation
```

---

## 7. Using the generated Flutter/Dart SDK

A typed Dio-based Dart client is generated from the same spec into
`lib/api-client-dart`. Full setup, regeneration, and Flutter wiring:
**`docs/PANDUAN_SDK_FLUTTER.md`**.

For a JS/TS mobile app (Expo), just depend on `@workspace/api-client-react`
(React Query hooks + `setBaseUrl` / `setAuthTokenGetter`) — the same package
the web app uses.

Regenerate all clients after any backend endpoint change:

```bash
pnpm --filter @workspace/api-spec run codegen      # react-query + zod
# Dart client: see docs/PANDUAN_SDK_FLUTTER.md §"Regenerate"
```

---

## 8. Recent API additions (for a client that was built earlier)

| Added | What |
|---|---|
| Google Sign-In | `GET /api/auth/google`, `/auth/google/callback` (web redirect flow). `User.password_hash` etc. now nullable server-side; `/auth/me` shape unchanged |
| Credit top-ups | `/topups/*` — manual QRIS top-up; `/analyses/quota` now includes `credits.balance`; `POST /analyses` returns `creditConsumed` |
| Guardrails | `/analyses/guardrails*` — pre-trade behavioural warnings |
| Trader mirror | `/mirror/insights` |
| Performance dashboard | `/performance/summary` (public) |
| Progression | `/progression/*` — XP / levels / achievements |
| Daily summary | `/me/daily-summary`, `pushDailySummary` pref |
| Multi-select history filters | `/analyses?instruments[]=&timeframes[]=&outcomes[]=` |

---

## 9. Checklist for a new mobile client

- [ ] Point `setBaseUrl` at the right environment
- [ ] Store the session token in **secure storage**, wire `setAuthTokenGetter`
- [ ] Validate the token on launch with `GET /auth/me`; clear on `401`
- [ ] Handle `POST /auth/logout` (server + local)
- [ ] Show a 10–30 s loading state for `POST /analyses`; handle `429` (quota,
      read the `quota` object) and `502` (AI outage, retry)
- [ ] Gate the Analyze CTA on `GET /analyses/quota`
- [ ] Respect `Retry-After` on `429`s
- [ ] Register the FCM device token via `/native-push/register` and unregister
      on logout
- [ ] Handle `!user.onboardingCompleted` → onboarding screen
- [ ] Email + password only for now (no native Google sign-in endpoint yet)
