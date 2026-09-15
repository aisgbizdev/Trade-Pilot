import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, inArray, like, ilike } from "drizzle-orm";

import app from "../../app";
import { db } from "../../lib/db";
import {
  users,
  sessions,
  notifications,
  creditTopupRequests,
  creditLedger,
  creditBalances,
} from "@workspace/db/schema";
import { getTopupConfig } from "../../lib/credits";

type Role = "user" | "admin" | "super_admin";

interface SeedUser {
  id: number;
  email: string;
  token: string;
}

const RUN_ID = randomBytes(4).toString("hex");
const EMAIL_PREFIX = `topups-test-${RUN_ID}`;
// proofObjectPath is mandatory on every real POST /topups now — a fixed
// stand-in object path is all these tests need (nothing here exercises
// the actual file upload/storage path).
const PROOF_PATH = `objects/topups-test-${RUN_ID}-proof.jpg`;

const seededUserIds: number[] = [];
const seededRequestIds: number[] = [];

async function createUser(role: Role = "user"): Promise<SeedUser> {
  const suffix = randomBytes(6).toString("hex");
  const email = `${EMAIL_PREFIX}-${role}-${suffix}@example.test`;
  const passwordHash = await bcrypt.hash("not-used", 4);
  const securityAnswerHash = await bcrypt.hash("answer", 4);
  const [row] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      displayName: `Topups Test ${RUN_ID} ${role} ${suffix}`,
      role,
      securityQuestion: "test?",
      securityAnswerHash,
    })
    .returning({ id: users.id });

  const token = `topups-${RUN_ID}-${suffix}-${randomBytes(8).toString("hex")}`;
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

// POST /topups auto-approves every request now (see routes/topups.ts), so
// there's no longer a way to reach a "pending" row through the public API
// — insert one directly to exercise the admin review endpoints, which
// still matter for whatever a future rollback / manual review flow needs.
async function insertPendingTopup(user: SeedUser, amountRupiah: number): Promise<number> {
  const { rupiahPerCredit } = getTopupConfig();
  const [row] = await db
    .insert(creditTopupRequests)
    .values({
      userId: user.id,
      amountRupiah,
      creditsRequested: Math.floor(amountRupiah / rupiahPerCredit),
      conversionRateSnapshot: rupiahPerCredit,
      proofObjectPath: PROOF_PATH,
      status: "pending",
    })
    .returning({ id: creditTopupRequests.id });
  seededRequestIds.push(row!.id);
  return row!.id;
}

let alice: SeedUser;
let admin: SeedUser;
let superAdmin: SeedUser;

beforeAll(async () => {
  alice = await createUser("user");
  admin = await createUser("admin");
  superAdmin = await createUser("super_admin");
});

afterAll(async () => {
  const runMarker = `%${RUN_ID}%`;
  await db.delete(notifications).where(ilike(notifications.message, runMarker));
  if (seededRequestIds.length) {
    await db.delete(creditLedger).where(inArray(creditLedger.topupRequestId, seededRequestIds));
    await db.delete(creditTopupRequests).where(inArray(creditTopupRequests.id, seededRequestIds));
  }
  if (seededUserIds.length) {
    await db.delete(creditLedger).where(inArray(creditLedger.userId, seededUserIds));
    await db.delete(creditBalances).where(inArray(creditBalances.userId, seededUserIds));
    await db.delete(creditTopupRequests).where(inArray(creditTopupRequests.userId, seededUserIds));
    await db.delete(sessions).where(inArray(sessions.userId, seededUserIds));
    await db.delete(users).where(inArray(users.id, seededUserIds));
  }
  await db.delete(users).where(like(users.email, `${EMAIL_PREFIX}%`));
});

describe("GET /topups/config", () => {
  it("returns the current rate and QRIS image url", async () => {
    const res = await request(app).get("/api/topups/config").set(...authHeader(alice));
    expect(res.status).toBe(200);
    expect(res.body.rupiahPerCredit).toBe(getTopupConfig().rupiahPerCredit);
    expect(typeof res.body.qrisImageUrl).toBe("string");
  });
});

describe("GET /topups/balance", () => {
  it("returns 0 for a user with no top-ups yet", async () => {
    const res = await request(app).get("/api/topups/balance").set(...authHeader(alice));
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(0);
  });
});

