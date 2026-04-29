import { useId } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { leanFromCounts, type MarketContextLean } from "./market-context-summary";

export type SpeedometerSize = "sm" | "md";

/**
 * Pastel gradient stops drawn along the arc. Tailwind's 200/300 series
 * gives us a soft, magazine-style ramp that reads cleanly on both the
 * light and the dark theme without the candy-bright look the original
 * red-600 / emerald-600 zones had.
 *
 *   0%  rose-300   → "Strong Sell"
 *  25%  orange-300 → "Sell"
 *  50%  amber-200  → "Neutral"
 *  75%  green-300  → "Buy"
 * 100%  emerald-300→ "Strong Buy"
 */
const GRADIENT_STOPS: ReadonlyArray<{ offset: string; color: string }> = [
  { offset: "0%",   color: "#fda4af" },
  { offset: "25%",  color: "#fdba74" },
  { offset: "50%",  color: "#fde68a" },
  { offset: "75%",  color: "#86efac" },
  { offset: "100%", color: "#6ee7b7" },
];

/** Inner zone boundary angles, used for the subtle tick marks. */
const ZONE_BOUNDARIES_DEG: ReadonlyArray<number> = [-54, -18, 18, 54];

function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

const fmt = (n: number) => n.toFixed(2);

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${fmt(start.x)} ${fmt(start.y)} A ${r} ${r} 0 ${largeArc} 1 ${fmt(end.x)} ${fmt(end.y)}`;
}

/**
 * Map raw buy/sell/neutral tally into a needle angle in [-90°, +90°] where
 * -90° points to the far-left "Strong Sell" zone, 0° to the top-center
 * "Neutral" zone, and +90° to the far-right "Strong Buy" zone.
 *
 * Score is the simple net lean (buy − sell) over the full tally so neutral
 * counts pull the needle toward the centre. Empty tallies render at 0°.
 */
export function angleFromCounts(buy: number, sell: number, neutral: number): number {
  const total = buy + sell + neutral;
  if (total === 0) return 0;
  const score = (buy - sell) / total;
  const clamped = Math.max(-1, Math.min(1, score));
  return clamped * 90;
}

/**
 * TradingView-style half-circle speedometer used for the Technical Indicators
 * summary (overall / oscillator / moving averages) and for the Directional
 * Bias gauge on the Analysis Detail page.
 *
 * Drawn with inline SVG so it stays light, theme-aware, and responsive
 * without a chart dependency. The arc is a single continuous stroke filled
 * with a horizontal pastel gradient (rose → peach → cream → mint → emerald)
 * so the five zones blend smoothly instead of looking like a stoplight.
 * Tick marks at the zone boundaries give the eye a soft anchor without
 * shouting.
 */
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

  // useId() guarantees a unique gradient id per instance so two speedometers
  // on the same page never share — and accidentally restyle — each other's
  // gradient definition.
  const reactId = useId();
  const gradientId = `signal-speedo-grad-${reactId.replace(/:/g, "")}`;
  const trackId = `signal-speedo-track-${reactId.replace(/:/g, "")}`;

  const autoLabel =
    lean === "bullish" ? t.analyze.leaning_bullish :
    lean === "bearish" ? t.analyze.leaning_bearish :
    t.analyze.leaning_neutral;
  const centerLabel = centerLabelOverride ?? autoLabel;
  // Softer pastel-leaning text colours so the label sits with the gauge
  // instead of competing with it.
  const autoLabelColor =
    lean === "bullish" ? "text-emerald-600 dark:text-emerald-300" :
    lean === "bearish" ? "text-rose-600 dark:text-rose-300" :
    "text-amber-600 dark:text-amber-300";

  const angle = angleFromCounts(buy, sell, neutral);
  // Needle stops just shy of the arc so it visually "points at" the zone
  // rather than overlapping the coloured stroke.
  const needleEnd = polar(50, 50, 36, angle);

  const sizing =
    size === "sm"
      ? {
          maxW: "max-w-[120px]",
          strokeWidth: 8,
          labelText: "text-xs",
          countText: "text-[9px]",
          labelMt: "mt-0.5",
        }
      : {
          maxW: "max-w-[180px]",
          strokeWidth: 10,
          labelText: "text-2xl",
          countText: "text-[10px]",
          labelMt: "mt-1",
        };

  return (
    <div
      className={cn("flex flex-col items-center text-center w-full", className)}
      data-testid={testId ?? "signal-speedometer"}
      data-lean={lean}
    >
      <svg
        viewBox="0 0 100 60"
        className={cn("block w-full", sizing.maxW)}
        role="img"
        aria-label={centerLabel}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {GRADIENT_STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          {/* Subtle desaturated track sits behind the gradient arc to soften
              the cap edges and give the gauge a tiny bit of depth. */}
          <linearGradient id={trackId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d={arcPath(50, 50, 40, -90, 90)}
          fill="none"
          strokeWidth={sizing.strokeWidth + 1}
          strokeLinecap="round"
          stroke={`url(#${trackId})`}
          className="text-foreground"
        />

        {/* Continuous pastel gradient arc */}
        <path
          d={arcPath(50, 50, 40, -88, 88)}
          fill="none"
          strokeWidth={sizing.strokeWidth}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
        />

        {/* Soft tick marks at the zone boundaries — short, low-contrast
            strokes that imply the 5 zones without dominating the gradient. */}
        {ZONE_BOUNDARIES_DEG.map((deg) => {
          const inner = polar(50, 50, 40 - sizing.strokeWidth / 2 - 0.5, deg);
          const outer = polar(50, 50, 40 + sizing.strokeWidth / 2 + 0.5, deg);
          return (
            <line
              key={`tick-${deg}`}
              x1={fmt(inner.x)}
              y1={fmt(inner.y)}
              x2={fmt(outer.x)}
              y2={fmt(outer.y)}
              strokeWidth={0.6}
              strokeLinecap="round"
              className="stroke-foreground/25"
            />
          );
        })}

        {/* Needle — slimmer, slightly muted so it reads as a pointer not
            a slash. */}
        <line
          x1={50}
          y1={50}
          x2={fmt(needleEnd.x)}
          y2={fmt(needleEnd.y)}
          strokeWidth={1.8}
          strokeLinecap="round"
          className="stroke-foreground/80"
          data-testid="speedometer-needle"
          data-angle={angle.toFixed(1)}
        />
        {/* Pivot: a soft outer halo + a small solid centre dot. */}
        <circle cx={50} cy={50} r={4.5} className="fill-foreground/10" />
        <circle cx={50} cy={50} r={2.2} className="fill-foreground/70" />
      </svg>

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
