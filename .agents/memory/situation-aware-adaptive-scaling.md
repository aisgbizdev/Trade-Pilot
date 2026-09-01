---
name: Situation-aware adaptive scaling
description: Safety rules for presenting a staged manual position plan from a saved analysis.
---

Adaptive position staging is an analysis-conditioned manual recommendation, never a response to price moving against a position. Permit extra stages only when the saved timeframe, market condition, risk, confidence range, directional bias, technical snapshot, and fundamental snapshot are all available and consistent. Treat missing inputs, short timeframes, high risk, volatile markets, low confidence, neutral bias, and high-impact events as entry-only. Reject strong direction conflicts rather than trying to average into them.

Its sizing inputs must come from the matching TP Standard Trading Rules record. Treat a loading, missing, or failed rule request as unavailable even when a query cache retains an older record: disable calculation and discard the whole local draft rather than displaying a plan based on stale rules.

**Why:** A partial or contradictory snapshot cannot justify increasing exposure. A cached rule after a refresh error is similarly not an auditable basis for sizing. Clear reasons help distinguish these safeguards from blind martingale behavior while leaving the Standard Plan unchanged.

**How to apply:** When analysis fields, standard-rule fetching, or recommendation persistence evolve, preserve the fail-closed gate, explain the decision in the UI, and discard malformed or stale local drafts rather than trusting browser data.

For a valid multi-position scenario, let the selected risk style and saved analysis resolve a deterministic decreasing, mixed, or increasing lot profile. Calculate each row from its own distance to the one final Stop Loss, cap every position independently at the tier maximum, and allow cumulative lots above that per-position cap only while total margin and maximum loss remain safe. Reduce the plan from three positions to two or one before violating margin, minimum-lot, per-position lot, or maximum-loss limits. Never split funds equally by default or increase lots merely because price moved against the entry.

**Why:** Equal fund splits ignore that each entry has a different loss distance. A planned increasing profile can be valid when analysis supports it, but an automatic adverse-move increase would be martingale behavior. Reducing position count is safer and easier to audit than silently exceeding a hard limit.

**How to apply:** Keep the active profile, total position count, each position's price/lot/risk, cumulative risk, and total lots explicit. Buy and Sell remain separate scenarios, and missing price candidates must reduce the count rather than create synthetic levels.

Rejected layers may expose a conditional financial alternative only when every analysis and execution guardrail permits the layer and the sole blockers are entered free funds or the cumulative-loss ceiling. Show the exact extra funds and extra loss budget needed, but keep the layer outside recommended exposure until the user changes those inputs and recalculates.

**Why:** The user confirmed that a realistic trading plan should explain how funding or risk capacity could support a later manual layer without turning adverse price movement into an entry trigger. If an analysis blocker and a financial blocker coexist, the analysis blocker must take precedence so money never appears to buy around a safety gate.

**How to apply:** Calculate both financial shortfalls from the candidate's cumulative margin and one-final-SL risk. Never expose the financial alternative for analysis, direction, confidence, volatility, event, checkpoint, or per-position tier blockers; require chart and saved-analysis confirmation before every manual layer.

The saved AI analysis is the primary product output; the adaptive plan is a secondary explanation of what the user's selected account tier and available margin can support. Keep the default UI output-first: direction, entry and staged prices/lots, one final SL, saved TP targets, margin, and maximum loss. Put comparison, provenance, and detailed reasoning behind progressive disclosure.

**Why:** Users need a quick, actionable reading without losing the technical/fundamental intelligence that distinguishes Trade Pilot from a standalone lot calculator. Novices should not face a wall of narrative, while professionals must still be able to inspect the full reasoning and all objective alternatives.

**How to apply:** Never let a 3×3 tier/risk comparison dominate the analysis page. Show one active Buy/Sell scenario at a time, keep all explicit combinations accessible, and never let presentation changes alter the saved analysis thesis, TP/SL, or ladder safety rules.