import type { CalendarEvent } from "@/hooks/use-calendar";

const DAYS_EACH_SIDE = 7;

function dateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function shiftDateKey(key: string, days: number): string {
  const date = new Date(`${key}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function calendarDateWindow(now = new Date()): {
  startDate: string;
  endDate: string;
} {
  const today = dateKey(now);
  return {
    startDate: shiftDateKey(today, -DAYS_EACH_SIDE),
    endDate: shiftDateKey(today, DAYS_EACH_SIDE),
  };
}

export function eventIsWithinCalendarWindow(
  event: Pick<CalendarEvent, "date">,
  window: { startDate: string; endDate: string },
): boolean {
  return event.date >= window.startDate && event.date <= window.endDate;
}