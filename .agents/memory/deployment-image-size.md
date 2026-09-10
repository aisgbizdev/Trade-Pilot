---
name: Deployment image size
description: Prevent successful multi-artifact builds from failing when the final deployment image exceeds Replit's size limit.
---

Exclude development-only bulk from the publish context: Playwright results, browser caches, Git history, and legacy project mirrors. Do not exclude workspace `node_modules`.

**Why:** A build can finish every artifact successfully and still fail while creating the final image when accumulated E2E videos and traces push its layers above Replit's 8 GiB limit. Replit's deployment packager prunes installed packages itself; excluding all `node_modules` removes required runtime dependencies and package links after build.

**How to apply:** When logs end with an image-size error after successful builds, inspect workspace disk usage first. Add only runtime-unnecessary paths to `.replitignore`; do not delete user assets, application data, or `node_modules`. Confirm runtime package imports and each artifact's production server afterward.