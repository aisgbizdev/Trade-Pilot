import { Router } from "express";

const router = Router();

const LIVE_QUOTES_URL = "https://endpoapi-production-3202.up.railway.app/api/live-quotes";

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

let cache: { data: any; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 15_000;

router.get("/quotes/live", async (req, res) => {
  try {
    const now = Date.now();
    if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
      return res.json(cache.data);
    }

    const response = await fetch(LIVE_QUOTES_URL);
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);

    const raw = (await response.json()) as any;

    const mapped = (raw.data ?? []).map((item: any) => {
      const instrument = SYMBOL_MAP[item.symbol] ?? item.symbol;
      const changeStr: string = item["change%"] ?? "0%";
      const isNeg = changeStr.startsWith("-");
      return {
        instrument,
        symbol: item.symbol,
        price: item.price,
        buy: item.buy,
        sell: item.sell,
        spread: item.spread,
        high: item.high,
        low: item.low,
        open: item.open,
        changePercent: changeStr,
        direction: isNeg ? "down" : "up",
        serverTime: item.serverTime,
        updatedAt: item.serverDateTime,
      };
    });

    const result = {
      status: "success",
      updatedAt: raw.updatedAt,
      serverTime: raw.serverTime,
      data: mapped,
    };

    cache = { data: result, fetchedAt: now };
    return res.json(result);
  } catch (err: any) {
    return res.status(502).json({ error: "Gagal mengambil data harga live", detail: err.message });
  }
});

export default router;
