import { useQuery } from "@tanstack/react-query";

export interface NewsArticle {
  id: number | string;
  title: string;
  summary: string;
  category: string;
  date: string;
  publishedAt: string;
  sourceName: string;
  link: string;
  image: string;
}

async function fetchNews(): Promise<{
  articles: NewsArticle[];
  total: number;
}> {
  const res = await fetch(`/api/news`);
  if (!res.ok) throw new Error("Gagal mengambil berita");
  return res.json();
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

async function fetchTickerNews(limit: number): Promise<{
  articles: NewsArticle[];
  total: number;
}> {
  const res = await fetch(`/api/ticker-news?limit=${encodeURIComponent(limit)}`);
  if (!res.ok) throw new Error("Gagal mengambil breaking news");
  return res.json();
}

export function useTickerNews(limit = 3) {
  return useQuery({
    queryKey: ["ticker-news", limit],
    queryFn: () => fetchTickerNews(limit),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}
