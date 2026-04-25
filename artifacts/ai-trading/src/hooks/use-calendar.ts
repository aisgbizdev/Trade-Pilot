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
