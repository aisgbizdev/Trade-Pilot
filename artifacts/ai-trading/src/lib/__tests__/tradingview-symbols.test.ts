import { describe, expect, it } from "vitest";
import {
  instrumentToTradingViewSymbol,
  timeframeToTradingViewInterval,
} from "../tradingview-symbols";

describe("instrumentToTradingViewSymbol", () => {
  it("maps known forex/metals to OANDA prefixed symbols", () => {
    expect(instrumentToTradingViewSymbol("XAU/USD")).toBe("OANDA:XAUUSD");
    expect(instrumentToTradingViewSymbol("EUR/USD")).toBe("OANDA:EURUSD");
    expect(instrumentToTradingViewSymbol("USD/JPY")).toBe("OANDA:USDJPY");
  });

  it("uses dedicated venues for index/commodity instruments", () => {
    expect(instrumentToTradingViewSymbol("BRENT")).toBe("BLACKBULL:BRENT");
    expect(instrumentToTradingViewSymbol("NIKKEI")).toBe("SPREADEX:NIKKEI");
    expect(instrumentToTradingViewSymbol("DXY")).toBe("TVC:DXY");
    expect(instrumentToTradingViewSymbol("USD/IDR")).toBe("FX_IDC:USDIDR");
  });

  it("falls back to OANDA for unknown 6-letter currency pairs", () => {
    expect(instrumentToTradingViewSymbol("NZD/CAD")).toBe("OANDA:NZDCAD");
  });

  it("returns the compact form for non-currency unknowns", () => {
    expect(instrumentToTradingViewSymbol("WEIRD-THING")).toBe("WEIRD-THING");
  });
});

describe("timeframeToTradingViewInterval", () => {
  it("maps internal timeframes to TradingView interval codes", () => {
    expect(timeframeToTradingViewInterval("1m")).toBe("1");
    expect(timeframeToTradingViewInterval("15m")).toBe("15");
    expect(timeframeToTradingViewInterval("1h")).toBe("60");
    expect(timeframeToTradingViewInterval("4h")).toBe("240");
    expect(timeframeToTradingViewInterval("1D")).toBe("D");
    expect(timeframeToTradingViewInterval("1W")).toBe("W");
  });

  it("defaults unknown timeframes to 1h (60)", () => {
    expect(timeframeToTradingViewInterval("nonsense")).toBe("60");
  });
});
