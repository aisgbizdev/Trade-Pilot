---
name: Time-windowed seed tests
description: Pitfalls when seeding history rows for detectors that filter by createdAt >= now - Ndays.
---
Detectors that gate on a history floor (e.g., `rows.length >= 30`) read from `where createdAt >= now - 30*86400000`. Pitfalls:
- Seeding `N` rows at `now - i*24h` going back N days places the oldest row at `now - N*24h`, exactly on the window boundary — if the now-of-day is *after* the seed-hour-of-day, that row falls outside and you get N-1 rows.
- Seeding at intervals like 20h that aren't a divisor of 24 makes hour-of-day rotate through all 24 hours, breaking "current hour has 0 frequency" assumptions for `unusual_hour`-style detectors.

**Why:** subtle off-by-one and wraparound bugs that reproduce in CI workflow but pass in isolated direct runs are usually about this, not about test isolation.

**How to apply:** when writing a history-seeded detector test, either pick a seed-hour-of-day numerically less than now-hour-of-day, or shorten spacing (e.g., 23h) to keep all N rows comfortably inside the lookback. Keep the hour constant for hour-frequency detectors.
