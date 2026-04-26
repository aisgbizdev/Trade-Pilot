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
import { eq, and, gt } from "drizzle-orm";
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
  })
  .strict();

router.patch("/auth/profile", requireAuth, async (req: AuthRequest, res) => {
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    res.status(400).json({ error: first?.message ?? "Data profil tidak valid" });
    return;
  }
  const { displayName, selectedMode, themePreference, onboardingCompleted } =
    parsed.data;

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (displayName !== undefined) updateData["displayName"] = displayName;
  if (selectedMode !== undefined) updateData["selectedMode"] = selectedMode;
  if (themePreference !== undefined) updateData["themePreference"] = themePreference;
  if (onboardingCompleted !== undefined) updateData["onboardingCompleted"] = onboardingCompleted;

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
    .select({ id: users.id, securityAnswerHash: users.securityAnswerHash })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  const INVALID_MSG = "Jawaban keamanan tidak valid";

  if (!user) {
    await bcrypt.hash("dummy_answer_to_prevent_timing_attack", 10);
    res.status(401).json({ error: INVALID_MSG });
    return;
  }

  const valid = await bcrypt.compare(
    securityAnswer.toLowerCase().trim(),
    user.securityAnswerHash
  );

  if (!valid) {
    res.status(401).json({ error: INVALID_MSG });
    return;
  }

  await db.delete(passwordResetTokens).where(
    eq(passwordResetTokens.userId, user.id)
  );

  const resetToken = generateToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

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

  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
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
