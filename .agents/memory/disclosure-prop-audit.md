---
name: Disclosure prop audit
description: How to audit short localized explanations hidden behind shared disclosure components.
---

Trace subtitle props from reusable cards to every call site when deciding which explanations should be visible by default; a generic prop name does not imply the copy is dynamic or long.

**Why:** A first pass over literal locale references missed short, fixed category descriptions passed through a shared card as a generic subtitle prop.

**How to apply:** When changing visibility of helper text on web/PWA, inspect both the shared wrapper and the values each caller supplies before deciding to opt in to inline display. Keep genuinely long or generated copy inside disclosures.