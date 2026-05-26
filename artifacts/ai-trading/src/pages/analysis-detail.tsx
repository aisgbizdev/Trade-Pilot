import { useLocation } from "wouter";
import {
  ChevronLeft,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  RefreshCw,
  StickyNote,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Target,
  AlertOctagon,
  HelpCircle,
  Newspaper,
  CalendarClock,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Layout } from "@/components/layout";
import { MarketContextSummary } from "@/components/market-context-summary";
import { OutcomeBadge, type OutcomeStatus } from "@/components/outcome-badge";
import { AnalysisChartSection } from "@/components/analysis-chart-section";
import { SignalSpeedometer } from "@/components/signal-speedometer";
import { TechnicalIndicatorsPanel } from "@/components/technical-indicators-panel";
import type { IndicatorTimeframe } from "@/hooks/use-technical-indicators";
import {
  useGetAnalysis,
  getGetAnalysisQueryKey,
  useSubmitFeedback,
  useRefreshFundamentals,
  useGetAnalysisAlerts,
  useArmAnalysisAlerts,
  useCancelAnalysisAlerts,
  getGetAnalysisAlertsQueryKey,
  useGetPushSubscriptionStatus,
  type Analysis,
  type Feedback,
  type TradePlan,
  type TradeSide,
  type FundamentalContext,
  type FundamentalCitations,
  type FundamentalNewsItem,
  type FundamentalCalendarEvent,
  type FundamentalDrift,
  type AlertStatus,
  type AlertLevelRow,
} from "@workspace/api-client-react";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { useRefreshAnalysis } from "@/hooks/use-refresh-analysis";
import { safeHttpUrl } from "@/lib/safe-url";

type T = ReturnType<typeof useTranslation>["t"];

function getMarketConditionMeta(
  key: string | null | undefined,
  t: T,
): { label: string; color: string } | undefined {
  if (!key) return undefined;
  const colorMap: Record<string, string> = {
    trending_up: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    trending_down: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    ranging: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    volatile: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };
  const labelMap: Record<string, string> = {
    trending_up: t.dashboard.trending_up,
    trending_down: t.dashboard.trending_down,
    ranging: t.dashboard.ranging,
    volatile: t.dashboard.volatile,
  };
  const color = colorMap[key];
  const label = labelMap[key];
  if (!color || !label) return undefined;
  return { label, color };
}

function getRiskLevelMeta(
  key: string | null | undefined,
  t: T,
): { label: string; color: string; bars: number } | undefined {
  if (!key) return undefined;
  const meta: Record<string, { color: string; bars: number; label: string }> = {
    low: { color: "text-green-600 dark:text-green-400", bars: 1, label: t.analysis_detail.risk_level_low },
    medium: { color: "text-yellow-600 dark:text-yellow-400", bars: 2, label: t.analysis_detail.risk_level_medium },
    high: { color: "text-red-600 dark:text-red-400", bars: 3, label: t.analysis_detail.risk_level_high },
  };
  return meta[key];
}

type BiasKey =
  | "bearish_strong"
  | "bearish"
  | "neutral"
  | "bullish"
  | "bullish_strong";

const LEGACY_BIAS_MAP: Record<string, BiasKey> = {
  strong_sell: "bearish_strong",
  sell: "bearish",
  neutral: "neutral",
  buy: "bullish",
  strong_buy: "bullish_strong",
};

function normalizeBias(raw: string | null | undefined): BiasKey | null {
  if (!raw) return null;
  if (raw in LEGACY_BIAS_MAP) return LEGACY_BIAS_MAP[raw]!;
  const valid: BiasKey[] = ["bearish_strong", "bearish", "neutral", "bullish", "bullish_strong"];
  return valid.includes(raw as BiasKey) ? (raw as BiasKey) : null;
}

function biasColor(bias: BiasKey): string {
  switch (bias) {
    case "bearish_strong":
      return "text-red-700 dark:text-red-400";
    case "bearish":
      return "text-red-600 dark:text-red-400";
    case "neutral":
      return "text-yellow-600 dark:text-yellow-400";
    case "bullish":
      return "text-green-600 dark:text-green-400";
    case "bullish_strong":
      return "text-green-700 dark:text-green-400";
  }
}

/**
 * Map a 5-step `BiasKey` into the same buy/sell/neutral triple shape used
 * everywhere else by `<SignalSpeedometer>` so the bias gauge can share the
 * exact same component (and angle math) as the technical-indicator gauges.
 *
 * Each preset lands the needle in the centre of its corresponding zone:
 *   bearish_strong → -90° · bearish → -36° · neutral → 0°
 *   bullish → +36° · bullish_strong → +90°
 */
function biasToCounts(bias: BiasKey): { buy: number; sell: number; neutral: number } {
  switch (bias) {
    case "bearish_strong":
      return { buy: 0, sell: 4, neutral: 0 };
    case "bearish":
      return { buy: 1, sell: 3, neutral: 1 };
    case "neutral":
      return { buy: 1, sell: 1, neutral: 3 };
    case "bullish":
      return { buy: 3, sell: 1, neutral: 1 };
    case "bullish_strong":
      return { buy: 4, sell: 0, neutral: 0 };
  }
}

function biasLabel(bias: BiasKey, mode: string, t: T): string {
  const isBeginner = mode === "beginner";
  const dict = t.analysis_detail;
  if (isBeginner) {
    switch (bias) {
      case "bearish_strong":
        return dict.bias_beginner_bearish_strong;
      case "bearish":
        return dict.bias_beginner_bearish;
      case "neutral":
        return dict.bias_beginner_neutral;
      case "bullish":
        return dict.bias_beginner_bullish;
      case "bullish_strong":
        return dict.bias_beginner_bullish_strong;
    }
  }
  switch (bias) {
    case "bearish_strong":
      return dict.bias_bearish_strong;
    case "bearish":
      return dict.bias_bearish;
    case "neutral":
      return dict.bias_neutral;
    case "bullish":
      return dict.bias_bullish;
    case "bullish_strong":
      return dict.bias_bullish_strong;
  }
}

function BiasIcon({ bias, className }: { bias: BiasKey; className?: string }) {
  if (bias === "bullish" || bias === "bullish_strong") {
    return <TrendingUp className={className} />;
  }
  if (bias === "bearish" || bias === "bearish_strong") {
    return <TrendingDown className={className} />;
  }
  return <Minus className={className} />;
}

