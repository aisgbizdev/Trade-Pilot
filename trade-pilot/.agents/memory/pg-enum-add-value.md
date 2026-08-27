---
name: Postgres enum migration with Drizzle
description: Adding a value to a Drizzle pgEnum requires explicit ALTER TYPE; tsc cross-package types depend on the generated lib d.ts being refreshed.
---
Adding a value to `pgEnum(...)` in `lib/db/src/schema/index.ts` does NOT propagate automatically:
1. Run `ALTER TYPE <enum_name> ADD VALUE IF NOT EXISTS '<value>' [BEFORE '<existing>']` against the live DB.
2. Rebuild the lib (`pnpm run typecheck:libs` regenerates `lib/db/dist/schema/index.d.ts`) so consumer packages see the new union member.
3. If `tsc --build` cache looks stale, delete `lib/**/*.tsbuildinfo` and rerun.

**Why:** drizzle-kit push isn't safe for enum add-value (Postgres requires the literal SQL); without (2), api-server typechecks against an out-of-date enum union and rejects inserts using the new value.

**How to apply:** any task that grows a pgEnum (e.g., new guardrail_kind, new notification_kind). Always do schema edit + ALTER TYPE + lib rebuild in the same change.
