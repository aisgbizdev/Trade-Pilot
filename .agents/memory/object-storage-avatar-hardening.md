---
name: Object-storage avatar serving — hardening rules
description: Mandatory defences when accepting client-uploaded avatars through GCS presigned URLs and serving them from the app origin.
---

When using the object-storage skill's presigned-URL flow for user-uploaded images (avatars, etc.), the client-supplied `size`/`contentType` in the request-URL call are **not** cryptographically bound to the actual PUT. An attacker with a valid upload URL can swap in arbitrary bytes (HTML, JS) and the storage layer will accept them. Serving those bytes from your own origin is stored-XSS on first-party origin.

**Rule:** layer all three of these whenever the GET serving route is public:

1. **Validate `objectPath` on every write to a user record** that points at storage. Whitelist the canonical prefix and id charset issued by your upload flow (e.g. `/^\/objects\/uploads\/[A-Za-z0-9_-]{8,64}$/`). Without this, any caller can point their profile at someone else's upload or an attacker-uploaded HTML payload from a different prefix.
2. **At serve time, fetch the real metadata** (`file.getMetadata()`) and reject anything whose actual `Content-Type` is not `image/*` with 415. Do this even if upload-time validation is in place — upload-time only checks client claims.
3. **Force safe response headers** on the serving route: `X-Content-Type-Options: nosniff` and `Content-Disposition: inline`. Stops browser MIME-sniffing from rescuing an attacker.

**Why:** code-review architect flagged a stored-XSS vector when the avatar feature was first wired — request-URL only validated client JSON, so HTML/JS could be served from `/api/storage/objects/...` with arbitrary `Content-Type`. The three layers above close it without abandoning the presigned-URL pattern the skill ships with.

**How to apply:** any time you add a new file-upload feature that follows the object-storage skill's two-step flow and the GET endpoint is unauthenticated or shareable, add all three defences. Auth-gating the request-URL endpoint (`requireAuth`) is necessary but not sufficient — authenticated users can still abuse the bypass.
