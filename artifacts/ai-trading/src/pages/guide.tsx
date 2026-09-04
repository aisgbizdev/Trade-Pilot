import { useState, useMemo } from "react";
import { ChevronLeft, Search, BookOpen, ChevronRight, X } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n";
import { GUIDE_CATEGORIES, type GuideBlock } from "@/lib/guide-content";

function renderBlock(block: GuideBlock, idx: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={idx} className="text-sm text-foreground/90 leading-relaxed">
          {block.val}
        </p>
      );
    case "h":
      return (
        <h3 key={idx} className="text-sm font-bold text-foreground mt-4 mb-2">
          {block.val}
        </h3>
      );
    case "list":
      return (
        <ul key={idx} className="space-y-1.5 list-disc pl-5">
          {block.val.map((item, i) => (
            <li key={i} className="text-sm text-foreground/90 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div
          key={idx}
          className="rounded-lg border-l-2 border-primary bg-primary/[0.06] px-3 py-2 my-3"
        >
          <p className="text-sm text-foreground/90 leading-relaxed italic">
            {block.val}
          </p>
        </div>
      );
  }
}

export default function GuidePage() {
  const { t, lang } = useTranslation();
  const [, setLocation] = useLocation();
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const requestedCategory = new URLSearchParams(window.location.search).get("category");
  const initialCategory = GUIDE_CATEGORIES.some((category) => category.id === requestedCategory)
    ? requestedCategory
    : null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

  const activeArticle = useMemo(() => {
    if (!activeArticleId) return null;
    for (const cat of GUIDE_CATEGORIES) {
      const found = cat.articles.find((a) => a.id === activeArticleId);
      if (found) return { article: found, category: cat };
    }
    return null;
  }, [activeArticleId]);

  const filteredCategories = useMemo(() => {
    const categories = selectedCategory
      ? GUIDE_CATEGORIES.filter((category) => category.id === selectedCategory)
      : GUIDE_CATEGORIES;
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    
    return categories.map(cat => {
      const catTitle = lang === "id" ? cat.title_id : cat.title_en;
      const matchCat = catTitle.toLowerCase().includes(q);
      
      const filteredArticles = cat.articles.filter(art => {
        const title = lang === "id" ? art.title_id : art.title_en;
        if (title.toLowerCase().includes(q)) return true;
        
        const content = lang === "id" ? art.content_id : art.content_en;
        return content.some(block => {
          if (block.type === "list") {
            return block.val.some(v => v.toLowerCase().includes(q));
          }
          return block.val.toLowerCase().includes(q);
        });
      });
      
      if (matchCat || filteredArticles.length > 0) {
        return {
          ...cat,
          articles: matchCat && filteredArticles.length === 0 ? cat.articles : filteredArticles
        };
      }
      return null;
    }).filter(Boolean) as typeof GUIDE_CATEGORIES;
  }, [searchQuery, lang, selectedCategory]);

  const openArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    document.querySelector("[data-testid='app-scroll-container']")?.scrollTo({ top: 0 });
  };

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4 md:max-w-3xl md:mx-auto lg:max-w-none">
        {!activeArticle ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setLocation("/profile")}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                data-testid="button-guide-back-to-profile"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  {t.guide.title}
                </h1>
                <p className="text-xs text-muted-foreground">{t.guide.subtitle}</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.guide.search_placeholder}
                className="pl-9 pr-9 bg-card border-border h-10 text-sm"
                data-testid="input-guide-search"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                  aria-label={lang === "id" ? "Hapus pencarian" : "Clear search"}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none" aria-label={t.guide.table_of_contents}>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCategory === null
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "id" ? "Semua" : "All"}
              </button>
              {GUIDE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selectedCategory === category.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`guide-category-${category.id}`}
                >
                  <category.icon className="w-3.5 h-3.5" />
                  {lang === "id" ? category.title_id : category.title_en}
                </button>
              ))}
            </div>

            {filteredCategories.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                {t.guide.no_results}
              </div>
            ) : (
              <div className="space-y-6 mt-4">
                {filteredCategories.map(cat => (
                  <div key={cat.id} className="space-y-2">
                    <h2 className="text-sm font-bold text-foreground flex items-center gap-2 px-1">
                      <cat.icon className="w-4 h-4 text-primary" />
                      {lang === "id" ? cat.title_id : cat.title_en}
                    </h2>
                    <div className="grid gap-2">
                      {cat.articles.map(art => (
                        <Card 
                          key={art.id}
                          className="hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => openArticle(art.id)}
                          data-testid={`guide-article-${art.id}`}
                        >
                          <div className="p-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                              {lang === "id" ? art.title_id : art.title_en}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setActiveArticleId(null)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              data-testid="button-guide-back-to-list"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
               {t.guide.back_to_guide}
            </button>
            <header className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-[10px] font-semibold text-primary uppercase tracking-wider">
                <activeArticle.category.icon className="w-3 h-3" />
                {lang === "id" ? activeArticle.category.title_id : activeArticle.category.title_en}
              </div>
              <h1 className="text-xl font-bold text-foreground leading-tight">
                {lang === "id" ? activeArticle.article.title_id : activeArticle.article.title_en}
              </h1>
            </header>
            <div className="space-y-3 pb-8">
              {(lang === "id" ? activeArticle.article.content_id : activeArticle.article.content_en).map((b, i) => renderBlock(b, i))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
