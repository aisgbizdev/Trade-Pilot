---
name: Deployment image size
description: Prevent successful multi-artifact builds from failing when the final deployment image exceeds Replit's size limit.
---

Exclude development-only bulk from the publish context: Playwright results, browser caches, workspace `node_modules`, Git history, and legacy project mirrors.

**Why:** A build can finish every artifact successfully and still fail while creating the final image when accumulated E2E videos and traces push its layers above Replit's 8 GiB limit.

**How to apply:** When logs end with an image-size error after successful builds, inspect workspace disk usage first. Add only runtime-unnecessary paths to `.replitignore`; do not delete user assets or application data.