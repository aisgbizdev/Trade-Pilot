import { Router } from "express";
import { db } from "../lib/db";
import { notifications } from "@workspace/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/notifications", requireAuth, async (req: AuthRequest, res) => {
  const unreadOnly = req.query["unreadOnly"] === "true";

  const rows = await db
    .select()
    .from(notifications)
    .where(
      unreadOnly
        ? and(eq(notifications.userId, req.userId!), isNull(notifications.readAt))
        : eq(notifications.userId, req.userId!)
    )
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  res.json({ notifications: rows });
});

router.patch("/notifications/:id/read", requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);

  const [updated] = await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(eq(notifications.id, id), eq(notifications.userId, req.userId!))
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Notifikasi tidak ditemukan" });
    return;
  }

  res.json({ message: "Notifikasi ditandai telah dibaca" });
});

router.patch("/notifications/read-all", requireAuth, async (req: AuthRequest, res) => {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.userId, req.userId!),
        isNull(notifications.readAt)
      )
    );

  res.json({ message: "Semua notifikasi ditandai telah dibaca" });
});

export default router;
