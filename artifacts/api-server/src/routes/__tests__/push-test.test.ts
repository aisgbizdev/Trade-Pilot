/**
 * Tests for `POST /api/push/test` — the "send a sample push to my own
 * devices" endpoint that powers the test button on the Notifications
 * page. Covers the auth gate, the empty-subscriptions short-circuit,
 * the happy path with a stubbed dispatcher, and the per-user rate
 * limiter behaviour.
 *
 * `../../lib/webpush.sendPushToUser` is mocked so the test never
 * reaches the real FCM/APNs endpoints — and so the test does not
 * depend on the runtime VAPID configuration (the lib short-circuits
 * silently when the keys are unset, which is the default in the test
 * env). The route itself is unit-under-test: it counts subscriptions,
 * dispatches once per request, and surfaces the count to the client.
 */
import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from "vitest";
import request from "supertest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, inArray, like } from "drizzle-orm";

vi.mock("../../lib/webpush", () => ({
  sendPushToUser: vi.fn(async () => {}),
  sendPushToUsers: vi.fn(async () => {}),
  sendPushToAllSubscribed: vi.fn(async () => {}),
}));

import { sendPushToUser } from "../../lib/webpush";
import app from "../../app";
import { db } from "../../lib/db";
import { users, sessions, pushSubscriptions } from "@workspace/db/schema";
import { pushTestLimiter } from "../../middleware/rate-limit";

const sendPushToUserMock = sendPushToUser as unknown as ReturnType<typeof vi.fn>;

const RUN_ID = randomBytes(4).toString("hex");
const EMAIL_PREFIX = `push-test-${RUN_ID}`;

interface SeedUser {
  id: number;
  email: string;
  token: string;
}

const seededUserIds: number[] = [];

let alice: SeedUser;
let bob: SeedUser;

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
      displayName: `Push Test ${RUN_ID} ${suffix}`,
      securityQuestion: "test?",
      securityAnswerHash,
    })
    .returning({ id: users.id });

  const token = `push-${RUN_ID}-${suffix}-${randomBytes(8).toString("hex")}`;
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

async function seedSubscription(userId: number, endpointSuffix: string): Promise<string> {
  const endpoint = `https://fcm.googleapis.com/fcm/send/${endpointSuffix}-${randomBytes(4).toString("hex")}`;
  await db.insert(pushSubscriptions).values({
    userId,
    endpoint,
    p256dh: `p256-${endpointSuffix}`,
    auth: `auth-${endpointSuffix}`,
  });
  return endpoint;
}

beforeAll(async () => {
  alice = await createUser();
  bob = await createUser();
});

afterAll(async () => {
  if (seededUserIds.length > 0) {
    await db.delete(pushSubscriptions).where(inArray(pushSubscriptions.userId, seededUserIds));
    await db.delete(sessions).where(inArray(sessions.userId, seededUserIds));
    await db.delete(users).where(inArray(users.id, seededUserIds));
  }
  await db.delete(users).where(like(users.email, `${EMAIL_PREFIX}%`));
});

beforeEach(() => {
  sendPushToUserMock.mockClear();
  // The per-user rate limiter is a long-lived in-memory map; flush it
  // between tests so a "rate limited" assertion in one case does not
  // poison the next one.
  pushTestLimiter.store.clear();
});

describe("POST /push/test auth gate", () => {
  it("returns 401 without auth", async () => {
    const res = await request(app).post("/api/push/test");
    expect(res.status).toBe(401);
    expect(sendPushToUserMock).not.toHaveBeenCalled();
  });

  it("returns 401 with a bogus bearer token", async () => {
    const res = await request(app)
      .post("/api/push/test")
      .set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
    expect(sendPushToUserMock).not.toHaveBeenCalled();
  });
});

describe("POST /push/test no subscriptions", () => {
  it("returns 404 when the user has no push subscriptions and never invokes the dispatcher", async () => {
    // Make sure alice has zero subscriptions for this case.
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, alice.id));

    const res = await request(app).post("/api/push/test").set(...authHeader(alice));
    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
    expect(sendPushToUserMock).not.toHaveBeenCalled();
  });
});

describe("POST /push/test happy path", () => {
  it("dispatches once for the caller and returns the device count", async () => {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, alice.id));
    await seedSubscription(alice.id, "phone");
    await seedSubscription(alice.id, "tablet");

    const res = await request(app).post("/api/push/test").set(...authHeader(alice));
    expect(res.status).toBe(200);
    // Both subscription rows owned by alice should be reflected back so
    // the UI can say "we tried 2 devices".
    expect(res.body.delivered).toBe(2);

    // The route fans out internally inside sendPushToUser, so it should
    // be called exactly once per request — with alice's user id and a
    // payload that carries title + body for the OS pop-up.
    expect(sendPushToUserMock).toHaveBeenCalledTimes(1);
    const [calledUserId, calledPayload] = sendPushToUserMock.mock.calls[0] as [
      number,
      { title: string; body: string; tag?: string },
    ];
    expect(calledUserId).toBe(alice.id);
    expect(calledPayload.title).toBeTruthy();
    expect(calledPayload.body).toBeTruthy();
  });

  it("never dispatches on behalf of another user", async () => {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, alice.id));
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, bob.id));
    await seedSubscription(alice.id, "phone");
    await seedSubscription(bob.id, "phone");

    const res = await request(app).post("/api/push/test").set(...authHeader(alice));
    expect(res.status).toBe(200);
    expect(res.body.delivered).toBe(1);

    // Bob's id must never appear in the dispatcher invocations even
    // though he also has a subscription row in the table.
    const calledUserIds = sendPushToUserMock.mock.calls.map((c: unknown[]) => c[0] as number);
    expect(calledUserIds).toEqual([alice.id]);
  });
});

describe("POST /push/test rate limit", () => {
  it("returns 429 once the per-user quota is exhausted within the window", async () => {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, alice.id));
    await seedSubscription(alice.id, "phone");

    // Limiter is configured at 10/hour per user. Burn through the quota
    // and assert the 11th call is rejected with 429.
    for (let i = 0; i < 10; i++) {
      const ok = await request(app).post("/api/push/test").set(...authHeader(alice));
      expect(ok.status).toBe(200);
    }

    const blocked = await request(app).post("/api/push/test").set(...authHeader(alice));
    expect(blocked.status).toBe(429);
    expect(blocked.headers["retry-after"]).toBeTruthy();
  });

  it("isolates limiter buckets by user — bob is not limited by alice's burst", async () => {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, alice.id));
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, bob.id));
    await seedSubscription(alice.id, "phone");
    await seedSubscription(bob.id, "phone");

    // Exhaust alice's bucket.
    for (let i = 0; i < 10; i++) {
      await request(app).post("/api/push/test").set(...authHeader(alice));
    }
    const aliceBlocked = await request(app).post("/api/push/test").set(...authHeader(alice));
    expect(aliceBlocked.status).toBe(429);

    // Bob in the same window must still be allowed.
    const bobOk = await request(app).post("/api/push/test").set(...authHeader(bob));
    expect(bobOk.status).toBe(200);
  });
});
