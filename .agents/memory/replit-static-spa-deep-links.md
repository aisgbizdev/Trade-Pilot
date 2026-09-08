---
name: Replit static SPA deep links
description: Production routing choice for client-side routes that must work when opened directly.
---

For the TradePilot web artifact, use a production process server that supports SPA history fallback rather than Replit static artifact serving.

**Why:** Replit static artifact hosting returned raw HTTP 404 responses for direct visits to client-side routes even when the build emitted conventional `404.html` and `200.html` fallback copies. Root navigation worked, which made the failure easy to miss.

**How to apply:** When changing web deployment settings, verify several extensionless routes by requesting them directly in production mode. Keep `/api` on its separate service and ensure the root web service returns the app shell for non-file routes.