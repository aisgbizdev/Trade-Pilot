import { Router } from "express";
import { getLiveQuotes } from "../lib/live-prices";

const router = Router();

// Fresh-read window for the "fast" streaming ticker. The default route
// keeps the 15s shared cache; `?fast=1` accepts a read at most this old
// so an inline running-price chip updates close to real time.
const FAST_MAX_AGE_MS = 3_000;

router.get("/quotes/live", async (req, res) => {
  try {
    const fast = req.query["fast"] === "1" || req.query["fast"] === "true";
    const result = await getLiveQuotes(fast ? FAST_MAX_AGE_MS : undefined);
    if (fast) {
      res.set("Cache-Control", "no-store");
    }
    return res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(502).json({ error: "Gagal mengambil data harga live", detail: msg });
  }
});

export default router;