describe("POST /topups", () => {
  it("returns 401 without auth", async () => {
    const res = await request(app).post("/api/topups").send({ amountRupiah: 5000 });
    expect(res.status).toBe(401);
  });

  it("rejects an amount too small to buy even 1 credit", async () => {
    const res = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah: 1, proofObjectPath: PROOF_PATH });
    expect(res.status).toBe(400);
  });

  it("rejects a request with no payment proof", async () => {
    const res = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah: getTopupConfig().rupiahPerCredit * 5 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/bukti transfer/i);
  });

  it("rejects a request with a blank payment proof", async () => {
    const res = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah: getTopupConfig().rupiahPerCredit * 5, proofObjectPath: "   " });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/bukti transfer/i);
  });

  it("auto-approves on submit, credits the balance immediately, and notifies the user", async () => {
    const { rupiahPerCredit } = getTopupConfig();
    const amountRupiah = rupiahPerCredit * 20;
    const before = await request(app).get("/api/topups/balance").set(...authHeader(alice));

    const res = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah, paymentReferenceNote: `note-${RUN_ID}`, proofObjectPath: PROOF_PATH });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("approved");
    expect(res.body.creditsRequested).toBe(20);
    expect(res.body.creditsGranted).toBe(20);
    expect(res.body.conversionRateSnapshot).toBe(rupiahPerCredit);
    expect(res.body.proofObjectPath).toBe(PROOF_PATH);
    seededRequestIds.push(res.body.id);

    const after = await request(app).get("/api/topups/balance").set(...authHeader(alice));
    expect(after.body.balance).toBe(before.body.balance + 20);

    const ledgerRows = await db
      .select()
      .from(creditLedger)
      .where(eq(creditLedger.topupRequestId, res.body.id));
    expect(ledgerRows).toHaveLength(1);
    expect(ledgerRows[0]!.amount).toBe(20);

    // Fresh test users default to users.lang = "en", so the notification is
    // sent in English, not Indonesian.
    const notif = await db.select().from(notifications).where(eq(notifications.userId, alice.id));
    expect(notif.some((n) => n.title === "Top-up approved")).toBe(true);
  });
});

