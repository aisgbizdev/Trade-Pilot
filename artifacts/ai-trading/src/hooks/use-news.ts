import { useQuery } from "@tanstack/react-query";

export interface NewsArticle {
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

async function fetchNews(): Promise<{ articles: NewsArticle[]; total: number }> {
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error("Gagal mengambil berita");
  return res.json();
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
