---
name: Replit deployment CORS origins
description: How the API allowlist must recognize Replit preview and published application origins.
---

Use exact HTTPS origins parsed from `REPLIT_DOMAINS` and `REPLIT_DEV_DOMAIN` in the API CORS allowlist, alongside explicit custom production domains. Do not use a wildcard for Replit-hosted domains.

**Why:** The runtime's development origin and published deployment origin differ. Restricting the allowlist to the development domain in non-production environments makes a browser request from the published Replit app fail as a generic registration error, while a wildcard would allow untrusted sites to make credentialed cross-origin calls.

**How to apply:** When changing API CORS policy, normalize each configured comma-separated domain to an HTTPS origin and allow only exact matches. Keep localhost rules limited to non-production use.