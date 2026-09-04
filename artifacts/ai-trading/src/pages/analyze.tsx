import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft, Loader2, TrendingUp, TrendingDown, Minus, CalendarClock, Bell, Newspaper, AlertTriangle } from "lucide-react";
import { TradingViewEconomicCalendar } from "@/components/tradingview-economic-calendar";
import { SetAlertModal } from "@/components/set-alert-modal";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { useTrackEvent } from "@/hooks/use-track-event";
import { showQuotaDialog, type QuotaScope } from "@/hooks/use-quota-dialog";
import { Layout } from "@/components/layout";
import { useCreateAnalysis, useGetAnalysisQuota, getGetAnalysisQuotaQueryKey, type CreateAnalysisBodyTimeframe, type UserSelectedMode } from "@workspace/api-client-react";
import {
  TradingViewMiniChart,
  type MiniChartDateRange,
} from "@/components/tradingview-mini-chart";
import { instrumentToTradingViewSymbol, instrumentToCurrencies, currenciesToCountryFilter } from "@/lib/tradingview-symbols";
import { MarketSessionsBadge } from "@/components/market-sessions-badge";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useQuoteByInstrument } from "@/hooks/use-live-quotes";
import { useRelevantCalendar } from "@/hooks/use-relevant-calendar";
import type { CalendarEvent } from "@/hooks/use-calendar";
import { useTranslation } from "@/lib/i18n";
import { explainerFor } from "@/lib/event-explainers";
import { MentalChecklist } from "@/components/mental-checklist";
import { LocalSentimentWidget } from "@/components/local-sentiment-widget";
import { useMentalChecklistPref } from "@/hooks/use-mental-checklist";
import { AntiPatternGuardrails } from "@/components/anti-pattern-guardrails";
import { CoolingOffBreathingDialog } from "@/components/cooling-off-breathing-dialog";
import { useAntiPatternSignals } from "@/hooks/use-anti-pattern-signals";
import AnalysisDetailPage from "./analysis-detail";

function formatPrice(price: number, instrument: string): string {
  if (instrument === "USD/IDR") return price.toLocaleString("id-ID");
  if (instrument === "USD/JPY") return price.toFixed(2);
  if (price > 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return price.toFixed(4);
}

const FUTURES_INSTRUMENTS = ["XAU/USD", "BRENT", "XAG/USD", "HSI", "NIKKEI", "DJIA", "NASDAQ", "DXY"];
const FOREX_INSTRUMENTS = ["AUD/USD", "EUR/USD", "GBP/USD", "USD/CHF", "USD/JPY", "USD/IDR"];
const CRYPTO_INSTRUMENTS_PICKER = ["BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD", "XRP/USD"];
type InstrumentCategory = "futures" | "forex" | "crypto";

// Temporarily narrows the instrument picker to this allowlist without
// deleting the underlying instrument data above, so the rest can be
// re-enabled later just by clearing this list.
const VISIBLE_INSTRUMENTS = new Set(["XAU/USD", "BRENT", "NIKKEI", "HSI"]);

const AVAILABLE_CALENDAR_CURRENCIES = Array.from(
  new Set(
    [...FUTURES_INSTRUMENTS, ...FOREX_INSTRUMENTS, ...CRYPTO_INSTRUMENTS_PICKER]
      .flatMap(instrumentToCurrencies),
  ),
);

function instrumentsForTab(tab: InstrumentCategory): string[] {
  switch (tab) {
    case "futures":
      return FUTURES_INSTRUMENTS.filter((inst) => VISIBLE_INSTRUMENTS.has(inst));
    case "forex":
      return FOREX_INSTRUMENTS.filter((inst) => VISIBLE_INSTRUMENTS.has(inst));
    case "crypto":
      return CRYPTO_INSTRUMENTS_PICKER.filter((inst) => VISIBLE_INSTRUMENTS.has(inst));
  }
}

const VISIBLE_INSTRUMENT_CATEGORIES = (["futures", "forex", "crypto"] as const).filter(
  (tab) => instrumentsForTab(tab).length > 0,
);

function categoryForInstrument(instrument: string): InstrumentCategory {
  if (CRYPTO_INSTRUMENTS_PICKER.includes(instrument)) return "crypto";
  if (FOREX_INSTRUMENTS.includes(instrument)) return "forex";
  return "futures";
}

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

let calendarExplainerSeq = 0;

function CalendarEventExplainer({ event }: { event: CalendarEvent }) {
  const { t, lang } = useTranslation();
  const [open, setOpen] = useState(false);
  const [panelId] = useState(() => `cal-explainer-${++calendarExplainerSeq}`);
  // Prefer the upstream-provided text when present; otherwise look up
  // the local dictionary. If neither yields anything, render nothing.
  const dict = explainerFor(event.event, lang);
  const upstream = event.whyTraderCare?.trim();
  if (!dict && !upstream) return null;
  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[10px] font-medium text-primary hover:underline"
        data-testid="button-event-explainer-toggle"
        aria-expanded={open}
        aria-controls={panelId}
      >
        {open ? t.analyze.pre_trade_warning_explainer_hide : t.analyze.calendar_event_explainer_btn}
      </button>
      {open && (
        <div id={panelId} className="mt-1 rounded-lg bg-muted/60 p-2 space-y-1.5 text-[11px] leading-snug">
          {dict ? (
            <>
              <p className="font-semibold text-foreground">{dict.headline}</p>
              <p className="text-foreground/90">{dict.what}</p>
              <p className="text-foreground/85">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">↑ {t.analyze.explainer_if_higher_label}: </span>
                {dict.if_higher}
              </p>
              <p className="text-foreground/85">
                <span className="font-medium text-red-500 dark:text-red-400">↓ {t.analyze.explainer_if_lower_label}: </span>
                {dict.if_lower}
              </p>
            </>
          ) : (
            <p className="text-foreground/85">{upstream}</p>
          )}
        </div>
      )}
    </div>
  );
}

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
                  <CalendarEventExplainer event={evt} />
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

