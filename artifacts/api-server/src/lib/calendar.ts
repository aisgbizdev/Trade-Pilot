/**
 * Economic-calendar adapter.
 *
 * History:
 *   - v1 (task #82) only returned events with `date >= today`. That
 *     was correct for "what's coming", but it stripped out the events
 *     that already printed earlier today / yesterday — so the AI never
 *     saw the *actual* CPI or FOMC outcome and had no way to reason
 *     about its surprise factor.
 *
 *   - v2 (task #88) accepts a `lookbackHours` window so we can include
 *     the just-released figures with their `actual` numbers, and we
 *     return a typed shape that the route layer can persist on the
 *     analysis row alongside the news snapshot.
 */

const CALENDAR_API =
  "https://endpoapi-production-3202.up.railway.app/api/calendar/this-week";
let cache: { data: CalendarRaw[]; fetchedAt: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000;

const INSTRUMENT_CURRENCIES: Record<string, string[]> = {
  "XAU/USD": ["USD", "GOLD"],
  "BRENT": ["USD", "OIL", "OPEC"],
  "EUR/USD": ["EUR", "USD"],
  "GBP/USD": ["GBP", "USD"],
  "USD/JPY": ["JPY", "USD"],
  "USD/IDR": ["IDR", "USD"],
  "DXY": ["USD"],
  "AUD/USD": ["AUD", "USD"],
  "USD/CHF": ["CHF", "USD"],
  "HSI": ["CHN", "HKD"],
};

const IMPACT_RANK: Record<string, number> = {
  "★★★": 3,
  "★★": 2,
  "★": 1,
};

interface CalendarRaw {
  date: string;
  time?: string;
  currency: string;
  event: string;
  impact?: string;
  actual?: string | null;
  forecast?: string | null;
  previous?: string | null;
}

export interface CalendarEvent {
  date: string;          // YYYY-MM-DD
  time: string | null;   // best-effort HH:MM (local feed) or null
  currency: string;
  event: string;
  impact: string | null; // "★", "★★", "★★★" or null
  actual: string | null;
  forecast: string | null;
  previous: string | null;
}

async function fetchCalendar(): Promise<CalendarRaw[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) return cache.data;
  const res = await fetch(CALENDAR_API);
  if (!res.ok) throw new Error("Gagal fetch calendar");
  const json = (await res.json()) as { data?: CalendarRaw[] };
  cache = { data: json.data ?? [], fetchedAt: Date.now() };
  return cache.data;
}

function normalize(raw: CalendarRaw): CalendarEvent {
  // Upstream `time` is shaped like "2026-04-29 19:30" — pull just the
  // wall-clock half so the UI doesn't show a duplicated date.
  const time = raw.time ? raw.time.split(" ")[1] ?? null : null;
  return {
    date: raw.date,
    time: time && time.length > 0 ? time : null,
    currency: raw.currency,
    event: raw.event,
    impact: raw.impact && raw.impact.length > 0 ? raw.impact : null,
    actual: raw.actual ?? null,
    forecast: raw.forecast ?? null,
    previous: raw.previous ?? null,
  };
}

interface RelevantCalendarOpts {
  maxItems?: number;
  lookbackHours?: number;
}

/**
 * Return the most relevant economic-calendar events for the given
 * instrument. Includes recently-printed events within `lookbackHours`
 * (default 24h) so the AI can reason about their surprise factor, plus
 * everything still upcoming this week.
 */
export async function getRelevantCalendar(
  instrument: string,
  opts: RelevantCalendarOpts = {},
): Promise<CalendarEvent[]> {
  const maxItems = opts.maxItems ?? 6;
  const lookbackHours = opts.lookbackHours ?? 24;

  const currencies = INSTRUMENT_CURRENCIES[instrument] ?? ["USD"];
  const all = await fetchCalendar();

  const cutoffMs = Date.now() - lookbackHours * 60 * 60 * 1000;
  const cutoffDate = new Date(cutoffMs).toISOString().split("T")[0]!;

  return all
    .filter((e) => currencies.includes(e.currency) && e.date >= cutoffDate)
    .map(normalize)
    .sort(
      (a, b) =>
        (IMPACT_RANK[b.impact ?? ""] ?? 0) -
          (IMPACT_RANK[a.impact ?? ""] ?? 0) ||
        a.date.localeCompare(b.date),
    )
    .slice(0, maxItems);
}

export async function getAllCalendarThisWeek(): Promise<CalendarEvent[]> {
  return (await fetchCalendar()).map(normalize);
}

/**
 * Render the calendar block injected into the AI prompt. Same shape as
 * v1 plus an `aktual` / `prakiraan` / `belum rilis` tag so the model
 * can tell whether an event has already printed.
 */
export function formatCalendarForPrompt(
  events: CalendarEvent[],
  instrument: string,
): string {
  if (!events.length) return "";
  const lines = events
    .map((e) => {
      const result = e.actual
        ? `aktual=${e.actual}`
        : e.forecast
          ? `prakiraan=${e.forecast}`
          : "belum rilis";
      const impactLabel = e.impact ?? "";
      const time = e.time ?? "";
      return `  [${e.date} ${time}] ${impactLabel} ${e.currency} — ${e.event} | sebelumnya=${e.previous || "-"} ${result}`;
    })
    .join("\n");
  return `\n=== KALENDER EKONOMI RELEVAN (${instrument}) ===\n${lines}\n===`;
}

// Exposed for tests.
export function _clearCalendarCache(): void {
  cache = null;
}
