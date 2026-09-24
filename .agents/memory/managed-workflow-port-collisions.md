---
name: Managed workflow port collisions
description: Diagnose artifact workflow EADDRINUSE when an older shell-launched process survives.
---

When an artifact's managed workflow reports EADDRINUSE but its API still responds, check the port owner's command, parent process group, and cgroup before changing code or restarting repeatedly. A shell-launched copy may be serving traffic while the managed workflow itself is failed.

**Why:** A surviving shell-exec process once held the API port for hours, causing the managed workflow's new process to fail while the API still appeared healthy.

**How to apply:** Stop only the confirmed duplicate process group, then restart the existing managed artifact workflow once and verify that its own listener and proxied API are healthy. Do not reconfigure or add another workflow.