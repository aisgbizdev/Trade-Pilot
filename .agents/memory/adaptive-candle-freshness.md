---
name: Adaptive analysis snapshot
description: Keep Adaptive market inputs identical to the saved analysis instead of fetching again.
---

Adaptive must calculate from the saved analysis's own market snapshot, timeframe, trade levels, and fundamental context. Do not silently refresh candles or running prices when Adaptive opens. Record the upstream retrieval time separately from bar time and analysis time; a cached or failed source cannot be relabelled fresh. Missing legacy candles may support a levels-only sizing scenario, never fabricated swing or volatility confirmation.

**Why:** The owner confirmed Adaptive is a continuation of the analysis, in open and closed markets alike. Independently refreshing its market inputs can shift prices away from the plan users just read; rejecting it solely because the market closed contradicts a successfully generated analysis. Old snapshots still must not be represented as current entry prices.

**How to apply:** Capture coherent inputs when generating a new analysis; pass its immutable saved snapshot to Adaptive for checkpoints and sizing. Preserve explicit validity and as-of labels, distinguish user's later risk/broker inputs, and request a new analysis rather than swapping in new market data.