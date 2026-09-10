---
name: Expo tab-bar inset modes
description: How bottom content clearance differs between absolute classic tabs and iOS system NativeTabs.
---

Reserve the explicit tab-bar height plus the device bottom inset for an absolutely positioned classic tab bar. When iOS uses system NativeTabs, add only normal content spacing and let the native navigator apply its own content and safe-area insets.

**Why:** Applying classic-tab clearance to NativeTabs double-counts the system tab bar and safe area, leaving excessive blank space at the bottom of scrollable screens.

**How to apply:** Any shared tab screen must determine which navigator branch is active before calculating bottom content padding, and tests should cover both a nonzero Android/classic inset and an iOS NativeTabs inset.