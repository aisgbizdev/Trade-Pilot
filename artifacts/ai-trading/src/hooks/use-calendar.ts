import { useQuery } from "@tanstack/react-query";

export interface CalendarEvent {
  time: string;
  currency: string;
  impact: string;
  event: string;
  previous: string;
  forecast: string;
  actual: string;
  date: string;
  // Absolute UTC instant from the server (Unix epoch ms). Lets clients
  // in any time zone compute "time until release" without re-parsing
  // the wall-clock `date` + `time` strings. Null when the feed omitted
  // a time or the date was malformed. Optional in the type so older
  // cached payloads (server <Task #159) still deserialize.
  epochMs?: number | null;
  whyTraderCare: string;
}

async function fetchCalendar(): Promise<{ events: CalendarEvent[]; total: number; updatedAt: string }> {
  const res = await fetch("/api/calendar");
  if (!res.ok) throw new Error("Gagal mengambil kalender ekonomi");
  return res.json();
}

export function useCalendar() {
  return useQuery({
    queryKey: ["calendar"],
    queryFn: fetchCalendar,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}
