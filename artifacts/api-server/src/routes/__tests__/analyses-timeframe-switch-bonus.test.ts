import { describe, it, expect, afterAll, vi } from "vitest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, inArray, like } from "drizzle-orm";

// Same mock shape as analyses-credit-quota.test.ts — no real OpenAI call.
vi.mock("../../lib/openai", async () => {
  const actual = await vi.importActual<typeof import("../../lib/openai")>("../../lib/openai");
  return {
    ...actual,
    generateAnalysis: vi.fn(async () => ({
      output: {
        marketCondition: "ranging" as const,
        riskLevel: "low" as const,
        confidenceMin: 55,
        confidenceMax: 70,
        tradingBias: "neutral" as const,
        opportunity: "Tunggu breakout struktur untuk konfirmasi.",
        risk: "Sideways panjang bisa kasih sinyal palsu.",
        mainScenario: "Sideways menuju resistance.",
        alternativeScenario: "Breakdown ke support.",
        whyReason: "Likuiditas tipis, range jelas.",
        failureConditions: "Close di luar range.",
      },
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, callCount: 1 },
      model: "gpt-4o-mock",
    })),
  };
});

vi.mock("../../lib/webpush", async () => {
  const actual = await vi.importActual<typeof import("../../lib/webpush")>("../../lib/webpush");
  return { ...actual, sendPushToUser: vi.fn(async () => 0) };
});

const request = (await import("supertest")).default;
const app = (await import("../../app")).default;
const { db } = await import("../../lib/db");
const { users, sessions, analyses, notifications, creditBalances, creditLedger } = await import(
  "@workspace/db/schema"
);
const { applyCreditLedgerEntry, FREE_TIMEFRAME_SWITCH_LIMIT } = await import("../../lib/credits");

const RUN_ID = randomBytes(4).toString("hex");
const EMAIL_PREFIX = `analyses-tf-bonus-test-${RUN_ID}`;

interface SeedUser {
  id: number;
  email: string;
  token: string;
}

const seededUserIds: number[] = [];

