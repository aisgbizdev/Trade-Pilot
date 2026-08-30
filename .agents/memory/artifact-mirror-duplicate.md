---
name: Artifact mirror duplicate
description: The workspace contains a tracked trade-pilot mirror alongside the canonical root artifacts.
---

The root `artifacts/` tree is the canonical source for the web, API, and mobile artifacts; `trade-pilot/` is a mirrored copy that also produces duplicate workflow entries.

**Why:** Running or interpreting the mirrored workflows can show stale failures even when the canonical root services and tests are healthy. Because both artifact sets claim the same ports, the mirror can block canonical startup; a blocked API process may still report running without listening, and an installed PWA service worker may keep serving the mirror after switching.

**How to apply:** Validate and publish the root artifacts. Treat `trade-pilot/` workflow status as duplicate/stale unless explicitly requested. Stop all mirrored services first, then restart every canonical service that previously competed for a port—workflow “running” alone is insufficient; verify listeners or health endpoints. Use a fresh browser context or clear site data/service workers.