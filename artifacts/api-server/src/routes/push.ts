import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { pushSubscriptions } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

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

export default router;
