import { describe, it, expect } from "vitest";

import {
  INTRADAY_TIMEFRAMES,
  SUPPORTED_INDICATOR_TIMEFRAMES,
  isSupportedIndicatorTimeframe,
  indicatorsCacheTtlSeconds,
} from "../historical.js";
import { getValidUntil } from "../openai.js";

/**
 * Wiring test for the 30-minute timeframe added end-to-end. The 30m bucket
 * is exposed at every layer the Analyze flow touches:
 *   - `isSupportedIndicatorTimeframe` (route guard in POST /analyses)
 *   - `INTRADAY_TIMEFRAMES` / `SUPPORTED_INDICATOR_TIMEFRAMES` (UI sources)
 *   - `indicatorsCacheTtlSeconds` (per-timeframe cache TTL table)
 *   - `getValidUntil` (analysis "valid until" badge in the saved view)
 *
 * Without these wires, picking 30m on the UI would either fall through to
 * the "no indicators" branch or pick up a default validity that misleads
 * the user. Each assertion below pins one of those wires.
 */
describe("30-minute timeframe is wired end-to-end", () => {
  it("registers '30m' as a supported intraday timeframe", () => {
    expect(INTRADAY_TIMEFRAMES).toContain("30m");
    expect(SUPPORTED_INDICATOR_TIMEFRAMES).toContain("30m");
    expect(isSupportedIndicatorTimeframe("30m")).toBe(true);
  });

  it("places the 30m cache TTL between the 15m and 1h buckets", () => {
    const ttl15 = indicatorsCacheTtlSeconds("15m");
    const ttl30 = indicatorsCacheTtlSeconds("30m");
    const ttl1h = indicatorsCacheTtlSeconds("1h");
    expect(ttl30).toBeGreaterThanOrEqual(ttl15);
    expect(ttl30).toBeLessThanOrEqual(ttl1h);
  });

  it("places the 30m analysis validity between the 15m and 1h buckets", () => {
    const now = Date.now();
    const validity = (tf: string) => getValidUntil(tf).getTime() - now;
    const v15 = validity("15m");
    const v30 = validity("30m");
    const v1h = validity("1h");
    // 30m should fall strictly between the neighbouring intraday slots so
    // the "berlaku sampai" badge feels right relative to its peers.
    expect(v30).toBeGreaterThan(v15);
    expect(v30).toBeLessThan(v1h);
  });
});
