# Store Release — Web/Backend Checklist

Scope: everything the `Trade-Pilot` web+backend repo needed so the separate
mobile app can go through Google Play / Apple App Store review. This repo
was **not** deployed, migrated, or pushed to git as part of this work — see
"Manual steps" below for what an operator still has to run.

## 1. Public routes (unauthenticated, `artifacts/ai-trading`)

| Route | Notes |
|---|---|
| `/privacy` | Canonical Privacy Policy |
| `/privacy-policy` | Redirects to `/privacy` |
| `/terms` | Terms of Service |
| `/support` | New — contact + how to report issues / request data changes |
| `/delete-account` | New — explains self-service deletion + what's removed/retained |

All five render through the existing generic `LegalPage` component
(`src/pages/legal.tsx`), so they inherit its header/footer/back-link/i18n
chrome. Content lives in `src/lib/legal-content.ts`. Cross-links to all
four (+Support) were added to the footer of `layout.tsx` (in-app shell)
and `landing.tsx` (marketing page).

**Known limitation**: this is a client-side-rendered SPA (Vite, no
SSR/prerendering). Pages are not readable without JavaScript, and
per-page `<meta>` tags beyond `document.title` aren't set. `document.title`
is now set per legal page; adding real SSR/prerendering is out of scope
for this pass.

**Content facts used** — pulled only from what already existed in the
repo (no invented company/legal info):
- Support/contact email: `support@newsmaker.id` (already used unconditionally
  in Privacy/Terms, per `replit.md`'s note that it's "unchanged" regardless
  of the `SHOW_NEWSMAKER` flag)
- Operator-of-record name in copy: `Newsmaker.id`
- Governing law / jurisdiction (already in Terms): Republic of Indonesia /
  Jakarta courts
- **No street address, phone number, or formal legal entity name** (e.g.
  "PT ...") exists anywhere in the repo — see "Manual blockers" below.

## 2. Account deletion

