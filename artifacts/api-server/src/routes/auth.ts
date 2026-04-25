import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db } from "../lib/db";
import {
  users,
  sessions,
  passwordResetTokens,
} from "@workspace/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const SECURITY_QUESTIONS = [
  "Nama hewan peliharaan pertama kamu?",
  "Nama kota tempat kamu lahir?",
  "Nama ibu kandung kamu?",
  "Nama sekolah dasar kamu?",
  "Nama teman terbaik masa kecil kamu?",
];

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function getSessionExpiry(rememberMe: boolean): Date {
  const ms = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

router.post("/auth/register", async (req, res) => {
  const { email, password, displayName, selectedMode, securityQuestion, securityAnswer, rememberMe } =
    req.body;

  if (!email || !password || !displayName || !securityQuestion || !securityAnswer) {
    res.status(400).json({ error: "Semua field wajib diisi" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Password minimal 6 karakter" });
    return;
  }

  if (!SECURITY_QUESTIONS.includes(securityQuestion)) {
    res.status(400).json({ error: "Pertanyaan keamanan tidak valid" });
    return;
  }

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

router.post("/auth/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email dan password wajib diisi" });
    return;
  }

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

router.patch("/auth/profile", requireAuth, async (req: AuthRequest, res) => {
  const { displayName, selectedMode, themePreference, onboardingCompleted } = req.body;

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

router.patch("/auth/password", requireAuth, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Password lama dan baru wajib diisi" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: "Password baru minimal 6 karakter" });
    return;
  }

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

router.patch("/auth/security-question", requireAuth, async (req: AuthRequest, res) => {
  const { currentPassword, securityQuestion, securityAnswer } = req.body;

  if (!currentPassword || !securityQuestion || !securityAnswer) {
    res.status(400).json({ error: "Semua field wajib diisi" });
    return;
  }

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

router.post("/auth/forgot-password/question", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email wajib diisi" });
    return;
  }

  const [user] = await db
    .select({ id: users.id, securityQuestion: users.securityQuestion })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "Email tidak ditemukan" });
    return;
  }

  res.json({
    securityQuestion: user.securityQuestion,
    email: email.toLowerCase(),
  });
});

router.post("/auth/forgot-password/verify", async (req, res) => {
  const { email, securityAnswer } = req.body;

  if (!email || !securityAnswer) {
    res.status(400).json({ error: "Email dan jawaban wajib diisi" });
    return;
  }

  const [user] = await db
    .select({ id: users.id, securityAnswerHash: users.securityAnswerHash })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "Email tidak ditemukan" });
    return;
  }

  const valid = await bcrypt.compare(
    securityAnswer.toLowerCase().trim(),
    user.securityAnswerHash
  );

  if (!valid) {
    res.status(401).json({ error: "Jawaban keamanan salah" });
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

router.post("/auth/forgot-password/reset", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    res.status(400).json({ error: "Token dan password baru wajib diisi" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: "Password minimal 6 karakter" });
    return;
  }

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
    res.status(400).json({ error: "Token tidak valid atau sudah kadaluarsa" });
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
