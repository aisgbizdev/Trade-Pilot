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
