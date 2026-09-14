import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PAD2 = (n: number) => String(n).padStart(2, "0");

/**
 * Always-visible reference clock for the header. Exists because every
 * other timestamp in the app ("Dianalisis", "Diperbarui") renders in the
 * browser's local time and is labeled WIB, while the analysis chart's own
 * axis (a separate charting library) defaults to UTC — with no clock
 * anywhere on screen, that reads as the chart lagging by hours instead of
 * using a different clock. This gives users one unambiguous "what time is
 * it" anchor to check any timestamp against.
 */
function formatNow(lang: string): { date: string; time: string } {
  const now = new Date();
  const date = now.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "short",
  });
  const time = `${PAD2(now.getHours())}:${PAD2(now.getMinutes())}`;
  return { date, time };
}

export function LiveClock({ className }: { className?: string }) {
  const { lang } = useTranslation();
  const [{ date, time }, setNow] = useState(() => formatNow(lang));

  useEffect(() => {
    setNow(formatNow(lang));
    // Minute-granularity display — no need to re-render every second.
    const id = setInterval(() => setNow(formatNow(lang)), 15_000);
    return () => clearInterval(id);
  }, [lang]);

  return (
    <span
      className={cn("inline-flex items-center gap-1 text-[11px] tabular-nums whitespace-nowrap", className)}
      data-testid="live-clock"
    >
      <Clock className="w-3 h-3 shrink-0 opacity-60" aria-hidden="true" />
      <span className="hidden md:inline">{date}, </span>
      {time} WIB
    </span>
  );
}
