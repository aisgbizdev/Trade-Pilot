---
name: Publish schema drift safety
description: Safely repair development/production schema drift without deleting production objects or development data.
---

When Publish proposes dropping a production table, enum, or column, treat it as a data-preservation problem even if the object is no longer defined in source. Restore the missing structure in development and, where necessary, retain its declaration in source until an explicitly approved data migration; do not approve the drop as a side effect of an unrelated feature.

**Why:** Publish diffs development against production. A source-to-development audit can pass yet miss production-only legacy columns holding real user data. An unrelated feature publish can then silently offer to delete those columns.

**How to apply:** Inspect production read-only and compare the full Publish diff in both directions; restore legacy structure through the supported development-side schema path. Require a final diff with no removed tables/columns, truncation, or structural data-loss warning.

Never accept a Drizzle prompt that offers to truncate a populated table merely to add a nullable column or unique constraint.

**Why:** Non-interactive schema push can stop at this prompt, and choosing truncation would destroy unrelated development data.

**How to apply:** Select the non-truncating option only after checking compatibility. If the CLI cannot safely accept input, apply only the verified additive DDL to development and verify exact schema parity afterward.

In a non-interactive shell, `drizzle-kit push --strict` can print a confirmation menu and still exit successfully without applying anything.

**Why:** Exit code zero only means schema introspection reached the prompt; it does not prove the development schema changed.

**How to apply:** After any strict push, inspect the development schema directly and rerun strict push until it explicitly reports `No changes detected`.