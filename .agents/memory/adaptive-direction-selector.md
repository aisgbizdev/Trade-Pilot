---
name: Adaptive direction selector semantics
description: Accessibility rule for switching between Buy and Sell scenario plans.
---

Use a labelled group of native buttons with `aria-pressed` for the Buy/Sell scenario selector while only the active scenario panel is mounted. When a safe plan exists, disable a direction lacking a usable scenario. In a blocked/wait review, let users inspect either direction's diagnostic even if no plan can be calculated; show an unavailable state rather than inventing figures. Initially show the analysis's preferred side if it names Buy or Sell; if the analysis says Wait, show one side as a conditional preview, not a recommended entry.

**Why:** An ARIA tablist requires stable tab/panel relationships, mounted panels, roving focus, and arrow-key behavior. Partial tab semantics misrepresent the interaction. In a blocked result, disabling an uncalculable side hides the reason it is unavailable; showing both reviews overwhelms the decision; showing neither forces an unnecessary extra click. A default preview must not imply entry approval when the analysis is neutral.

**How to apply:** Keep direction controls keyboard-operable as native buttons, expose selection with `aria-pressed`, and avoid `tab`, `tabpanel`, or `aria-controls` unless the complete pattern is implemented. Keep wait/blocked status visible even when detailed rationale is collapsed.