---
name: Adaptive candle freshness
description: Distinguish selected-timeframe candle recency from actual upstream fetch freshness in Adaptive plans.
---

Treat the last candle timestamp only as an upper bound on how old price evidence may be. It does not prove when the upstream source was fetched. If the last bar is too old for its timeframe, do not build a new Adaptive recommendation; once available, prefer explicit source fetch metadata over inferred freshness.

**Why:** The historical candle response provides OHLC and bar dates but no fetched-at or stale-source field. A 1W or 1D bar can be old by design, while an intraday bar from days ago should not support a new entry. Claiming the latest bar date is fetch time misleads traders.

**How to apply:** Whenever Adaptive uses chart data to propose checkpoints, volatility comparisons, or alternatives, respect the saved analysis timeframe and validity, and gate stale/missing candle evidence. If the API gains fetched-at metadata, compare both source freshness and latest valid bar rather than presenting either as the other.