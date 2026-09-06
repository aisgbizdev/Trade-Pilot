---
name: Deterministic API codegen
description: Keep generated validators runtime-compatible and prevent emitter or build-cache drift.
---

Pin the API generator to an emitter that matches the validator runtime and committed output. Before accepting a generator change, regenerate an unchanged contract and require zero generated diff.

**Why:** Compatible dependency ranges can silently select an emitter with newer validator syntax or broad formatting changes, breaking every route that imports the generated barrel.

**How to apply:** Keep generator and runtime upgrades intentional and paired. Validate the generated barrel and route imports after regeneration.

Orval's automatic Zod target can default to Zod 4 when it cannot resolve package metadata from the generator workspace, even when the monorepo still uses Zod 3.

**Why:** A security-driven Orval upgrade emitted top-level `z.int()` and `z.email()` calls that do not exist in Zod 3.

**How to apply:** Explicitly pin `override.zod.version` to the installed runtime major; do not rely on auto-detection in this workspace.

Clean the Dart generated-part cache before rebuilding models.

**Why:** Incremental build state can preserve stale builder fields and enum serializers after OpenAPI Generator rewrites model sources.

**How to apply:** Clean, rebuild, and analyze Dart generated parts; warnings from generator templates may be non-fatal, but analyzer errors must fail codegen.

Before regenerating, verify the installed generator version matches the lockfile/package declaration; reinstall the frozen lockfile when they differ.

**Why:** A stale workspace install can run an older Orval even though the manifest and lockfile pin a newer release, producing invalid validators and broad generated-file drift.

**How to apply:** Check the generator package's resolved version before codegen, then run the full codegen pipeline and the root typecheck.