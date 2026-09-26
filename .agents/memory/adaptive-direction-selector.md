---
name: Adaptive direction selector semantics
description: Accessibility rule for switching between Buy and Sell scenario plans.
---

Use a labelled group of native buttons with `aria-pressed` for the Buy/Sell scenario selector while only the active scenario panel is mounted. When a safe plan exists, disable a direction lacking a usable scenario. In a blocked/wait review, let users inspect either direction's diagnostic even if no plan can be calculated; show an unavailable state rather than inventing figures. If neither side is preferred, do not display both by default: ask the user to pick one.

**Why:** An ARIA tablist requires stable tab/panel relationships, mounted panels, roving focus, and arrow-key behavior. Partial tab semantics misrepresent the interaction. In a blocked result, disabling an uncalculable side also hides the reason it is unavailable, while showing two full reviews simultaneously overwhelms the decision.

**How to apply:** Keep direction controls keyboard-operable as native buttons, expose selection with `aria-pressed`, and avoid `tab`, `tabpanel`, or `aria-controls` unless the complete pattern is implemented. Keep wait/blocked status visible even when detailed rationale is collapsed.