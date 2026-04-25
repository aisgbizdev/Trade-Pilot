import { db } from "./db";
import { users, analyses, feedback, notifications, pushSubscriptions } from "@workspace/db/schema";
import { eq, and, count, sql, gte, lte } from "drizzle-orm";
import { logger } from "./logger";
import { sendPushToUser } from "./webpush";

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

    await db.insert(notifications).values(
      admins.map((a) => ({
        userId: a.id,
        title: "Ringkasan Harian",
        message:
          a.role === "super_admin"
            ? `Sistem hari ini: ${todayAnalyses.count} analisis, ${activeCount} pengguna aktif, ${totalUsers.count} total pengguna terdaftar.`
            : `Hari ini: ${todayAnalyses.count} analisis baru, ${activeCount} pengguna aktif.`,
        type: "info" as const,
      }))
    );

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

    await db.insert(notifications).values(
      admins.map((a) => ({
        userId: a.id,
        title: "Pengguna Baru Terdaftar",
        message: `Pengguna baru "${displayName}" telah mendaftar ke sistem.`,
        type: "info" as const,
      }))
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

    await db.insert(notifications).values(
      superAdmins.map((sa) => ({
        userId: sa.id,
        title: "Pengguna Dihapus",
        message: `Pengguna "${displayName}" telah dihapus dari sistem.`,
        type: "warning" as const,
      }))
    );
  } catch (err) {
    logger.error(err, "Error sending user-deleted notification");
  }
}

async function sendAnalysisExpiryAlerts(): Promise<void> {
  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

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
      const [hasSub] = await db
        .select({ id: pushSubscriptions.id })
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.userId, analysis.userId))
        .limit(1);

      if (!hasSub) continue;

      const [alreadyNotified] = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, analysis.userId),
            eq(notifications.title, "Analisis Akan Berakhir"),
            sql`${notifications.createdAt} >= ${now}`
          )
        )
        .limit(1);

      if (alreadyNotified) continue;

      await db.insert(notifications).values({
        userId: analysis.userId,
        title: "Analisis Akan Berakhir",
        message: `Analisis ${analysis.instrument} kamu akan berakhir dalam kurang dari 2 jam. Segera ambil keputusan atau buat analisis baru.`,
        type: "warning",
      });

      await sendPushToUser(analysis.userId, {
        title: "Analisis Akan Berakhir ⚠️",
        body: `Analisis ${analysis.instrument} kamu akan berakhir dalam kurang dari 2 jam.`,
        url: "/",
        tag: `expiry-${analysis.id}`,
      });

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
