import { useQuery } from "@tanstack/react-query";
import type { CalendarEvent } from "./use-calendar";

interface RelevantCalendarResponse {
  status: string;
  instrument: string;
  events: CalendarEvent[];
}

async function fetchRelevantCalendar(
  instrument: string,
  maxItems?: number,
): Promise<RelevantCalendarResponse> {
  const params = new URLSearchParams({ instrument });
  if (maxItems !== undefined) params.set("maxItems", String(maxItems));
  const res = await fetch(`/api/calendar/relevant?${params.toString()}`);
  if (!res.ok) throw new Error("Gagal mengambil kalender ekonomi");
  return res.json();
}

export function useRelevantCalendar(
  instrument: string | null | undefined,
  opts: { maxItems?: number } = {},
) {
  const { maxItems } = opts;
  return useQuery({
    // queryKey includes maxItems so the preview (default cap) and the
    // pre-trade warning (wider cap) don't clobber each other's cache.
    queryKey: ["calendar", "relevant", instrument, maxItems ?? null],
    queryFn: () => fetchRelevantCalendar(instrument!, maxItems),
    enabled: !!instrument,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}
