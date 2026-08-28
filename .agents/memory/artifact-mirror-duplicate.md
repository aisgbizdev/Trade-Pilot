---
name: Artifact mirror duplicate
description: The workspace contains a tracked trade-pilot mirror alongside the canonical root artifacts.
---

The root `artifacts/` tree is the canonical source for the web, API, and mobile artifacts; `trade-pilot/` is a mirrored copy that also produces duplicate workflow entries.

**Why:** Running or interpreting the mirrored workflows can show stale failures even when the canonical root services and tests are healthy.

**How to apply:** Validate and publish the root artifacts. Treat `trade-pilot/` workflow status as duplicate/stale unless the user explicitly asks to work on that mirror.