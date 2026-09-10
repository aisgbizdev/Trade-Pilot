import {
  Anchor,
  Award,
  BookOpen,
  ChevronUp,
  Compass,
  Crosshair,
  Lock,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  getAchievementBadgeStyle,
  type AchievementBadgeShape,
  type AchievementBadgeSymbol,
} from "@workspace/progression-emblem";

const ICONS: Record<AchievementBadgeSymbol, LucideIcon> = {
  compass: Compass,
  crosshair: Crosshair,
  shield: Shield,
  "book-open": BookOpen,
  anchor: Anchor,
  zap: Zap,
  "chevron-up": ChevronUp,
  award: Award,
};

const SHAPES: Record<AchievementBadgeShape, string> = {
  medallion: "rounded-full",
  square: "rounded-[4px]",
  shield: "[clip-path:polygon(10%_0,90%_0,100%_68%,50%_100%,0_68%)]",
  squircle: "rounded-[16px]",
  octagon: "[clip-path:polygon(28%_0,72%_0,100%_28%,100%_72%,72%_100%,28%_100%,0_72%,0_28%)]",
  diamond: "rotate-45 rounded-[7px]",
  pentagon: "[clip-path:polygon(50%_0,100%_32%,82%_100%,18%_100%,0_32%)]",
  hexagon: "[clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]",
};

interface AchievementBadgeProps {
  achievementKey: string;
  unlocked: boolean;
  size?: "sm" | "md";
}

export function AchievementBadge({ achievementKey, unlocked, size = "md" }: AchievementBadgeProps) {
  const style = getAchievementBadgeStyle(achievementKey);
  const Icon = ICONS[style.symbol];
  const isDiamond = style.shape === "diamond";
  const sizeClass = size === "sm" ? "h-10 w-10" : "h-12 w-12";

  return (
    <div
      aria-hidden="true"
      data-achievement-family={style.family}
      data-achievement-symbol={style.symbol}
      data-achievement-shape={style.shape}
      data-achievement-state={unlocked ? "unlocked" : "locked"}
      className={`relative shrink-0 ${sizeClass}`}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center border ${SHAPES[style.shape]} ${
          unlocked ? "" : "border-border bg-muted text-muted-foreground"
        }`}
        style={unlocked ? {
          borderColor: style.accent,
          backgroundColor: `${style.accent}24`,
          color: style.accent,
        } : undefined}
      >
        <Icon className={`${size === "sm" ? "h-5 w-5" : "h-6 w-6"} ${isDiamond ? "-rotate-45" : ""}`} />
      </div>
      {!unlocked && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
          <Lock className="h-2.5 w-2.5" />
        </span>
      )}
    </div>
  );
}