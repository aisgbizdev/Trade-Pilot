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
      .send({ amountRupiah: 1 });
    expect(res.status).toBe(400);
  });

  it("creates a pending request with the correct computed credits", async () => {
    const { rupiahPerCredit } = getTopupConfig();
    const amountRupiah = rupiahPerCredit * 20;
    const res = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah, paymentReferenceNote: `note-${RUN_ID}` });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
    expect(res.body.creditsRequested).toBe(20);
    expect(res.body.conversionRateSnapshot).toBe(rupiahPerCredit);
    seededRequestIds.push(res.body.id);
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
    const res = await request(app)
      .get("/api/admin/topups")
      .set(...authHeader(admin))
      .query({ status: "pending" });
    expect(res.status).toBe(200);
    const mine = res.body.requests.find((r: { userId: number }) => r.userId === alice.id);
    expect(mine).toBeDefined();
    expect(mine.userEmail).toBe(alice.email);
  });
});

describe("PATCH /admin/topups/:id/status", () => {
  it("returns 403 for a plain admin (approval requires super_admin)", async () => {
    const created = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah: getTopupConfig().rupiahPerCredit * 5 });
    seededRequestIds.push(created.body.id);

    const res = await request(app)
      .patch(`/api/admin/topups/${created.body.id}/status`)
      .set(...authHeader(admin))
      .send({ status: "approved" });
    expect(res.status).toBe(403);
  });

  it("approves a request, credits the balance, and notifies the user", async () => {
    const created = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah: getTopupConfig().rupiahPerCredit * 7 });
    seededRequestIds.push(created.body.id);

    const before = await request(app).get("/api/topups/balance").set(...authHeader(alice));
    const balanceBefore = before.body.balance as number;

    const res = await request(app)
      .patch(`/api/admin/topups/${created.body.id}/status`)
      .set(...authHeader(superAdmin))
      .send({ status: "approved" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("approved");
    expect(res.body.creditsGranted).toBe(7);

    const after = await request(app).get("/api/topups/balance").set(...authHeader(alice));
    expect(after.body.balance).toBe(balanceBefore + 7);

    const ledgerRows = await db
      .select()
      .from(creditLedger)
      .where(eq(creditLedger.topupRequestId, created.body.id));
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
    const created = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah: getTopupConfig().rupiahPerCredit * 3 });
    seededRequestIds.push(created.body.id);

    const before = await request(app).get("/api/topups/balance").set(...authHeader(alice));

    const res = await request(app)
      .patch(`/api/admin/topups/${created.body.id}/status`)
      .set(...authHeader(superAdmin))
      .send({ status: "rejected", reviewNote: "bukti tidak jelas" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("rejected");
    expect(res.body.creditsGranted).toBeNull();

    const after = await request(app).get("/api/topups/balance").set(...authHeader(alice));
    expect(after.body.balance).toBe(before.body.balance);
  });

  it("only lets one of two concurrent reviews win; the other gets 409", async () => {
    const created = await request(app)
      .post("/api/topups")
      .set(...authHeader(alice))
      .send({ amountRupiah: getTopupConfig().rupiahPerCredit * 4 });
    seededRequestIds.push(created.body.id);

    const [resA, resB] = await Promise.all([
      request(app)
        .patch(`/api/admin/topups/${created.body.id}/status`)
        .set(...authHeader(superAdmin))
        .send({ status: "approved" }),
      request(app)
        .patch(`/api/admin/topups/${created.body.id}/status`)
        .set(...authHeader(superAdmin))
        .send({ status: "approved" }),
    ]);
    const statuses = [resA.status, resB.status].sort();
    expect(statuses).toEqual([200, 409]);

    const ledgerRows = await db
      .select()
      .from(creditLedger)
      .where(eq(creditLedger.topupRequestId, created.body.id));
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

    async function submitAndApprove(user: SeedUser, amountRupiah: number, creditsGranted: number) {
      const created = await request(app)
        .post("/api/topups")
        .set(...authHeader(user))
        .send({ amountRupiah });
      seededRequestIds.push(created.body.id);
      const reviewed = await request(app)
        .patch(`/api/admin/topups/${created.body.id}/status`)
        .set(...authHeader(superAdmin))
        .send({ status: "approved", creditsGranted });
      expect(reviewed.status).toBe(200);
      return created.body.id as number;
    }

    async function submitAndReject(user: SeedUser, amountRupiah: number) {
      const created = await request(app)
        .post("/api/topups")
        .set(...authHeader(user))
        .send({ amountRupiah });
      seededRequestIds.push(created.body.id);
      await request(app)
        .patch(`/api/admin/topups/${created.body.id}/status`)
        .set(...authHeader(superAdmin))
        .send({ status: "rejected" });
    }

    async function submitPending(user: SeedUser, amountRupiah: number) {
      const created = await request(app)
        .post("/api/topups")
        .set(...authHeader(user))
        .send({ amountRupiah });
      seededRequestIds.push(created.body.id);
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
    const created = await request(app)
      .post("/api/topups")
      .set(...authHeader(carol))
      .send({ amountRupiah: getTopupConfig().rupiahPerCredit * 3 });
    seededRequestIds.push(created.body.id);
    // Left pending — never approved.

    const res = await request(app).get("/api/admin/topups/summary").set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    expect(res.body.byUser.some((r: { userId: number }) => r.userId === carol.id)).toBe(false);
  });
});
