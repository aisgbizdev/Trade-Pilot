---
name: Broker-funds display precision
description: Required funding amounts are display estimates that must not understate strict calculator thresholds.
---

Display-only estimates of **required additional broker funds** should be rounded upward to the next cent, while position sizing, free-funds comparisons, and hard loss limits continue to use their original full-precision values.

**Why:** Ordinary nearest-cent formatting can print less than a fractional shortfall. Entering that printed number back into the form then leaves the next layer rejected, even when funds are the only blocker. Conservative display rounding closes that gap without relaxing any risk guardrail.

**How to apply:** Use this rule for actionable funding suggestions and rejected-candidate shortfalls, not for profit/loss calculations or the stored recommendation. Test against the page's own live-chart candidates rather than copying amounts from a calculator fixture with different checkpoints.