import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, inArray, like } from "drizzle-orm";

import app from "../../app";
import { db } from "../../lib/db";
import {
  users,
  sessions,
  analyses,
  feedback,
} from "@workspace/db/schema";

const RUN_ID = randomBytes(4).toString("hex");
const EMAIL_PREFIX = `feedback-test-${RUN_ID}`;
const INSTRUMENT_PREFIX = `FB-${RUN_ID}`;

interface SeedUser {
  id: number;
  email: string;
  token: string;
}

const seededUserIds: number[] = [];
const seededAnalysisIds: number[] = [];

let alice: SeedUser;
let bob: SeedUser;

let aliceAnalysisId: number;
let bobAnalysisId: number;

async function createUser(): Promise<SeedUser> {
  const suffix = randomBytes(6).toString("hex");
  const email = `${EMAIL_PREFIX}-${suffix}@example.test`;
  const passwordHash = await bcrypt.hash("not-used", 4);
  const securityAnswerHash = await bcrypt.hash("answer", 4);
  const [row] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      displayName: `Feedback Test ${RUN_ID} ${suffix}`,
      securityQuestion: "test?",
      securityAnswerHash,
    })
    .returning({ id: users.id });

  const token = `feedback-${RUN_ID}-${suffix}-${randomBytes(8).toString("hex")}`;
  await db.insert(sessions).values({
    userId: row.id,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
  seededUserIds.push(row.id);
  return { id: row.id, email, token };
}

function authHeader(u: SeedUser): [string, string] {
  return ["Authorization", `Bearer ${u.token}`];
}

async function seedAnalysis(userId: number): Promise<number> {
  const [row] = await db
    .insert(analyses)
    .values({
      userId,
      instrument: `${INSTRUMENT_PREFIX}-${randomBytes(2).toString("hex")}`,
      timeframe: "1h",
      mode: "beginner",
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      marketCondition: "ranging",
      riskLevel: "low",
      confidenceMin: 50,
      confidenceMax: 70,
    })
    .returning({ id: analyses.id });
  seededAnalysisIds.push(row.id);
  return row.id;
}

beforeAll(async () => {
  alice = await createUser();
  bob = await createUser();
  aliceAnalysisId = await seedAnalysis(alice.id);
  bobAnalysisId = await seedAnalysis(bob.id);
});

afterAll(async () => {
  if (seededAnalysisIds.length > 0) {
    // feedback rows cascade-delete with the analyses (FK ON DELETE CASCADE),
    // but be explicit so a leaked row never survives a partial test run.
    await db
      .delete(feedback)
      .where(inArray(feedback.analysisId, seededAnalysisIds));
    await db.delete(analyses).where(inArray(analyses.id, seededAnalysisIds));
  }
  if (seededUserIds.length > 0) {
    await db.delete(sessions).where(inArray(sessions.userId, seededUserIds));
    await db.delete(users).where(inArray(users.id, seededUserIds));
  }
  // Final sweep by email prefix in case any test created a user we didn't track.
  await db.delete(users).where(like(users.email, `${EMAIL_PREFIX}%`));
});

describe("POST /analyses/:id/feedback auth gate", () => {
  it("returns 401 without an Authorization header", async () => {
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .send({ feedbackType: "useful" });
    expect(res.status).toBe(401);
  });

  it("returns 401 with a bogus bearer token", async () => {
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .set("Authorization", "Bearer not-a-real-token")
      .send({ feedbackType: "useful" });
    expect(res.status).toBe(401);
  });
});

describe("POST /analyses/:id/feedback owns-the-analysis check", () => {
  it("returns 404 when another user tries to attach feedback to someone else's analysis (no enumeration, no leak)", async () => {
    // bob tries to post feedback on alice's analysis — must look identical
    // to a missing analysis from his perspective.
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .set(...authHeader(bob))
      .send({ feedbackType: "useful" });
    expect(res.status).toBe(404);

    // And no feedback row may have been written.
    const rows = await db
      .select({ id: feedback.id })
      .from(feedback)
      .where(eq(feedback.analysisId, aliceAnalysisId));
    expect(rows.length).toBe(0);
  });

  it("returns 404 for an unknown analysis id", async () => {
    const res = await request(app)
      .post(`/api/analyses/999999999/feedback`)
      .set(...authHeader(alice))
      .send({ feedbackType: "useful" });
    expect(res.status).toBe(404);
  });
});

describe("POST /analyses/:id/feedback enum validation", () => {
  it("returns 400 when feedbackType is missing", async () => {
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .set(...authHeader(alice))
      .send({});
    expect(res.status).toBe(400);
  });

  it("returns 400 when feedbackType is empty string", async () => {
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .set(...authHeader(alice))
      .send({ feedbackType: "" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for an unknown feedbackType value", async () => {
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .set(...authHeader(alice))
      .send({ feedbackType: "amazing" });
    expect(res.status).toBe(400);
  });

  it("validates feedbackType BEFORE touching the analysis (no row leak on bad enum even with wrong owner)", async () => {
    // bob hits alice's analysis with a bad enum — must still 400, never 404,
    // and must never insert a row.
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .set(...authHeader(bob))
      .send({ feedbackType: "amazing" });
    expect(res.status).toBe(400);

    const rows = await db
      .select({ id: feedback.id })
      .from(feedback)
      .where(eq(feedback.analysisId, aliceAnalysisId));
    expect(rows.length).toBe(0);
  });
});

describe("POST /analyses/:id/feedback happy path", () => {
  it("creates a new feedback row with 201 and persists feedbackType / outcome / note", async () => {
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .set(...authHeader(alice))
      .send({
        feedbackType: "useful",
        outcome: "correct",
        note: `note-${RUN_ID}`,
      });
    expect(res.status).toBe(201);
    expect(res.body.feedbackType).toBe("useful");
    expect(res.body.outcome).toBe("correct");
    expect(res.body.note).toBe(`note-${RUN_ID}`);
    expect(res.body.userId).toBe(alice.id);
    expect(res.body.analysisId).toBe(aliceAnalysisId);

    const [row] = await db
      .select()
      .from(feedback)
      .where(eq(feedback.id, res.body.id))
      .limit(1);
    expect(row).toBeDefined();
    expect(row.feedbackType).toBe("useful");
    expect(row.outcome).toBe("correct");
    expect(row.note).toBe(`note-${RUN_ID}`);
  });

  it("a second POST from the same owner UPDATES (not duplicates) the existing row", async () => {
    // Re-submit with different values; route should return 200 (not 201)
    // and there should still be exactly one feedback row for (analysis, user).
    const res = await request(app)
      .post(`/api/analyses/${aliceAnalysisId}/feedback`)
      .set(...authHeader(alice))
      .send({
        feedbackType: "not_useful",
        outcome: "wrong",
        note: null,
      });
    expect(res.status).toBe(200);
    expect(res.body.feedbackType).toBe("not_useful");
    expect(res.body.outcome).toBe("wrong");
    expect(res.body.note).toBeNull();

    const rows = await db
      .select({ id: feedback.id, feedbackType: feedback.feedbackType })
      .from(feedback)
      .where(eq(feedback.analysisId, aliceAnalysisId));
    expect(rows.length).toBe(1);
    expect(rows[0].feedbackType).toBe("not_useful");
  });

  it("bob can attach feedback to his OWN analysis without leaking onto alice's", async () => {
    const res = await request(app)
      .post(`/api/analyses/${bobAnalysisId}/feedback`)
      .set(...authHeader(bob))
      .send({ feedbackType: "useful" });
    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(bob.id);
    expect(res.body.analysisId).toBe(bobAnalysisId);

    // Bob's feedback must not appear under alice's analysis.
    const aliceRows = await db
      .select({ userId: feedback.userId })
      .from(feedback)
      .where(eq(feedback.analysisId, aliceAnalysisId));
    for (const r of aliceRows) {
      expect(r.userId).toBe(alice.id);
    }
  });
});
