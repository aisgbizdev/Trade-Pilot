import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyFn: (req: Request) => string;
  message?: string;
}

function clientIp(req: Request): string {
  // Relies on Express `trust proxy` being configured at the app level so
  // `req.ip` reflects the real client IP from the trusted proxy chain
  // instead of an arbitrary, attacker-controlled `x-forwarded-for` value.
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

// Safely derive the email portion of a per-(ip,email) key. Must never throw
// — limiter middleware runs before the route's Zod schema, so an attacker
// can ship `email: 123` or `email: {}` and we'd crash with a 500 instead of
// a clean 400 if we naively called `.toLowerCase()` on a non-string.
function emailKeyPart(req: Request): string {
  const v = req.body?.email;
  return typeof v === "string" ? v.toLowerCase() : "";
}

function buildLimiter(opts: RateLimitOptions) {
  const store = new Map<string, Bucket>();
  const middleware = (req: Request, res: Response, next: NextFunction) => {
    const key = opts.keyFn(req);
    const now = Date.now();
    const bucket = store.get(key);

    if (!bucket || bucket.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + opts.windowMs });
      return next();
    }

    if (bucket.count >= opts.max) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfter));
      res.status(429).json({
        error:
          opts.message ??
          `Terlalu banyak percobaan. Coba lagi dalam ${retryAfter} detik. / Too many attempts. Try again in ${retryAfter}s.`,
      });
      return;
    }

    bucket.count += 1;
    next();
  };
  return Object.assign(middleware, { store });
}

export const forgotPasswordQuestionLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyFn: (req) => `${clientIp(req)}|${emailKeyPart(req)}`,
  message:
    "Terlalu banyak permintaan reset password. Coba lagi dalam beberapa menit. / Too many password reset requests. Try again in a few minutes.",
});

export const forgotPasswordVerifyLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyFn: (req) => `${clientIp(req)}|${emailKeyPart(req)}`,
  message:
    "Terlalu banyak percobaan jawaban keamanan. Akun terkunci sementara. / Too many security answer attempts. Account locked temporarily.",
});

// /auth/login runs bcrypt.compare on every request — that's CPU-expensive by
// design. Without a limiter it's a cheap DoS vector and an open door for
// credential-stuffing. Keying on `ip|email` lets honest users on a shared
// IP keep retrying their own account without being blocked by a neighbour.
export const loginLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyFn: (req) => `${clientIp(req)}|${emailKeyPart(req)}`,
  message:
    "Terlalu banyak percobaan login. Coba lagi dalam beberapa menit. / Too many login attempts. Try again in a few minutes.",
});

// /auth/register has no identifier yet, so the limiter is per-IP. Sized
// generously so households / offices behind a single NAT can still legitimately
// sign up multiple accounts within an hour.
export const registerLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyFn: (req) => clientIp(req),
  message:
    "Terlalu banyak pendaftaran dari alamat ini. Coba lagi dalam satu jam. / Too many sign-ups from this address. Try again in an hour.",
});

// /auth/forgot-password/reset is already gated by a 64-char crypto-random token,
// but a per-IP limiter is consistent with the rest of the reset flow and stops
// trivial flooding of the bcrypt path on the success branch.
export const forgotPasswordResetLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyFn: (req) => clientIp(req),
  message:
    "Terlalu banyak percobaan reset password. Coba lagi dalam beberapa menit. / Too many password reset attempts. Try again in a few minutes.",
});

// Per-user limiter for the "send a sample push to my own devices" button on
// the Notifications page. The endpoint exists purely so a user can verify
// their phone actually pops up — anything more than a few per hour is either
// a misbehaving client or someone trying to abuse the platform's web-push
// quota. Keyed off the authenticated `req.userId`, so this middleware MUST
// run AFTER `requireAuth`.
export const pushTestLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyFn: (req) => {
    const id = (req as Request & { userId?: number }).userId;
    return typeof id === "number" ? `user-${id}` : clientIp(req);
  },
  message:
    "Terlalu banyak tes notifikasi. Coba lagi sebentar lagi. / Too many test notifications. Try again in a bit.",
});

setInterval(() => {
  const now = Date.now();
  for (const limiter of [
    forgotPasswordQuestionLimiter,
    forgotPasswordVerifyLimiter,
    loginLimiter,
    registerLimiter,
    forgotPasswordResetLimiter,
    pushTestLimiter,
  ]) {
    for (const [k, b] of limiter.store) {
      if (b.resetAt <= now) limiter.store.delete(k);
    }
  }
}, 60_000).unref();
