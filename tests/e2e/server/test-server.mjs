// Unified-origin test harness server for the Trade Pilot e2e suite.
//
// Starts the built api-server as a child process on a free internal port,
// then exposes a single Express server on $PORT that:
//   - reverse-proxies `/api/*` to the api-server child
//   - serves the prebuilt ai-trading static bundle from
//     `artifacts/ai-trading/dist/public`
//   - falls back to `index.html` for any non-API GET (SPA routing)
//
// Mirroring production routing inside one origin keeps `sameSite=lax`
// session cookies usable from Playwright without cross-origin gymnastics.

import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const STATIC_DIR = path.join(
  REPO_ROOT,
  "artifacts",
  "ai-trading",
  "dist",
  "public",
);
const API_SERVER_ENTRY = path.join(
  REPO_ROOT,
  "artifacts",
  "api-server",
  "dist",
  "index.mjs",
);

const PORT = Number(process.env.PORT ?? 4380);
const API_PORT = Number(process.env.E2E_API_PORT ?? 4381);
const HEALTHZ_TIMEOUT_MS = 30_000;

if (Number.isNaN(PORT) || PORT <= 0) {
  console.error(`Invalid PORT: ${process.env.PORT}`);
  process.exit(1);
}
if (Number.isNaN(API_PORT) || API_PORT <= 0) {
  console.error(`Invalid E2E_API_PORT: ${process.env.E2E_API_PORT}`);
  process.exit(1);
}

function waitForHealthz(port, timeoutMs) {
  const url = `http://127.0.0.1:${port}/api/healthz`;
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else if (Date.now() > deadline) {
          reject(
            new Error(
              `api-server healthz returned ${res.statusCode} after timeout`,
            ),
          );
        } else {
          setTimeout(tick, 250);
        }
      });
      req.on("error", () => {
        if (Date.now() > deadline) {
          reject(new Error("api-server healthz never came up"));
        } else {
          setTimeout(tick, 250);
        }
      });
      req.setTimeout(2_000, () => req.destroy());
    };
    tick();
  });
}

function startApiServer() {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "[e2e] DATABASE_URL not set — api-server will fail to authenticate. The test harness still starts, but tests requiring auth will fail.",
    );
  }

  const child = spawn(
    process.execPath,
    ["--enable-source-maps", API_SERVER_ENTRY],
    {
      env: {
        ...process.env,
        PORT: String(API_PORT),
        // Keep NODE_ENV unset / non-production so the api-server issues
        // cookies with `secure: false` over plain http.
        NODE_ENV: process.env.NODE_ENV === "production" ? "test" : "development",
      },
      stdio: ["ignore", "inherit", "inherit"],
    },
  );

  child.on("exit", (code, signal) => {
    console.error(
      `[e2e] api-server child exited (code=${code}, signal=${signal})`,
    );
    if (code !== 0 && !shuttingDown) {
      process.exit(code ?? 1);
    }
  });

  return child;
}

let shuttingDown = false;
const apiChild = startApiServer();

function shutdown(reason) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[e2e] shutting down (${reason})`);
  try {
    apiChild.kill("SIGTERM");
  } catch {
    /* noop */
  }
  setTimeout(() => process.exit(0), 250);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

await waitForHealthz(API_PORT, HEALTHZ_TIMEOUT_MS).catch((err) => {
  console.error(`[e2e] ${err.message}`);
  shutdown("healthz timeout");
  process.exit(1);
});
console.log(`[e2e] api-server ready on :${API_PORT}`);

const app = express();

// Reverse proxy: /api/* -> http://127.0.0.1:API_PORT/api/*
// We use raw `node:http` and stream piping to avoid any body parsing /
// re-encoding (so multipart/JSON/etc all forward intact).
app.use("/api", (req, res) => {
  const upstreamPath = "/api" + req.url;
  const headers = { ...req.headers, host: `127.0.0.1:${API_PORT}` };

  const proxyReq = http.request(
    {
      host: "127.0.0.1",
      port: API_PORT,
      method: req.method,
      path: upstreamPath,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on("error", (err) => {
    if (!res.headersSent) {
      res.status(502).type("text/plain").end(`proxy error: ${err.message}`);
    } else {
      res.destroy();
    }
  });

  req.pipe(proxyReq);
});

// Static SPA assets.
app.use(
  express.static(STATIC_DIR, {
    index: false,
    fallthrough: true,
    cacheControl: false,
  }),
);

// SPA fallback — serve index.html for any non-API GET.
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, "index.html"));
});

const httpServer = app.listen(PORT, () => {
  console.log(`[e2e] READY http://127.0.0.1:${PORT}`);
});

httpServer.on("error", (err) => {
  console.error(`[e2e] http server error: ${err.message}`);
  shutdown("http error");
  process.exit(1);
});
