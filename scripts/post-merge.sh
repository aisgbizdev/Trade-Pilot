#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push
# Keep the e2e Chromium build present after every merge so the
# `e2e-test` validation workflow can run without a manual setup step.
# Browser revision is pinned via @playwright/test in pnpm-lock.yaml,
# so this is reproducible.
./scripts/install-e2e-browsers.sh
