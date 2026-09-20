---
name: Publish diff excludes unapplied source schema
description: Why a clean development-to-production diff can still miss a column required by newly published code.
---

Before publishing schema-dependent code, verify that every schema declaration has actually been applied to the development database. A clean or narrow Publish diff only proves development and production databases are aligned with each other; it does not prove either database matches the schema source used to build the app.

**Why:** Publish computes its migration from the development database to the production database. If a new Drizzle field exists in source but was never pushed to development, the generated production migration omits it while the deployed code still queries it, causing runtime failures.

**How to apply:** For schema changes, confirm the expected column/table in development after the dev-side schema application, then review the Publish diff for the corresponding additive migration before approving.