// Pre-trade warning: surface a prominent inline callout when a ★★★ macro
// release for the selected instrument's currencies is within the next
// `PRE_TRADE_WARN_WINDOW_MIN` minutes. Mirrors the same "★★★ only" filter
// the embedded TradingView calendar uses (importanceFilter="1"), so users
// don't see the chip for low-tier events.
const PRE_TRADE_WARN_WINDOW_MIN = 30;
const PRE_TRADE_TICK_MS = 30_000;

function eventEpoch(evt: CalendarEvent): number | null {
  // Prefer the absolute UTC instant the server computed (see
  // lib/calendar.ts → `eventEpochMs`). Falling back to a UTC-anchored
  // parse of `date` + `time` keeps the warning working if an older
  // payload without `epochMs` is still in the React Query cache, and
  // keeps the "minutes until release" identical for users in any time
  // zone — the previous naive `Date.parse(...)` relied on the browser's
  // local TZ and silently drifted for non-WIB clients.
  if (typeof evt.epochMs === "number" && Number.isFinite(evt.epochMs)) {
    return evt.epochMs;
  }
  if (!evt.date) return null;
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(evt.date);
  if (!dateMatch) return null;
  const y = Number(dateMatch[1]);
  const mon = Number(dateMatch[2]);
  const d = Number(dateMatch[3]);
  let h = 0;
  let min = 0;
  if (evt.time) {
    const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(evt.time);
    if (!timeMatch) return null;
    h = Number(timeMatch[1]);
    min = Number(timeMatch[2]);
  }
  const ts = Date.UTC(y, mon - 1, d, h, min, 0, 0);
  return Number.isFinite(ts) ? ts : null;
}

