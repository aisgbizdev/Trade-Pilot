import { useState, useMemo, useEffect } from "react";
import { Brain, ChevronLeft, Search, BookOpen, ChevronRight, X, Sparkles } from "lucide-react";
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
const QUICK_START_IDS = ["analysis-workflow", "history-performance", "adaptive-position-plan"] as const;

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
  // When the reader arrived from a "Pelajari" link on an analysis card, this
  // holds the path back to that analysis session. Only accept same-origin
  // absolute paths. Cleared once the reader navigates around inside the guide.
  const rawReturn = new URLSearchParams(window.location.search).get("return");
  const initialReturnTo =
    rawReturn && rawReturn.startsWith("/") && !rawReturn.startsWith("//")
      ? rawReturn
      : null;
  const [returnTo, setReturnTo] = useState<string | null>(initialReturnTo);

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

  const quickStartArticles = useMemo(
    () =>
      QUICK_START_IDS.flatMap((articleId) => {
        for (const category of GUIDE_CATEGORIES) {
          const article = category.articles.find((item) => item.id === articleId);
          if (article) return [{ article, category }];
        }
        return [];
      }),
    [],
  );

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get("article");
      const categoryId = params.get("category");

      setActiveArticleId(
        articleId && isProgressionGuideId(articleId) ? articleId : null,
      );
      setSelectedCategory(
        categoryId && GUIDE_CATEGORIES.some((category) => category.id === categoryId)
          ? categoryId
          : null,
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateGuideUrl = (
    articleId: string | null,
    categoryId: string | null,
    mode: "push" | "replace",
  ) => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    if (articleId) params.set("article", articleId);
    const query = params.toString();
    window.history[`${mode}State`](null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  };

  // Drop the one-shot `return` param from the URL once we've captured it, so
  // it doesn't linger on refresh or leak into shared links. Browser history
  // still has the analysis page as the previous entry for the back button.
  useEffect(() => {
    if (initialReturnTo) {
      updateGuideUrl(initialArticle, initialCategory, "replace");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openArticle = (articleId: string) => {
    const category = GUIDE_CATEGORIES.find((cat) =>
      cat.articles.some((article) => article.id === articleId),
    );
    const categoryId = category?.id ?? selectedCategory;
    setReturnTo(null);
    updateGuideUrl(articleId, categoryId, "push");
    setActiveArticleId(articleId);
    setSelectedCategory(categoryId);
    document.querySelector("[data-testid='app-scroll-container']")?.scrollTo({ top: 0 });
  };

  const showGuideList = () => {
    setReturnTo(null);
    updateGuideUrl(null, selectedCategory, "push");
    setActiveArticleId(null);
  };

  const handleArticleBack = () => {
    if (returnTo) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = returnTo;
      }
      return;
    }
    showGuideList();
  };

  const selectCategory = (categoryId: string | null) => {
    updateGuideUrl(null, categoryId, "replace");
    setSelectedCategory(categoryId);
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

            {!searchQuery.trim() && selectedCategory === null && (
              <section className="space-y-2" aria-labelledby="guide-quick-start-title">
                <div className="flex items-end justify-between gap-3 px-1">
                  <div>
                    <h2 id="guide-quick-start-title" className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                      {t.guide.quick_start}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">{t.guide.quick_start_hint}</p>
                  </div>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {quickStartArticles.map(({ article, category }, index) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => openArticle(article.id)}
                      className="group flex min-h-20 items-start gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/[0.03]"
                      data-testid={`guide-quick-start-${article.id}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {lang === "id" ? category.title_id : category.title_en}
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold leading-snug text-foreground">
                          {lang === "id" ? article.title_id : article.title_en}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="relative -mx-4">
              <div className="flex gap-2 overflow-x-auto pb-1 px-4 pr-12 scrollbar-none" aria-label={t.guide.table_of_contents}>
                <button
                  type="button"
                  onClick={() => selectCategory(null)}
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
                    onClick={() => selectCategory(category.id)}
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
              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-end bg-gradient-to-l from-background via-background/90 to-transparent pr-2 md:hidden"
                aria-hidden="true"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="px-4 pt-1 text-[10px] text-muted-foreground md:hidden">
                {t.guide.browse_categories}
              </p>
            </div>

            {!searchQuery.trim() && selectedCategory === null && (
              <button
                type="button"
                onClick={() => selectCategory("psychology")}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card/70 p-3 text-left transition-colors hover:border-primary/40 hover:bg-card"
                data-testid="guide-psychology-spotlight"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Brain className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{t.guide.psychology_title}</span>
                  <span className="block text-[11px] leading-relaxed text-muted-foreground">{t.guide.psychology_hint}</span>
                </span>
                <span className="hidden text-xs font-semibold text-primary sm:block">{t.guide.psychology_action}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            )}

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
              onClick={handleArticleBack}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              data-testid="button-guide-back-to-list"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
               {returnTo ? t.guide.back_to_analysis : t.guide.back_to_guide}
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
