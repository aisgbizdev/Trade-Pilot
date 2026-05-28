import { describe, it, expect, afterAll, vi } from "vitest";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { inArray } from "drizzle-orm";

import { db } from "../db";
import { users, analyses, tradeJournal } from "@workspace/db/schema";

// Stub the calendar lookup so high-risk-window detection is deterministic
// and never depends on the live upstream feed. Must be in place BEFORE
// importing the module under test.
const mockCalendar = vi.fn();
vi.mock("../calendar", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("../calendar");
  return {
    ...actual,
    getRelevantCalendar: (instrument: string, opts: unknown) =>
      mockCalendar(instrument, opts),
  };
});

import { detectGuardrailSignals } from "../anti-pattern";

const RUN_ID = randomBytes(4).toString("hex");
const seededUserIds: number[] = [];

async function createUser(
  overrides: Partial<typeof users.$inferInsert> = {},
): Promise<number> {
  const suffix = randomBytes(6).toString("hex");
  const [row] = await db
    .insert(users)
    .values({
      email: `guardrail-${RUN_ID}-${suffix}@example.test`,
      passwordHash: await bcrypt.hash("x", 4),
      displayName: `Guard ${RUN_ID} ${suffix}`,
      securityQuestion: "q?",
      securityAnswerHash: await bcrypt.hash("a", 4),
      ...overrides,
    })
    .returning({ id: users.id });
  seededUserIds.push(row.id);
  return row.id;
}

afterAll(async () => {
  if (seededUserIds.length > 0) {
    await db
      .delete(tradeJournal)
      .where(inArray(tradeJournal.userId, seededUserIds));
    await db.delete(analyses).where(inArray(analyses.userId, seededUserIds));
    await db.delete(users).where(inArray(users.id, seededUserIds));
  }
});

