import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, inArray, ilike, like } from "drizzle-orm";

import app from "../../app";
import { db } from "../../lib/db";
import {
  users,
  sessions,
  notifications,
} from "@workspace/db/schema";

type Role = "user" | "admin" | "super_admin";

interface SeedUser {
  id: number;
  email: string;
  token: string;
}

const RUN_ID = randomBytes(4).toString("hex");
const EMAIL_PREFIX = `sa-users-test-${RUN_ID}`;
const DISPLAY_PREFIX = `SA Users Test ${RUN_ID}`;

const seeded: SeedUser[] = [];
let superAdmin: SeedUser;
let admin: SeedUser;
let regularUser: SeedUser;
// Two more "needle" users with distinctive email/displayName to test search.
let searchByEmail: SeedUser;
let searchByName: SeedUser;

async function createUser(
  role: Role,
  opts: { emailExtra?: string; displayName?: string } = {},
): Promise<SeedUser> {
  const suffix = randomBytes(6).toString("hex");
  const emailExtra = opts.emailExtra ?? "";
  const email = `${EMAIL_PREFIX}-${role}-${emailExtra}${suffix}@example.test`;
  const passwordHash = await bcrypt.hash("not-used-by-tests", 4);
  const securityAnswerHash = await bcrypt.hash("answer", 4);

  const [row] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      displayName: opts.displayName ?? `${DISPLAY_PREFIX} ${role} ${suffix}`,
      role,
      securityQuestion: "test?",
      securityAnswerHash,
    })
    .returning({ id: users.id });

  const token = `sa-users-${RUN_ID}-${suffix}-${randomBytes(8).toString("hex")}`;
  await db.insert(sessions).values({
    userId: row.id,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  const seed: SeedUser = { id: row.id, email, token };
  seeded.push(seed);
  return seed;
}

function authHeader(user: SeedUser): [string, string] {
  return ["Authorization", `Bearer ${user.token}`];
}

beforeAll(async () => {
  superAdmin = await createUser("super_admin");
  admin = await createUser("admin");
  regularUser = await createUser("user");
  // Distinctive email needle so we can search by email exactly.
  searchByEmail = await createUser("user", {
    emailExtra: `needle-email-${RUN_ID}-`,
  });
  // Distinctive display name so we can search by name.
  searchByName = await createUser("user", {
    displayName: `Needle Display ${RUN_ID} Person`,
  });
});

afterAll(async () => {
  // POST /superadmin/users and DELETE /superadmin/users/:id both fan out
  // notifications ("Pengguna Baru Terdaftar" / "Pengguna Dihapus") to admins
  // and super_admins on the live DB. Our created users always carry the
  // RUN_ID in their displayName, which is interpolated into the message —
  // so we can scrub by RUN_ID marker without touching real notifications.
  const runMarker = `%${RUN_ID}%`;
  await db.delete(notifications).where(ilike(notifications.message, runMarker));

  // Now scrub everything we created during the test, including users
  // created via the route under test (whose emails carry the RUN_ID).
  const createdRows = await db
    .select({ id: users.id })
    .from(users)
    .where(like(users.email, `${EMAIL_PREFIX}%`));
  const allIds = Array.from(
    new Set([...seeded.map((u) => u.id), ...createdRows.map((r) => r.id)]),
  );

  if (allIds.length === 0) return;
  await db.delete(notifications).where(inArray(notifications.userId, allIds));
  await db.delete(sessions).where(inArray(sessions.userId, allIds));
  await db.delete(users).where(inArray(users.id, allIds));

  // Final sweep: notifyAdminsUserCreated / notifySuperAdminsUserDeleted are
  // fire-and-forget (`void`). A late insert can race past the first sweep
  // above. Wait a short tick and re-purge any stragglers carrying our
  // RUN_ID marker. Both message templates interpolate the displayName, which
  // always contains RUN_ID for users we created.
  await new Promise((r) => setTimeout(r, 100));
  await db.delete(notifications).where(ilike(notifications.message, runMarker));
});

describe("requireSuperAdmin gate on /superadmin/users surface", () => {
  // GET /superadmin/users
  it("GET /superadmin/users returns 401 without auth", async () => {
    const res = await request(app).get("/api/superadmin/users");
    expect(res.status).toBe(401);
  });

  it("GET /superadmin/users returns 403 for role=user", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .set(...authHeader(regularUser));
    expect(res.status).toBe(403);
  });

  it("GET /superadmin/users returns 403 for role=admin", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .set(...authHeader(admin));
    expect(res.status).toBe(403);
  });

  it("GET /superadmin/users returns 200 for role=super_admin", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  // POST /superadmin/users
  it("POST /superadmin/users returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .send({});
    expect(res.status).toBe(401);
  });

  it("POST /superadmin/users returns 403 for role=user", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(regularUser))
      .send({});
    expect(res.status).toBe(403);
  });

  it("POST /superadmin/users returns 403 for role=admin", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(admin))
      .send({});
    expect(res.status).toBe(403);
  });

  it("POST /superadmin/users returns 201 for role=super_admin with valid payload", async () => {
    const suffix = randomBytes(4).toString("hex");
    const email = `${EMAIL_PREFIX}-gate-${suffix}@example.test`;
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send({
        email,
        password: "Password1!",
        displayName: `${DISPLAY_PREFIX} gate ${suffix}`,
        securityQuestion: "q?",
        securityAnswer: "a",
      });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email.toLowerCase());
  });

  // DELETE /superadmin/users/:id
  it("DELETE /superadmin/users/:id returns 401 without auth", async () => {
    const res = await request(app).delete(
      `/api/superadmin/users/${regularUser.id}`,
    );
    expect(res.status).toBe(401);
  });

  it("DELETE /superadmin/users/:id returns 403 for role=user", async () => {
    const res = await request(app)
      .delete(`/api/superadmin/users/${regularUser.id}`)
      .set(...authHeader(regularUser));
    expect(res.status).toBe(403);
  });

  it("DELETE /superadmin/users/:id returns 403 for role=admin", async () => {
    const res = await request(app)
      .delete(`/api/superadmin/users/${regularUser.id}`)
      .set(...authHeader(admin));
    expect(res.status).toBe(403);
  });
});

