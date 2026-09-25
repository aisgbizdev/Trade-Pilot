---
name: Publish diff excludes unapplied source schema
description: Why a clean development-to-production diff can still miss a column required by newly published code.
---

Before publishing schema-dependent code, verify that every schema declaration has actually been applied to the development database. Compare *all* source tables and columns against development, not just the field named by the first runtime error. A clean or narrow Publish diff only proves development and production databases are aligned with each other; it does not prove either database matches the schema source used to build the app.

**Why:** Publish computes its migration from the development database to the production database. If a new Drizzle field exists in source but was never pushed to development, the generated production migration omits it while the deployed code still queries it, causing runtime failures. Fixing only the first missing field led to repeated broken-login publishes as subsequent source-only fields became the next failure.

**How to apply:** Before asking for Publish, check every source-defined table and column against development; review defaults, constraints, and enum types for any missing entries; then review the complete development-to-production diff for additive-only operations before approving.