import { Router } from "express";
import { notifyAdminsUserCreated, notifySuperAdminsUserDeleted } from "../lib/jobs";
import { notifyCriticalSecurityEvent, notifyLoginAlert } from "../lib/security-notification";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db } from "../lib/db";
import {
  users,
  sessions,
  passwordResetTokens,
  pushSubscriptions,
  nativePushDevices,
} from "@workspace/db/schema";
import { eq, and, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { createSingleSession } from "../lib/session";
import {
  forgotPasswordQuestionLimiter,
  forgotPasswordVerifyLimiter,
  loginLimiter,
  registerLimiter,
  forgotPasswordResetLimiter,
  accountDeletionLimiter,
  googleOAuthLimiter,
  googleNativeLoginLimiter,
  appleNativeLoginLimiter,
  facebookOAuthLimiter,
  tiktokOAuthLimiter,
  tiktokCompleteSignupLimiter,
  reauthLimiter,
} from "../middleware/rate-limit";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { logger } from "../lib/logger";
import {
  buildGoogleAuthUrl,
  exchangeCodeForProfile,
  isGoogleOAuthConfigured,
  isNativeGoogleConfigured,
  resolvePublicBaseUrl,
  verifyGoogleIdToken,
} from "../lib/google-oauth";
import {
  resolveGoogleUser,
  GoogleAccountConflictError,
} from "../lib/google-account";
import {
  isNativeAppleConfigured,
  verifyAppleIdentityToken,
  exchangeAppleAuthorizationCode,
} from "../lib/apple-oauth";
import {
  resolveAppleUser,
  AppleAccountConflictError,
  AppleAccountUnavailableError,
} from "../lib/apple-account";
import { issueReauthToken, consumeReauthToken } from "../lib/reauth";
import {
  buildFacebookAuthUrl,
  exchangeCodeForFacebookProfile,
  isFacebookOAuthConfigured,
} from "../lib/facebook-oauth";
import {
  resolveFacebookUser,
  FacebookAccountConflictError,
} from "../lib/facebook-account";
import {
  buildTiktokAuthUrl,
  exchangeCodeForTiktokProfile,
  generateCodeVerifier,
  isTiktokOAuthConfigured,
} from "../lib/tiktok-oauth";
import { findUserByTiktokId, createUserFromTiktokSignup, TiktokEmailTakenError } from "../lib/tiktok-account";
import { issuePendingTiktokSignup, peekPendingTiktokSignup, consumePendingTiktokSignup } from "../lib/pending-tiktok-signup";

const router = Router();

/**
 * The public user shape every auth response returns. `hasPassword` lets a
 * client tell a password account from a Google-only one (e.g. to hide the
 * "change password" menu, or to pick the right re-auth method).
 */
function serializeUser(u: typeof users.$inferSelect) {
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    role: u.role,
    selectedMode: u.selectedMode,
    themePreference: u.themePreference,
    onboardingCompleted: u.onboardingCompleted,
    avatarUrl: u.avatarUrl,
    // `hasPassword` lets a client tell a password account from a
    // Google-only one; `createdAt` was already declared required in the
    // OpenAPI `User` schema but never actually returned — now it is.
    hasPassword: u.passwordHash != null,
    createdAt:
      u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
  };
}

const SECURITY_QUESTIONS = [
  "Nama hewan peliharaan pertama kamu?",
  "Nama kota tempat kamu lahir?",
  "Nama ibu kandung kamu?",
  "Nama sekolah dasar kamu?",
  "Nama teman terbaik masa kecil kamu?",
];

// Persistent per-account lockout for /auth/forgot-password/verify. The
// existing IP+email rate limiter (5/15min, in-memory) protects a single
// IP+restart window; this layer persists across restarts and applies no
// matter how many IPs the attacker rotates through.
const MAX_FAILED_RESET_ATTEMPTS = 5;
const RESET_LOCKOUT_MS = 15 * 60 * 1000;

// Precomputed at startup so the /verify deny branches that don't have a
// real user hash can still call `bcrypt.compare` against a cost-12 hash —
// matching the cost used to hash real `securityAnswerHash` values in
// register/change-security-question. Using `compare` (not `hash`) on the
// dummy keeps the operation type identical to the wrong-answer branch,
// closing the timing side-channel the architect review flagged.
const DUMMY_SECURITY_ANSWER_HASH = bcrypt.hashSync(
  "dummy_answer_to_prevent_timing_attack",
  12
);

const registerSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  displayName: z.string().min(1, "Nama wajib diisi").max(80, "Nama terlalu panjang"),
  selectedMode: z.enum(["beginner", "pro"], {
    errorMap: () => ({ message: "Mode harus 'beginner' atau 'pro'" }),
  }),
  securityQuestion: z
    .string()
    .refine((v) => SECURITY_QUESTIONS.includes(v), "Pertanyaan keamanan tidak valid"),
  securityAnswer: z.string().min(1, "Jawaban keamanan wajib diisi"),
  rememberMe: z.boolean().optional(),
});

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function getSessionExpiry(rememberMe: boolean): Date {
  const ms = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

router.post("/auth/register", registerLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res.status(400).json({ error: first?.message ?? "Data registrasi tidak valid" });
    return;
  }
  const { email, password, displayName, selectedMode, securityQuestion, securityAnswer, rememberMe } =
    parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (existing) {
    res.status(409).json({ error: "Email sudah terdaftar" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const securityAnswerHash = await bcrypt.hash(
    securityAnswer.toLowerCase().trim(),
    12
  );

  const [user] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      passwordHash,
      displayName,
      selectedMode: selectedMode ?? "pro",
      securityQuestion,
      securityAnswerHash,
    })
    .returning();

  const token = generateToken();
  const expiresAt = getSessionExpiry(rememberMe ?? false);

  await createSingleSession(user.id, token, expiresAt);

  res.cookie("session_token", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  void notifyAdminsUserCreated(user.displayName);

  res.status(201).json({ token, user: serializeUser(user) });
});

const loginSchema = z.object({
  email: z.string().min(1, "Username atau email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
  rememberMe: z.boolean().optional(),
});

router.post("/auth/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res.status(400).json({ error: first?.message ?? "Email dan password wajib diisi" });
    return;
  }
  const { email, password, rememberMe } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "Email atau password salah" });
    return;
  }

  // Google-OAuth-only account (no local password). Steer the user to the
  // Google button instead of leaking "this email exists" via a distinct
  // 401 — but a specific message here is a materially better UX and the
  // email is already confirmed to exist by this branch only when the
  // password would also have to match, so keep it explicit.
  if (!user.passwordHash) {
    res.status(401).json({
      error: "Akun ini terdaftar lewat Google. Silakan login dengan Google.",
    });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Email atau password salah" });
    return;
  }

  const token = generateToken();
  const expiresAt = getSessionExpiry(rememberMe ?? false);

  await createSingleSession(user.id, token, expiresAt);

  res.cookie("session_token", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  void notifyLoginAlert(user.id);

  res.json({ token, user: serializeUser(user) });
});

