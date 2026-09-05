---
name: Post-merge API client generation
description: Why merged API-contract changes can temporarily break frontend typechecking.
---

Merged OpenAPI contract changes can leave generated React and Zod clients stale because the current post-merge setup installs dependencies and applies database schema changes but does not regenerate API clients.

**Why:** The server and frontend can temporarily compile against different API contracts when generated declarations are not refreshed during merge reconciliation.

**How to apply:** After merges that change the API specification, regenerate the Orval clients and rebuild library declarations before diagnosing missing frontend exports.