function BiasIndicator({ bias, mode, timeframe }: { bias: BiasKey; mode: string; timeframe: string }) {
  const { t } = useTranslation();
  const color = biasColor(bias);
  const counts = biasToCounts(bias);
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
            {t.analysis_detail.bias_title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <BiasIcon bias={bias} className={cn("w-5 h-5", color)} />
            <span className={cn("text-lg font-bold", color)} data-testid="text-bias-label">
              {biasLabel(bias, mode, t)}
            </span>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wide"
              data-testid="text-bias-timeframe"
            >
              {timeframe}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {t.analysis_detail.bias_for_timeframe.replace("{timeframe}", timeframe)}
          </p>
        </div>
      </div>
      <SignalSpeedometer
        buy={counts.buy}
        sell={counts.sell}
        neutral={counts.neutral}
        size="sm"
        showCounts={false}
        showCenterLabel={false}
        testId="bias-gauge"
        className="mx-auto"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{t.analysis_detail.bias_bearish_strong}</span>
        <span>{t.analysis_detail.bias_neutral}</span>
        <span>{t.analysis_detail.bias_bullish_strong}</span>
      </div>
      <p className="text-[11px] text-muted-foreground italic leading-snug">
        {t.analysis_detail.bias_subtitle}
      </p>
    </div>
  );
}

function ValidityBadge({ validUntil }: { validUntil: string }) {
  const { t, lang } = useTranslation();
  const date = new Date(validUntil);
  const valid = date > new Date();
  const dateLocale = lang === "id" ? idLocale : undefined;
  if (valid) {
    return (
      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
        <Clock className="w-4 h-4" />
        <span className="text-xs font-medium">
          {t.analysis_detail.validity_active_prefix}{" "}
          {formatDistanceToNow(date, { addSuffix: false, locale: dateLocale })}{" "}
          {t.analysis_detail.validity_active_suffix}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span className="text-xs font-medium">{t.analysis_detail.validity_expired}</span>
    </div>
  );
}

function Section({
  title,
  content,
  citations,
}: {
  title: string;
  content?: string | null;
  citations?: React.ReactNode;
}) {
  if (!content) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{title}</h3>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
      {citations}
    </div>
  );
}

// Stable, ASCII-safe slug for a string. Used to generate the DOM `id`
// for a row inside the FundamentalContextCard so the inline citation
// chips can scroll the matching row into view via #anchor on click.
// Trim + lowercase + collapse non-alphanumerics so unicode (e.g. ★)
// in a calendar event doesn't poison the id and break querySelector.
function citationSlug(kind: "news" | "event", text: string): string {
  const norm = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `cite-${kind}-${norm || "x"}`;
}

