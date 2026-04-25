import { useState } from "react";
import { Link } from "wouter";
import { BarChart3, Users, Loader2, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import {
  useGetAdminStats,
  getGetAdminStatsQueryKey,
  useGetAllAnalyses,
  getGetAllAnalysesQueryKey,
  type AnalysesList,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const MARKET_CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  trending_up: { label: "Tren Naik", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  trending_down: { label: "Tren Turun", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ranging: { label: "Sideways", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  volatile: { label: "Volatil", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

function AdminContent() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: statsData, isLoading: statsLoading } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey() },
  });

  const { data: analysesData, isLoading: analysesLoading } = useGetAllAnalyses(
    { page, limit },
    { query: { queryKey: getGetAllAnalysesQueryKey({ page, limit }) } }
  );

  const stats = statsData;
  const analyses = (analysesData as AnalysesList | undefined)?.analyses ?? [];
  const total = (analysesData as AnalysesList | undefined)?.total ?? 0;
  const hasMore = page * limit < total;

  return (
    <Layout>
      <div className="px-4 py-5 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/profile")}
            className="p-2 rounded-lg hover:bg-muted"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard Admin</h1>
            <p className="text-xs text-muted-foreground">Monitoring seluruh analisis</p>
          </div>
        </div>

        {statsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total User", value: stats?.totalUsers ?? 0 },
                { label: "Total Analisis", value: stats?.total ?? 0 },
                { label: "Hari Ini", value: stats?.today ?? 0 },
                { label: "Bulan Ini", value: stats?.thisMonth ?? 0 },
              ].map(({ label, value }) => (
                <Card key={label} className="p-3 text-center">
                  <div className="text-2xl font-bold text-primary" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
                    {value}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
                </Card>
              ))}
            </div>

            {stats?.instrumentBreakdown?.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Instrumen Terpopuler</h3>
                <div className="space-y-2">
                  {stats?.instrumentBreakdown?.slice(0, 5).map((item) => (
                    <div key={item.instrument} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.instrument}</span>
                      <Badge variant="secondary" className="text-xs">{item.count}x</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {stats?.modeBreakdown && Object.keys(stats.modeBreakdown).length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Breakdown Mode</h3>
                <div className="space-y-2">
                  {Object.entries(stats?.modeBreakdown ?? {}).map(([mode, count]) => (
                    <div key={mode} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">
                        {mode === "beginner" ? "Pemula" : "Pro"}
                      </span>
                      <Badge variant="secondary" className="text-xs">{count}x</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Semua Analisis</h2>

          {analysesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {analyses.map((a) => {
                const mc = MARKET_CONDITION_LABELS[a.marketCondition];
                return (
                  <Card key={a.id} className="p-3" data-testid={`card-analysis-${a.id}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">{a.instrument}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{a.timeframe}</Badge>
                          <Badge className={cn("text-[10px] px-1.5 py-0 border-0", mc?.color)}>{mc?.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.userEmail} • {a.mode === "beginner" ? "Pemula" : "Pro"}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {format(new Date(a.createdAt), "d MMM", { locale: idLocale })}
                      </span>
                    </div>
                  </Card>
                );
              })}
              {hasMore && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setPage((p) => p + 1)}
                  data-testid="button-load-more"
                >
                  Muat Lebih Banyak
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}
