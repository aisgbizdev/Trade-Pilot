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
  keyFn: (req) => `${clientIp(req)}|${(req.body?.email ?? "").toLowerCase()}`,
  message:
    "Terlalu banyak permintaan reset password. Coba lagi dalam beberapa menit. / Too many password reset requests. Try again in a few minutes.",
});

export const forgotPasswordVerifyLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyFn: (req) => `${clientIp(req)}|${(req.body?.email ?? "").toLowerCase()}`,
  message:
    "Terlalu banyak percobaan jawaban keamanan. Akun terkunci sementara. / Too many security answer attempts. Account locked temporarily.",
});

setInterval(() => {
  const now = Date.now();
  for (const limiter of [forgotPasswordQuestionLimiter, forgotPasswordVerifyLimiter]) {
    for (const [k, b] of limiter.store) {
      if (b.resetAt <= now) limiter.store.delete(k);
    }
  }
}, 60_000).unref();
