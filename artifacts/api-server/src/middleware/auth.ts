import { Request, Response, NextFunction } from "express";
import { db } from "../lib/db";
import { sessions, users } from "@workspace/db/schema";
import { eq, and, gt } from "drizzle-orm";

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token =
    req.cookies?.["session_token"] ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [session] = await db
    .select({ userId: sessions.userId, expiresAt: sessions.expiresAt })
    .from(sessions)
    .where(
      and(eq(sessions.token, token), gt(sessions.expiresAt, new Date()))
    )
    .limit(1);

  if (!session) {
    res.status(401).json({ error: "Session expired or invalid" });
    return;
  }

  req.userId = session.userId;

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  req.userRole = user?.role ?? "user";
  next();
}

export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  await requireAuth(req, res, async () => {
    if (req.userRole !== "admin" && req.userRole !== "super_admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}

export async function requireSuperAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  await requireAuth(req, res, async () => {
    if (req.userRole !== "super_admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}
