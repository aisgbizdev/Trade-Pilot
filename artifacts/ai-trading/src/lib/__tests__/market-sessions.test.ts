import { describe, expect, it } from "vitest";
import {
  formatDuration,
  getMarketStatus,
  isInWeekendClosure,
} from "../market-sessions";

// Sessions are defined in UTC. These tests pin specific UTC instants so they
// pass regardless of the runner's local time zone — the session math itself
// is purely UTC-driven; only the popover's local-time display is TZ-sensitive.
describe("isInWeekendClosure", () => {
  it("treats all of Saturday as closed", () => {
    expect(isInWeekendClosure(new Date("2026-05-30T00:00:00Z"))).toBe(true);
    expect(isInWeekendClosure(new Date("2026-05-30T15:30:00Z"))).toBe(true);
    expect(isInWeekendClosure(new Date("2026-05-30T23:59:00Z"))).toBe(true);
  });
  it("closes after Friday 22:00 UTC", () => {
    expect(isInWeekendClosure(new Date("2026-05-29T21:59:00Z"))).toBe(false);
    expect(isInWeekendClosure(new Date("2026-05-29T22:00:00Z"))).toBe(true);
  });
  it("reopens at Sunday 22:00 UTC", () => {
    expect(isInWeekendClosure(new Date("2026-05-31T21:59:00Z"))).toBe(true);
    expect(isInWeekendClosure(new Date("2026-05-31T22:00:00Z"))).toBe(false);
  });
});

describe("getMarketStatus", () => {
  it("reports London + NY overlap as the highest-liquidity window", () => {
    // Wed 2026-05-27 15:00 UTC: London (08-17) and NY (13-22) both open.
    const status = getMarketStatus(new Date("2026-05-27T15:00:00Z"));
    expect(status.openSessions).toContain("london");
    expect(status.openSessions).toContain("newYork");
    expect(status.isOverlap).toBe(true);
    expect(status.isWeekendClosed).toBe(false);
  });

  it("reports only Sydney + Tokyo during Asian session", () => {
    // Wed 2026-05-27 03:00 UTC: Sydney (22-07 wrap) + Tokyo (00-09).
    const status = getMarketStatus(new Date("2026-05-27T03:00:00Z"));
    expect(status.openSessions.sort()).toEqual(["sydney", "tokyo"].sort());
  });

  it("flags weekend closure on Saturday and points to Sunday Sydney open", () => {
    const now = new Date("2026-05-30T12:00:00Z"); // Saturday noon
    const status = getMarketStatus(now);
    expect(status.openSessions).toEqual([]);
    expect(status.isWeekendClosed).toBe(true);
    expect(status.next).not.toBeNull();
    expect(status.next?.type).toBe("open");
    expect(status.next?.session).toBe("sydney");
    // Sunday 2026-05-31 22:00 UTC
    expect(status.next?.at.toISOString()).toBe("2026-05-31T22:00:00.000Z");
  });

  it("does not open Sydney at Friday 22:00 UTC (weekend lockout)", () => {
    // Friday 2026-05-29 22:00 UTC — Sydney's normal open is suppressed.
    const status = getMarketStatus(new Date("2026-05-29T22:30:00Z"));
    expect(status.openSessions).not.toContain("sydney");
    expect(status.isWeekendClosed).toBe(true);
  });

  it("handles the midnight-UTC boundary (Tokyo open, Sydney still open)", () => {
    const status = getMarketStatus(new Date("2026-05-27T00:00:00Z"));
    expect(status.openSessions).toContain("sydney");
    expect(status.openSessions).toContain("tokyo");
  });

  it("next transition points to a close while sessions are open", () => {
    // Wed 2026-05-27 16:30 UTC: London closes at 17:00 → next event in ~30m.
    const status = getMarketStatus(new Date("2026-05-27T16:30:00Z"));
    expect(status.next?.type).toBe("close");
    expect(status.next?.session).toBe("london");
    expect(Math.round(status.next!.msUntil / 60000)).toBe(30);
  });
});

describe("formatDuration", () => {
  it("formats sub-minute as <1m", () => {
    expect(formatDuration(15_000)).toBe("<1m");
  });
  it("formats minutes only when under an hour", () => {
    expect(formatDuration(45 * 60_000)).toBe("45m");
  });
  it("formats hours and minutes together", () => {
    expect(formatDuration((1 * 60 + 12) * 60_000)).toBe("1h 12m");
  });
  it("drops the minutes when on the hour", () => {
    expect(formatDuration(3 * 60 * 60_000)).toBe("3h");
  });
  it("rolls up to days past 24h", () => {
    expect(formatDuration(26 * 60 * 60_000)).toBe("1d 2h");
  });
  it("handles zero / negative as 0m", () => {
    expect(formatDuration(0)).toBe("0m");
    expect(formatDuration(-1000)).toBe("0m");
  });
});
