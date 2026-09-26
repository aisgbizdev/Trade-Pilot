---
name: Shareable analysis exports
description: Guardrails for copying or exporting trading analysis as text and images.
---

Build shares from the saved analysis fields, include the instrument, timeframe, and original analysis time, and include citations only when they resolve to the saved fundamental snapshot. For image sharing, render the entire reason into a card rather than taking a screenshot of the currently visible portion of a scrollable dialog. If an image cannot be written to the browser clipboard, offer a PNG download.

**Why:** The detail dialog scrolls, so an ordinary screenshot can omit risk or invalidation conditions. An exported claim without its original time or with unmatched citations can be mistaken for current or verified market advice.

**How to apply:** Use these constraints whenever adding a copy, download, social share, or printable version of an analysis. Keep existing safety warnings in the source text and exported image, not only behind a disclosure.