---
name: OpenAPI Zod version drift
description: Codegen can emit Zod v4 syntax while this workspace still runs Zod v3.
---

Do not assume a successful Orval generation means its Zod output is compatible with the installed runtime. The current generator can emit top-level helpers such as `zod.int()` and `zod.email()`, while the workspace runtime still provides Zod v3.

**Why:** A routine contract regeneration replaced the working generated validators with Zod v4-style output, causing every API route test importing the validator barrel to fail at startup.

**How to apply:** After codegen, immediately run the API route tests or import the generated validator barrel. If v4 helpers appear before the runtime upgrade is intentional, restore generated outputs and avoid committing the incompatible regeneration; align generator and Zod versions in a dedicated dependency change.