---
name: Bilingual copy assertions
description: Avoid stale test expectations when updating text shown across language changes.
---

When revising localized UI copy, search for every assertion of the old phrase, including later assertions after switching back to the original language.

**Why:** A language-toggle test may check the same disclaimer at several stages; updating just the first assertion leaves a later stale assertion that fails even though the UI is correct.

**How to apply:** Search old text and its translation across relevant tests before running the focused suite. Prefer checking against the current locale string when exact wording is intentional.