// ---------------------------------------------------------------------------
// Google OAuth 2.0 (login + registration) — server-side redirect flow.
// See lib/google-oauth.ts for the flow overview and required env config.
// ---------------------------------------------------------------------------

const GOOGLE_STATE_COOKIE = "g_oauth_state";
const GOOGLE_STATE_TTL_MS = 10 * 60 * 1000;

function requestOrigin(req: { protocol: string; get(name: string): string | undefined }) {
  return { protocol: req.protocol, host: req.get("host") };
}

// Start the flow: stash a CSRF `state` in a short-lived cookie and bounce
// the browser to Google's consent screen.
router.get("/auth/google", googleOAuthLimiter, (req, res) => {
  if (!isGoogleOAuthConfigured()) {
    res.status(503).json({ error: "Login Google belum dikonfigurasi." });
    return;
  }

  const state = generateToken();
  res.cookie(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: GOOGLE_STATE_TTL_MS,
    path: "/api/auth/google",
  });

  const baseUrl = resolvePublicBaseUrl(requestOrigin(req));
  res.redirect(buildGoogleAuthUrl(baseUrl, state));
});

// Google redirects back here with `?code` + `?state`. On any failure we
// bounce to /login?error=google rather than showing a JSON blob.
router.get("/auth/google/callback", googleOAuthLimiter, async (req, res) => {
  const fail = (reason: string, code = "google") => {
    res.clearCookie(GOOGLE_STATE_COOKIE, { path: "/api/auth/google" });
    logger.warn({ reason }, "[auth] Google OAuth callback failed");
    res.redirect(`/login?error=${code}`);
  };

  if (!isGoogleOAuthConfigured()) {
    fail("not_configured");
    return;
  }

  const code = typeof req.query["code"] === "string" ? req.query["code"] : null;
  const state = typeof req.query["state"] === "string" ? req.query["state"] : null;
  const cookieState = req.cookies?.[GOOGLE_STATE_COOKIE];

  if (req.query["error"]) {
    // User denied consent, or Google returned an error param.
    fail(`google_error:${String(req.query["error"]).slice(0, 40)}`);
    return;
  }
  if (!code || !state || !cookieState || state !== cookieState) {
    fail("bad_state");
    return;
  }

  let profile;
  try {
    const baseUrl = resolvePublicBaseUrl(requestOrigin(req));
    profile = await exchangeCodeForProfile(baseUrl, code);
  } catch (err) {
    logger.warn({ err }, "[auth] Google code exchange failed");
    fail("exchange_failed");
    return;
  }

  if (!profile.emailVerified) {
    fail("email_unverified", "google_unverified");
    return;
  }

  // Upsert: match on google_id, then link by verified email, else create.
  // Shared with POST /auth/google/native — see lib/google-account.ts.
  let user: typeof users.$inferSelect;
  let isNewUser: boolean;
  try {
    ({ user, isNewUser } = await resolveGoogleUser(profile));
  } catch (err) {
    logger.error({ err }, "[auth] Google user upsert failed");
    fail(
      err instanceof GoogleAccountConflictError ? "account_conflict" : "upsert_failed",
    );
    return;
  }

  const token = generateToken();
  // A Google sign-in is an explicit "this is my device" action — give it
  // the long (remember-me) session like the checkbox on the login form.
  const expiresAt = getSessionExpiry(true);

  await createSingleSession(user.id, token, expiresAt);

  res.clearCookie(GOOGLE_STATE_COOKIE, { path: "/api/auth/google" });
  res.cookie("session_token", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  if (isNewUser) {
    void notifyAdminsUserCreated(user.displayName);
  }
  void notifyLoginAlert(user.id);

  // Land on the dashboard — it's a ProtectedRoute (the fresh session
  // cookie satisfies it) and it fires the onboarding modal for the
  // brand-new accounts that skipped the register form.
  res.redirect("/dashboard");
});

// ---------------------------------------------------------------------------
// Facebook Login (login + registration) — server-side redirect flow.
// See lib/facebook-oauth.ts for the flow overview and required env config.
// Mirrors the Google block above exactly (Facebook's `email` permission
// returns a Facebook-confirmed address, so account linking works the same
// way) — the one difference is a rare account with no email on file at
// all, handled as a plain login failure rather than TikTok's pending-
// signup detour.
// ---------------------------------------------------------------------------

const FACEBOOK_STATE_COOKIE = "fb_oauth_state";
const FACEBOOK_STATE_TTL_MS = 10 * 60 * 1000;

router.get("/auth/facebook", facebookOAuthLimiter, (req, res) => {
  if (!isFacebookOAuthConfigured()) {
    res.status(503).json({ error: "Login Facebook belum dikonfigurasi." });
    return;
  }

  const state = generateToken();
  res.cookie(FACEBOOK_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: FACEBOOK_STATE_TTL_MS,
    path: "/api/auth/facebook",
  });

  const baseUrl = resolvePublicBaseUrl(requestOrigin(req));
  res.redirect(buildFacebookAuthUrl(baseUrl, state));
});

