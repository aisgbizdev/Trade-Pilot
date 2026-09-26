import { eq, sql } from "drizzle-orm";
import { db, type DB } from "./db";
import { creditBalances, creditLedger } from "@workspace/db/schema";

type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];

export interface TopupPackage {
  amountRupiah: number;
  credits: number;
}

// Fixed bonus-tiered top-up packages (product decision — replaces the old
// flat Rp-per-credit rate, which gave every nominal the same per-credit
// price). A bigger top-up buys credits at a better effective rate:
//   Rp5.000 -> 15 credits   (Rp333/credit)
//   Rp20.000 -> 70 credits  (Rp286/credit)
//   Rp40.000 -> 150 credits (Rp267/credit)
//   Rp80.000 -> 320 credits (Rp250/credit)
// POST /topups only accepts an amount that matches one of these exactly —
// there is no free-text/custom amount and no longer a runtime-adjustable
// rate (see the removed PATCH /admin/topups/config and TopupRateEditor).
const TOPUP_PACKAGES: readonly TopupPackage[] = [
  { amountRupiah: 5_000, credits: 15 },
  { amountRupiah: 20_000, credits: 70 },
  { amountRupiah: 40_000, credits: 150 },
  { amountRupiah: 80_000, credits: 320 },
];

// Real GoPay QRIS image, served statically from artifacts/ai-trading/public/.
const QRIS_IMAGE_URL = "/qris-gopay.jpeg";

// Product decision (see chat): only the smallest package stays on the
// manual proof-upload path (POST /topups, currently auto-approved without
// actually verifying the uploaded image — a known, accepted fraud surface
// at this one low value). Every package at or above this threshold must go
// through DOKU Checkout (POST /topups/doku/checkout) instead, which is a
// real, verified payment. Keep in sync with the fact that only the
// Rp5.000 package sits below it.
export const DOKU_MIN_AMOUNT_RUPIAH = 20_000;

// DOKU's Virtual Account fee is Rp4.000 + 11% PPN on that fee (~Rp4.440
// total), deducted from what DOKU settles to us — never added to what the
// customer is charged automatically. Product decision (see chat): pass a
// flat Rp5.000 admin fee on to the customer for every DOKU package instead
// of absorbing it, so the full advertised package price still lands net.
// The customer pays package + fee; the credits granted are only ever the
// package's own amount, completely unaffected by this.
export const DOKU_ADMIN_FEE_RUPIAH = 5_000;

export function getTopupPackages(): readonly TopupPackage[] {
  return TOPUP_PACKAGES;
}

/** The package matching this exact rupiah amount, or null if it's not one
 *  of the fixed packages. */
export function findTopupPackage(amountRupiah: number): TopupPackage | null {
  return TOPUP_PACKAGES.find((p) => p.amountRupiah === amountRupiah) ?? null;
}

export interface TopupPackageOption extends TopupPackage {
  provider: "manual" | "doku";
  /** 0 for "manual" packages — only DOKU packages carry this fee. */
  adminFeeRupiah: number;
}

export function getTopupConfig(): { packages: readonly TopupPackageOption[]; qrisImageUrl: string } {
  const packages = TOPUP_PACKAGES.map((p) => {
    const provider = p.amountRupiah >= DOKU_MIN_AMOUNT_RUPIAH ? ("doku" as const) : ("manual" as const);
    return { ...p, provider, adminFeeRupiah: provider === "doku" ? DOKU_ADMIN_FEE_RUPIAH : 0 };
  });
  return { packages, qrisImageUrl: QRIS_IMAGE_URL };
}

export async function getCreditBalanceForUser(userId: number): Promise<number> {
  const [row] = await db
    .select({ balance: creditBalances.balance })
    .from(creditBalances)
    .where(eq(creditBalances.userId, userId))
    .limit(1);
  return row?.balance ?? 0;
}

// Single advisory-lock namespace shared by every code path that mutates
// creditBalances (analysis consumption in routes/analyses.ts, top-up
// approval in routes/topups.ts) so two mutations for the same user can
// never race each other into a lost update. Callers must hold
// `pg_advisory_xact_lock(CREDIT_BALANCE_LOCK_NAMESPACE, userId)` inside
// their transaction before calling applyCreditLedgerEntry.
export const CREDIT_BALANCE_LOCK_NAMESPACE = 4244;

/**
 * Appends one signed delta to the append-only credit ledger and recomputes
 * the denormalized balance snapshot from a fresh sum() — mirrors the
 * ledger-then-snapshot pattern `awardProgression` uses for xpLedger /
 * progressionProfiles. Must run inside a transaction that already holds the
 * CREDIT_BALANCE_LOCK_NAMESPACE advisory lock for `userId`.
 */
export async function applyCreditLedgerEntry(
  tx: Tx,
  params: {
    userId: number;
    amount: number;
    source: string;
    sourceEventId: string;
    topupRequestId?: number;
    analysisId?: number;
  },
): Promise<number> {
  await tx
    .insert(creditLedger)
    .values({
      userId: params.userId,
      source: params.source,
      sourceEventId: params.sourceEventId,
      amount: params.amount,
      topupRequestId: params.topupRequestId,
      analysisId: params.analysisId,
    })
    .onConflictDoNothing();
  const [agg] = await tx
    .select({ total: sql<number>`coalesce(sum(${creditLedger.amount}), 0)::int` })
    .from(creditLedger)
    .where(eq(creditLedger.userId, params.userId));
  const newBalance = Number(agg?.total ?? 0);
  await tx
    .insert(creditBalances)
    .values({ userId: params.userId, balance: newBalance })
    .onConflictDoUpdate({
      target: creditBalances.userId,
      set: { balance: newBalance, updatedAt: new Date() },
    });
  return newBalance;
}
