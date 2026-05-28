import { describe, it, expect, afterAll } from "vitest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { inArray } from "drizzle-orm";

import { db } from "../db";
import { users, analyses } from "@workspace/db/schema";
import { computePerformanceSummary, MIN_SAMPLE } from "../performance";

const RUN_ID = randomBytes(4).toString("hex");
const seededUserIds: number[] = [];

async function createUser(): Promise<number> {
  const suffix = randomBytes(6).toString("hex");
  const [row] = await db
    .insert(users)
    .values({
      email: `perf-${RUN_ID}-${suffix}@example.test`,
      passwordHash: await bcrypt.hash("x", 4),
      displayName: `Perf ${RUN_ID} ${suffix}`,
      securityQuestion: "q?",
      securityAnswerHash: await bcrypt.hash("a", 4),
    })
    .returning({ id: users.id });
  seededUserIds.push(row.id);
  return row.id;
}

type Outcome = "tp1_hit" | "tp2_hit" | "sl_hit" | "expired" | "pending" | "invalidated";
type Condition = "trending_up" | "trending_down" | "ranging" | "volatile";

async function seedAnalysis(opts: {
  userId: number;
  instrument: string;
  outcome: Outcome;
  marketCondition?: Condition;
  /** Hours before `now` that this resolution / creation lives at. */
  hoursAgo: number;
  /** UTC hour at which the analysis was created (drives session bucket). */
  createdAtUtcHour?: number;
  now: Date;
}) {
  const createdAt = new Date(opts.now.getTime() - opts.hoursAgo * 60 * 60 * 1000);
  if (typeof opts.createdAtUtcHour === "number") {
    createdAt.setUTCHours(opts.createdAtUtcHour, 0, 0, 0);
  }
  await db.insert(analyses).values({
    userId: opts.userId,
    instrument: opts.instrument,
    timeframe: "1h",
    mode: "beginner",
    marketCondition: opts.marketCondition ?? "trending_up",
    riskLevel: "medium",
    confidenceMin: 60,
    confidenceMax: 80,
    validUntil: new Date(createdAt.getTime() + 4 * 60 * 60 * 1000),
    outcomeStatus: opts.outcome,
    outcomeResolvedAt:
      opts.outcome === "pending" ? null : new Date(createdAt.getTime() + 30 * 60 * 1000),
    createdAt,
  });
}

afterAll(async () => {
  if (seededUserIds.length > 0) {
    await db.delete(analyses).where(inArray(analyses.userId, seededUserIds));
    await db.delete(users).where(inArray(users.id, seededUserIds));
  }
});