// Facebook redirects back here with `?code` + `?state`. On any failure we
// bounce to /login?error=facebook rather than showing a JSON blob.
router.get("/auth/facebook/callback", facebookOAuthLimiter, async (req, res) => {
  const fail = (reason: string, code = "facebook") => {
    res.clearCookie(FACEBOOK_STATE_COOKIE, { path: "/api/auth/facebook" });
    logger.warn({ reason }, "[auth] Facebook OAuth callback failed");
    res.redirect(`/login?error=${code}`);
  };

  if (!isFacebookOAuthConfigured()) {
    fail("not_configured");
    return;
  }

  const code = typeof req.query["code"] === "string" ? req.query["code"] : null;
  const state = typeof req.query["state"] === "string" ? req.query["state"] : null;
  const cookieState = req.cookies?.[FACEBOOK_STATE_COOKIE];

  if (req.query["error"]) {
    fail(`facebook_error:${String(req.query["error"]).slice(0, 40)}`);
    return;
  }
  if (!code || !state || !cookieState || state !== cookieState) {
    fail("bad_state");
    return;
  }

  let profile;
  try {
    const baseUrl = resolvePublicBaseUrl(requestOrigin(req));
    profile = await exchangeCodeForFacebookProfile(baseUrl, code);
  } catch (err) {
    logger.warn({ err }, "[auth] Facebook code exchange failed");
    fail("exchange_failed");
    return;
  }

  if (!profile.email) {
    fail("no_email", "facebook_no_email");
    return;
  }

  // Upsert: match on facebook_id, then link by email, else create.
  let user: typeof users.$inferSelect;
  let isNewUser: boolean;
  try {
    ({ user, isNewUser } = await resolveFacebookUser({ ...profile, email: profile.email }));
  } catch (err) {
    logger.error({ err }, "[auth] Facebook user upsert failed");
    fail(
      err instanceof FacebookAccountConflictError ? "account_conflict" : "upsert_failed",
    );
    return;
  }

  const token = generateToken();
  const expiresAt = getSessionExpiry(true);

  await createSingleSession(user.id, token, expiresAt);

  res.clearCookie(FACEBOOK_STATE_COOKIE, { path: "/api/auth/facebook" });
  res.cookie("session_token", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  if (isNewUser) {
    void notifyAdminsUserCreated(user.displayName);
  }
  void notifyLoginAlert(user.id);

  res.redirect("/dashboard");
});

// ---------------------------------------------------------------------------
// TikTok Login Kit (login + registration) — server-side redirect flow.
// See lib/tiktok-oauth.ts for the flow overview and required env config.
//
// TikTok never returns an email, so — unlike Google/Apple — a brand-new
// sign-in can't create the user row directly at callback time. It instead
// issues a pendingTiktokSignups token (short-lived httpOnly cookie) and
// bounces to /auth/tiktok/complete-signup, which collects a real email
// before the account is actually created.
// ---------------------------------------------------------------------------

const TIKTOK_STATE_COOKIE = "tt_oauth_state";
const TIKTOK_VERIFIER_COOKIE = "tt_oauth_verifier";
const TIKTOK_PENDING_COOKIE = "tt_pending_signup";
const TIKTOK_STATE_TTL_MS = 10 * 60 * 1000;
const TIKTOK_PENDING_TTL_MS = 15 * 60 * 1000;

router.get("/auth/tiktok", tiktokOAuthLimiter, (req, res) => {
  if (!isTiktokOAuthConfigured()) {
    res.status(503).json({ error: "Login TikTok belum dikonfigurasi." });
    return;
  }

  const state = generateToken();
  const codeVerifier = generateCodeVerifier();
  const cookieOpts = {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax" as const,
    maxAge: TIKTOK_STATE_TTL_MS,
    path: "/api/auth/tiktok",
  };
  res.cookie(TIKTOK_STATE_COOKIE, state, cookieOpts);
  res.cookie(TIKTOK_VERIFIER_COOKIE, codeVerifier, cookieOpts);

  const baseUrl = resolvePublicBaseUrl(requestOrigin(req));
  res.redirect(buildTiktokAuthUrl(baseUrl, state, codeVerifier));
});

// TikTok redirects back here with `?code` + `?state`. On any failure we
// bounce to /login?error=tiktok rather than showing a JSON blob.
router.get("/auth/tiktok/callback", tiktokOAuthLimiter, async (req, res) => {
  const clearOAuthCookies = () => {
    res.clearCookie(TIKTOK_STATE_COOKIE, { path: "/api/auth/tiktok" });
    res.clearCookie(TIKTOK_VERIFIER_COOKIE, { path: "/api/auth/tiktok" });
  };
  const fail = (reason: string, code = "tiktok") => {
    clearOAuthCookies();
    logger.warn({ reason }, "[auth] TikTok OAuth callback failed");
    res.redirect(`/login?error=${code}`);
  };

  if (!isTiktokOAuthConfigured()) {
    fail("not_configured");
    return;
  }

  const code = typeof req.query["code"] === "string" ? req.query["code"] : null;
  const state = typeof req.query["state"] === "string" ? req.query["state"] : null;
  const cookieState = req.cookies?.[TIKTOK_STATE_COOKIE];
  const codeVerifier = req.cookies?.[TIKTOK_VERIFIER_COOKIE];

  if (req.query["error"]) {
    fail(`tiktok_error:${String(req.query["error"]).slice(0, 40)}`);
    return;
  }
  if (!code || !state || !cookieState || state !== cookieState || !codeVerifier) {
    fail("bad_state");
    return;
  }

  let profile;
  try {
    const baseUrl = resolvePublicBaseUrl(requestOrigin(req));
    profile = await exchangeCodeForTiktokProfile(baseUrl, code, codeVerifier);
  } catch (err) {
    logger.warn({ err }, "[auth] TikTok code exchange failed");
    fail("exchange_failed");
    return;
  }

  clearOAuthCookies();

  // Returning user: tiktok_id already belongs to an account -> log them in
  // directly, same session shape as the Google callback.
  const existingUser = await findUserByTiktokId(profile.tiktokId);
  if (existingUser) {
    const token = generateToken();
    const expiresAt = getSessionExpiry(true);
    await createSingleSession(existingUser.id, token, expiresAt);
    // Keep the captured TikTok profile fresh (display name/avatar can
    // change on TikTok's side between logins) — this data is the actual
    // product goal of this feature, independent of auth.
    await db
      .update(users)
      .set({ tiktokDisplayName: profile.displayName, tiktokAvatarUrl: profile.avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, existingUser.id));
    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      expires: expiresAt,
    });
    void notifyLoginAlert(existingUser.id);
    res.redirect("/dashboard");
    return;
  }

  // Brand-new TikTok sign-in: no email to create the account with yet.
  // Stash the verified profile server-side and ask the browser to finish
  // signup with a real email.
  const { token: pendingToken } = await issuePendingTiktokSignup(profile);
  res.cookie(TIKTOK_PENDING_COOKIE, pendingToken, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: TIKTOK_PENDING_TTL_MS,
    path: "/api/auth/tiktok",
  });
  res.redirect("/auth/tiktok/complete-signup");
});

