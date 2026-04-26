import { useCalendar, type CalendarEvent } from "@/hooks/use-calendar";
import { Loader2, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

const IMPACT_CONFIG: Record<string, { label: string; color: string }> = {
  "★★★": { label: "★★★", color: "text-red-500 bg-red-500/15" },
  "★★":  { label: "★★", color: "text-amber-500 bg-amber-500/15" },
  "★":   { label: "★", color: "text-muted-foreground bg-muted" },
};

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", AUD: "🇦🇺",
  CAD: "🇨🇦", CHF: "🇨🇭", CNY: "🇨🇳", CHN: "🇨🇳", NZD: "🇳🇿",
  IDR: "🇮🇩", HKD: "🇭🇰",
};

function EventRow({ event }: { event: CalendarEvent }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const impact = IMPACT_CONFIG[event.impact] ?? { label: "—", color: "bg-muted text-muted-foreground" };
  const hasResult = !!event.actual;
  const actualBetter = event.actual && event.forecast
    ? parseFloat(event.actual) > parseFloat(event.forecast)
    : null;

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => event.whyTraderCare && setExpanded((v) => !v)}
        className="w-full text-left py-2.5 px-0"
      >
        <div className="flex items-start gap-2">
          <span className="text-sm mt-0.5">{CURRENCY_FLAGS[event.currency] ?? "🌐"}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md", impact.color)}>
                {event.impact}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{event.currency}</span>
              {hasResult && (
                <span className={cn("text-[9px] font-semibold px-1 py-0.5 rounded",
                  actualBetter ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500"
                )}>
                  {actualBetter ? t.widgets.calendar_better : t.widgets.calendar_worse}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-foreground leading-snug">{event.event}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-muted-foreground">
                {t.widgets.calendar_prev}: <span className="text-foreground">{event.previous || "—"}</span>
              </span>
              {event.forecast && (
                <span className="text-[10px] text-muted-foreground">
                  {t.widgets.calendar_forecast}: <span className="text-foreground">{event.forecast}</span>
                </span>
              )}
              {event.actual && (
                <span className="text-[10px] text-muted-foreground">
                  {t.widgets.calendar_actual}: <span className={cn("font-semibold", actualBetter ? "text-emerald-500" : "text-red-500")}>{event.actual}</span>
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-muted-foreground font-mono">{event.time?.split(" ")[1] ?? ""}</div>
            {event.whyTraderCare && (
              expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground mt-1" /> : <ChevronDown className="w-3 h-3 text-muted-foreground mt-1" />
            )}
          </div>
        </div>
      </button>
      {expanded && event.whyTraderCare && (
        <div className="pb-2.5 px-0">
          <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-2">
            {event.whyTraderCare}
          </p>
        </div>
      )}
    </div>
  );
}

export function CalendarWidget({ filterCurrency, limit = 10 }: { filterCurrency?: string[]; limit?: number }) {
  const { t, lang } = useTranslation();
  const { data, isLoading, isError } = useCalendar();
  const [showAll, setShowAll] = useState(false);

  let events = data?.events ?? [];
  if (filterCurrency?.length) {
    events = events.filter((e) => filterCurrency.includes(e.currency));
  }
  const today = new Date().toISOString().split("T")[0];
  events = events.filter((e) => e.date >= today).sort((a, b) => {
    const impactOrder: Record<string, number> = { "★★★": 3, "★★": 2, "★": 1 };
    return (impactOrder[b.impact] ?? 0) - (impactOrder[a.impact] ?? 0) || a.date.localeCompare(b.date);
  });

  const displayed = showAll ? events : events.slice(0, limit);
  const byDate: Record<string, CalendarEvent[]> = {};
  for (const e of displayed) {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  }

  const locale = lang === "id" ? "id-ID" : "en-US";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <h3 className="text-sm font-bold text-foreground">{t.widgets.calendar_title}</h3>
        <a
          href="https://newsmaker.id"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
          data-testid="link-calendar-source-newsmaker"
        >
          {t.widgets.source_newsmaker}
        </a>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">{t.widgets.loading_calendar}</span>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">{t.widgets.calendar_error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">{t.widgets.calendar_empty}</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl px-3">
          {Object.entries(byDate).map(([date, evts]) => (
            <div key={date}>
              <div className="py-2 border-b border-border/50">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {new Date(date + "T00:00:00").toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" })}
                </span>
              </div>
              {evts.map((evt, i) => <EventRow key={i} event={evt} />)}
            </div>
          ))}
          {events.length > limit && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full py-2.5 text-xs text-primary font-medium hover:underline"
            >
              {showAll ? t.widgets.show_less : `+${events.length - limit} ${t.widgets.more_events}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
