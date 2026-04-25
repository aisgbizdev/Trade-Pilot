import { Router } from "express";
import { openai } from "../lib/openai";
import { logger } from "../lib/logger";

const router = Router();
const NEWS_API = "https://endpoapi-production-3202.up.railway.app/api/news-id";
const CACHE_TTL = 10 * 60 * 1000;
const TRANSLATION_TTL = 10 * 60 * 1000;
const TRANSLATION_TIMEOUT_MS = 20_000;
const TRANSLATION_MAX_ARTICLES = 10;
const TRANSLATION_CACHE_MAX = 200;
const TRANSLATION_MODEL = "gpt-4o-mini";

interface ArticleOut {
  id: number;
  title: string;
  summary: string;
  category: string;
  date: string;
  publishedAt: string;
  sourceName: string;
  link: string;
  image: string;
}

interface NewsResponse {
  status: string;
  total: number;
  articles: ArticleOut[];
}

let cache: { data: NewsResponse; fetchedAt: number } | null = null;
const translationCache = new Map<
  number,
  { titleEn: string; sourceTitle: string; cachedAt: number }
>();

let translationFailureWarnedAt = 0;

function pruneTranslationCache(now: number): void {
  for (const [id, entry] of translationCache) {
    if (now - entry.cachedAt >= TRANSLATION_TTL) {
      translationCache.delete(id);
    }
  }
  if (translationCache.size > TRANSLATION_CACHE_MAX) {
    const overflow = translationCache.size - TRANSLATION_CACHE_MAX;
    let removed = 0;
    for (const id of translationCache.keys()) {
      if (removed >= overflow) break;
      translationCache.delete(id);
      removed++;
    }
  }
}

async function fetchUpstream(): Promise<NewsResponse> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL) {
    return cache.data;
  }
  const response = await fetch(`${NEWS_API}?page=1&perPage=30`);
  if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
  const raw = (await response.json()) as any;
  const articles: ArticleOut[] = (raw.data ?? []).map((a: any) => ({
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
  const result: NewsResponse = {
    status: "success",
    total: raw.total,
    articles,
  };
  cache = { data: result, fetchedAt: now };
  return result;
}

async function translateTitlesToEn(
  articles: ArticleOut[],
): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  const now = Date.now();
  pruneTranslationCache(now);

  const needsTranslation: ArticleOut[] = [];
  const eligible = articles.slice(0, TRANSLATION_MAX_ARTICLES);
  for (const a of eligible) {
    const cached = translationCache.get(a.id);
    if (
      cached &&
      now - cached.cachedAt < TRANSLATION_TTL &&
      cached.sourceTitle === a.title
    ) {
      result.set(a.id, cached.titleEn);
    } else {
      needsTranslation.push(a);
    }
  }

  if (needsTranslation.length === 0) return result;

  const items = needsTranslation.map((a) => ({ id: a.id, title: a.title }));
  const userPrompt = [
    "Translate each Indonesian news headline to natural, concise English.",
    "Keep proper nouns (people, places, tickers) unchanged.",
    "Do not add commentary. Return strict JSON only.",
    "",
    "Input:",
    JSON.stringify(items),
    "",
    'Output schema: {"items":[{"id":<number>,"title_en":<string>}]}',
  ].join("\n");

  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    TRANSLATION_TIMEOUT_MS,
  );
  try {
    const response = await openai.chat.completions.create(
      {
        model: TRANSLATION_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You translate Indonesian news headlines to English. Output strict JSON only.",
          },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      },
      { signal: controller.signal },
    );

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty translation response");
    const parsed = JSON.parse(content) as {
      items?: Array<{ id?: number; title_en?: string }>;
    };
    const list = Array.isArray(parsed.items) ? parsed.items : [];
    const sourceTitleById = new Map(
      needsTranslation.map((a) => [a.id, a.title]),
    );
    for (const item of list) {
      if (
        typeof item.id === "number" &&
        typeof item.title_en === "string" &&
        item.title_en.trim().length > 0
      ) {
        const sourceTitle = sourceTitleById.get(item.id);
        if (!sourceTitle) continue;
        const titleEn = item.title_en.trim();
        result.set(item.id, titleEn);
        translationCache.set(item.id, {
          titleEn,
          sourceTitle,
          cachedAt: now,
        });
      }
    }
  } catch (err: any) {
    if (now - translationFailureWarnedAt > 60_000) {
      translationFailureWarnedAt = now;
      logger.warn(
        { err: err?.message ?? String(err) },
        "News title translation to EN failed; falling back to original Indonesian titles",
      );
    }
  } finally {
    clearTimeout(timer);
  }

  return result;
}

router.get("/news", async (req, res) => {
  try {
    const lang = req.query["lang"] === "en" ? "en" : "id";
    const data = await fetchUpstream();

    if (lang === "id") {
      return res.json(data);
    }

    const translations = await translateTitlesToEn(data.articles);
    const articles = data.articles.map((a) => ({
      ...a,
      title: translations.get(a.id) ?? a.title,
    }));
    return res.json({ ...data, articles });
  } catch (err: any) {
    return res
      .status(502)
      .json({ error: "Gagal mengambil berita", detail: err.message });
  }
});

export default router;
