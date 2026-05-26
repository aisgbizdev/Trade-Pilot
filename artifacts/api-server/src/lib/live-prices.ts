import { logger } from "./logger";

// Shared upstream live-quotes feed. The HTTP route at `/quotes/live` and
// the price-alerts watcher both call into here so they share the same
// 15s in-memory cache (one upstream fetch serves the entire process).
const LIVE_QUOTES_URL = "https://endpoapi-production-3202.up.railway.app/api/live-quotes";

// Maps the upstream's opaque symbol codes onto the same instrument names
// the rest of the app uses (the values stored on `analyses.instrument`).
// Kept in lockstep with the table in `routes/quotes.ts`.
const SYMBOL_MAP: Record<string, string> = {
  XUL10: "XAU/USD",
  BCO10_BBJ: "BRENT",
  EU10F_BBJ: "EUR/USD",
  GU10F_BBJ: "GBP/USD",
  UJ10F_BBJ: "USD/JPY",
  UI10F_BBJ: "USD/IDR",
  DX10F_BBJ: "DXY",
  AU10F_BBJ: "AUD/USD",
  HKK50_BBJ: "HK50",
  JPK50_BBJ: "NIKKEI",
};

export interface LiveQuote {
  instrument: string;
  symbol: string;
  price: number | string;
  buy?: number | string;
  sell?: number | string;
  spread?: number | string;
  high?: number | string;
  low?: number | string;
  open?: number | string;
  changePercent?: string;
  direction?: "up" | "down";
  serverTime?: string;
  updatedAt?: string;
}

export interface LiveQuotesPayload {
  status: "success";
  updatedAt?: string;
  serverTime?: string;
  data: LiveQuote[];
}

const CACHE_TTL_MS = 15_000;
let cache: { data: LiveQuotesPayload; fetchedAt: number } | null = null;
let inFlight: Promise<LiveQuotesPayload> | null = null;

async function fetchLive(): Promise<LiveQuotesPayload> {
  const response = await fetch(LIVE_QUOTES_URL);
  if (!response.ok) throw new Error(`Upstream live-quotes error: ${response.status}`);
  const raw = (await response.json()) as { data?: unknown[]; updatedAt?: string; serverTime?: string };
  const mapped: LiveQuote[] = (raw.data ?? []).map((item) => {
    const it = item as Record<string, unknown>;
    const symbol = String(it["symbol"] ?? "");
    const instrument = SYMBOL_MAP[symbol] ?? symbol;
    const changeStr = String(it["change%"] ?? "0%");
    const isNeg = changeStr.startsWith("-");
    return {
      instrument,
      symbol,
      price: it["price"] as number | string,
      buy: it["buy"] as number | string | undefined,
      sell: it["sell"] as number | string | undefined,
      spread: it["spread"] as number | string | undefined,
      high: it["high"] as number | string | undefined,
      low: it["low"] as number | string | undefined,
      open: it["open"] as number | string | undefined,
      changePercent: changeStr,
      direction: isNeg ? "down" : "up",
      serverTime: it["serverTime"] as string | undefined,
      updatedAt: it["serverDateTime"] as string | undefined,
    };
  });
  return {
    status: "success",
    updatedAt: raw.updatedAt,
    serverTime: raw.serverTime,
    data: mapped,
  };
}

/**
 * Fetch the live-quotes payload, sharing a 15s in-memory cache across
 * the HTTP route and the price-alerts watcher. Concurrent callers that
 * hit during a cache miss collapse onto the same in-flight upstream
 * request (so a burst doesn't fan out into N upstream calls).
 */
export async function getLiveQuotes(): Promise<LiveQuotesPayload> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }
  if (inFlight) return inFlight;
  inFlight = fetchLive()
    .then((data) => {
      cache = { data, fetchedAt: Date.now() };
      return data;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/**
 * Resolve the current mid-price for a single instrument. Returns null
 * when the upstream feed doesn't cover that instrument (the watcher
 * treats those alerts as un-checkable and leaves them armed until
 * `validUntil` cancels them out).
 */
export async function getLivePriceFor(instrument: string): Promise<number | null> {
  try {
    const payload = await getLiveQuotes();
    const hit = payload.data.find((q) => q.instrument === instrument);
    if (!hit) return null;
    const n = typeof hit.price === "number" ? hit.price : Number(hit.price);
    return Number.isFinite(n) ? n : null;
  } catch (err) {
    logger.warn({ err, instrument }, "Live-price lookup failed");
    return null;
  }
}
