---
name: Account tier selection
description: Product rule separating account type, available trading funds, and account-opening requirements.
---

Micro, Mini, and Regular must be selected explicitly according to the user's real account. Never silently infer, switch, or promote one account tier as universally best from the available-funds amount; show every tier/risk combination objectively and let the user decide.

**Why:** The same amount can mean free margin in an existing Mini account or the balance of a Micro account. Minimum funds to open an account are also different from free margin remaining after the account is active.

**How to apply:** Keep account tier, free trading funds, and risk style as separate inputs. Make each tier/risk combination directly selectable and show its capacity, lot/layers, maximum loss, and TP scenarios. Do not reject free margin solely because it is below an account-opening minimum; only display opening minimums that are supported by an official source.

Micro is a 1/10 scale of Mini and Regular is a 10x scale of Mini for contract size, margin, minimum lot, lot step, and value per point. This is a user-approved product model where the broker sources do not define Micro separately.

**Why:** Treating every tier as the same contract size undercounts Regular Stop Loss risk and overcounts Micro risk. Applying the tier multiplier again after resolving the contract would double-scale risk.

**How to apply:** Resolve one tier-specific rule first, then use its contract size directly in P/L and Stop Loss calculations. Keep tests for Gold/Brent and point-based Hang Seng/Nikkei across all three tiers.

Low, Medium, and High reserve progressively more of the selected plan margin for Stop Loss risk: 20%, 25%, and 30%. Thirty percent is a hard ceiling, not a target and not the broker's auto-liquidation threshold.

**Why:** Reusing the earlier percentages after moving the denominator from total funds to allocated plan margin made Low too restrictive. The revised bands preserve a meaningful conservative-to-active progression while keeping every style under the agreed ceiling.

**How to apply:** Calculate each style's loss limit from its allocated plan margin, compare the complete single-Stop-loss ladder against that limit, and never increase lots merely to consume the available budget.