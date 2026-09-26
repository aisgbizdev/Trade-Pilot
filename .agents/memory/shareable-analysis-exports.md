---
name: Shareable analysis exports
description: Guardrails for copying or exporting trading analysis as text and images.
---

Build shares from the saved analysis fields, include the instrument, timeframe, and original analysis time, and include citations only when they resolve to the saved fundamental snapshot. For image sharing, render the entire reason into a card rather than taking a screenshot of the currently visible portion of a scrollable dialog. If an image cannot be written to the browser clipboard, offer a PNG download.

**Why:** The detail dialog scrolls, so an ordinary screenshot can omit risk or invalidation conditions. An exported claim without its original time or with unmatched citations can be mistaken for current or verified market advice.

**How to apply:** Use these constraints whenever adding a copy, download, social share, or printable version of an analysis. Keep existing safety warnings in the source text and exported image, not only behind a disclosure.

Use a standardized, context-bearing chart image from both the inline price chart and the full-chart view, rather than capturing the user's current zoom or a whole page block.

**Why:** The user chose the compact chart image for sharing from either location. Current zoom can crop out Stop Loss or the wait status, and live quotes can be mistaken for levels from the saved analysis.

**How to apply:** Preserve original analysis time and saved status/levels, distinguish historical candles fetched later from live prices, and include a visible safety warning. If candles at the analysis time are unavailable, fail explicitly instead of substituting today's chart or trying to capture a third-party iframe.