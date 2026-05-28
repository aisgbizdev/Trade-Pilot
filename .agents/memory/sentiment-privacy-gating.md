---
name: Sentiment privacy gating
description: When an aggregate endpoint is "gated" to protect a small cohort, you must also hide the raw cohort counts — not just the derived percentages.
---

When an aggregate endpoint hides its percentages behind a minimum-sample-size / minimum-distinct-users threshold, the raw `sampleSize` and `distinctUsers` counts must also be hidden (return `null`) in the gated response.

**Why:** Returning the raw counts even when `gated=true` defeats the gate. An attacker can repeatedly probe the endpoint (e.g. before and after their own write, or across many thin instruments) and infer whether a specific small group of users is participating — membership inference attack. The percentages were never the only signal; the cohort size itself is.

**How to apply:**
- Any "k-anonymity"-style aggregate response (sentiment, sample stats, cohort breakdowns, "X% of users did Y") should treat the cohort *size* as PII below the threshold, not just the derived metric.
- Keep the threshold constants and `gated: true` flag in the response so the client can render the right empty state, but null out everything that lets an attacker reason about who is in the cohort.
- Mirror this in the OpenAPI schema (`nullable: true`) and in the tests for the gated path — the test for "gated" should assert the counts are null, not that they equal the actual underlying count.
