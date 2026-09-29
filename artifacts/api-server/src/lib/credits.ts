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

// DOKU's Virtual Account fee is Rp4.000 + 11% PPN on that fee (~Rp4.440
// total), deducted from what DOKU settles to us — never added to what the
// customer is charged automatically. Product decision (see chat): pass a
// flat Rp5.000 admin fee on to the customer for every DOKU VA payment
// instead of absorbing it, so the full advertised package price still
// lands net. The customer pays package + fee; the credits granted are only
// ever the package's own amount, completely unaffected by this.
// DOKU's QRIS channel is NOT charged this fee (product decision, see chat)
// — the customer pays exactly the package price for that method.
export const DOKU_ADMIN_FEE_RUPIAH = 5_000;

export type DokuCheckoutMethod = "va" | "qris";

// Every package now goes exclusively through DOKU Checkout — there is no
// more manual/proof-upload path (product decision, see chat: DOKU's own
// QRIS carries no fee, so it strictly beats the old manual flow even for
// the smallest package). The smallest package only offers QRIS: DOKU's VA
// admin fee doesn't make sense relative to such a small top-up, and QRIS
// is free either way.
const DOKU_METHODS_BY_AMOUNT: Record<number, readonly DokuCheckoutMethod[]> = {
  5_000: ["qris"],
  20_000: ["va", "qris"],
  40_000: ["va", "qris"],
  80_000: ["va", "qris"],
};

/** Which DOKU checkout methods a package may use — empty if the amount
 *  isn't one of the fixed packages. */
export function getDokuMethodsForPackage(amountRupiah: number): readonly DokuCheckoutMethod[] {
  return DOKU_METHODS_BY_AMOUNT[amountRupiah] ?? [];
}

// DOKU's own payment_method_types values (see
// developers.doku.com/.../backend-integration) that restrict the hosted
// checkout page to exactly one channel instead of showing every channel
// active on the dashboard.
const DOKU_PAYMENT_METHOD_TYPES: Record<DokuCheckoutMethod, readonly string[]> = {
  va: ["VIRTUAL_ACCOUNT_BCA"],
  qris: ["QRIS"],
};

export function getDokuPaymentMethodTypes(method: DokuCheckoutMethod): readonly string[] {
  return DOKU_PAYMENT_METHOD_TYPES[method];
}

export function getDokuAdminFeeRupiah(method: DokuCheckoutMethod): number {
  return method === "va" ? DOKU_ADMIN_FEE_RUPIAH : 0;
}

export function getTopupPackages(): readonly TopupPackage[] {
  return TOPUP_PACKAGES;
}

/** The package matching this exact rupiah amount, or null if it's not one
 *  of the fixed packages. */
export function findTopupPackage(amountRupiah: number): TopupPackage | null {
  return TOPUP_PACKAGES.find((p) => p.amountRupiah === amountRupiah) ?? null;
}

export interface TopupPackageOption extends TopupPackage {
  dokuMethods: readonly DokuCheckoutMethod[];
  /** The flat VA admin fee — relevant only when "va" is in dokuMethods. */
  adminFeeRupiah: number;
}

export function getTopupConfig(): { packages: readonly TopupPackageOption[] } {
  const packages = TOPUP_PACKAGES.map((p) => ({
    ...p,
    dokuMethods: getDokuMethodsForPackage(p.amountRupiah),
    adminFeeRupiah: DOKU_ADMIN_FEE_RUPIAH,
  }));
  return { packages };
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
