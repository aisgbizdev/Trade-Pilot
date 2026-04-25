import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import {
  users,
  analyses,
  notifications,
  userTags,
  broadcasts,
} from "@workspace/db/schema";
import { eq, and, count, desc, sql, ilike, or, inArray } from "drizzle-orm";
import {
  requireAdmin,
  requireSuperAdmin,
  AuthRequest,
} from "../middleware/auth";
import { notifySuperAdminsUserDeleted, notifyAdminsUserCreated } from "../lib/jobs";
import { sendPushToUsers } from "../lib/webpush";
import { notificationsEmitter } from "../lib/notifications-emitter";

type AudienceType = "all" | "role" | "tag";
type Role = "user" | "admin" | "super_admin";

const router = Router();

router.get("/admin/stats", requireAdmin, async (req: AuthRequest, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

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
  const [usersTodayResult] = await db
    .select({ count: count(users.id) })
    .from(users)
    .where(sql`${users.createdAt} >= ${todayStart}`);

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
    totalUsersToday: Number(usersTodayResult.count),
    totalAnalysesToday: Number(todayResult.count),
    totalAnalysesThisWeek: Number(weekResult.count),
    totalAnalysesThisMonth: Number(monthResult.count),
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

router.post("/admin/notifications", requireSuperAdmin, async (req: AuthRequest, res) => {
  const { title, message, type, audienceType, audienceValue, targetRole } = req.body as {
    title?: string;
    message?: string;
    type?: "info" | "warning" | "error";
    audienceType?: AudienceType;
    audienceValue?: string | null;
    targetRole?: Role | "all" | null;
  };

  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  const trimmedMessage = typeof message === "string" ? message.trim() : "";
  if (!trimmedTitle || !trimmedMessage) {
    res.status(400).json({ error: "Judul dan pesan wajib diisi" });
    return;
  }

  if (audienceType !== undefined && !["all", "role", "tag"].includes(audienceType)) {
    res.status(400).json({ error: "audienceType tidak valid" });
    return;
  }

  if (type !== undefined && !["info", "warning", "error"].includes(type)) {
    res.status(400).json({ error: "type tidak valid" });
    return;
  }

  // Resolve audience (back-compat with legacy `targetRole`).
  let resolvedType: AudienceType = audienceType ?? "all";
  let resolvedValue: string | null =
    typeof audienceValue === "string" ? audienceValue.trim() || null : audienceValue ?? null;
  if (!audienceType && targetRole) {
    if (targetRole === "all") {
      resolvedType = "all";
      resolvedValue = null;
    } else {
      resolvedType = "role";
      resolvedValue = targetRole;
    }
  }

  if (resolvedType !== "all" && !resolvedValue) {
    res.status(400).json({ error: "audienceValue wajib diisi untuk role/tag" });
    return;
  }

  if (resolvedType === "role" && !["user", "admin", "super_admin"].includes(resolvedValue!)) {
    res.status(400).json({ error: "Role tidak valid" });
    return;
  }

  // Resolve target user list per audience.
  let targetUsers: { id: number; pushBroadcast: boolean }[];
  if (resolvedType === "all") {
    targetUsers = await db
      .select({ id: users.id, pushBroadcast: users.pushBroadcast })
      .from(users);
  } else if (resolvedType === "role") {
    targetUsers = await db
      .select({ id: users.id, pushBroadcast: users.pushBroadcast })
      .from(users)
      .where(eq(users.role, resolvedValue as Role));
  } else {
    // tag
    const rows = await db
      .select({ id: users.id, pushBroadcast: users.pushBroadcast })
      .from(users)
      .innerJoin(userTags, eq(userTags.userId, users.id))
      .where(eq(userTags.tag, resolvedValue!));
    targetUsers = rows;
  }

  // Always record the broadcast in history, even when zero recipients.
  const [broadcastRow] = await db
    .insert(broadcasts)
    .values({
      senderId: req.userId ?? null,
      title: trimmedTitle,
      message: trimmedMessage,
      audienceType: resolvedType,
      audienceValue: resolvedValue,
      recipientCount: targetUsers.length,
    })
    .returning({ id: broadcasts.id });

  if (targetUsers.length === 0) {
    res.status(201).json({
      broadcastId: broadcastRow.id,
      recipientCount: 0,
      message: "Tidak ada user yang menjadi target",
    });
    return;
  }

  await db.insert(notifications).values(
    targetUsers.map((u) => ({
      userId: u.id,
      targetRole: resolvedType === "role" ? (resolvedValue as Role) : null,
      title: trimmedTitle,
      message: trimmedMessage,
      type: type ?? "info",
    })),
  );

  const broadcastNowIso = new Date().toISOString();
  for (const u of targetUsers) {
    notificationsEmitter.emitForUser(u.id, {
      title: trimmedTitle,
      message: trimmedMessage,
      type: type ?? "info",
      createdAt: broadcastNowIso,
    });
  }

  // Honor per-user push preferences: only push to users who haven't opted out
  // of broadcasts. The in-app notification is still inserted for everyone.
  const pushTargets = targetUsers.filter((u) => u.pushBroadcast !== false).map((u) => u.id);

  sendPushToUsers(
    pushTargets,
    { title: trimmedTitle, body: trimmedMessage, url: "/notifications", tag: "broadcast" },
  ).catch((err) => {
    // Log but never let push delivery failures break the broadcast response.
    // Errors here are operational (transient transport, bad endpoint), not auth.
    console.warn("Broadcast push delivery failed", err);
  });

  res.status(201).json({
    broadcastId: broadcastRow.id,
    recipientCount: targetUsers.length,
    message: "Broadcast berhasil dikirim",
  });
});

router.get("/admin/broadcasts", requireSuperAdmin, async (req: AuthRequest, res) => {
  const page = Math.max(1, Number(req.query["page"] ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query["limit"] ?? 20)));
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      id: broadcasts.id,
      senderId: broadcasts.senderId,
      senderName: users.displayName,
      title: broadcasts.title,
      message: broadcasts.message,
      audienceType: broadcasts.audienceType,
      audienceValue: broadcasts.audienceValue,
      recipientCount: broadcasts.recipientCount,
      createdAt: broadcasts.createdAt,
    })
    .from(broadcasts)
    .leftJoin(users, eq(users.id, broadcasts.senderId))
    .orderBy(desc(broadcasts.createdAt))
    .limit(limit)
    .offset(offset);

  const [total] = await db.select({ count: count(broadcasts.id) }).from(broadcasts);

  res.json({
    broadcasts: rows,
    total: Number(total.count),
    page,
    limit,
  });
});

