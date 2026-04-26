import { Router } from "express";
import {
  getIndicators,
  isSupportedIndicatorTimeframe,
  SUPPORTED_INDICATOR_TIMEFRAMES,
  indicatorsCacheTtlSeconds,
} from "../lib/historical.js";

const router = Router();

router.get("/historical/indicators", async (req, res) => {
  const { instrument, timeframe } = req.query;
  if (!instrument || typeof instrument !== "string") {
    return res.status(400).json({ error: "Parameter instrument wajib diisi" });
  }

  const tfRaw = (typeof timeframe === "string" && timeframe.length > 0) ? timeframe : "1D";
  if (!isSupportedIndicatorTimeframe(tfRaw)) {
    return res.status(400).json({
      error: `Timeframe "${tfRaw}" belum didukung untuk indikator. Hanya tersedia: ${SUPPORTED_INDICATOR_TIMEFRAMES.join(", ")}.`,
      supportedTimeframes: SUPPORTED_INDICATOR_TIMEFRAMES,
    });
  }

  try {
    const indicators = await getIndicators(instrument, tfRaw);
    if (!indicators) {
      return res.status(404).json({ error: "Data historis tidak tersedia untuk instrumen ini" });
    }
    // Mirror the server-side TTL (which varies per timeframe — short for 1m,
    // longer for 1D/1W) so browsers/proxies can also serve fast toggles
    // between timeframes from their own cache. `private` because per-user
    // auth contexts shouldn't be shared across users via shared caches.
    res.setHeader(
      "Cache-Control",
      `private, max-age=${indicatorsCacheTtlSeconds(tfRaw)}`,
    );
    return res.json({ status: "success", timeframe: tfRaw, indicators });
  } catch (err: any) {
    return res.status(502).json({ error: "Gagal mengambil data historis", detail: err.message });
  }
});

export default router;
