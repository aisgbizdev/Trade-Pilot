// Tier 3 push (task #142 E): self-pause categories the user keeps
// ignoring. Once a per-category streak of 3 consecutive
// "unread-after-48h" deliveries lands, flip the matching opt-out
// boolean to false and stamp `disengageNoticeCategory` so the UI can
// render a one-time banner explaining what happened.

import { db } from "./db";
import { users, notifications } from "@workspace/db/schema";
import { and, asc, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { logger } from "./logger";

// Maps notification.category → the users column to flip when the user
// has clearly stopped reading them. Keep this list in lockstep with
// the categories used in dispatchers (price-anomaly, signal-flip,
// weekly-recap, market-open, dormancy, onboarding, watchlist alerts).
const CATEGORY_TO_TOGGLE: Record<string, keyof typeof users.$inferSelect> = {
  market_news: "pushMarketNews",
  calendar_event: "pushCalendarEvents",
  price_anomaly: "pushPriceAnomaly",
  weekly_recap: "pushWeeklyRecap",
  signal_flip: "pushSignalFlip",
  market_open: "marketOpenSessions" as never, // handled specially — see below
  dormancy_nudge: "pushDormancyNudge",
};

const STREAK_THRESHOLD = 3;
const IGNORE_AGE_MS = 48 * 60 * 60 * 1000; // 48h
const LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000; // 30d window for counting

interface RunStats {
  scanned: number;
  paused: number;
  streakUpdates: number;
}

/**
 * Walk every (user, category) pair with at least one notification in
 * the trailing 30d, count how many of the *most recent* deliveries
 * landed unread past 48h, and use that as the streak. A click (or any
 * read at all) resets the streak to 0 on the user row.
 */
export async function runAutoDisengage(now: Date = new Date()): Promise<RunStats> {
  const stats: RunStats = { scanned: 0, paused: 0, streakUpdates: 0 };
  try {
    const ignoreCutoff = new Date(now.getTime() - IGNORE_AGE_MS);
    const lookbackCutoff = new Date(now.getTime() - LOOKBACK_MS);

    // Pull all relevant notifications in one query and group in JS —
    // simpler than a window-function CTE, and the row count for 30d
    // is bounded.
    const rows = await db
      .select({
        userId: notifications.userId,
        category: notifications.category,
        readAt: notifications.readAt,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .where(
        and(
          isNotNull(notifications.userId),
          isNotNull(notifications.category),
          gte(notifications.createdAt, lookbackCutoff),
          lte(notifications.createdAt, ignoreCutoff),
        ),
      )
      .orderBy(asc(notifications.userId), asc(notifications.category), asc(notifications.createdAt));

    // Group: (userId, category) → ordered list of {readAt}
    const grouped = new Map<string, { userId: number; category: string; reads: (Date | null)[] }>();
    for (const r of rows) {
      if (r.userId == null || r.category == null) continue;
      if (!CATEGORY_TO_TOGGLE[r.category]) continue;
      const key = `${r.userId}:${r.category}`;
      const slot = grouped.get(key) ?? { userId: r.userId, category: r.category, reads: [] };
      slot.reads.push(r.readAt ?? null);
      grouped.set(key, slot);
    }
    stats.scanned = grouped.size;

    // Cache user rows we've already loaded to avoid N+1 selects.
    const userCache = new Map<number, { disengageStreaks: Record<string, number> }>();
    for (const slot of grouped.values()) {
      // Count the trailing streak of unread items: walk from newest to
      // oldest and stop at the first read. Limits to the categories
      // we know how to pause.
      let streak = 0;
      for (let i = slot.reads.length - 1; i >= 0; i -= 1) {
        if (slot.reads[i] == null) streak += 1;
        else break;
      }

      let cached = userCache.get(slot.userId);
      if (!cached) {
        const [row] = await db
          .select({ disengageStreaks: users.disengageStreaks })
          .from(users)
          .where(eq(users.id, slot.userId))
          .limit(1);
        if (!row) continue;
        cached = { disengageStreaks: row.disengageStreaks ?? {} };
        userCache.set(slot.userId, cached);
      }

      const prev = cached.disengageStreaks[slot.category] ?? 0;
      if (streak === prev && streak < STREAK_THRESHOLD) {
        // Nothing changed for this category and we're not at the
        // threshold — skip the write to keep tick cost flat.
        continue;
      }
      cached.disengageStreaks[slot.category] = streak;

      if (streak >= STREAK_THRESHOLD) {
        // Persist a streak reset to 0 in the *same* write that flips
        // the toggle off. Without this, the historical unread rows
        // still produce streak>=3 on the next hourly tick, re-flipping
        // the toggle and re-stamping `disengageNoticeCategory` — which
        // would defeat the "show banner once after dismissal" guarantee.
        // Also: only re-stamp the banner category if it's currently
        // null (i.e. nothing to dismiss). If the user already has a
        // pending banner, don't overwrite it.
        cached.disengageStreaks[slot.category] = 0;
        const [existing] = await db
          .select({ disengageNoticeCategory: users.disengageNoticeCategory })
          .from(users)
          .where(eq(users.id, slot.userId))
          .limit(1);
        const updates: Record<string, unknown> = {
          disengageStreaks: { ...cached.disengageStreaks },
          updatedAt: new Date(),
        };
        if (!existing?.disengageNoticeCategory) {
          updates["disengageNoticeCategory"] = slot.category;
        }
        // Flip the right opt-out. `market_open` opts out by clearing
        // the session array; everything else just flips a boolean.
        if (slot.category === "market_open") {
          updates["marketOpenSessions"] = [];
        } else {
          const col = CATEGORY_TO_TOGGLE[slot.category];
          if (col) updates[col as string] = false;
        }
        await db.update(users).set(updates).where(eq(users.id, slot.userId));
        stats.paused += 1;
      } else {
        await db
          .update(users)
          .set({ disengageStreaks: cached.disengageStreaks, updatedAt: new Date() })
          .where(eq(users.id, slot.userId));
        stats.streakUpdates += 1;
      }
    }

    if (stats.paused > 0 || stats.streakUpdates > 0) {
      logger.info(stats, "runAutoDisengage tick");
    }
    return stats;
  } catch (err) {
    logger.error(err, "runAutoDisengage failed");
    return stats;
  }
}

/**
 * Reset a (user, category) streak when the user actually reads/clicks a
 * notification of that category. Called from the mark-read route.
 */
export async function resetDisengageStreak(userId: number, category: string): Promise<void> {
  try {
    const [row] = await db
      .select({ disengageStreaks: users.disengageStreaks })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!row) return;
    const streaks = { ...(row.disengageStreaks ?? {}) };
    if (!streaks[category]) return;
    streaks[category] = 0;
    await db
      .update(users)
      .set({ disengageStreaks: streaks, updatedAt: new Date() })
      .where(eq(users.id, userId));
  } catch (err) {
    logger.warn({ err, userId, category }, "resetDisengageStreak failed");
  }
}

// Suppress unused-import warning for `sql` (kept for future extensions).
void sql;