// The frontend's "finish signup" page reads the pending TikTok profile
// (display name only — never the tiktok_id itself) to show a friendly
// "Hi, {name}" before asking for an email. The pending token stays in its
// httpOnly cookie throughout; it's never exposed to page JS as a value the
// client could tamper with.
router.get("/auth/tiktok/pending-signup", tiktokOAuthLimiter, async (req, res) => {
  const pendingToken = req.cookies?.[TIKTOK_PENDING_COOKIE];
  const profile = pendingToken ? await peekPendingTiktokSignup(pendingToken) : null;
  if (!profile) {
    res.status(404).json({ error: "Sesi pendaftaran TikTok tidak ditemukan atau sudah kedaluwarsa." });
    return;
  }
  res.json({ displayName: profile.displayName, avatarUrl: profile.avatarUrl });
});

const tiktokCompleteSignupSchema = z
  .object({ email: z.string().trim().email("Email tidak valid") })
  .strict();

router.post(
  "/auth/tiktok/complete-signup",
  tiktokCompleteSignupLimiter,
  async (req, res) => {
    const pendingToken = req.cookies?.[TIKTOK_PENDING_COOKIE];
    if (!pendingToken) {
      res.status(400).json({ error: "Sesi pendaftaran TikTok tidak ditemukan atau sudah kedaluwarsa." });
      return;
    }
    const parsed = tiktokCompleteSignupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Email tidak valid" });
      return;
    }

    let user: typeof users.$inferSelect;
    try {
      user = await db.transaction(async (tx) => {
        const profile = await consumePendingTiktokSignup(tx, pendingToken);
        if (!profile) {
          throw new Error("PENDING_SIGNUP_EXPIRED");
        }
        return createUserFromTiktokSignup(tx, profile, parsed.data.email);
      });
    } catch (err) {
      if (err instanceof TiktokEmailTakenError) {
        res.status(409).json({ error: "Email sudah terdaftar" });
        return;
      }
      if (err instanceof Error && err.message === "PENDING_SIGNUP_EXPIRED") {
        res.status(400).json({ error: "Sesi pendaftaran TikTok tidak ditemukan atau sudah kedaluwarsa." });
        return;
      }
      logger.error({ err }, "[auth] TikTok complete-signup failed");
      res.status(500).json({ error: "Gagal menyelesaikan pendaftaran TikTok" });
      return;
    }

    res.clearCookie(TIKTOK_PENDING_COOKIE, { path: "/api/auth/tiktok" });

    const token = generateToken();
    const expiresAt = getSessionExpiry(true);
    await createSingleSession(user.id, token, expiresAt);
    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    void notifyAdminsUserCreated(user.displayName);
    void notifyLoginAlert(user.id);

    res.status(201).json({ token, user: serializeUser(user) });
  },
);

// ---------------------------------------------------------------------------
// Native Google Sign-In (mobile). The Flutter app obtains a Google ID token
// with the native Google SDK and posts it here; the server verifies it and
// issues a normal TradePilot session (Bearer token, no cookie needed).
// Config: GOOGLE_NATIVE_ALLOWED_CLIENT_IDS (see lib/google-oauth.ts).
// ---------------------------------------------------------------------------

const googleNativeSchema = z
  .object({ idToken: z.string().min(1, "idToken wajib diisi") })
  .strict();

router.post(
  "/auth/google/native",
  googleNativeLoginLimiter,
  async (req, res) => {
    if (!isNativeGoogleConfigured()) {
      res.status(503).json({ error: "Login Google native belum dikonfigurasi." });
      return;
    }
    const parsed = googleNativeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Permintaan tidak valid." });
      return;
    }

    let profile;
    try {
      profile = await verifyGoogleIdToken(parsed.data.idToken);
    } catch (err) {
      // Never log the raw token — `err` from google-auth-library does not
      // contain it, but keep the log minimal regardless.
      logger.warn(
        { reason: err instanceof Error ? err.message : "verify_failed" },
        "[auth] Google native id_token verification failed",
      );
      res.status(401).json({
        error: "Login Google tidak dapat diverifikasi. Silakan coba lagi.",
      });
      return;
    }

    let user: typeof users.$inferSelect;
    let isNewUser: boolean;
    try {
      ({ user, isNewUser } = await resolveGoogleUser(profile));
    } catch (err) {
      if (err instanceof GoogleAccountConflictError) {
        res.status(409).json({
          error: "Email ini sudah tertaut ke akun Google lain.",
        });
        return;
      }
      logger.error({ err }, "[auth] Google native user upsert failed");
      res.status(500).json({ error: "Terjadi kesalahan. Silakan coba lagi." });
      return;
    }

    const token = generateToken();
    const expiresAt = getSessionExpiry(true);
    await createSingleSession(user.id, token, expiresAt);

    if (isNewUser) void notifyAdminsUserCreated(user.displayName);
    void notifyLoginAlert(user.id);

    res.json({ token, user: serializeUser(user) });
  },
);

// ---------------------------------------------------------------------------
// Re-authentication for sensitive operations. A Google-only account proves
// identity with a FRESH Google ID token and gets a short-lived, single-use
// reauthToken that one sensitive endpoint (currently DELETE /auth/account)
// will accept.
// ---------------------------------------------------------------------------

const googleReauthSchema = z
  .object({ idToken: z.string().min(1, "idToken wajib diisi") })
  .strict();

