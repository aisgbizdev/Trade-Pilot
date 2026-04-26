import { calculateIndicators, type TechnicalIndicators, type Candle } from "./indicators.js";

const HISTORICAL_API = "https://endpoapi-production-3202.up.railway.app/api/historical";

const SYMBOL_MAP: Record<string, string> = {
  "XAU/USD": "LGD Daily",
  "BRENT": "BCO Daily",
  "EUR/USD": "EUR/USD",
  "GBP/USD": "GBP/USD",
  "USD/JPY": "USD/JPY",
  "USD/CHF": "USD/CHF",
  "AUD/USD": "AUD/USD",
  "HSI": "HSI Daily",
};

export type IndicatorTimeframe = "1D" | "1W";
export const SUPPORTED_INDICATOR_TIMEFRAMES: IndicatorTimeframe[] = ["1D", "1W"];

export function isSupportedIndicatorTimeframe(tf: string): tf is IndicatorTimeframe {
  return (SUPPORTED_INDICATOR_TIMEFRAMES as string[]).includes(tf);
}

let cache: { data: any; fetchedAt: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchAllHistorical(): Promise<{ data: any[]; fetchedAt: number }> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return { data: cache.data, fetchedAt: cache.fetchedAt };
  }
  const dateFrom = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const res = await fetch(`${HISTORICAL_API}?dateFrom=${dateFrom}`);
  if (!res.ok) throw new Error("Failed to fetch historical data");
  const json = (await res.json()) as { data: any };
  cache = { data: json.data, fetchedAt: Date.now() };
  return { data: cache.data, fetchedAt: cache.fetchedAt };
}

// Per-(instrument, timeframe) cache for the resampled candles + computed
// indicators. Keyed by the upstream `fetchedAt` so that whenever the underlying
// daily-candle cache refreshes, all derived indicator entries are implicitly
// invalidated (we never serve indicators computed from older raw data).
type CachedIndicators = {
  indicators: TechnicalIndicators;
  computedAt: number;
  sourceFetchedAt: number;
};
const indicatorsCache = new Map<string, CachedIndicators>();
// Short TTL keeps the toggle feeling instant while bounding staleness well
// below the 1-hour upstream refresh cycle.
const INDICATORS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
// Public so the route can derive a matching Cache-Control max-age.
export const INDICATORS_CACHE_TTL_SECONDS = Math.floor(INDICATORS_CACHE_TTL / 1000);

function indicatorsCacheKey(instrument: string, timeframe: IndicatorTimeframe): string {
  return `${instrument}|${timeframe}`;
}

// Exposed for tests / manual cache busting.
export function clearIndicatorsCache(): void {
  indicatorsCache.clear();
  cache = null;
}

// Aggregate daily candles into ISO-week (Mon–Sun) candles. Each weekly bar uses
// the first day's open, highest high, lowest low, and last day's close.
function resampleDailyToWeekly(daily: Candle[]): Candle[] {
  if (daily.length === 0) return [];
  const sorted = [...daily].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const weekKeyOf = (iso: string): string => {
    const d = new Date(iso);
    // Find Monday of this date's ISO week (UTC to avoid TZ drift).
    const day = d.getUTCDay(); // 0=Sun..6=Sat
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(Date.UTC(
      d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diffToMonday,
    ));
    return monday.toISOString().slice(0, 10);
  };

  const buckets = new Map<string, Candle[]>();
  for (const c of sorted) {
    const key = weekKeyOf(c.date);
    const arr = buckets.get(key) ?? [];
    arr.push(c);
    buckets.set(key, arr);
  }

  const weeks: Candle[] = [];
  for (const key of [...buckets.keys()].sort()) {
    const group = buckets.get(key)!;
    weeks.push({
      date: group[group.length - 1].date,
      open: group[0].open,
      high: Math.max(...group.map((c) => c.high)),
      low: Math.min(...group.map((c) => c.low)),
      close: group[group.length - 1].close,
    });
  }
  return weeks;
}

