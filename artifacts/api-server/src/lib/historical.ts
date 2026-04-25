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

let cache: { data: any; fetchedAt: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchAllHistorical(): Promise<any[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return cache.data;
  }
  const dateFrom = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const res = await fetch(`${HISTORICAL_API}?dateFrom=${dateFrom}`);
  if (!res.ok) throw new Error("Failed to fetch historical data");
  const json = (await res.json()) as { data: any };
  cache = { data: json.data, fetchedAt: Date.now() };
  return json.data;
}

export async function getIndicators(instrument: string): Promise<TechnicalIndicators | null> {
  const apiSymbol = SYMBOL_MAP[instrument];
  if (!apiSymbol) return null;

  const allData = await fetchAllHistorical();
  const symbolData = allData.find((s: any) => s.symbol === apiSymbol);
  if (!symbolData || !symbolData.data?.length) return null;

  const candles: Candle[] = symbolData.data.map((d: any) => ({
    date: d.date,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }));

  return calculateIndicators(instrument, candles);
}

export function formatIndicatorsForPrompt(ind: TechnicalIndicators): string {
  const r = (n: number, decimals = 2) => n.toFixed(decimals);
  const sign = (n: number) => (n >= 0 ? "+" : "") + r(n);

  const maLines = ind.movingAverages
    .sort((a, b) => a.period - b.period || a.type.localeCompare(b.type))
    .map((m) => `  ${m.type}(${m.period}): ${r(m.value, 4)} → ${m.signal}`)
    .join("\n");

  return `
=== DATA TEKNIKAL (${ind.symbol}, berdasarkan ${ind.dataPoints} candle harian) ===
Harga terakhir: ${r(ind.lastClose, 4)} (${ind.lastDate})
Perubahan: 1H=${sign(ind.change1dPct)}% | 5H=${sign(ind.change5dPct)}% | 20H=${sign(ind.change20dPct)}%

RINGKASAN SINYAL:
  Oscillator: ${ind.oscillatorSummary.buy} Beli / ${ind.oscillatorSummary.sell} Jual / ${ind.oscillatorSummary.neutral} Netral
  Moving Average: ${ind.maSummary.buy} Beli / ${ind.maSummary.sell} Jual / ${ind.maSummary.neutral} Netral
  KESELURUHAN: ${ind.overallSummary.buy} Beli / ${ind.overallSummary.sell} Jual / ${ind.overallSummary.neutral} Netral → ${ind.overallSummary.signal.toUpperCase()}

OSCILLATOR:
  RSI(14): ${r(ind.rsi14.value)} → ${ind.rsi14.signal}
  MACD(12,26,9): garis=${r(ind.macd.macd, 4)} signal=${r(ind.macd.signal, 4)} histogram=${r(ind.macd.histogram, 4)} → ${ind.macd.action}
  Stochastic(14,3,3): %K=${r(ind.stochastic.k)} %D=${r(ind.stochastic.d)} → ${ind.stochastic.signal}
  Bollinger Bands(20,2): upper=${r(ind.bollinger.upper, 4)} mid=${r(ind.bollinger.middle, 4)} lower=${r(ind.bollinger.lower, 4)} → ${ind.bollinger.signal}

MOVING AVERAGES:
${maLines}
===`;
}
