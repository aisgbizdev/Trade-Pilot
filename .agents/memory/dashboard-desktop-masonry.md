---
name: Dashboard desktop masonry
description: ai-trading dashboard uses CSS multicol on desktop, not grid auto-flow
---

The `artifacts/ai-trading` dashboard page lays out its middle widget cards on
desktop (lg+) with CSS multi-column (`lg:columns-2 lg:gap-x-5`) plus per-card
`lg:mb-5 lg:break-inside-avoid`, instead of a `lg:grid lg:grid-cols-2`
auto-flow grid.

**Why:** Many dashboard cards are conditional (outcomes, avg-confidence,
last-analyzed, sponsor, push prompt), so the half-width card count is odd for
some users. A two-column *grid* auto-flow leaves a visible empty trailing cell
on odd counts, and promoting a single card to full width mid-flow can *create*
a gap when the preceding singles are odd — i.e. col-span tricks can't make it
robust across all data states. CSS multicol balances column heights instead,
so there's never an "empty cell," for any combination of visible cards.

**How to apply:**
- Keep full-width items (push prompt, sponsor banner, welcome row, mode toggle)
  and the recent-analyses list OUTSIDE the multicol block — they stay full
  width, stacked by the outer `space-y-5` container.
- Only the middle widgets (watchlist, live prices, USD/IDR, calendar, news,
  stat strip, outcomes, avg-confidence, last-analyzed) go inside the multicol
  block.
- The multicol block uses `space-y-5 lg:space-y-0` so mobile keeps the original
  vertical rhythm; desktop spacing comes from each child's `lg:mb-5`.
- Mobile (<lg) DOM order and spacing are unchanged — this was a hard
  requirement. Don't reorder children to "balance" columns; multicol handles
  balance without changing source order.
- Sibling pages analytics/mirror still use grid + `lg:col-span-2` promotion
  (deterministic there); only convert them to multicol if edge-case balancing
  across data states becomes a requirement.
