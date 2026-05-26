import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Loader2, TrendingUp, TrendingDown, Minus, CalendarClock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { Layout } from "@/components/layout";
import { useCreateAnalysis, useGetRecentInstruments, getGetRecentInstrumentsQueryKey, useGetAnalysisQuota, getGetAnalysisQuotaQueryKey, type Analysis, type RecentInstruments, type CreateAnalysisBodyTimeframe } from "@workspace/api-client-react";
import { AnalysisChartSection } from "@/components/analysis-chart-section";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useQuoteByInstrument } from "@/hooks/use-live-quotes";
import { useRelevantCalendar } from "@/hooks/use-relevant-calendar";
import type { CalendarEvent } from "@/hooks/use-calendar";
import { useTranslation } from "@/lib/i18n";

function formatPrice(price: number, instrument: string): string {
  if (instrument === "USD/IDR") return price.toLocaleString("id-ID");
  if (instrument === "USD/JPY") return price.toFixed(2);
  if (price > 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return price.toFixed(4);
}

const FUTURES_INSTRUMENTS = ["XAU/USD", "BRENT", "XAG/USD", "HSI", "NIKKEI", "DJIA", "NASDAQ", "DXY"];
const FOREX_INSTRUMENTS = ["AUD/USD", "EUR/USD", "GBP/USD", "USD/CHF", "USD/JPY", "USD/IDR"];
const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W"] as const;

const IMPACT_STYLES: Record<string, string> = {
  "★★★": "text-red-500 bg-red-500/15",
  "★★":  "text-amber-500 bg-amber-500/15",
  "★":   "text-muted-foreground bg-muted",
};

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", AUD: "🇦🇺",
  CAD: "🇨🇦", CHF: "🇨🇭", CNY: "🇨🇳", CHN: "🇨🇳", NZD: "🇳🇿",
  IDR: "🇮🇩", HKD: "🇭🇰", GOLD: "🥇", OIL: "🛢️", OPEC: "🛢️",
};

