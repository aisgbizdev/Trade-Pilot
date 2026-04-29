import { useQuery } from "@tanstack/react-query";
import type { CalendarEvent } from "./use-calendar";

interface RelevantCalendarResponse {
  status: string;
  instrument: string;
  events: CalendarEvent[];
}

async function fetchRelevantCalendar(instrument: string): Promise<RelevantCalendarResponse> {
  const res = await fetch(`/api/calendar/relevant?instrument=${encodeURIComponent(instrument)}`);
  if (!res.ok) throw new Error("Gagal mengambil kalender ekonomi");
  return res.json();
}

export function useRelevantCalendar(instrument: string | null | undefined) {
  return useQuery({
    queryKey: ["calendar", "relevant", instrument],
    queryFn: () => fetchRelevantCalendar(instrument!),
    enabled: !!instrument,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}
