#!/bin/bash
git checkout lib/api-spec/openapi.yaml
git stash pop || true # Just in case I stashed it
