---
name: Verified FX candle identity
description: Why extra FX analyses require consistent sources and runtime admission checks.
---

Do not treat a price-symbol mapping as sufficient proof that an instrument can safely produce numeric trade levels. For newly admitted FX pairs, use same-identity Yahoo spot candles for intraday and daily/weekly history, and refuse new analysis if the selected timeframe's candles are stale, missing, or inconsistent with the broker quote.

**Why:** The shared daily provider returned FX rows in reverse chronological order, and some recent daily values materially disagreed with both Yahoo spot and live broker prices. An apparent last close could actually be from a year earlier. Anchoring prices could hide this discrepancy and make invented levels look credible.

**How to apply:** When considering more instruments, compare raw source values, timestamps, units, contract identity and precision across timeframes before admitting them. Preserve historical results and fail before AI generation or credit use when runtime market evidence is inadequate.