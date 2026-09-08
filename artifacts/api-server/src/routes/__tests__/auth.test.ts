import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import request from "supertest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, inArray, like } from "drizzle-orm";

import app from "../../app";
import { db } from "../../lib/db";
import { users, sessions, passwordResetTokens } from "@workspace/db/schema";
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordResetLimiter,
  googleOAuthLimiter,
} from "../../middleware/rate-limit";
import { getConfiguredReplitOrigins } from "../../app";
import { exchangeCodeForProfile } from "../../lib/google-oauth";

// Keep the real config/url helpers, stub only the network-touching
// code-exchange so the callback tests can drive any Google profile.
vi.mock("../../lib/google-oauth", async (importActual) => {
  const actual =
    await importActual<typeof import("../../lib/google-oauth")>();
  return { ...actual, exchangeCodeForProfile: vi.fn() };
});
const mockExchange = vi.mocked(exchangeCodeForProfile);

const RUN_ID = randomBytes(4).toString("hex");
const EMAIL_PREFIX = `auth-harden-${RUN_ID}`;
const SECURITY_QUESTION = "Nama hewan peliharaan pertama kamu?";
const PASSWORD = "Correct123";
const seededIds: number[] = [];

interface SeedUser {
  id: number;
  email: string;
  token: string;
}