describe("computePerformanceSummary", () => {
  it("returns an empty, fully-gated payload when no resolved analyses exist in the window", async () => {
    // Far-future `now` puts the 30d cutoff well past every real or
    // leftover analysis in the dev DB, so the window is provably empty
    // regardless of what other tests have left behind.
    const now = new Date("2099-01-01T12:00:00Z");
    const summary = await computePerformanceSummary(30, { now });
    expect(summary.windowDays).toBe(30);
    expect(summary.overall.total).toBe(0);
    expect(summary.overall.winRate).toBeNull();
    expect(summary.byInstrument.gated).toBe(true);
    expect(summary.bySession.gated).toBe(true);
    expect(summary.byCondition.gated).toBe(true);
    expect(summary.banner.severity).toBe("ok");
    expect(summary.banner.recentHitRate).toBeNull();
  });

  it("counts tp1_hit/tp2_hit as wins, sl_hit as loss, expired as no-fill; ignores pending and invalidated", async () => {
    const now = new Date("2026-05-15T12:00:00Z");
    const userId = await createUser();
    // 20 resolved rows = clears MIN_SAMPLE.overall and MIN_SAMPLE.bucket (10)
    // for a single instrument: 12 wins, 6 losses, 2 expired
    for (let i = 0; i < 8; i++) {
      await seedAnalysis({ userId, instrument: "PERF_A", outcome: "tp1_hit", hoursAgo: 5 + i, now });
    }
    for (let i = 0; i < 4; i++) {
      await seedAnalysis({ userId, instrument: "PERF_A", outcome: "tp2_hit", hoursAgo: 20 + i, now });
    }
    for (let i = 0; i < 6; i++) {
      await seedAnalysis({ userId, instrument: "PERF_A", outcome: "sl_hit", hoursAgo: 30 + i, now });
    }
    for (let i = 0; i < 2; i++) {
      await seedAnalysis({ userId, instrument: "PERF_A", outcome: "expired", hoursAgo: 40 + i, now });
    }
    // Noise that must be ignored
    await seedAnalysis({ userId, instrument: "PERF_A", outcome: "pending", hoursAgo: 1, now });
    await seedAnalysis({ userId, instrument: "PERF_A", outcome: "invalidated", hoursAgo: 50, now });

    const summary = await computePerformanceSummary(30, { now });
    // Only the PERF_A counts (others are noise; some user from prior tests may
    // leak in only via this same userId, which we just created). Filter to be safe.
    const bucket = summary.byInstrument.buckets.find((b) => b.key === "PERF_A");
    expect(bucket).toBeDefined();
    expect(bucket!.wins).toBe(12);
    expect(bucket!.losses).toBe(6);
    expect(bucket!.expired).toBe(2);
    expect(bucket!.triggered).toBe(18);
    expect(bucket!.total).toBe(20);
    expect(bucket!.winRate).toBeCloseTo(12 / 18, 5);
    expect(bucket!.hitRate).toBeCloseTo(12 / 20, 5);
  });

  it("gates a segment when no bucket clears MIN_SAMPLE.bucket but overall threshold is met across many small buckets", async () => {
    const now = new Date("2026-06-01T12:00:00Z");
    const userId = await createUser();
    // 20 resolved rows spread across 20 *distinct* instruments — overall
    // threshold met, but every instrument bucket has only 1 row.
    for (let i = 0; i < 20; i++) {
      await seedAnalysis({
        userId,
        instrument: `THIN_${i.toString().padStart(2, "0")}`,
        outcome: i % 2 === 0 ? "tp1_hit" : "sl_hit",
        hoursAgo: 10 + i,
        now,
      });
    }
    const summary = await computePerformanceSummary(30, { now });
    // None of our 1-row THIN_* instruments should appear as qualified
    // buckets, regardless of what other rows exist in the shared dev DB.
    const ours = summary.byInstrument.buckets.filter((b) => b.key.startsWith("THIN_"));
    expect(ours).toHaveLength(0);
    expect(MIN_SAMPLE.bucket).toBe(10);
    expect(summary.byInstrument.need).toBe(MIN_SAMPLE.bucket);
  });

  it("buckets by FX session using createdAt UTC hour", async () => {
    const now = new Date("2026-07-01T22:00:00Z");
    const userId = await createUser();
    // 12 wins at UTC 3am (asia), 10 wins at UTC 16 (newyork)
    for (let i = 0; i < 12; i++) {
      await seedAnalysis({
        userId,
        instrument: `SESS_${i.toString().padStart(2, "0")}`,
        outcome: "tp1_hit",
        hoursAgo: 24 + i,
        createdAtUtcHour: 3,
        now,
      });
    }
    for (let i = 0; i < 10; i++) {
      await seedAnalysis({
        userId,
        instrument: `SESS_NY_${i.toString().padStart(2, "0")}`,
        outcome: "tp1_hit",
        hoursAgo: 24 + i,
        createdAtUtcHour: 16,
        now,
      });
    }
    const summary = await computePerformanceSummary(30, { now });
    const asia = summary.bySession.buckets.find((b) => b.key === "asia");
    const ny = summary.bySession.buckets.find((b) => b.key === "newyork");
    expect(asia?.total).toBeGreaterThanOrEqual(12);
    expect(ny?.total).toBeGreaterThanOrEqual(10);
  });

  it("fires `warn` banner when the last 7d hit-rate is >=15pp below the 30d baseline", async () => {
    const now = new Date("2026-08-01T12:00:00Z");
    const userId = await createUser();
    // Baseline (15 wins in days 8-29) plus a rough recent week (3 wins, 12 losses in last 5 days).
    for (let i = 0; i < 15; i++) {
      await seedAnalysis({
        userId,
        instrument: `BAN_${i}`,
        outcome: "tp1_hit",
        hoursAgo: 24 * 8 + i,
        now,
      });
    }
    for (let i = 0; i < 3; i++) {
      await seedAnalysis({
        userId,
        instrument: `BAN_R_${i}`,
        outcome: "tp1_hit",
        hoursAgo: 24 + i,
        now,
      });
    }
    for (let i = 0; i < 12; i++) {
      await seedAnalysis({
        userId,
        instrument: `BAN_L_${i}`,
        outcome: "sl_hit",
        hoursAgo: 48 + i,
        now,
      });
    }
    const summary = await computePerformanceSummary(30, { now });
    expect(summary.banner.recentSample).toBeGreaterThanOrEqual(MIN_SAMPLE.banner);
    expect(summary.banner.recentHitRate).not.toBeNull();
    expect(summary.banner.baselineHitRate).not.toBeNull();
    // Recent is much worse than baseline.
    expect(summary.banner.delta!).toBeLessThanOrEqual(-0.15);
    expect(summary.banner.severity).toBe("warn");
  });
});
