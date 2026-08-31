---
name: Situation-aware adaptive scaling
description: Safety rules for presenting a staged manual position plan from a saved analysis.
---

Adaptive position staging is an analysis-conditioned manual recommendation, never a response to price moving against a position. Permit extra stages only when the saved timeframe, market condition, risk, confidence range, directional bias, technical snapshot, and fundamental snapshot are all available and consistent. Treat missing inputs, short timeframes, high risk, volatile markets, low confidence, neutral bias, and high-impact events as entry-only. Reject strong direction conflicts rather than trying to average into them.

Its sizing inputs must come from the matching TP Standard Trading Rules record. Treat a loading, missing, or failed rule request as unavailable even when a query cache retains an older record: disable calculation and discard the whole local draft rather than displaying a plan based on stale rules.

**Why:** A partial or contradictory snapshot cannot justify increasing exposure. A cached rule after a refresh error is similarly not an auditable basis for sizing. Clear reasons help distinguish these safeguards from blind martingale behavior while leaving the Standard Plan unchanged.

**How to apply:** When analysis fields, standard-rule fetching, or recommendation persistence evolve, preserve the fail-closed gate, explain the decision in the UI, and discard malformed or stale local drafts rather than trusting browser data.

For a valid multi-position scenario, size the initial position first and taper later positions below it. Calculate each row from its own distance to the one final Stop Loss, then reduce the plan from three positions to two or one before violating margin, tier exposure, minimum-lot, or maximum-loss limits. Never split funds equally by default and never increase later lots.

**Why:** Equal fund splits ignore that each entry has a different loss distance, while increasing later lots would resemble martingale behavior. Reducing position count is safer and easier to audit than silently exceeding a hard limit.

**How to apply:** Keep the total position count, each position's price/lot/risk, cumulative risk, and total lots explicit. Buy and Sell remain separate scenarios, and missing price candidates must reduce the count rather than create synthetic levels.

The saved AI analysis is the primary product output; the adaptive plan is a secondary explanation of what the user's selected account tier and available margin can support. Keep the default UI output-first: direction, entry and staged prices/lots, one final SL, saved TP targets, margin, and maximum loss. Put comparison, provenance, and detailed reasoning behind progressive disclosure.

**Why:** Users need a quick, actionable reading without losing the technical/fundamental intelligence that distinguishes Trade Pilot from a standalone lot calculator. Novices should not face a wall of narrative, while professionals must still be able to inspect the full reasoning and all objective alternatives.

**How to apply:** Never let a 3×3 tier/risk comparison dominate the analysis page. Show one active Buy/Sell scenario at a time, keep all explicit combinations accessible, and never let presentation changes alter the saved analysis thesis, TP/SL, or ladder safety rules.