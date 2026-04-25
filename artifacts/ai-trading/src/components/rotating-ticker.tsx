import { useEffect, useState } from "react";
import { PriceTicker } from "./price-ticker";
import { NewsTicker } from "./news-ticker";
import { useNews } from "@/hooks/use-news";

const SWAP_INTERVAL_MS = 10_000;

export function RotatingTicker() {
  const { data: newsData } = useNews();
  const hasNews = (newsData?.articles?.length ?? 0) > 0;
  const [showNews, setShowNews] = useState(false);

  useEffect(() => {
    if (!hasNews) {
      setShowNews(false);
      return;
    }
    const id = setInterval(() => {
      setShowNews((prev) => !prev);
    }, SWAP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasNews]);

  if (!hasNews) {
    return <PriceTicker />;
  }

  return (
    <div
      className="relative"
      data-testid="rotating-ticker"
      data-mode={showNews ? "news" : "prices"}
    >
      <div
        key={showNews ? "news" : "prices"}
        className="ticker-fade-in"
      >
        {showNews ? <NewsTicker /> : <PriceTicker />}
      </div>
    </div>
  );
}