describe("POST /superadmin/users validation", () => {
  function buildPayload(overrides: Record<string, unknown> = {}) {
    const suffix = randomBytes(4).toString("hex");
    return {
      email: `${EMAIL_PREFIX}-create-${suffix}@example.test`,
      password: "Password1!",
      displayName: `${DISPLAY_PREFIX} created ${suffix}`,
      role: "user",
      selectedMode: "beginner",
      securityQuestion: "fav color?",
      securityAnswer: "blue",
      ...overrides,
    };
  }

  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(buildPayload({ email: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is missing", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(buildPayload({ password: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when displayName is missing", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(buildPayload({ displayName: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when securityQuestion is missing", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(buildPayload({ securityQuestion: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when securityAnswer is missing", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(buildPayload({ securityAnswer: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid role", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(buildPayload({ role: "wizard" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid selectedMode", async () => {
    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(buildPayload({ selectedMode: "expert" }));
    expect(res.status).toBe(400);
  });

  it("returns 409 for duplicate email (case-insensitive)", async () => {
    const payload = buildPayload();
    const r1 = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(payload);
    expect(r1.status).toBe(201);

    // Same email, different case — must still conflict.
    const r2 = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send({ ...payload, email: payload.email.toUpperCase() });
    expect(r2.status).toBe(409);
  });

  it("returns 201 and persists the user with default role/mode", async () => {
    const payload = buildPayload();
    // Strip role/mode to confirm defaults.
    delete (payload as Partial<typeof payload>).role;
    delete (payload as Partial<typeof payload>).selectedMode;

    const res = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(payload.email.toLowerCase());
    expect(res.body.role).toBe("user");
    expect(res.body.selectedMode).toBe("beginner");

    const [row] = await db
      .select({ id: users.id, role: users.role, selectedMode: users.selectedMode })
      .from(users)
      .where(eq(users.id, res.body.id))
      .limit(1);
    expect(row).toBeDefined();
    expect(row.role).toBe("user");
    expect(row.selectedMode).toBe("beginner");
  });
});

describe("GET /superadmin/users search and pagination", () => {
  it("filters by email substring", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .query({ search: `needle-email-${RUN_ID}` })
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    const ids: number[] = res.body.users.map((u: { id: number }) => u.id);
    expect(ids).toContain(searchByEmail.id);
    // Other seeded users (without the needle) must not match.
    expect(ids).not.toContain(regularUser.id);
    expect(ids).not.toContain(admin.id);
    expect(ids).not.toContain(superAdmin.id);
  });

  it("filters by display name substring", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .query({ search: `Needle Display ${RUN_ID}` })
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    const ids: number[] = res.body.users.map((u: { id: number }) => u.id);
    expect(ids).toContain(searchByName.id);
    expect(ids).not.toContain(regularUser.id);
  });

  it("clamps page to >= 1", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .query({ page: "0", limit: "5" })
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(5);
  });

  it("clamps negative page and limit to safe minimums", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .query({ page: "-3", limit: "-9" })
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(1);
  });

  it("clamps oversized limit to 200", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .query({ page: "1", limit: "9999" })
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(200);
  });

  it("falls back to defaults for non-numeric page/limit", async () => {
    const res = await request(app)
      .get("/api/superadmin/users")
      .query({ page: "abc", limit: "xyz" })
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(50);
  });
});

describe("DELETE /superadmin/users/:id", () => {
  it("removes the user when they exist", async () => {
    // Seed a victim user via the route under test, then delete it.
    const victimEmail = `${EMAIL_PREFIX}-victim-${randomBytes(4).toString("hex")}@example.test`;
    const create = await request(app)
      .post("/api/superadmin/users")
      .set(...authHeader(superAdmin))
      .send({
        email: victimEmail,
        password: "Password1!",
        displayName: `${DISPLAY_PREFIX} victim`,
        securityQuestion: "q?",
        securityAnswer: "a",
      });
    expect(create.status).toBe(201);
    const victimId: number = create.body.id;

    const res = await request(app)
      .delete(`/api/superadmin/users/${victimId}`)
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(200);

    const [row] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, victimId))
      .limit(1);
    expect(row).toBeUndefined();
  });

  it("returns 400 when super_admin tries to delete themselves", async () => {
    const res = await request(app)
      .delete(`/api/superadmin/users/${superAdmin.id}`)
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(400);

    // Self must still exist.
    const [row] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, superAdmin.id))
      .limit(1);
    expect(row).toBeDefined();
  });

  it("returns 404 for an unknown user id", async () => {
    const res = await request(app)
      .delete(`/api/superadmin/users/999999999`)
      .set(...authHeader(superAdmin));
    expect(res.status).toBe(404);
  });
});
