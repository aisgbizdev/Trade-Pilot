---
name: Production database health probes
description: Why read-only production SQL success does not prove the deployed app can sustain its own database connections.
---

Treat a successful read-only production database query as limited evidence of replica reachability, not proof that the published app's runtime connection path and background jobs are healthy.

**Why:** The production SQL tool queries a read-only replica. It can return successfully while the published application repeatedly logs PostgreSQL connection termination or timeout errors across background jobs.

**How to apply:** Before declaring a republish safe, inspect fresh deployed-app logs over a meaningful interval and verify relevant runtime behavior. Do not change pool settings or blame the provider solely on the basis of a successful replica query.