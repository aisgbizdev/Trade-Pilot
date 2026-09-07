import { eq, sql } from "drizzle-orm";
import { db, type DB } from "./db";
import { creditBalances, creditLedger } from "@workspace/db/schema";

type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

let RUPIAH_PER_CREDIT = parsePositiveInt(process.env["CREDIT_TOPUP_RUPIAH_PER_CREDIT"], 250);
// Real GoPay QRIS image, served statically from artifacts/ai-trading/public/.
const QRIS_IMAGE_URL = "/qris-gopay.jpeg";

export function getTopupConfig(): { rupiahPerCredit: number; qrisImageUrl: string } {
  return { rupiahPerCredit: RUPIAH_PER_CREDIT, qrisImageUrl: QRIS_IMAGE_URL };
}

export function setRupiahPerCredit(rate: number): void {
  RUPIAH_PER_CREDIT = parsePositiveInt(String(rate), RUPIAH_PER_CREDIT);
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
