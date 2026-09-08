# Google Sign-In — Setup & Deploy Guide

How to ship the "Continue with Google" login/registration feature to the
Replit production deployment (`https://tradepilot.id`).

Server-side **Authorization Code** flow — no client-side Google SDK, no CSP
changes. The API server handles the whole redirect dance and sets the same
`session_token` cookie the email/password flow uses.

---

## 1. What's in the codebase

| Area | File | Change |
|---|---|---|
| Schema | `lib/db/src/schema/index.ts` | `users.google_id` (text, unique, nullable); `password_hash` / `security_question` / `security_answer_hash` made **nullable** |
| OAuth helper | `artifacts/api-server/src/lib/google-oauth.ts` | build consent URL, exchange code, verify `id_token` |
| Routes | `artifacts/api-server/src/routes/auth.ts` | `GET /api/auth/google`, `GET /api/auth/google/callback`; password/security-question/delete routes guarded for Google-only accounts |
| Rate limit | `artifacts/api-server/src/middleware/rate-limit.ts` | `googleOAuthLimiter` (20 / 15 min / IP) |
| UI | `artifacts/ai-trading/src/components/google-sign-in-button.tsx` | button + "or" divider |
| UI | `artifacts/ai-trading/src/pages/login.tsx`, `register.tsx` | render the button; login toasts on `?error=google` |
| i18n | `artifacts/ai-trading/src/locales/{id,en}.ts` | `auth.continue_with_google`, `auth.or_divider`, `auth.google_login_failed`, `auth.google_email_unverified` |
| Config | `.replit` `[userenv.shared]` | `GOOGLE_CLIENT_ID`, `PUBLIC_BASE_URL` (prod value) |

**Flow**

```
User clicks button
  → GET /api/auth/google           (sets short-lived g_oauth_state cookie)
  → 302 https://accounts.google.com/o/oauth2/v2/auth?...
  → user consents
  → 302 <PUBLIC_BASE_URL>/api/auth/google/callback?code=...&state=...
        - verify state cookie matches
        - exchange code → verify id_token (audience = GOOGLE_CLIENT_ID)
        - require email_verified === true
        - upsert user:  match google_id  →  else link by verified email  →  else create
        - create session row + set session_token cookie (30-day)
  → 302 /dashboard                  (new users hit the onboarding modal there)
```

Any failure → `302 /login?error=google` (or `?error=google_unverified`), which the
login page turns into a toast. No stack traces leak to the user.

---

## 2. Prerequisites (one-time, in Google Cloud Console)

Project: **trade-pilot-508001** — OAuth 2.0 **Web application** client already created.

Verify these under **APIs & Services → Credentials → (the Web client)**:

- **Authorized redirect URIs** — must contain, verbatim:
  - `https://tradepilot.id/api/auth/google/callback`  ← production
  - `http://localhost:5173/api/auth/google/callback`  ← local dev
- **Authorized JavaScript origins**:
  - `https://tradepilot.id`
  - `http://localhost:5173`

**OAuth consent screen** (APIs & Services → OAuth consent screen):

- Scopes used: `openid`, `email`, `profile` — all **non-sensitive**, so Google
  app-verification is **not** required.
- Publishing status:
  - **"In production"** → anyone with a Google account can sign in. Recommended.
  - **"Testing"** → only listed test users can sign in (max 100). Fine for a
    private beta; add each tester's email under *Test users*.

> The `client_secret` for a Web client **is** a real secret. Keep it out of
> git — it lives only in `.env` (local, git-ignored) and Replit Secrets (prod).

---

## 3. Deploy to Replit

### 3.1 Set the secret

Replit → your deployment → **Secrets** (or Tools → Secrets), add:

| Key | Value |
|---|---|
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-…` (from the OAuth client / `OAuth google.json`) |

`GOOGLE_CLIENT_ID` and `PUBLIC_BASE_URL` are already in `.replit`
`[userenv.shared]` (client id is not secret — it travels in the redirect URL).
If you'd rather keep everything in one place, you can also add both to Secrets;
Secrets win over `[userenv.shared]`.

Confirm the effective values in prod:

| Key | Prod value |
|---|---|
| `GOOGLE_CLIENT_ID` | `929958103345-cbf424vgelrer7nkrr81l4iptsikuc1u.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | *(Secrets only)* |
| `PUBLIC_BASE_URL` | `https://tradepilot.id` |

> `PUBLIC_BASE_URL` **must** equal the origin of a registered redirect URI. The
> server builds `redirect_uri = ${PUBLIC_BASE_URL}/api/auth/google/callback`.
> If the deployed domain is not `tradepilot.id`, change both this value and the
> Google Console redirect URI to match.

### 3.2 Publish

Deploy as usual (Replit **Publish** / redeploy). The build runs
`pnpm run typecheck && pnpm -r run build`, which rebuilds
`artifacts/api-server/dist` (the new routes) and the SPA (the new button).

### 3.3 Run the production DB migration

The schema change is **additive and non-destructive** (one nullable column,
three `DROP NOT NULL`, one unique constraint on an all-NULL column). Run it
against the **production** database — from the Replit Shell, with prod
`DATABASE_URL` in the environment:

