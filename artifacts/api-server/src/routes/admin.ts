import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import {
  users,
  analyses,
  notifications,
  userTags,
  broadcasts,
  feedback,
  outboundClicks,
} from "@workspace/db/schema";
import { eq, and, count, desc, sql, ilike, or, inArray, gte, lte } from "drizzle-orm";
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

// Per-process advisory-lock namespace used to serialize any operation that
// could reduce the number of super_admins. Combined with a count(*) check
// inside the same transaction, this prevents two concurrent peer demotes /
// deletes from racing the count down to zero. See pg_advisory_xact_lock.
const SUPER_ADMIN_GUARD_LOCK = 0x5a5ad317;

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

router.get(
  "/admin/outbound-clicks/stats",
  requireAdmin,
  async (req: AuthRequest, res) => {
    // Window is clamped (1..365) so a typo'd `?days=-1` or `?days=999999`
    // can't return an empty / oversized window. Default 30 matches the
    // "monthly partner report" cadence we expect SOLID PRIME to ask for.
    const rawDays = Number(req.query["days"] ?? 30);
    const windowDays = Number.isFinite(rawDays)
      ? Math.min(365, Math.max(1, Math.floor(rawDays)))
      : 30;
    const windowStart = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    const [{ count: allTime }] = await db
      .select({ count: count(outboundClicks.id) })
      .from(outboundClicks);

    const [{ count: inWindow }] = await db
      .select({ count: count(outboundClicks.id) })
      .from(outboundClicks)
      .where(gte(outboundClicks.createdAt, windowStart));

    const byPlacementRaw = await db
      .select({
        placement: outboundClicks.placement,
        target: outboundClicks.target,
        count: count(outboundClicks.id),
      })
      .from(outboundClicks)
      .where(gte(outboundClicks.createdAt, windowStart))
      .groupBy(outboundClicks.placement, outboundClicks.target)
      .orderBy(desc(count(outboundClicks.id)));

    const byTargetRaw = await db
      .select({
        target: outboundClicks.target,
        count: count(outboundClicks.id),
      })
      .from(outboundClicks)
      .where(gte(outboundClicks.createdAt, windowStart))
      .groupBy(outboundClicks.target)
      .orderBy(desc(count(outboundClicks.id)));

    res.json({
      windowDays,
      totalAllTime: Number(allTime),
      totalInWindow: Number(inWindow),
      byPlacement: byPlacementRaw.map((r) => ({
        placement: r.placement,
        target: r.target,
        count: Number(r.count),
      })),
      byTarget: byTargetRaw.map((r) => ({
        target: r.target,
        count: Number(r.count),
      })),
    });
  },
);

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

  // Aggregate feedback counts for the current page in a single grouped query
  // so the response stays O(1) instead of O(N) follow-up queries.
  const ids = rows.map((r) => r.id);
  const counts =
    ids.length > 0
      ? await db
          .select({
            analysisId: feedback.analysisId,
            usefulCount: sql<number>`COUNT(*) FILTER (WHERE ${feedback.feedbackType} = 'useful')`,
            notUsefulCount: sql<number>`COUNT(*) FILTER (WHERE ${feedback.feedbackType} = 'not_useful')`,
          })
          .from(feedback)
          .where(inArray(feedback.analysisId, ids))
          .groupBy(feedback.analysisId)
      : [];
  const countMap = new Map(
    counts.map((c) => [c.analysisId, c]),
  );
  const rowsWithCounts = rows.map((r) => {
    const c = countMap.get(r.id);
    return {
      ...r,
      usefulCount: Number(c?.usefulCount ?? 0),
      notUsefulCount: Number(c?.notUsefulCount ?? 0),
    };
  });

  const [total] = await db.select({ count: count(analyses.id) }).from(analyses);

  res.json({
    analyses: rowsWithCounts,
    total: Number(total.count),
    page,
    limit,
  });
});

