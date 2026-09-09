import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  getProgressionEmblemTier,
  type EmblemFamily,
  type EmblemState,
  type EmblemSymbol,
} from "@workspace/progression-emblem";

interface ProgressionEmblemProps {
  level: number;
  masteryLevel: number;
  state?: EmblemState;
  className?: string;
}

export const getProgressionTier = getProgressionEmblemTier;

function EmblemShape({ family, fill, stroke, strokeWidth }: {
  family: EmblemFamily;
  fill: string;
  stroke: string;
  strokeWidth: number;
}) {
  if (family === "badge") {
    return <path d="M24 11 H76 L88 27 V67 L50 91 L12 67 V27 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
  }
  if (family === "shield") {
    return <path d="M50 8 L87 21 V49 C87 72 70 86 50 94 C30 86 13 72 13 49 V21 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
  }
  return <path d="M50 6 L90 24 L80 72 L50 94 L20 72 L10 24 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
}

function TierMark({ symbol, color, detailCount }: { symbol: EmblemSymbol; color: string; detailCount: number }) {
  if (symbol === "trophy") {
    return (
      <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M39 24 H61 V31 C61 39 56 43 50 43 C44 43 39 39 39 31 Z" />
        <path d="M39 28 H32 C32 36 35 39 41 39 M61 28 H68 C68 36 65 39 59 39 M50 43 V48 M43 48 H57" />
      </g>
    );
  }
  if (symbol === "crown") {
    return <path d="M35 39 L32 24 L42 31 L50 19 L58 31 L68 24 L65 39 Z" fill={color} opacity="0.95" />;
  }
  if (symbol === "star") {
    return <path d="M50 20 L53.8 28.2 L63 29.3 L56.2 35.5 L58 44.5 L50 40 L42 44.5 L43.8 35.5 L37 29.3 L46.2 28.2 Z" fill={color} opacity="0.9" />;
  }
  return (
    <g fill={color} opacity="0.9">
      {Array.from({ length: Math.min(detailCount, 3) }, (_, index) => (
        <rect key={index} x={42 + index * 6} y={28 - index * 3} width="4" height={10 + index * 3} rx="2" />
      ))}
    </g>
  );
}

export function ProgressionEmblem({
  level,
  masteryLevel,
  state = "active",
  className,
}: ProgressionEmblemProps) {
  const id = useId().replace(/:/g, "");
  const { isMastery, style, intraLevel, label, accessibleLabelPrefix } = getProgressionTier(level, masteryLevel);
  const [color1, color2, stroke, detail] = style.palette;
  const accessibleState = state === "active" ? "active" : state;

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        state === "locked" && "grayscale opacity-45",
        state === "completed" && "opacity-80",
        state === "active" && "drop-shadow-[0_8px_16px_rgba(245,184,0,0.16)]",
        className,
      )}
      role="img"
      aria-label={`${accessibleLabelPrefix}, ${accessibleState}`}
      data-tier={style.name.toLowerCase()}
      data-family={style.family}
      data-symbol={style.symbol}
      data-state={state}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`emblem-${id}`} x1="15%" y1="10%" x2="85%" y2="95%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {state === "active" && (
          <path d="M50 3 L93 22 L83 75 L50 98 L17 75 L7 22 Z" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.28" />
        )}
        <EmblemShape
          family={style.family}
          fill={`url(#emblem-${id})`}
          stroke={state === "locked" ? "#8a8a8a" : stroke}
          strokeWidth={2 + Math.min(intraLevel, 10) * 0.12}
        />
        <path d="M25 60 H75" stroke={detail} strokeWidth="1" opacity="0.22" />
        <TierMark symbol={style.symbol} color={detail} detailCount={Math.ceil(intraLevel / 3)} />
        <text
          x="50"
          y={style.symbol === "bars" ? "62" : "66"}
          textAnchor="middle"
          fill="#ffffff"
          className="font-sans font-black"
          style={{ fontSize: isMastery ? "22px" : "27px", filter: "drop-shadow(0 2px 2px rgba(0,0,0,.65))" }}
        >
          {label}
        </text>
        <g fill={detail}>
          {Array.from({ length: Math.min(3, Math.ceil(intraLevel / 3)) }, (_, index) => (
            <path key={index} d={`M${44 + index * 6} 75 l2 2 l-2 2 l-2-2 Z`} opacity={0.45 + index * 0.15} />
          ))}
        </g>
      </svg>
    </div>
  );
}