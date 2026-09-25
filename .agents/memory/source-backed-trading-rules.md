---
name: Source-backed trading rules
description: How to preserve unknown fields and minimum movement when adding broker trading-rule sources.
---

If an official trading-rule source omits a fee, percentage gap limit, or other value, represent it as unknown rather than inventing zero or copying a value from another product. For point-based products, align all adaptive entry, stop, target, and ladder prices to the source's minimum movement.

**Why:** The Hangseng and Nikkei Mini source supplied contract size, margin, spreads, rollover, and movement steps but no facility fee or percentage gap limit. Treating omitted values as zero would present unsupported broker facts, and decimal-only rounding would allow invalid Nikkei prices between its 5-point ticks.

**How to apply:** Keep source omissions nullable through API schemas, generated clients, UI, and calculator assumptions. Add instrument-specific movement-step tests whenever a new point-based product is enabled.

The supplied Mini and Regular tables are separate per-tier contract specifications, not one universal multiplier: Hang Seng and Nikkei both show USD 5/point in *both* tables, while Gold and Brent differ by 10×. The user explicitly approved using one-tenth of the Mini contract value for a Micro *planning assumption*, including USD 0.50/point for those indices. Label this assumption, not as an official broker rule.

**Why:** Multiplying an already tier-specific contract value by the tier's minimum lot again understates the minimum position's risk; multiplying every Regular contract by 10× falsely inflates index risk. The documents do not supply a Micro table.

**How to apply:** Interpret each source contract value per minimum-tier contract, then scale only by the count of such contracts. Distinguish derived Micro values from broker-sourced Mini/Regular values throughout calculator explanations and tests.