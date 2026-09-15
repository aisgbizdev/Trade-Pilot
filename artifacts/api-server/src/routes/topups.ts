import { Router } from "express";
import { and, count, desc, eq, sql, sum } from "drizzle-orm";
import { db } from "../lib/db";
import { creditTopupRequests, users } from "@workspace/db/schema";
import { requireAdmin, requireAuth, requireSuperAdmin, type AuthRequest } from "../middleware/auth";
import { createNotification } from "../lib/create-notification";
import {
  applyCreditLedgerEntry,
  CREDIT_BALANCE_LOCK_NAMESPACE,
  getCreditBalanceForUser,
  getTopupConfig,
  setRupiahPerCredit,
} from "../lib/credits";
import {
  CreateTopupRequestBody,
  GetMyTopupRequestsQueryParams,
  GetPendingTopupRequestsQueryParams,
  ReviewCreditTopupRequestBody,
  UpdateTopupConfigBody,
} from "@workspace/api-zod";

const router = Router();

type TopupRequestRow = typeof creditTopupRequests.$inferSelect;

async function notifyTopupApproved(userId: number, amountRupiah: number, creditsGranted: number): Promise<void> {
  const [target] = await db.select({ lang: users.lang }).from(users).where(eq(users.id, userId)).limit(1);
  const isId = (target?.lang ?? "id") === "id";
  await createNotification(userId, {
    title: isId ? "Top-up disetujui" : "Top-up approved",
    message: isId
      ? `Top-up Rp${amountRupiah.toLocaleString("id-ID")} telah disetujui. ${creditsGranted} kredit ditambahkan ke saldo Anda.`
      : `Your Rp${amountRupiah.toLocaleString("id-ID")} top-up was approved. ${creditsGranted} credits were added to your balance.`,
    type: "info",
    category: "topup",
  });
}

function serializeTopupRequest(row: TopupRequestRow) {
  return {
    id: row.id,
    userId: row.userId,
    amountRupiah: row.amountRupiah,
    creditsRequested: row.creditsRequested,
    conversionRateSnapshot: row.conversionRateSnapshot,
    paymentReferenceNote: row.paymentReferenceNote,
    proofObjectPath: row.proofObjectPath,
    status: row.status,
    reviewedByUserId: row.reviewedByUserId,
    reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
    reviewNote: row.reviewNote,
    creditsGranted: row.creditsGranted,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/topups/config", requireAuth, async (_req: AuthRequest, res) => {
  res.json(getTopupConfig());
});

router.get("/topups/balance", requireAuth, async (req: AuthRequest, res) => {
  res.json({ balance: await getCreditBalanceForUser(req.userId!) });
});

router.post("/topups", requireAuth, async (req: AuthRequest, res) => {
  const parsed = CreateTopupRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Data top-up tidak valid" });
    return;
  }
  const { amountRupiah, paymentReferenceNote, proofObjectPath } = parsed.data;
  // Mandatory: admin review has no other way to verify a manual transfer
  // actually happened. Enforced here rather than relying solely on the
  // generated zod schema (openapi.yaml already marks the field required —
  // see CreateTopupRequestBody — but lib/api-zod is regenerated
  // separately and this guard must hold regardless of when that next
  // happens).
  if (!proofObjectPath || !proofObjectPath.trim()) {
    res.status(400).json({ error: "Bukti transfer wajib diupload" });
    return;
  }
  const { rupiahPerCredit } = getTopupConfig();
  const creditsRequested = Math.floor(amountRupiah / rupiahPerCredit);
  if (creditsRequested < 1) {
    res.status(400).json({
      error: `Nominal terlalu kecil. Minimal Rp${rupiahPerCredit.toLocaleString("id-ID")} untuk 1 kredit.`,
    });
    return;
  }

  const userId = req.userId!;
  // TEMPORARY (explicit, time-boxed product decision — see chat): every
  // request that reaches here already has a proof upload, and we credit
  // immediately instead of waiting for admin review. This trades away
  // the actual verification proof-upload was added for — an uploaded
  // image is NOT checked against the real transfer in any way, so this
  // is a known fraud surface (any image, any amount, instant credits).
  // Revisit before wider rollout: verify the proof (vision-model amount
  // match, or a real payment gateway) before auto-crediting, or at least
  // cap it to small preset amounts with a per-user rate limit.
  const row = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(creditTopupRequests)
      .values({
        userId,
        amountRupiah,
        creditsRequested,
        conversionRateSnapshot: rupiahPerCredit,
        paymentReferenceNote: paymentReferenceNote ?? null,
        proofObjectPath,
        status: "approved",
        reviewedAt: new Date(),
      })
      .returning();
    // Same shared credit-balance lock the manual-approval path and
    // analysis credit consumption use, so this can never race either.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${CREDIT_BALANCE_LOCK_NAMESPACE}::int, ${userId}::int)`);
    await tx
      .update(creditTopupRequests)
      .set({ creditsGranted: creditsRequested })
      .where(eq(creditTopupRequests.id, inserted!.id));
    await applyCreditLedgerEntry(tx, {
      userId,
      amount: creditsRequested,
      source: "topup_approval",
      sourceEventId: `topup:${inserted!.id}`,
      topupRequestId: inserted!.id,
    });
    return { ...inserted!, creditsGranted: creditsRequested };
  });

  await notifyTopupApproved(userId, amountRupiah, creditsRequested);
  res.status(201).json(serializeTopupRequest(row));
});

