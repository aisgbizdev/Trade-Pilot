import { Router, type Request } from "express";
import { randomBytes } from "node:crypto";
import { and, count, desc, eq, isNull, sql, sum } from "drizzle-orm";
import { db } from "../lib/db";
import { creditTopupRequests, users } from "@workspace/db/schema";
import { requireAdmin, requireAuth, requireSuperAdmin, type AuthRequest } from "../middleware/auth";
import { createNotification } from "../lib/create-notification";
import {
  applyCreditLedgerEntry,
  CREDIT_BALANCE_LOCK_NAMESPACE,
  DOKU_MIN_AMOUNT_RUPIAH,
  findTopupPackage,
  getCreditBalanceForUser,
  getTopupConfig,
} from "../lib/credits";
import { createDokuCheckout, isDokuConfigured, verifyDokuNotificationSignature } from "../lib/doku";
import { dokuCheckoutLimiter, dokuNotifyLimiter } from "../middleware/rate-limit";
import { logger } from "../lib/logger";
import {
  CreateDokuCheckoutBody,
  CreateManualTopupBody,
  CreateTopupRequestBody,
  GetMyTopupRequestsQueryParams,
  GetPendingTopupRequestsQueryParams,
  ReviewCreditTopupRequestBody,
} from "@workspace/api-zod";

const router = Router();

type TopupRequestRow = typeof creditTopupRequests.$inferSelect;
const DOKU_NOTIFICATION_PATH = "/api/topups/doku/notify";

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
    paymentProvider: row.paymentProvider,
    dokuPaymentUrl: row.paymentProvider === "doku" && row.status === "pending" ? row.dokuPaymentUrl : null,
  };
}

router.get("/topups/config", requireAuth, async (_req: AuthRequest, res) => {
  res.json(getTopupConfig());
});

router.get("/topups/balance", requireAuth, async (req: AuthRequest, res) => {
  res.json({ balance: await getCreditBalanceForUser(req.userId!) });
});

