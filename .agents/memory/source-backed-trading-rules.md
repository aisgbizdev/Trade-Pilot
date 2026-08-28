---
name: Source-backed trading rules
description: How to preserve unknown fields and minimum movement when adding broker trading-rule sources.
---

If an official trading-rule source omits a fee, percentage gap limit, or other value, represent it as unknown rather than inventing zero or copying a value from another product. For point-based products, align all adaptive entry, stop, target, and ladder prices to the source's minimum movement.

**Why:** The Hangseng and Nikkei Mini source supplied contract size, margin, spreads, rollover, and movement steps but no facility fee or percentage gap limit. Treating omitted values as zero would present unsupported broker facts, and decimal-only rounding would allow invalid Nikkei prices between its 5-point ticks.

**How to apply:** Keep source omissions nullable through API schemas, generated clients, UI, and calculator assumptions. Add instrument-specific movement-step tests whenever a new point-based product is enabled.