async function createUser(): Promise<SeedUser> {
  const suffix = randomBytes(6).toString("hex");
  const email = `${EMAIL_PREFIX}-${suffix}@example.test`;
  const passwordHash = await bcrypt.hash(PASSWORD, 4);
  const securityAnswerHash = await bcrypt.hash("answer", 4);
  const [row] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      displayName: `Auth Harden ${RUN_ID} ${suffix}`,
      securityQuestion: SECURITY_QUESTION,
      securityAnswerHash,
    })
    .returning({ id: users.id });

  const token = `auth-harden-${RUN_ID}-${suffix}-${randomBytes(8).toString("hex")}`;
  await db.insert(sessions).values({
    userId: row.id,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  seededIds.push(row.id);
  return { id: row.id, email, token };
}

beforeAll(async () => {
  // Sanity row so the suite has at least one tagged user.
  await createUser();
});

afterAll(async () => {
  if (seededIds.length > 0) {
    await db
      .delete(passwordResetTokens)
      .where(inArray(passwordResetTokens.userId, seededIds));
    await db.delete(sessions).where(inArray(sessions.userId, seededIds));
    await db.delete(users).where(inArray(users.id, seededIds));
  }
  // Sweep prefix-tagged residue from any failed tests (defense in depth).
  await db.delete(users).where(like(users.email, `${EMAIL_PREFIX}%`));
});

beforeEach(() => {
  // Limiter stores are module-scoped Maps shared across all tests in this
  // file. Supertest always connects from 127.0.0.1, so the per-IP limiters
  // would otherwise bleed state across cases. Clear before every test so
  // each one starts from a clean budget.
  loginLimiter.store.clear();
  registerLimiter.store.clear();
  forgotPasswordResetLimiter.store.clear();
  googleOAuthLimiter.store.clear();
});

describe("configured Replit CORS origins", () => {
  it("allows explicit published Replit domains without allowing a wildcard", () => {
    const origins = getConfiguredReplitOrigins([
      "trade-pilot-23newsmaker.replit.app, https://preview.example.test",
      "ignored.invalid:bad-port",
    ]);

    expect(origins).toEqual(
      new Set([
        "https://trade-pilot-23newsmaker.replit.app",
        "https://preview.example.test",
      ]),
    );
    expect(origins.has("https://another-app.replit.app")).toBe(false);
  });
});

describe("PATCH /auth/profile validation", () => {
  it("returns 400 for an invalid selectedMode (no longer 500)", async () => {
    const u = await createUser();
    const res = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ selectedMode: "rocket-mode" });
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe("string");
    expect(res.body.error.toLowerCase()).toContain("mode");
  });

  it("returns 400 for an invalid themePreference", async () => {
    const u = await createUser();
    const res = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ themePreference: "neon" });
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe("string");
    expect(res.body.error.toLowerCase()).toContain("tema");
  });

  it("returns 400 when onboardingCompleted is not a boolean", async () => {
    const u = await createUser();
    const res = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ onboardingCompleted: "yes-please" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when displayName is empty", async () => {
    const u = await createUser();
    const res = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ displayName: "" });
    expect(res.status).toBe(400);
  });

  it("rejects unknown fields (strict schema, no silent column writes)", async () => {
    const u = await createUser();
    const res = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ role: "super_admin" });
    expect(res.status).toBe(400);
  });

  it("happy path: accepts a valid update and returns the new profile", async () => {
    const u = await createUser();
    const res = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${u.token}`)
      .send({
        selectedMode: "pro",
        themePreference: "dark",
        displayName: "Renamed Trader",
        onboardingCompleted: true,
      });
    expect(res.status).toBe(200);
    expect(res.body.selectedMode).toBe("pro");
    expect(res.body.themePreference).toBe("dark");
    expect(res.body.displayName).toBe("Renamed Trader");
    expect(res.body.onboardingCompleted).toBe(true);
  });

  it("requires auth (401 without a session)", async () => {
    const res = await request(app)
      .patch("/api/auth/profile")
      .send({ selectedMode: "pro" });
    expect(res.status).toBe(401);
  });
});

describe("POST /auth/login rate limiting", () => {
  it("returns 429 with Retry-After once the per-(ip,email) limit is exceeded", async () => {
    const u = await createUser();
    // 10 wrong attempts should all return 401 (limit is 10).
    for (let i = 0; i < 10; i++) {
      const r = await request(app)
        .post("/api/auth/login")
        .send({ email: u.email, password: "definitely-wrong" });
      expect(r.status).toBe(401);
    }
    // The 11th attempt — still wrong password — should now be blocked at the
    // limiter, before bcrypt even runs.
    const blocked = await request(app)
      .post("/api/auth/login")
      .send({ email: u.email, password: "definitely-wrong" });
    expect(blocked.status).toBe(429);
    expect(blocked.headers["retry-after"]).toBeDefined();
    expect(typeof blocked.body.error).toBe("string");
    expect(blocked.body.error).toMatch(/login/i);
  });

  it("does not block a different account on the same IP (key includes email)", async () => {
    const u1 = await createUser();
    const u2 = await createUser();
    // Burn u1's budget.
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post("/api/auth/login")
        .send({ email: u1.email, password: "wrong" });
    }
    const blocked = await request(app)
      .post("/api/auth/login")
      .send({ email: u1.email, password: "wrong" });
    expect(blocked.status).toBe(429);

    // u2 must still be able to log in successfully — limiter is per (ip,email).
    const ok = await request(app)
      .post("/api/auth/login")
      .send({ email: u2.email, password: PASSWORD });
    expect(ok.status).toBe(200);
  });
});

describe("POST /auth/register rate limiting", () => {
  it("returns 429 with Retry-After once the per-IP limit is exceeded", async () => {
    // 10 fresh registrations succeed (limit is 10/hour/ip in test env).
    for (let i = 0; i < 10; i++) {
      const suffix = randomBytes(6).toString("hex");
      const r = await request(app)
        .post("/api/auth/register")
        .send({
          email: `${EMAIL_PREFIX}-rl-${suffix}@example.test`,
          password: "Password123",
          displayName: `RL ${suffix}`,
          selectedMode: "beginner",
          securityQuestion: SECURITY_QUESTION,
          securityAnswer: "x",
        });
      expect([201, 409]).toContain(r.status);
    }
    // 11th attempt is blocked before any DB work.
    const blocked = await request(app)
      .post("/api/auth/register")
      .send({
        email: `${EMAIL_PREFIX}-rl-${randomBytes(6).toString("hex")}@example.test`,
        password: "Password123",
        displayName: "blocked",
        selectedMode: "beginner",
        securityQuestion: SECURITY_QUESTION,
        securityAnswer: "x",
      });
    expect(blocked.status).toBe(429);
    expect(blocked.headers["retry-after"]).toBeDefined();
    expect(blocked.body.error).toMatch(/(pendaftaran|sign-?up)/i);

    // Cleanup: scrub the rl-tagged users this test just inserted.
    await db.delete(users).where(like(users.email, `${EMAIL_PREFIX}-rl-%`));
  });
});

describe("POST /auth/forgot-password/reset rate limiting", () => {
  it("returns 429 once the per-IP limit is exceeded", async () => {
    // 5 attempts with garbage tokens — each returns 401 (limit is 5/15min/ip).
    for (let i = 0; i < 5; i++) {
      const r = await request(app)
        .post("/api/auth/forgot-password/reset")
        .send({
          resetToken: `bogus-${RUN_ID}-${randomBytes(8).toString("hex")}`,
          newPassword: "Password123",
        });
      expect(r.status).toBe(401);
    }
    const blocked = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({
        resetToken: `bogus-${RUN_ID}-${randomBytes(8).toString("hex")}`,
        newPassword: "Password123",
      });
    expect(blocked.status).toBe(429);
    expect(blocked.headers["retry-after"]).toBeDefined();
    expect(blocked.body.error).toMatch(/(reset|password)/i);
  });
});

// Regression: limiter middleware runs BEFORE the route's Zod schema, so
// hostile payloads like `email: 123` or `email: {}` must never crash the
// keyFn (or the route) into a 500. Each of these returns a clean 400.
describe("auth endpoints reject malformed body types without 500", () => {
  it("POST /auth/login with non-string email returns 400, not 500", async () => {
    const r1 = await request(app)
      .post("/api/auth/login")
      .send({ email: 12345, password: "Password123" });
    expect(r1.status).toBe(400);

    const r2 = await request(app)
      .post("/api/auth/login")
      .send({ email: { foo: "bar" }, password: "Password123" });
    expect(r2.status).toBe(400);

    const r3 = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: 99 });
    expect(r3.status).toBe(400);
  });

  it("POST /auth/register with non-string email returns 400, not 500", async () => {
    const r = await request(app)
      .post("/api/auth/register")
      .send({
        email: 42,
        password: "Password123",
        displayName: "x",
        securityQuestion: SECURITY_QUESTION,
        securityAnswer: "answer",
      });
    expect(r.status).toBe(400);
  });

  it("POST /auth/forgot-password/question with non-string email returns 400, not 500", async () => {
    const r = await request(app)
      .post("/api/auth/forgot-password/question")
      .send({ email: 1 });
    expect(r.status).toBe(400);
  });

  it("POST /auth/forgot-password/verify with non-string fields returns 400, not 500", async () => {
    const r = await request(app)
      .post("/api/auth/forgot-password/verify")
      .send({ email: {}, securityAnswer: 12 });
    expect(r.status).toBe(400);
  });

  it("POST /auth/forgot-password/reset with non-string fields returns 400, not 500", async () => {
    const r = await request(app)
      .post("/api/auth/forgot-password/reset")
      .send({ resetToken: 1, newPassword: 2 });
    expect(r.status).toBe(400);
  });

  it("PATCH /auth/password with non-string fields returns 400, not 500", async () => {
    const u = await createUser();

    const r1 = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ currentPassword: 12345, newPassword: "Brandnew1" });
    expect(r1.status).toBe(400);
    expect(typeof r1.body.error).toBe("string");

    const r2 = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ currentPassword: PASSWORD, newPassword: 99 });
    expect(r2.status).toBe(400);

    const r3 = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ currentPassword: PASSWORD, newPassword: { foo: "bar" } });
    expect(r3.status).toBe(400);

    const r4 = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${u.token}`)
      .send({ currentPassword: PASSWORD, newPassword: "short" });
    expect(r4.status).toBe(400);
  });

  it("PATCH /auth/security-question with non-string fields returns 400, not 500", async () => {
    const u = await createUser();

    const r1 = await request(app)
      .patch("/api/auth/security-question")
      .set("Authorization", `Bearer ${u.token}`)
      .send({
        currentPassword: 1,
        securityQuestion: SECURITY_QUESTION,
        securityAnswer: "answer",
      });
    expect(r1.status).toBe(400);
    expect(typeof r1.body.error).toBe("string");

    const r2 = await request(app)
      .patch("/api/auth/security-question")
      .set("Authorization", `Bearer ${u.token}`)
      .send({
        currentPassword: PASSWORD,
        securityQuestion: 42,
        securityAnswer: "answer",
      });
    expect(r2.status).toBe(400);

    const r3 = await request(app)
      .patch("/api/auth/security-question")
      .set("Authorization", `Bearer ${u.token}`)
      .send({
        currentPassword: PASSWORD,
        securityQuestion: SECURITY_QUESTION,
        securityAnswer: { foo: "bar" },
      });
    expect(r3.status).toBe(400);

    const r4 = await request(app)
      .patch("/api/auth/security-question")
      .set("Authorization", `Bearer ${u.token}`)
      .send({
        currentPassword: PASSWORD,
        securityQuestion: "Pertanyaan tidak ada di daftar",
        securityAnswer: "answer",
      });
    expect(r4.status).toBe(400);
  });
});

