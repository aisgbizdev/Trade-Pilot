# Economic Calendar — How It's Configured and Where the Data Comes From

There are actually **two independent calendar systems** in Trade Pilot that
look similar in the UI but share no code and no data source. This doc
covers both, plus every place they feed into.

## 1. The two systems, at a glance

| | Custom calendar (this doc's main subject) | TradingView embed |
|---|---|---|
| Data source | Newsmaker.id, via a Railway-hosted proxy API | TradingView's own hosted widget |
| Backend involved? | Yes — `lib/calendar.ts` + `routes/calendar.ts` | No — pure client-side `<script>` embed |
| API key needed? | **No** | No |
| Feeds the AI analysis prompt? | **Yes** | No (display-only) |
| Feeds push notification reminders? | **Yes** (`watchlist-alerts.ts`) | No |
| Where it's shown | `RelevantCalendarPreview` + `PreTradeWarning` on `/analyze` (both via `useRelevantCalendar`) | `EconomicCalendarSection`'s expandable panel on `/analyze` (`TradingViewEconomicCalendar` component) |
| Configurable via env var? | **No — everything is a hardcoded constant in code** | No |

Everything below §2 is about the **custom** (Newsmaker) calendar. The
TradingView one gets its own full section right below since that's the one
actually visible in the UI on `/analyze`.

## 1b. The TradingView calendar, in detail

**Where it lives**: `src/components/tradingview-economic-calendar.tsx`
(the widget itself) is mounted by `EconomicCalendarSection` inside
`analyze.tsx`, as a collapsible panel below the notes field. It's
collapsed by default (state persisted per-browser-tab in
`sessionStorage["analyze.economicCalendar.open"]`, not per-account).

**How it renders — no backend, no API key involved at all**: the
component injects TradingView's own hosted script
(`https://s3.tradingview.com/external-embedding/embed-widget-events.js`)
into the DOM with a JSON config blob, and TradingView's script does 100%
of the fetching/rendering itself, client-side, straight from the user's
browser to TradingView's servers. Trade Pilot's backend is never in this
request path — nothing to configure or proxy on our side.

**The config passed in** (from `EconomicCalendarSection` → down into
`<TradingViewEconomicCalendar>`'s props):

| Prop | Value | Where it comes from |
|---|---|---|
| `importanceFilter` | **hardcoded `"1"`** | Fixed in `analyze.tsx` — always shows only high-impact (★★★-equivalent) events; not user-adjustable. `"-1"`/`"0"`/`"1"` are the only 3 values TradingView's widget accepts (low/medium/high) |
| `countryFilter` | comma-separated country codes, e.g. `"us,eu,id"` | Computed from **the user's watchlist**: every starred instrument's currencies (`instrumentToCurrencies()`) get mapped to a TradingView country code (`currenciesToCountryFilter()`), then the user can further narrow it with the currency-chip row rendered above the widget (`EconomicCalendarSection`'s own UI, not TradingView's) |
| `colorTheme` | `"light"` / `"dark"` | Auto-derived from the app's own theme setting (`useTheme()`) |
| `locale` | `"id"` / `"en"` | Auto-derived from the app's own language setting (`useTranslation()`) |
| `height` | `420` (px) | Hardcoded in `analyze.tsx`'s call site |

**The currency filter chip row** (the "All / USD / EUR / IDR / ..." pills
above the widget) is Trade Pilot's own UI, not TradingView's — it's built
from whichever currencies appear across the user's watchlist (always
includes `USD` as a baseline). The selection is saved to
`localStorage["analyze.economicCalendar.currencies.<userId>"]` so it
persists across sessions **per logged-in user** (unlike the open/closed
panel state, which is per-tab). Supported currency→country codes (only
these can ever appear as a filter option, per
`CURRENCY_TO_COUNTRY` in `src/lib/tradingview-symbols.ts`):

```
USD→us, EUR→eu, GBP→gb, JPY→jp, CHF→ch, AUD→au,
CAD→ca, NZD→nz, IDR→id, HKD→hk, CNY→cn
```
(Note: `GOLD`/`OIL`/`OPEC`/`CRYPTO`/coin-ticker "currencies" used by the
*custom* calendar's `INSTRUMENT_CURRENCIES` table have no TradingView
country equivalent and are silently dropped from this filter — they're a
concept unique to the Newsmaker-backed system in §2+.)

**Failure/offline handling** (all client-side, in
`tradingview-economic-calendar.tsx`):
- If the browser is offline (`navigator.onLine` / online-offline events),
  shows an offline placeholder instead of even attempting to load the
  script.
- Polls every 500ms for the widget to actually populate (checks for a
  child element or an `<iframe>`); if nothing appears within
  **8 seconds** (`loadTimeoutMs`, hardcoded default) or the script itself
  errors (e.g. blocked by an ad-blocker/`NetworkError`), it shows a
  "failed to load" placeholder instead of an infinite skeleton.
- A skeleton pulse shows while pending.
- There's a `window.__TV_LOAD_TIMEOUT_MS_OVERRIDE__` escape hatch purely
  for tests, to shorten the 8s wait — not used in production.

**Nothing here is configurable via env var or admin setting** — same
situation as the custom calendar (§6): the importance filter, timeout,
and height are all hardcoded constants in `analyze.tsx`/the component
itself. The only thing an end user can actually adjust is the currency
chip row.

## 2. Data source

Both `lib/calendar.ts` and `routes/calendar.ts` fetch from:

```
https://endpoapi-production-3202.up.railway.app/api/calendar/this-week
```

This is **the same Railway-hosted host that serves news** (`lib/news.ts`'s
`NEWS_API` is `.../api/news-id` on the identical domain) — internally the
news code even names its cache `newsmakerCache` and prefixes item ids
`newsmaker-`. So despite the generic-looking `endpoapi-production-3202`
hostname, **this is Newsmaker.id's API** — there's no separate third-party
calendar provider involved. No API key, bearer token, or auth header is
sent; it's a plain unauthenticated `fetch()`.

There is **no environment variable** for this URL — it's a hardcoded
`const CALENDAR_API = "..."` string, duplicated in two files (see §6 for
why that's worth fixing). If Newsmaker.id ever changes their endpoint or
you need to point at a different environment, you currently have to edit
both `lib/calendar.ts` line 6 and `routes/calendar.ts` line 5.

## 3. Backend pipeline (`lib/calendar.ts`)

1. **`fetchCalendar()`** — fetches the upstream URL, caches the raw
   response for **30 minutes** (`CACHE_TTL`, in-memory, single-process —
   resets on server restart, same limitation as every other in-memory
   cache in this codebase).
2. **`normalize()`** — reshapes each raw upstream row into a
   `CalendarEvent`: splits `"2026-04-29 19:30"` into separate `date`/
   `time`, and computes an absolute `epochMs` (**always anchored to UTC**
   — the upstream feed's wall-clock time is treated as UTC; see the long
   comment in the source if that assumption ever needs to change, since
   every downstream consumer relies on it for "minutes until release"
   math being timezone-independent).
3. **Curated overrides** — two hardcoded event lists get merged in on top
   of the upstream feed, because the upstream feed doesn't reliably cover
   them:
   - **`CRYPTO_CALENDAR_EVENTS`** — halving dates, protocol upgrades,
     regulatory milestones (BTC/ETH/XRP/market-wide). Only merged in when
     the requested instrument's currency set includes a crypto tag.
   - **`BI_CALENDAR_EVENTS`** — Bank Indonesia 7DRR rate decisions, BPS
     CPI/trade-balance releases, BI FX reserves — only merged in for
     `USD/IDR`. These are tagged `region: "ID"` so they sort **above**
     any generic upstream `IDR` item at the same impact tier.
   - **Both lists need manual upkeep** — there's no automated feed for
     either. See the maintenance notes below each list in `lib/calendar.ts`
     for exactly what to fill in when adding a new entry (currency tag
     convention, impact-star convention, UTC time convention).
4. **`getRelevantCalendar(instrument, opts)`** — the main entry point.
   - Maps `instrument` → currency codes via the hardcoded
     `INSTRUMENT_CURRENCIES` table (e.g. `"XAU/USD" → ["USD", "GOLD"]`,
     `"BTC/USD" → ["USD", "CRYPTO", "BTC"]`). **Adding a new tradable
     instrument to the app requires adding it here too**, or its calendar
     relevance will silently fall back to `["USD"]`.
   - Filters to events within `lookbackHours` (default 24h) in the past
     through everything upcoming, sorted by impact (★★★ first), with
     `region: "ID"` events tie-broken above generic ones, then by time.
   - `maxItems` caps the result (default 6).

## 4. HTTP endpoints (`routes/calendar.ts`)

- **`GET /api/calendar`** — the full unfiltered "this week" feed. Has its
  **own separate** fetch + 30-minute cache (does **not** call into
  `lib/calendar.ts` — see §6). Used by the orphaned `dashboard.tsx`'s
  `CalendarWidget` (that page has no live route today, so in practice this
  endpoint currently has no real caller in the shipped app).
- **`GET /api/calendar/relevant?instrument=XAU/USD&maxItems=6`** — thin
  wrapper over `getRelevantCalendar()`. This is the one actually used
  live, by `useRelevantCalendar()` on the frontend (`RelevantCalendarPreview`
  and `PreTradeWarning` on `/analyze`) — the pre-trade-warning consumer
  passes a larger `maxItems` (up to 50, server-clamped) so an unusually
  event-packed week can't silently hide an imminent ★★★ release.

## 5. Every place calendar data actually gets used

| Consumer | File | What it does with it |
|---|---|---|
| AI analysis prompt | `routes/analyses.ts` (`POST /analyses`, and the "Refresh Fundamentals" handler) | Calls `getRelevantCalendar(instrument)` directly (skipped for 1m/5m fast-intraday timeframes), formats it into the prompt via `formatCalendarForPrompt()`, and persists the snapshot on the `analyses.fundamentalContext` column so the saved analysis page can show the exact context the AI saw |
| `/analyze` preview | `RelevantCalendarPreview` (in `analyze.tsx`) via `useRelevantCalendar` | Shows up to 5 upcoming events for the selected instrument, with an expandable per-event "why traders care" explainer |
| `/analyze` pre-trade warning | `PreTradeWarning` (in `analyze.tsx`) via `useRelevantCalendar` (wider `maxItems`) | Surfaces a prominent inline callout when a ★★★ event for the instrument is within 30 minutes |
| `/analyze` expandable panel | `EconomicCalendarSection` → `TradingViewEconomicCalendar` | The **other**, TradingView-hosted calendar (§1) — display only, currency-filterable by the user's watchlist |
| Push reminders | `lib/watchlist-alerts.ts`'s `dispatchCalendarReminders` | Calls `getAllCalendarThisWeek()` (unfiltered), fires a push+in-app notification for any ★★★ event **25-35 minutes out** for a currency in the user's watchlist, capped at 3/day/user, deduped by `calendar:{userId}:{currency}:{event}:{epochMs}` |

## 6. "Settings" — the honest answer

There is currently **no admin UI, env var, or config file** for anything
calendar-related. Every tunable value is a hardcoded constant in source:

| Want to change... | Edit this |
|---|---|
| The upstream API URL | `lib/calendar.ts` line 6 **and** `routes/calendar.ts` line 5 (both — see the gap below) |
| Cache duration (currently 30 min) | `CACHE_TTL` in both of the same two files |
| Which currencies count as "relevant" for an instrument | `INSTRUMENT_CURRENCIES` in `lib/calendar.ts` |
| Curated crypto events (halving, upgrades, ETF dates) | `CRYPTO_CALENDAR_EVENTS` in `lib/calendar.ts` |
| Curated Bank Indonesia / BPS events | `BI_CALENDAR_EVENTS` in `lib/calendar.ts` — needs a new row added roughly monthly as BI announces its next Board of Governors meeting date |
| Default lookback window (24h) / default result cap (6) | `getRelevantCalendar`'s `opts` defaults in `lib/calendar.ts` |
| Push-reminder timing window (25-35 min) / daily cap (3) | `calendarReminderTimestamp` / `CALENDAR_PER_DAY_CAP` in `lib/watchlist-alerts.ts` |
| TradingView widget's importance filter / theme / locale | Props passed to `<TradingViewEconomicCalendar>` in `analyze.tsx` (currently `importanceFilter="1"` = high-impact only, theme/locale auto-derived from the user's app theme/language) |

**Known gap worth fixing eventually**: `routes/calendar.ts`'s
`GET /api/calendar` handler duplicates `lib/calendar.ts`'s fetch+cache
logic instead of reusing `getAllCalendarThisWeek()` — two separate
in-memory caches for the same upstream URL. It's harmless today mostly
because that route's only caller (`dashboard.tsx`) isn't reachable, but if
`/dashboard` ever gets re-routed (see `docs/MASTER.md` §9), this should be
collapsed into one shared cache instead of fixed as two parallel ones.

## 7. Testing

- `lib/__tests__/calendar.test.ts` — lookback-window filtering, UTC
  `epochMs` computation, prompt-injection sanitization
  (`_sanitizePromptText`), the `region: "ID"` sort tie-break.
- `lib/__tests__/bi-calendar.test.ts` — specifically the curated
  `BI_CALENDAR_EVENTS` merge behavior for `USD/IDR`.
- `components/__tests__/economic-calendar-section.test.tsx` and
  `components/__tests__/tradingview-economic-calendar.test.tsx` — frontend
  rendering/currency-filter/load-failure behavior for the two respective
  widgets.
- `_clearCalendarCache()` (exported from `lib/calendar.ts`) exists purely
  so tests can reset the in-memory cache between cases.