router.post("/topups", requireAuth, async (req: AuthRequest, res) => {
  // Checked ahead of the full schema parse so a missing/blank proof gets
  // this specific message whether the field is omitted entirely (which
  // the generated zod schema also rejects, just with an opaque "invalid
  // body" error) or present-but-blank. Enforced here rather than relying
  // solely on the generated zod schema (openapi.yaml already marks the
  // field required — see CreateTopupRequestBody — but lib/api-zod is
  // regenerated separately and this guard must hold regardless of when
  // that next happens).
  const rawProof = (req.body as { proofObjectPath?: unknown } | undefined)?.proofObjectPath;
  if (typeof rawProof !== "string" || !rawProof.trim()) {
    res.status(400).json({ error: "Bukti transfer wajib diupload" });
    return;
  }

  const parsed = CreateTopupRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Data top-up tidak valid" });
    return;
  }
  const { amountRupiah, paymentReferenceNote, proofObjectPath } = parsed.data;
  // Fixed bonus-tiered packages (see lib/credits.ts) — the amount must
  // match one of them exactly. There is no free-text amount and no
  // per-rupiah rate to fall back to.
  const pkg = findTopupPackage(amountRupiah);
  if (!pkg) {
    res.status(400).json({
      error: "Nominal tidak valid. Pilih salah satu paket top-up yang tersedia.",
    });
    return;
  }
  // Product decision (see chat): only the smallest package stays on this
  // manual, unverified-proof path. Anything at/above the threshold must go
  // through the real, verified DOKU Checkout flow (POST /topups/doku/checkout).
  if (pkg.amountRupiah >= DOKU_MIN_AMOUNT_RUPIAH) {
    res.status(400).json({
      error: "Nominal ini hanya tersedia lewat pembayaran DOKU. Gunakan endpoint checkout DOKU.",
    });
    return;
  }
  const creditsRequested = pkg.credits;
  // Recorded for audit/history purposes only (what this specific package's
  // effective per-credit price was at the time) — no longer a globally
  // adjustable rate.
  const conversionRateSnapshot = Math.round(pkg.amountRupiah / pkg.credits);

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
        conversionRateSnapshot,
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

// DOKU Checkout (Jokul) — real, verified payment for every package at/above
// DOKU_MIN_AMOUNT_RUPIAH. Creates a "pending" request row, asks DOKU for a
// hosted checkout-page URL, and returns it for the frontend to redirect the
// browser to. Credits are granted only once POST /topups/doku/notify
// confirms the payment — never here.
router.post("/topups/doku/checkout", requireAuth, dokuCheckoutLimiter, async (req: AuthRequest, res) => {
  if (!isDokuConfigured()) {
    res.status(503).json({ error: "Pembayaran DOKU belum tersedia. Coba lagi nanti." });
    return;
  }

  const parsed = CreateDokuCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Data top-up tidak valid" });
    return;
  }
  const { amountRupiah } = parsed.data;
  const pkg = findTopupPackage(amountRupiah);
  if (!pkg || pkg.amountRupiah < DOKU_MIN_AMOUNT_RUPIAH) {
    res.status(400).json({
      error: "Nominal tidak valid untuk pembayaran DOKU. Pilih salah satu paket top-up yang tersedia.",
    });
    return;
  }

  const userId = req.userId!;
  const publicBaseUrl = (process.env["PUBLIC_BASE_URL"] ?? "").replace(/\/$/, "");
  // Credit-card invoice numbers are capped at 30 chars by DOKU — this
  // format (TP-<base36 timestamp>-<8 hex chars>) stays well under that
  // regardless of package, and needs no DB round-trip to generate.
  const invoiceNumber = `TP-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`;
  const conversionRateSnapshot = Math.round(pkg.amountRupiah / pkg.credits);
  const paymentDueDateMinutes = 60;

  const [inserted] = await db
    .insert(creditTopupRequests)
    .values({
      userId,
      amountRupiah: pkg.amountRupiah,
      creditsRequested: pkg.credits,
      conversionRateSnapshot,
      status: "pending",
      paymentProvider: "doku",
      dokuInvoiceNumber: invoiceNumber,
    })
    .returning();

  try {
    const checkout = await createDokuCheckout({
      invoiceNumber,
      amountRupiah: pkg.amountRupiah,
      callbackUrl: `${publicBaseUrl}/topup?doku=success&id=${inserted!.id}`,
      callbackUrlCancel: `${publicBaseUrl}/topup?doku=cancel&id=${inserted!.id}`,
      notificationUrl: `${publicBaseUrl}${DOKU_NOTIFICATION_PATH}`,
      paymentDueDateMinutes,
    });

    const expiresAt = new Date(Date.now() + paymentDueDateMinutes * 60 * 1000);
    await db
      .update(creditTopupRequests)
      .set({
        dokuSessionId: checkout.sessionId,
        dokuPaymentUrl: checkout.paymentUrl,
        dokuExpiresAt: expiresAt,
      })
      .where(eq(creditTopupRequests.id, inserted!.id));

    res.status(201).json({
      id: inserted!.id,
      paymentUrl: checkout.paymentUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    logger.error({ err, requestId: inserted!.id }, "[topups] DOKU checkout creation failed");
    await db
      .update(creditTopupRequests)
      .set({ status: "rejected", reviewNote: "DOKU checkout creation failed" })
      .where(eq(creditTopupRequests.id, inserted!.id));
    res.status(502).json({ error: "Gagal membuat sesi pembayaran DOKU. Coba lagi." });
  }
});

// The frontend polls this right after the browser returns from DOKU's
// checkout page, in case POST /topups/doku/notify hasn't landed yet
// (webhook delivery is best-effort async, not guaranteed to beat the
// redirect). Owner-only — a user can only poll their own request.
router.get("/topups/doku/:id/status", requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "ID tidak valid" });
    return;
  }
  const [row] = await db
    .select({ id: creditTopupRequests.id, userId: creditTopupRequests.userId, status: creditTopupRequests.status })
    .from(creditTopupRequests)
    .where(eq(creditTopupRequests.id, id))
    .limit(1);
  if (!row || row.userId !== req.userId) {
    res.status(404).json({ error: "Permintaan top-up tidak ditemukan" });
    return;
  }
  res.json({ id: row.id, status: row.status });
});

