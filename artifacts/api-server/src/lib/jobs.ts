import { db } from "./db";
import { users, analyses, feedback, notifications } from "@workspace/db/schema";
import { eq, and, count, sql, gte, lte, lt } from "drizzle-orm";
import { logger } from "./logger";
import { createNotification, createNotificationsForUsers } from "./create-notification";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Retention window for historical analyses. 90 days strikes a balance:
// long enough for quarterly retrospectives and pattern learning, short
// enough to keep the database from growing unbounded in production.
// Override via ANALYSES_RETENTION_DAYS env var if needed (min 30, max 365).
const RAW_RETENTION = Number(process.env["ANALYSES_RETENTION_DAYS"] ?? 90);
const ANALYSES_RETENTION_DAYS = Math.min(
  365,
  Math.max(30, Number.isFinite(RAW_RETENTION) ? RAW_RETENTION : 90),
);
// Notify the owner this many days before their analysis is auto-deleted.
const RETENTION_WARNING_DAYS = 7;

async function sendFeedbackReminders(): Promise<void> {
  try {
    const threeDaysAgo = new Date(Date.now() - THREE_DAYS_MS);
    const recentWindow = new Date(Date.now() - THREE_DAYS_MS);

    const candidates = await db
      .select({
        userId: analyses.userId,
        latestAnalysis: sql<string>`max(${analyses.createdAt})`,
      })
      .from(analyses)
      .groupBy(analyses.userId)
      .having(sql`max(${analyses.createdAt}) <= ${threeDaysAgo}`);

    for (const c of candidates) {
      const userId = c.userId;

      const [hasFeedback] = await db
        .select({ id: feedback.id })
        .from(feedback)
        .where(
          and(
            eq(feedback.userId, userId),
            sql`${feedback.createdAt} >= ${recentWindow}`
          )
        )
        .limit(1);

      if (hasFeedback) continue;

      const [alreadyNotified] = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.title, "Bagaimana hasil analisamu?"),
            sql`${notifications.createdAt} >= ${recentWindow}`
          )
        )
        .limit(1);

      if (alreadyNotified) continue;

      await createNotification(
        userId,
        {
          title: "Bagaimana hasil analisamu?",
          message:
            "Sudah lebih dari 3 hari sejak analisis terakhirmu. Bagikan pengalamanmu — berhasil atau tidak — agar kamu bisa belajar lebih baik.",
          type: "info",
        },
        { url: "/notifications", tag: `feedback-reminder-${userId}` },
      );

      logger.info({ userId }, "Sent 3-day feedback reminder");
    }
  } catch (err) {
    logger.error(err, "Error sending feedback reminders");
  }
}

async function sendDailySummary(): Promise<void> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayAnalyses] = await db
      .select({ count: count(analyses.id) })
      .from(analyses)
      .where(sql`${analyses.createdAt} >= ${todayStart}`);

    const activeUsersRows = await db
      .selectDistinct({ userId: analyses.userId })
      .from(analyses)
      .where(sql`${analyses.createdAt} >= ${todayStart}`);
    const activeCount = activeUsersRows.length;

    const [totalUsers] = await db
      .select({ count: count(users.id) })
      .from(users);

    const admins = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(sql`${users.role} IN ('admin', 'super_admin')`);

    if (admins.length === 0) return;

    // Daily summary copy differs between super_admin (sees total users) and
    // admin (sees only daily counts). Send each role group separately so the
    // bulk insert + push payload share the same body within each group.
    const superAdminIds = admins.filter((a) => a.role === "super_admin").map((a) => a.id);
    const regularAdminIds = admins.filter((a) => a.role !== "super_admin").map((a) => a.id);

    if (superAdminIds.length > 0) {
      await createNotificationsForUsers(
        superAdminIds,
        {
          title: "Ringkasan Harian",
          message: `Sistem hari ini: ${todayAnalyses.count} analisis, ${activeCount} pengguna aktif, ${totalUsers.count} total pengguna terdaftar.`,
          type: "info",
        },
        { url: "/notifications", tag: "daily-summary" },
      );
    }
    if (regularAdminIds.length > 0) {
      await createNotificationsForUsers(
        regularAdminIds,
        {
          title: "Ringkasan Harian",
          message: `Hari ini: ${todayAnalyses.count} analisis baru, ${activeCount} pengguna aktif.`,
          type: "info",
        },
        { url: "/notifications", tag: "daily-summary" },
      );
    }

    logger.info("Sent daily summary to admins and super-admins");
  } catch (err) {
    logger.error(err, "Error sending daily summary");
  }
}

