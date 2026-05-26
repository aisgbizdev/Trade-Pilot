import { Loader2, Sunrise, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetDailySummary,
  getGetDailySummaryQueryKey,
} from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";

function biasIcon(bias: string | null | undefined) {
  if (!bias) return <Minus className="w-3.5 h-3.5" />;
  if (bias.startsWith("bullish")) return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
  if (bias.startsWith("bearish")) return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

export default function DailySummaryPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetDailySummary({
    query: { queryKey: getGetDailySummaryQueryKey() },
  });

  return (
    <Layout>
      <div className="px-4 py-5">
        <div className="flex items-center gap-2 mb-1">
          <Sunrise className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">{t.daily_summary.page_title}</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-5">{t.daily_summary.page_subtitle}</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !data?.today ? (
          <Card className="p-6 text-center">
            <Sunrise className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {t.daily_summary.no_digest_yet}
            </p>
            <Link href="/notifications">
              <a className="inline-block mt-4 text-xs text-primary hover:underline">
                {t.daily_summary.section_title} →
              </a>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs text-muted-foreground">
                  {data.today.digestDate}
                </p>
                {data.today.kind === "quota_only" && (
                  <Badge variant="outline" className="text-[10px]">
                    {t.daily_summary.quota_only_badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{data.today.summary}</p>
            </Card>

            {data.today.analyses.map((a) => (
              <Card key={a.id} className="p-4" data-testid={`card-digest-analysis-${a.id}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {biasIcon(a.tradingBias)}
                    <p className="text-sm font-semibold text-foreground">{a.instrument}</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {a.timeframe}
                    </Badge>
                  </div>
                  {a.confidenceMin != null && a.confidenceMax != null && (
                    <span className="text-[10px] text-muted-foreground">
                      {a.confidenceMin}-{a.confidenceMax}%
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                  {a.tradingBias && (
                    <span>
                      {t.daily_summary.bias_label}:{" "}
                      <span className="text-foreground">{a.tradingBias}</span>
                    </span>
                  )}
                  {a.preferredSide && (
                    <span>
                      {t.daily_summary.side_label}:{" "}
                      <span className="text-foreground">{a.preferredSide}</span>
                    </span>
                  )}
                </div>
                {a.mainScenario && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                    {a.mainScenario}
                  </p>
                )}
                <Link href={`/analyses/${a.id}`}>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    data-testid={`button-open-digest-analysis-${a.id}`}
                  >
                    {t.daily_summary.open_analysis} →
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
