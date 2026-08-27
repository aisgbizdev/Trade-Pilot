---
name: Situation-aware adaptive scaling
description: Safety rules for presenting a staged manual position plan from a saved analysis.
---

Adaptive position staging is an analysis-conditioned manual recommendation, never a response to price moving against a position. Permit extra stages only when the saved timeframe, market condition, risk, confidence range, directional bias, technical snapshot, and fundamental snapshot are all available and consistent. Treat missing inputs, short timeframes, high risk, volatile markets, low confidence, neutral bias, and high-impact events as entry-only. Reject strong direction conflicts rather than trying to average into them.

Its sizing inputs must come from the matching TP Standard Trading Rules record. Treat a loading, missing, or failed rule request as unavailable even when a query cache retains an older record: disable calculation and discard the whole local draft rather than displaying a plan based on stale rules.

**Why:** A partial or contradictory snapshot cannot justify increasing exposure. A cached rule after a refresh error is similarly not an auditable basis for sizing. Clear reasons help distinguish these safeguards from blind martingale behavior while leaving the Standard Plan unchanged.

**How to apply:** When analysis fields, standard-rule fetching, or recommendation persistence evolve, preserve the fail-closed gate, explain the decision in the UI, and discard malformed or stale local drafts rather than trusting browser data.