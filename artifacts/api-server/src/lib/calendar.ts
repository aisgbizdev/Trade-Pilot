const CALENDAR_API = "https://endpoapi-production-3202.up.railway.app/api/calendar/this-week";
let cache: { data: any[]; fetchedAt: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000;

const INSTRUMENT_CURRENCIES: Record<string, string[]> = {
  "XAU/USD": ["USD", "GOLD"],
  "BRENT":   ["USD", "OIL", "OPEC"],
  "EUR/USD": ["EUR", "USD"],
  "GBP/USD": ["GBP", "USD"],
  "USD/JPY": ["JPY", "USD"],
  "USD/IDR": ["IDR", "USD"],
  "DXY":     ["USD"],
  "AUD/USD": ["AUD", "USD"],
  "USD/CHF": ["CHF", "USD"],
  "HSI":     ["CHN", "HKD"],
};

const IMPACT_RANK: Record<string, number> = {
  "★★★": 3,
  "★★":  2,
  "★":   1,
};

async function fetchCalendar(): Promise<any[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) return cache.data;
  const res = await fetch(CALENDAR_API);
  if (!res.ok) throw new Error("Gagal fetch calendar");
  const json = await res.json() as any;
  cache = { data: json.data ?? [], fetchedAt: Date.now() };
  return cache.data;
}

export async function getRelevantCalendar(instrument: string, maxItems = 6): Promise<any[]> {
  const currencies = INSTRUMENT_CURRENCIES[instrument] ?? ["USD"];
  const all = await fetchCalendar();
  const today = new Date().toISOString().split("T")[0];
  return all
    .filter((e) => currencies.includes(e.currency) && e.date >= today)
    .sort((a, b) => (IMPACT_RANK[b.impact] ?? 0) - (IMPACT_RANK[a.impact] ?? 0) || a.date.localeCompare(b.date))
    .slice(0, maxItems);
}

export async function getAllCalendarThisWeek(): Promise<any[]> {
  return fetchCalendar();
}

export function formatCalendarForPrompt(events: any[], instrument: string): string {
  if (!events.length) return "";
  const lines = events.map((e) => {
    const result = e.actual ? `aktual=${e.actual}` : e.forecast ? `prakiraan=${e.forecast}` : "belum rilis";
    return `  [${e.date} ${e.time?.split(" ")[1] ?? ""}] ${e.impact} ${e.currency} — ${e.event} | sebelumnya=${e.previous || "-"} ${result}`;
  }).join("\n");
  return `\n=== KALENDER EKONOMI RELEVAN (${instrument}) ===\n${lines}\n===`;
}
