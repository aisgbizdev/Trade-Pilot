import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";

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

async function fetchNews(
  lang: "en" | "id",
): Promise<{ articles: NewsArticle[]; total: number }> {
  const res = await fetch(`/api/news?lang=${lang}`);
  if (!res.ok) throw new Error("Gagal mengambil berita");
  return res.json();
}

export function useNews() {
  const { lang } = useTranslation();
  return useQuery({
    queryKey: ["news", lang],
    queryFn: () => fetchNews(lang),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}
