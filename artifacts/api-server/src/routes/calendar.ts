import { Router } from "express";

const router = Router();
const CALENDAR_API = "https://endpoapi-production-3202.up.railway.app/api/calendar/this-week";
let cache: { data: any; fetchedAt: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 menit

router.get("/calendar", async (req, res) => {
  try {
    const now = Date.now();
    if (cache && now - cache.fetchedAt < CACHE_TTL) {
      return res.json(cache.data);
    }
    const response = await fetch(CALENDAR_API);
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
    const raw = await response.json() as any;
    const events = (raw.data ?? []).map((e: any) => ({
      time: e.time,
      currency: e.currency,
      impact: e.impact,
      event: e.event,
      previous: e.previous,
      forecast: e.forecast,
      actual: e.actual,
      date: e.date,
      whyTraderCare: e.details?.whyTraderCare ?? "",
    }));
    const result = {
      status: "success",
      updatedAt: raw.updatedAt,
      total: raw.total,
      events,
    };
    cache = { data: result, fetchedAt: now };
    return res.json(result);
  } catch (err: any) {
    return res.status(502).json({ error: "Gagal mengambil kalender ekonomi", detail: err.message });
  }
});

export default router;
