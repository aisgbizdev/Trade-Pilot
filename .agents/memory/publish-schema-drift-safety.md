---
name: Publish schema drift safety
description: Safely repair development/production schema drift without deleting production objects or development data.
---

When Publish proposes dropping a production table or enum that is still defined by the application schema, treat it as development schema drift. Restore the missing structure in development and recompute the Publish diff; do not approve the drop.

**Why:** Publish diffs development against production. If a source-defined object exists only in production because development missed a schema sync, the generated migration incorrectly appears destructive even though the application still needs the object.

**How to apply:** Confirm the object exists in source and production, inspect production read-only, then use the supported development-side schema path. Require a final diff with no removed tables/columns, truncation, or structural data-loss warning.

When production has a table not yet declared in source, do not assume it is disposable just because no current code references it. Check its columns, constraints, relationships, and intended role first; if it must be retained, declare it in source and restore it additively in development. Match constraint names as well as column shapes: Publish may otherwise propose dropping and recreating constraints despite equivalent definitions.

**Why:** A stale development schema can be missing both active account fields and production-only handshake tables; a partial restoration still leaves destructive SQL or unnecessary constraint churn in the Publish diff.

**How to apply:** Use production metadata read-only, perform only additive development-side repair, then require `explainSchemaDiff()` to report no statements and the source-schema checker to report no changes.

Never accept a Drizzle prompt that offers to truncate a populated table merely to add a nullable column or unique constraint.

**Why:** Non-interactive schema push can stop at this prompt, and choosing truncation would destroy unrelated development data.

**How to apply:** Select the non-truncating option only after checking compatibility. If the CLI cannot safely accept input, apply only the verified additive DDL to development and verify exact schema parity afterward.

In a non-interactive shell, `drizzle-kit push --strict` can print a confirmation menu and still exit successfully without applying anything.

**Why:** Exit code zero only means schema introspection reached the prompt; it does not prove the development schema changed.

**How to apply:** After any strict push, inspect the development schema directly and rerun strict push until it explicitly reports `No changes detected`.