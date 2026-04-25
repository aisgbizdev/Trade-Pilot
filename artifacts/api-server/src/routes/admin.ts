import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import {
  users,
  analyses,
  notifications,
} from "@workspace/db/schema";
import { eq, count, desc, sql } from "drizzle-orm";
import {
  requireAdmin,
  requireSuperAdmin,
  AuthRequest,
} from "../middleware/auth";

const router = Router();

router.get("/admin/stats", requireAdmin, async (req: AuthRequest, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalResult] = await db.select({ count: count(analyses.id) }).from(analyses);
  const [todayResult] = await db
    .select({ count: count(analyses.id) })
    .from(analyses)
    .where(sql`${analyses.createdAt} >= ${todayStart}`);
  const [weekResult] = await db
    .select({ count: count(analyses.id) })
    .from(analyses)
    .where(sql`${analyses.createdAt} >= ${weekStart}`);
  const [monthResult] = await db
    .select({ count: count(analyses.id) })
    .from(analyses)
    .where(sql`${analyses.createdAt} >= ${monthStart}`);

  const [totalUsers] = await db.select({ count: count(users.id) }).from(users);

  const instrumentBreakdown = await db
    .select({
      instrument: analyses.instrument,
      count: count(analyses.id),
    })
    .from(analyses)
    .groupBy(analyses.instrument)
    .orderBy(desc(count(analyses.id)))
    .limit(10);

  const modeBreakdownRaw = await db
    .select({
      mode: analyses.mode,
      count: count(analyses.id),
    })
    .from(analyses)
    .groupBy(analyses.mode);

  const modeBreakdown: { beginner: number; pro: number } = { beginner: 0, pro: 0 };
  for (const row of modeBreakdownRaw) {
    if (row.mode === "beginner") modeBreakdown.beginner = Number(row.count);
    if (row.mode === "pro") modeBreakdown.pro = Number(row.count);
  }

  res.json({
    total: Number(totalResult.count),
    today: Number(todayResult.count),
    thisWeek: Number(weekResult.count),
    thisMonth: Number(monthResult.count),
    totalUsers: Number(totalUsers.count),
    instrumentBreakdown,
    modeBreakdown,
  });
});

router.get("/admin/analyses", requireAdmin, async (req: AuthRequest, res) => {
  const page = Number(req.query["page"] ?? 1);
  const limit = Number(req.query["limit"] ?? 20);
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      id: analyses.id,
      userId: analyses.userId,
      userEmail: users.email,
      instrument: analyses.instrument,
      timeframe: analyses.timeframe,
      mode: analyses.mode,
      marketCondition: analyses.marketCondition,
      riskLevel: analyses.riskLevel,
      confidenceMin: analyses.confidenceMin,
      confidenceMax: analyses.confidenceMax,
      validUntil: analyses.validUntil,
      createdAt: analyses.createdAt,
    })
    .from(analyses)
    .innerJoin(users, eq(analyses.userId, users.id))
    .orderBy(desc(analyses.createdAt))
    .limit(limit)
    .offset(offset);

  const [total] = await db.select({ count: count(analyses.id) }).from(analyses);

  res.json({
    analyses: rows,
    total: Number(total.count),
    page,
    limit,
  });
});

router.post("/admin/notifications", requireAdmin, async (req: AuthRequest, res) => {
  const { title, message, type, targetRole } = req.body;

  if (!title || !message) {
    res.status(400).json({ error: "Judul dan pesan wajib diisi" });
    return;
  }

  let targetUsers = await db.select({ id: users.id }).from(users);

  if (targetRole && targetRole !== "all") {
    const rows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, targetRole));
    targetUsers = rows;
  }

  if (targetUsers.length === 0) {
    res.json({ message: "Tidak ada user yang menjadi target", count: 0 });
    return;
  }

  await db.insert(notifications).values(
    targetUsers.map((u) => ({
      userId: u.id,
      targetRole: (targetRole && targetRole !== "all") ? targetRole : null,
      title,
      message,
      type: type ?? "info",
    }))
  );

  res.json({ message: "Broadcast berhasil dikirim", count: targetUsers.length });
});

router.get("/superadmin/users", requireSuperAdmin, async (req: AuthRequest, res) => {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      selectedMode: users.selectedMode,
      onboardingCompleted: users.onboardingCompleted,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  res.json({ users: rows });
});

router.post("/superadmin/users", requireSuperAdmin, async (req: AuthRequest, res) => {
  const {
    email,
    password,
    displayName,
    role,
    selectedMode,
    securityQuestion,
    securityAnswer,
  } = req.body;

  if (!email || !password || !displayName || !securityQuestion || !securityAnswer) {
    res.status(400).json({ error: "Semua field wajib diisi" });
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
      role: role ?? "user",
      selectedMode: selectedMode ?? "beginner",
      securityQuestion,
      securityAnswerHash,
    })
    .returning({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      selectedMode: users.selectedMode,
      createdAt: users.createdAt,
    });

  res.status(201).json(user);
});

router.delete("/superadmin/users/:id", requireSuperAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);

  if (id === req.userId) {
    res.status(400).json({ error: "Tidak bisa menghapus akun sendiri" });
    return;
  }

  const [deleted] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });

  if (!deleted) {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }

  res.json({ message: "User berhasil dihapus" });
});

router.patch("/superadmin/users/:id/password", requireSuperAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: "Password baru minimal 6 karakter" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const [updated] = await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning({ id: users.id });

  if (!updated) {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }

  res.json({ message: "Password berhasil direset" });
});

router.patch("/superadmin/users/:id/role", requireSuperAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);
  const { role } = req.body;

  if (!["user", "admin", "super_admin"].includes(role)) {
    res.status(400).json({ error: "Role tidak valid" });
    return;
  }

  if (id === req.userId) {
    res.status(400).json({ error: "Tidak bisa mengubah role sendiri" });
    return;
  }

  const [updated] = await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning({ id: users.id, role: users.role });

  if (!updated) {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }

  res.json(updated);
});

export default router;
