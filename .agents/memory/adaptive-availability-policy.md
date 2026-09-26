---
name: Adaptive availability without added cost
description: Product constraint for Adaptive outage handling, cost, and safe recovery.
---

Recover Adaptive from the same saved analysis and its captured market/fundamental inputs using local computation. Do not independently fetch new candles in Adaptive, add paid data sources, replay OpenAI, spend another credit, or automatically refund a successful AI analysis to mask an upstream outage.

**Why:** The owner explicitly requires maximum availability and consistency with the analysis without unapproved operating costs. A refund after successful AI generation shifts incurred cost to the owner; stale candles disguised as current can produce an unsafe trading recommendation.

**How to apply:** Capture provenance during analysis generation. When saved candles are missing or invalid, use only saved Standard Plan levels for explicitly limited sizing, not candle-derived signals. Propose a new paid provider or compensation policy only with explicit owner approval.