export async function notifyAdminsUserCreated(displayName: string): Promise<void> {
  try {
    const admins = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`${users.role} IN ('admin', 'super_admin')`);

    if (admins.length === 0) return;

    await createNotificationsForUsers(
      admins.map((a) => a.id),
      {
        title: "Pengguna Baru Terdaftar",
        message: `Pengguna baru "${displayName}" telah mendaftar ke sistem.`,
        type: "info",
      },
      { url: "/notifications", tag: "user-created" },
    );
  } catch (err) {
    logger.error(err, "Error sending user-created notification");
  }
}

export async function notifySuperAdminsUserDeleted(displayName: string): Promise<void> {
  try {
    const superAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "super_admin"));

    if (superAdmins.length === 0) return;

    await createNotificationsForUsers(
      superAdmins.map((sa) => sa.id),
      {
        title: "Pengguna Dihapus",
        message: `Pengguna "${displayName}" telah dihapus dari sistem.`,
        type: "warning",
      },
      { url: "/notifications", tag: "user-deleted" },
    );
  } catch (err) {
    logger.error(err, "Error sending user-deleted notification");
  }
}

async function sendAnalysisExpiryAlerts(): Promise<void> {
  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    // Look back 3 hours — long enough to cover the entire 2-hour expiry window
    // so we never send a duplicate alert for the same analysis within one expiry window.
    const lookbackWindow = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const expiringAnalyses = await db
      .select({
        id: analyses.id,
        userId: analyses.userId,
        instrument: analyses.instrument,
        validUntil: analyses.validUntil,
      })
      .from(analyses)
      .where(and(gte(analyses.validUntil, now), lte(analyses.validUntil, twoHoursFromNow)));

    for (const analysis of expiringAnalyses) {
      // Deduplicate: check whether we already sent an expiry alert for this
      // specific analysis (keyed by analysis ID in the message) within the last
      // 3 hours. This prevents re-notification on each hourly job run while the
      // analysis remains inside the 2-hour expiry window.
      const expiryMarker = `[expiry:${analysis.id}]`;
      const [alreadyNotified] = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, analysis.userId),
            sql`${notifications.message} LIKE ${"%" + expiryMarker + "%"}`,
            sql`${notifications.createdAt} >= ${lookbackWindow}`
          )
        )
        .limit(1);

      if (alreadyNotified) continue;

      const expiryTitle = "Analisis Akan Berakhir";
      const expiryMessage = `Analisis ${analysis.instrument} kamu akan berakhir dalam kurang dari 2 jam. Segera ambil keputusan atau buat analisis baru. ${expiryMarker}`;

      // Honor the per-user `pushExpiry` opt-out: in-app notification is
      // always created (so the alert still surfaces in /notifications),
      // but the OS-level pop-up is suppressed when the user has turned
      // off expiry pushes. The push helper itself also no-ops when the
      // user has no subscriptions, so we don't need a separate sub check.
      const [prefs] = await db
        .select({ pushExpiry: users.pushExpiry })
        .from(users)
        .where(eq(users.id, analysis.userId))
        .limit(1);

      const allowPush = prefs?.pushExpiry !== false;

      await createNotification(
        analysis.userId,
        { title: expiryTitle, message: expiryMessage, type: "warning" },
        allowPush
          ? {
              title: "Analisis Akan Berakhir ⚠️",
              body: `Analisis ${analysis.instrument} kamu akan berakhir dalam kurang dari 2 jam.`,
              url: "/",
              tag: `expiry-${analysis.id}`,
            }
          : null,
      );

      logger.info({ userId: analysis.userId, analysisId: analysis.id }, "Sent analysis expiry alert");
    }
  } catch (err) {
    logger.error(err, "Error sending analysis expiry alerts");
  }
}

