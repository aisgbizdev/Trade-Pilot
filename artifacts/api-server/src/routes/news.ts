import { Router } from "express";

const router = Router();
const NEWS_API = "https://endpoapi-production-3202.up.railway.app/api/news-id";
let cache: { data: any; fetchedAt: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 menit

router.get("/news", async (req, res) => {
  try {
    const now = Date.now();
    if (cache && now - cache.fetchedAt < CACHE_TTL) {
      return res.json(cache.data);
    }
    const response = await fetch(`${NEWS_API}?page=1&perPage=30`);
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
    const raw = await response.json() as any;
    const articles = (raw.data ?? []).map((a: any) => ({
      id: a.id,
      title: a.title,
      summary: a.summary || a.detail?.slice(0, 200) || "",
      category: a.category,
      date: a.date,
      publishedAt: a.published_at,
      sourceName: a.source_name,
      link: a.link,
      image: a.image,
    }));
    const result = { status: "success", total: raw.total, articles };
    cache = { data: result, fetchedAt: now };
    return res.json(result);
  } catch (err: any) {
    return res.status(502).json({ error: "Gagal mengambil berita", detail: err.message });
  }
});

export default router;
