---
name: Two-sided market advisor
description: Product intent behind presenting both directional scenarios even when one setup is preferred.
---

TradePilot is an active market advisor: rank the strongest current opportunity using current price, technical evidence across available timeframes, fundamental context, and account risk, while giving fair conditional Buy and Sell scenarios. The user chooses which position to take; the app must not treat the non-preferred side as missing merely because one direction is stronger.

**Why:** The user explicitly confirmed that receiving useful guidance for both positions is the product's core value, after rejecting responses that amounted only to `n/a`, "no Adaptive plan", or "do not enter". This does not make the two directions equally likely or permit unsafe sizing.

**How to apply:** Preserve a clear preferred side and a conditional opposite with the evidence and trigger needed for that side to become relevant. Keep unsupported/stale data and broker risk limits honest; a conditional scenario is not an immediately actionable order.

When the main analysis is Neutral/Wait but both sides have valid price geometry and affordable minimum-lot calculations, show both conditional Buy and Sell plans immediately instead of leaving the chooser unselected with no visible plan. Never silently promote either side to an actionable recommendation or make it copyable.

**Why:** The user found an apparent contradiction when a Neutral/Wait analysis displayed both directional market scenarios above, while Adaptive hid its computed conditional ladders and said there was no safe plan.

**How to apply:** Distinguish lack of a confirmed entry direction from lack of calculable financial scenarios. If a side truly fails minimum-lot, data freshness, or geometry checks, explain that blocker rather than inventing a ladder.