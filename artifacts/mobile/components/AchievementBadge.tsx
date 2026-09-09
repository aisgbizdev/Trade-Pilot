import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import {
  getAchievementBadgeStyle,
  type AchievementBadgeShape,
  type AchievementBadgeSymbol,
} from "@workspace/progression-emblem";
import { StyleSheet, View } from "react-native";

const ICONS: Record<AchievementBadgeSymbol, React.ComponentProps<typeof Feather>["name"]> = {
  compass: "compass",
  crosshair: "crosshair",
  shield: "shield",
  "book-open": "book-open",
  anchor: "anchor",
  zap: "zap",
  "chevron-up": "chevron-up",
  award: "award",
};

function shapeStyle(shape: AchievementBadgeShape, size: number) {
  const styles: Record<AchievementBadgeShape, object> = {
    medallion: { borderRadius: size / 2 },
    square: { borderRadius: 4 },
    shield: { borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    squircle: { borderRadius: 16 },
    octagon: { borderRadius: 10, borderWidth: 2 },
    diamond: { borderRadius: 7, transform: [{ rotate: "45deg" }] },
    pentagon: { borderTopLeftRadius: size / 2, borderTopRightRadius: size / 2, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
    hexagon: { borderRadius: 12, borderWidth: 2 },
  };
  return styles[shape];
}

interface AchievementBadgeProps {
  achievementKey: string;
  unlocked: boolean;
  size?: "sm" | "md";
}

export function AchievementBadge({ achievementKey, unlocked, size = "md" }: AchievementBadgeProps) {
  const colors = useColors();
  const badge = getAchievementBadgeStyle(achievementKey);
  const dimension = size === "sm" ? 40 : 46;
  const isDiamond = badge.shape === "diamond";

  return (
    <View
      accessible={false}
      testID={`achievement-badge:${badge.family}:${badge.symbol}:${badge.shape}:${unlocked ? "unlocked" : "locked"}`}
      style={{ width: dimension, height: dimension }}
    >
      <View
        style={[
          styles.badge,
          { width: dimension, height: dimension },
          shapeStyle(badge.shape, dimension),
          unlocked
            ? { borderColor: badge.accent, backgroundColor: `${badge.accent}24` }
            : { borderColor: colors.border, backgroundColor: colors.muted },
        ]}
      >
        <View style={isDiamond ? styles.inverseDiamond : undefined}>
          <Feather
            name={ICONS[badge.symbol]}
            size={size === "sm" ? 19 : 21}
            color={unlocked ? badge.accent : colors.mutedForeground}
          />
        </View>
      </View>
      {!unlocked && (
        <View style={[styles.lock, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Feather name="lock" size={9} color={colors.mutedForeground} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  inverseDiamond: {
    transform: [{ rotate: "-45deg" }],
  },
  lock: {
    position: "absolute",
    right: -3,
    bottom: -3,
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});