import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Search, BookOpen, ChevronRight, X } from "lucide-react";
import { Layout } from "@/components/layout";
import { useGetProgressionCatalog } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n";
import { GUIDE_CATEGORIES, type GuideBlock } from "@/lib/guide-content";
import { useRecordProgressionActivity, useStartProgressionEvidence, getGetProgressionSummaryQueryKey, getGetProgressionCatalogQueryKey, getGetProgressionHistoryQueryKey, type ProgressionEvidenceSession, type ProgressionEvidenceStartInputGuideId } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const guideArticleIds = new Set(GUIDE_CATEGORIES.flatMap((category) => category.articles.map((article) => article.id)));

function isProgressionGuideId(value: string): value is ProgressionEvidenceStartInputGuideId {
  return guideArticleIds.has(value);
}

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
  const requestedArticle = new URLSearchParams(window.location.search).get("article");
  const initialArticle = GUIDE_CATEGORIES.some((category) =>
    category.articles.some((article) => article.id === requestedArticle),
  ) ? requestedArticle : null;
  const [activeArticleId, setActiveArticleId] = useState<string | null>(initialArticle);
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


  const queryClient = useQueryClient();
  const startEvidence = useStartProgressionEvidence();
  const recordActivity = useRecordProgressionActivity();
  const { toast } = useToast();


  const [completedGuides, setCompletedGuides] = useState<Set<string>>(new Set());
  const isAlreadyCompleted = completedGuides.has(activeArticleId || "");

  const [evidenceSession, setEvidenceSession] = useState<ProgressionEvidenceSession | null>(null);

  useEffect(() => {
    if (activeArticleId && isProgressionGuideId(activeArticleId)) {
      setEvidenceSession(null);
      startEvidence.mutateAsync({
        data: {
          source: "guide_completion",
          guideId: activeArticleId
        }
      }).then(setEvidenceSession).catch(() => {});
    }
  }, [activeArticleId]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!evidenceSession) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [evidenceSession]);

  const isCompleteButtonDisabled = isAlreadyCompleted || !evidenceSession || recordActivity.isPending || (new Date(evidenceSession.minimumCompleteAt).getTime() > now);

  const handleRecordActivity = async () => {
    if (!evidenceSession) return;
    try {
      const res = await recordActivity.mutateAsync({
        data: {
          token: evidenceSession.token
        }
      });
      if (res.awarded) {
        queryClient.invalidateQueries({ queryKey: getGetProgressionSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProgressionCatalogQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProgressionHistoryQueryKey() });
        toast({ title: t.progression.guide_completed.replace("{xp}", String(res.xp)) });
      } else {
        // Just invalidate catalog to update state
        queryClient.invalidateQueries({ queryKey: getGetProgressionCatalogQueryKey() });
        if (res.reason === "duplicate") {
          setCompletedGuides(prev => new Set([...prev, activeArticleId!]));
          toast({ title: t.progression.guide_already_completed });
        } else if (res.reason === "cap_reached") {
          toast({ title: t.progression.guide_cap_reached });
        }
      }
    } catch {
      toast({ variant: "destructive", title: "Gagal menyimpan progres panduan" });
    }
  };

  const filteredCategories = useMemo(() => {
    const categories = selectedCategory
      ? GUIDE_CATEGORIES.filter((category) => category.id === selectedCategory)
      : GUIDE_CATEGORIES;
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLocaleLowerCase().trim();

    return categories.map(cat => {
      const catTitle = lang === "id" ? cat.title_id : cat.title_en;
      const matchCat = catTitle.toLowerCase().includes(q);

      const filteredArticles = cat.articles.filter(art => {
        const title = lang === "id" ? art.title_id : art.title_en;
        if (title.toLowerCase().includes(q)) return true;
        if (art.keywords.some((keyword) => keyword.toLocaleLowerCase().includes(q))) return true;

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeArticleId) {
      params.set("article", activeArticleId);
      const category = GUIDE_CATEGORIES.find((cat) =>
        cat.articles.some((article) => article.id === activeArticleId),
      );
      if (category) params.set("category", category.id);
    } else {
      params.delete("article");
    }
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [activeArticleId]);

  const openArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    document.querySelector("[data-testid='app-scroll-container']")?.scrollTo({ top: 0 });
  };

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4 md:max-w-3xl md:mx-auto lg:max-w-none">
        {!activeArticle ? (
          <>
            <div className="mb-2">
              <div>
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
              {activeArticle.article.relatedArticleId && (
                <button
                  type="button"
                  onClick={() => openArticle(activeArticle.article.relatedArticleId!)}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                >
                  {lang === "id" ? "Baca pembahasan lengkap" : "Read the full topic"}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              <div className="pt-8 flex justify-center border-t border-border mt-8">
                <button
                  type="button"
                  onClick={() => handleRecordActivity()}
                  disabled={isCompleteButtonDisabled}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/20 hover:border-primary disabled:opacity-50"
                  data-testid="button-mark-guide-complete"
                >
                  {isAlreadyCompleted ? t.progression.guide_already_completed : t.progression.mark_complete}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
