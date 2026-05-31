---
name: Tablet-only width constraint
description: ai-trading — how to narrow page content at tablet without touching desktop
---

The shared `Layout` (artifacts/ai-trading/src/components/layout.tsx) container
is `max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto` — it widens at md (896px) and
again at lg (1152px). Pages render their content full-width inside that.

To make a page's content read well at tablet widths (768–1023px) **without
changing desktop**, put on the page's top content container:

```
md:max-w-3xl md:mx-auto lg:max-w-none
```

**Why:** A bare `md:max-w-3xl md:mx-auto` (the pattern analyze.tsx uses)
cascades up to lg, so it *also* constrains desktop. When a task requires desktop
to stay exactly as-is, add `lg:max-w-none` to release the cap at lg and restore
full-width desktop. Mobile is untouched because every utility is md:-prefixed.

**How to apply:**
- analyze.tsx intentionally omits `lg:max-w-none` — it's a "main" page meant to
  be capped on desktop too. Match that (no lg override) only when desktop should
  also be narrowed; otherwise include `lg:max-w-none`.
- Avoid `md:grid md:grid-cols-2` for lists when desktop must stay unchanged — it
  cascades to lg and would need an `lg:grid-cols-1` reset. Centering is the
  lower-risk way to satisfy a tablet-only polish.