function RelevantCalendarPreview({ instrument }: { instrument: string }) {
  const { t, lang } = useTranslation();
  const { data, isLoading, isError } = useRelevantCalendar(instrument);
  const events = (data?.events ?? []).filter((e) => !e.actual).slice(0, 5);
  const locale = lang === "id" ? "id-ID" : "en-US";

  return (
    <Card className="p-3 space-y-2 border-amber-500/30 bg-amber-500/[0.03]" data-testid="card-relevant-calendar">
      <div className="flex items-center gap-1.5">
        <CalendarClock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <h3 className="text-xs font-bold text-foreground">
          {t.analyze.calendar_preview_title.replace("{instrument}", instrument)}
        </h3>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground py-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>{t.widgets.loading_calendar}</span>
        </div>
      ) : isError ? (
        <p className="text-[11px] text-muted-foreground py-1">{t.widgets.calendar_error}</p>
      ) : events.length === 0 ? (
        <p className="text-[11px] text-muted-foreground py-1" data-testid="text-calendar-empty">
          {t.analyze.calendar_preview_empty}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {events.map((evt: CalendarEvent, i: number) => {
            const dateLabel = new Date(evt.date + "T00:00:00").toLocaleDateString(locale, {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
            const timeLabel = evt.time?.split(" ")[1] ?? "";
            const impactStyle = IMPACT_STYLES[evt.impact] ?? "bg-muted text-muted-foreground";
            return (
              <li key={i} className="flex items-start gap-1.5 text-[11px] leading-snug" data-testid={`calendar-event-${i}`}>
                <span className={cn("text-[9px] font-bold px-1 py-0.5 rounded shrink-0 mt-0.5", impactStyle)}>
                  {evt.impact}
                </span>
                <span className="text-sm leading-none mt-0.5" aria-hidden="true">
                  {CURRENCY_FLAGS[evt.currency] ?? "🌐"}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="text-foreground font-medium">{evt.event}</span>
                  {evt.forecast && (
                    <span className="text-muted-foreground"> · {t.widgets.calendar_forecast}: <span className="text-foreground">{evt.forecast}</span></span>
                  )}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0 mt-0.5 whitespace-nowrap">
                  {dateLabel} {timeLabel}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[10px] text-muted-foreground italic flex items-start gap-1 leading-relaxed pt-1 border-t border-border/40">
        <span aria-hidden="true">ℹ</span>
        {t.analyze.calendar_preview_note}
      </p>
    </Card>
  );
}

function LivePriceChip({ instrument }: { instrument: string }) {
  const { t } = useTranslation();
  const { quote, isLoading } = useQuoteByInstrument(instrument);
  if (isLoading) return <span className="text-[10px] text-muted-foreground">{t.analyze.loading_price}</span>;
  if (!quote) return null;
  const isUp = quote.direction === "up";
  const isFlat = quote.changePercent === "+0%" || quote.changePercent === "0%";
  return (
    <div className="flex items-center gap-1">
      <span className="font-bold text-foreground tabular-nums">{formatPrice(quote.price, instrument)}</span>
      <span className={cn(
        "text-[10px] font-medium flex items-center gap-0.5",
        isFlat ? "text-muted-foreground" : isUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
      )}>
        {isFlat ? <Minus className="w-2.5 h-2.5" /> : isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
        {quote.changePercent}
      </span>
    </div>
  );
}

export default function AnalyzePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createAnalysis = useCreateAnalysis();
  const queryClient = useQueryClient();
  const { data: quota } = useGetAnalysisQuota({
    query: { queryKey: getGetAnalysisQuotaQueryKey(), staleTime: 30_000 },
  });
  const hourlyQuota = quota?.hourly;
  const dailyQuota = quota?.daily;
  const canShowQuotaChip = Boolean(
    quota && !quota.unlimited && hourlyQuota && dailyQuota,
  );

  const [activeTab, setActiveTab] = useState<"futures" | "forex">("futures");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [customInstrument, setCustomInstrument] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1D");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Most recently generated analysis. Kept on the page so we can render the
  // trade-plan price-lines chart inline (task #102) without forcing a nav
  // jump to the detail page first. The result keeps showing while the user
  // tweaks inputs for a follow-up run — it only goes away once they hit
  // "Start a new analysis" (which also scrolls them back to the top), so
  // the chart they just got isn't yanked out from under them mid-comparison.
  const [result, setResult] = useState<Analysis | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inst = params.get("instrument");
    if (inst) setSelectedInstrument(inst);
  }, []);

  useEffect(() => {
    if (isLoading) {
      intervalRef.current = setInterval(() => {
        setLoadingMsgIndex((i) => (i + 1) % t.analyze.loading.length);
      }, 1800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLoadingMsgIndex(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLoading, t]);

  const { data: recentData } = useGetRecentInstruments({
    query: { queryKey: getGetRecentInstrumentsQueryKey(), staleTime: 60_000 },
  });
  const recentInstruments = (recentData as RecentInstruments | undefined)?.instruments?.slice(0, 3) ?? [];

  const finalInstrument = customInstrument.trim() || selectedInstrument;

  const handleSubmit = async () => {
    if (!finalInstrument) {
      toast({ title: t.analyze.error_no_instrument, description: t.analyze.error_no_instrument_desc, variant: "destructive" });
      return;
    }
    if (!selectedTimeframe) {
      toast({ title: t.analyze.error_no_timeframe, description: t.analyze.error_no_timeframe_desc, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const created = await createAnalysis.mutateAsync({
        data: {
          instrument: finalInstrument,
          timeframe: selectedTimeframe as CreateAnalysisBodyTimeframe,
          mode: user?.selectedMode ?? "beginner",
          userInputContext: notes || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetAnalysisQuotaQueryKey() });
      // Show the trade-plan chart inline so users can sanity-check the AI's
      // entry/SL/TP against the live tape immediately. Detail page is still
      // a click away via the CTA below.
      setResult(created);
      // Defer the scroll until after the result section paints.
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err: unknown) {
      const apiErr = err as { status?: number; data?: { error?: string } };
      const isQuota = apiErr?.status === 429;
      if (isQuota) {
        queryClient.invalidateQueries({ queryKey: getGetAnalysisQuotaQueryKey() });
      }
      toast({
        title: isQuota ? t.analyze.quota_title : t.analyze.failed_title,
        description: apiErr?.data?.error ?? t.analyze.failed_desc,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setLocation("/dashboard")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{t.analyze.title}</h1>
            <p className="text-xs text-muted-foreground">
              {t.analyze.mode_label}: {user?.selectedMode === "beginner" ? t.common.beginner : t.common.pro}
            </p>
          </div>
          {canShowQuotaChip && hourlyQuota && dailyQuota && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
                hourlyQuota.remaining === 0 || dailyQuota.remaining === 0
                  ? "bg-destructive/10 border-destructive/40 text-destructive"
                  : hourlyQuota.remaining <= 1 || dailyQuota.remaining <= 3
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  : "bg-primary/10 border-primary/30 text-primary",
              )}
              data-testid="chip-quota"
              title={`${t.analyze.quota_hour}: ${hourlyQuota.remaining}/${hourlyQuota.limit} • ${t.analyze.quota_day}: ${dailyQuota.remaining}/${dailyQuota.limit}`}
            >
              {hourlyQuota.remaining}/{hourlyQuota.limit} {t.analyze.quota_hour_short} · {dailyQuota.remaining}/{dailyQuota.limit} {t.analyze.quota_day_short}
            </span>
          )}
        </div>

        <div className="space-y-5">
          {recentInstruments.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">{t.dashboard.last_analyzed}</h2>
              <div className="flex gap-2 flex-wrap">
                {recentInstruments.map((r) => (
                  <button
                    key={r.instrument}
                    onClick={() => { setSelectedInstrument(r.instrument); setCustomInstrument(""); }}
                    data-testid={`button-recent-${r.instrument}`}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5",
                      selectedInstrument === r.instrument && !customInstrument
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    <span>{r.instrument}</span>
                    <span className="text-muted-foreground text-[10px]">{r.mode === "beginner" ? t.common.beginner : t.common.pro}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.analyze.select_instrument}</h2>
            <div className="flex gap-2 mb-3">
              {(["futures", "forex"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  data-testid={`tab-${tab}`}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg border transition-all",
                    activeTab === tab
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border"
                  )}
                >
                  {tab === "futures" ? t.analyze.tab_futures : t.analyze.tab_forex}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(activeTab === "futures" ? FUTURES_INSTRUMENTS : FOREX_INSTRUMENTS).map((inst) => (
                <button
                  key={inst}
                  onClick={() => { setSelectedInstrument(inst); setCustomInstrument(""); }}
                  data-testid={`button-instrument-${inst}`}
                  className={cn(
                    "py-2.5 text-sm font-medium rounded-lg border transition-all",
                    selectedInstrument === inst && !customInstrument
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-foreground hover:border-primary/50"
                  )}
                >
                  {inst}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder={t.analyze.or_type}
                value={customInstrument}
                onChange={(e) => {
                  setCustomInstrument(e.target.value);
                  if (e.target.value) setSelectedInstrument("");
                }}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                data-testid="input-custom-instrument"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.analyze.select_timeframe}</h2>
            <div className="flex flex-wrap gap-2">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  data-testid={`button-timeframe-${tf}`}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg border transition-all",
                    selectedTimeframe === tf
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">{t.analyze.notes_label}</h2>
            </div>
            {finalInstrument && <RelevantCalendarPreview instrument={finalInstrument} />}
            <Textarea
              placeholder={t.analyze.notes_placeholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="resize-y text-sm leading-relaxed min-h-[140px]"
              data-testid="textarea-notes"
            />
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-start gap-1 leading-relaxed">
              <span className="text-primary mt-0.5" aria-hidden="true">ℹ</span>
              {t.analyze.broker_warning}
            </p>
          </div>

          {finalInstrument && selectedTimeframe && (
            <Card className="p-3 bg-muted/50 border-dashed">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.analyze.instrument_label}:</span>
                <span className="font-semibold text-foreground">{finalInstrument}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">{t.analyze.current_price}:</span>
                <LivePriceChip instrument={finalInstrument} />
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">{t.analyze.timeframe_label}:</span>
                <span className="font-semibold text-foreground">{selectedTimeframe}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">{t.analyze.mode_label}:</span>
                <span className="font-semibold text-foreground">
                  {user?.selectedMode === "beginner" ? t.common.beginner : t.common.pro}
                </span>
              </div>
            </Card>
          )}

          <Button
            className="w-full h-12 text-base"
            onClick={handleSubmit}
            disabled={isLoading || !finalInstrument || !selectedTimeframe}
            data-testid="button-submit-analysis"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">{t.analyze.loading[loadingMsgIndex]}</span>
              </div>
            ) : t.analyze.submit_btn}
          </Button>

          {result && (
            <div
              ref={resultRef}
              className="space-y-3 pt-2"
              data-testid="analyze-result-section"
              data-analysis-id={result.id}
            >
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {t.analyze.result_preview_title}
                </h2>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  {t.analyze.result_preview_subtitle}
                </p>
              </div>
              <AnalysisChartSection
                instrument={result.instrument}
                timeframe={result.timeframe}
                tradePlan={result.tradePlan ?? null}
                analysisCreatedAt={result.createdAt}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  data-testid="button-new-analysis"
                >
                  {t.analyze.new_analysis}
                </Button>
                <Button
                  onClick={() => setLocation(`/analyses/${result.id}`)}
                  data-testid="button-view-full-analysis"
                >
                  {t.analyze.view_full_analysis}
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {t.analyze.disclaimer}
          </p>
          <p
            className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 text-center leading-relaxed"
            data-testid="text-risk-disclaimer-short"
          >
            {t.analyze.risk_disclaimer_short}
          </p>
        </div>
      </div>
    </Layout>
  );
}
