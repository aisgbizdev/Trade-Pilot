---
name: Situation-aware adaptive scaling
description: Safety rules for presenting a staged manual position plan from a saved analysis.
---

Adaptive position staging is an analysis-conditioned manual recommendation, never a response to price moving against a position. Permit extra stages only when the saved timeframe, market condition, risk, confidence range, directional bias, technical snapshot, and fundamental snapshot are all available and consistent. Treat missing inputs, short timeframes, high risk, volatile markets, low confidence, neutral bias, and high-impact events as entry-only. Reject strong direction conflicts rather than trying to average into them.

**Why:** A partial or contradictory snapshot cannot justify increasing exposure. Clear reasons help distinguish this safeguard from blind martingale behavior while leaving the Standard Plan unchanged.

**How to apply:** When analysis fields or recommendation persistence evolve, preserve the fail-closed gate, explain the decision in the UI, and discard malformed local drafts rather than trusting stale browser data.