- **Endpoint**: `DELETE /api/auth/account` (placed alongside every other
  account-lifecycle route in `routes/auth.ts`, rather than a new
  single-route router — see rationale in that file's comment). Body:
  `{ currentPassword: string }`.
- **Auth/security**: `requireAuth` + `accountDeletionLimiter` (5/24h per
  user). Re-verifies `currentPassword` via the existing bcrypt helper
  (same pattern as `PATCH /auth/password`). Never accepts a target user id
  — always operates on `req.userId`.
- **What happens**: best-effort GCS avatar delete (new
  `ObjectStorageService.deleteObjectEntity`, never blocks deletion on
  failure) → transaction deletes `push_subscriptions`, `native_push_devices`,
  `sessions` rows explicitly, then the `users` row itself. Every other
  user-owned table (analyses, notifications, journal, watchlist, alerts,
  filter presets, daily digests, user tags, etc.) already has
  `onDelete: "cascade"` on its `userId` FK, so it's removed automatically.
  `outbound_clicks`/`analytics_events` use `onDelete: "set null"` — those
  rows are anonymized, not deleted (unchanged, existing behavior).
  Session cookie is cleared; a super-admin notification fires via the
  existing `notifySuperAdminsUserDeleted` helper.
- **Web UI**: `Profile > Delete Account` (new card in `pages/profile.tsx`,
  right above Logout) — `AlertDialog` requiring current password + an
  explicit checkbox ("I understand this will permanently delete my account
  and all my data"), no pre-checked boxes, no dark patterns. Errors surface
  inline in the dialog; success does a full `window.location.assign("/")`
  teardown identical to logout.
- **Tests**: `routes/__tests__/account-deletion.test.ts` — wrong password
  rejected, missing password → 400, correct password deletes + invalidates
  the caller's own token, **deleting user A never touches user B's account
  or session**, and the rate limiter kicks in after 5 attempts.

## 3. Actionable notifications (P2-B2)

- `notifications` table gained `action_type` (enum `open_notification` |
  `open_analysis` — a closed allowlist, not a free-form URL) and
  `action_id` (text). `category` already existed and is now exposed in the
  OpenAPI `Notification` schema too.
- `GET /notifications` now actually computes `unreadCount` server-side
  (`count(*) where userId = caller AND readAt IS NULL`) instead of the spec
  requiring a field the route never returned — this was a real drift
  between the existing spec and implementation, now fixed both ways.
- `createNotification()` / `createNotificationsForUsers()`
  (`lib/create-notification.ts`) accept `actionType`/`actionId`, persist
  them, return/thread the new row's id through to native push, and include
  them on the SSE event payload (`lib/notifications-emitter.ts`) so a
  connected client doesn't need a refetch to know what a fresh notification
  points at.
- Ownership: `GET /notifications` and `GET /analyses/:id` (the only
  `open_analysis` target today) were already scoped to
  `and(eq(id), eq(userId))` — re-verified, not changed. A client should
  treat any `actionType` it doesn't recognise as "no action" so future
  action types don't break older app builds.

## 4. Native push — FCM (P2-B3)

- **New table** `native_push_devices` (`id, userId FK cascade, token,
  platform enum[android,ios], enabled, lastSeenAt, createdAt, updatedAt`,
  globally unique index on `token`) — deliberately separate from
  `push_subscriptions` (Web Push/VAPID), which has an unrelated shape.
- **Endpoints**: `POST /api/native-push/register` (upserts on `token` —
  registering an already-registered token under a different account
  transfers ownership, correct for a shared/re-logged-in device) and
  `DELETE /api/native-push/unregister` (scoped to `userId AND token`, so a
  caller can only ever remove their own registration). Both `requireAuth`
  + strict Zod (`token` 20-4096 chars, `platform` android|ios, unknown keys
  rejected). Register is additionally rate-limited
  (`nativePushRegisterLimiter`, 30/hour/user).
- **Sender**: `lib/native-push.ts`, FCM HTTP v1 via `google-auth-library`
  (already a dependency — **no Firebase Admin SDK added**) +
  Application Default Credentials, scope
  `https://www.googleapis.com/auth/firebase.messaging`, endpoint
  `/v1/projects/{FIREBASE_PROJECT_ID}/messages:send`. Sends
  `android.notification.channel_id = "trade_pilot_alerts"` and
  `apns.payload.aps = { sound: "default", "content-available": 1 }`. Data
  payload carries `actionType`/`actionId`/`notificationId` as strings (FCM
  requires string values). A 404/400 (invalid/unregistered token) deletes
  the device row, mirroring how `webpush.ts` already retires dead Web Push
  subscriptions on 410/404. Never logs a full token — only the last 8
  characters, for incident correlation.
- **Isolation**: wired into `createNotification`/`createNotificationsForUsers`
  alongside the existing Web Push call — each channel is dispatched
  independently and its own failure is caught and logged without affecting
  the other channel or the DB insert. Covered by new tests in
  `lib/__tests__/create-notification.test.ts` (native fails → web still
  fires; web fails → native still fires; both fail → notification row still
  exists).

## 5. Notification preferences (P2-B4.1)

No new table — everything lives on `users`, same as before. **New columns
only**: `pushAnalysisCompleted`, `pushTpSlHit`, `pushLoginAlert`,
`nativePushEnabled`, `webPushEnabled`, `quietHoursEnabled`,
`quietHoursStart` ("HH:MM", default "22:00"), `quietHoursEnd` (default
"07:00"), `notificationTimezone` (IANA, default "Asia/Jakarta").
`GET`/`PATCH /push/prefs` unchanged in shape/route, extended with these
fields; `prefsSchema` is now `.strict()` (unknown keys rejected) and
validates `HH:MM` format + real IANA timezone names
(`Intl.DateTimeFormat` throws on garbage). Empty `PATCH` body still 400
(pre-existing check, now also covers the new fields).

`lib/notification-guards.ts`'s `withinQuietHours` accepts the four new
optional fields (`quietHoursEnabled`/`Start`/`End`/`notificationTimezone`)
with full backward compatibility — every existing caller
(`signal-flip.ts`, `price-anomaly.ts`, `watchlist-alerts.ts`, `dormancy.ts`,
`weekly-recap.ts`, `trader-mirror-weekly.ts`, `onboarding-nudge.ts`,
`market-open.ts`) still passes only `{ dailySummaryTimezone }` and gets the
exact same 22:00-07:00/Asia/Jakarta behavior as before. **Only the two new
security-notification producers (below) consult the full per-user quiet-
hours config.** Rewiring the other eight producers to read the new columns
too is a small, mechanical follow-up, intentionally left out of this pass
to avoid touching eight unrelated files' behavior in one sweep.

New security notification producers (`lib/security-notification.ts`):
- `notifyCriticalSecurityEvent(userId, "password_changed" |
  "security_question_changed")` — always creates the in-app row and always
  attempts push, ignoring preferences/quiet hours (wired into
  `PATCH /auth/password` and `PATCH /auth/security-question`).
- `notifyLoginAlert(userId)` — always creates the in-app row; OS push
  respects `pushLoginAlert` (wired into `POST /auth/login`).

## 6. Security hardening applied

- **CORS**: `app.ts` no longer reflects `origin: true` for every request
  (which let any website make credentialed requests using a logged-in
  user's cookies). Now an explicit allowlist: the production origin
  (`https://tradepilot.id`), no-Origin requests (native HTTP clients, which
  CORS doesn't apply to anyway), and `localhost`/`127.0.0.1` only outside
  `NODE_ENV=production`.
- **Rate limiting**: added `accountDeletionLimiter` (5/24h/user) and
  `nativePushRegisterLimiter` (30/hour/user), following the existing
  `buildLimiter` factory and per-user `keyFn` pattern; both added to the
  existing sweep-interval cleanup list.
- **Strict validation at the trust boundary**: `push/prefs` PATCH,
  `native-push/register`, `native-push/unregister`, and `auth/account` all
  use `.strict()` Zod schemas — unknown body keys are rejected everywhere
  they weren't already.
- **No new token/credential logging**: native push logs only a token's last
  8 characters; no payload, password, or full token appears in any new log
  line.
- **Not changed / explicitly out of scope**: no CSRF token middleware was
  added. Cookies already use `httpOnly` + `sameSite: "lax"` +
  `secure` in production (pre-existing); adding a full double-submit CSRF
  scheme across every existing mutation route is a materially bigger,
  riskier change than this pass's scope, and is called out here as a real
  gap rather than silently left unaddressed.

## 7. OpenAPI + generated clients

`lib/api-spec/openapi.yaml` is the single source of truth; all three
generated clients were regenerated from it via
`pnpm --filter @workspace/api-spec run codegen` (this runs orval for
`@workspace/api-client-react` + `@workspace/api-zod`, then
`openapi-generator-cli` for the Dart client at `lib/api-client-dart`, then
`tsc --build` across the workspace). New/changed schemas: `DeleteAccountBody`,
`NativePushRegisterBody`, `NativePushUnregisterBody`, `Notification`
(`category`/`actionType`/`actionId`), `PushPrefs`/`PushPrefsUpdate` (9 new
fields each). New paths: `DELETE /auth/account`, `POST /native-push/register`,
`DELETE /native-push/unregister`. No generated file was hand-edited.

## 8. Verification commands run and results

| Command | Result |
|---|---|
| `pnpm --filter @workspace/api-spec run codegen` | Succeeded — all 3 clients regenerated |
| `pnpm run typecheck` (root, all workspaces) | **Clean** for `api-server`, `ai-trading`, `mobile`, `scripts`. `mockup-sandbox` fails on a pre-existing React-19 type mismatch in `calendar.tsx`/`spinner.tsx` — present before this work, unrelated to anything touched here. |
| `pnpm --filter @workspace/api-server test` | **Blocked** — see below |
| `pnpm --filter @workspace/ai-trading test` | **149/149 passed**, 23 files |
| `pnpm --filter @workspace/ai-trading build` | Succeeded (`vite build` + PWA service-worker build); pre-existing "chunk >500kB" warning, unrelated |
| Smoke test `/`, `/privacy`, `/privacy-policy`, `/terms`, `/support`, `/delete-account` against the production build preview | **All 200**, no 404s |

**api-server test suite is blocked by design, not by a code defect.** Every
new column added to `users`/`notifications`, and the new
`native_push_devices` table, exist only in the Drizzle schema
(`lib/db/src/schema/index.ts`) — they have **not** been pushed to the actual
Postgres database, per this task's explicit instruction not to run any DB
push/migration. Since Drizzle's generated `INSERT INTO users (...)` always
lists every column, any test that creates a user (the overwhelming majority
of the suite) fails with `column "push_analysis_completed" of relation
"users" does not exist` — confirmed by manually re-running individual test
files and tracing the failure to that exact cause every time (e.g.
`openai-trade-plan.test.ts`, which touches none of this session's schema
changes, passed 20/20 cleanly in isolation once env vars were present).
**This is expected to fully resolve the moment the migration below is
applied** — no test logic was changed to route around this.

Pre-existing, unrelated flaky failures from earlier in this project's
history (confirmed via the same DB-drift lens, not this session's changes):
timezone/date-window-sensitive assertions in `watchlist-alerts.test.ts`,
`performance.test.ts`.

## 9. Explicitly not built (out of scope)

- Email sender / SMTP (no email producer exists in the repo; `emailEnabled`
  was deliberately not added, per the brief).
- A durable quiet-hours queue or scheduler rework.
- A second `category`/`notification_preferences` table — reused the
  existing `users` columns + `notifications.category` instead.
- SSR/prerendering for the new public pages (framework limitation, noted
  above, not attempted).
- CSRF token middleware (flagged as a gap in §6, not implemented).
- Rewiring quiet-hours consultation into the eight pre-existing
  notification producers beyond the two new security producers (§5).
- Any change to the Flutter/mobile app repository — out of scope per this
  task's own instructions, and not present in this monorepo regardless
  (this repo's own mobile artifact, `artifacts/mobile`, is an Expo/React
  Native app, not Flutter; the only Flutter-related asset here is the
  generated Dart **API client library**, `lib/api-client-dart`, used by a
  separate partner app per `docs/PANDUAN_SDK_FLUTTER.md` — neither was
  modified beyond what the standard codegen command regenerates).

## 10. Manual steps required before this is live

1. **Verify `DATABASE_URL`** for the target environment, then run the
   schema push:
   ```
   pnpm --filter @workspace/db run push
   ```
   (use `push-force` only if `drizzle-kit` reports it needs a destructive
   confirmation — the changes here are all additive nullable/defaulted
   columns and one new table, so `push` should apply cleanly without it).
   After this, re-run `pnpm --filter @workspace/api-server test` — it
   should now pass in full (modulo the two pre-existing flaky timezone
   tests noted above, unrelated to this work).
2. **Configure Firebase Cloud Messaging**:
   - Set `FIREBASE_PROJECT_ID=trade-pilot-newsmaker23` in the server
     environment.
   - Set up Application Default Credentials for that environment (e.g. a
     service account attached to the Cloud Run/Replit deployment, or
     `GOOGLE_APPLICATION_CREDENTIALS` pointing at a service-account JSON
     file **outside this repo** for local testing — never commit that
     file).
   - In the Firebase Console: Project Settings → Cloud Messaging → Apple
     app configuration → upload the APNs Authentication Key (`.p8` file +
     Key ID + Team ID) so iOS push actually delivers.
3. **Test native push end-to-end** once the above is done: have the mobile
   app call `POST /api/native-push/register` with a real device token,
   trigger any notification producer (or just wait for one), and confirm
   the OS-level push arrives on both Android and iOS test devices.
4. **Test account deletion** with a disposable test account against the
   post-migration database: create a user, `DELETE /api/auth/account` with
   the correct password, confirm the row and all related data are gone and
   the session no longer authenticates.
5. **Legal/business content review** — the following facts do **not**
   exist anywhere in this repo and were deliberately left out rather than
   invented; the business owner needs to supply and add them to
   `src/lib/legal-content.ts` before a real store submission:
   - A formal legal entity name (e.g. "PT ...") if `Trade Pilot`/`Newsmaker.id`
     isn't itself the correct legal operator to name in Privacy/Terms.
   - A registered business address, if the target store review requires one.
   - Whether a support-response-time SLA should be published on `/support`
     (none exists today, so the page makes no promise about response time).
   - A qualified legal reviewer should sign off on the Privacy Policy/Terms
     content before submission — this was written directly from the
     existing repo copy plus the new deletion/support sections, not
     drafted or reviewed by counsel.
6. **Create/confirm a reviewer/demo account** for the app store review
   teams, per each store's usual requirement.
7. **Deployment + production smoke test** — after steps 1-2 land, deploy
   normally and re-run the smoke test in §1/§8 against the real production
   URL (not just the local preview build used here).

## Rollback note

Every change in this pass is additive (new columns with defaults, new
table, new routes, new UI sections) — nothing existing was removed or
renamed. If something regresses after the migration lands, the safest
rollback is reverting the application code (this stays fully backward
compatible with the pre-migration DB shape for every *read* path, since
`push/prefs` GET still returns all pre-existing fields); the new columns
can simply be left in place (unused) rather than reverting the migration
itself, since they're all nullable/defaulted and harmless if unused.