async function sendRetentionWarnings(): Promise<void> {
  try {
    const now = Date.now();
    // An analysis is "about to expire" when its createdAt is older than
    // (RETENTION - WARNING) days but newer than RETENTION days.
    const warningCutoff = new Date(
      now - (ANALYSES_RETENTION_DAYS - RETENTION_WARNING_DAYS) * ONE_DAY_MS,
    );
    const deletionCutoff = new Date(now - ANALYSES_RETENTION_DAYS * ONE_DAY_MS);

    const expiringSoon = await db
      .select({
        id: analyses.id,
        userId: analyses.userId,
        instrument: analyses.instrument,
        createdAt: analyses.createdAt,
      })
      .from(analyses)
      .where(
        and(lte(analyses.createdAt, warningCutoff), gte(analyses.createdAt, deletionCutoff)),
      );

    for (const a of expiringSoon) {
      const retentionMarker = `[retention:${a.id}]`;
      const lookbackWindow = new Date(now - 8 * ONE_DAY_MS);
      const [alreadyWarned] = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, a.userId),
            sql`${notifications.message} LIKE ${"%" + retentionMarker + "%"}`,
            sql`${notifications.createdAt} >= ${lookbackWindow}`,
          ),
        )
        .limit(1);
      if (alreadyWarned) continue;

      const daysLeft = Math.max(
        1,
        Math.ceil(
          (a.createdAt.getTime() + ANALYSES_RETENTION_DAYS * ONE_DAY_MS - now) / ONE_DAY_MS,
        ),
      );
      const title = "Riwayat Analisis Akan Dihapus";
      const message = `Analisis ${a.instrument} kamu akan dihapus otomatis dalam ${daysLeft} hari karena sudah lebih dari ${ANALYSES_RETENTION_DAYS} hari. Simpan catatan jika perlu. ${retentionMarker}`;
      await createNotification(
        a.userId,
        { title, message, type: "info" },
        {
          title: "Riwayat Analisis Akan Dihapus 🗑️",
          body: `Analisis ${a.instrument} kamu akan dihapus dalam ${daysLeft} hari.`,
          url: "/",
          tag: `retention-${a.id}`,
        },
      );
    }
  } catch (err) {
    logger.error(err, "Error sending retention warnings");
  }
}

async function deleteOldAnalyses(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - ANALYSES_RETENTION_DAYS * ONE_DAY_MS);
    const deleted = await db
      .delete(analyses)
      .where(lt(analyses.createdAt, cutoff))
      .returning({ id: analyses.id });
    if (deleted.length > 0) {
      logger.info(
        { count: deleted.length, retentionDays: ANALYSES_RETENTION_DAYS },
        "Deleted analyses past retention window",
      );
    }
  } catch (err) {
    logger.error(err, "Error deleting old analyses");
  }
}

// Track all timers/intervals so a shutdown signal can cancel them cleanly
// before the DB pool drains. Without this, a job tick mid-shutdown would
// fire a query against an ending pool and produce noisy errors.
const scheduledTimers: Set<NodeJS.Timeout> = new Set();
// Track every in-flight job execution so shutdown can wait for active
// queries to settle before draining the pool. This avoids the "query on
// ended pool" class of errors when SIGTERM lands mid-tick.
const inFlightJobs: Set<Promise<unknown>> = new Set();
let jobsStopped = false;

function track(timer: NodeJS.Timeout): NodeJS.Timeout {
  scheduledTimers.add(timer);
  return timer;
}

function runTracked(fn: () => Promise<void>): void {
  if (jobsStopped) return;
  const p = fn().catch((err) => {
    logger.error(err, "Background job tick failed");
  });
  inFlightJobs.add(p);
  void p.finally(() => inFlightJobs.delete(p));
}

function schedule(fn: () => Promise<void>, intervalMs: number, delayMs: number): void {
  track(
    setTimeout(() => {
      if (jobsStopped) return;
      runTracked(fn);
      track(
        setInterval(() => {
          runTracked(fn);
        }, intervalMs),
      );
    }, delayMs),
  );
}

export async function stopBackgroundJobs(timeoutMs = 5000): Promise<void> {
  jobsStopped = true;
  for (const t of scheduledTimers) {
    clearTimeout(t as unknown as NodeJS.Timeout);
    clearInterval(t as unknown as NodeJS.Timeout);
  }
  scheduledTimers.clear();
  if (inFlightJobs.size === 0) return;
  // Wait for in-flight ticks, but cap at timeoutMs so a hung job can't block
  // process shutdown indefinitely.
  await Promise.race([
    Promise.allSettled(Array.from(inFlightJobs)),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

export function startBackgroundJobs(): void {
  const feedbackInterval = 60 * 60 * 1000;
  const dailyInterval = ONE_DAY_MS;
  const expiryCheckInterval = 60 * 60 * 1000;
  const retentionInterval = ONE_DAY_MS;

  schedule(sendFeedbackReminders, feedbackInterval, 5000);
  schedule(sendDailySummary, dailyInterval, 10000);
  schedule(sendAnalysisExpiryAlerts, expiryCheckInterval, 15000);
  schedule(sendRetentionWarnings, retentionInterval, 20000);
  schedule(deleteOldAnalyses, retentionInterval, 25000);

  logger.info({ retentionDays: ANALYSES_RETENTION_DAYS }, "Background notification jobs started");
}
