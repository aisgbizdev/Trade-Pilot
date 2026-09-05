import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { leanFromCounts, type MarketContextLean } from "./market-context-summary";

export type SpeedometerSize = "xs" | "sm" | "md";
export type SpeedometerVariant = "bar" | "semicircle";

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
  variant = "bar",
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
  variant?: SpeedometerVariant;
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
          markerWidth: 3,
          markerHeight: 16,
          labelText: "text-xs",
          countText: "text-[8px]",
          labelMt: "mt-2",
        }
      : size === "sm"
      ? {
          wrapperW: "w-full max-w-[150px]",
          barHeight: 11,
          markerWidth: 3.5,
          markerHeight: 21,
          labelText: "text-sm",
          countText: "text-[9px]",
          labelMt: "mt-2.5",
        }
      : {
          wrapperW: "w-full max-w-[220px]",
          barHeight: 14,
          markerWidth: 4,
          markerHeight: 28,
          labelText: "text-3xl",
          countText: "text-[10px]",
          labelMt: "mt-3",
        };

  return (
    <div
      className={cn("flex flex-col items-center text-center", sizing.wrapperW, className)}
      data-testid={testId ?? "signal-speedometer"}
      data-lean={lean}
      data-variant={variant}
    >
      {variant === "semicircle" ? (
        <div className="relative w-full" role="img" aria-label={centerLabel}>
          <svg
            viewBox="0 0 220 112"
            className="block h-auto w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`bias-arc-${testId ?? "default"}`} x1="0" y1="0" x2="1" y2="0">
                {GRADIENT_STOPS.map((stop) => (
                  <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
                ))}
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 90 90 0 0 1 200 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              strokeLinecap="round"
              className="text-muted/50"
            />
            <path
              d="M 20 100 A 90 90 0 0 1 200 100"
              fill="none"
              stroke={`url(#bias-arc-${testId ?? "default"})`}
              strokeWidth="14"
              strokeLinecap="round"
            />
            <g
              transform={`rotate(${angle} 110 100)`}
              data-testid="speedometer-needle"
              data-angle={angle.toFixed(1)}
              data-position={positionPct.toFixed(1)}
            >
              <line
                x1="110"
                y1="100"
                x2="110"
                y2="29"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-foreground"
              />
            </g>
            <circle cx="110" cy="100" r="8" className="fill-foreground" />
            <circle cx="110" cy="100" r="3" className="fill-background" />
          </svg>
        </div>
      ) : (
        <div
          className="relative w-full"
          style={{ height: sizing.markerHeight }}
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

        {/* A solid white pill with a dark ring reads against every stop in
            the pink→orange→yellow→green track, unlike a translucent dot
            (which washed out, especially over the yellow midpoint). Sized
            taller than the track so it visibly "pins" a spot on the bar
            rather than blending into it. */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            left: `${positionPct}%`,
            width: sizing.markerWidth,
            height: sizing.markerHeight,
            boxShadow: "0 0 0 1.5px rgba(15, 15, 15, 0.55), 0 1px 3px rgba(0, 0, 0, 0.35)",
          }}
          data-testid="speedometer-needle"
          data-angle={angle.toFixed(1)}
          data-position={positionPct.toFixed(1)}
        />
        </div>
      )}

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
