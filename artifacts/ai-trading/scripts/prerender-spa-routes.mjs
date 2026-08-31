// Production is served as PLAIN STATIC FILES by Replit's static-hosting
// service (see `.replit-artifact/artifact.toml`, `serve = "static"`) —
// there is no server-side SPA fallback there, so a direct HTTP request to
// a client-side-only route (e.g. `GET /privacy`) 404s, even though
// clicking the same link *inside* the already-loaded app works fine
// (wouter just does `history.pushState`, no new HTTP request).
//
// Fix: after `vite build`, copy the built `index.html` (the SPA shell) to
// `<route>/index.html` for every static route below. The static file
// server then finds a real file at that path and serves it with a normal
// 200, the exact same SPA bundle boots, and wouter reads
// `window.location.pathname` and renders the right page client-side —
// identical end result to today's in-app navigation, just also reachable
// by a fresh/direct request (bookmarks, shared links, app-store reviewers,
// search engines).
//
// This only covers STATIC routes (finite, known at build time). It does
// NOT fix dynamic routes like `/analyses/:id` (unbounded id space) — a
// shared analysis link or a push-notification deep link still needs a
// real server-side catch-all fallback (Replit static-hosting SPA/rewrite
// setting, or routing all traffic through api-server's Express app, which
// already has the correct fallback logic — see `src/app.ts`). Track that
// separately; this script is the narrow, safe fix for the fixed page set.
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const distPublic = join(here, "..", "dist", "public");
const indexHtmlPath = join(distPublic, "index.html");

// Every static (non-parameterized) route in src/App.tsx that should be
// directly reachable by URL. Keep this in sync with the router — a route
// missing here will still work via in-app navigation, it just won't
// survive a hard refresh / direct link.
const STATIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/support",
  "/delete-account",
  "/performance",
  "/performance/methodology",
  "/dashboard",
  "/analyze",
  "/history",
  "/analytics",
  "/profile",
  "/notifications",
  "/daily-summary",
  "/my-alerts",
  "/mindset",
  "/journal",
  "/mirror",
  "/admin",
  "/admin/users",
  "/admin/feedback",
];

if (!existsSync(indexHtmlPath)) {
  console.error(`[prerender-spa-routes] ${indexHtmlPath} not found — did the build run first?`);
  process.exit(1);
}

const indexHtml = readFileSync(indexHtmlPath, "utf8");
let written = 0;

for (const route of STATIC_ROUTES) {
  const dir = join(distPublic, route);
  const outFile = join(dir, "index.html");
  mkdirSync(dir, { recursive: true });
  writeFileSync(outFile, indexHtml);
  written++;
}

console.log(`[prerender-spa-routes] Wrote SPA-shell index.html copies for ${written} static route(s).`);
