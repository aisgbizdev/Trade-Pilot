---
name: wouter Link renders an anchor
description: ai-trading nav — wouter Link is an <a>; don't nest a <button> inside it
---

In `artifacts/ai-trading`, `wouter`'s `<Link>` renders an `<a>` element. Put
styling/`className`, `data-testid`, and `aria-current="page"` directly on the
`<Link>` for nav items.

**Why:** The existing mobile bottom nav (and originally the desktop top nav)
used `<Link><button>…</button></Link>`, which nests a button inside an anchor —
invalid interactive nesting that degrades keyboard/screen-reader behavior. Code
review flagged it. The brand link and profile link in `layout.tsx` already use
the correct `<Link className=…>` form.

**How to apply:** When adding/editing nav links in `layout.tsx` (or anywhere in
this app), style the `Link` itself. Do NOT copy the bottom-nav pattern even
though it still exists there (left untouched to keep the mobile layout frozen).
