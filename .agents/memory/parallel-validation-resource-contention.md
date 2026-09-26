---
name: Parallel validation resource contention
description: How to distinguish regressions from worker starvation when full completion validation runs every suite concurrently.
---

Completion validation can produce broad, unrelated timeouts when API tests, frontend Vitest, Playwright E2E, and workspace typecheck run concurrently. Worker-start timeouts and many otherwise unrelated test timeouts are evidence of resource contention, not a shared functional regression. Concurrent Playwright runs must isolate both server ports and output directories: shared ports collide or disappear mid-suite, while shared trace directories get cleaned by the other run and fail with `ENOENT`.

**Why:** Validation has failed both from worker starvation and from reusing a manual E2E server that disappeared after validation began, even though the same full suite passed in isolation.

**How to apply:** Inspect every failed log, rerun the changed suite in isolation, and rerun any single suspicious E2E flow separately. On the four-core workspace, if different tests exceed even generous per-test deadlines across concurrent validation attempts, serialize the heavy registered suites with a shared process lock rather than raising deadlines or changing product behavior; retain the original test limits to catch genuine hangs. Keep completion Playwright runs on an owned server lifecycle (`reuseExistingServer: false`) with a unique frontend/API port pair selected once by the parent wrapper and inherited through an environment variable; use the same run ID for unique test-results and report directories because Playwright config is evaluated in multiple PIDs. Fix code only when the isolated failure intersects the task.