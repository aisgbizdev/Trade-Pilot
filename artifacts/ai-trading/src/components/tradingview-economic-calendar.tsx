import { useEffect, useMemo, useState } from "react";
import { Calendar, Loader2, WifiOff } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useCalendar, type CalendarEvent } from "@/hooks/use-calendar";
import { cn } from "@/lib/utils";
import {
  calendarDateWindow,
  eventIsWithinCalendarWindow,
} from "@/lib/calendar-window";

interface TradingViewEconomicCalendarProps {
  height?: number;
  importanceFilter?: "-1" | "0" | "1";
  loadTimeoutMs?: number;
  countryFilter?: string;
  currencyFilter?: string[];
}

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  CHN: "🇨🇳",
  NZD: "🇳🇿",
  IDR: "🇮🇩",
  HKD: "🇭🇰",
  GOLD: "🥇",
  OIL: "🛢️",
  OPEC: "🛢️",
};

const IMPACT_RANK: Record<string, number> = {
  "★★★": 3,
  "★★": 2,
  "★": 1,
};

function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return online;
}

function matchesImportance(event: CalendarEvent, importanceFilter: "-1" | "0" | "1"): boolean {
  if (importanceFilter === "-1") return true;
  if (importanceFilter === "0") return event.impact === "★★" || event.impact === "★★★";
  return event.impact === "★★★";
}

function formatEventTime(event: CalendarEvent): string {
  if (!event.time) return "";
  const timePart = event.time.split(/\s+/).at(-1) ?? event.time;
  return timePart;
}

function CalendarEventRow({ event, locale }: { event: CalendarEvent; locale: string }) {
  return (
    <li className="grid grid-cols-[3.5rem_1.25rem_minmax(0,1fr)_auto] items-start gap-2 border-b border-border/50 py-2.5 last:border-0">
      <span className="pt-0.5 text-[10px] font-mono text-muted-foreground">
        {formatEventTime(event)}
      </span>
      <span className="pt-0.5 text-sm leading-none" aria-hidden="true">
        {CURRENCY_FLAGS[event.currency] ?? "🌐"}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className={cn(
            "rounded px-1.5 py-0.5 text-[9px] font-bold",
            event.impact === "★★★"
              ? "bg-red-500/15 text-red-500"
              : event.impact === "★★"
                ? "bg-amber-500/15 text-amber-500"
                : "bg-muted text-muted-foreground",
          )}>
            {event.impact ?? "—"}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">{event.currency}</span>
        </span>
        <span className="mt-1 block truncate text-xs font-medium text-foreground" title={event.event}>
          {event.event}
        </span>
      </span>
      <span className="whitespace-nowrap pt-0.5 text-right text-[10px] text-muted-foreground">
        {new Date(`${event.date}T00:00:00Z`).toLocaleDateString(locale, {
          weekday: "short",
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        })}
      </span>
    </li>
  );
}

export function TradingViewEconomicCalendar({
  height = 400,
  importanceFilter = "-1",
  countryFilter,
  currencyFilter,
}: TradingViewEconomicCalendarProps) {
  const { lang, t } = useTranslation();
  const { data, isLoading, isError } = useCalendar();
  const online = useOnlineStatus();
  const locale = lang === "id" ? "id-ID" : "en-US";
  const window = calendarDateWindow();

  const events = useMemo(() => {
    const selectedCurrencies = new Set(currencyFilter ?? []);
    return (data?.events ?? [])
      .filter((event) => eventIsWithinCalendarWindow(event, window))
      .filter((event) => selectedCurrencies.size === 0 || selectedCurrencies.has(event.currency))
      .filter((event) => matchesImportance(event, importanceFilter))
      .sort((a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time ?? "").localeCompare(b.time ?? "") ||
        (IMPACT_RANK[b.impact ?? ""] ?? 0) - (IMPACT_RANK[a.impact ?? ""] ?? 0),
      );
  }, [data?.events, currencyFilter, importanceFilter, window.startDate, window.endDate]);

  if (!online) {
    return (
      <div
        className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/30 px-4 text-center"
        style={{ height: `${height}px` }}
        data-testid="tradingview-economic-calendar-offline"
      >
        <WifiOff className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs leading-snug text-muted-foreground">{t.widgets.economic_calendar_offline}</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      data-testid="tradingview-economic-calendar-wrapper"
      data-window-start={window.startDate}
      data-window-end={window.endDate}
      data-country-filter={countryFilter ?? ""}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground" style={{ height: `${height}px` }}>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span className="text-xs">{t.widgets.loading_calendar}</span>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 text-center" style={{ height: `${height}px` }}>
          <p className="text-xs leading-snug text-muted-foreground">{t.widgets.economic_calendar_error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 text-center" style={{ height: `${height}px` }}>
          <p className="text-xs leading-snug text-muted-foreground">{t.widgets.calendar_empty}</p>
        </div>
      ) : (
        <div
          className="overflow-y-auto rounded-lg border border-border bg-card px-3"
          style={{ maxHeight: `${height}px` }}
          data-testid="tradingview-economic-calendar-events"
        >
          <ul>
            {events.map((event, index) => (
              <CalendarEventRow key={`${event.date}-${event.currency}-${event.event}-${index}`} event={event} locale={locale} />
            ))}
          </ul>
        </div>
      )}
      <div className="mt-1 flex items-center justify-center gap-1 text-center text-[10px] text-muted-foreground">
        <Calendar className="h-3 w-3" aria-hidden="true" />
        <a
          href="https://www.tradingview.com/economic-calendar/"
          target="_blank"
          rel="noopener nofollow"
          className="text-primary hover:underline"
        >
          Economic calendar by TradingView
        </a>
      </div>
    </div>
  );
}