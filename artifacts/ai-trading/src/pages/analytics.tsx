import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3, Loader2, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { useLocation } from "wouter";
import {
  useGetPersonalAnalytics,
  getGetPersonalAnalyticsQueryKey,
  type GetPersonalAnalyticsParams,
  type PersonalAnalytics,
} from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";

type AnalyticsRange = NonNullable<GetPersonalAnalyticsParams["range"]>;

function AccuracyGauge({ value }: { value: number }) {
  const clamp = Math.max(0, Math.min(100, value));
  const radius = 28;
  const strokeWidth = 6;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clamp / 100);
  const color = clamp >= 60 ? "#22c55e" : clamp >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center" data-testid="accuracy-gauge">
      <svg width="72" height="40" viewBox="0 0 72 40">
        <path
          d={`M 6 36 A ${radius} ${radius} 0 0 1 66 36`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={`M 6 36 A ${radius} ${radius} 0 0 1 66 36`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <p className="text-base font-bold text-foreground -mt-3" data-testid="text-accuracy-rate" style={{ color }}>
        {clamp}%
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [range, setRange] = useState<AnalyticsRange>("weekly");
  const { data, isLoading } = useGetPersonalAnalytics(
    { range },
    { query: { queryKey: getGetPersonalAnalyticsQueryKey({ range }) } },
  );

  const analytics = data as PersonalAnalytics | undefined;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!analytics || analytics.totalAllTime === 0) {
    return (
      <Layout>
        <div className="px-4 py-5">
          <h1 className="text-xl font-bold text-foreground mb-1">{t.analytics.title}</h1>
          <p className="text-xs text-muted-foreground mb-8">{t.analytics.subtitle}</p>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm font-medium text-foreground">{t.analytics.no_data_title}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.analytics.no_data_subtitle}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setLocation("/analyze")}
              data-testid="button-start-analysis"
            >
              {t.analytics.start_analysis}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-5 space-y-5 md:px-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-5 md:items-start">
        <div className="md:col-span-2">
          <h1 className="text-xl font-bold text-foreground">{t.analytics.title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t.analytics.subtitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:col-span-2">
          {[
            { label: t.analytics.all_time, value: analytics.totalAllTime },
            { label: t.analytics.this_month, value: analytics.totalThisMonth },
            { label: t.analytics.this_week, value: analytics.totalThisWeek },
          ].map(({ label, value }) => (
            <Card key={label} className="p-3 text-center">
              <div className="text-2xl font-bold text-primary" data-testid={`stat-${label}`}>
                {value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
            </Card>
          ))}
        </div>

        {analytics.topInstruments?.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t.analytics.top_instruments}</h3>
            <div className="space-y-2">
              {analytics.topInstruments.map((item, i) => (
                <div key={item.instrument} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                    <span className="text-sm font-medium text-foreground" data-testid={`text-instrument-${i}`}>
                      {item.instrument}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{item.count}x</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <h3 className="text-xs text-muted-foreground mb-1">{t.analytics.dominant_mode}</h3>
            <p className="text-base font-bold text-foreground capitalize" data-testid="text-dominant-mode">
              {analytics.dominantMode === "beginner" ? t.common.beginner : t.common.pro}
            </p>
          </Card>

          <Card className="p-4 flex flex-col items-center">
            <div className="flex items-center gap-1 mb-2 self-start">
              <h3 className="text-xs text-muted-foreground">{t.analytics.self_accuracy}</h3>
              <Info className="w-3 h-3 text-muted-foreground" />
            </div>
            {analytics.accuracyRate !== null && analytics.accuracyRate !== undefined ? (
              <>
                <AccuracyGauge value={analytics.accuracyRate} />
                <p className="text-[10px] text-muted-foreground mt-1 text-center">
                  {t.analytics.based_on_feedback?.replace("{n}", String(analytics.feedbackCount ?? 0)) ?? `Based on ${analytics.feedbackCount ?? 0} feedback`}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground mt-4">{t.analytics.no_data_yet}</p>
            )}
          </Card>
        </div>

        {analytics.accuracyRate !== null && analytics.accuracyRate !== undefined && (
          <Card className="p-3 bg-muted/50 border-dashed lg:col-span-2">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.analytics.accuracy_note}
              </p>
            </div>
          </Card>
        )}

        {analytics.weeklyData?.length > 0 && (
          <Card className="p-4 md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold text-foreground">{t.analytics.weekly_chart}</h3>
              <div
                role="tablist"
                aria-label={t.analytics.weekly_chart}
                className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5"
                data-testid="analytics-range-tabs"
              >
                {(["daily", "weekly", "monthly"] as const).map((key) => {
                  const active = range === key;
                  const label =
                    key === "daily"
                      ? t.analytics.range_daily
                      : key === "weekly"
                        ? t.analytics.range_weekly
                        : t.analytics.range_monthly;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setRange(key)}
                      data-testid={`analytics-range-${key}`}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        active
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={analytics.weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value, t.analytics.analyses_label]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {analytics.weeklyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === analytics.weeklyData.length - 1 ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </Layout>
  );
}
