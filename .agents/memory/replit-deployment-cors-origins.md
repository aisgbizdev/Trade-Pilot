---
name: Replit deployment CORS origins
description: How the API allowlist must recognize Replit preview and published application origins.
---

Use exact HTTPS origins parsed from `REPLIT_DOMAINS`, `REPLIT_DEV_DOMAIN`, and `REPLIT_EXPO_DEV_DOMAIN` in the API CORS allowlist, alongside explicit custom production domains. Do not use a wildcard for Replit-hosted domains.

**Why:** Standard web preview, Expo web preview, and published deployment origins differ. Omitting the Expo origin leaves native-web previews blank with CORS errors, while a wildcard would allow untrusted sites to make credentialed cross-origin calls.

**How to apply:** When changing API CORS policy, normalize each configured comma-separated domain to an HTTPS origin and allow only exact matches. Include the exact Expo preview origin and keep localhost rules limited to non-production use.