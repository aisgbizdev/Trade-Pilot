import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { leanFromCounts, type MarketContextLean } from "./market-context-summary";

export type SpeedometerSize = "xs" | "sm" | "md";

const GRADIENT_STOPS: ReadonlyArray<{ offset: string; color: string }> = [
  { offset: "0%",   color: "#fda4af" },
  { offset: "25%",  color: "#fdba74" },
  { offset: "50%",  color: "#fde68a" },
  { offset: "75%",  color: "#86efac" },
  { offset: "100%", color: "#6ee7b7" },
];
const GRADIENT_CSS = `linear-gradient(to right, ${GRADIENT_STOPS.map((s) => `${s.color} ${s.offset}`).join(", ")})`;

// Same 5-equal-zone boundaries the old needle gauge marked at
// -54°/-18°/18°/54° (each zone spans 36° of the -90..90 sweep), just
// expressed as bar positions instead of angles.
const ZONE_BOUNDARIES_DEG: ReadonlyArray<number> = [-54, -18, 18, 54];
const ZONE_BOUNDARIES_PCT = ZONE_BOUNDARIES_DEG.map((deg) => ((deg + 90) / 180) * 100);

/** Map (buy − sell) / total into a needle angle in [-90°, +90°]. */
export function angleFromCounts(buy: number, sell: number, neutral: number): number {
  const total = buy + sell + neutral;
  if (total === 0) return 0;
  const score = (buy - sell) / total;
  const clamped = Math.max(-1, Math.min(1, score));
  return clamped * 90;
}

/** Horizontal gauge bar with a pastel gradient track and a position marker. */
export function SignalSpeedometer({
  buy,
  sell,
  neutral,
  size = "md",
  showCounts = true,
  showCenterLabel = true,
  centerLabelOverride,
  centerLabelClassName,
  rawLabel,
  testId,
  className,
}: {
  buy: number;
  sell: number;
  neutral: number;
  size?: SpeedometerSize;
  showCounts?: boolean;
  showCenterLabel?: boolean;
  centerLabelOverride?: string;
  centerLabelClassName?: string;
  rawLabel?: string;
  testId?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const lean: MarketContextLean = leanFromCounts(buy, sell);

  const autoLabel =
    lean === "bullish" ? t.analyze.leaning_bullish :
    lean === "bearish" ? t.analyze.leaning_bearish :
    t.analyze.leaning_neutral;
  const centerLabel = centerLabelOverride ?? autoLabel;
  const autoLabelColor =
    lean === "bullish" ? "text-emerald-600 dark:text-emerald-300" :
    lean === "bearish" ? "text-rose-600 dark:text-rose-300" :
    "text-amber-600 dark:text-amber-300";

  const angle = angleFromCounts(buy, sell, neutral);
  const positionPct = ((angle + 90) / 180) * 100;

  // The wrapper width itself is sized per-preset (rather than `w-full` with a
  // `max-w` only on the bar). Critically the `xs` preset uses an explicit
  // pixel width + `shrink-0` so the row gauge keeps a clear 80px footprint
  // even when it lives inside a tight flex-row alongside a fixed-width label
  // (see `SignalCell` in `technical-indicators-panel.tsx`) — without
  // `shrink-0`, a sibling with `min-w-[2.75rem]` would steal space and the
  // wrapper would collapse. `sm`/`md` inline their `max-w-` so the larger
  // summary gauges still stretch to fill their column.
  const sizing =
    size === "xs"
      ? {
          wrapperW: "w-20 shrink-0",
          barHeight: 8,
          thumbSize: 14,
          labelText: "text-xs",
          countText: "text-[8px]",
          labelMt: "mt-2",
        }
      : size === "sm"
      ? {
          wrapperW: "w-full max-w-[150px]",
          barHeight: 11,
          thumbSize: 18,
          labelText: "text-sm",
          countText: "text-[9px]",
          labelMt: "mt-2.5",
        }
      : {
          wrapperW: "w-full max-w-[220px]",
          barHeight: 14,
          thumbSize: 24,
          labelText: "text-3xl",
          countText: "text-[10px]",
          labelMt: "mt-3",
        };

  return (
    <div
      className={cn("flex flex-col items-center text-center", sizing.wrapperW, className)}
      data-testid={testId ?? "signal-speedometer"}
      data-lean={lean}
    >
      <div
        className="relative w-full"
        style={{ height: sizing.thumbSize }}
        role="img"
        aria-label={centerLabel}
      >
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 rounded-full overflow-hidden"
          style={{ height: sizing.barHeight, background: GRADIENT_CSS }}
        >
          {ZONE_BOUNDARIES_PCT.map((pct) => (
            <div
              key={pct}
              className="absolute top-0 bottom-0 w-px bg-foreground/25"
              style={{ left: `${pct}%` }}
            />
          ))}
        </div>

        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/10 flex items-center justify-center"
          style={{ left: `${positionPct}%`, width: sizing.thumbSize, height: sizing.thumbSize }}
          data-testid="speedometer-needle"
          data-angle={angle.toFixed(1)}
          data-position={positionPct.toFixed(1)}
        >
          <div
            className="rounded-full bg-foreground/80"
            style={{ width: sizing.thumbSize * 0.45, height: sizing.thumbSize * 0.45 }}
          />
        </div>
      </div>

      {showCenterLabel && (
        <div
          className={cn(
            "font-extrabold leading-tight",
            sizing.labelMt,
            sizing.labelText,
            centerLabelClassName ?? autoLabelColor,
          )}
        >
          {centerLabel}
        </div>
      )}
      {rawLabel && (
        <div className="text-[9px] text-muted-foreground uppercase tracking-wide leading-tight">
          ({rawLabel})
        </div>
      )}
      {showCounts && (
        <div className={cn("flex justify-between w-full mt-1.5 px-1", sizing.countText)}>
          <span className="text-emerald-600 dark:text-emerald-300 font-semibold">
            {buy} {t.analyze.count_bullish}
          </span>
          <span className="text-muted-foreground">
            {neutral} {t.analyze.leaning_neutral}
          </span>
          <span className="text-rose-600 dark:text-rose-300 font-semibold">
            {sell} {t.analyze.count_bearish}
          </span>
        </div>
      )}
    </div>
  );
}
