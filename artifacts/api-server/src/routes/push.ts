import { Router } from "express";
import { db } from "../lib/db";
import { pushSubscriptions } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/push/public-key", (_req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || "" });
});

router.post("/push/subscribe", requireAuth, async (req: AuthRequest, res) => {
  const { endpoint, keys } = req.body as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    res.status(400).json({ error: "Endpoint dan keys wajib diisi" });
    return;
  }

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
  const { endpoint } = req.body as { endpoint: string };

  if (!endpoint) {
    res.status(400).json({ error: "Endpoint wajib diisi" });
    return;
  }

  await db
    .delete(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.userId, req.userId!),
        eq(pushSubscriptions.endpoint, endpoint)
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

export default router;
