export type SessionName = "sydney" | "tokyo" | "london" | "newYork";

export interface SessionDef {
  name: SessionName;
  openUtcHour: number;
  closeUtcHour: number;
}

export const SESSIONS: readonly SessionDef[] = [
  { name: "sydney", openUtcHour: 22, closeUtcHour: 7 },
  { name: "tokyo", openUtcHour: 0, closeUtcHour: 9 },
  { name: "london", openUtcHour: 8, closeUtcHour: 17 },
  { name: "newYork", openUtcHour: 13, closeUtcHour: 22 },
] as const;

export interface SessionInterval {
  name: SessionName;
  start: Date;
  end: Date;
}

export interface SessionTransition {
  type: "open" | "close";
  session: SessionName;
  at: Date;
  msUntil: number;
}

export interface MarketStatus {
  openSessions: SessionName[];
  isOverlap: boolean;
  isWeekendClosed: boolean;
  next: SessionTransition | null;
}

const MS_PER_DAY = 86_400_000;

export function isInWeekendClosure(t: Date): boolean {
  const day = t.getUTCDay();
  const hour = t.getUTCHours();
  if (day === 6) return true;
  if (day === 5 && hour >= 22) return true;
  if (day === 0 && hour < 22) return true;
  return false;
}

export function generateIntervals(now: Date): SessionInterval[] {
  const intervals: SessionInterval[] = [];
  const baseUtcMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - 2,
  );
  for (let i = 0; i < 6; i++) {
    const dayMs = baseUtcMidnight + i * MS_PER_DAY;
    const day = new Date(dayMs);
    const y = day.getUTCFullYear();
    const m = day.getUTCMonth();
    const d = day.getUTCDate();
    for (const s of SESSIONS) {
      const open = new Date(Date.UTC(y, m, d, s.openUtcHour));
      const wraps = s.closeUtcHour <= s.openUtcHour;
      const close = new Date(
        Date.UTC(y, m, d + (wraps ? 1 : 0), s.closeUtcHour),
      );
      if (isInWeekendClosure(open)) continue;
      intervals.push({ name: s.name, start: open, end: close });
    }
  }
  return intervals;
}

export function getMarketStatus(now: Date): MarketStatus {
  const intervals = generateIntervals(now);
  const nowMs = now.getTime();
  const open: SessionName[] = [];
  for (const i of intervals) {
    if (i.start.getTime() <= nowMs && nowMs < i.end.getTime()) {
      open.push(i.name);
    }
  }
  const events: SessionTransition[] = [];
  for (const i of intervals) {
    if (i.start.getTime() > nowMs) {
      events.push({
        type: "open",
        session: i.name,
        at: i.start,
        msUntil: i.start.getTime() - nowMs,
      });
    }
    if (i.end.getTime() > nowMs) {
      events.push({
        type: "close",
        session: i.name,
        at: i.end,
        msUntil: i.end.getTime() - nowMs,
      });
    }
  }
  events.sort((a, b) => a.msUntil - b.msUntil);
  return {
    openSessions: open,
    isOverlap: open.length >= 2,
    isWeekendClosed: open.length === 0 && isInWeekendClosure(now),
    next: events[0] ?? null,
  };
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return "0m";
  const totalMin = Math.round(ms / 60_000);
  if (totalMin < 1) return "<1m";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m`;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return rh > 0 ? `${d}d ${rh}h` : `${d}d`;
  }
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatLocalTime(
  utcHour: number,
  locale: string,
  reference: Date = new Date(),
): string {
  const d = new Date(
    Date.UTC(
      reference.getUTCFullYear(),
      reference.getUTCMonth(),
      reference.getUTCDate(),
      utcHour,
      0,
      0,
    ),
  );
  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
