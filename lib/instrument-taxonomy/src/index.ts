export const PRIMARY_INSTRUMENTS = [
  "XAU/USD",
  "BRENT",
  "HSI",
  "NIKKEI",
] as const;

export type PrimaryInstrument = (typeof PRIMARY_INSTRUMENTS)[number];

export const OTHER_INSTRUMENT_BUCKET_KEY = "__other__" as const;

const PRIMARY_INSTRUMENT_SET: ReadonlySet<string> = new Set(PRIMARY_INSTRUMENTS);

export function isPrimaryInstrument(instrument: string): instrument is PrimaryInstrument {
  return PRIMARY_INSTRUMENT_SET.has(instrument);
}