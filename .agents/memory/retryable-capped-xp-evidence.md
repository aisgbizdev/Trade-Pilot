---
name: Retryable capped XP evidence
description: Why one-time discipline activities must remain eligible after a daily XP cap resets
---

Daily-cap rejection of a one-time activity must remain retryable on a later day. Once awarded, its source event must remain permanently deduplicated.

**Why:** If a unique proof is marked rejected when the daily limit is reached, treating every later encounter with that proof as a duplicate permanently blocks the activity, even though the limit is daily. This is especially easy to trigger when a screen offers more unique guides than the per-day guide cap.

**How to apply:** When adding one-time XP activities or changing proof handling, distinguish a cap-rejected proof from an awarded proof, and check both same-day cap and next-day retry behavior.