router.post(
  "/auth/reauth/google",
  requireAuth,
  reauthLimiter,
  async (req: AuthRequest, res) => {
    if (!isNativeGoogleConfigured()) {
      res.status(503).json({ error: "Verifikasi Google belum dikonfigurasi." });
      return;
    }
    const parsed = googleReauthSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Permintaan tidak valid." });
      return;
    }

    const [user] = await db
      .select({ id: users.id, email: users.email, googleId: users.googleId })
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    if (!user) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }

    let profile;
    try {
      profile = await verifyGoogleIdToken(parsed.data.idToken);
    } catch {
      res.status(401).json({
        error: "Verifikasi Google gagal. Silakan coba lagi.",
      });
      return;
    }

    // The fresh token must belong to the SAME Google identity / email as
    // the signed-in account.
    const sameIdentity =
      (user.googleId != null && user.googleId === profile.googleId) ||
      user.email.toLowerCase() === profile.email;
    if (!sameIdentity) {
      res.status(401).json({
        error: "Akun Google tidak cocok dengan akun yang sedang masuk.",
      });
      return;
    }

    const { token, expiresAt } = await issueReauthToken(
      user.id,
      "delete_account",
    );
    res.json({ reauthToken: token, expiresAt: expiresAt.toISOString() });
  },
);

// ---------------------------------------------------------------------------
// Native Sign in with Apple (mobile). The app runs Apple's own
// authorization UI and posts the resulting identity token + authorization
// code here, along with the raw nonce it generated (Apple only ever sees
// the SHA-256 hash of it — see lib/apple-oauth.ts). Verification, account
// linking, session issuance, and error shape all mirror
// POST /auth/google/native above; see lib/apple-oauth.ts and
// lib/apple-account.ts for the Apple-specific rules.
// Config: APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY,
// APPLE_ALLOWED_CLIENT_IDS (see lib/apple-oauth.ts).
// ---------------------------------------------------------------------------

// A trimmed, control-character-stripped, length-capped optional name part.
// Apple only ever sends givenName/familyName on the very first
// authorization for a given app — used solely as a display-name candidate
// when creating a brand-new account (see lib/apple-account.ts).
function stripControlCharacters(value: string): string {
  return Array.from(value)
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code > 0x1f && code !== 0x7f;
    })
    .join("");
}

const appleNamePart = z
  .string()
  .trim()
  .max(100, "Nama terlalu panjang")
  .transform(stripControlCharacters)
  .optional();

const appleNativeSchema = z
  .object({
    identityToken: z.string().min(1, "identityToken wajib diisi").max(8000),
    authorizationCode: z.string().min(1, "authorizationCode wajib diisi").max(2048),
    nonce: z.string().min(1, "nonce wajib diisi").max(512),
    givenName: appleNamePart,
    familyName: appleNamePart,
  })
  .strict();

router.post(
  "/auth/apple/native",
  appleNativeLoginLimiter,
  async (req, res) => {
    if (!isNativeAppleConfigured()) {
      res.status(503).json({ error: "Login Apple native belum dikonfigurasi." });
      return;
    }
    const parsed = appleNativeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Permintaan tidak valid." });
      return;
    }

    let profile;
    try {
      profile = await verifyAppleIdentityToken(parsed.data.identityToken, parsed.data.nonce);
    } catch (err) {
      // Never log the raw token/nonce/code — `err` here is our own thrown
      // Error with a short reason string, never the credential itself.
      logger.warn(
        { reason: err instanceof Error ? err.message : "verify_failed" },
        "[auth] Apple native identity token verification failed",
      );
      res.status(401).json({
        error: "Login Apple tidak dapat diverifikasi. Silakan coba lagi.",
      });
      return;
    }

    try {
      await exchangeAppleAuthorizationCode(parsed.data.authorizationCode, profile.audience);
    } catch (err) {
      logger.warn(
        { reason: err instanceof Error ? err.message : "exchange_failed" },
        "[auth] Apple authorization code exchange failed",
      );
      res.status(401).json({
        error: "Login Apple tidak dapat diverifikasi. Silakan coba lagi.",
      });
      return;
    }

    let user: typeof users.$inferSelect;
    let isNewUser: boolean;
    try {
      ({ user, isNewUser } = await resolveAppleUser(profile, {
        givenName: parsed.data.givenName ?? null,
        familyName: parsed.data.familyName ?? null,
      }));
    } catch (err) {
      if (err instanceof AppleAccountConflictError) {
        res.status(409).json({
          error: "Email ini sudah tertaut ke akun Apple lain.",
        });
        return;
      }
      if (err instanceof AppleAccountUnavailableError) {
        res.status(401).json({
          error: "Login Apple tidak dapat diverifikasi. Silakan coba lagi.",
        });
        return;
      }
      logger.error({ err }, "[auth] Apple native user upsert failed");
      res.status(500).json({ error: "Terjadi kesalahan. Silakan coba lagi." });
      return;
    }

    const token = generateToken();
    const expiresAt = getSessionExpiry(true);
    await createSingleSession(user.id, token, expiresAt);

    if (isNewUser) void notifyAdminsUserCreated(user.displayName);
    void notifyLoginAlert(user.id);

    res.json({ token, user: serializeUser(user) });
  },
);

// Re-authentication for sensitive operations on an Apple-only account —
// same purpose and same consumer (DELETE /auth/account) as
// POST /auth/reauth/google above, just proven with a fresh Apple identity
// token + authorization code instead of a fresh Google ID token. The two
// providers share the same `reauthLimiter` and the same underlying
// reauth_tokens table/purpose; a token this issues can only ever be
// consumed by the same userId it was issued to, so a Google reauth token
// can't authenticate an Apple account's deletion or vice versa.
const appleReauthSchema = z
  .object({
    identityToken: z.string().min(1, "identityToken wajib diisi").max(8000),
    authorizationCode: z.string().min(1, "authorizationCode wajib diisi").max(2048),
    nonce: z.string().min(1, "nonce wajib diisi").max(512),
  })
  .strict();

