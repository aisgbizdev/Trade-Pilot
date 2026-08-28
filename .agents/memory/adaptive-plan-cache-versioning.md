---
name: Adaptive-plan cache versioning
description: Prevent stale saved position recommendations from surviving calculator behavior changes.
---

Whenever adaptive position-plan calculation semantics or result validity rules change, bump the browser storage namespace used for saved recommendations.

**Why:** A saved recommendation can retain the old valid/invalid result even after the calculator code is fixed. Reloading then appears to reproduce the bug until that analysis-specific browser draft is removed.

**How to apply:** Treat the storage namespace as part of the calculator algorithm version. Bump it alongside behavioral changes, then verify a reload ignores the previous namespace without requiring users to clear browser data manually.