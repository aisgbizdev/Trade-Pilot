---
name: Deterministic API codegen
description: Keep generated validators runtime-compatible and prevent emitter or build-cache drift.
---

Pin the API generator to an emitter that matches the validator runtime and committed output. Before accepting a generator change, regenerate an unchanged contract and require zero generated diff.

**Why:** Compatible dependency ranges can silently select an emitter with newer validator syntax or broad formatting changes, breaking every route that imports the generated barrel.

**How to apply:** Keep generator and runtime upgrades intentional and paired. Validate the generated barrel and route imports after regeneration.

Clean the Dart generated-part cache before rebuilding models.

**Why:** Incremental build state can preserve stale builder fields and enum serializers after OpenAPI Generator rewrites model sources.

**How to apply:** Clean, rebuild, and analyze Dart generated parts; warnings from generator templates may be non-fatal, but analyzer errors must fail codegen.