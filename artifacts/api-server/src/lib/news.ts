const NEWS_API = "https://endpoapi-production-3202.up.railway.app/api/news-id";
let cache: { data: any[]; fetchedAt: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000;

const INSTRUMENT_KEYWORDS: Record<string, string[]> = {
  "XAU/USD": ["emas", "gold", "xau", "dolar", "fed", "inflasi", "safe haven", "logam mulia"],
  "BRENT":   ["minyak", "brent", "crude", "opec", "energi", "bbm", "petroleum"],
  "EUR/USD": ["euro", "eur", "ecb", "eropa", "dolar", "inflasi", "fed"],
  "GBP/USD": ["pound", "gbp", "inggris", "boe", "sterling", "brexit", "uk"],
  "USD/JPY": ["yen", "jpy", "jepang", "boj", "bank of japan", "dolar"],
  "USD/IDR": ["rupiah", "idr", "indonesia", "bi", "bank indonesia", "dolar"],
  "DXY":     ["dolar", "fed", "inflasi", "cpi", "nfp", "fomc", "usd"],
  "AUD/USD": ["australia", "aud", "rba", "dolar", "komoditas"],
  "USD/CHF": ["swiss", "chf", "franc", "snb", "safe haven"],
  "HSI":     ["hongkong", "china", "tiongkok", "yuan", "hang seng", "csi"],
};

async function fetchAllNews(): Promise<any[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) return cache.data;
  const res = await fetch(`${NEWS_API}?page=1&perPage=50`);
  if (!res.ok) throw new Error("Gagal fetch news");
  const json = await res.json() as any;
  const data = json.data ?? [];
  cache = { data, fetchedAt: Date.now() };
  return data;
}

export async function getRelevantNews(instrument: string, maxItems = 5): Promise<any[]> {
  const keywords = INSTRUMENT_KEYWORDS[instrument] ?? ["forex", "trading", "pasar", "ekonomi"];
  const all = await fetchAllNews();
  const scored = all.map((a: any) => {
    const text = `${a.title} ${a.summary ?? ""} ${a.detail?.slice(0, 200) ?? ""}`.toLowerCase();
    const score = keywords.reduce((s, kw) => s + (text.includes(kw) ? 1 : 0), 0);
    return { ...a, score };
  });
  return scored
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.published_at ?? b.date).getTime() - new Date(a.published_at ?? a.date).getTime())
    .slice(0, maxItems);
}

export function formatNewsForPrompt(news: any[], instrument: string): string {
  if (!news.length) return "";
  const lines = news.map((n, i) =>
    `  ${i + 1}. [${n.date}] ${n.title}\n     ${(n.summary || n.detail?.slice(0, 150) || "").trim()}`
  ).join("\n");
  return `\n=== BERITA TERKINI RELEVAN (${instrument}) ===\n${lines}\n===`;
}
