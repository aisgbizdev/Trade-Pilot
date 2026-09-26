---
name: Information density on web and PWA
description: Agreed distinction between optional explanatory copy and safety-critical information across responsive TradePilot screens.
---

Present the decision and its current safety implications first. Keep optional educational or methodological explanations available behind an explicitly labeled, accessible disclosure by default on **both desktop web and mobile PWA**; do not treat this as a mobile-only adjustment.

**Why:** The user said the product feels crowded with explanations across almost every screen, explicitly corrected a mobile-only interpretation, and confirmed this approach. Hiding warnings to reduce text would make a trading decision-support product less trustworthy.

**How to apply:** For new or revised screens, keep primary actions, risk and invalidation warnings, data freshness, essential metric caveats, and destructive-action consequences visible. Defer repetitive onboarding and optional long-form rationale, preserving access via a clear trigger. Free-form AI confidence rationale is not reliably classifiable as optional: leave it visible because a serious caution may use none of the anticipated safety keywords. Retain the existing visual identity.

For the lower analysis page beginning at Adaptive, treat saved-analysis narratives and Adaptive's diagnostics as one educational destination rather than parallel menu rows. Keep invalidation and conditional-entry status visible, and label live technical indicators as current-market context distinct from the saved plan.

**Why:** The user found the separate explanation menus crowded and explicitly restricted the redesign to Adaptive and below. After seeing the built version, the user confirmed that arrangement was good. They then approved moving the comprehensive explanation after the scenario rather than before direction selection, so the decision reads first.

**How to apply:** Keep one explanation entry after the scenario and its optional plan details, outside the Buy/Sell-specific card; make its title clearly legible. Keep direction/invalidation warnings before the scenario. Position the live check soon after Adaptive without changing the analysis above or implying that live indicators recalculated the saved plan.

Keep the saved market-context summary with the original analysis, before Adaptive, while current-market indicators remain after Adaptive.

**Why:** The user approved separating the stored indicator snapshot from the live check; placing both below Adaptive made their freshness and relationship to the plan hard to understand.

**How to apply:** When reordering analysis-detail sections, preserve this saved-versus-live distinction. Do not imply that current indicators automatically revise a stored recommendation.

Keep a single instrument-level running quote near the price chart rather than repeating it in timeframe controls; place timeframe comparison alongside the timeframe heading.

**Why:** The user found duplicate XAU/USD prices distracting and preferred the chart-adjacent quote. Removing the duplicate otherwise stranded the comparison action in its own row.

**How to apply:** On analysis-detail layouts, treat the chart quote as the price reference and keep comparison as a secondary action within the timeframe controls.

When compacting timeframe controls, the visible warning that choosing another timeframe immediately starts a new analysis must remain, even if the controls' heading is removed.

**Why:** The user explicitly considers this immediate-action message an important disclaimer, not optional instructional copy.

**How to apply:** Keep it adjacent to the timeframe buttons on web and PWA; do not hide it in a tooltip or collapsed explanation.

The user later explicitly asked that the margin-capacity estimate, duplicate hard-loss summary, and bottom generic disclaimer not be shown visually. Keep the capacity and loss calculations intact, preserve the disclaimer for assistive technology, and continue to show actionable risk/invalidation conditions.

**Why:** Those three blocks were identified in screenshots as redundant screen content, not as logic to remove. This is a specific exception to the general rule to keep safety-critical information visible.

**How to apply:** Do not restore those visual blocks as part of general information-density or safety cleanups; keep the other concrete risk and decision cues visible.