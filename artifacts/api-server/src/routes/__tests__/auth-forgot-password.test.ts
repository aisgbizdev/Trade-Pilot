import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, inArray, like } from "drizzle-orm";

import app from "../../app";
import { db } from "../../lib/db";
import {
  users,
  sessions,
  passwordResetTokens,
} from "@workspace/db/schema";
import {
  forgotPasswordQuestionLimiter,
  forgotPasswordVerifyLimiter,
  forgotPasswordResetLimiter,
} from "../../middleware/rate-limit";

const RUN_ID = randomBytes(4).toString("hex");
const EMAIL_PREFIX = `auth-fp-test-${RUN_ID}`;
const SECURITY_QUESTION = "Nama hewan peliharaan pertama kamu?";
const SECURITY_ANSWER = "fluffy";
const ORIGINAL_PASSWORD = "OriginalPass123";
const seededIds: number[] = [];

interface SeedUser {
  id: number;
  email: string;
}

async function createUser(): Promise<SeedUser> {
  const suffix = randomBytes(6).toString("hex");
  const email = `${EMAIL_PREFIX}-${suffix}@example.test`;
  const passwordHash = await bcrypt.hash(ORIGINAL_PASSWORD, 4);
  const securityAnswerHash = await bcrypt.hash(SECURITY_ANSWER, 4);
  const [row] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      displayName: `FP Test ${RUN_ID} ${suffix}`,
      securityQuestion: SECURITY_QUESTION,
      securityAnswerHash,
    })
    .returning({ id: users.id });
  seededIds.push(row.id);
  return { id: row.id, email };
}

beforeAll(async () => {
  // Sanity row so the suite always has at least one user with our marker.
  await createUser();
});

beforeEach(() => {
  // Limiter stores are module-scoped Maps. Supertest always connects from
  // 127.0.0.1, so the per-IP `forgotPasswordResetLimiter` budget would
  // otherwise accumulate across tests in this file and falsely 429 the
  // success-path tests. Clear before every test for a clean budget.
  forgotPasswordQuestionLimiter.store.clear();
  forgotPasswordVerifyLimiter.store.clear();
  forgotPasswordResetLimiter.store.clear();
});

afterAll(async () => {
  if (seededIds.length === 0) return;
  // password_reset_tokens & sessions cascade-delete with the user row, but
  // be explicit just in case the user row is gone for some reason.
  await db
    .delete(passwordResetTokens)
    .where(inArray(passwordResetTokens.userId, seededIds));
  await db.delete(sessions).where(inArray(sessions.userId, seededIds));
  await db.delete(users).where(inArray(users.id, seededIds));
  // Sweep any user rows tagged with our prefix that might have been created
  // by other test paths (defense in depth).
  await db.delete(users).where(like(users.email, `${EMAIL_PREFIX}%`));
});

describe("POST /auth/forgot-password/question", () => {
  it("returns 400 when email is missing", async () => {
    const res = await request(app).post("/api/auth/forgot-password/question").send({});
    expect(res.status).toBe(400);
  });

  it("returns the user's actual security question for an existing email", async () => {
    const u = await createUser();
    const res = await request(app)
      .post("/api/auth/forgot-password/question")
      .send({ email: u.email });
    expect(res.status).toBe(200);
    expect(res.body.securityQuestion).toBe(SECURITY_QUESTION);
    expect(res.body.email).toBe(u.email.toLowerCase());
  });

  it("returns a generic placeholder question for an unknown email (no enumeration)", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password/question")
      .send({ email: `nobody-${RUN_ID}-${randomBytes(4).toString("hex")}@example.test` });
    // Must not 404 / 401 — that would leak whether the account exists.
    expect(res.status).toBe(200);
    expect(typeof res.body.securityQuestion).toBe("string");
    expect(res.body.securityQuestion.length).toBeGreaterThan(0);
  });
});

