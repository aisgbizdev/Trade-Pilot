import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import {
  SESSIONS,
  type SessionName,
  formatDuration,
  formatLocalTime,
  getMarketStatus,
} from "@/lib/market-sessions";

const DOT_COLOR: Record<SessionName, string> = {
  sydney: "bg-cyan-500",
  tokyo: "bg-rose-500",
  london: "bg-emerald-500",
  newYork: "bg-amber-500",
};

function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export interface MarketSessionsBadgeProps {
  className?: string;
  /** Override "now" — for tests/snapshots. */
  now?: Date;
}

export function MarketSessionsBadge({ className, now: nowProp }: MarketSessionsBadgeProps) {
  const { t, lang } = useTranslation();
  const tickedNow = useNow();
  const now = nowProp ?? tickedNow;
  const status = getMarketStatus(now);
  const locale = lang === "id" ? "id-ID" : "en-US";

  const sessionLabel = (name: SessionName): string => {
    const key = `sessions_${name === "newYork" ? "newyork" : name}` as
      | "sessions_sydney"
      | "sessions_tokyo"
      | "sessions_london"
      | "sessions_newyork";
    return t.widgets[key];
  };

  const openLabel =
    status.openSessions.length === 0
      ? status.isWeekendClosed
        ? t.widgets.sessions_market_closed
        : t.widgets.sessions_no_session
      : status.openSessions.map(sessionLabel).join(" · ");

  let trailing = "";
  if (status.isOverlap) {
    trailing = t.widgets.sessions_highest_liquidity;
  } else if (status.next) {
    const dur = formatDuration(status.next.msUntil);
    const session = sessionLabel(status.next.session);
    const template =
      status.next.type === "open"
        ? t.widgets.sessions_next_opens
        : t.widgets.sessions_next_closes;
    trailing = template.replace("{session}", session).replace("{time}", dur);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t.widgets.sessions_title}
          data-testid="market-sessions-badge"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all",
            status.isOverlap
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
              : status.openSessions.length > 0
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted border-border text-muted-foreground",
            className,
          )}
        >
          <span className="flex items-center gap-0.5" aria-hidden="true">
            {status.openSessions.length > 0 ? (
              status.openSessions.map((s) => (
                <span
                  key={s}
                  className={cn("w-1.5 h-1.5 rounded-full", DOT_COLOR[s])}
                />
              ))
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            )}
          </span>
          <span className="font-semibold whitespace-nowrap">{openLabel}</span>
          {trailing && (
            <span className="text-muted-foreground whitespace-nowrap">
              · {trailing}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-72 p-3"
        data-testid="market-sessions-popover"
      >
        <div className="space-y-2">
          <div>
            <h3 className="text-xs font-bold text-foreground">
              {t.widgets.sessions_title}
            </h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {t.widgets.sessions_local_time_note}
            </p>
          </div>
          <ul className="space-y-1.5">
            {SESSIONS.map((s) => {
              const isOpen = status.openSessions.includes(s.name);
              return (
                <li
                  key={s.name}
                  data-testid={`market-session-row-${s.name}`}
                  className="flex items-center justify-between gap-2 text-[11px]"
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        isOpen ? DOT_COLOR[s.name] : "bg-muted-foreground/30",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "font-medium truncate",
                        isOpen ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {sessionLabel(s.name)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono tabular-nums text-foreground">
                      {formatLocalTime(s.openUtcHour, locale, now)}
                      <span className="text-muted-foreground">–</span>
                      {formatLocalTime(s.closeUtcHour, locale, now)}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-bold px-1 py-0.5 rounded",
                        isOpen
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isOpen ? t.widgets.sessions_open : t.widgets.sessions_closed}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          {status.isWeekendClosed && (
            <p className="text-[10px] text-muted-foreground italic pt-1 border-t border-border/40">
              {t.widgets.sessions_weekend_note}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