router.get("/superadmin/users", requireSuperAdmin, async (req: AuthRequest, res) => {
  const search = String(req.query["search"] ?? "").trim();
  const rawPage = Number(req.query["page"] ?? 1);
  const rawLimit = Number(req.query["limit"] ?? 50);
  const page = Number.isFinite(rawPage) ? Math.max(1, Math.floor(rawPage)) : 1;
  const limit = Number.isFinite(rawLimit)
    ? Math.min(200, Math.max(1, Math.floor(rawLimit)))
    : 50;
  const offset = (page - 1) * limit;

  const searchClause = search
    ? or(ilike(users.email, `%${search}%`), ilike(users.displayName, `%${search}%`))
    : undefined;

  const baseQuery = db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      selectedMode: users.selectedMode,
      onboardingCompleted: users.onboardingCompleted,
      createdAt: users.createdAt,
      analysisCount: count(analyses.id),
    })
    .from(users)
    .leftJoin(analyses, eq(analyses.userId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  const rows = await (searchClause ? baseQuery.where(searchClause) : baseQuery);

  // Fetch tags for the returned users in a single query, then group in memory.
  const userIds = rows.map((r) => r.id);
  const tagRows = userIds.length
    ? await db
        .select({ userId: userTags.userId, tag: userTags.tag })
        .from(userTags)
        .where(inArray(userTags.userId, userIds))
        .orderBy(userTags.tag)
    : [];
  const tagsByUser = new Map<number, string[]>();
  for (const r of tagRows) {
    const arr = tagsByUser.get(r.userId) ?? [];
    arr.push(r.tag);
    tagsByUser.set(r.userId, arr);
  }

  const totalQuery = db.select({ count: count(users.id) }).from(users);
  const [total] = await (searchClause ? totalQuery.where(searchClause) : totalQuery);

  res.json({
    users: rows.map((u) => ({ ...u, tags: tagsByUser.get(u.id) ?? [] })),
    total: Number(total.count),
    page,
    limit,
  });
});

router.get("/superadmin/tags", requireSuperAdmin, async (_req: AuthRequest, res) => {
  const rows = await db
    .selectDistinct({ tag: userTags.tag })
    .from(userTags)
    .orderBy(userTags.tag);
  res.json({ tags: rows.map((r) => r.tag) });
});

const TAG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 _.-]{0,39}$/;

router.get("/superadmin/users/:id/tags", requireSuperAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "ID tidak valid" });
    return;
  }
  const [target] = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);
  if (!target) {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }
  const rows = await db
    .select({ tag: userTags.tag })
    .from(userTags)
    .where(eq(userTags.userId, id))
    .orderBy(userTags.tag);
  res.json({ tags: rows.map((r) => r.tag) });
});

router.post("/superadmin/users/:id/tags", requireSuperAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);
  const tagRaw = String((req.body?.tag ?? "")).trim();
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "ID tidak valid" });
    return;
  }
  if (!tagRaw || !TAG_PATTERN.test(tagRaw)) {
    res.status(400).json({ error: "Tag tidak valid" });
    return;
  }

  const [target] = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);
  if (!target) {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }

  await db
    .insert(userTags)
    .values({ userId: id, tag: tagRaw })
    .onConflictDoNothing();

  const tags = await db
    .select({ tag: userTags.tag })
    .from(userTags)
    .where(eq(userTags.userId, id))
    .orderBy(userTags.tag);

  res.json({ tags: tags.map((t) => t.tag) });
});

router.delete(
  "/superadmin/users/:id/tags/:tag",
  requireSuperAdmin,
  async (req: AuthRequest, res) => {
    const id = Number(req.params["id"]);
    const tag = String(req.params["tag"] ?? "");
    if (!Number.isFinite(id) || !tag) {
      res.status(400).json({ error: "Parameter tidak valid" });
      return;
    }

    await db
      .delete(userTags)
      .where(and(eq(userTags.userId, id), eq(userTags.tag, tag)));

    const tags = await db
      .select({ tag: userTags.tag })
      .from(userTags)
      .where(eq(userTags.userId, id))
      .orderBy(userTags.tag);

    res.json({ tags: tags.map((t) => t.tag) });
  },
);

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

  void notifyAdminsUserCreated(user.displayName);

  res.status(201).json(user);
});

router.delete("/superadmin/users/:id", requireSuperAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);

  if (id === req.userId) {
    res.status(400).json({ error: "Tidak bisa menghapus akun sendiri" });
    return;
  }

  const [target] = await db
    .select({ id: users.id, displayName: users.displayName })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!target) {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }

  await db.delete(users).where(eq(users.id, id));

  void notifySuperAdminsUserDeleted(target.displayName);

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
