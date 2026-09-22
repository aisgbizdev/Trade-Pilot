/**
 * GET /admin/stats — specifically the "active today" metric added
 * alongside the existing today/week/month counters. "Active" = distinct
 * users who created at least one analysis today, not just "has a valid
 * session cookie" (see routes/admin.ts).
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, inArray, like } from "drizzle-orm";

import app from "../../app";
import { db } from "../../lib/db";
import { users, sessions, analyses } from "@workspace/db/schema";

const RUN_ID = randomBytes(4).toString("hex");
const EMAIL_PREFIX = `admin-stats-test-${RUN_ID}`;
const INSTRUMENT_PREFIX = `ASTAT-${RUN_ID}`;
const seededUserIds: number[] = [];

interface SeedUser {
  id: number;
  email: string;
  token: string;
}

async function createUser(role: "user" | "super_admin" = "user"): Promise<SeedUser> {
  const suffix = randomBytes(6).toString("hex");
  const email = `${EMAIL_PREFIX}-${suffix}@example.test`;
  const passwordHash = await bcrypt.hash("not-used", 4);
  const securityAnswerHash = await bcrypt.hash("answer", 4);
  const [row] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      displayName: `Admin Stats Test ${RUN_ID}`,
      role,
      securityQuestion: "test?",
      securityAnswerHash,
    })
    .returning({ id: users.id });

  const token = `admin-stats-${RUN_ID}-${suffix}-${randomBytes(8).toString("hex")}`;
  await db.insert(sessions).values({
    userId: row.id,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
  seededUserIds.push(row.id);
  return { id: row.id, email, token };
}

async function seedAnalysis(userId: number): Promise<void> {
  await db.insert(analyses).values({
    userId,
    instrument: `${INSTRUMENT_PREFIX}-${randomBytes(2).toString("hex")}`,
    timeframe: "1h",
    mode: "beginner",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    marketCondition: "ranging",
    riskLevel: "low",
    confidenceMin: 50,
    confidenceMax: 70,
  });
}

afterAll(async () => {
  await db.delete(analyses).where(like(analyses.instrument, `${INSTRUMENT_PREFIX}%`));
  if (seededUserIds.length > 0) {
    await db.delete(sessions).where(inArray(sessions.userId, seededUserIds));
    await db.delete(users).where(inArray(users.id, seededUserIds));
  }
  await db.delete(users).where(like(users.email, `${EMAIL_PREFIX}%`));
});

describe("GET /admin/stats — totalUsersActiveToday", () => {
  it("counts a user who analyzed today, and not one who didn't", async () => {
    const superAdmin = await createUser("super_admin");
    const activeUser = await createUser();
    const idleUser = await createUser();

    await seedAnalysis(activeUser.id);

    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${superAdmin.token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.totalUsersActiveToday).toBe("number");
    // Shared DB with other tests' real activity — assert "at least our
    // one active user", and confirm the idle one truly didn't move the
    // needle by checking the count against a fresh call with one more
    // analysis for the idle user.
    const before = res.body.totalUsersActiveToday as number;
    expect(before).toBeGreaterThanOrEqual(1);

    await seedAnalysis(idleUser.id);
    const res2 = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${superAdmin.token}`);
    expect(res2.body.totalUsersActiveToday).toBe(before + 1);
  });

  it("counting the same user's second analysis today doesn't double-count them", async () => {
    const superAdmin = await createUser("super_admin");
    const activeUser = await createUser();

    await seedAnalysis(activeUser.id);
    const res1 = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${superAdmin.token}`);
    const afterFirst = res1.body.totalUsersActiveToday as number;

    await seedAnalysis(activeUser.id);
    const res2 = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${superAdmin.token}`);
    expect(res2.body.totalUsersActiveToday).toBe(afterFirst);
  });
});
