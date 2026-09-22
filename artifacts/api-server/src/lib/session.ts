// TradePilot allows only one active session per account — a login on any
// device/browser (password, Google, Apple, TikTok, or Facebook) signs out
// every other device. Centralized here so every login/registration route
// applies the same rule instead of each one deleting old sessions itself.
import { eq } from "drizzle-orm";
import { db } from "./db";
import { sessions } from "@workspace/db/schema";

export async function createSingleSession(
  userId: number,
  token: string,
  expiresAt: Date,
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(sessions).where(eq(sessions.userId, userId));
    await tx.insert(sessions).values({ userId, token, expiresAt });
  });
}
