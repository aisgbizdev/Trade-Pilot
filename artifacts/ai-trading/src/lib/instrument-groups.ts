import {
  PRIMARY_INSTRUMENTS,
  OTHER_INSTRUMENT_BUCKET_KEY,
  isPrimaryInstrument,
} from "@workspace/instrument-taxonomy";

export {
  PRIMARY_INSTRUMENTS,
  OTHER_INSTRUMENT_BUCKET_KEY,
  isPrimaryInstrument,
};

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