// Best-effort fuzzy match between an AI-emitted citation string and an
// item in the persisted fundamental snapshot. The AI is told to copy
// titles verbatim, but in practice it sometimes truncates or strips
// punctuation/star prefixes (e.g. "★★★ USD — FOMC Rate Decision" →
// "FOMC Rate Decision"), so we compare by normalized substring rather
// than equality to keep chips matchable.
function normalizeForMatch(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function findCitedNews(
  title: string,
  items: FundamentalNewsItem[],
): FundamentalNewsItem | undefined {
  const t = normalizeForMatch(title);
  if (!t) return undefined;
  return items.find((n) => {
    const nt = normalizeForMatch(n.title);
    return nt && (nt === t || nt.includes(t) || t.includes(nt));
  });
}

// Returns the matched event AND its original index in the
// `events` array, so the chip slug can be built from the SAME index
// that FundamentalCalendarCard's row anchor uses. If we used the
// matched-list index instead, citing a subset of events (e.g. only
// the 2nd of 3) would generate a chip slug like `...-0` while the
// row id is `...-1`, and the click-to-scroll would silently fail.
function findCitedEvent(
  name: string,
  events: FundamentalCalendarEvent[],
): { ev: FundamentalCalendarEvent; index: number } | undefined {
  const t = normalizeForMatch(name);
  if (!t) return undefined;
  const idx = events.findIndex((e) => {
    const en = normalizeForMatch(e.event);
    return en && (en === t || en.includes(t) || t.includes(en));
  });
  if (idx === -1) return undefined;
  return { ev: events[idx], index: idx };
}

// Scroll the FundamentalContextCard row matching the given `id` into
// view + briefly highlight it. Falls back to a no-op when the target
// isn't on the page (e.g. AI cited a row that didn't survive into the
// persisted snapshot — rare but possible).
function scrollToCitation(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // Add a one-shot highlight ring so the eye lands on the row even if
  // the card was already on screen and didn't need to scroll.
  el.classList.add("ring-2", "ring-primary/60", "rounded-md");
  window.setTimeout(() => {
    el.classList.remove("ring-2", "ring-primary/60", "rounded-md");
  }, 1500);
}

// Renders the inline source chips for ONE narrative block. Matches each
// AI-cited title / event name against the persisted snapshot:
//   • news with a safe http(s) URL → anchor that opens in a new tab
//   • news without a URL → button that scrolls to the matching row
//   • calendar event → button that scrolls to the matching row
// AI-cited items that don't match any snapshot row are dropped (we'd
// rather show nothing than dangle a useless chip).
function CitationChips({
  citations,
  context,
  t,
}: {
  citations: FundamentalCitations | null | undefined;
  context: FundamentalContext | null | undefined;
  t: T;
}) {
  if (!citations || !context) return null;
  const newsItems = context.newsItems ?? [];
  const events = context.calendarEvents ?? [];
  const newsTitles = (citations.newsTitles ?? []).filter((s) => s && s.trim());
  const calendarEvents = (citations.calendarEvents ?? []).filter((s) => s && s.trim());

  const matchedNews = newsTitles
    .map((title) => ({ title, item: findCitedNews(title, newsItems) }))
    .filter((m): m is { title: string; item: FundamentalNewsItem } => !!m.item);
  const matchedEvents = calendarEvents
    .map((name) => {
      const hit = findCitedEvent(name, events);
      return hit ? { name, ev: hit.ev, index: hit.index } : null;
    })
    .filter(
      (m): m is { name: string; ev: FundamentalCalendarEvent; index: number } =>
        m !== null,
    );

  if (matchedNews.length === 0 && matchedEvents.length === 0) return null;

  const eventImpactClass = (impact: string | null | undefined): string =>
    impact === "★★★"
      ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
      : impact === "★★"
        ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        : "border-border bg-muted/40 text-foreground hover:bg-muted";

  return (
    <div
      className="mt-2 flex items-start gap-1.5 flex-wrap"
      data-testid="citation-chips"
    >
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-1 mr-0.5">
        {t.analysis_detail.citations_label}
      </span>
      {matchedNews.map(({ item }) => {
        const slug = citationSlug("news", item.title);
        const safeUrl = safeHttpUrl(item.url);
        const className =
          "inline-flex items-center gap-1 max-w-[220px] truncate text-[11px] font-medium px-2 py-0.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors";
        if (safeUrl) {
          return (
            <a
              key={slug}
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              data-testid="citation-chip-news"
              title={item.title}
            >
              <Newspaper className="w-3 h-3 shrink-0" />
              <span className="truncate">{item.title}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
            </a>
          );
        }
        return (
          <button
            key={slug}
            type="button"
            onClick={() => scrollToCitation(slug)}
            className={className}
            data-testid="citation-chip-news"
            title={item.title}
          >
            <Newspaper className="w-3 h-3 shrink-0" />
            <span className="truncate">{item.title}</span>
          </button>
        );
      })}
      {matchedEvents.map(({ ev, index }) => {
        // Use the ORIGINAL `events` index (not the matched-list index)
        // so this slug matches the row id rendered by FundamentalCalendarRow.
        const slug = citationSlug("event", `${ev.date}-${ev.event}-${index}`);
        return (
          <button
            key={slug}
            type="button"
            onClick={() => scrollToCitation(slug)}
            className={cn(
              "inline-flex items-center gap-1 max-w-[220px] truncate text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors",
              eventImpactClass(ev.impact),
            )}
            data-testid="citation-chip-event"
            title={ev.event}
          >
            <CalendarClock className="w-3 h-3 shrink-0" />
            <span className="truncate">{ev.event}</span>
            {ev.impact && (
              <span className="text-[9px] font-semibold ml-0.5 shrink-0">
                {ev.impact}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function parseConditions(raw?: string | null): string[] {
  if (!raw) return [];
  // Split only on real list delimiters: newlines, "; " (semicolon followed by whitespace),
  // or bullet markers (• or " - " surrounded by spaces). Avoids splitting URLs/numbers
  // that contain bare semicolons or ampersands.
  return raw
    .split(/\n+|;\s+|(?:^|\s)[•]\s+|(?:\s)-\s+/g)
    .map((s) => s.trim().replace(/^[-*•]\s*/, ""))
    .filter((s) => s.length > 0);
}

function scenarioCText(bias: BiasKey, t: T): string {
  if (bias === "neutral") {
    return t.analysis_detail.scenario_c_template_neutral;
  }
  return t.analysis_detail.scenario_c_template_directional;
}

const INDICATOR_TIMEFRAMES = new Set<IndicatorTimeframe>(["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W"]);
function asIndicatorTimeframe(tf: string): IndicatorTimeframe | null {
  return INDICATOR_TIMEFRAMES.has(tf as IndicatorTimeframe)
    ? (tf as IndicatorTimeframe)
    : null;
}

function TradePlanCard({ plan, t }: { plan: TradePlan; t: T }) {
  const preferredLabel =
    plan.preferredSide === "buy"
      ? t.analysis_detail.trade_plan_preferred_buy
      : plan.preferredSide === "sell"
      ? t.analysis_detail.trade_plan_preferred_sell
      : t.analysis_detail.trade_plan_preferred_wait;
  const preferredColor =
    plan.preferredSide === "buy"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40"
      : plan.preferredSide === "sell"
      ? "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/40"
      : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40";

  const renderSide = (side: TradeSide, kind: "buy" | "sell") => {
    const accent =
      kind === "buy"
        ? "border-l-emerald-500 dark:border-l-emerald-400"
        : "border-l-red-500 dark:border-l-red-400";
    const headerColor =
      kind === "buy"
        ? "text-emerald-700 dark:text-emerald-400"
        : "text-red-700 dark:text-red-400";
    const isPreferred =
      (kind === "buy" && plan.preferredSide === "buy") ||
      (kind === "sell" && plan.preferredSide === "sell");
    const Icon = kind === "buy" ? TrendingUp : TrendingDown;
    return (
      <div
        className={cn(
          "border-l-4 rounded-md bg-muted/30 p-3 space-y-2",
          accent,
          isPreferred && "ring-1 ring-primary/40",
        )}
        data-testid={`trade-plan-${kind}`}
      >
        <div className="flex items-center gap-1.5">
          <Icon className={cn("w-4 h-4", headerColor)} />
          <h4 className={cn("text-sm font-bold", headerColor)}>
            {kind === "buy" ? t.analysis_detail.trade_plan_side_buy : t.analysis_detail.trade_plan_side_sell}
          </h4>
        </div>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <dt className="text-muted-foreground">{t.analysis_detail.trade_plan_entry}</dt>
          <dd className="font-semibold text-foreground tabular-nums text-right" data-testid={`trade-plan-${kind}-entry`}>{side.entryZone}</dd>
          <dt className="text-muted-foreground">{t.analysis_detail.trade_plan_sl}</dt>
          <dd className="font-semibold text-red-600 dark:text-red-400 tabular-nums text-right" data-testid={`trade-plan-${kind}-sl`}>{side.stopLoss}</dd>
          <dt className="text-muted-foreground">{t.analysis_detail.trade_plan_tp1}</dt>
          <dd className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums text-right" data-testid={`trade-plan-${kind}-tp1`}>{side.takeProfit1}</dd>
          <dt className="text-muted-foreground">{t.analysis_detail.trade_plan_tp2}</dt>
          <dd className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums text-right" data-testid={`trade-plan-${kind}-tp2`}>{side.takeProfit2}</dd>
          <dt className="text-muted-foreground">{t.analysis_detail.trade_plan_rr}</dt>
          <dd className="font-semibold text-foreground tabular-nums text-right" data-testid={`trade-plan-${kind}-rr`}>{side.riskRewardRatio}</dd>
        </dl>
        <div className="pt-1 border-t border-border/60">
          <p className="text-[11px] text-muted-foreground leading-snug">
            <span className="font-semibold text-foreground/80">{t.analysis_detail.trade_plan_rationale}:</span>{" "}
            {side.rationale}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4 space-y-3" data-testid="card-trade-plan">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Target className="w-4 h-4 text-primary" />
            {t.analysis_detail.trade_plan_title}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            {t.analysis_detail.trade_plan_subtitle}
          </p>
        </div>
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-1 rounded-full border whitespace-nowrap",
            preferredColor,
          )}
          data-testid="trade-plan-preferred-side"
        >
          {preferredLabel}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {renderSide(plan.buy, "buy")}
        {renderSide(plan.sell, "sell")}
      </div>
      <div className="flex gap-2 items-start bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-md p-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
          {t.analysis_detail.trade_plan_disclaimer}
        </p>
      </div>
    </Card>
  );
}

// Price-alerts card — opt-in push notifications that fire the first time
// live price touches one of the AI's entry / SL / TP levels. Reads alert
// status from the server (which is the source of truth — alerts are
// per-analysis-per-level rows, auto-armed on create when push is enabled).
// The Switch is the primary control; the level rows below give the user
// transparency about *which* levels are armed and which have already fired.
function AnalysisAlertsCard({
  analysisId,
  t,
}: {
  analysisId: number;
  t: T;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const statusQuery = useGetAnalysisAlerts(analysisId);
  const pushStatusQuery = useGetPushSubscriptionStatus();
  const armMutation = useArmAnalysisAlerts();
  const cancelMutation = useCancelAnalysisAlerts();

  const status: AlertStatus | undefined = statusQuery.data;
  const hasPush = pushStatusQuery.data?.subscribed === true;
  const busy = armMutation.isPending || cancelMutation.isPending;

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: getGetAnalysisAlertsQueryKey(analysisId),
    });

  const handleToggle = (checked: boolean) => {
    if (busy) return;
    if (checked) {
      if (!hasPush) {
        toast({ title: t.analysis_detail.alerts_no_push, variant: "destructive" });
        return;
      }
      armMutation.mutate(
        { id: analysisId },
        {
          onSuccess: invalidate,
          onError: () =>
            toast({
              title: t.analysis_detail.alerts_arm_error,
              variant: "destructive",
            }),
        },
      );
    } else {
      cancelMutation.mutate(
        { id: analysisId },
        {
          onSuccess: invalidate,
          onError: () =>
            toast({
              title: t.analysis_detail.alerts_cancel_error,
              variant: "destructive",
            }),
        },
      );
    }
  };

  const enabled = status?.enabled ?? false;
  const armedCount = status?.armedCount ?? 0;
  const levels: AlertLevelRow[] = status?.levels ?? [];

  const levelLabel = (lv: AlertLevelRow["level"]): string => {
    switch (lv) {
      case "entry":
        return t.analysis_detail.alerts_level_entry;
      case "sl":
        return t.analysis_detail.alerts_level_sl;
      case "tp1":
        return t.analysis_detail.alerts_level_tp1;
      case "tp2":
        return t.analysis_detail.alerts_level_tp2;
    }
  };

  const rowStatusBadge = (row: AlertLevelRow) => {
    if (row.triggeredAt) {
      return (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          {t.analysis_detail.alerts_status_fired}
        </span>
      );
    }
    if (row.cancelledAt) {
      return (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          {t.analysis_detail.alerts_status_cancelled}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
        {t.analysis_detail.alerts_status_armed}
      </span>
    );
  };

  return (
    <Card className="p-4 space-y-3" data-testid="card-price-alerts">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            {enabled ? (
              <Bell className="w-4 h-4 text-primary" />
            ) : (
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
            {t.analysis_detail.alerts_title}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            {t.analysis_detail.alerts_subtitle}
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={busy || statusQuery.isLoading}
          data-testid="switch-price-alerts"
          aria-label={enabled ? t.analysis_detail.alerts_on : t.analysis_detail.alerts_off}
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap" data-testid="price-alerts-summary">
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-1 rounded-full border",
            enabled
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-muted text-muted-foreground border-border",
          )}
        >
          {enabled ? t.analysis_detail.alerts_on : t.analysis_detail.alerts_off}
        </span>
        {enabled && (
          <span className="text-[11px] text-muted-foreground">
            {t.analysis_detail.alerts_armed_count.replace("{n}", String(armedCount))}
          </span>
        )}
      </div>
      {levels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1" data-testid="price-alerts-levels">
          {levels.map((row) => (
            <div
              key={`${row.level}-${row.side}`}
              className="flex items-center justify-between gap-2 text-xs px-2 py-1.5 rounded border bg-card/50"
              data-testid={`alert-row-${row.level}`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-semibold text-foreground">{levelLabel(row.level)}</span>
                <span className="font-mono text-[11px] text-muted-foreground">@ {row.price}</span>
              </div>
              {rowStatusBadge(row)}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// Auditable view of the fundamental snapshot the AI was given.
// Captured server-side at analysis time so the user sees the same
// inputs the model used. Empty arrays render the empty-state.
//
// Also hosts the "Refresh fundamentals" button + drift banner. Refresh
// re-fetches news + calendar without re-running the AI; the drift banner
// shows how many of the AI's original citations are no longer present in
// the fresh window.
function FundamentalContextCard({
  ctx,
  t,
  instrument,
  lang,
  onRefresh,
  isRefreshing,
  refreshState,
}: {
  ctx: FundamentalContext;
  t: T;
  instrument: string;
  lang: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  refreshState: { refreshedAt: string; drift: FundamentalDrift } | null;
}) {
  const news = (ctx.newsItems ?? []).slice(0, 3);
  const events = (ctx.calendarEvents ?? []).slice(0, 5);

  const refreshButton = (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="h-7 px-2 text-xs"
      onClick={onRefresh}
      disabled={isRefreshing}
      data-testid="button-refresh-fundamentals"
    >
      {isRefreshing ? (
        <span className="flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          {t.analysis_detail.fundamental_refresh_loading}
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          {t.analysis_detail.fundamental_refresh_btn}
        </span>
      )}
    </Button>
  );

  const driftBanner = refreshState ? (
    <FundamentalDriftBanner state={refreshState} t={t} lang={lang} />
  ) : null;

  if (news.length === 0 && events.length === 0) {
    return (
      <Card className="p-4 space-y-2" data-testid="card-fundamental-context">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">
              {t.analysis_detail.fundamental_context_title}
            </h3>
          </div>
          {refreshButton}
        </div>
        {driftBanner}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.analysis_detail.fundamental_empty.replace("{instrument}", instrument)}
        </p>
      </Card>
    );
  }
  return (
    <Card className="p-4 space-y-4" data-testid="card-fundamental-context">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              {t.analysis_detail.fundamental_context_title}
            </h3>
          </div>
          {refreshButton}
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
          {t.analysis_detail.fundamental_context_subtitle}
        </p>
      </div>

      {driftBanner}

      {news.length > 0 && (
        <div className="space-y-2" data-testid="fundamental-news-list">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 uppercase tracking-wide">
            <Newspaper className="w-3.5 h-3.5" />
            <span>{t.analysis_detail.fundamental_news_title}</span>
          </div>
          <ul className="space-y-2">
            {news.map((n) => (
              <FundamentalNewsRow
                key={n.id}
                item={n}
                t={t}
                lang={lang}
                anchorId={citationSlug("news", n.title)}
              />
            ))}
          </ul>
        </div>
      )}

      {events.length > 0 && (
        <div className="space-y-2" data-testid="fundamental-calendar-list">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 uppercase tracking-wide">
            <CalendarClock className="w-3.5 h-3.5" />
            <span>{t.analysis_detail.fundamental_calendar_title}</span>
          </div>
          <ul className="space-y-2">
            {events.map((e, i) => (
              <FundamentalCalendarRow
                key={`${e.date}-${e.event}-${i}`}
                ev={e}
                t={t}
                anchorId={citationSlug("event", `${e.date}-${e.event}-${i}`)}
              />
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

// Inline banner that surfaces the result of the most recent refresh:
// either "all original citations still in window" or "N of M cited
// {kind} no longer in window". Driven entirely off the server-returned
// drift report so the UI text is grounded in actual data.
function FundamentalDriftBanner({
  state,
  t,
  lang,
}: {
  state: { refreshedAt: string; drift: FundamentalDrift };
  t: T;
  lang: string;
}) {
  let when = "";
  try {
    const d = new Date(state.refreshedAt);
    if (!Number.isNaN(d.getTime())) {
      when = formatDistanceToNow(d, {
        addSuffix: true,
        locale: lang === "id" ? idLocale : undefined,
      });
    }
  } catch {
    when = "";
  }
  const total = state.drift.totalCitations;
  const missing = state.drift.missingCitations;
  // Nothing was cited originally — just confirm the refresh ran.
  if (total === 0) {
    return (
      <div
        className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
        role="status"
        data-testid="fundamental-refresh-banner"
      >
        {t.analysis_detail.fundamental_refresh_updated.replace("{when}", when)}
      </div>
    );
  }
  if (missing.length === 0) {
    return (
      <div
        className="rounded-md border border-green-300/60 bg-green-50 px-3 py-2 text-xs text-green-800 dark:border-green-800/50 dark:bg-green-950/40 dark:text-green-300"
        role="status"
        data-testid="fundamental-refresh-banner"
      >
        {t.analysis_detail.fundamental_refresh_no_drift
          .replace("{when}", when)
          .replace("{total}", String(total))}
      </div>
    );
  }
  // Pick a kind label that reflects what's actually missing — news only,
  // calendar only, or mixed.
  const kinds = new Set(missing.map((c) => c.kind));
  const kindLabel =
    kinds.size === 1
      ? kinds.has("news")
        ? t.analysis_detail.fundamental_refresh_kind_news
        : t.analysis_detail.fundamental_refresh_kind_calendar
      : t.analysis_detail.fundamental_refresh_kind_mixed;
  return (
    <div
      className="rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-200"
      role="status"
      data-testid="fundamental-refresh-banner"
    >
      <div className="font-medium" data-testid="fundamental-refresh-drift-text">
        {t.analysis_detail.fundamental_refresh_drift
          .replace("{when}", when)
          .replace("{missing}", String(missing.length))
          .replace("{total}", String(total))
          .replace("{kind}", kindLabel)}
      </div>
      <ul className="mt-1 list-disc pl-4 space-y-0.5">
        {missing.slice(0, 5).map((c, i) => (
          <li
            key={`${c.kind}-${i}`}
            className="leading-snug"
            data-testid="fundamental-refresh-drift-item"
          >
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// `safeHttpUrl` lives in `@/lib/safe-url` so we can unit-test it
// directly without dragging the page component into a render.

function FundamentalNewsRow({
  item,
  t,
  lang,
  anchorId,
}: {
  item: FundamentalNewsItem;
  t: T;
  lang: string;
  anchorId?: string;
}) {
  // Best-effort relative date — if the timestamp is unparseable we just
  // skip the relative label rather than crashing the card render.
  let relative = "";
  try {
    const d = new Date(item.publishedAt);
    if (!Number.isNaN(d.getTime())) {
      relative = formatDistanceToNow(d, {
        addSuffix: true,
        locale: lang === "id" ? idLocale : undefined,
      });
    }
  } catch {
    relative = "";
  }
  const safeUrl = safeHttpUrl(item.url);
  const TitleEl = safeUrl ? (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-foreground hover:text-primary inline-flex items-start gap-1 leading-snug"
      data-testid="fundamental-news-link"
    >
      <span>{item.title}</span>
      <ExternalLink className="w-3 h-3 mt-1 shrink-0 opacity-60" />
    </a>
  ) : (
    <span className="text-sm font-medium text-foreground leading-snug">
      {item.title}
    </span>
  );
  return (
    <li
      id={anchorId}
      className="border-l-2 border-muted-foreground/20 pl-3 py-0.5 transition-shadow"
    >
      {TitleEl}
      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
        <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[10px]">
          {item.source}
        </Badge>
        {relative && <span>{relative}</span>}
      </div>
    </li>
  );
}

function FundamentalCalendarRow({
  ev,
  t,
  anchorId,
}: {
  ev: FundamentalCalendarEvent;
  t: T;
  anchorId?: string;
}) {
  const impactColor = ev.impact === "★★★"
    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    : ev.impact === "★★"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-muted text-muted-foreground";
  return (
    <li
      id={anchorId}
      className="border-l-2 border-muted-foreground/20 pl-3 py-0.5 space-y-1 transition-shadow"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-foreground leading-snug">
          {ev.event}
        </span>
        <Badge variant="outline" className="px-1.5 py-0 h-4 text-[10px]">
          {ev.currency}
        </Badge>
        {ev.impact && (
          <span
            className={cn(
              "text-[10px] font-semibold px-1.5 py-0 rounded h-4 inline-flex items-center",
              impactColor,
            )}
          >
            {ev.impact}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
        <span>
          {ev.date}
          {ev.time ? ` · ${ev.time}` : ""}
        </span>
        {ev.actual != null && (
          <span>
            {t.analysis_detail.fundamental_calendar_actual}:{" "}
            <span className="font-semibold text-foreground/80">{ev.actual}</span>
          </span>
        )}
        {ev.forecast != null && (
          <span>
            {t.analysis_detail.fundamental_calendar_forecast}: {ev.forecast}
          </span>
        )}
        {ev.previous != null && (
          <span>
            {t.analysis_detail.fundamental_calendar_previous}: {ev.previous}
          </span>
        )}
      </div>
    </li>
  );
}

function executionScenarioAText(bias: BiasKey, t: T): string {
  if (bias === "bullish" || bias === "bullish_strong") {
    return t.analysis_detail.execution_scenario_a_template_bullish;
  }
  if (bias === "bearish" || bias === "bearish_strong") {
    return t.analysis_detail.execution_scenario_a_template_bearish;
  }
  return t.analysis_detail.execution_scenario_a_template_neutral;
}

export default function AnalysisDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t, lang } = useTranslation();
  const submitFeedback = useSubmitFeedback();
  const { refresh, isRefreshing: isRowRefreshing } = useRefreshAnalysis();
  const isRefreshing = isRowRefreshing(id);

  // Local UI state for the "refresh fundamentals" mutation. The server
  // persists the new snapshot on the analyses row, so we also invalidate
  // the analysis query so the card data re-syncs from the source of
  // truth — but the drift report is ephemeral and only lives in this
  // banner state until the user navigates away.
  const [fundamentalRefresh, setFundamentalRefresh] = useState<{
    refreshedAt: string;
    drift: FundamentalDrift;
  } | null>(null);
  const refreshFundamentalsMutation = useRefreshFundamentals({
    mutation: {
      onSuccess: (resp) => {
        setFundamentalRefresh({
          refreshedAt: resp.refreshedAt,
          drift: resp.drift,
        });
        queryClient.invalidateQueries({ queryKey: getGetAnalysisQueryKey(id) });
      },
      onError: () => {
        toast({
          title: t.analysis_detail.fundamental_refresh_failed,
          variant: "destructive",
        });
      },
    },
  });
  const handleRefreshFundamentals = () => {
    if (refreshFundamentalsMutation.isPending) return;
    refreshFundamentalsMutation.mutate({ id });
  };
  // Drift banner is per-analysis — clear it when the user navigates to a
  // different analysis ID so a stale banner from analysis #41 doesn't
  // bleed into analysis #42.
  useEffect(() => {
    setFundamentalRefresh(null);
  }, [id]);

  const [feedbackType, setFeedbackType] = useState<"useful" | "not_useful" | null>(null);
  const [outcome, setOutcome] = useState<"correct" | "wrong" | "unknown" | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [refreshMsgIndex, setRefreshMsgIndex] = useState(0);
  const [refreshDialogOpen, setRefreshDialogOpen] = useState(false);
  const [refreshNotes, setRefreshNotes] = useState("");
  const [executionOpen, setExecutionOpen] = useState(false);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const carriedOver = typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("carried_over") === "1";

  useEffect(() => {
    if (isRefreshing) {
      refreshIntervalRef.current = setInterval(() => {
        setRefreshMsgIndex((i) => (i + 1) % t.analyze.loading.length);
      }, 1800);
    } else {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      setRefreshMsgIndex(0);
    }
    return () => { if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current); };
  }, [isRefreshing, t]);

  const { data, isLoading } = useGetAnalysis(id, {
    query: {
      enabled: !!id,
      queryKey: getGetAnalysisQueryKey(id),
    },
  });

  type AnalysisWithFeedback = Analysis & { feedback?: Feedback | null };
  const analysis = data as AnalysisWithFeedback | undefined;

  const existingFeedback = analysis?.feedback;

  const openRefreshDialog = () => {
    if (!analysis) return;
    setRefreshNotes(analysis.userInputContext ?? "");
    setRefreshDialogOpen(true);
  };

  const handleRefresh = () => {
    if (!analysis) return;
    const trimmedNotes = refreshNotes.trim();
    const carriedFromOriginal =
      !!analysis.userInputContext &&
      trimmedNotes === (analysis.userInputContext ?? "").trim();
    setRefreshDialogOpen(false);
    refresh({
      id: analysis.id,
      instrument: analysis.instrument,
      timeframe: analysis.timeframe,
      mode: analysis.mode,
      userInputContext: trimmedNotes ? trimmedNotes : null,
      carriedOver: carriedFromOriginal,
    });
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackType && !existingFeedback) return;

    try {
      await submitFeedback.mutateAsync({
        id,
        data: {
          feedbackType: (feedbackType ?? existingFeedback?.feedbackType) as "useful" | "not_useful",
          outcome: (outcome ?? existingFeedback?.outcome ?? undefined) as "correct" | "wrong" | "unknown" | null | undefined,
          note: feedbackNote || existingFeedback?.note || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetAnalysisQueryKey(id) });
      setFeedbackSubmitted(true);
      toast({ title: t.analysis_detail.feedback_saved });
    } catch {
      toast({ title: t.analysis_detail.feedback_save_error, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!analysis) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <p className="text-muted-foreground mb-4">{t.analysis_detail.not_found}</p>
          <Button variant="outline" onClick={() => setLocation("/history")}>
            {t.analysis_detail.back_to_history}
          </Button>
        </div>
      </Layout>
    );
  }

  const mc = getMarketConditionMeta(analysis.marketCondition, t);
  const rl = getRiskLevelMeta(analysis.riskLevel, t);
  const isBeginnerMode = analysis.mode === "beginner";
  const isExpired = new Date(analysis.validUntil) <= new Date();
  const bias = normalizeBias(analysis.tradingBias);

  const displayFeedbackType = feedbackType ?? existingFeedback?.feedbackType ?? null;
  const displayOutcome = outcome ?? existingFeedback?.outcome ?? null;

  const invalidationRaw = isBeginnerMode
    ? analysis.failureConditions
    : analysis.invalidationConditions;
  const invalidationItems = parseConditions(invalidationRaw);

  const confidenceReason = isBeginnerMode
    ? analysis.whyReason
    : analysis.uncertaintyNotes;

  const scenarioAContent = isBeginnerMode ? analysis.mainScenario : analysis.baseCase;
  const scenarioBContent = isBeginnerMode
    ? analysis.alternativeScenario
    : (bias === "bearish" || bias === "bearish_strong"
        ? analysis.bullishScenario
        : analysis.bearishScenario);

  const tradePlan = analysis.tradePlan ?? null;
  const indicatorTimeframe = asIndicatorTimeframe(analysis.timeframe);

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/history")}
            className="p-2 rounded-lg hover:bg-muted"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-foreground" data-testid="text-instrument">
                {analysis.instrument}
              </h1>
              <Badge variant="outline" className="text-xs">
                {analysis.timeframe}
              </Badge>
              {mc && (
                <Badge className={cn("text-xs border-0", mc.color)}>
                  {mc.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <ValidityBadge validUntil={analysis.validUntil} />
              {/* After-the-fact outcome of the AI's trade plan: TP1/TP2 hit,
                  SL hit, expired, or invalidated. Populated by the background
                  resolver — `pending` until the first resolver pass. */}
              <OutcomeBadge
                status={(analysis as Analysis & { outcomeStatus?: OutcomeStatus | null }).outcomeStatus}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* PRIMARY METRICS: Bias + Confidence + Risk */}
        <Card className="p-4 space-y-4" data-testid="card-primary-metrics">
          {bias && <BiasIndicator bias={bias} mode={analysis.mode} timeframe={analysis.timeframe} />}

          {bias && <div className="border-t border-border" />}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t.analysis_detail.confidence}</p>
              <p className="text-base font-bold text-foreground" data-testid="text-confidence">
                {analysis.confidenceMin ?? "--"}% – {analysis.confidenceMax ?? "--"}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t.analysis_detail.risk_title}</p>
              <p className={cn("text-sm font-bold", rl?.color)} data-testid="text-risk-level">
                {rl?.label}
              </p>
            </div>
          </div>

          <div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-2 flex-1 rounded-full",
                    n <= (rl?.bars ?? 0)
                      ? analysis.riskLevel === "low"
                        ? "bg-green-500"
                        : analysis.riskLevel === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{
                  left: `${analysis.confidenceMin ?? 0}%`,
                  width: `${(analysis.confidenceMax ?? 0) - (analysis.confidenceMin ?? 0)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {confidenceReason && (
            <div className="bg-muted/40 rounded-md p-2.5 flex gap-2" data-testid="card-confidence-reason">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                  {t.analysis_detail.confidence_reason_label}
                </p>
                <p className="text-xs text-foreground leading-relaxed">{confidenceReason}</p>
                {/* Beginner mode: `confidenceReason` IS the whyReason text,
                    so this is exactly where the AI would mention the news /
                    event it leaned on. Inline-cite the matching cards here
                    (task #89) so the user can see "Fed dovish → bullish
                    bias" with the actual headline rendered as a clickable
                    chip right next to the sentence. */}
                {isBeginnerMode && (
                  <CitationChips
                    citations={analysis.fundamentalCitations}
                    context={analysis.fundamentalContext}
                    t={t}
                  />
                )}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {t.analysis_detail.analyzed_prefix}{" "}
            {format(new Date(analysis.createdAt), "d MMM yyyy, HH:mm", {
              locale: lang === "id" ? idLocale : undefined,
            })}{" "}
            • {t.analysis_detail.mode_prefix}{" "}
            {isBeginnerMode ? t.analysis_detail.beginner_mode : t.analysis_detail.pro_mode}
          </div>

          {isExpired && (
            <Button
              className="w-full mt-2"
              onClick={openRefreshDialog}
              disabled={isRefreshing}
              data-testid="button-refresh-analysis"
            >
              {isRefreshing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t.analyze.loading[refreshMsgIndex]}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.analysis_detail.refresh_btn}</span>
                </div>
              )}
            </Button>
          )}
        </Card>

        {/* TradingView chart — visual confirmation of the AI's read
            against the live tape. Symbol Overview is the default; the
            "Open full chart" button opens a full-screen Advanced Chart
            modal for power users. */}
        <AnalysisChartSection
          instrument={analysis.instrument}
          timeframe={analysis.timeframe}
          tradePlan={tradePlan}
          analysisCreatedAt={analysis.createdAt}
        />

        {/* Fundamental context — news + calendar the AI was given,
            shown directly under the bias gauge so users can audit it. */}
        {analysis.fundamentalContext && (
          <FundamentalContextCard
            ctx={analysis.fundamentalContext}
            t={t}
            instrument={analysis.instrument}
            lang={lang}
            onRefresh={handleRefreshFundamentals}
            isRefreshing={refreshFundamentalsMutation.isPending}
            refreshState={fundamentalRefresh}
          />
        )}

        {/* AI-suggested concrete trade plan with both buy and sell levels.
            Anchored to the price at analysis time. Surfaces the structured
            entry / SL / TP / R:R the model produced — keeps the rest of the
            narrative consultative while giving the user actionable numbers. */}
        {tradePlan && <TradePlanCard plan={tradePlan} t={t} />}

        {/* Price alerts — opt-in push notifications that fire the first
            time live price touches one of the AI's entry / SL / TP levels.
            Hidden unless the analysis has a trade plan AND the user has
            already enabled push notifications (otherwise the toggle would
            be a dead end). */}
        {tradePlan && (
          <AnalysisAlertsCard analysisId={analysis.id} t={t} />
        )}

        {/* Market Context Summary — same card the user saw on the Analyze tab,
            rendered from the indicator-tally snapshot stored at analysis time. */}
        {analysis.techBuyCount != null &&
          analysis.techSellCount != null &&
          analysis.techNeutralCount != null && (
            <MarketContextSummary
              buy={analysis.techBuyCount}
              sell={analysis.techSellCount}
              neutral={analysis.techNeutralCount}
              mode={isBeginnerMode ? "beginner" : "pro"}
            />
          )}

        {/* Live Technical Indicators panel — moved from the Analyze tab so
            users get the full indicator picture in ONE place (the saved
            analysis). Data is live (re-fetched from the upstream feed) so we
            warn that it may differ from the snapshot the AI saw. */}
        {indicatorTimeframe && (
          <Card className="p-4 space-y-3" data-testid="card-indicators-section">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t.analysis_detail.indicators_section_title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                {t.analysis_detail.indicators_section_note}
              </p>
            </div>
            <TechnicalIndicatorsPanel
              instrument={analysis.instrument}
              mode={isBeginnerMode ? "beginner" : "pro"}
              timeframe={indicatorTimeframe}
            />
          </Card>
        )}

        {analysis.userInputContext && (
          <Card className="p-4 space-y-2" data-testid="card-user-notes">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                {t.analysis_detail.your_notes}
              </h3>
              {carriedOver && (
                <Badge
                  variant="outline"
                  className="text-[10px] border-primary/40 text-primary bg-primary/5"
                  data-testid="badge-notes-carried-over"
                >
                  {t.analysis_detail.notes_carried_over}
                </Badge>
              )}
            </div>
            <p
              className="text-sm text-foreground leading-relaxed whitespace-pre-wrap"
              data-testid="text-user-notes"
            >
              {analysis.userInputContext}
            </p>
          </Card>
        )}

        {/* HIGH PRIORITY: Invalidation conditions */}
        {invalidationItems.length > 0 && (
          <Card
            className="p-4 border-l-4 border-l-red-500 dark:border-l-red-400 bg-red-50/40 dark:bg-red-950/20"
            data-testid="card-invalidation"
          >
            <div className="flex gap-2.5">
              <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
                    {t.analysis_detail.invalidation_title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t.analysis_detail.invalidation_subtitle}
                  </p>
                </div>
                <ul className="space-y-1.5" data-testid="list-invalidation">
                  {invalidationItems.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* OPPORTUNITY vs RISK */}
        {(analysis.opportunity || analysis.risk) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="grid-opp-risk">
            {analysis.opportunity && (
              <Card
                className="p-4 border-l-4 border-l-emerald-500 dark:border-l-emerald-400"
                data-testid="card-opportunity"
              >
                <div className="flex gap-2 mb-2">
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    {t.analysis_detail.opportunity_title}
                  </h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{analysis.opportunity}</p>
              </Card>
            )}
            {analysis.risk && (
              <Card
                className="p-4 border-l-4 border-l-amber-500 dark:border-l-amber-400"
                data-testid="card-risk"
              >
                <div className="flex gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400">
                    {t.analysis_detail.risk_title}
                  </h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{analysis.risk}</p>
              </Card>
            )}
          </div>
        )}

        {/* SCENARIOS A / B / C */}
        <Card className="p-4 space-y-4" data-testid="card-scenarios">
          {scenarioAContent && (
            <Section title={t.analysis_detail.scenario_a} content={scenarioAContent} />
          )}
          {scenarioBContent && (
            <Section title={t.analysis_detail.scenario_b} content={scenarioBContent} />
          )}
          <div data-testid="section-scenario-c">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {t.analysis_detail.scenario_c}
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {scenarioCText(bias ?? "neutral", t)}
            </p>
          </div>
        </Card>

        {/* PRO MODE: Technical + Fundamental + Market context */}
        {!isBeginnerMode && (analysis.keyDriversTechnical || analysis.keyDriversFundamental || analysis.marketContext) && (
          <Card className="p-4 space-y-4" data-testid="card-pro-details">
            <Section title={t.analysis_detail.pro_factor_technical} content={analysis.keyDriversTechnical} />
            {/* Inline source chips next to the AI's fundamental + market-
                context narrative (task #89) — duplicate the chip block
                under both because the AI tends to reference fundamental
                catalysts in either / both depending on the prompt. */}
            <Section
              title={t.analysis_detail.pro_factor_fundamental}
              content={analysis.keyDriversFundamental}
              citations={
                <CitationChips
                  citations={analysis.fundamentalCitations}
                  context={analysis.fundamentalContext}
                  t={t}
                />
              }
            />
            <Section
              title={t.analysis_detail.pro_factor_market_context}
              content={analysis.marketContext}
              citations={
                <CitationChips
                  citations={analysis.fundamentalCitations}
                  context={analysis.fundamentalContext}
                  t={t}
                />
              }
            />
          </Card>
        )}

        {/* EXECUTION INSIGHT (Step 2 — collapsible) */}
        <Card className="overflow-hidden" data-testid="card-execution-insight">
          <Collapsible open={executionOpen} onOpenChange={setExecutionOpen}>
            <CollapsibleTrigger
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              data-testid="button-toggle-execution"
            >
              <div className="flex items-center gap-2 text-left">
                {executionOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.analysis_detail.execution_insight_title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.analysis_detail.execution_insight_intro}
                  </p>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 pt-0 space-y-3 border-t border-border">
                <div className="space-y-3 pt-3">
                  <div data-testid="exec-scenario-a">
                    <h4 className="text-xs font-semibold text-foreground mb-1">
                      {t.analysis_detail.execution_scenario_a_label}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {executionScenarioAText(bias ?? "neutral", t)}
                    </p>
                  </div>
                  <div data-testid="exec-scenario-b">
                    <h4 className="text-xs font-semibold text-foreground mb-1">
                      {t.analysis_detail.execution_scenario_b_label}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.analysis_detail.execution_scenario_b_template}
                    </p>
                  </div>
                  <div data-testid="exec-scenario-c">
                    <h4 className="text-xs font-semibold text-foreground mb-1">
                      {t.analysis_detail.execution_scenario_c_label}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.analysis_detail.execution_scenario_c_template}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex gap-2 mt-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                    {t.analysis_detail.execution_insight_disclaimer}
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card className="p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1.5">
              <p
                className="text-xs font-bold text-amber-800 dark:text-amber-300 leading-relaxed"
                data-testid="text-risk-disclaimer-short"
              >
                {t.analysis_detail.risk_disclaimer_short}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                {t.analysis_detail.disclaimer_full}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {existingFeedback || feedbackSubmitted
              ? t.analysis_detail.feedback_your
              : t.analysis_detail.feedback_title}
          </h3>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setFeedbackType("useful")}
              data-testid="button-feedback-useful"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                displayFeedbackType === "useful"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                  : "border-border text-muted-foreground hover:border-green-400"
              )}
            >
              <ThumbsUp className="w-4 h-4" />
              {t.analysis_detail.feedback_useful}
            </button>
            <button
              onClick={() => setFeedbackType("not_useful")}
              data-testid="button-feedback-not-useful"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                displayFeedbackType === "not_useful"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                  : "border-border text-muted-foreground hover:border-red-400"
              )}
            >
              <ThumbsDown className="w-4 h-4" />
              {t.analysis_detail.feedback_not_useful}
            </button>
          </div>

          {(feedbackType || existingFeedback) && (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">{t.analysis_detail.feedback_outcome_label}</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["correct", "wrong", "unknown"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOutcome(o)}
                      data-testid={`button-outcome-${o}`}
                      className={cn(
                        "py-2 text-xs font-medium rounded-lg border transition-all",
                        displayOutcome === o
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {o === "correct"
                        ? t.analysis_detail.feedback_outcome_correct
                        : o === "wrong"
                        ? t.analysis_detail.feedback_outcome_wrong
                        : t.analysis_detail.feedback_outcome_unknown}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder={t.analysis_detail.feedback_note_placeholder}
                value={feedbackNote || existingFeedback?.note || ""}
                onChange={(e) => setFeedbackNote(e.target.value)}
                rows={2}
                className="resize-none text-sm"
                data-testid="textarea-feedback-note"
              />

              {!feedbackSubmitted && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleFeedbackSubmit}
                  disabled={submitFeedback.isPending}
                  data-testid="button-submit-feedback"
                >
                  {submitFeedback.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {t.analysis_detail.feedback_submit}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      <Dialog open={refreshDialogOpen} onOpenChange={setRefreshDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-refresh">
          <DialogHeader>
            <DialogTitle>{t.analysis_detail.refresh_dialog_title}</DialogTitle>
            <DialogDescription>
              {analysis.userInputContext
                ? t.analysis_detail.refresh_dialog_desc
                : t.analysis_detail.refresh_dialog_no_notes_desc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              value={refreshNotes}
              onChange={(e) => setRefreshNotes(e.target.value)}
              placeholder={t.analysis_detail.refresh_notes_placeholder}
              rows={4}
              className="resize-none text-sm"
              data-testid="textarea-refresh-notes"
            />
            {refreshNotes && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRefreshNotes("")}
                className="h-7 px-2 text-xs text-muted-foreground"
                data-testid="button-clear-refresh-notes"
              >
                {t.analysis_detail.refresh_clear_notes}
              </Button>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRefreshDialogOpen(false)}
              data-testid="button-cancel-refresh"
            >
              {t.analysis_detail.refresh_cancel}
            </Button>
            <Button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              data-testid="button-confirm-refresh"
            >
              {isRefreshing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t.analysis_detail.refresh_confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
