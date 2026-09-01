---
name: Development build-output contention
description: A workspace-specific race where concurrent test/build workflows interfere with the API development artifact.
---

The API development workflow can fail with a missing compiled entrypoint when another workflow builds the same artifact concurrently and replaces or clears its `dist` output.

**Why:** A completion-validation E2E run rebuilt the API while the managed development API workflow was starting, leaving the expected entrypoint absent even though the build itself reported success.

**How to apply:** When the API reports a missing `dist` entrypoint, stop the competing test/build workflow, remove only the affected build outputs and Vite caches, then restart the API and frontend workflows.