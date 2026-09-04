---
name: Metro image-size contract
description: Compatibility requirement for security-hardened image metadata readers used by Expo Metro.
---

Any hardened replacement for `image-size` used by Expo Metro must accept both filesystem path strings and byte buffers.

**Why:** Metro normally passes an asset path for unpacked files, but passes a buffer for assets inside archives. Supporting only buffers makes ordinary Expo Router PNG assets fail production bundling with a misleading “Unsupported image type” error.

**How to apply:** Preserve both input forms when upgrading or replacing the metadata parser, and verify with a clean production bundle for both iOS and Android rather than only calling the parser with a buffer.