async function createZeroQuotaUser(opts?: { freeTimeframeSwitchesUsed?: number }): Promise<SeedUser> {
  const suffix = randomBytes(6).toString("hex");
  const email = `${EMAIL_PREFIX}-${suffix}@example.test`;
  const passwordHash = await bcrypt.hash("not-used", 4);
  const securityAnswerHash = await bcrypt.hash("answer", 4);
  const [row] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      displayName: `TF Bonus Test ${RUN_ID} ${suffix}`,
      securityQuestion: "test?",
      securityAnswerHash,
      customQuotaPerHour: 0,
      customQuotaPerDay: 0,
      freeTimeframeSwitchesUsed: opts?.freeTimeframeSwitchesUsed ?? 0,
    })
    .returning({ id: users.id });

  const token = `tf-bonus-${RUN_ID}-${suffix}-${randomBytes(8).toString("hex")}`;
  await db.insert(sessions).values({
    userId: row.id,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
  seededUserIds.push(row.id);
  return { id: row.id, email, token };
}

async function seedTopup(userId: number): Promise<void> {
  await db.transaction(async (tx) => {
    await applyCreditLedgerEntry(tx, {
      userId,
      amount: 0,
      source: "topup_approval",
      sourceEventId: `seed-topup-${randomBytes(4).toString("hex")}`,
    });
  });
}

afterAll(async () => {
  if (seededUserIds.length) {
    await db.delete(notifications).where(inArray(notifications.userId, seededUserIds));
    await db.delete(creditLedger).where(inArray(creditLedger.userId, seededUserIds));
    await db.delete(creditBalances).where(inArray(creditBalances.userId, seededUserIds));
    await db.delete(analyses).where(inArray(analyses.userId, seededUserIds));
    await db.delete(sessions).where(inArray(sessions.userId, seededUserIds));
    await db.delete(users).where(inArray(users.id, seededUserIds));
  }
  await db.delete(users).where(like(users.email, `${EMAIL_PREFIX}%`));
});

describe("POST /analyses free timeframe-switch bonus", () => {
  it("waives the credit for a topped-up user's timeframe-switch request, and increments the counter", async () => {
    const user = await createZeroQuotaUser();
    await seedTopup(user.id);

    const instrument = `INST-${RUN_ID}-${randomBytes(3).toString("hex")}`;
    const res = await request(app)
      .post("/api/analyses")
      .set("Authorization", `Bearer ${user.token}`)
      .send({ instrument, timeframe: "1h", mode: "beginner", isTimeframeSwitch: true });

    expect(res.status).toBe(201);
    expect(res.body.creditConsumed).toBe(false);

    const [userRow] = await db
      .select({ freeTimeframeSwitchesUsed: users.freeTimeframeSwitchesUsed })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    expect(userRow?.freeTimeframeSwitchesUsed).toBe(1);

    const [balanceRow] = await db
      .select({ balance: creditBalances.balance })
      .from(creditBalances)
      .where(eq(creditBalances.userId, user.id))
      .limit(1);
    expect(balanceRow?.balance ?? 0).toBe(0);
  });

  it("does not apply the bonus when isTimeframeSwitch is absent, even for a topped-up user", async () => {
    const user = await createZeroQuotaUser();
    await seedTopup(user.id);

    const instrument = `INST-${RUN_ID}-${randomBytes(3).toString("hex")}`;
    const res = await request(app)
      .post("/api/analyses")
      .set("Authorization", `Bearer ${user.token}`)
      .send({ instrument, timeframe: "1h", mode: "beginner" });

    expect(res.status).toBe(429);
    expect(res.body.quota).toMatchObject({ scope: "hour" });
  });

  it("does not apply the bonus for a user who has never topped up", async () => {
    const user = await createZeroQuotaUser();

    const instrument = `INST-${RUN_ID}-${randomBytes(3).toString("hex")}`;
    const res = await request(app)
      .post("/api/analyses")
      .set("Authorization", `Bearer ${user.token}`)
      .send({ instrument, timeframe: "1h", mode: "beginner", isTimeframeSwitch: true });

    expect(res.status).toBe(429);
    expect(res.body.quota).toMatchObject({ scope: "hour" });
  });

  it("stops granting the bonus once the lifetime cap is reached, falling back to normal credit/quota rules", async () => {
    const user = await createZeroQuotaUser({ freeTimeframeSwitchesUsed: FREE_TIMEFRAME_SWITCH_LIMIT });
    await seedTopup(user.id);

    const instrument = `INST-${RUN_ID}-${randomBytes(3).toString("hex")}`;
    const res = await request(app)
      .post("/api/analyses")
      .set("Authorization", `Bearer ${user.token}`)
      .send({ instrument, timeframe: "1h", mode: "beginner", isTimeframeSwitch: true });

    expect(res.status).toBe(429);
    expect(res.body.quota).toMatchObject({ scope: "hour" });

    const [userRow] = await db
      .select({ freeTimeframeSwitchesUsed: users.freeTimeframeSwitchesUsed })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    expect(userRow?.freeTimeframeSwitchesUsed).toBe(FREE_TIMEFRAME_SWITCH_LIMIT);
  });

  it("a topped-up, capped-out user with a positive balance still spends a real credit on timeframe switch", async () => {
    const user = await createZeroQuotaUser({ freeTimeframeSwitchesUsed: FREE_TIMEFRAME_SWITCH_LIMIT });
    await seedTopup(user.id);
    await db.transaction(async (tx) => {
      await applyCreditLedgerEntry(tx, {
        userId: user.id,
        amount: 3,
        source: "test_seed",
        sourceEventId: `seed-${randomBytes(4).toString("hex")}`,
      });
    });

    const instrument = `INST-${RUN_ID}-${randomBytes(3).toString("hex")}`;
    const res = await request(app)
      .post("/api/analyses")
      .set("Authorization", `Bearer ${user.token}`)
      .send({ instrument, timeframe: "1h", mode: "beginner", isTimeframeSwitch: true });

    expect(res.status).toBe(201);
    expect(res.body.creditConsumed).toBe(true);
    expect(res.body.creditBalance).toBe(2);
  });
});
