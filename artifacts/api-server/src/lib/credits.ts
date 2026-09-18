import { and, eq, sql } from "drizzle-orm";
import { db, type DB } from "./db";
import { creditBalances, creditLedger, users } from "@workspace/db/schema";

type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];

// Lifetime cap on the "free timeframe switch" perk — a topped-up user's
// first N timeframe-switch re-analyses skip credit consumption even once
// the free hourly/daily quota is exhausted. Product decision: reward
// paying users without giving unlimited free AI calls (each analysis still
// costs a real OpenAI call regardless of whether a credit is charged).
// Deliberately never surfaced to the client as a counter/badge — enforced
// only inside POST /analyses.
export const FREE_TIMEFRAME_SWITCH_LIMIT = 20;

/**
 * True if this user has ever had a topup approved (credit_ledger contains
 * a "topup_approval" entry) AND has not yet used up their lifetime free
 * timeframe-switch allowance. Must run inside the same transaction that
 * will record the usage, so the check and the later increment see a
 * consistent view of `freeTimeframeSwitchesUsed`.
 */
export async function isEligibleForFreeTimeframeSwitch(tx: Tx, userId: number): Promise<boolean> {
  const [userRow] = await tx
    .select({ used: users.freeTimeframeSwitchesUsed })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!userRow || userRow.used >= FREE_TIMEFRAME_SWITCH_LIMIT) return false;

  const [toppedUp] = await tx
    .select({ id: creditLedger.id })
    .from(creditLedger)
    .where(and(eq(creditLedger.userId, userId), eq(creditLedger.source, "topup_approval")))
    .limit(1);
  return toppedUp !== undefined;
}

/** Records one use of the free timeframe-switch perk. Call only after
 *  `isEligibleForFreeTimeframeSwitch` returned true for this same
 *  transaction. */
export async function consumeFreeTimeframeSwitch(tx: Tx, userId: number): Promise<void> {
  await tx
    .update(users)
    .set({ freeTimeframeSwitchesUsed: sql`${users.freeTimeframeSwitchesUsed} + 1` })
    .where(eq(users.id, userId));
}

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

export function getTopupPackages(): readonly TopupPackage[] {
  return TOPUP_PACKAGES;
}

/** The package matching this exact rupiah amount, or null if it's not one
 *  of the fixed packages. */
export function findTopupPackage(amountRupiah: number): TopupPackage | null {
  return TOPUP_PACKAGES.find((p) => p.amountRupiah === amountRupiah) ?? null;
}

export function getTopupConfig(): { packages: readonly TopupPackage[]; qrisImageUrl: string } {
  return { packages: TOPUP_PACKAGES, qrisImageUrl: QRIS_IMAGE_URL };
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
