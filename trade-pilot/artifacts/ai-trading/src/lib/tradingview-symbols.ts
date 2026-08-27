export type TradingViewInterval =
  | "1"
  | "3"
  | "5"
  | "15"
  | "30"
  | "60"
  | "120"
  | "240"
  | "D"
  | "W"
  | "M";

const INSTRUMENT_TO_TV_SYMBOL: Record<string, string> = {
  "XAU/USD": "OANDA:XAUUSD",
  "XAG/USD": "OANDA:XAGUSD",
  BRENT: "BLACKBULL:BRENT",
  HSI: "VANTAGE:HK50",
  NIKKEI: "SPREADEX:NIKKEI",
  DJIA: "TVC:DJI",
  NASDAQ: "TVC:NDX",
  DXY: "TVC:DXY",
  "AUD/USD": "OANDA:AUDUSD",
  "EUR/USD": "OANDA:EURUSD",
  "GBP/USD": "OANDA:GBPUSD",
  "USD/CHF": "OANDA:USDCHF",
  "USD/JPY": "OANDA:USDJPY",
  "USD/IDR": "FX_IDC:USDIDR",
  "BTC/USD": "BINANCE:BTCUSDT",
  "ETH/USD": "BINANCE:ETHUSDT",
  "SOL/USD": "BINANCE:SOLUSDT",
  "BNB/USD": "BINANCE:BNBUSDT",
  "XRP/USD": "BINANCE:XRPUSDT",
};

export function instrumentToTradingViewSymbol(instrument: string): string {
  const direct = INSTRUMENT_TO_TV_SYMBOL[instrument];
  if (direct) return direct;
  const upper = instrument.toUpperCase().trim();
  if (INSTRUMENT_TO_TV_SYMBOL[upper]) return INSTRUMENT_TO_TV_SYMBOL[upper]!;
  const compact = upper.replace(/[\s/]+/g, "");
  if (/^[A-Z]{6,8}$/.test(compact)) return `OANDA:${compact}`;
  return compact || instrument;
}

const TIMEFRAME_TO_INTERVAL: Record<string, TradingViewInterval> = {
  "1m": "1",
  "3m": "3",
  "5m": "5",
  "15m": "15",
  "30m": "30",
  "1h": "60",
  "2h": "120",
  "4h": "240",
  "1D": "D",
  "1d": "D",
  D: "D",
  "1W": "W",
  "1w": "W",
  W: "W",
  "1M": "M",
  M: "M",
};

export function timeframeToTradingViewInterval(
  timeframe: string,
): TradingViewInterval {
  return TIMEFRAME_TO_INTERVAL[timeframe] ?? "60";
}

const INSTRUMENT_TO_CURRENCIES: Record<string, string[]> = {
  "XAU/USD": ["USD"],
  "XAG/USD": ["USD"],
  BRENT: [],
  HSI: ["HKD"],
  NIKKEI: ["JPY"],
  DJIA: ["USD"],
  NASDAQ: ["USD"],
  DXY: ["USD"],
  "BTC/USD": ["USD"],
  "ETH/USD": ["USD"],
  "SOL/USD": ["USD"],
  "BNB/USD": ["USD"],
  "XRP/USD": ["USD"],
};

// Crypto instruments — mirror of the server-side list. Kept here so the
// analyze picker, market-sessions badge, and any other client UI can
// branch on asset class without importing from the server.
export const CRYPTO_INSTRUMENTS = [
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "BNB/USD",
  "XRP/USD",
] as const;

const CRYPTO_SET = new Set<string>(CRYPTO_INSTRUMENTS);

export function isCryptoInstrument(instrument: string): boolean {
  return CRYPTO_SET.has(instrument.toUpperCase().trim());
}

export function instrumentToCurrencies(instrument: string): string[] {
  const key = instrument.toUpperCase().trim();
  if (key in INSTRUMENT_TO_CURRENCIES) return INSTRUMENT_TO_CURRENCIES[key]!;
  const parts = key.split("/").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 2 && /^[A-Z]{3}$/.test(parts[0]!) && /^[A-Z]{3}$/.test(parts[1]!)) {
    return parts as string[];
  }
  return [];
}

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "us",
  EUR: "eu",
  GBP: "gb",
  JPY: "jp",
  CHF: "ch",
  AUD: "au",
  CAD: "ca",
  NZD: "nz",
  IDR: "id",
  HKD: "hk",
  CNY: "cn",
};

export function currenciesToCountryFilter(currencies: string[]): string {
  const seen = new Set<string>();
  for (const c of currencies) {
    const code = CURRENCY_TO_COUNTRY[c.toUpperCase()];
    if (code) seen.add(code);
  }
  return Array.from(seen).join(",");
}

export const SUPPORTED_CALENDAR_CURRENCIES = Object.keys(CURRENCY_TO_COUNTRY);
