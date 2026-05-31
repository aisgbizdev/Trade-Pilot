import { Link } from "wouter";
import {
  Sparkles,
  Clock,
  TrendingUp,
  TrendingDown,
  Repeat,
  Target,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { useGetTraderMirrorInsights } from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Stat = {
  key: string;
  total: number;
  wins: number;
  winRate: number;
  avgPnlPercent: number | null;
};

type GatedBlock = {
  gated: boolean;
  reason?: string | null;
  need?: number | null;
  have?: number | null;
  data?: Record<string, unknown> | null;
};

export default function MirrorPage() {
  const { t, lang } = useTranslation();
  const tm = t.mirror;
  const { data, isLoading, isError } = useGetTraderMirrorInsights();

  return (
    <Layout>
      <main className="flex-1 px-4 pt-3 pb-24 md:px-6 lg:pb-8 space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 md:items-start" data-testid="page-mirror">
        <header className="space-y-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground leading-tight">
              {tm.title}
            </h1>
          </div>
          <p className="text-[12px] text-muted-foreground leading-snug">
            {tm.subtitle}
          </p>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center py-16 md:col-span-2">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <Card className="p-4 border-destructive/40 md:col-span-2">
            <p className="text-sm text-destructive">{tm.load_failed}</p>
          </Card>
        )}

        {data && data.insights.overallGated && (
          <Card className="p-5 space-y-3 md:col-span-2" data-testid="card-mirror-empty">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                {tm.empty_title}
              </h2>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {tm.empty_body
                .replace("{have}", String(data.insights.totalResolved))
                .replace("{need}", String(data.insights.sessions.need ?? 5))}
            </p>
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              data-testid="link-mirror-to-journal"
            >
              {tm.go_to_journal}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>
        )}

        {data && !data.insights.overallGated && (
          <>
            {data.highlights.length > 0 && (
              <Card
                className="p-4 space-y-2 bg-gradient-to-br from-primary/10 to-transparent border-primary/30 md:col-span-2"
                data-testid="card-mirror-highlights"
              >
                <h2 className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                  {tm.highlights}
                </h2>
                <ul className="space-y-1.5">
                  {data.highlights.slice(0, 5).map((h) => (
                    <li
                      key={h.id}
                      className="text-[13px] text-foreground leading-snug flex gap-2"
                      data-testid={`mirror-highlight-${h.id}`}
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span>{lang === "id" ? h.idText : h.en}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <CategoryCard
              icon={<Clock className="w-4 h-4" />}
              title={tm.sessions_title}
              subtitle={tm.sessions_subtitle}
              block={data.insights.sessions as GatedBlock}
              renderBest={(s) => keyLabel(s.key, "session", tm)}
              tm={tm}
              dataTestId="card-mirror-sessions"
            />

            <CategoryCard
              icon={<TrendingUp className="w-4 h-4" />}
              title={tm.instruments_title}
              subtitle={tm.instruments_subtitle}
              block={data.insights.instruments as GatedBlock}
              renderBest={(s) => s.key}
              tm={tm}
              dataTestId="card-mirror-instruments"
            />

            <CategoryCard
              icon={<Clock className="w-4 h-4" />}
              title={tm.timing_title}
              subtitle={tm.timing_subtitle}
              block={data.insights.timing as GatedBlock}
              renderBest={(s) => keyLabel(s.key, "time", tm)}
              tm={tm}
              dataTestId="card-mirror-timing"
            />

            <PostLossCard
              tm={tm}
              block={data.insights.postLoss as GatedBlock}
            />

            <div className="lg:col-span-2">
              <ExitDisciplineCard
                tm={tm}
                block={data.insights.exitDiscipline as GatedBlock}
              />
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}

interface MirrorStrings {
  [k: string]: string;
}

function CategoryCard({
  icon,
  title,
  subtitle,
  block,
  renderBest,
  tm,
  dataTestId,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  block: GatedBlock;
  renderBest: (s: Stat) => string;
  tm: MirrorStrings;
  dataTestId: string;
}) {
  return (
    <Card className="p-4 space-y-2" data-testid={dataTestId}>
      <div className="flex items-start gap-2">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {subtitle}
          </p>
        </div>
      </div>
      {block.gated ? (
        <GatedBadge tm={tm} have={block.have ?? 0} need={block.need ?? 5} />
      ) : (
        <BestWorstRow
          best={(block.data as { best: Stat | null } | undefined)?.best ?? null}
          worst={
            (block.data as { worst: Stat | null } | undefined)?.worst ?? null
          }
          renderBest={renderBest}
          tm={tm}
        />
      )}
    </Card>
  );
}

function BestWorstRow({
  best,
  worst,
  renderBest,
  tm,
}: {
  best: Stat | null;
  worst: Stat | null;
  renderBest: (s: Stat) => string;
  tm: MirrorStrings;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 pt-1">
      <MiniStat
        accent="positive"
        icon={<TrendingUp className="w-3 h-3" />}
        label={tm.best}
        value={best ? renderBest(best) : "—"}
        sub={best ? `${Math.round(best.winRate * 100)}% • ${best.total}` : ""}
      />
      <MiniStat
        accent="negative"
        icon={<TrendingDown className="w-3 h-3" />}
        label={tm.worst}
        value={worst ? renderBest(worst) : "—"}
        sub={worst ? `${Math.round(worst.winRate * 100)}% • ${worst.total}` : ""}
      />
    </div>
  );
}

function MiniStat({
  accent,
  icon,
  label,
  value,
  sub,
}: {
  accent: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-2.5 border",
        accent === "positive" && "border-emerald-500/30 bg-emerald-500/5",
        accent === "negative" && "border-rose-500/30 bg-rose-500/5",
        accent === "neutral" && "border-border bg-muted/30",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold",
          accent === "positive" && "text-emerald-500",
          accent === "negative" && "text-rose-500",
          accent === "neutral" && "text-muted-foreground",
        )}
      >
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold text-foreground mt-1 truncate">
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function GatedBadge({
  tm,
  have,
  need,
}: {
  tm: MirrorStrings;
  have: number;
  need: number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2">
      <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <p className="text-[12px] text-muted-foreground leading-snug">
        {tm.need_more_data
          .replace("{have}", String(have))
          .replace("{need}", String(need))}
      </p>
    </div>
  );
}

function PostLossCard({
  tm,
  block,
}: {
  tm: MirrorStrings;
  block: GatedBlock;
}) {
  return (
    <Card className="p-4 space-y-2" data-testid="card-mirror-post-loss">
      <div className="flex items-start gap-2">
        <Repeat className="w-4 h-4 text-muted-foreground mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            {tm.post_loss_title}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {tm.post_loss_subtitle}
          </p>
        </div>
      </div>
      {block.gated ? (
        <GatedBadge tm={tm} have={block.have ?? 0} need={block.need ?? 5} />
      ) : (() => {
        const d = block.data as {
          afterLossWinRate: number;
          baselineWinRate: number;
          delta: number;
          sample: number;
        };
        const after = Math.round(d.afterLossWinRate * 100);
        const base = Math.round(d.baselineWinRate * 100);
        const deltaPts = Math.round(d.delta * 100);
        return (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <MiniStat
              accent="neutral"
              icon={<TrendingDown className="w-3 h-3" />}
              label={tm.after_loss}
              value={`${after}%`}
              sub={`${d.sample} ${tm.trades}`}
            />
            <MiniStat
              accent={deltaPts < 0 ? "negative" : "positive"}
              icon={
                deltaPts < 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )
              }
              label={tm.vs_baseline}
              value={`${deltaPts > 0 ? "+" : ""}${deltaPts} pts`}
              sub={`${tm.baseline} ${base}%`}
            />
          </div>
        );
      })()}
    </Card>
  );
}

function ExitDisciplineCard({
  tm,
  block,
}: {
  tm: MirrorStrings;
  block: GatedBlock;
}) {
  return (
    <Card className="p-4 space-y-2" data-testid="card-mirror-exit-discipline">
      <div className="flex items-start gap-2">
        <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            {tm.exit_title}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {tm.exit_subtitle}
          </p>
        </div>
      </div>
      {block.gated ? (
        <GatedBadge tm={tm} have={block.have ?? 0} need={block.need ?? 5} />
      ) : (() => {
        const d = block.data as {
          avgProjectedPct: number;
          avgCapturedPct: number;
          captureRatio: number;
          sample: number;
        };
        return (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <MiniStat
              accent="neutral"
              icon={<Target className="w-3 h-3" />}
              label={tm.projected}
              value={`${d.avgProjectedPct.toFixed(2)}%`}
              sub={`${d.sample} ${tm.wins}`}
            />
            <MiniStat
              accent={d.captureRatio < 0.6 ? "negative" : "positive"}
              icon={<TrendingUp className="w-3 h-3" />}
              label={tm.captured}
              value={`${d.avgCapturedPct.toFixed(2)}%`}
              sub={`${Math.round(d.captureRatio * 100)}% ${tm.capture_ratio}`}
            />
          </div>
        );
      })()}
    </Card>
  );
}

function keyLabel(
  key: string,
  kind: "session" | "time",
  tm: MirrorStrings,
): string {
  if (kind === "session") {
    return (
      {
        asia: tm.session_asia,
        london: tm.session_london,
        newyork: tm.session_newyork,
        off: tm.session_off,
      } as Record<string, string>
    )[key] ?? key;
  }
  return (
    {
      morning: tm.time_morning,
      midday: tm.time_midday,
      afternoon: tm.time_afternoon,
      late: tm.time_late,
    } as Record<string, string>
  )[key] ?? key;
}
