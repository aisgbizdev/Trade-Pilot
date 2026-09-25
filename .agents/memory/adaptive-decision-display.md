---
name: Adaptive decision display
description: User-confirmed distinction between internal account-tier calculations and the result that should be shown to traders.
---

Show one concise decision for the selected broker account. Internal calculations for other account tiers may remain available to the engine, but should not be exposed just because they were computed. Keep the next step and essential risk/funds numbers visible; put noncritical diagnostic explanations behind optional details or omit repetitions. Safety-critical blockers must remain visible.

When a minimum position is blocked by the user's loss limit, let them deliberately edit their own risk tolerance and recalculate as one option, alongside waiting for a lower-risk setup. Never change the limit automatically or imply that increasing it alone guarantees a valid entry.

**Why:** The user found a three-tier, two-sided comparison and repeated account-decision panel confusing and not useful for acting on their actual account. They also explicitly want the option to increase their own willingness to take a loss rather than only being told to wait.

**How to apply:** When extending Adaptive results on web or mobile, separate decision-critical output from internal diagnostics instead of surfacing every calculated scenario. Distinguish a user-controlled loss-limit choice from a system recommendation or automatic override.