describe("GET /topups/mine", () => {
  it("only returns the caller's own requests", async () => {
    const res = await request(app)
      .get("/api/topups/mine")
      .set(...authHeader(alice));
    expect(res.status).toBe(200);
    expect(res.body.requests.every((r: { userId: number }) => r.userId === alice.id)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /admin/topups", () => {
  it("returns 403 for a regular user", async () => {
    const res = await request(app)
      .get("/api/admin/topups")
      .set(...authHeader(alice));
    expect(res.status).toBe(403);
  });

  it("lists pending requests with the requester's email/name for an admin", async () => {
    const pendingId = await insertPendingTopup(alice, getTopupConfig().rupiahPerCredit * 6);
    const res = await request(app)
      .get("/api/admin/topups")
      .set(...authHeader(admin))
      .query({ status: "pending" });
    expect(res.status).toBe(200);
    const mine = res.body.requests.find((r: { id: number }) => r.id === pendingId);
    expect(mine).toBeDefined();
    expect(mine.userEmail).toBe(alice.email);
  });
});

// POST /topups no longer produces a "pending" row to review (it
// auto-approves — see above), but the admin review endpoints themselves
// are unchanged and still need to work correctly against whatever pending
// rows exist (e.g. from before this rollout, or a future rollback) —
// seed those directly rather than through the API.
describe("PATCH /admin/topups/:id/status", () => {
  it("returns 403 for a plain admin (approval requires super_admin)", async () => {
    const id = await insertPendingTopup(alice, getTopupConfig().rupiahPerCredit * 5);

    const res = await request(app)
      .patch(`/api/admin/topups/${id}/status`)
      .set(...authHeader(admin))
      .send({ status: "approved" });
    expect(res.status).toBe(403);
  });

  it("approves a request, credits the balance, and notifies the user", async () => {
    const id = await insertPendingTopup(alice, getTopupConfig().rupiahPerCredit * 7);

    const before = await request(app).get("/api/topups/balance").set(...authHeader(alice));
    const balanceBefore = before.body.balance as number;

    const res = await request(app)
      .patch(`/api/admin/topups/${id}/status`)
      .set(...authHeader(superAdmin))
      .send({ status: "approved" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("approved");
    expect(res.body.creditsGranted).toBe(7);

    const after = await request(app).get("/api/topups/balance").set(...authHeader(alice));
    expect(after.body.balance).toBe(balanceBefore + 7);

    const ledgerRows = await db.select().from(creditLedger).where(eq(creditLedger.topupRequestId, id));
    expect(ledgerRows).toHaveLength(1);
    expect(ledgerRows[0]!.amount).toBe(7);

    // Fresh test users default to users.lang = "en", so the notification is
    // sent in English, not Indonesian.
    const notif = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, alice.id));
    expect(notif.some((n) => n.title === "Top-up approved")).toBe(true);
  });

  it("rejects a request without touching the credit balance", async () => {
    const id = await insertPendingTopup(alice, getTopupConfig().rupiahPerCredit * 3);

    const before = await request(app).get("/api/topups/balance").set(...authHeader(alice));

    const res = await request(app)
      .patch(`/api/admin/topups/${id}/status`)
      .set(...authHeader(superAdmin))
      .send({ status: "rejected", reviewNote: "bukti tidak jelas" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("rejected");
    expect(res.body.creditsGranted).toBeNull();

    const after = await request(app).get("/api/topups/balance").set(...authHeader(alice));
    expect(after.body.balance).toBe(before.body.balance);
  });

  it("only lets one of two concurrent reviews win; the other gets 409", async () => {
    const id = await insertPendingTopup(alice, getTopupConfig().rupiahPerCredit * 4);

    const [resA, resB] = await Promise.all([
      request(app)
        .patch(`/api/admin/topups/${id}/status`)
        .set(...authHeader(superAdmin))
        .send({ status: "approved" }),
      request(app)
        .patch(`/api/admin/topups/${id}/status`)
        .set(...authHeader(superAdmin))
        .send({ status: "approved" }),
    ]);
    const statuses = [resA.status, resB.status].sort();
    expect(statuses).toEqual([200, 409]);

    const ledgerRows = await db.select().from(creditLedger).where(eq(creditLedger.topupRequestId, id));
    expect(ledgerRows).toHaveLength(1);
  });
});

describe("GET /admin/topups/summary", () => {
  it("returns 403 for a plain user and for a plain admin", async () => {
    const resUser = await request(app).get("/api/admin/topups/summary").set(...authHeader(alice));
    expect(resUser.status).toBe(403);
    const resAdmin = await request(app).get("/api/admin/topups/summary").set(...authHeader(admin));
    expect(resAdmin.status).toBe(403);
  });

  it("sums only approved rows, grouped by user, excluding pending/rejected", async () => {
    const bob = await createUser("user");

    // POST /topups now auto-approves, so "submit" alone gets the request
    // into the "approved" state with creditsGranted == creditsRequested —
    // there is no separate admin-approval step to call anymore.
    async function submitAndApprove(user: SeedUser, amountRupiah: number, creditsGranted: number) {
      const created = await request(app)
        .post("/api/topups")
        .set(...authHeader(user))
        .send({ amountRupiah, proofObjectPath: PROOF_PATH });
      expect(created.status).toBe(201);
      expect(created.body.status).toBe("approved");
      expect(created.body.creditsGranted).toBe(creditsGranted);
      seededRequestIds.push(created.body.id);
      return created.body.id as number;
    }

    // Rejected/pending rows can no longer be produced through the public
    // API (see above) — seed a pending row directly, then (for "reject")
    // drive it through the real admin endpoint.
    async function submitAndReject(user: SeedUser, amountRupiah: number) {
      const id = await insertPendingTopup(user, amountRupiah);
      await request(app)
        .patch(`/api/admin/topups/${id}/status`)
        .set(...authHeader(superAdmin))
        .send({ status: "rejected" });
    }

    async function submitPending(user: SeedUser, amountRupiah: number) {
      await insertPendingTopup(user, amountRupiah);
    }

    const rate = getTopupConfig().rupiahPerCredit;
    await submitAndApprove(bob, rate * 20, 20); // Rp = rate*20, credits 20
    await submitAndApprove(bob, rate * 10, 10); // Rp = rate*10, credits 10
    await submitAndReject(bob, rate * 999); // must not count
    await submitPending(bob, rate * 888); // must not count

    const other = await createUser("user");
    await submitAndApprove(other, rate * 5, 5);

    const res = await request(app).get("/api/admin/topups/summary").set(...authHeader(superAdmin));
    expect(res.status).toBe(200);

    const bobRow = res.body.byUser.find((r: { userId: number }) => r.userId === bob.id);
    expect(bobRow).toMatchObject({
      totalAmountRupiah: rate * 30,
      totalCreditsGranted: 30,
      requestCount: 2,
    });
    expect(bobRow.lastApprovedAt).not.toBeNull();

    const otherRow = res.body.byUser.find((r: { userId: number }) => r.userId === other.id);
    expect(otherRow).toMatchObject({
      totalAmountRupiah: rate * 5,
      totalCreditsGranted: 5,
      requestCount: 1,
    });

    // Totals include at least this test's approved rows (other tests in this
    // file/suite may also contribute approved rows to the shared totals, so
    // assert a lower bound rather than exact equality).
    expect(res.body.totalAmountRupiah).toBeGreaterThanOrEqual(rate * 35);
    expect(res.body.totalCreditsGranted).toBeGreaterThanOrEqual(35);
    expect(res.body.approvedRequestCount).toBeGreaterThanOrEqual(3);
  });

  it("excludes a user with only a pending or rejected request from byUser", async () => {
    const carol = await createUser("user");
    await insertPendingTopup(carol, getTopupConfig().rupiahPerCredit * 3);
    // Left pending — never approved.

    const res = await request(app).get("/api/admin/topups/summary").set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    expect(res.body.byUser.some((r: { userId: number }) => r.userId === carol.id)).toBe(false);
  });
});
