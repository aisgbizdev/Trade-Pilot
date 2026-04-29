import { useId } from "react";
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

/** Map (buy − sell) / total into a needle angle in [-90°, +90°]. */
export function angleFromCounts(buy: number, sell: number, neutral: number): number {
  const total = buy + sell + neutral;
  if (total === 0) return 0;
  const score = (buy - sell) / total;
  const clamped = Math.max(-1, Math.min(1, score));
  return clamped * 90;
}

/** Half-circle gauge with a pastel gradient arc and a needle pointer. */
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

  const reactId = useId();
  const gradientId = `signal-speedo-grad-${reactId.replace(/:/g, "")}`;
  const trackId = `signal-speedo-track-${reactId.replace(/:/g, "")}`;

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
  const needleEnd = polar(50, 50, 36, angle);

  // The xs wrapper uses an explicit pixel width + `shrink-0` so the
  // mini gauge keeps its 56×~34px footprint even when it lives inside
  // a tight flex-row alongside a fixed-width label (see `SignalCell` in
  // `technical-indicators-panel.tsx`). Without `shrink-0`, a sibling
  // with `min-w-[2.75rem]` would steal space and the wrapper would
  // collapse, making the half-circle look like a flat line.
  const sizing =
    size === "xs"
      ? {
          wrapperW: "w-14 shrink-0",
          maxW: "max-w-[56px]",
          strokeWidth: 6,
          labelText: "text-[10px]",
          countText: "text-[8px]",
          labelMt: "mt-0",
        }
      : size === "sm"
      ? {
          wrapperW: "w-full",
          maxW: "max-w-[120px]",
          strokeWidth: 8,
          labelText: "text-xs",
          countText: "text-[9px]",
          labelMt: "mt-0.5",
        }
      : {
          wrapperW: "w-full",
          maxW: "max-w-[180px]",
          strokeWidth: 10,
          labelText: "text-2xl",
          countText: "text-[10px]",
          labelMt: "mt-1",
        };

  return (
    <div
      className={cn("flex flex-col items-center text-center", sizing.wrapperW, className)}
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
          <linearGradient id={trackId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <path
          d={arcPath(50, 50, 40, -90, 90)}
          fill="none"
          strokeWidth={sizing.strokeWidth + 1}
          strokeLinecap="round"
          stroke={`url(#${trackId})`}
          className="text-foreground"
        />
        <path
          d={arcPath(50, 50, 40, -88, 88)}
          fill="none"
          strokeWidth={sizing.strokeWidth}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
        />

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
