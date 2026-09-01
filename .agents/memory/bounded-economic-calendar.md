---
name: Bounded economic calendar
description: How to enforce an exact visible date range for the Analyze-page economic calendar.
---

When the calendar UI must guarantee an exact date window, render the application's calendar feed and filter its date keys locally instead of relying on the TradingView embed. Keep the external calendar attribution/link visible when relevant, and leave the AI's fundamental-calendar snapshot pipeline unchanged.

**Why:** TradingView's Economic Calendar embed exposes country and importance filters but no supported exact start/end-date option. Its cross-origin iframe also prevents reliable client-side removal of out-of-range rows.

**How to apply:** Use inclusive calendar-day boundaries based on the user's local date, cap long lists with internal scrolling, and let short lists collapse to their natural height. Test both boundaries plus one date immediately outside each side.