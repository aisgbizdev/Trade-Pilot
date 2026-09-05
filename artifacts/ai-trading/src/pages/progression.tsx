import { useMemo, useState } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  useGetProgressionSummary, 
  useGetProgressionCatalog, 
  useGetProgressionHistory,
  getGetProgressionSummaryQueryKey,
  getGetProgressionCatalogQueryKey,
  getGetProgressionHistoryQueryKey
} from "@workspace/api-client-react";
import { useTranslation, type Translations } from "@/lib/i18n";
import { ProgressionEmblem } from "@/components/progression/progression-emblem";
import { Loader2, ArrowLeft, Trophy, Calendar, Zap, Star, Shield, Lock, Unlock, History, Activity, BookOpen } from "lucide-react";
import { useLocation, Link } from "wouter";
import { format } from "date-fns";
import { enUS, id } from "date-fns/locale";

const CATALOG_KEYS = [
  "first_reflection", "journal_5", "journal_20", "journal_50",
  "evaluation_1", "evaluation_10", "evaluation_50",
  "checklist_1", "checklist_10", "checklist_50",
  "guide_1", "guide_5", "guide_10",
  "wait_1", "wait_10",
  "streak_3", "streak_7", "streak_30",
  "level_10", "level_25", "level_50", "level_75", "level_100",
  "mastery_1",
  "consistent_1000"
];

function getAchievementIcon(key: string) {
  if (key.startsWith("checklist") || key.startsWith("evaluation")) return Shield;
  if (key.startsWith("wait")) return Activity;
  if (key.startsWith("guide")) return BookOpen;
  if (key.startsWith("journal") || key === "first_reflection") return Star;
  if (key.startsWith("streak") || key === "consistent_1000") return Calendar;
  return Trophy;
}

function getRankName(slug: string, t: Translations): string {
  const normalized = slug.toLowerCase().replace(/_\d+$/, ""); // e.g. iron_1 -> iron
  const key = `rank_${normalized}` as keyof typeof t.progression;
  return t.progression[key] as string || slug;
}

function getSourceName(sourceSlug: string, t: Translations): string {
  const key = `reason_${sourceSlug}` as keyof typeof t.progression;
  return (t.progression as Record<string, string>)[key as string] || sourceSlug;
}

