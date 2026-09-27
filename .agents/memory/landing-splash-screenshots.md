---
name: Landing splash and screenshots
description: How to visually verify the public landing page when instant captures show only the splash.
---

The app-preview screenshot may create a fresh browser context for each capture. Repeating it can show only the startup splash every time, even while the landing is working.

**Why:** Two instant captures after a successful web restart showed only the splash; a brief delayed browser capture showed the actual desktop and mobile landing views.

**How to apply:** When verifying the landing visually, wait for the splash to finish within the browser session before capturing. Do not mistake the initial splash for a blank or broken page. Use a delayed browser screenshot only when the instant preview cannot show the page.