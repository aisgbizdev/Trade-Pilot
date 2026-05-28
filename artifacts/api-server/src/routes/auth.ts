import { Router } from "express";
import { notifyAdminsUserCreated } from "../lib/jobs";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db } from "../lib/db";
import {
  users,
  sessions,
  passwordResetTokens,
} from "@workspace/db/schema";
import { eq, and, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, AuthRequest } from "../middleware/auth";
import {
  forgotPasswordQuestionLimiter,
  forgotPasswordVerifyLimiter,
  loginLimiter,
  registerLimiter,
  forgotPasswordResetLimiter,
} from "../middleware/rate-limit";

const router = Router();

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
      selectedMode: selectedMode ?? "beginner",
      securityQuestion,
      securityAnswerHash,
    })
    .returning();

  const token = generateToken();
  const expiresAt = getSessionExpiry(rememberMe ?? false);

  await db.insert(sessions).values({
    userId: user.id,
    token,
    expiresAt,
  });

  res.cookie("session_token", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  void notifyAdminsUserCreated(user.displayName);

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      selectedMode: user.selectedMode,
      themePreference: user.themePreference,
      onboardingCompleted: user.onboardingCompleted,
    },
  });
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

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Email atau password salah" });
    return;
  }

  const token = generateToken();
  const expiresAt = getSessionExpiry(rememberMe ?? false);

  await db.insert(sessions).values({
    userId: user.id,
    token,
    expiresAt,
  });

  res.cookie("session_token", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      selectedMode: user.selectedMode,
      themePreference: user.themePreference,
      onboardingCompleted: user.onboardingCompleted,
    },
  });
});

router.post("/auth/logout", requireAuth, async (req: AuthRequest, res) => {
  const token = req.cookies?.["session_token"];
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

  res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    selectedMode: user.selectedMode,
    themePreference: user.themePreference,
    onboardingCompleted: user.onboardingCompleted,
  });
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
  })
  .strict();

router.patch("/auth/profile", requireAuth, async (req: AuthRequest, res) => {
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res.status(400).json({ error: first?.message ?? "Data profil tidak valid" });
    return;
  }
  const { displayName, selectedMode, themePreference, onboardingCompleted, lang } =
    parsed.data;

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (displayName !== undefined) updateData["displayName"] = displayName;
  if (selectedMode !== undefined) updateData["selectedMode"] = selectedMode;
  if (themePreference !== undefined) updateData["themePreference"] = themePreference;
  if (onboardingCompleted !== undefined) updateData["onboardingCompleted"] = onboardingCompleted;
  if (lang !== undefined) updateData["lang"] = lang;

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, req.userId!))
    .returning();

  res.json({
    id: updated.id,
    email: updated.email,
    displayName: updated.displayName,
    role: updated.role,
    selectedMode: updated.selectedMode,
    themePreference: updated.themePreference,
    onboardingCompleted: updated.onboardingCompleted,
  });
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
    securityQuestion: user ? user.securityQuestion : SECURITY_QUESTIONS[0],
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

export default router;