describe("detectGuardrailSignals", () => {
  it("returns no signals for a fresh user with all toggles default-on", async () => {
    mockCalendar.mockResolvedValue([]);
    const id = await createUser();
    const result = await detectGuardrailSignals(id, "EUR/USD");
    expect(result).not.toBeNull();
    expect(result!.signals).toEqual([]);
    expect(result!.prefs.revenge).toBe(true);
  });

  it("fires revenge when a same-instrument loss landed within 5 minutes", async () => {
    mockCalendar.mockResolvedValue([]);
    const id = await createUser();
    const now = Date.now();
    await db.insert(tradeJournal).values({
      userId: id,
      instrument: "XAU/USD",
      side: "buy",
      outcome: "loss",
      pnlPercent: "0.8",
      tradedAt: new Date(now - 3 * 60_000),
    });
    const result = await detectGuardrailSignals(id, "XAU/USD", { now });
    const revenge = result!.signals.find((s) => s.kind === "revenge");
    expect(revenge).toBeTruthy();
    if (revenge && revenge.kind === "revenge") {
      expect(revenge.minutesSinceLoss).toBe(3);
    }
  });

  it("does not fire revenge for a different instrument", async () => {
    mockCalendar.mockResolvedValue([]);
    const id = await createUser();
    const now = Date.now();
    await db.insert(tradeJournal).values({
      userId: id,
      instrument: "EUR/USD",
      side: "buy",
      outcome: "loss",
      pnlPercent: "0.8",
      tradedAt: new Date(now - 2 * 60_000),
    });
    const result = await detectGuardrailSignals(id, "XAU/USD", { now });
    expect(result!.signals.find((s) => s.kind === "revenge")).toBeUndefined();
  });

  it("fires overtrading (hour) at 5 analyses in the last hour", async () => {
    mockCalendar.mockResolvedValue([]);
    const id = await createUser();
    const now = Date.now();
    const rows = Array.from({ length: 5 }, (_, i) => ({
      userId: id,
      instrument: "EUR/USD",
      timeframe: "1h" as const,
      mode: "beginner" as const,
      validUntil: new Date(now + 60 * 60_000),
      marketCondition: "ranging" as const,
      riskLevel: "low" as const,
      confidenceMin: 50,
      confidenceMax: 70,
      createdAt: new Date(now - (i + 1) * 5 * 60_000),
    }));
    await db.insert(analyses).values(rows);
    const result = await detectGuardrailSignals(id, "EUR/USD", { now });
    const ot = result!.signals.find((s) => s.kind === "overtrading");
    expect(ot).toBeTruthy();
    if (ot && ot.kind === "overtrading") {
      expect(ot.scope).toBe("hour");
      expect(ot.count).toBe(5);
      expect(ot.limit).toBe(5);
    }
  });

  it("fires cooling-off when last loss ≥1% is within the 30-min window — and only when opt-in", async () => {
    mockCalendar.mockResolvedValue([]);
    const id = await createUser({ coolingOffEnabled: true });
    const now = Date.now();
    await db.insert(tradeJournal).values({
      userId: id,
      instrument: "EUR/USD",
      side: "buy",
      outcome: "loss",
      pnlPercent: "1.5",
      tradedAt: new Date(now - 10 * 60_000),
    });
    const optedIn = await detectGuardrailSignals(id, "USD/JPY", { now });
    const cool = optedIn!.signals.find((s) => s.kind === "cooling_off");
    expect(cool).toBeTruthy();
    if (cool && cool.kind === "cooling_off") {
      // 30 min total window, 10 min elapsed → ~20 min remaining.
      expect(cool.minutesRemaining).toBeGreaterThanOrEqual(19);
      expect(cool.minutesRemaining).toBeLessThanOrEqual(20);
    }

    const id2 = await createUser({ coolingOffEnabled: false });
    await db.insert(tradeJournal).values({
      userId: id2,
      instrument: "EUR/USD",
      side: "buy",
      outcome: "loss",
      pnlPercent: "1.5",
      tradedAt: new Date(now - 10 * 60_000),
    });
    const optedOut = await detectGuardrailSignals(id2, "USD/JPY", { now });
    expect(
      optedOut!.signals.find((s) => s.kind === "cooling_off"),
    ).toBeUndefined();
  });

  it("does not fire cooling-off when loss is under 1%", async () => {
    mockCalendar.mockResolvedValue([]);
    const id = await createUser({ coolingOffEnabled: true });
    const now = Date.now();
    await db.insert(tradeJournal).values({
      userId: id,
      instrument: "EUR/USD",
      side: "buy",
      outcome: "loss",
      pnlPercent: "0.5",
      tradedAt: new Date(now - 5 * 60_000),
    });
    const result = await detectGuardrailSignals(id, "EUR/USD", { now });
    expect(
      result!.signals.find((s) => s.kind === "cooling_off"),
    ).toBeUndefined();
  });

  it("fires high-risk-window when a ★★★ event is within 30 minutes", async () => {
    const now = Date.now();
    mockCalendar.mockResolvedValue([
      {
        date: "2026-01-01",
        time: "12:00",
        epochMs: now + 12 * 60_000,
        currency: "USD",
        impact: "★★★",
        event: "NFP",
        actual: "",
        forecast: "",
        previous: "",
        whyTraderCare: "",
      },
    ]);
    const id = await createUser();
    const result = await detectGuardrailSignals(id, "EUR/USD", { now });
    const hr = result!.signals.find((s) => s.kind === "high_risk_window");
    expect(hr).toBeTruthy();
    if (hr && hr.kind === "high_risk_window") {
      expect(hr.event.name).toBe("NFP");
      expect(hr.minutesUntil).toBe(12);
    }
  });

  it("respects per-guardrail opt-out (revenge off)", async () => {
    mockCalendar.mockResolvedValue([]);
    const id = await createUser({ guardrailRevenge: false });
    const now = Date.now();
    await db.insert(tradeJournal).values({
      userId: id,
      instrument: "EUR/USD",
      side: "buy",
      outcome: "loss",
      pnlPercent: "0.8",
      tradedAt: new Date(now - 2 * 60_000),
    });
    const result = await detectGuardrailSignals(id, "EUR/USD", { now });
    expect(result!.signals.find((s) => s.kind === "revenge")).toBeUndefined();
    expect(result!.prefs.revenge).toBe(false);
  });
});
