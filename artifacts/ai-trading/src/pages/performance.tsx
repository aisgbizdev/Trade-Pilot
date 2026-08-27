import { useState } from "react";
import { Link } from "wouter";
import {
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import {
  useGetPerformanceSummary,
  getGetPerformanceSummaryQueryKey,
  type PerformanceSummary,
  type PerformanceSegment,
  type PerformanceBucket,
  type PerformanceBanner,
} from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type WindowDays = 30 | 90;

function fmtPct(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

function fmtDeltaPp(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const pp = Math.round(Math.abs(value) * 100);
  return `${pp}pp`;
}

function fmtDate(iso: string | null, lang: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function HitBar({ wins, losses, expired }: { wins: number; losses: number; expired: number }) {
  const total = wins + losses + expired;
  if (total === 0) {
    return <div className="h-2 rounded-full bg-muted" aria-hidden />;
  }
  const w = (wins / total) * 100;
  const l = (losses / total) * 100;
  const e = (expired / total) * 100;
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden flex" aria-hidden>
      {w > 0 && <div className="bg-emerald-500" style={{ width: `${w}%` }} />}
      {l > 0 && <div className="bg-red-500" style={{ width: `${l}%` }} />}
      {e > 0 && <div className="bg-muted-foreground/40" style={{ width: `${e}%` }} />}
    </div>
  );
}

function Banner({
  banner,
  bannerNeed,
  t,
}: {
  banner: PerformanceBanner;
  bannerNeed: number;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const tp = t.performance;
  const thin =
    banner.recentHitRate == null ||
    banner.baselineHitRate == null;
  const replace = (s: string) =>
    s
      .replace("{recent}", String(banner.recentDays))
      .replace("{need}", String(bannerNeed))
      .replace("{delta}", fmtDeltaPp(banner.delta));
  let title = tp.banner_ok_title;
  let body = replace(tp.banner_ok_body);
  let Icon = CheckCircle2;
  let color = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
  if (thin) {
    title = tp.banner_thin_title;
    body = replace(tp.banner_thin_body);
    Icon = Info;
    color = "border-muted-foreground/30 bg-muted/40 text-foreground";
  } else if (banner.severity === "warn") {
    title = tp.banner_warn_title;
    body = replace(tp.banner_warn_body);
    Icon = AlertTriangle;
    color = "border-red-500/40 bg-red-500/10 text-red-300";
  } else if (banner.severity === "watch") {
    title = tp.banner_watch_title;
    body = replace(tp.banner_watch_body);
    Icon = AlertTriangle;
    color = "border-amber-500/40 bg-amber-500/10 text-amber-300";
  }
  return (
    <Card
      className={cn("p-4 border", color)}
      data-testid={`performance-banner-${thin ? "thin" : banner.severity}`}
    >
      <div className="flex gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-sm font-semibold leading-snug">{title}</h2>
          <p className="text-[12px] leading-snug text-foreground/80">{body}</p>
        </div>
      </div>
    </Card>
  );
}

type SegKind = "instrument" | "session" | "condition" | "volatility" | "news";

function bucketLabel(segKind: SegKind, key: string, t: ReturnType<typeof useTranslation>["t"]): string {
  const tp = t.performance;
  if (segKind === "session") {
    if (key === "asia") return tp.session_asia;
    if (key === "london") return tp.session_london;
    if (key === "newyork") return tp.session_newyork;
    return tp.session_off;
  }
  if (segKind === "condition") {
    if (key === "trending_up") return tp.condition_trending_up;
    if (key === "trending_down") return tp.condition_trending_down;
    if (key === "ranging") return tp.condition_ranging;
    return tp.condition_volatile;
  }
  if (segKind === "volatility") {
    if (key === "trending") return tp.volatility_trending;
    if (key === "ranging") return tp.volatility_ranging;
    return tp.volatility_choppy;
  }
  if (segKind === "news") {
    if (key === "news_week") return tp.news_news_week;
    return tp.news_quiet_week;
  }
  return key;
}

function SegmentCard({
  kind,
  icon,
  title,
  seg,
  t,
}: {
  kind: SegKind;
  icon: React.ReactNode;
  title: string;
  seg: PerformanceSegment;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const tp = t.performance;
  return (
    <Card className="p-4 space-y-3" data-testid={`performance-segment-${kind}`}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {seg.gated ? (
        <p className="text-[12px] text-muted-foreground leading-snug">
          {tp.seg_gated
            .replace("{need}", String(seg.need))
            .replace("{have}", String(seg.have))}
        </p>
      ) : (
        <ul className="space-y-3">
          {seg.buckets.map((b: PerformanceBucket) => (
            <li key={b.key} className="space-y-1.5" data-testid={`bucket-${kind}-${b.key}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium text-foreground truncate">
                  {bucketLabel(kind, b.key, t)}
                </span>
                <span className="text-[13px] font-semibold text-foreground tabular-nums">
                  {fmtPct(b.hitRate)}
                </span>
              </div>
              <HitBar wins={b.wins} losses={b.losses} expired={b.expired} />
              <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                <span>
                  {tp.bucket_triggered.replace("{n}", String(b.triggered))} ·{" "}
                  {tp.bucket_breakdown
                    .replace("{wins}", String(b.wins))
                    .replace("{losses}", String(b.losses))
                    .replace("{expired}", String(b.expired))}
                </span>
                <span className="tabular-nums">
                  {tp.overall_win_rate}: {fmtPct(b.winRate)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function PerformancePage() {
  const { t, lang } = useTranslation();
  const tp = t.performance;
  const [windowDays, setWindowDays] = useState<WindowDays>(30);
  const { data, isLoading, isError } = useGetPerformanceSummary(
    { window: windowDays },
    { query: { queryKey: getGetPerformanceSummaryQueryKey({ window: windowDays }) } },
  );
  const summary = data as PerformanceSummary | undefined;

  return (
    <Layout>
      <main className="flex-1 px-4 pt-3 pb-24 space-y-3 md:max-w-3xl md:mx-auto lg:max-w-none" data-testid="page-performance">
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground leading-tight">{tp.title}</h1>
          </div>
          <p className="text-[12px] text-muted-foreground leading-snug">{tp.subtitle}</p>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div
              role="tablist"
              aria-label={tp.title}
              className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5"
              data-testid="performance-window-tabs"
            >
              {([30, 90] as const).map((w) => {
                const active = windowDays === w;
                return (
                  <button
                    key={w}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setWindowDays(w)}
                    data-testid={`performance-window-${w}`}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {w === 30 ? tp.window_30 : tp.window_90}
                  </button>
                );
              })}
            </div>
            <Link
              href="/performance/methodology"
              className="inline-flex items-center gap-1 text-[12px] text-primary font-medium"
              data-testid="link-performance-methodology"
            >
              {tp.methodology_link}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <Card className="p-4 border-destructive/40">
            <p className="text-sm text-destructive">{t.common.error}</p>
          </Card>
        )}

        {summary && summary.overall.total < summary.minSamples.overall && (
          <Card className="p-4 space-y-2" data-testid="performance-empty">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">{tp.no_data_title}</h2>
            </div>
            <p className="text-[12px] text-muted-foreground leading-snug">
              {tp.no_data_body
                .replace("{need}", String(summary.minSamples.overall))
                .replace("{have}", String(summary.overall.total))}
            </p>
          </Card>
        )}

        {summary && summary.overall.total >= summary.minSamples.overall && (
          <>
            <Banner banner={summary.banner} bannerNeed={summary.minSamples.banner} t={t} />

            <Card className="p-4 space-y-3" data-testid="performance-overall">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {tp.overall_title.replace("{days}", String(summary.windowDays))}
                </h2>
                <span className="text-[10px] text-muted-foreground">
                  {tp.overall_total.replace("{n}", String(summary.overall.total))}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">{tp.overall_win_rate}</p>
                  <p className="text-2xl font-bold text-emerald-400 tabular-nums" data-testid="overall-win-rate">
                    {fmtPct(summary.overall.winRate)}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {tp.overall_win_rate_explain}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">{tp.overall_hit_rate}</p>
                  <p className="text-2xl font-bold text-foreground tabular-nums" data-testid="overall-hit-rate">
                    {fmtPct(summary.overall.hitRate)}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {tp.overall_hit_rate_explain}
                  </p>
                </div>
              </div>
              <HitBar
                wins={summary.overall.wins}
                losses={summary.overall.losses}
                expired={summary.overall.expired}
              />
              <p className="text-[10px] text-muted-foreground tabular-nums">
                {tp.overall_breakdown
                  .replace("{wins}", String(summary.overall.wins))
                  .replace("{losses}", String(summary.overall.losses))
                  .replace("{expired}", String(summary.overall.expired))}
                {summary.windowStart && (
                  <>
                    {" · "}
                    {tp.window_started.replace("{date}", fmtDate(summary.windowStart, lang))}
                  </>
                )}
              </p>
            </Card>

            <SegmentCard
              kind="instrument"
              icon={<TrendingUp className="w-4 h-4 text-primary" />}
              title={tp.seg_instrument_title}
              seg={summary.byInstrument}
              t={t}
            />
            <SegmentCard
              kind="session"
              icon={<Clock className="w-4 h-4 text-primary" />}
              title={tp.seg_session_title}
              seg={summary.bySession}
              t={t}
            />
            <SegmentCard
              kind="condition"
              icon={<Calendar className="w-4 h-4 text-primary" />}
              title={tp.seg_condition_title}
              seg={summary.byCondition}
              t={t}
            />
            <SegmentCard
              kind="volatility"
              icon={<Activity className="w-4 h-4 text-primary" />}
              title={tp.seg_volatility_title}
              seg={summary.byVolatility}
              t={t}
            />
            <SegmentCard
              kind="news"
              icon={<AlertTriangle className="w-4 h-4 text-primary" />}
              title={tp.seg_news_title}
              seg={summary.byNewsActivity}
              t={t}
            />
          </>
        )}
      </main>
    </Layout>
  );
}

export function PerformanceMethodologyPage() {
  const { t } = useTranslation();
  const tp = t.performance;
  // Pull live thresholds from the API so the methodology copy can never
  // drift from the actual gates the server enforces. Fall back to current
  // documented defaults only while the request is in flight.
  const { data } = useGetPerformanceSummary({ window: 30 });
  const min = (data as PerformanceSummary | undefined)?.minSamples ?? {
    bucket: 10,
    overall: 20,
    banner: 15,
  };
  const sections: Array<{ title: string; body: string }> = [
    { title: tp.methodology_section_what_counts, body: tp.methodology_what_counts_body },
    { title: tp.methodology_section_rates, body: tp.methodology_rates_body },
    { title: tp.methodology_section_segments, body: tp.methodology_segments_body.replace("{bucket}", String(min.bucket)) },
    { title: tp.methodology_section_banner, body: tp.methodology_banner_body.replace("{banner}", String(min.banner)) },
    { title: tp.methodology_section_excluded, body: tp.methodology_excluded_body },
  ];
  return (
    <Layout>
      <main className="flex-1 px-4 pt-3 pb-24 space-y-4 md:max-w-3xl md:mx-auto lg:max-w-none" data-testid="page-performance-methodology">
        <Link
          href="/performance"
          className="inline-flex items-center gap-1 text-[12px] text-muted-foreground"
          data-testid="link-back-to-performance"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {tp.title}
        </Link>
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">{tp.methodology_title}</h1>
          <p className="text-[12px] text-muted-foreground leading-snug">{tp.methodology_intro}</p>
        </header>
        <div className="space-y-3">
          {sections.map((s) => (
            <Card key={s.title} className="p-4 space-y-1.5">
              <h2 className="text-sm font-semibold text-foreground">{s.title}</h2>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{s.body}</p>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
