# TradingView Charting & Live Price Integration

How TradePilot connects to TradingView for chart rendering, and where live
price/quote data actually comes from (spoiler: **not TradingView** — see §0).

Last updated: 2026-10-14.

---

## 0. The one thing to understand first

TradingView is used **only for chart rendering** (candlestick charts, the
dashboard's market-quotes ticker widget) via free public embed widgets. It is
**never** queried for live tick prices, historical candles used in analysis,
or the economic calendar — those all come from TradePilot's own backend,
which in turn pulls from a third-party feed (`endpoapi-production-3202.up.
railway.app`), Binance (crypto), and Yahoo Finance (intraday candles).

| Need | Source | Section |
|---|---|---|
| Candlestick chart the user sees | TradingView embed widget (client-side, no backend involved) | §1 |
| Dashboard's scrolling quote ticker | TradingView embed widget, with a backend fallback if it fails to load | §1d |
| Live tick price (ticker, price chips, alerts) | `GET /api/quotes/live` — own backend | §2 |
| Historical candles (AI analysis input) | own backend → endpoapi (daily/weekly) + Yahoo Finance (intraday) | §3 |
| Economic calendar | own backend → endpoapi (`TradingViewEconomicCalendar` component is misleadingly named — no TradingView embed at all) | §4 |

---

## 1. Charting — TradingView embed widgets

All four widgets below are the **free public embed scripts** from
`s3.tradingview.com/external-embedding/*`. No API key, no auth, no
TradingView account needed — this is the same embed anyone can drop into any
website. The pattern every component shares:

1. Render a container `<div class="tradingview-widget-container">`.
2. Dynamically create a `<script src="https://s3.tradingview.com/external-embedding/embed-widget-<type>.js">` and set its `textContent` to a JSON config object (the widget reads its own config from the script tag's body, not from a function call).
3. Poll every 500ms for the widget to actually render (`childElementCount > 0` or an `<iframe>` appearing); if nothing loads within a timeout (6–8s, overridable via `window.__TV_LOAD_TIMEOUT_MS_OVERRIDE__` for tests), fire an `onLoadFailed(reason)` callback so the page can show a fallback.

No backend round-trip is involved in any of this — it's entirely a
client-side `<script>` embed, same as pasting TradingView's own widget-builder
snippet into a plain HTML page.

### 1a. Advanced Chart (the main analysis chart)

- Component: `artifacts/ai-trading/src/components/tradingview-advanced-chart.tsx`
- Script: `embed-widget-advanced-chart.js`
- Config:
  ```js
  {
    autosize: true,
    symbol,              // e.g. "OANDA:XAUUSD" — see §1e for the mapping table
    interval,             // "1"|"3"|"5"|"15"|"30"|"60"|"120"|"240"|"D"|"W"|"M"
    timezone: "Etc/UTC",
    theme: "light" | "dark",
    style: "1",
    locale: "en" | "id",
    enable_publishing: false,
    hide_volume, hide_top_toolbar, hide_side_toolbar,
    hide_legend: false,
    withdateranges, allow_symbol_change,
    save_image: false, details: false, hotlist: false, calendar: false,
    backgroundColor,     // transparent or theme-matched hex
    support_host: "https://www.tradingview.com",
  }
  ```
- Used in `components/analysis-chart-section.tsx` (full-screen chart dialog) and `pages/analyze.tsx` (inline live-preview mini chart) — **but only for instruments NOT in `BACKEND_ALIGNED_CHART_INSTRUMENTS = {"BRENT","HSI","NIKKEI"}`**. Those three instead render a backend-computed `lightweight-charts` view (`BackendAlignedLiveChart`), because TradingView's CFD price basis for those symbols can diverge from the backend's own quote basis used for the AI analysis — showing TradingView's chart there would visually contradict the analysis. XAU/USD stays on TradingView despite also being CFD-sourced (product decision).

### 1b. Symbol Overview (default inline chart on the analysis page)

- Component: `artifacts/ai-trading/src/components/tradingview-symbol-overview.tsx`
- Script: `embed-widget-symbol-overview.js`
- Config:
  ```js
  {
    symbols: [[label, `${symbol}|3M`]],   // label = displayName ?? symbol
    chartOnly: false, width: "100%", height, locale, colorTheme,
    autosize: false, showVolume: false, showMA: false,
    hideDateRanges: false, hideMarketStatus: false, hideSymbolLogo: false,
    scalePosition: "right", scaleMode: "Normal",
    fontFamily: "system-ui, sans-serif", fontSize: "10",
    noTimeScale: false, valuesTracking: "1",
    changeMode: "price-and-percent", chartType: "area",
    isTransparent: true,
    dateRanges: ["1d|15","1m|60","3m|60","12m|1D","60m|1W","all|1M"],
  }
  ```
- Used in `analysis-chart-section.tsx` as the default (non-fullscreen) chart, height 320.

### 1c. Mini Symbol Overview

- Component: `artifacts/ai-trading/src/components/tradingview-mini-chart.tsx`
- Script: `embed-widget-mini-symbol-overview.js`
- Config: `{ symbol, width: "100%", height, locale, dateRange, colorTheme, isTransparent: true, autosize: false, largeChartUrl: "", chartOnly: false, noTimeScale: false }` — `dateRange` maps `"1D"→"1D"`, `"1W"→"5D"`, `"1M"→"1M"`, `"3M"→"3M"`, `"1Y"→"12M"`.
- Checks `navigator.onLine` first and shows an offline placeholder instead of even trying to load the script.
- Not currently wired into any page found in this codebase — exists with its own test coverage but no active render site. Check before assuming it's live somewhere.

### 1d. Market Quotes (dashboard ticker widget)

- Component: `artifacts/ai-trading/src/components/tradingview-market-quotes.tsx`
- Script: `embed-widget-market-quotes.js`
- Config:
  ```js
  {
    width: "100%", height,
    symbolsGroups: [{
      name: "Market Quotes", originalName: "Market Quotes",
      symbols: symbols.map(s => ({ name: s.name, displayName: s.displayName })),
    }],
    showSymbolLogo: true, isTransparent: true, colorTheme,
    locale: lang === "id" ? "id" : "en",  // ISO 639-1 only — "id_ID" silently falls back to English
  }
  ```
- Used in `components/dashboard-live-prices.tsx` with this hardcoded symbol list:
  ```
  OANDA:XAUUSD (Gold)     BLACKBULL:BRENT (Brent)   BINANCE:BTCUSDT (Bitcoin)
  BINANCE:ETHUSDT (Ethereum)  VANTAGE:HK50 (Hang Seng)  SPREADEX:NIKKEI (Nikkei)
  OANDA:AUDUSD (Aussie)   OANDA:EURUSD (Euro)       OANDA:GBPUSD (Pound)
  OANDA:USDCHF (Swissy)   OANDA:USDJPY (Yen)
  ```
- **Fallback behavior**: `DashboardLivePrices` retries the widget load up to 2 times (2s apart); if it still fails, it switches to a self-built `FallbackTicker` that reads from `/api/quotes/live` (§2) instead — i.e. the dashboard ticker silently stops being a TradingView widget and becomes the backend-driven one if TradingView is blocked (ad-blocker, network policy, etc).

### 1e. Symbol / interval / currency mapping (shared by all widgets)

File: `artifacts/ai-trading/src/lib/tradingview-symbols.ts`

**Instrument → TradingView symbol** (`INSTRUMENT_TO_TV_SYMBOL`):

| Instrument | TradingView symbol |
|---|---|
| XAU/USD | `OANDA:XAUUSD` |
| XAG/USD | `OANDA:XAGUSD` |
| BRENT | `BLACKBULL:BRENT` |
| HSI | `VANTAGE:HK50` |
| NIKKEI | `SPREADEX:NIKKEI` |
| DJIA | `TVC:DJI` |
| NASDAQ | `TVC:NDX` |
| DXY | `TVC:DXY` |
| AUD/USD | `OANDA:AUDUSD` |
| EUR/USD | `OANDA:EURUSD` |
| GBP/USD | `OANDA:GBPUSD` |
| USD/CHF | `OANDA:USDCHF` |
| USD/JPY | `OANDA:USDJPY` |
| USD/IDR | `FX_IDC:USDIDR` |
| BTC/USD | `BINANCE:BTCUSDT` |
| ETH/USD | `BINANCE:ETHUSDT` |
| SOL/USD | `BINANCE:SOLUSDT` |
| BNB/USD | `BINANCE:BNBUSDT` |
| XRP/USD | `BINANCE:XRPUSDT` |

Unrecognized FX-looking pairs fall back to `OANDA:<compacted 6–8-letter symbol>`.

**Timeframe → TradingView interval** (`TIMEFRAME_TO_INTERVAL`): `1m→"1"`,
`3m→"3"`, `5m→"5"`, `15m→"15"`, `30m→"30"`, `1h→"60"`, `2h→"120"`, `4h→"240"`,
`1D`/`1d`/`D`→`"D"`, `1W`/`1w`/`W`→`"W"`, `1M`/`M`→`"M"` — unknown falls back
to `"60"`.

**Currency → country** (for the calendar's country-flag UI, not a TradingView
mapping): `USD→us, EUR→eu, GBP→gb, JPY→jp, CHF→ch, AUD→au, CAD→ca, NZD→nz,
IDR→id, HKD→hk, CNY→cn`.

**Adding a new instrument** means updating both `tradingview-symbols.ts` (this
file) *and* `artifacts/api-server/src/lib/crypto-instruments.ts` (for crypto)
— the header comment there explicitly flags this as a manual two-places sync.

---

## 2. Live price ticker — `GET /api/quotes/live`

This is **TradePilot's own backend route**, not TradingView. Mounted under
`/api`, public (no auth required).

- Route: `artifacts/api-server/src/routes/quotes.ts`
- Logic: `artifacts/api-server/src/lib/live-prices.ts`

### Upstreams

1. **Forex/commodities/indices** (required — a failure here 502s the whole response):
   ```
   GET https://endpoapi-production-3202.up.railway.app/api/live-quotes
   ```
   No auth, no params. This is the "Newsmaker.id"-branded feed also used for
   historical candles (§3) and the economic calendar (§4).

2. **Crypto** (best-effort — failures are swallowed, crypto rows just disappear):
   ```
   GET https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT",...]
   ```
   Public Binance REST, no auth. 4s timeout. HTTP 451 (geo-block) is logged
   distinctly from other failures.

   Both calls run in parallel (`Promise.all`).

### Upstream → instrument symbol mapping

`SYMBOL_MAP` (`live-prices.ts`): `XUL10→XAU/USD`, `BCO10_BBJ→BRENT`,
`EU10F_BBJ→EUR/USD`, `GU10F_BBJ→GBP/USD`, `UJ10F_BBJ→USD/JPY`,
`UI10F_BBJ→USD/IDR`, `DX10F_BBJ→DXY`, `AU10F_BBJ→AUD/USD`,
`HKK50_BBJ→HSI` (also emitted again under alias `"HK50"`), `JPK50_BBJ→NIKKEI`.

Crypto (`BINANCE_SYMBOL_MAP` in `crypto-instruments.ts`): `BTC/USD→BTCUSDT`,
`ETH/USD→ETHUSDT`, `SOL/USD→SOLUSDT`, `BNB/USD→BNBUSDT`, `XRP/USD→XRPUSDT`.

`XAG/USD`, `DJIA`, `NASDAQ`, `USD/CHF` have **no live tick at all**
(`LIVE_PRICE_FUTURES_ONLY`) — they only ever show Yahoo's last futures close
(§3), never update in real time.

### Response payload

```ts
{
  status: "success",
  updatedAt?: string,       // ISO 8601
  serverTime?: string,
  data: Array<{
    instrument: string;      // "XAU/USD", "BTC/USD", etc.
    symbol: string;          // the raw upstream symbol
    price: number | string;
    buy?: number | string;
    sell?: number | string;
    spread?: number | string;
    high?: number | string;
    low?: number | string;
    open?: number | string;
    changePercent?: string;  // e.g. "+0.12%"
    direction?: "up" | "down";
    serverTime?: string;
    updatedAt?: string;
  }>
}
```

Note: the frontend's consumer type (`hooks/use-live-quotes.ts`) treats several
of these fields as non-optional — a known minor shape drift from what the
backend actually guarantees. Don't assume `buy`/`sell`/`spread`/etc. are
always present when integrating a new consumer.

### Caching & polling

- 5-second in-process cache (`CACHE_TTL_MS`), shared between this route and
  the price-alerts background watcher. Concurrent cache-miss requests
  collapse onto a single in-flight upstream call (no thundering herd).
- Frontend polls every 5s via React Query (`refetchInterval: 5_000`,
  `staleTime: 4_000`).

### Consumers

- `hooks/use-live-quotes.ts` — `useLiveQuotes()`, `useQuoteByInstrument()`, `useLiveQuoteSnapshotByInstrument()`.
- `components/continuous-ticker.tsx` — the sticky header marquee.
- `components/dashboard-live-prices.tsx` — `FallbackTicker`, only kicks in after the TradingView widget (§1d) fails twice.
- `components/live-price-chip.tsx` — per-instrument "running price" pill (flashes green/red on tick change).

---

## 3. Historical/OHLC candles (feeds the AI analysis, not a live ticker)

Not TradingView either. Two sources depending on the timeframe:

- **Daily/weekly candles**: `GET https://endpoapi-production-3202.up.railway.app/api/historical?dateFrom=<ISO date>` — same upstream as §2/§4. Cached 1 hour. Symbol map example: `XAU/USD→"LGD Daily"`, `BRENT→"BCO Daily"` (`artifacts/api-server/src/lib/historical.ts`).
- **Intraday candles**: Yahoo Finance's chart API, `https://query1.finance.yahoo.com/v8/finance/chart/<symbol>` — requires a spoofed browser `User-Agent` (Node's default gets rejected by Yahoo). Symbol map (`YAHOO_SYMBOL_MAP`): `XAU/USD→GC=F`, `XAG/USD→SI=F`, `BRENT→BZ=F`, `HSI→^HSI`, `NIKKEI→NIY=F`, `DJIA→YM=F`, `NASDAQ→NQ=F`, `DXY→DX-Y.NYB`, `EUR/USD→EURUSD=X`, etc. Crypto uses `YAHOO_CRYPTO_SYMBOL_MAP` (e.g. `BTC/USD→BTC-USD`).
- Per-timeframe cache TTL ranges from 30s (1m candles) to 10min (1D/1W candles).
- This is also what feeds `AnalysisLevelsChart`/`BackendAlignedLiveChart` — the `lightweight-charts`-based fallback chart used instead of TradingView for BRENT/HSI/NIKKEI (§1a) and whenever a trade-plan levels overlay needs to be drawn on the chart.

---

## 4. Economic calendar — misleadingly named, not a TradingView embed

Despite the component being called `TradingViewEconomicCalendar`, **it embeds
no TradingView widget at all** (confirmed: no `s3.tradingview.com` script
anywhere in the file). It's a fully custom React list, with a text link to
`https://www.tradingview.com/economic-calendar/` in the footer as the only
TradingView touchpoint — attribution, not integration. The name is a holdover
from an earlier implementation that presumably did embed TradingView's
calendar widget.

- Component: `components/tradingview-economic-calendar.tsx` — props `height`, `importanceFilter`, `countryFilter`, `currencyFilter`, `onClearFilters`; these are **local filter state only**, never forwarded to a TradingView config.
- Hook: `hooks/use-calendar.ts` → `GET /api/calendar`, `staleTime: 30 min`.
- Backend: `routes/calendar.ts` → upstream `GET https://endpoapi-production-3202.up.railway.app/api/calendar/this-week`, cached 30 min.
- Response: `{ status: "success", updatedAt, total, events: CalendarEvent[] }` where
  ```ts
  CalendarEvent = {
    time: string; currency: string; impact: string; event: string;
    previous?: string; forecast?: string; actual?: string; date: string;
    epochMs?: number | null; whyTraderCare?: string;
  }
  ```
- There's also `GET /api/calendar/relevant?instrument=<X>&maxItems=<1-50>` — filters to the instrument's associated currencies and upcoming-only dates, used for the "which events the AI considered" preview and a pre-trade high-impact-event warning.

---

## 5. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Chart area shows an error/placeholder instead of a candlestick chart | TradingView's embed script blocked (ad-blocker, corporate firewall, `s3.tradingview.com` unreachable). The widget's own load-timeout fired `onLoadFailed`. |
| Dashboard ticker stuck loading, then switches to a plain text ticker | Same as above — `DashboardLivePrices` gave up after 2 retries and fell back to `/api/quotes/live`. |
| A specific instrument's price never updates in real time | Check `LIVE_PRICE_FUTURES_ONLY` (§2) — `XAG/USD`, `DJIA`, `NASDAQ`, `USD/CHF` are last-close-only by design, not a bug. |
| `/api/quotes/live` returns 502 | The required forex/commodities upstream (`endpoapi-production-3202.up.railway.app`) is down or erroring — crypto alone can't carry the response. |
| New crypto coin's price/chart doesn't show up | Needs a row added in **both** `crypto-instruments.ts` (backend) and `tradingview-symbols.ts` (frontend) — easy to update only one and have it half-work. |

---

## See also

- `docs/TECHNICAL.md` — broader architecture doc; its own notes corroborate
  the "ContinuousTicker uses `/api/quotes/live` + `/api/news`, NOT
  TradingView" distinction and list the same backend routes.
- `lib/api-spec/openapi.yaml` — source of truth for `/api/quotes/live` and
  `/api/calendar`'s exact schema (this doc describes behavior/intent; the
  spec wins on exact field types).