router.get("/admin/feedback", requireAdmin, async (req: AuthRequest, res) => {
  // Pagination is clamped the same way as /superadmin/users so a hostile or
  // typo'd `?page=-5&limit=99999` query can never blow up the database.
  const rawPage = Number(req.query["page"] ?? 1);
  const rawLimit = Number(req.query["limit"] ?? 50);
  const page = Number.isFinite(rawPage) ? Math.max(1, Math.floor(rawPage)) : 1;
  const limit = Number.isFinite(rawLimit)
    ? Math.min(200, Math.max(1, Math.floor(rawLimit)))
    : 50;
  const offset = (page - 1) * limit;

  // Server-side filters. All optional, all stack with AND. Free-text `search`
  // ILIKEs over the joined user email and analysis instrument so an admin can
  // find "everything from foo@bar" or "everything on EURUSD". Date range is
  // inclusive on both ends; `to` snaps to end-of-day so a same-day from/to
  // still matches rows from later in that day. `analysisId` is the drill-down
  // target the analysis-list page links to (?analysisId=N) — bad input
  // collapses to "no filter" rather than returning an error.
  const search = String(req.query["search"] ?? "").trim();
  const feedbackTypeRaw = String(req.query["feedbackType"] ?? "").trim();
  const fromRaw = String(req.query["from"] ?? "").trim();
  const toRaw = String(req.query["to"] ?? "").trim();

  const rawAnalysisId = req.query["analysisId"];
  const parsedAnalysisId =
    rawAnalysisId !== undefined ? Number(rawAnalysisId) : NaN;
  const analysisIdFilter =
    Number.isFinite(parsedAnalysisId) && parsedAnalysisId > 0
      ? Math.floor(parsedAnalysisId)
      : undefined;

  const conditions: NonNullable<ReturnType<typeof and>>[] = [];

  if (search) {
    // Drizzle parameterizes %…% safely; we don't need to escape % or _ here
    // because admins typing "foo_bar@x.com" expect substring semantics.
    const pattern = `%${search}%`;
    const clause = or(ilike(users.email, pattern), ilike(analyses.instrument, pattern));
    if (clause) conditions.push(clause);
  }

  if (feedbackTypeRaw === "useful" || feedbackTypeRaw === "not_useful") {
    conditions.push(eq(feedback.feedbackType, feedbackTypeRaw));
  }

  if (fromRaw) {
    const fromDate = new Date(fromRaw);
    if (!Number.isNaN(fromDate.getTime())) {
      conditions.push(gte(feedback.createdAt, fromDate));
    }
  }

  if (toRaw) {
    const toDate = new Date(toRaw);
    if (!Number.isNaN(toDate.getTime())) {
      // Inclusive end-of-day so `to=2026-04-25` matches feedback submitted at
      // 23:59 on that date.
      toDate.setHours(23, 59, 59, 999);
      conditions.push(lte(feedback.createdAt, toDate));
    }
  }

  if (analysisIdFilter !== undefined) {
    conditions.push(eq(feedback.analysisId, analysisIdFilter));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const baseQuery = db
    .select({
      id: feedback.id,
      analysisId: feedback.analysisId,
      instrument: analyses.instrument,
      userId: feedback.userId,
      userEmail: users.email,
      feedbackType: feedback.feedbackType,
      outcome: feedback.outcome,
      note: feedback.note,
      createdAt: feedback.createdAt,
    })
    .from(feedback)
    .innerJoin(users, eq(feedback.userId, users.id))
    .innerJoin(analyses, eq(feedback.analysisId, analyses.id));

  const rows = await (whereClause ? baseQuery.where(whereClause) : baseQuery)
    .orderBy(desc(feedback.createdAt))
    .limit(limit)
    .offset(offset);

  // Total must be filtered the same way; otherwise pagination math is wrong
  // (admin sees "Page 1 of 12" with three rows visible). Joins must mirror
  // the rows query so the search ILIKE on users.email / analyses.instrument
  // can resolve.
  const totalQuery = db
    .select({ count: count(feedback.id) })
    .from(feedback)
    .innerJoin(users, eq(feedback.userId, users.id))
    .innerJoin(analyses, eq(feedback.analysisId, analyses.id));

  const [total] = await (whereClause ? totalQuery.where(whereClause) : totalQuery);

  res.json({
    feedback: rows,
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

async function removeUserTag(
  id: number,
  tag: string,
  res: Response,
): Promise<void> {
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
}

router.delete(
  "/superadmin/users/:id/tags/:tag",
  requireSuperAdmin,
  async (req: AuthRequest, res) => {
    const id = Number(req.params["id"]);
    const tag = String(req.params["tag"] ?? "");
    await removeUserTag(id, tag, res);
  },
);

router.delete(
  "/superadmin/users/:id/tags",
  requireSuperAdmin,
  async (req: AuthRequest, res) => {
    const id = Number(req.params["id"]);
    const tag = String(req.body?.tag ?? req.query["tag"] ?? "").trim();
    await removeUserTag(id, tag, res);
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

  if (role !== undefined && !["user", "admin", "super_admin"].includes(role)) {
    res.status(400).json({ error: "Role tidak valid" });
    return;
  }

  if (
    selectedMode !== undefined &&
    !["beginner", "pro"].includes(selectedMode)
  ) {
    res.status(400).json({ error: "Mode tidak valid" });
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

  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "ID tidak valid" });
    return;
  }

  if (id === req.userId) {
    res.status(400).json({ error: "Tidak bisa menghapus akun sendiri" });
    return;
  }

  type DeleteOutcome =
    | { kind: "ok"; displayName: string }
    | { kind: "notFound" }
    | { kind: "lastSuperAdmin" };

  const outcome = await db.transaction<DeleteOutcome>(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(${SUPER_ADMIN_GUARD_LOCK}::int, 0::int)`,
    );

    const [target] = await tx
      .select({ id: users.id, displayName: users.displayName, role: users.role })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!target) return { kind: "notFound" };

    if (target.role === "super_admin") {
      const [{ c }] = await tx
        .select({ c: count() })
        .from(users)
        .where(eq(users.role, "super_admin"));
      if (Number(c) <= 1) return { kind: "lastSuperAdmin" };
    }

    await tx.delete(users).where(eq(users.id, id));
    return { kind: "ok", displayName: target.displayName };
  });

  if (outcome.kind === "notFound") {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }
  if (outcome.kind === "lastSuperAdmin") {
    res.status(400).json({
      error: "Tidak bisa menghapus super admin terakhir",
    });
    return;
  }

  void notifySuperAdminsUserDeleted(outcome.displayName);

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

  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "ID tidak valid" });
    return;
  }

  if (!["user", "admin", "super_admin"].includes(role)) {
    res.status(400).json({ error: "Role tidak valid" });
    return;
  }

  if (id === req.userId) {
    res.status(400).json({ error: "Tidak bisa mengubah role sendiri" });
    return;
  }

  type RoleOutcome =
    | { kind: "ok"; row: { id: number; role: Role } }
    | { kind: "notFound" }
    | { kind: "lastSuperAdmin" };

  const outcome = await db.transaction<RoleOutcome>(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(${SUPER_ADMIN_GUARD_LOCK}::int, 0::int)`,
    );

    const [target] = await tx
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!target) return { kind: "notFound" };

    if (target.role === "super_admin" && role !== "super_admin") {
      const [{ c }] = await tx
        .select({ c: count() })
        .from(users)
        .where(eq(users.role, "super_admin"));
      if (Number(c) <= 1) return { kind: "lastSuperAdmin" };
    }

    const [updated] = await tx
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({ id: users.id, role: users.role });

    return { kind: "ok", row: updated as { id: number; role: Role } };
  });

  if (outcome.kind === "notFound") {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }
  if (outcome.kind === "lastSuperAdmin") {
    res.status(400).json({
      error: "Tidak bisa menurunkan super admin terakhir",
    });
    return;
  }

  res.json(outcome.row);
});

export default router;
