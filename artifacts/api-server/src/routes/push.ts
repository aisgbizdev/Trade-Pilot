import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { pushSubscriptions, users } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { pushTestLimiter } from "../middleware/rate-limit";
import { sendPushToUser } from "../lib/webpush";

const router = Router();

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

router.get("/push/public-key", (_req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || "" });
});

router.post("/push/subscribe", requireAuth, async (req: AuthRequest, res) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Data langganan tidak valid", details: parsed.error.flatten() });
    return;
  }

  const { endpoint, keys } = parsed.data;

  await db
    .insert(pushSubscriptions)
    .values({
      userId: req.userId!,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { userId: req.userId!, p256dh: keys.p256dh, auth: keys.auth },
    });

  res.status(201).json({ message: "Langganan push berhasil disimpan" });
});

router.delete("/push/unsubscribe", requireAuth, async (req: AuthRequest, res) => {
  const parsed = unsubscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Endpoint tidak valid" });
    return;
  }

  await db
    .delete(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.userId, req.userId!),
        eq(pushSubscriptions.endpoint, parsed.data.endpoint)
      )
    );

  res.json({ message: "Langganan push dihapus" });
});

router.get("/push/subscription-status", requireAuth, async (req: AuthRequest, res) => {
  const subs = await db
    .select({ endpoint: pushSubscriptions.endpoint })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, req.userId!));

  res.json({ subscribed: subs.length > 0, count: subs.length });
});

const prefsSchema = z.object({
  pushExpiry: z.boolean().optional(),
  pushBroadcast: z.boolean().optional(),
});

router.get("/push/prefs", requireAuth, async (req: AuthRequest, res) => {
  const [row] = await db
    .select({
      pushExpiry: users.pushExpiry,
      pushBroadcast: users.pushBroadcast,
    })
    .from(users)
    .where(eq(users.id, req.userId!))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "User tidak ditemukan" });
    return;
  }
  res.json(row);
});

// "Send a sample notification to my own phone" — used by the test button on
// the Notifications page so users can confirm the OS pop-up actually fires
// after they enable push. Auth-required + per-user rate-limited (see
// `pushTestLimiter`). Counts the rows we *attempted* to dispatch to so the
// UI can tell the user "0 devices subscribed" vs "we tried, nothing
// arrived" — the latter usually means a system-level permission was
// revoked outside the browser.
router.post("/push/test", requireAuth, pushTestLimiter, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  if (!count || count === 0) {
    res.status(404).json({
      error:
        "Belum ada perangkat yang berlangganan notifikasi. / No subscribed devices yet.",
    });
    return;
  }

  await sendPushToUser(userId, {
    title: "Trade Pilot",
    body: "Notifikasi kamu sudah aktif. / Notifications are working.",
    tag: "trade-pilot-test",
  });

  res.json({ delivered: count });
});

router.patch("/push/prefs", requireAuth, async (req: AuthRequest, res) => {
  const parsed = prefsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Preferensi tidak valid" });
    return;
  }
  const updates: Record<string, boolean> = {};
  if (typeof parsed.data.pushExpiry === "boolean") updates["pushExpiry"] = parsed.data.pushExpiry;
  if (typeof parsed.data.pushBroadcast === "boolean") updates["pushBroadcast"] = parsed.data.pushBroadcast;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Tidak ada perubahan" });
    return;
  }
  const [updated] = await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, req.userId!))
    .returning({
      pushExpiry: users.pushExpiry,
      pushBroadcast: users.pushBroadcast,
    });
  res.json(updated);
});

export default router;