// DOKU's server-to-server payment notification — never called by our own
// frontend. No requireAuth: DOKU authenticates itself via the Signature
// header (verified below), not a session/bearer token.
router.post("/topups/doku/notify", dokuNotifyLimiter, async (req, res) => {
  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!rawBody) {
    res.status(400).json({ error: "Missing body" });
    return;
  }

  const signatureOk = verifyDokuNotificationSignature(
    {
      clientId: req.header("Client-Id"),
      requestId: req.header("Request-Id"),
      requestTimestamp: req.header("Request-Timestamp"),
      signature: req.header("Signature"),
    },
    rawBody.toString("utf8"),
    DOKU_NOTIFICATION_PATH,
  );
  if (!signatureOk) {
    logger.warn("[topups] DOKU notification rejected: invalid signature");
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const body = req.body as {
    order?: { invoice_number?: string; amount?: number | string };
    transaction?: { status?: string };
  };
  const invoiceNumber = body.order?.invoice_number;
  const transactionStatus = body.transaction?.status;
  if (!invoiceNumber || !transactionStatus) {
    res.status(400).json({ error: "Malformed notification" });
    return;
  }

  const [target] = await db
    .select()
    .from(creditTopupRequests)
    .where(eq(creditTopupRequests.dokuInvoiceNumber, invoiceNumber))
    .limit(1);
  if (!target) {
    logger.warn({ invoiceNumber }, "[topups] DOKU notification for unknown invoice");
    res.status(404).json({ error: "Unknown invoice" });
    return;
  }

  // Idempotent no-op if this request was already resolved (DOKU retries up
  // to 6x, and a SUCCESS notification can arrive more than once).
  if (target.status !== "pending") {
    res.status(200).type("text/plain").send("OK");
    return;
  }

  if (transactionStatus === "SUCCESS") {
    await db.transaction(async (tx) => {
      // Conditional UPDATE ... WHERE status = 'pending' — same race guard
      // PATCH /admin/topups/:id/status uses, in case the status poll
      // endpoint and this notification somehow overlap.
      const [claimed] = await tx
        .update(creditTopupRequests)
        .set({ status: "approved", creditsGranted: target.creditsRequested, reviewedAt: new Date() })
        .where(and(eq(creditTopupRequests.id, target.id), eq(creditTopupRequests.status, "pending")))
        .returning();
      if (!claimed) return;

      await tx.execute(sql`SELECT pg_advisory_xact_lock(${CREDIT_BALANCE_LOCK_NAMESPACE}::int, ${target.userId}::int)`);
      await applyCreditLedgerEntry(tx, {
        userId: target.userId,
        amount: target.creditsRequested,
        source: "topup_approval",
        sourceEventId: `topup:${target.id}`,
        topupRequestId: target.id,
      });
    });
    await notifyTopupApproved(target.userId, target.amountRupiah, target.creditsRequested);
  } else if (transactionStatus === "FAILED" || transactionStatus === "EXPIRED") {
    await db
      .update(creditTopupRequests)
      .set({ status: "rejected", reviewedAt: new Date(), reviewNote: `DOKU: ${transactionStatus}` })
      .where(and(eq(creditTopupRequests.id, target.id), eq(creditTopupRequests.status, "pending")));
  }
  // PENDING (or any other in-progress status) — nothing to do yet; DOKU
  // will send another notification once the transaction actually resolves.

  res.status(200).type("text/plain").send("OK");
});

