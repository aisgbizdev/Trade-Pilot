// Store-readiness (P2-B3): native push (FCM) device registration.
// Deliberately separate from `routes/push.ts` (Web Push/VAPID) — the two
// channels have unrelated payload shapes and lifecycles; see
// `lib/native-push.ts` for the actual FCM send implementation.
import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { nativePushDevices } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { nativePushRegisterLimiter } from "../middleware/rate-limit";
import { logger } from "../lib/logger";

const router = Router();

const registerSchema = z
  .object({
    token: z.string().min(20).max(4096),
    platform: z.enum(["android", "ios"]),
  })
  .strict();

const unregisterSchema = z
  .object({
    token: z.string().min(20).max(4096),
  })
  .strict();

function tokenSuffix(token: string): string {
  return token.length > 8 ? token.slice(-8) : token;
}

router.post(
  "/native-push/register",
  requireAuth,
  nativePushRegisterLimiter,
  async (req: AuthRequest, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Data registrasi perangkat tidak valid" });
      return;
    }
    const { token, platform } = parsed.data;
    const now = new Date();

    // Upsert on the globally-unique token: if this exact device token was
    // previously registered under a different account (e.g. the device
    // logged out and a different user logged in), ownership transfers to
    // the current authenticated user rather than erroring — this is the
    // correct behavior for a shared/re-logged-in device.
    await db
      .insert(nativePushDevices)
      .values({
        userId: req.userId!,
        token,
        platform,
        enabled: true,
        lastSeenAt: now,
      })
      .onConflictDoUpdate({
        target: nativePushDevices.token,
        set: {
          userId: req.userId!,
          platform,
          enabled: true,
          lastSeenAt: now,
          updatedAt: now,
        },
      });

    logger.info(
      { userId: req.userId, platform, tokenSuffix: tokenSuffix(token) },
      "Native push device registered",
    );

    res.status(201).json({ message: "Perangkat berhasil didaftarkan" });
  },
);

router.delete("/native-push/unregister", requireAuth, async (req: AuthRequest, res) => {
  const parsed = unregisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Token tidak valid" });
    return;
  }

  // Scoped by userId AND token — a caller can only ever remove their own
  // device registration, never another user's.
  await db
    .delete(nativePushDevices)
    .where(
      and(
        eq(nativePushDevices.userId, req.userId!),
        eq(nativePushDevices.token, parsed.data.token),
      ),
    );

  res.json({ message: "Perangkat berhasil dihapus" });
});

export default router;
