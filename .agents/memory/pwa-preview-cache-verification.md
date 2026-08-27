---
name: PWA preview cache verification
description: How to distinguish stale browser modules from an unserved frontend change in the development preview.
---

When a browser check disagrees with a freshly restarted Vite preview, inspect the module served by Vite and clear the preview origin's service workers and Cache Storage before changing working code.

**Why:** The development PWA registers a service worker that can retain a prior frontend module in an existing browser session, even while the restarted Vite server is serving the latest source.

**How to apply:** For a suspected stale UI, first confirm the live module includes the expected code. Then unregister service workers and clear site/Cache Storage for the preview origin, reload, and repeat the browser assertion. Treat it as a code problem only if the clean session still disagrees.