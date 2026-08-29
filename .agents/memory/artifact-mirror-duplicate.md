---
name: Artifact mirror duplicate
description: The workspace contains a tracked trade-pilot mirror alongside the canonical root artifacts.
---

The root `artifacts/` tree is the canonical source for the web, API, and mobile artifacts; `trade-pilot/` is a mirrored copy that also produces duplicate workflow entries.

**Why:** Running or interpreting the mirrored workflows can show stale failures even when the canonical root services and tests are healthy. Because both web artifacts claim the same preview port, the mirror can also block the canonical workflow; an installed PWA service worker may keep serving the mirror after the workflow is switched.

**How to apply:** Validate and publish the root artifacts. Treat `trade-pilot/` workflow status as duplicate/stale unless the user explicitly asks to work on that mirror. For browser verification, stop the mirrored web workflow before starting the canonical one and use a fresh browser context or clear site data/service workers.