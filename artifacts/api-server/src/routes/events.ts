import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { outboundClicks, sessions, users } from "@workspace/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { RecordOutboundClickBody } from "@workspace/api-zod";

const router: IRouter = Router();

// Fire-and-forget client telemetry. Auth is *optional* — splash, landing,
// and the dashboard TikTok card all need to record clicks for both signed-in
// and signed-out visitors. We never reject the request, even on validation
// failure: a 4xx here would race the user's outbound navigation and
// occasionally surface as a console error in the browser, which is not
// worth it for a non-critical analytics ping.
router.post("/events/outbound-click", async (req, res) => {
  // Always 204 first — write completes asynchronously.
  res.status(204).end();

  const parsed = RecordOutboundClickBody.safeParse(req.body);
  if (!parsed.success) return;

  let userId: number | null = null;
  const token =
    req.cookies?.["session_token"] ||
    req.headers["authorization"]?.replace("Bearer ", "");
  if (token) {
    try {
      const [session] = await db
        .select({ userId: sessions.userId })
        .from(sessions)
        .innerJoin(users, eq(users.id, sessions.userId))
        .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
        .limit(1);
      if (session) userId = session.userId;
    } catch {
      // Swallow — telemetry must never crash the request loop.
    }
  }

  try {
    await db.insert(outboundClicks).values({
      userId,
      placement: parsed.data.placement,
      target: parsed.data.target,
      lang: parsed.data.lang ?? null,
    });
  } catch {
    // Same: never throw.
  }
});

export default router;
