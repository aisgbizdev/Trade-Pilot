import { useColors } from "@/hooks/useColors";
import Svg, { Circle, Path, Polygon, Rect } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";

const FAMILY_SHAPES = [
  "circle",
  "hexagon",
  "octagon",
  "shield",
  "star",
  "cross",
  "crest",
  "wings",
  "diamond",
  "crown",
] as const;

type FamilyShape = (typeof FAMILY_SHAPES)[number];

function Shape({
  family,
  strokeWidth,
  fill,
  stroke,
}: {
  family: FamilyShape;
  strokeWidth: number;
  fill: string;
  stroke: string;
}) {
  const common = { fill, stroke, strokeWidth, strokeLinejoin: "round" as const };
  switch (family) {
    case "circle":
      return <Circle cx="50" cy="50" r="39" {...common} />;
    case "hexagon":
      return <Polygon points="50,9 86,29 86,71 50,91 14,71 14,29" {...common} />;
    case "octagon":
      return <Polygon points="30,9 70,9 91,30 91,70 70,91 30,91 9,70 9,30" {...common} />;
    case "shield":
      return <Path d="M14 20 L50 9 86 20 V50 C86 73 65 86 50 92 C35 86 14 73 14 50 Z" {...common} />;
    case "star":
      return <Polygon points="50,7 62,34 91,38 69,59 76,89 50,75 24,89 31,59 9,38 38,34" {...common} />;
    case "cross":
      return <Polygon points="38,9 62,9 62,37 91,37 91,63 62,63 62,91 38,91 38,63 9,63 9,37 38,37" {...common} />;
    case "crest":
      return <Path d="M50 8 L91 29 72 88 50 94 28 88 9 29 Z" {...common} />;
    case "wings":
      return <Path d="M50 20 L92 8 77 45 92 82 50 63 8 82 23 45 8 8 Z" {...common} />;
    case "diamond":
      return <Polygon points="50,7 93,50 50,93 7,50" {...common} />;
    case "crown":
      return <Path d="M8 27 L29 49 50 9 71 49 92 27 81 88 19 88 Z" {...common} />;
  }
}

export function ProgressionEmblem({
  level,
  masteryLevel,
  size = 132,
}: {
  level: number;
  masteryLevel: number;
  size?: number;
}) {
  const colors = useColors();
  const familyIndex = Math.min(Math.max(Math.floor((level - 1) / 10), 0), 9);
  const intraRank = ((Math.max(level, 1) - 1) % 10) + 1;
  const detailCount = Math.min(5, Math.ceil(intraRank / 2));
  const label = masteryLevel > 0 ? `M${masteryLevel}` : String(level);

  return (
    <View
      style={[styles.wrap, { width: size, height: size }]}
      accessibilityLabel={`Level ${level}, evolution ${intraRank} of 10`}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="47" fill={colors.muted} stroke={colors.border} strokeWidth="1" />
        <Shape
          family={FAMILY_SHAPES[familyIndex]}
          fill={colors.primary}
          stroke={colors.primaryForeground}
          strokeWidth={2 + intraRank * 0.16}
        />
        {Array.from({ length: detailCount }).map((_, index) => {
          const x = 30 + index * 10;
          return (
            <Circle
              key={x}
              cx={x}
              cy="78"
              r={intraRank >= 8 ? 2.2 : 1.7}
              fill={colors.primaryForeground}
            />
          );
        })}
        {intraRank >= 5 ? (
          <Rect x="28" y="68" width="44" height="1.5" rx=".75" fill={colors.primaryForeground} />
        ) : null}
      </Svg>
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[styles.level, { color: colors.primaryForeground }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  level: {
    position: "absolute",
    width: "50%",
    textAlign: "center",
    fontFamily: "Inter_700Bold",
    fontSize: 31,
  },
});