router.get("/topups/mine", requireAuth, async (req: AuthRequest, res) => {
  const { page, limit } = GetMyTopupRequestsQueryParams.parse(req.query);
  const offset = (page - 1) * limit;
  const whereClause = eq(creditTopupRequests.userId, req.userId!);
  const [rows, [totalRow]] = await Promise.all([
    db
      .select()
      .from(creditTopupRequests)
      .where(whereClause)
      .orderBy(desc(creditTopupRequests.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(creditTopupRequests).where(whereClause),
  ]);
  res.json({ requests: rows.map(serializeTopupRequest), total: totalRow?.value ?? 0, page, limit });
});

router.get("/admin/topups", requireAdmin, async (req: AuthRequest, res) => {
  const { status, page, limit } = GetPendingTopupRequestsQueryParams.parse(req.query);
  const offset = (page - 1) * limit;
  const whereClause = eq(creditTopupRequests.status, status);
  const [rows, [totalRow]] = await Promise.all([
    db
      .select({ request: creditTopupRequests, userEmail: users.email, userDisplayName: users.displayName })
      .from(creditTopupRequests)
      .leftJoin(users, eq(creditTopupRequests.userId, users.id))
      .where(whereClause)
      .orderBy(desc(creditTopupRequests.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(creditTopupRequests).where(whereClause),
  ]);
  res.json({
    requests: rows.map((r) => ({
      ...serializeTopupRequest(r.request),
      userEmail: r.userEmail ?? "",
      userDisplayName: r.userDisplayName ?? "",
    })),
    total: totalRow?.value ?? 0,
    page,
    limit,
  });
});

router.get("/admin/topups/summary", requireSuperAdmin, async (_req: AuthRequest, res) => {
  const approved = eq(creditTopupRequests.status, "approved");

  const [totalsRaw] = await db
    .select({
      totalAmountRupiah: sum(creditTopupRequests.amountRupiah),
      totalCreditsGranted: sum(creditTopupRequests.creditsGranted),
      approvedCount: count(creditTopupRequests.id),
    })
    .from(creditTopupRequests)
    .where(approved);

  const byUserRaw = await db
    .select({
      userId: creditTopupRequests.userId,
      userEmail: users.email,
      userDisplayName: users.displayName,
      totalAmountRupiah: sum(creditTopupRequests.amountRupiah),
      totalCreditsGranted: sum(creditTopupRequests.creditsGranted),
      requestCount: count(creditTopupRequests.id),
      lastApprovedAt: sql<string | null>`max(${creditTopupRequests.reviewedAt})`,
    })
    .from(creditTopupRequests)
    .innerJoin(users, eq(creditTopupRequests.userId, users.id))
    .where(approved)
    .groupBy(creditTopupRequests.userId, users.email, users.displayName)
    .orderBy(desc(sum(creditTopupRequests.amountRupiah)));

  res.json({
    totalAmountRupiah: Number(totalsRaw?.totalAmountRupiah ?? 0),
    totalCreditsGranted: Number(totalsRaw?.totalCreditsGranted ?? 0),
    approvedRequestCount: Number(totalsRaw?.approvedCount ?? 0),
    byUser: byUserRaw.map((r) => ({
      userId: r.userId,
      userEmail: r.userEmail,
      userDisplayName: r.userDisplayName,
      totalAmountRupiah: Number(r.totalAmountRupiah ?? 0),
      totalCreditsGranted: Number(r.totalCreditsGranted ?? 0),
      requestCount: Number(r.requestCount ?? 0),
      lastApprovedAt: r.lastApprovedAt,
    })),
  });
});

type ReviewOutcome =
  | { kind: "conflict" }
  | { kind: "ok"; row: TopupRequestRow };

router.patch("/admin/topups/:id/status", requireSuperAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "ID tidak valid" });
    return;
  }
  const parsed = ReviewCreditTopupRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Data review tidak valid" });
    return;
  }
  const { status, creditsGranted: creditsGrantedOverride, reviewNote } = parsed.data;

  const outcome = await db.transaction<ReviewOutcome>(async (tx) => {
    // The conditional UPDATE ... WHERE status = 'pending' is the race guard
    // for two admins reviewing the same request concurrently: Postgres
    // serializes concurrent UPDATEs on the same row via its native row
    // lock, so the second transaction's WHERE re-evaluates against the
    // now-committed (no longer "pending") row and matches zero rows —
    // no separate advisory lock is needed for this part.
    const [claimed] = await tx
      .update(creditTopupRequests)
      .set({ status, reviewedByUserId: req.userId!, reviewedAt: new Date(), reviewNote: reviewNote ?? null })
      .where(and(eq(creditTopupRequests.id, id), eq(creditTopupRequests.status, "pending")))
      .returning();
    if (!claimed) return { kind: "conflict" };

    if (status !== "approved") {
      return { kind: "ok", row: claimed };
    }

    // Balance mutation: take the shared credit-balance lock (same
    // namespace analyses.ts uses for credit consumption) so an approval
    // here can never race a concurrent analysis-triggered credit spend
    // for the same user into a lost update.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${CREDIT_BALANCE_LOCK_NAMESPACE}::int, ${claimed.userId}::int)`);
    const creditsGranted = creditsGrantedOverride ?? claimed.creditsRequested;
    await tx.update(creditTopupRequests).set({ creditsGranted }).where(eq(creditTopupRequests.id, id));
    await applyCreditLedgerEntry(tx, {
      userId: claimed.userId,
      amount: creditsGranted,
      source: "topup_approval",
      sourceEventId: `topup:${claimed.id}`,
      topupRequestId: claimed.id,
    });
    return { kind: "ok", row: { ...claimed, creditsGranted } };
  });

  if (outcome.kind === "conflict") {
    res.status(409).json({ error: "Permintaan ini sudah direview" });
    return;
  }

  const row = outcome.row;
  if (row.status === "approved") {
    await notifyTopupApproved(row.userId, row.amountRupiah, row.creditsGranted!);
  } else {
    const [target] = await db.select({ lang: users.lang }).from(users).where(eq(users.id, row.userId)).limit(1);
    const isId = (target?.lang ?? "id") === "id";
    await createNotification(row.userId, {
      title: isId ? "Top-up ditolak" : "Top-up rejected",
      message: row.reviewNote
        ? (isId ? `Top-up Anda ditolak: ${row.reviewNote}` : `Your top-up was rejected: ${row.reviewNote}`)
        : (isId
          ? "Top-up Anda ditolak. Hubungi admin untuk informasi lebih lanjut."
          : "Your top-up was rejected. Contact admin for more information."),
      type: "warning",
      category: "topup",
    });
  }

  res.json(serializeTopupRequest(row));
});

router.patch("/admin/topups/config", requireSuperAdmin, async (req: AuthRequest, res) => {
  const parsed = UpdateTopupConfigBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Rate tidak valid" });
    return;
  }
  setRupiahPerCredit(parsed.data.rupiahPerCredit);
  res.json(getTopupConfig());
});

export default router;