function PreTradeWarning({ instrument }: { instrument: string }) {
  const { t, lang } = useTranslation();
  const [explainerOpen, setExplainerOpen] = useState(false);
  const explainerPanelId = "pre-trade-warning-explainer-panel";
  // Ask for a wider window than the default preview cap so an unusually
  // packed week (multiple ★★★ events for the same currency on FOMC /
  // NFP days) can't silently truncate the imminent event off the list.
  const { data } = useRelevantCalendar(instrument, { maxItems: 20 });
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), PRE_TRADE_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const events = data?.events ?? [];
  // Pick the soonest unreleased ★★★ event whose start is within the
  // warning window. Sort by absolute time so an event 5 min away wins
  // over one 25 min away even if the upstream order is impact-sorted.
  let soonest: { event: CalendarEvent; minutes: number } | null = null;
  for (const evt of events) {
    if (evt.actual) continue;
    if (evt.impact !== "★★★") continue;
    const ts = eventEpoch(evt);
    if (ts === null) continue;
    const diffMin = (ts - now) / 60_000;
    if (diffMin <= 0 || diffMin > PRE_TRADE_WARN_WINDOW_MIN) continue;
    if (!soonest || diffMin < soonest.minutes) {
      soonest = { event: evt, minutes: diffMin };
    }
  }

  if (!soonest) return null;

  const flag = CURRENCY_FLAGS[soonest.event.currency] ?? "🌐";
  const eventLabel = `${flag} ${soonest.event.event}`;
  const minutes = Math.floor(soonest.minutes);
  const message =
    minutes < 1
      ? t.analyze.pre_trade_warning_any_moment.replace("{event}", eventLabel)
      : t.analyze.pre_trade_warning_in_minutes
          .replace("{event}", eventLabel)
          .replace("{minutes}", String(minutes));

  return (
    <div
      role="alert"
      data-testid="pre-trade-warning"
      data-event-currency={soonest.event.currency}
      data-event-minutes={minutes}
      className="rounded-lg border border-amber-500/60 bg-amber-500/10 dark:bg-amber-500/[0.08] p-3 flex items-start gap-2"
    >
      <AlertTriangle
        className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 leading-tight">
          ⚠ {t.analyze.pre_trade_warning_title}
        </p>
        <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-snug mt-0.5">
          {message}
        </p>
        {(() => {
          const dict = explainerFor(soonest.event.event, lang);
          const upstream = soonest.event.whyTraderCare?.trim();
          if (!dict && !upstream) return null;
          return (
            <div className="mt-1.5">
              <button
                type="button"
                onClick={() => setExplainerOpen((v) => !v)}
                className="text-[11px] font-medium text-amber-700 dark:text-amber-300 underline-offset-2 hover:underline"
                data-testid="button-pre-trade-explainer-toggle"
                aria-expanded={explainerOpen}
                aria-controls={explainerPanelId}
              >
                {explainerOpen
                  ? t.analyze.pre_trade_warning_explainer_hide
                  : t.analyze.pre_trade_warning_explainer_btn}
              </button>
              {explainerOpen && (
                <div id={explainerPanelId} className="mt-1.5 rounded-md bg-amber-500/[0.06] border border-amber-500/30 p-2 space-y-1 text-[11px] leading-snug text-amber-900 dark:text-amber-100">
                  {dict ? (
                    <>
                      <p className="font-semibold">{dict.headline}</p>
                      <p>{dict.what}</p>
                      <p>
                        <span className="font-medium text-emerald-700 dark:text-emerald-300">↑ {t.analyze.explainer_if_higher_label}: </span>
                        {dict.if_higher}
                      </p>
                      <p>
                        <span className="font-medium text-red-700 dark:text-red-300">↓ {t.analyze.explainer_if_lower_label}: </span>
                        {dict.if_lower}
                      </p>
                    </>
                  ) : (
                    <p>{upstream}</p>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

const ECON_CAL_CURRENCIES_KEY_BASE = "analyze.economicCalendar.currencies";
const SHOW_SECONDARY_ANALYSIS_CARDS = false;
const SHOW_NOTES_INPUT = false;
const SHOW_ECONOMIC_CALENDAR_SECTION = false;
const SHOW_RELEVANT_CALENDAR_PREVIEW = false;
const SHOW_TIMEFRAME_PICKER = false;

// Narrows the mini-chart range picker to this allowlist without deleting
// the other options above, so they're a one-line revert away.
const VISIBLE_MINI_CHART_RANGES = new Set<MiniChartDateRange>(["1M", "3M"]);
type CalendarImpactFilter = "-1" | "0" | "1";

function readStoredCurrencies(storageKey: string): string[] | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw == null) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((c): c is string => typeof c === "string");
  } catch {
    return null;
  }
}

function EconomicCalendarSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const availableCurrencies = AVAILABLE_CALENDAR_CURRENCIES;

  const storageKey = `${ECON_CAL_CURRENCIES_KEY_BASE}.${user?.id ?? "anon"}`;

  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    () => readStoredCurrencies(storageKey) ?? [],
  );
  const [impactFilter, setImpactFilter] = useState<CalendarImpactFilter>("-1");

  useEffect(() => {
    const stored = readStoredCurrencies(storageKey);
    setSelectedCurrencies(stored ?? []);
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(selectedCurrencies));
    } catch {}
  }, [storageKey, selectedCurrencies]);

  const toggleCurrency = (currency: string) => {
    setSelectedCurrencies((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency],
    );
  };

  const clearCurrencies = () => setSelectedCurrencies([]);
  const clearCalendarFilters = () => {
    setSelectedCurrencies([]);
    setImpactFilter("-1");
  };

  const effectiveCurrencies = selectedCurrencies.filter((c) =>
    availableCurrencies.includes(c),
  );
  const countryFilter = currenciesToCountryFilter(effectiveCurrencies);
  const allActive = effectiveCurrencies.length === 0;

  return (
    <Card className="p-3 space-y-2" data-testid="card-economic-calendar">
      <div className="flex items-center gap-1.5 min-w-0">
        <Newspaper className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-foreground truncate">
            {t.analyze.economic_calendar_section_title}
          </h3>
        </div>
      </div>
      <div className="pt-1 space-y-2">
        <p className="text-[10px] text-muted-foreground leading-snug">
          {t.analyze.economic_calendar_section_hint}
        </p>
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label={t.analyze.economic_calendar_impact_filter_label}
          data-testid="economic-calendar-impact-chips"
        >
          <span className="text-[10px] text-muted-foreground">
            {t.analyze.economic_calendar_impact_filter_label}:
          </span>
          {([
            ["-1", t.analyze.economic_calendar_impact_filter_all],
            ["0", t.analyze.economic_calendar_impact_filter_medium],
            ["1", t.analyze.economic_calendar_impact_filter_high],
          ] as const).map(([value, label]) => {
            const active = impactFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setImpactFilter(value)}
                aria-pressed={active}
                data-testid={`chip-economic-calendar-impact-${value}`}
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label={t.analyze.economic_calendar_currency_filter_label}
          data-testid="economic-calendar-currency-chips"
        >
          <button
            type="button"
            onClick={clearCurrencies}
            aria-pressed={allActive}
            data-testid="chip-economic-calendar-currency-all"
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors",
              allActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/40 text-muted-foreground border-border hover:bg-muted",
            )}
          >
            {t.analyze.economic_calendar_currency_filter_all}
          </button>
          {availableCurrencies.map((currency) => {
            const active = effectiveCurrencies.includes(currency);
            const flag = CURRENCY_FLAGS[currency] ?? "";
            return (
              <button
                key={currency}
                type="button"
                onClick={() => toggleCurrency(currency)}
                aria-pressed={active}
                data-testid={`chip-economic-calendar-currency-${currency}`}
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted",
                )}
              >
                {flag ? <span className="mr-1" aria-hidden="true">{flag}</span> : null}
                {currency}
              </button>
            );
          })}
        </div>
        <p
          className="text-[10px] text-muted-foreground"
          data-testid="economic-calendar-currency-status"
        >
          {allActive
            ? t.analyze.economic_calendar_currency_filter_all_active
            : t.analyze.economic_calendar_currency_filter_active.replace(
                "{currencies}",
                effectiveCurrencies.join(", "),
              )}
        </p>
        <TradingViewEconomicCalendar
          height={420}
          importanceFilter={impactFilter}
          countryFilter={countryFilter}
          currencyFilter={effectiveCurrencies}
          onClearFilters={clearCalendarFilters}
        />
      </div>
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
  const { t } = useTranslation();
  const { toast } = useToast();
  const createAnalysis = useCreateAnalysis();
  const trackEvent = useTrackEvent();
  const queryClient = useQueryClient();
  const { data: quota } = useGetAnalysisQuota({
    query: { queryKey: getGetAnalysisQuotaQueryKey(), staleTime: 30_000 },
  });
  const hourlyQuota = quota?.hourly;
  const dailyQuota = quota?.daily;
  const canShowQuotaChip = Boolean(
    quota && !quota.unlimited && hourlyQuota && dailyQuota,
  );

  const [openInstrumentCategory, setOpenInstrumentCategory] = useState<InstrumentCategory | null>("futures");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [customInstrument, setCustomInstrument] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");
  // Mode selection is retired — every analysis now runs in "pro" mode.
  // Kept as a variable (rather than a literal) since createAnalysis,
  // the notes gate, and the review card below all still read it.
  const selectedMode: UserSelectedMode = "pro";
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  // Holds the just-created analysis id so its full result renders inline
  // below the form instead of navigating to /analyses/:id.
  const [resultAnalysisId, setResultAnalysisId] = useState<number | null>(null);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { enabled: mentalChecklistEnabled } = useMentalChecklistPref();

  useEffect(() => {
    if (resultAnalysisId != null) {
      resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultAnalysisId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inst = params.get("instrument");
    const tf = params.get("timeframe");
    if (inst) {
      setSelectedInstrument(inst);
      setOpenInstrumentCategory(categoryForInstrument(inst));
    }
    if (tf && (TIMEFRAMES as readonly string[]).includes(tf)) {
      setSelectedTimeframe(tf);
    }
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

  const finalInstrument = customInstrument.trim() || selectedInstrument;
  const [miniChartRange, setMiniChartRange] = useState<MiniChartDateRange>("1M");
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Imperative handle exposed by AntiPatternGuardrails. When the user
  // clicks Analyse despite any active warnings we call it so the
  // component can fire `proceeded: true` telemetry — supports the
  // Mirror digest "you ignored N revenge warnings this week" metric.
  const guardrailProceedRef = useRef<(() => void) | null>(null);
  const [coolingOffActive, setCoolingOffActive] = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);
  // The guardrails query also feeds the breathing dialog with the
  // exact loss % the cooling-off countdown was triggered by, so the
  // confirmation copy is concrete instead of generic.
  const { data: guardrailData } = useAntiPatternSignals(finalInstrument);
  const coolingOffLoss =
    guardrailData?.signals.find((s) => s.kind === "cooling_off")?.lossPnlPercent ?? null;

  const runAnalysis = async (instrumentOverride?: string) => {
    const instrumentToUse = instrumentOverride ?? finalInstrument;
    guardrailProceedRef.current?.();
    setIsLoading(true);
    try {
      const created = await createAnalysis.mutateAsync({
        data: {
          instrument: instrumentToUse,
          timeframe: selectedTimeframe as CreateAnalysisBodyTimeframe,
          mode: selectedMode,
          userInputContext: selectedMode === "pro" ? notes || undefined : undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetAnalysisQuotaQueryKey() });
      trackEvent("analysis_created", { instrument: instrumentToUse, timeframe: selectedTimeframe });
      // Render the result inline right below the form instead of
      // navigating to /analyses/:id — same page, no extra hop. The
      // embedded detail view loads this same ID; it does not create
      // another analysis.
      setResultAnalysisId(created.id);
    } catch (err: unknown) {
      const apiErr = err as {
        status?: number;
        data?: { error?: string; quota?: { scope: QuotaScope; limit?: number; used?: number } };
      };
      const isQuota = apiErr?.status === 429;
      if (isQuota) {
        queryClient.invalidateQueries({ queryKey: getGetAnalysisQuotaQueryKey() });
      }
      if (isQuota && apiErr.data?.quota) {
        showQuotaDialog(apiErr.data.quota);
      } else {
        toast({
          title: isQuota ? t.analyze.quota_title : t.analyze.failed_title,
          description: apiErr?.data?.error ?? t.analyze.failed_desc,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (instrumentOverride?: string) => {
    const instrumentToUse = instrumentOverride ?? finalInstrument;
    if (!instrumentToUse) {
      toast({ title: t.analyze.error_no_instrument, description: t.analyze.error_no_instrument_desc, variant: "destructive" });
      return;
    }
    if (!selectedTimeframe) {
      toast({ title: t.analyze.error_no_timeframe, description: t.analyze.error_no_timeframe_desc, variant: "destructive" });
      return;
    }
    // Cooling-off interception: an active countdown routes the submit
    // through the breathing-exercise dialog. The dialog's explicit
    // "Continue anyway" tap is the only way to actually run the
    // analysis — keeping the guardrail soft (bypassable) but
    // friction-laden, per task #163.
    if (coolingOffActive) {
      setBreathingOpen(true);
      return;
    }
    await runAnalysis(instrumentToUse);
  };

  // Once a result already exists on the page, picking a different preset
  // instrument re-analyzes immediately instead of requiring another tap on
  // the Analisis button — matches the "Ganti Timeframe" quick-switch below
  // the result. The very first analysis still requires the explicit button.
  const handleInstrumentClick = (inst: string) => {
    setSelectedInstrument(inst);
    setCustomInstrument("");
    if (resultAnalysisId != null && inst !== finalInstrument && !isLoading) {
      void handleSubmit(inst);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-5 md:max-w-3xl md:mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{t.analyze.title}</h1>
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

        <div className="mb-4 flex justify-start">
          <MarketSessionsBadge instrument={finalInstrument || undefined} />
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.analyze.select_instrument}</h2>
            {VISIBLE_INSTRUMENT_CATEGORIES.length > 1 ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {VISIBLE_INSTRUMENT_CATEGORIES.map((tab) => {
                    const isOpen = openInstrumentCategory === tab;
                    return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setOpenInstrumentCategory((current) => current === tab ? null : tab)}
                      data-testid={`tab-${tab}`}
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? "instrument-options" : undefined}
                      className={cn(
                        "flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-lg border transition-all",
                        isOpen
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {tab === "futures"
                        ? t.analyze.tab_futures
                        : tab === "forex"
                          ? t.analyze.tab_forex
                          : t.analyze.tab_crypto}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                    </button>
                    );
                  })}
                </div>
                {openInstrumentCategory && (
                  <div id="instrument-options" className="grid grid-cols-2 gap-2" data-testid="instrument-options">
                    {instrumentsForTab(openInstrumentCategory).map((inst) => (
                      <button
                        key={inst}
                        type="button"
                        onClick={() => handleInstrumentClick(inst)}
                        data-testid={`button-instrument-${inst}`}
                        className={cn(
                          "w-full py-2.5 px-3 rounded-lg border text-sm font-medium text-left transition-all",
                          selectedInstrument === inst && !customInstrument
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background border-border text-foreground hover:border-primary/50"
                        )}
                      >
                        {inst}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Only one category has any visible instruments right now
              // (VISIBLE_INSTRUMENTS in this file), so the tab toggle would
              // just be a single button that always opens the same list —
              // skip it and show the instruments directly. Restores itself
              // automatically once a second category has visible items.
              <div className="grid grid-cols-2 gap-2 mb-3" data-testid="instrument-options">
                {instrumentsForTab(VISIBLE_INSTRUMENT_CATEGORIES[0]).map((inst) => (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => handleInstrumentClick(inst)}
                    data-testid={`button-instrument-${inst}`}
                    className={cn(
                      "w-full py-2.5 px-3 rounded-lg border text-sm font-medium text-left transition-all",
                      selectedInstrument === inst && !customInstrument
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            )}
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

          {SHOW_TIMEFRAME_PICKER && (
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
          )}

          <div className="space-y-3">
            {SHOW_RELEVANT_CALENDAR_PREVIEW && finalInstrument && <RelevantCalendarPreview instrument={finalInstrument} />}
            {SHOW_NOTES_INPUT && selectedMode === "pro" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="analysis-notes" className="text-sm font-semibold text-foreground">
                      {t.analyze.notes_label}
                    </label>
                    <p
                      id="analysis-notes-helper"
                      className="text-xs leading-relaxed text-muted-foreground"
                      data-testid="notes-helper-text"
                    >
                      {t.analyze.notes_helper}
                    </p>
                  </div>
                </div>
                <Textarea
                  id="analysis-notes"
                  placeholder={t.analyze.notes_placeholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  aria-describedby="analysis-notes-helper analysis-notes-broker-warning"
                  className="resize-y text-sm leading-relaxed min-h-[140px] text-foreground placeholder:text-muted-foreground/70 placeholder:italic"
                  data-testid="textarea-notes"
                />
                <p
                  id="analysis-notes-broker-warning"
                  className="text-[10px] text-muted-foreground mt-1.5 flex items-start gap-1 leading-relaxed"
                  data-testid="notes-broker-hint"
                >
                  <span className="text-primary mt-0.5" aria-hidden="true">ℹ</span>
                  {t.analyze.broker_warning}
                </p>
              </>
            )}
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
              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setAlertModalOpen(true)}
                  data-testid="button-set-alert"
                  className="text-xs gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {t.analyze.set_alert_btn}
                </Button>
              </div>
              <div className="mt-3 space-y-2" data-testid="mini-chart-section">
                <TradingViewMiniChart
                  symbol={instrumentToTradingViewSymbol(finalInstrument)}
                  dateRange={miniChartRange}
                />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {t.widgets.mini_chart_range_title}
                  </h3>
                  <div className="flex gap-1" role="group" aria-label={t.widgets.mini_chart_range_title}>
                    {(["1D", "1W", "1M", "3M", "1Y"] as const)
                      .filter((r) => VISIBLE_MINI_CHART_RANGES.has(r))
                      .map((r) => {
                      const labelKey = `mini_chart_range_${r.toLowerCase()}` as
                        | "mini_chart_range_1d"
                        | "mini_chart_range_1w"
                        | "mini_chart_range_1m"
                        | "mini_chart_range_3m"
                        | "mini_chart_range_1y";
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setMiniChartRange(r)}
                          data-testid={`button-mini-chart-range-${r}`}
                          aria-pressed={miniChartRange === r}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-medium rounded-md border transition-all",
                            miniChartRange === r
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:border-primary/50",
                          )}
                        >
                          {t.widgets[labelKey]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mt-3">
                <span className="text-muted-foreground">{t.analyze.timeframe_label}:</span>
                <span className="font-semibold text-foreground">{selectedTimeframe}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">{t.analyze.mode_label}:</span>
                <span className="font-semibold text-foreground">
                  {t.common.pro}
                </span>
              </div>
            </Card>
          )}

          {SHOW_SECONDARY_ANALYSIS_CARDS && finalInstrument && (
            <LocalSentimentWidget instrument={finalInstrument} />
          )}

          {finalInstrument && <PreTradeWarning instrument={finalInstrument} />}

          {SHOW_SECONDARY_ANALYSIS_CARDS && finalInstrument && (
            <AntiPatternGuardrails
              instrument={finalInstrument}
              proceedHandleRef={guardrailProceedRef}
              onCoolingOffChange={setCoolingOffActive}
            />
          )}
          <CoolingOffBreathingDialog
            open={breathingOpen}
            onClose={() => setBreathingOpen(false)}
            onContinueAnyway={() => {
              setBreathingOpen(false);
              void runAnalysis();
            }}
            lossPnlPercent={coolingOffLoss}
          />


          {mentalChecklistEnabled && finalInstrument && selectedTimeframe && <MentalChecklist />}

          {resultAnalysisId == null && (
            <Button
              className="w-full h-12 text-base"
              onClick={() => handleSubmit()}
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
          )}

          {/* Once a result already exists, picking a different instrument
              re-analyzes without the submit button (it's hidden above) —
              show the AI-processing wait state as a popup instead. */}
          <Dialog open={isLoading && resultAnalysisId != null}>
            <DialogContent
              className="sm:max-w-sm text-center [&>button]:hidden"
              data-testid="dialog-reanalyzing"
            >
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  {t.analyze.loading[loadingMsgIndex]}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {resultAnalysisId != null && (
            <div
              ref={resultSectionRef}
              className="pt-4 border-t border-border"
              data-testid="embedded-analysis-result"
            >
              <AnalysisDetailPage params={{ id: String(resultAnalysisId) }} embedded />
            </div>
          )}

          {SHOW_ECONOMIC_CALENDAR_SECTION && <EconomicCalendarSection />}

          <p
            className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 text-center leading-relaxed"
            data-testid="text-risk-disclaimer-short"
          >
            {t.analyze.risk_disclaimer_short}
          </p>
        </div>
      </div>
      <SetAlertModal
        open={alertModalOpen}
        onOpenChange={setAlertModalOpen}
        instrument={finalInstrument}
      />
    </Layout>
  );
}