router.get("/topups/mine", requireAuth, async (req: AuthRequest, res) => {
  const { page, limit } = GetMyTopupRequestsQueryParams.parse(req.query);
  const offset = (page - 1) * limit;
  const whereClause = and(eq(creditTopupRequests.userId, req.userId!), isNull(creditTopupRequests.deletedAt));
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
  const whereClause = and(eq(creditTopupRequests.status, status), isNull(creditTopupRequests.deletedAt));
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
  const approved = and(eq(creditTopupRequests.status, "approved"), isNull(creditTopupRequests.deletedAt));

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

  // Monthly report (laporan bulanan): same "approved" rows, grouped by the
  // calendar month they were approved in (not requested/created in — a
  // top-up's revenue belongs to the month it actually landed). WIB
  // (Asia/Jakarta, UTC+7) is used for the month boundary since that's the
  // product's primary user base and how every other admin timestamp in
  // this dashboard already reads; `reviewed_at` is stored as a plain
  // timestamp (no tz) so this is an explicit offset shift, not a real
  // timezone conversion.
  const byMonthRaw = await db
    .select({
      month: sql<string>`to_char(${creditTopupRequests.reviewedAt} + interval '7 hours', 'YYYY-MM')`,
      totalAmountRupiah: sum(creditTopupRequests.amountRupiah),
      totalCreditsGranted: sum(creditTopupRequests.creditsGranted),
      requestCount: count(creditTopupRequests.id),
    })
    .from(creditTopupRequests)
    .where(approved)
    .groupBy(sql`to_char(${creditTopupRequests.reviewedAt} + interval '7 hours', 'YYYY-MM')`)
    .orderBy(desc(sql`to_char(${creditTopupRequests.reviewedAt} + interval '7 hours', 'YYYY-MM')`));

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
    byMonth: byMonthRaw.map((r) => ({
      month: r.month,
      totalAmountRupiah: Number(r.totalAmountRupiah ?? 0),
      totalCreditsGranted: Number(r.totalCreditsGranted ?? 0),
      requestCount: Number(r.requestCount ?? 0),
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

// Support-case escape hatch: grant credits directly when a user paid but
// couldn't complete the normal request/proof-upload flow (upload failure,
// transfer confirmed outside the app, etc.). Bypasses proof verification
// entirely — `note` is required so there's always an audit trail for why.
// Amount/credits are NOT constrained to the fixed packages (see
// lib/credits.ts) since this is a manual correction, not a self-service
// purchase.
router.post("/admin/topups/manual", requireSuperAdmin, async (req: AuthRequest, res) => {
  const parsed = CreateManualTopupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Data top-up manual tidak valid" });
    return;
  }
  const { userId, amountRupiah, credits, note } = parsed.data;

  const [targetUser] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
  if (!targetUser) {
    res.status(400).json({ error: "User tidak ditemukan" });
    return;
  }

  const row = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(creditTopupRequests)
      .values({
        userId,
        amountRupiah,
        creditsRequested: credits,
        conversionRateSnapshot: Math.round(amountRupiah / credits),
        proofObjectPath: null,
        status: "approved",
        reviewedByUserId: req.userId!,
        reviewedAt: new Date(),
        reviewNote: note,
      })
      .returning();
    // Same shared credit-balance lock every other credit mutation uses
    // (analysis consumption, self-service approval) so this can never
    // race either into a lost update.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${CREDIT_BALANCE_LOCK_NAMESPACE}::int, ${userId}::int)`);
    await tx
      .update(creditTopupRequests)
      .set({ creditsGranted: credits })
      .where(eq(creditTopupRequests.id, inserted!.id));
    await applyCreditLedgerEntry(tx, {
      userId,
      amount: credits,
      source: "topup_approval",
      sourceEventId: `topup:${inserted!.id}`,
      topupRequestId: inserted!.id,
    });
    return { ...inserted!, creditsGranted: credits };
  });

  await notifyTopupApproved(userId, amountRupiah, credits);
  res.status(201).json(serializeTopupRequest(row));
});

// Soft-delete a top-up request (never a real row delete — see the
// deletedAt/deletedByUserId comment on the schema: credit_ledger.topupRequestId
// references this row with onDelete "restrict" once approved, and the ledger
// itself is append-only). If the request was approved, the credits it
// granted are clawed back first via a negative ledger entry (source
// "topup_reversal") under the same balance lock every other credit
// mutation uses, so this can never race a concurrent spend/grant for the
// same user into a lost update.
router.delete("/admin/topups/:id", requireSuperAdmin, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "ID tidak valid" });
    return;
  }

  const [target] = await db
    .select()
    .from(creditTopupRequests)
    .where(and(eq(creditTopupRequests.id, id), isNull(creditTopupRequests.deletedAt)))
    .limit(1);
  if (!target) {
    res.status(404).json({ error: "Permintaan top-up tidak ditemukan" });
    return;
  }

  const creditsReversed = await db.transaction(async (tx) => {
    let reversed = 0;
    if (target.status === "approved" && target.creditsGranted) {
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(${CREDIT_BALANCE_LOCK_NAMESPACE}::int, ${target.userId}::int)`,
      );
      await applyCreditLedgerEntry(tx, {
        userId: target.userId,
        amount: -target.creditsGranted,
        source: "topup_reversal",
        sourceEventId: `topup-reversal:${id}`,
        topupRequestId: id,
      });
      reversed = target.creditsGranted;
    }
    await tx
      .update(creditTopupRequests)
      .set({ deletedAt: new Date(), deletedByUserId: req.userId! })
      .where(eq(creditTopupRequests.id, id));
    return reversed;
  });

  const creditBalance = await getCreditBalanceForUser(target.userId);
  res.json({ id, creditsReversed, creditBalance });
});

export default router;
