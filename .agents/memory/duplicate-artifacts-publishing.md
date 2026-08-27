---
name: Duplicate artifacts and publishing
description: How legacy nested workspace copies affect artifact discovery and production publishing.
---

When a workspace contains a nested copy of the project, its artifact manifests can be discovered alongside the active artifacts. Give legacy manifests distinct preview paths and remove their production service blocks; exclude the legacy directory from the deployment image.

**Why:** Duplicate artifact paths cause conflicting preview registrations, duplicate application builds, port collisions in development, and can make the deployment Bundle phase substantially larger or stall.

**How to apply:** Treat the root artifacts as canonical. Preserve legacy source only when needed for recovery, but keep it development-only and outside the production deployment image. Use the validated artifact-manifest replacement flow for manifest changes.