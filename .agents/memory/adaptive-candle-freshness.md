---
name: Adaptive candle freshness
description: Distinguish selected-timeframe candle recency from actual upstream fetch freshness in Adaptive plans.
---

Treat the last candle timestamp only as an upper bound on how old price evidence may be. It does not prove when the upstream source was fetched. A new Adaptive recommendation requires both a bar recent enough for its timeframe and a verifiably fresh upstream fetch; failure fallbacks never count as fresh.

**Why:** A 1W or 1D bar can be old by design, while an intraday bar from days ago should not support a new entry. A just-served cache entry can also hide an old or failed feed. Claiming the latest bar date or response time is fetch time misleads traders.

**How to apply:** Whenever Adaptive uses chart data to propose checkpoints, volatility comparisons, or alternatives, respect the saved analysis timeframe and validity; compare the upstream retrieval timestamp and latest valid bar separately, and explain which one blocks the plan.