```bash
pnpm --filter @workspace/db run push
```

When prompted about `users_google_id_unique` / *"Do you want to truncate users
table?"* → choose **"No, add the constraint without truncating the table"**.

<details>
<summary>Equivalent raw SQL (if you'd rather not use drizzle-kit interactively)</summary>

```sql
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "google_id" text;
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "security_question" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "security_answer_hash" DROP NOT NULL;
DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_google_id_unique" UNIQUE ("google_id");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
```
</details>

> Order doesn't matter much, but if you deploy the new code **before** running
> the migration, Google sign-in just fails gracefully (`/login?error=google`)
> until the migration lands — no crash, no partial writes.

---

## 4. Smoke test (production)

1. Open `https://tradepilot.id/login` in a fresh/incognito window.
2. The **"Continue with Google"** button + an "or" divider appear above the
   email form (same on `/register`).
3. Click it → Google account chooser → pick an account → consent.
4. You land on `https://tradepilot.id/dashboard`.
   - Brand-new account → the onboarding modal shows.
5. Check the account:
   - `SELECT email, google_id, password_hash FROM users WHERE email = '<you>';`
     → `google_id` set, `password_hash` NULL for a Google-only signup.
6. Log out, click "Continue with Google" again → straight back in (no second
   account row).
7. **Linking**: if `<you>` already had a password account, signing in with the
   same Google email sets `google_id` on that row (no new row); the password
   still works too.

Quick server-only check (no browser):

```bash
curl -sI https://tradepilot.id/api/auth/google | grep -i location
# → Location: https://accounts.google.com/o/oauth2/v2/auth?...redirect_uri=https%3A%2F%2Ftradepilot.id%2Fapi%2Fauth%2Fgoogle%2Fcallback...
```

---

## 5. Environment variable reference

| Var | Where | Secret? | Purpose |
|---|---|---|---|
| `GOOGLE_CLIENT_ID` | `.replit` `[userenv.shared]` + `.env` | No | OAuth client id; audience for `id_token` verification |
| `GOOGLE_CLIENT_SECRET` | Replit Secrets + `.env` | **Yes** | OAuth client secret for the code→token exchange |
| `PUBLIC_BASE_URL` | `.replit` `[userenv.shared]` + `.env` | No | Origin the `redirect_uri` is built from; must match a registered redirect URI |

If `GOOGLE_CLIENT_ID` **or** `GOOGLE_CLIENT_SECRET` is missing, `GET /api/auth/google`
returns **503** and the rest of auth is unaffected — the feature is effectively
off until both are set.

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Cannot GET /api/auth/google` (Express 404) | Deployed bundle predates this feature | Redeploy so `artifacts/api-server/dist` is rebuilt |
| `GET /api/auth/google` → **503** `Login Google belum dikonfigurasi` | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` not in the server env | Add the Secret / userenv value, redeploy |
| Google shows **`redirect_uri_mismatch`** | `PUBLIC_BASE_URL` ≠ any registered redirect URI (trailing slash, http vs https, wrong host) | Make `PUBLIC_BASE_URL` exactly the origin of a URI in the Console |
| Callback → `/login?error=google`, server log `Google user upsert failed` | Prod DB migration not run (`google_id` column missing) | Run §3.3 |
| Callback → `/login?error=google`, server log `Google code exchange failed` | Clock skew, wrong `client_secret`, or reused/expired `code` | Check the Secret; retry (codes are single-use) |
| Callback → `/login?error=google_unverified` | The Google account's email isn't verified | User verifies email with Google, or uses a different account |
| Sign-in works but user stuck on landing page | `res.redirect("/dashboard")` reached a logged-out state | Confirm the `session_token` cookie is being set (needs `secure` + https in prod, which it is) |
| "Access blocked: app not verified" / only some users can log in | Consent screen is in **Testing** mode | Publish the consent screen, or add the user under *Test users* |

Server logs: `pino` to stdout — look for `[auth] Google …` lines.

---

## 7. Rollback

The feature is self-contained:

1. **Fastest** — unset `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` and redeploy.
   `GET /api/auth/google` starts returning 503; the button still renders but
   does nothing useful. Email/password login is untouched.
2. **Full** — revert the feature commit and redeploy. The DB columns can stay
   (nullable + an all-NULL unique column are harmless); dropping them is
   optional:
   ```sql
   ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_google_id_unique";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "google_id";
   -- re-adding NOT NULL is only safe if no Google-only rows exist:
   -- ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;  (etc.)
   ```

---

## 8. Known follow-ups (not shipped)

- **Profile page** still shows "Ganti Password" / "Pertanyaan Keamanan" for
  Google-only accounts. Clicking them returns a clean `400` (no crash), but the
  sections should be hidden. Needs a `hasPassword` flag on `/api/auth/me`.
- **Mobile app** (`artifacts/mobile`, Expo) has no Google sign-in — web only.
- Account deletion for a Google-only account skips the password prompt (the
  session cookie is the proof of identity); the profile-page dialog still shows
  a password field that such users can leave blank.
