import { useState } from "react";
import { Link } from "wouter";
import { Clock, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import {
  useListAnalyses,
  getListAnalysesQueryKey,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

const MARKET_CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  trending_up: { label: "Tren Naik", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  trending_down: { label: "Tren Turun", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ranging: { label: "Sideways", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  volatile: { label: "Volatil", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useListAnalyses(
    { page, limit },
    { query: { queryKey: getListAnalysesQueryKey({ page, limit }) } }
  );

  const listData = data as any;
  const analyses = listData?.analyses ?? [];
  const total = listData?.total ?? 0;
  const hasMore = page * limit < total;

  return (
    <Layout>
      <div className="px-4 py-5">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-foreground">Riwayat Analisis</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {total > 0 ? `${total} analisis total` : "Belum ada analisis"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm font-medium text-foreground">Belum ada riwayat analisis</p>
            <p className="text-xs text-muted-foreground mt-1">
              Mulai analisis pertama kamu dari halaman Analisis
            </p>
            <Link href="/analyze">
              <Button variant="outline" size="sm" className="mt-4" data-testid="button-start-analysis">
                Mulai Analisis
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {analyses.map((a: any) => {
              const valid = new Date(a.validUntil) > new Date();
              const mc = MARKET_CONDITION_LABELS[a.marketCondition];
              return (
                <Link key={a.id} href={`/analyses/${a.id}`}>
                  <Card
                    className="p-3 cursor-pointer hover:border-primary/40 transition-colors"
                    data-testid={`card-analysis-${a.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{a.instrument}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {a.timeframe}
                          </Badge>
                          <Badge
                            className={cn("text-[10px] px-1.5 py-0 border-0", mc?.color)}
                          >
                            {mc?.label}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {a.mode === "beginner" ? "Pemula" : "Pro"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground">
                            {a.confidenceMin}–{a.confidenceMax}% keyakinan
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium flex items-center gap-1",
                              valid ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                            )}
                          >
                            <Clock className="w-3 h-3" />
                            {valid ? "Relevan" : "Kadaluarsa"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {format(new Date(a.createdAt), "d MMM", { locale: idLocale })}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}

            {hasMore && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => setPage((p) => p + 1)}
                data-testid="button-load-more"
              >
                Muat Lebih Banyak
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