describe("Google OAuth login/registration", () => {
  const ENV_KEYS = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "PUBLIC_BASE_URL",
  ] as const;
  const savedEnv: Record<string, string | undefined> = {};

  beforeAll(() => {
    for (const k of ENV_KEYS) savedEnv[k] = process.env[k];
    process.env["GOOGLE_CLIENT_ID"] = "test-client-id.apps.googleusercontent.com";
    process.env["GOOGLE_CLIENT_SECRET"] = "test-client-secret";
    process.env["PUBLIC_BASE_URL"] = "http://localhost:5173";
  });

  afterAll(() => {
    for (const k of ENV_KEYS) {
      const v = savedEnv[k];
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  beforeEach(() => {
    mockExchange.mockReset();
  });

  function googleEmail(tag: string): string {
    return `${EMAIL_PREFIX}-g-${tag}-${randomBytes(4).toString("hex")}@example.test`;
  }

  it("GET /auth/google returns 503 when the client id is not configured", async () => {
    const saved = process.env["GOOGLE_CLIENT_ID"];
    delete process.env["GOOGLE_CLIENT_ID"];
    try {
      const res = await request(app).get("/api/auth/google");
      expect(res.status).toBe(503);
    } finally {
      process.env["GOOGLE_CLIENT_ID"] = saved;
    }
  });

  it("GET /auth/google redirects to Google's consent screen and sets a state cookie", async () => {
    const res = await request(app).get("/api/auth/google");
    expect(res.status).toBe(302);
    expect(res.headers["location"]).toContain("accounts.google.com");
    expect(res.headers["location"]).toContain(
      encodeURIComponent("http://localhost:5173/api/auth/google/callback"),
    );
    const setCookie = String(res.headers["set-cookie"] ?? "");
    expect(setCookie).toContain("g_oauth_state=");
  });

  it("callback with a mismatched state redirects to /login?error=google", async () => {
    const res = await request(app)
      .get("/api/auth/google/callback?code=abc&state=WRONG")
      .set("Cookie", "g_oauth_state=RIGHT");
    expect(res.status).toBe(302);
    expect(res.headers["location"]).toBe("/login?error=google");
    expect(mockExchange).not.toHaveBeenCalled();
  });

  it("callback with an unverified Google email redirects to /login?error=google_unverified", async () => {
    mockExchange.mockResolvedValue({
      googleId: `g-${randomBytes(6).toString("hex")}`,
      email: googleEmail("unverified"),
      emailVerified: false,
      name: "Unverified User",
      picture: null,
    });
    const res = await request(app)
      .get("/api/auth/google/callback?code=abc&state=S1")
      .set("Cookie", "g_oauth_state=S1");
    expect(res.status).toBe(302);
    expect(res.headers["location"]).toBe("/login?error=google_unverified");
  });

  it("callback for a brand-new Google user creates the account and sets a session cookie", async () => {
    const email = googleEmail("new");
    const googleId = `g-${randomBytes(8).toString("hex")}`;
    mockExchange.mockResolvedValue({
      googleId,
      email,
      emailVerified: true,
      name: "New Google User",
      picture: "https://example.test/p.png",
    });

    const res = await request(app)
      .get("/api/auth/google/callback?code=abc&state=S2")
      .set("Cookie", "g_oauth_state=S2");

    expect(res.status).toBe(302);
    expect(res.headers["location"]).toBe("/dashboard");
    expect(String(res.headers["set-cookie"] ?? "")).toContain("session_token=");

    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    expect(row).toBeDefined();
    seededIds.push(row.id);
    expect(row.googleId).toBe(googleId);
    expect(row.passwordHash).toBeNull();
    expect(row.securityAnswerHash).toBeNull();
    expect(row.displayName).toBe("New Google User");

    const sess = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, row.id));
    expect(sess.length).toBeGreaterThan(0);
  });

  it("callback links Google to an existing password account with the same verified email", async () => {
    const existing = await createUser();
    const googleId = `g-${randomBytes(8).toString("hex")}`;
    mockExchange.mockResolvedValue({
      googleId,
      email: existing.email,
      emailVerified: true,
      name: "Linked User",
      picture: null,
    });

    const before = await db
      .select({ c: users.id })
      .from(users)
      .where(like(users.email, `${EMAIL_PREFIX}%`));

    const res = await request(app)
      .get("/api/auth/google/callback?code=abc&state=S3")
      .set("Cookie", "g_oauth_state=S3");
    expect(res.status).toBe(302);
    expect(res.headers["location"]).toBe("/dashboard");

    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, existing.id))
      .limit(1);
    expect(row.googleId).toBe(googleId);
    // password + security answer are untouched on a link
    expect(row.passwordHash).not.toBeNull();

    const after = await db
      .select({ c: users.id })
      .from(users)
      .where(like(users.email, `${EMAIL_PREFIX}%`));
    expect(after.length).toBe(before.length); // no new user row
  });

  it("password login is refused for a Google-only account", async () => {
    const email = googleEmail("nopw");
    const [row] = await db
      .insert(users)
      .values({
        email,
        googleId: `g-${randomBytes(8).toString("hex")}`,
        displayName: "Google Only",
        selectedMode: "pro",
      })
      .returning();
    seededIds.push(row.id);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "whatever123" });
    expect(res.status).toBe(401);
    expect(String(res.body.error)).toContain("Google");
  });
});
