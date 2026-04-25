import { Link, useLocation } from "wouter";
import { TrendingUp, Plus, Clock, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import { OnboardingModal } from "@/components/onboarding-modal";
import {
  useGetAnalysesSummary,
  getGetAnalysesSummaryQueryKey,
  useGetRecentInstruments,
  getGetRecentInstrumentsQueryKey,
  useListAnalyses,
  getListAnalysesQueryKey,
  useUpdateProfile,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

function isValid(validUntil: string | Date) {
  return new Date(validUntil) > new Date();
}

const MARKET_CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  trending_up: { label: "Tren Naik", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  trending_down: { label: "Tren Turun", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ranging: { label: "Sideways", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  volatile: { label: "Volatil", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();
  const [, setLocation] = useLocation();

  const { data: summary, isLoading: summaryLoading } = useGetAnalysesSummary({
    query: { queryKey: getGetAnalysesSummaryQueryKey() },
  });

  const { data: recentInstruments } = useGetRecentInstruments({
    query: { queryKey: getGetRecentInstrumentsQueryKey() },
  });

  const { data: listData, isLoading: listLoading } = useListAnalyses(
    { page: 1, limit: 5 },
    { query: { queryKey: getListAnalysesQueryKey({ page: 1, limit: 5 }) } }
  );

  const handleModeToggle = async (mode: "beginner" | "pro") => {
    await updateProfile.mutateAsync({ data: { selectedMode: mode } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  const summaryData = summary as any;
  const instrumentsData = recentInstruments as any;
  const analyses = (listData as any)?.analyses ?? [];

  return (
    <Layout>
      <OnboardingModal open={!!user && !user.onboardingCompleted} />

      <div className="px-4 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Selamat datang kembali</p>
            <h1 className="text-xl font-bold text-foreground" data-testid="text-display-name">
              {user?.displayName}
            </h1>
          </div>
          <Button
            size="sm"
            onClick={() => setLocation("/analyze")}
            className="gap-1.5"
            data-testid="button-new-analysis"
          >
            <Plus className="w-4 h-4" />
            Analisis
          </Button>
        </div>

        <div className="flex gap-2">
          {(["beginner", "pro"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeToggle(mode)}
              data-testid={`button-mode-${mode}`}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                user?.selectedMode === mode
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {mode === "beginner" ? "Pemula" : "Pro"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Analisis", value: summaryLoading ? "..." : (summaryData?.total ?? 0) },
            { label: "Mode Pemula", value: summaryLoading ? "..." : (summaryData?.beginnerCount ?? 0) },
            { label: "Mode Pro", value: summaryLoading ? "..." : (summaryData?.proCount ?? 0) },
          ].map(({ label, value }) => (
            <Card key={label} className="p-3 text-center border-border">
              <div
                className="text-2xl font-bold text-primary"
                data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
            </Card>
          ))}
        </div>

        {instrumentsData?.instruments?.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">Terakhir Dianalisis</h2>
            <div className="flex gap-2 flex-wrap">
              {instrumentsData.instruments.map((inst: string) => (
                <Link key={inst} href={`/analyze?instrument=${inst}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-sm py-1 px-3"
                    data-testid={`badge-instrument-${inst}`}
                  >
                    {inst}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Analisis Terbaru</h2>
            <Link href="/history">
              <span className="text-xs text-primary hover:underline cursor-pointer" data-testid="link-view-history">
                Lihat semua
              </span>
            </Link>
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : analyses.length === 0 ? (
            <Card className="p-6 text-center border-dashed">
              <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">Belum ada analisis</p>
              <p className="text-xs text-muted-foreground mt-1">Mulai analisis pertama kamu</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setLocation("/analyze")}
                data-testid="button-start-first-analysis"
              >
                Mulai Analisis
              </Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {analyses.map((a: any) => {
                const valid = isValid(a.validUntil);
                const mc = MARKET_CONDITION_LABELS[a.marketCondition];
                return (
                  <Link key={a.id} href={`/analyses/${a.id}`}>
                    <Card
                      className="p-3 cursor-pointer hover:border-primary/40 transition-colors"
                      data-testid={`card-analysis-${a.id}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{a.instrument}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {a.timeframe}
                          </Badge>
                          <Badge
                            className={cn("text-[10px] px-1.5 py-0 border-0", mc?.color)}
                          >
                            {mc?.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {a.mode === "beginner" ? "Pemula" : "Pro"} •{" "}
                          {a.confidenceMin}–{a.confidenceMax}% keyakinan
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            valid ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                          )}
                          data-testid={`status-validity-${a.id}`}
                        >
                          {valid ? "Relevan" : "Kadaluarsa"}
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
