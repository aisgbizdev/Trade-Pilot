---
name: Adaptive direction selector semantics
description: Accessibility rule for switching between Buy and Sell scenario plans.
---

Use a labelled group of native buttons with `aria-pressed` for the Buy/Sell scenario selector while only the active scenario panel is mounted. Disable a direction only when its saved analysis levels are incomplete, and explain that state in nearby plain language.

**Why:** An ARIA tablist requires stable tab/panel relationships, mounted panels, roving focus, and arrow-key behavior. The adaptive plan intentionally renders one scenario at a time and may have only one available direction, so partial tab semantics misrepresent the interaction to assistive technology.

**How to apply:** Keep direction controls keyboard-operable as native buttons, expose the selected state with `aria-pressed`, and avoid `tab`, `tabpanel`, or `aria-controls` unless the complete tabs interaction pattern is implemented.