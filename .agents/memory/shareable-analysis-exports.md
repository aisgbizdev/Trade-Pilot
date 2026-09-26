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

The compact Adaptive **Ringkasan plan** image remains a separate export: only the active Buy or Sell card, never a screenshot of the full panel or dialog. A printable **analysis-and-Adaptive briefing guide** is a different deliverable: it may combine an analysis-time chart, saved analysis rationale, and at most the selected viable Adaptive scenario. A wait, blocked, or conditional side must be named as non-actionable, not shown as a definite position to take. Keep TradePilot attribution and a plain-language disclaimer explaining the product's role in every public-facing version.

**Why:** The user separately requested a host/client/broker-friendly printable briefing, including a chart and subtle watermark, while insisting that no exported Buy/Sell side be usable as evidence of a certain trade instruction. This expands the guide, not the earlier compact plan-card share.

**How to apply:** For compact shares, keep each side's accepted positions and risk figures together with original analysis time, prominent actionability status, and a warning. For the briefing guide, distinguish historical chart levels from Adaptive's selected scenario; if analysis-time candles are unavailable, say so rather than substitute live data. Preserve provenance and risk limits in text, images, and printable output; do not promise watermarks prevent removal.