describe("POST /auth/forgot-password/verify", () => {
  it("returns 400 when email or answer is missing", async () => {
    const r1 = await request(app).post("/api/auth/forgot-password/verify").send({});
    expect(r1.status).toBe(400);

    const r2 = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({ email: "x@x.test" });
    expect(r2.status).toBe(400);
  });

  it("returns 401 for an unknown email (without leaking which side was wrong)", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({
        email: `nobody-${RUN_ID}-${randomBytes(4).toString("hex")}@example.test`,
        securityAnswer: "anything",
      });
    expect(res.status).toBe(401);
  });

  it("returns 401 for a wrong security answer on an existing user", async () => {
    const u = await createUser();
    const res = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({ email: u.email, securityAnswer: "definitely-wrong" });
    expect(res.status).toBe(401);
  });

  it("issues a reset token on a correct security answer", async () => {
    const u = await createUser();
    const res = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({ email: u.email, securityAnswer: SECURITY_ANSWER });
    expect(res.status).toBe(200);
    expect(typeof res.body.resetToken).toBe("string");
    expect(res.body.resetToken.length).toBeGreaterThanOrEqual(32);

    // Token row should now exist for this user.
    const rows = await db
      .select({ token: passwordResetTokens.token })
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, u.id));
    expect(rows.length).toBe(1);
    expect(rows[0].token).toBe(res.body.resetToken);
  });

  it("invalidates a previously issued token when a new one is requested", async () => {
    const u = await createUser();
    const r1 = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({ email: u.email, securityAnswer: SECURITY_ANSWER });
    expect(r1.status).toBe(200);
    const oldToken = r1.body.resetToken as string;

    const r2 = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({ email: u.email, securityAnswer: SECURITY_ANSWER });
    expect(r2.status).toBe(200);
    const newToken = r2.body.resetToken as string;
    expect(newToken).not.toBe(oldToken);

    const rows = await db
      .select({ token: passwordResetTokens.token })
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, u.id));
    expect(rows.length).toBe(1);
    expect(rows[0].token).toBe(newToken);
  });
});

describe("POST /auth/forgot-password/reset", () => {
  it("returns 400 when token or newPassword is missing", async () => {
    const r1 = await request(app).post("/api/auth/forgot-password/reset").send({});
    expect(r1.status).toBe(400);

    const r2 = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({ resetToken: "abc" });
    expect(r2.status).toBe(400);
  });

  it("returns 400 when the new password is shorter than 6 chars", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({ resetToken: "any-token", newPassword: "x" });
    expect(res.status).toBe(400);
  });

  it("returns 401 for an invalid / unknown reset token (authn failure, not field-validation)", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({
        resetToken: `definitely-not-real-${RUN_ID}-${randomBytes(8).toString("hex")}`,
        newPassword: "BrandNewPass1",
      });
    expect(res.status).toBe(401);
  });

  it("returns 401 for an expired reset token", async () => {
    const u = await createUser();
    const expiredToken = `expired-${RUN_ID}-${randomBytes(8).toString("hex")}`;
    await db.insert(passwordResetTokens).values({
      userId: u.id,
      token: expiredToken,
      expiresAt: new Date(Date.now() - 60 * 1000),
    });

    const res = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({ resetToken: expiredToken, newPassword: "BrandNewPass1" });
    expect(res.status).toBe(401);
  });

  it("resets the password, deletes the token, and revokes all sessions on success", async () => {
    const u = await createUser();
    // Establish a session that should get revoked.
    const sessionToken = `pre-reset-${RUN_ID}-${randomBytes(8).toString("hex")}`;
    await db.insert(sessions).values({
      userId: u.id,
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const verify = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({ email: u.email, securityAnswer: SECURITY_ANSWER });
    expect(verify.status).toBe(200);
    const resetToken = verify.body.resetToken as string;

    const NEW_PASSWORD = "BrandNewPass1";
    const res = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({ resetToken, newPassword: NEW_PASSWORD });
    expect(res.status).toBe(200);

    // Token row gone.
    const tokenRows = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, u.id));
    expect(tokenRows.length).toBe(0);

    // Sessions revoked.
    const sessionRows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, u.id));
    expect(sessionRows.length).toBe(0);

    // Password actually changed: login with new password works.
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: u.email, password: NEW_PASSWORD });
    expect(login.status).toBe(200);

    // ...and old password no longer works.
    const loginOld = await request(app)
      .post("/api/auth/login")
      .send({ email: u.email, password: ORIGINAL_PASSWORD });
    expect(loginOld.status).toBe(401);
  });

  it("rejects re-use of a previously consumed reset token", async () => {
    const u = await createUser();
    const verify = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({ email: u.email, securityAnswer: SECURITY_ANSWER });
    expect(verify.status).toBe(200);
    const resetToken = verify.body.resetToken as string;

    const r1 = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({ resetToken, newPassword: "BrandNewPass1" });
    expect(r1.status).toBe(200);

    const r2 = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({ resetToken, newPassword: "AnotherPass2" });
    // Once consumed, the token row is gone — second use is an authn failure (401).
    expect(r2.status).toBe(401);
  });
});