router.post(
  "/auth/reauth/apple",
  requireAuth,
  reauthLimiter,
  async (req: AuthRequest, res) => {
    if (!isNativeAppleConfigured()) {
      res.status(503).json({ error: "Verifikasi Apple belum dikonfigurasi." });
      return;
    }
    const parsed = appleReauthSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Permintaan tidak valid." });
      return;
    }

    const [user] = await db
      .select({ id: users.id, appleId: users.appleId })
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    if (!user) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }

    let profile;
    try {
      profile = await verifyAppleIdentityToken(parsed.data.identityToken, parsed.data.nonce);
    } catch {
      res.status(401).json({
        error: "Verifikasi Apple gagal. Silakan coba lagi.",
      });
      return;
    }

    try {
      await exchangeAppleAuthorizationCode(parsed.data.authorizationCode, profile.audience);
    } catch {
      res.status(401).json({
        error: "Verifikasi Apple gagal. Silakan coba lagi.",
      });
      return;
    }

    // The fresh token must belong to the SAME Apple identity as the
    // signed-in account — unlike Google, never fall back to matching by
    // email here: an account with no apple_id yet has nothing to reauth
    // *as* Apple in the first place.
    if (!user.appleId || user.appleId !== profile.appleId) {
      res.status(401).json({
        error: "Akun Apple tidak cocok dengan akun yang sedang masuk.",
      });
      return;
    }

    const { token, expiresAt } = await issueReauthToken(
      user.id,
      "delete_account",
    );
    res.json({ reauthToken: token, expiresAt: expiresAt.toISOString() });
  },
);

router.post("/auth/logout", requireAuth, async (req: AuthRequest, res) => {
  const token = req.sessionToken;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  res.clearCookie("session_token");
  res.json({ message: "Berhasil logout" });
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, req.userId!))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }

  res.json(serializeUser(user));
});

const profileUpdateSchema = z
  .object({
    displayName: z
      .string()
      .min(1, "Nama wajib diisi")
      .max(80, "Nama terlalu panjang")
      .optional(),
    selectedMode: z
      .enum(["beginner", "pro"], {
        errorMap: () => ({ message: "Mode harus 'beginner' atau 'pro'" }),
      })
      .optional(),
    themePreference: z
      .enum(["light", "dark"], {
        errorMap: () => ({ message: "Tema harus 'light' atau 'dark'" }),
      })
      .optional(),
    onboardingCompleted: z
      .boolean({ invalid_type_error: "onboardingCompleted harus boolean" })
      .optional(),
    lang: z
      .enum(["en", "id"], {
        errorMap: () => ({ message: "Bahasa harus 'en' atau 'id'" }),
      })
      .optional(),
    // Only accept canonical object paths issued by our upload flow
    // (`/objects/uploads/<uuid>`) or `null` to clear. Without this whitelist,
    // a caller could point `avatarUrl` at any object key — including someone
    // else's upload or an attacker-uploaded HTML payload from a different
    // prefix — and have the app render it as their profile photo.
    avatarUrl: z
      .string({ invalid_type_error: "Avatar tidak valid" })
      .regex(
        /^\/objects\/uploads\/[A-Za-z0-9_-]{8,64}$/,
        "URL avatar tidak valid"
      )
      .nullable()
      .optional(),
  })
  .strict();

router.patch("/auth/profile", requireAuth, async (req: AuthRequest, res) => {
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res.status(400).json({ error: first?.message ?? "Data profil tidak valid" });
    return;
  }
  const { displayName, selectedMode, themePreference, onboardingCompleted, lang, avatarUrl } =
    parsed.data;

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (displayName !== undefined) updateData["displayName"] = displayName;
  if (selectedMode !== undefined) updateData["selectedMode"] = selectedMode;
  if (themePreference !== undefined) updateData["themePreference"] = themePreference;
  if (onboardingCompleted !== undefined) updateData["onboardingCompleted"] = onboardingCompleted;
  if (lang !== undefined) updateData["lang"] = lang;
  if (avatarUrl !== undefined) updateData["avatarUrl"] = avatarUrl;

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, req.userId!))
    .returning();

  res.json(serializeUser(updated));
});

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ invalid_type_error: "Password lama wajib diisi" })
      .min(1, "Password lama wajib diisi"),
    newPassword: z
      .string({ invalid_type_error: "Password baru minimal 6 karakter" })
      .min(6, "Password baru minimal 6 karakter"),
  })
  .strict();

router.patch("/auth/password", requireAuth, async (req: AuthRequest, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res
      .status(400)
      .json({ error: first?.message ?? "Password lama dan baru wajib diisi" });
    return;
  }
  const { currentPassword, newPassword } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, req.userId!))
    .limit(1);

  if (!user.passwordHash) {
    res.status(400).json({
      error: "Akun Google tidak memiliki password untuk diubah.",
    });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Password lama salah" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, req.userId!));

  void notifyCriticalSecurityEvent(req.userId!, "password_changed");

  res.json({ message: "Password berhasil diubah" });
});

const changeSecurityQuestionSchema = z
  .object({
    currentPassword: z
      .string({ invalid_type_error: "Semua field wajib diisi" })
      .min(1, "Semua field wajib diisi"),
    securityQuestion: z
      .string({ invalid_type_error: "Pertanyaan keamanan tidak valid" })
      .refine(
        (v) => SECURITY_QUESTIONS.includes(v),
        "Pertanyaan keamanan tidak valid"
      ),
    securityAnswer: z
      .string({ invalid_type_error: "Semua field wajib diisi" })
      .min(1, "Semua field wajib diisi"),
  })
  .strict();

router.patch("/auth/security-question", requireAuth, async (req: AuthRequest, res) => {
  const parsed = changeSecurityQuestionSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res
      .status(400)
      .json({ error: first?.message ?? "Semua field wajib diisi" });
    return;
  }
  const { currentPassword, securityQuestion, securityAnswer } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, req.userId!))
    .limit(1);

  if (!user.passwordHash) {
    res.status(400).json({
      error:
        "Akun Google tidak menggunakan pertanyaan keamanan. Kelola akun lewat Google.",
    });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Password salah" });
    return;
  }

  const securityAnswerHash = await bcrypt.hash(
    securityAnswer.toLowerCase().trim(),
    12
  );

  await db
    .update(users)
    .set({ securityQuestion, securityAnswerHash, updatedAt: new Date() })
    .where(eq(users.id, req.userId!));

  void notifyCriticalSecurityEvent(req.userId!, "security_question_changed");

  res.json({ message: "Pertanyaan keamanan berhasil diubah" });
});

const forgotPasswordQuestionSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

const forgotPasswordVerifySchema = z.object({
  email: z.string().email("Format email tidak valid"),
  securityAnswer: z.string().min(1, "Jawaban keamanan wajib diisi"),
});

const forgotPasswordResetSchema = z.object({
  resetToken: z.string().min(1, "Token wajib diisi"),
  newPassword: z.string().min(6, "Password minimal 6 karakter"),
});

router.post("/auth/forgot-password/question", forgotPasswordQuestionLimiter, async (req, res) => {
  const parsed = forgotPasswordQuestionSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res.status(400).json({ error: first?.message ?? "Email wajib diisi" });
    return;
  }
  const { email } = parsed.data;

  const [user] = await db
    .select({ id: users.id, securityQuestion: users.securityQuestion })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  res.json({
    // Fall back to a canonical question for both "no such user" and
    // "Google account with no security question" so neither is
    // distinguishable from a real password account.
    securityQuestion: user?.securityQuestion ?? SECURITY_QUESTIONS[0],
    email: email.toLowerCase(),
  });
});

router.post("/auth/forgot-password/verify", forgotPasswordVerifyLimiter, async (req, res) => {
  const parsed = forgotPasswordVerifySchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res.status(400).json({ error: first?.message ?? "Email dan jawaban wajib diisi" });
    return;
  }
  const { email, securityAnswer } = parsed.data;

  const [user] = await db
    .select({
      id: users.id,
      securityAnswerHash: users.securityAnswerHash,
      resetLockedUntil: users.resetLockedUntil,
    })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  const INVALID_MSG = "Jawaban keamanan tidak valid";

  // Indistinguishable failure modes — every "deny" branch returns the
  // same 401 + INVALID_MSG with no Retry-After header and runs (or
  // mimics) a bcrypt operation for timing parity. This prevents an
  // attacker who rotates IPs from telling apart:
  //   (a) unknown email,
  //   (b) existing email + wrong answer,
  //   (c) existing email + correct answer but currently locked.
  // Without this parity, a 429+Retry-After on (c) would leak which
  // emails belong to real accounts — exactly the channel the IP limiter
  // bypass would otherwise enable.
  if (!user) {
    // Use the same operation (compare) and same bcrypt cost (12) as the
    // wrong-answer branch below, so an attacker rotating IPs can't tell
    // unknown-email apart from existing-email-wrong-answer by timing.
    await bcrypt.compare(securityAnswer, DUMMY_SECURITY_ANSWER_HASH);
    res.status(401).json({ error: INVALID_MSG });
    return;
  }

  // Google-OAuth account: no security-answer hash to match. Keep it
  // timing- and response-indistinguishable from the unknown-email and
  // wrong-answer branches so it doesn't leak that the email exists.
  if (!user.securityAnswerHash) {
    await bcrypt.compare(securityAnswer, DUMMY_SECURITY_ANSWER_HASH);
    res.status(401).json({ error: INVALID_MSG });
    return;
  }

  const now = new Date();

  if (user.resetLockedUntil && user.resetLockedUntil > now) {
    // Same parity reasoning as above: a locked existing account must
    // be timing-indistinguishable from both unknown-email and
    // existing-email-wrong-answer.
    await bcrypt.compare(securityAnswer, DUMMY_SECURITY_ANSWER_HASH);
    res.status(401).json({ error: INVALID_MSG });
    return;
  }

  const valid = await bcrypt.compare(
    securityAnswer.toLowerCase().trim(),
    user.securityAnswerHash
  );

  if (!valid) {
    // Atomic increment + conditional lockout, all evaluated in a
    // single UPDATE so concurrent wrong attempts can't lose updates
    // and bypass the threshold:
    //
    //   - If the previous lock window has just expired, the counter
    //     resets to 1 (this attempt) and the lock is cleared. Without
    //     this branch a stale `failed_reset_attempts >= threshold`
    //     would re-lock the account on the very first post-expiry
    //     typo.
    //   - Otherwise increment by one. When the new count reaches
    //     `MAX_FAILED_RESET_ATTEMPTS` we set `reset_locked_until` to
    //     `now + RESET_LOCKOUT_MS` so the next attempt hits the lock
    //     branch above (and gets the same generic 401 — see comment
    //     up top).
    const lockUntil = new Date(now.getTime() + RESET_LOCKOUT_MS);
    await db
      .update(users)
      .set({
        failedResetAttempts: sql`CASE
          WHEN ${users.resetLockedUntil} IS NOT NULL AND ${users.resetLockedUntil} <= NOW() THEN 1
          ELSE ${users.failedResetAttempts} + 1
        END`,
        resetLockedUntil: sql`CASE
          WHEN ${users.resetLockedUntil} IS NOT NULL AND ${users.resetLockedUntil} <= NOW() THEN NULL
          WHEN ${users.failedResetAttempts} + 1 >= ${MAX_FAILED_RESET_ATTEMPTS} THEN ${lockUntil}
          ELSE ${users.resetLockedUntil}
        END`,
        updatedAt: now,
      })
      .where(eq(users.id, user.id));

    res.status(401).json({ error: INVALID_MSG });
    return;
  }

  // Correct answer — clear any prior failure state before issuing the
  // reset token so the next reset cycle starts fresh.
  await db
    .update(users)
    .set({
      failedResetAttempts: 0,
      resetLockedUntil: null,
      updatedAt: now,
    })
    .where(eq(users.id, user.id));

  await db.delete(passwordResetTokens).where(
    eq(passwordResetTokens.userId, user.id)
  );

  const resetToken = generateToken();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token: resetToken,
    expiresAt,
  });

  res.json({ resetToken, message: "Jawaban benar. Silakan reset password." });
});

