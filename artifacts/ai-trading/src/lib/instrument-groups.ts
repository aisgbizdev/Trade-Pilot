export const PRIMARY_INSTRUMENTS = [
  "XAU/USD",
  "BRENT",
  "HSI",
  "NIKKEI",
] as const;

export const OTHER_INSTRUMENTS = [
  "XAG/USD",
  "DJIA",
  "NASDAQ",
  "DXY",
  "AUD/USD",
  "EUR/USD",
  "GBP/USD",
  "USD/CHF",
  "USD/JPY",
  "USD/IDR",
] as const;

export const ALL_HISTORY_INSTRUMENTS = [
  ...PRIMARY_INSTRUMENTS,
  ...OTHER_INSTRUMENTS,
] as const;

export const OTHER_INSTRUMENT_BUCKET_KEY = "__other__";

export function isPrimaryInstrument(instrument: string): boolean {
  return (PRIMARY_INSTRUMENTS as readonly string[]).includes(instrument);
}