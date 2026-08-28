import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import {
  type SessionName,
  formatDuration,
  getMarketStatus,
} from "@/lib/market-sessions";
import { isCryptoInstrument } from "@/lib/tradingview-symbols";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  /**
   * Optional instrument context. When the instrument is a crypto pair
   * (BTC/USD, ETH/USD, …) we swap the FX-session pill for a "24/7" pill
   * — sessions are meaningless for spot crypto and showing London/NY
   * timers there has historically confused users.
   */
  instrument?: string;
}

function SessionInfoPopover({ isCrypto }: { isCrypto: boolean }) {
  const { t } = useTranslation();

  return (
    <PopoverContent
      align="end"
      side="bottom"
      className="w-[min(18rem,calc(100vw-2rem))] space-y-2 p-3 text-xs leading-relaxed"
      data-testid="market-sessions-info"
    >
      <p className="font-semibold text-foreground">
        {t.widgets.sessions_info_title}
      </p>
      <p>
        {isCrypto
          ? t.widgets.sessions_info_crypto_body
          : t.widgets.sessions_info_body}
      </p>
      {!isCrypto && (
        <p className="text-muted-foreground">
          {t.widgets.sessions_info_overlap}
        </p>
      )}
      <p className="text-muted-foreground">{t.widgets.sessions_info_note}</p>
    </PopoverContent>
  );
}

function SessionInfoButton() {
  const { t } = useTranslation();

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={t.widgets.sessions_info_button}
        data-testid="market-sessions-info-button"
      >
        <Info className="h-3 w-3" aria-hidden="true" />
      </button>
    </PopoverTrigger>
  );
}

export function MarketSessionsBadge({ className, now: nowProp, instrument }: MarketSessionsBadgeProps) {
  const { t } = useTranslation();
  const tickedNow = useNow();
  const now = nowProp ?? tickedNow;
  const isCrypto = Boolean(instrument && isCryptoInstrument(instrument));

  // Crypto short-circuit — render a simple always-open pill instead of
  // the FX session machinery. The info popover still explains why.
  if (isCrypto) {
    return (
      <Popover>
        <span
          data-testid="market-sessions-badge"
          data-asset-class="crypto"
          aria-label={t.widgets.sessions_crypto_24_7}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium",
            "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
            className,
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="font-semibold whitespace-nowrap">
            {t.widgets.sessions_crypto_24_7}
          </span>
          <SessionInfoButton />
        </span>
        <SessionInfoPopover isCrypto />
      </Popover>
    );
  }

  const status = getMarketStatus(now);

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
      <span
        aria-label={`${t.widgets.sessions_title}: ${openLabel}${trailing ? `, ${trailing}` : ""}`}
        data-testid="market-sessions-badge"
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium",
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
        <SessionInfoButton />
      </span>
      <SessionInfoPopover isCrypto={false} />
    </Popover>
  );
}
