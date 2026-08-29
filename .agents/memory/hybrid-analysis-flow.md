---
name: Hybrid analysis information architecture
description: Product boundary between pre-analysis market preview, AI conclusions, and the focused execution-plan result.
---

Before Analyze, show only user inputs and raw/current market context such as price, chart, session, and relevant events. Never imply that bias, confidence, or trade levels already came from AI. The market preview and its disclaimer belong on the Analyze page only.

After Analyze, keep the existing result-page layout unchanged unless a separate request explicitly targets it. Do not add the hybrid preview card or new AI-context/review disclosures to the result page.

**Why:** The requested hybrid change is a front-page presentation improvement; changing the saved-result layout at the same time makes the analysis harder to compare with the established flow.

**How to apply:** New pre-analysis UI should label current data as preview-only, keep one authoritative analysis request, and leave `/analyses/:id` structure untouched unless the user asks for a result-page change separately.