router.post("/auth/forgot-password/reset", forgotPasswordResetLimiter, async (req, res) => {
  const parsed = forgotPasswordResetSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res
      .status(400)
      .json({ error: first?.message ?? "Token dan password baru wajib diisi" });
    return;
  }
  const { resetToken, newPassword } = parsed.data;

  const [tokenRecord] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, resetToken),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!tokenRecord) {
    // Reset tokens are authentication credentials — invalid or expired
    // tokens are an authn failure (401), not a field-validation error (400).
    res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Reset brute-force tracking too — a successful password change
  // means the legitimate owner is back in control, so any prior
  // failure state is no longer relevant.
  await db
    .update(users)
    .set({
      passwordHash,
      failedResetAttempts: 0,
      resetLockedUntil: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, tokenRecord.userId));

  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, tokenRecord.id));

  await db
    .delete(sessions)
    .where(eq(sessions.userId, tokenRecord.userId));

  res.json({ message: "Password berhasil direset" });
});

// Store-readiness (P0): self-service account deletion. `DELETE /api/account`
// (recommended in the brief) is deliberately placed here as `/auth/account`
// instead of a standalone one-route router — every other account-lifecycle
// operation (register/login/logout/profile/password/security-question)
// already lives in this file, and this is one more of the same kind, not a
// new domain.
// Apple-only accounts reuse this same `reauthToken` branch: it's issued by
// POST /auth/reauth/apple (same purpose, same table, same consumeReauthToken
// call below) exactly like a Google-only account's token from
// POST /auth/reauth/google. Apple credential revocation
// (POST https://appleid.apple.com/auth/revoke) is intentionally NOT called
// here: it requires a stored Apple refresh token, and this codebase has no
// encrypted-at-rest secret storage to hold one safely yet (see
// lib/apple-oauth.ts's exchangeAppleAuthorizationCode, which deliberately
// discards the refresh_token Apple returns rather than persist it in
// plaintext). The user's own `apple_id` column is deleted along with the
// rest of the row below — there is no separate Apple identity/credential
// row left behind. Revocation should be added once encrypted secret
// storage exists; see the deployment notes for this blocker.
const deleteAccountSchema = z
  .object({
    // Which one is required depends on the account (enforced below):
    //  - password account       -> currentPassword
    //  - Google/Apple-only account -> reauthToken from
    //    POST /auth/reauth/google or POST /auth/reauth/apple
    currentPassword: z
      .string({ invalid_type_error: "Password tidak valid" })
      .min(1, "Password wajib diisi")
      .optional(),
    reauthToken: z
      .string({ invalid_type_error: "Token tidak valid" })
      .min(1)
      .optional(),
  })
  .strict();

router.delete(
  "/auth/account",
  requireAuth,
  accountDeletionLimiter,
  async (req: AuthRequest, res) => {
    const parsed = deleteAccountSchema.safeParse(req.body);
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      res.status(400).json({ error: first?.message ?? "Password wajib diisi" });
      return;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);

    // requireAuth already guarantees the row exists (it was just read to
    // populate req.userId/req.userRole), but a generic error here rather
    // than a crash keeps this endpoint's error surface consistent with
    // every other account route.
    if (!user) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }

    // Re-authentication proof. A live session alone is not enough to
    // delete an account.
    //  - password account   -> the current password
    //  - Google/Apple-only account -> a single-use reauthToken issued by
    //    POST /auth/reauth/google or POST /auth/reauth/apple after a
    //    fresh Google ID token / Apple identity token + authorization code
    if (user.passwordHash) {
      if (!parsed.data.currentPassword) {
        res.status(400).json({ error: "Password wajib diisi" });
        return;
      }
      const valid = await bcrypt.compare(
        parsed.data.currentPassword,
        user.passwordHash,
      );
      if (!valid) {
        res.status(401).json({ error: "Password salah" });
        return;
      }
    } else {
      if (!parsed.data.reauthToken) {
        res.status(400).json({
          error: "Verifikasi ulang diperlukan untuk menghapus akun Google.",
        });
        return;
      }
      const ok = await consumeReauthToken(
        user.id,
        "delete_account",
        parsed.data.reauthToken,
      );
      if (!ok) {
        res.status(401).json({
          error: "Verifikasi ulang tidak valid atau sudah kedaluwarsa.",
        });
        return;
      }
    }

    // Best-effort GCS cleanup of the user's avatar. Deliberately OUTSIDE
    // the DB transaction below and never allowed to fail the deletion —
    // an orphaned storage object is a minor cleanup issue, not a reason
    // to leave the account (and all its data) undeleted.
    if (user.avatarUrl) {
      try {
        const objectStorageService = new ObjectStorageService();
        await objectStorageService.deleteObjectEntity(user.avatarUrl);
      } catch (err) {
        if (!(err instanceof ObjectNotFoundError)) {
          logger.warn({ err, userId: user.id }, "Failed to delete avatar during account deletion");
        }
      }
    }

    // Every user-owned table references `users.id` with `onDelete:
    // "cascade"` (analyses, feedback, notifications, sessions,
    // push_subscriptions, native_push_devices, journal entries, watchlist,
    // filter presets, price alerts, daily digests, user tags, etc.) — a
    // single delete on the `users` row is sufficient to remove every
    // relation. `outbound_clicks`/`analytics_events` use `onDelete: "set
    // null"` instead, which is the intentional anonymize-not-delete
    // behavior for telemetry rows (no PII beyond a now-null user
    // reference). Wrapped in a transaction purely for atomicity with the
    // explicit push-channel deletes below (which are already covered by
    // cascade, but making them explicit here keeps the "what gets
    // removed" list self-documenting and immune to a future FK change
    // silently breaking cleanup).
    await db.transaction(async (tx) => {
      await tx.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, user.id));
      await tx.delete(nativePushDevices).where(eq(nativePushDevices.userId, user.id));
      await tx.delete(sessions).where(eq(sessions.userId, user.id));
      await tx.delete(users).where(eq(users.id, user.id));
    });

    res.clearCookie("session_token");

    void notifySuperAdminsUserDeleted(user.displayName).catch((err) => {
      logger.warn({ err, userId: user.id }, "Failed to notify admins of self-deletion");
    });

    res.json({ message: "Akun berhasil dihapus" });
  },
);

export default router;
