import { db } from "./db";
import { users, analyses, feedback, notifications } from "@workspace/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { logger } from "./logger";

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

async function sendDailySuperAdminSummary(): Promise<void> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayAnalyses] = await db
      .select({ count: count(analyses.id) })
      .from(analyses)
      .where(sql`${analyses.createdAt} >= ${todayStart}`);

    const [totalUsers] = await db
      .select({ count: count(users.id) })
      .from(users);

    const superAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "super_admin"));

    if (superAdmins.length === 0) return;

    await db.insert(notifications).values(
      superAdmins.map((sa) => ({
        userId: sa.id,
        title: "Ringkasan Harian Sistem",
        message: `Hari ini: ${todayAnalyses.count} analisis baru. Total pengguna terdaftar: ${totalUsers.count}.`,
        type: "info" as const,
      }))
    );

    logger.info("Sent daily super-admin summary");
  } catch (err) {
    logger.error(err, "Error sending daily summary");
  }
}

export function startBackgroundJobs(): void {
  const feedbackInterval = 60 * 60 * 1000;
  const dailyInterval = ONE_DAY_MS;

  setTimeout(() => {
    sendFeedbackReminders();
    setInterval(sendFeedbackReminders, feedbackInterval);
  }, 5000);

  setTimeout(() => {
    sendDailySuperAdminSummary();
    setInterval(sendDailySuperAdminSummary, dailyInterval);
  }, 10000);

  logger.info("Background notification jobs started");
}
