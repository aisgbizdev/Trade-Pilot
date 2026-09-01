---
name: Parallel validation resource contention
description: How to distinguish regressions from worker starvation when full completion validation runs every suite concurrently.
---

Completion validation can produce broad, unrelated timeouts when API tests, frontend Vitest, Playwright E2E, and workspace typecheck run concurrently. Worker-start timeouts and many otherwise unrelated test timeouts are evidence of resource contention, not a shared functional regression.

**Why:** A validation run timed out unrelated API authentication tests and several frontend pages while Vitest reported workers that never started. The task-specific frontend suite passed repeatedly in isolation.

**How to apply:** Inspect every failed log, rerun the changed suite in isolation, and rerun any single suspicious E2E flow separately. Fix code only when the isolated failure intersects the task; otherwise record the unrelated failure precisely when closing the task.