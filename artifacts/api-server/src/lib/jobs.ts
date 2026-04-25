import { db } from "./db";
import { users, analyses, feedback, notifications, pushSubscriptions } from "@workspace/db/schema";
import { eq, and, count, sql, gte, lte } from "drizzle-orm";
import { logger } from "./logger";
import { sendPushToUser } from "./webpush";
import { notificationsEmitter } from "./notifications-emitter";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

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

      await db.insert(notifications).values({
        userId,
        title: "Bagaimana hasil analisamu?",
        message:
          "Sudah lebih dari 3 hari sejak analisis terakhirmu. Bagikan pengalamanmu — berhasil atau tidak — agar kamu bisa belajar lebih baik.",
        type: "info",
      });
      notificationsEmitter.emitForUser(userId, {
        title: "Bagaimana hasil analisamu?",
        message:
          "Sudah lebih dari 3 hari sejak analisis terakhirmu. Bagikan pengalamanmu — berhasil atau tidak — agar kamu bisa belajar lebih baik.",
        type: "info",
        createdAt: new Date().toISOString(),
      });

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

    const summaryRows = admins.map((a) => ({
      userId: a.id,
      title: "Ringkasan Harian",
      message:
        a.role === "super_admin"
          ? `Sistem hari ini: ${todayAnalyses.count} analisis, ${activeCount} pengguna aktif, ${totalUsers.count} total pengguna terdaftar.`
          : `Hari ini: ${todayAnalyses.count} analisis baru, ${activeCount} pengguna aktif.`,
      type: "info" as const,
    }));
    await db.insert(notifications).values(summaryRows);
    const nowIso = new Date().toISOString();
    for (const r of summaryRows) {
      notificationsEmitter.emitForUser(r.userId, {
        title: r.title,
        message: r.message,
        type: r.type,
        createdAt: nowIso,
      });
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

    const rows = admins.map((a) => ({
      userId: a.id,
      title: "Pengguna Baru Terdaftar",
      message: `Pengguna baru "${displayName}" telah mendaftar ke sistem.`,
      type: "info" as const,
    }));
    await db.insert(notifications).values(rows);
    const nowIso = new Date().toISOString();
    for (const r of rows) {
      notificationsEmitter.emitForUser(r.userId, {
        title: r.title,
        message: r.message,
        type: r.type,
        createdAt: nowIso,
      });
    }
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

    const rows = superAdmins.map((sa) => ({
      userId: sa.id,
      title: "Pengguna Dihapus",
      message: `Pengguna "${displayName}" telah dihapus dari sistem.`,
      type: "warning" as const,
    }));
    await db.insert(notifications).values(rows);
    const nowIso = new Date().toISOString();
    for (const r of rows) {
      notificationsEmitter.emitForUser(r.userId, {
        title: r.title,
        message: r.message,
        type: r.type,
        createdAt: nowIso,
      });
    }
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

      // Always insert the in-app notification so users see the alert in
      // /notifications regardless of push subscription status.
      const expiryTitle = "Analisis Akan Berakhir";
      const expiryMessage = `Analisis ${analysis.instrument} kamu akan berakhir dalam kurang dari 2 jam. Segera ambil keputusan atau buat analisis baru. ${expiryMarker}`;
      await db.insert(notifications).values({
        userId: analysis.userId,
        title: expiryTitle,
        message: expiryMessage,
        type: "warning",
      });
      notificationsEmitter.emitForUser(analysis.userId, {
        title: expiryTitle,
        message: expiryMessage,
        type: "warning",
        createdAt: new Date().toISOString(),
      });

      // Only send push if the user has an active subscription AND has not
      // disabled expiry notifications in preferences.
      const [hasSub] = await db
        .select({ id: pushSubscriptions.id })
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.userId, analysis.userId))
        .limit(1);

      const [prefs] = await db
        .select({ pushExpiry: users.pushExpiry })
        .from(users)
        .where(eq(users.id, analysis.userId))
        .limit(1);

      if (hasSub && prefs?.pushExpiry !== false) {
        await sendPushToUser(analysis.userId, {
          title: "Analisis Akan Berakhir ⚠️",
          body: `Analisis ${analysis.instrument} kamu akan berakhir dalam kurang dari 2 jam.`,
          url: "/",
          tag: `expiry-${analysis.id}`,
        });
      }

      logger.info({ userId: analysis.userId, analysisId: analysis.id }, "Sent analysis expiry alert");
    }
  } catch (err) {
    logger.error(err, "Error sending analysis expiry alerts");
  }
}

export function startBackgroundJobs(): void {
  const feedbackInterval = 60 * 60 * 1000;
  const dailyInterval = ONE_DAY_MS;
  const expiryCheckInterval = 60 * 60 * 1000;

  setTimeout(() => {
    sendFeedbackReminders();
    setInterval(sendFeedbackReminders, feedbackInterval);
  }, 5000);

  setTimeout(() => {
    sendDailySummary();
    setInterval(sendDailySummary, dailyInterval);
  }, 10000);

  setTimeout(() => {
    sendAnalysisExpiryAlerts();
    setInterval(sendAnalysisExpiryAlerts, expiryCheckInterval);
  }, 15000);

  logger.info("Background notification jobs started");
}