export async function getIndicators(
  instrument: string,
  timeframe: IndicatorTimeframe = "1D",
): Promise<TechnicalIndicators | null> {
  const apiSymbol = SYMBOL_MAP[instrument];
  if (!apiSymbol) return null;

  const { data: allData, fetchedAt: sourceFetchedAt } = await fetchAllHistorical();

  // Serve from the per-(instrument, timeframe) cache when fresh AND derived
  // from the same upstream snapshot. The sourceFetchedAt check guarantees we
  // never return indicators computed from raw data that has since refreshed.
  const cacheKey = indicatorsCacheKey(instrument, timeframe);
  const cached = indicatorsCache.get(cacheKey);
  if (
    cached &&
    cached.sourceFetchedAt === sourceFetchedAt &&
    Date.now() - cached.computedAt < INDICATORS_CACHE_TTL
  ) {
    return cached.indicators;
  }

  const symbolData = allData.find((s: any) => s.symbol === apiSymbol);
  if (!symbolData || !symbolData.data?.length) return null;

  const dailyCandles: Candle[] = symbolData.data.map((d: any) => ({
    date: d.date,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }));

  const candles =
    timeframe === "1W" ? resampleDailyToWeekly(dailyCandles) : dailyCandles;

  if (!candles.length) return null;

  const indicators = calculateIndicators(instrument, candles);
  indicatorsCache.set(cacheKey, {
    indicators,
    computedAt: Date.now(),
    sourceFetchedAt,
  });
  return indicators;
}

export function formatIndicatorsForPrompt(
  ind: TechnicalIndicators,
  timeframe: IndicatorTimeframe = "1D",
): string {
  const r = (n: number, decimals = 2) => n.toFixed(decimals);
  const sign = (n: number) => (n >= 0 ? "+" : "") + r(n);

  const maLines = ind.movingAverages
    .sort((a, b) => a.period - b.period || a.type.localeCompare(b.type))
    .map((m) => `  ${m.type}(${m.period}): ${r(m.value, 4)} → ${m.signal}`)
    .join("\n");

  const candleUnit = timeframe === "1W" ? "candle mingguan" : "candle harian";
  const periodLabel = timeframe === "1W" ? "minggu" : "hari";

  return `
=== DATA TEKNIKAL (${ind.symbol}, timeframe ${timeframe}, berdasarkan ${ind.dataPoints} ${candleUnit}) ===
Harga terakhir: ${r(ind.lastClose, 4)} (${ind.lastDate})
Perubahan (per ${periodLabel}): 1=${sign(ind.change1dPct)}% | 5=${sign(ind.change5dPct)}% | 20=${sign(ind.change20dPct)}%

RINGKASAN SINYAL (timeframe ${timeframe}):
  Oscillator: ${ind.oscillatorSummary.buy} Beli / ${ind.oscillatorSummary.sell} Jual / ${ind.oscillatorSummary.neutral} Netral
  Moving Average: ${ind.maSummary.buy} Beli / ${ind.maSummary.sell} Jual / ${ind.maSummary.neutral} Netral
  KESELURUHAN: ${ind.overallSummary.buy} Beli / ${ind.overallSummary.sell} Jual / ${ind.overallSummary.neutral} Netral → ${ind.overallSummary.signal.toUpperCase()}

OSCILLATOR (timeframe ${timeframe}):
  RSI(14): ${r(ind.rsi14.value)} → ${ind.rsi14.signal}
  MACD(12,26,9): garis=${r(ind.macd.macd, 4)} signal=${r(ind.macd.signal, 4)} histogram=${r(ind.macd.histogram, 4)} → ${ind.macd.action}
  Stochastic(14,3,3): %K=${r(ind.stochastic.k)} %D=${r(ind.stochastic.d)} → ${ind.stochastic.signal}
  Bollinger Bands(20,2): upper=${r(ind.bollinger.upper, 4)} mid=${r(ind.bollinger.middle, 4)} lower=${r(ind.bollinger.lower, 4)} → ${ind.bollinger.signal}

MOVING AVERAGES (timeframe ${timeframe}):
${maLines}
===`;
}
