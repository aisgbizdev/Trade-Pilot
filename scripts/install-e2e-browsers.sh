#!/usr/bin/env bash
# Install Chromium for Playwright in a reproducible way.
#
# Playwright pins a single Chromium build per @playwright/test version
# (`pnpm-lock.yaml` locks the package version, which transitively locks
# the browser revision). Re-running this script always lands on the same
# revision until @playwright/test is bumped.
#
# We deliberately do NOT pass `--with-deps` (that path uses apt and is a
# no-op on this Nix-based image). The Replit image already ships the
# shared libs Chromium needs (libnss3, libgbm, libgtk, libxcb, etc.).
#
# Browsers are cached under `~/.cache/ms-playwright` so subsequent
# `playwright test` runs reuse them.

set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -d "tests/e2e/node_modules" ]; then
  echo "[install-e2e-browsers] Installing pnpm deps first..."
  pnpm install --frozen-lockfile
fi

echo "[install-e2e-browsers] Installing Chromium for Playwright..."
pnpm --filter @workspace/e2e exec playwright install chromium

echo "[install-e2e-browsers] Done."