export default function ProgressionPage() {
  const { t, lang } = useTranslation();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "history">("overview");

  const { data: summary, isLoading: isLoadingSummary } = useGetProgressionSummary();
  const { data: catalog, isLoading: isLoadingCatalog } = useGetProgressionCatalog();
  const { data: history, isLoading: isLoadingHistory } = useGetProgressionHistory();

  const locale = lang === "id" ? id : enUS;

  if (isLoadingSummary || isLoadingCatalog || isLoadingHistory) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t.progression.loading}</p>
        </div>
      </Layout>
    );
  }

  if (!summary) {
    return (
      <Layout>
        <div className="p-4 text-center text-muted-foreground">{t.progression.error}</div>
      </Layout>
    );
  }

  const currentXp = summary.currentLevelXp;
  const nextXp = summary.nextLevelXp;
  const progressPercent = nextXp > currentXp 
    ? Math.min(100, Math.max(0, ((summary.totalXp - currentXp) / (nextXp - currentXp)) * 100)) 
    : 100;

  const unlockedCount = catalog?.achievements.filter(a => a.unlocked).length || 0;
  const totalCount = catalog?.achievements.length || 0;

  return (
    <Layout>
      <div className="px-4 py-5 space-y-6 md:max-w-3xl md:mx-auto lg:max-w-none">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/profile")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            data-testid="button-back-to-profile"
            aria-label="Back to Profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{t.progression.title}</h1>
            <p className="text-xs text-muted-foreground truncate">{t.progression.subtitle}</p>
          </div>
        </div>

        {/* Hero Card */}
        <Card className="p-6 progression-card flex flex-col md:flex-row items-center gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          
          <ProgressionEmblem level={summary.level} masteryLevel={summary.masteryLevel} className="w-32 h-32 md:w-40 md:h-40" />
          
          <div className="flex-1 space-y-3 w-full text-center md:text-left z-10">
            <div>
              <h2 className="text-2xl font-black text-white progression-text-glow">
                {t.progression.rank.replace("{rank}", getRankName(summary.rank, t))}
              </h2>
              <p className="text-sm font-semibold text-primary/90 mt-1 uppercase tracking-widest">
                {summary.masteryLevel > 0 
                  ? t.progression.mastery_level.replace("{n}", String(summary.masteryLevel)) 
                  : t.progression.level.replace("{n}", String(summary.level))}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-medium text-white/80">
                <span>{summary.totalXp.toLocaleString()} XP</span>
                <span>{summary.nextLevelXp ? `${summary.nextLevelXp.toLocaleString()} XP` : t.progression.max_level_reached}</span>
              </div>
              <Progress value={progressPercent} className="h-2 progression-bar-bg" indicatorClassName="progression-bar-fill" />
              {summary.nextLevelXp && (
                <p className="text-[10px] text-white/60 text-right">
                  {t.progression.next_level.replace("{xp}", String(summary.nextLevelXp - summary.totalXp))}
                </p>
              )}
            </div>
            
            <div className="flex gap-4 justify-center md:justify-start pt-2">
              <div className="flex items-center gap-1.5 bg-black/40 rounded-lg px-3 py-1.5 border border-white/10">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[10px] text-white/60 uppercase">{t.progression.daily_streak}</p>
                  <p className="text-sm font-bold text-white leading-none">{summary.currentStreak}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 rounded-lg px-3 py-1.5 border border-white/10">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-[10px] text-white/60 uppercase">{t.progression.longest_streak.replace("{n}", "")}</p>
                  <p className="text-sm font-bold text-white leading-none">{summary.longestStreak}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none" role="tablist">
          {[
            { id: "overview", label: t.progression.title, icon: Activity },
            { id: "catalog", label: t.progression.achievements, icon: Trophy },
            { id: "history", label: t.progression.history, icon: History },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "overview" && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold">{t.progression.achievements}</h3>
                  <span className="ml-auto text-xs font-mono bg-muted px-2 py-0.5 rounded-full">{unlockedCount} / {totalCount}</span>
                </div>
                
                <div className="space-y-3">
                  {catalog?.achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => {
                    const icon = getAchievementIcon(achievement.key);
                    const titleKey = `catalog_${achievement.key}` as keyof typeof t.progression;
                    const descKey = `catalog_${achievement.key}_desc` as keyof typeof t.progression;
                    const title = t.progression[titleKey] || achievement.key;
                    const desc = t.progression[descKey] || "";
                    const IconComponent = icon;

                    return (
                      <div key={achievement.key} className="flex gap-3 items-center p-2 rounded-lg bg-muted/30 border border-border/50">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{title}</p>
                          <p className="text-xs text-muted-foreground truncate">{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                  {unlockedCount === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">{t.progression.no_achievements_yet}</p>
                  )}
                  {unlockedCount > 3 && (
                    <button 
                      onClick={() => setActiveTab("catalog")}
                      className="w-full text-xs font-semibold text-primary py-2 hover:underline"
                    >
                      {t.progression.view_details}
                    </button>
                  )}
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <History className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold">{t.progression.history}</h3>
                </div>
                
                <div className="space-y-3">
                  {history?.entries.slice(0, 5).map(entry => (
                    <div key={entry.id} className="flex gap-3 items-center p-2 rounded-lg bg-muted/10 border border-transparent hover:border-border/50">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+{entry.xp}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {t.progression.activity_awarded.replace("{xp}", String(entry.xp)).replace("{reason}", getSourceName(entry.source, t))}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {format(new Date(entry.createdAt), "dd MMM yyyy • HH:mm", { locale })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {!history?.entries.length && (
                    <p className="text-xs text-muted-foreground text-center py-4">{t.progression.no_activity_yet}</p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "catalog" && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CATALOG_KEYS.map(key => {
                const achievement = catalog?.achievements.find(a => a.key === key);
                const unlocked = achievement?.unlocked;
                const icon = getAchievementIcon(key);
                const titleKey = `catalog_${key}` as keyof typeof t.progression;
                const descKey = `catalog_${key}_desc` as keyof typeof t.progression;
                const title = t.progression[titleKey] || key;
                const desc = t.progression[descKey] || "";
                const IconComponent = icon;

                return (
                  <Card 
                    key={key} 
                    className={`p-4 flex gap-3 ${unlocked ? "border-primary/30 bg-primary/[0.02]" : "opacity-70 bg-muted/30"}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {unlocked ? <IconComponent className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
                      {unlocked ? (
                        <p className="text-[10px] font-medium text-primary mt-2 flex items-center gap-1">
                          <Unlock className="w-3 h-3" />
                          {t.progression.unlocked_at.replace("{date}", format(new Date(achievement!.unlockedAt!), "dd MMM yyyy", { locale }))}
                        </p>
                      ) : (
                        <p className="text-[10px] font-medium text-muted-foreground mt-2 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          {t.progression.locked}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === "history" && (
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-border">
                {history?.entries.map(entry => (
                  <div key={entry.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{entry.xp}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {t.progression.activity_awarded.replace("{xp}", String(entry.xp)).replace("{reason}", getSourceName(entry.source, t))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(entry.createdAt), "dd MMM yyyy • HH:mm", { locale })}
                      </p>
                    </div>
                  </div>
                ))}
                {!history?.entries.length && (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    {t.progression.no_activity_yet}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
