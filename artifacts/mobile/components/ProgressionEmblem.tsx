import { useColors } from "@/hooks/useColors";
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";
import {
  getProgressionEmblemTier,
  type EmblemFamily,
  type EmblemState,
  type EmblemSymbol,
} from "@workspace/progression-emblem";

function Shape({ family, fill, stroke, strokeWidth }: {
  family: EmblemFamily;
  fill: string;
  stroke: string;
  strokeWidth: number;
}) {
  const common = { fill, stroke, strokeWidth, strokeLinejoin: "round" as const };
  if (family === "badge") return <Path d="M24 11 H76 L88 27 V67 L50 91 L12 67 V27 Z" {...common} />;
  if (family === "shield") return <Path d="M50 8 L87 21 V49 C87 72 70 86 50 94 C30 86 13 72 13 49 V21 Z" {...common} />;
  return <Path d="M50 6 L90 24 L80 72 L50 94 L20 72 L10 24 Z" {...common} />;
}

function TierMark({ symbol, color, detailCount }: {
  symbol: EmblemSymbol;
  color: string;
  detailCount: number;
}) {
  if (symbol === "trophy") {
    return (
      <G fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M39 24 H61 V31 C61 39 56 43 50 43 C44 43 39 39 39 31 Z" />
        <Path d="M39 28 H32 C32 36 35 39 41 39 M61 28 H68 C68 36 65 39 59 39 M50 43 V48 M43 48 H57" />
      </G>
    );
  }
  if (symbol === "crown") return <Path d="M35 39 L32 24 L42 31 L50 19 L58 31 L68 24 L65 39 Z" fill={color} opacity={0.95} />;
  if (symbol === "star") return <Path d="M50 20 L53.8 28.2 L63 29.3 L56.2 35.5 L58 44.5 L50 40 L42 44.5 L43.8 35.5 L37 29.3 L46.2 28.2 Z" fill={color} opacity={0.9} />;
  return (
    <G fill={color} opacity={0.9}>
      {Array.from({ length: Math.min(detailCount, 3) }, (_, index) => (
        <Rect key={index} x={42 + index * 6} y={28 - index * 3} width="4" height={10 + index * 3} rx="2" />
      ))}
    </G>
  );
}

export function ProgressionEmblem({
  level,
  masteryLevel,
  size = 132,
  state = "active",
}: {
  level: number;
  masteryLevel: number;
  size?: number;
  state?: EmblemState;
}) {
  const colors = useColors();
  const { isMastery, style, intraLevel, label, accessibleLabelPrefix } =
    getProgressionEmblemTier(level, masteryLevel);
  const palette = style.palette;
  const opacity = state === "locked" ? 0.42 : state === "completed" ? 0.78 : 1;

  return (
    <View
      style={[styles.wrap, { width: size, height: size, opacity }]}
      accessibilityRole="image"
      accessibilityLabel={`${accessibleLabelPrefix}, ${state}`}
      testID={`progression-emblem-${style.family}-${style.symbol}-${state}`}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="emblemGradient" x1="15%" y1="10%" x2="85%" y2="95%">
            <Stop offset="0%" stopColor={palette[0]} />
            <Stop offset="100%" stopColor={palette[1]} />
          </LinearGradient>
        </Defs>
        {state === "active" ? (
          <Path d="M50 3 L93 22 L83 75 L50 98 L17 75 L7 22 Z" fill="none" stroke={palette[2]} strokeWidth="1.5" opacity={0.28} />
        ) : null}
        <Shape family={style.family} fill="url(#emblemGradient)" stroke={state === "locked" ? colors.mutedForeground : palette[2]} strokeWidth={2 + Math.min(intraLevel, 10) * 0.12} />
        <Path d="M25 60 H75" stroke={palette[3]} strokeWidth="1" opacity={0.22} />
        <TierMark symbol={style.symbol} color={palette[3]} detailCount={Math.ceil(intraLevel / 3)} />
        <G fill={palette[3]}>
          {Array.from({ length: Math.min(3, Math.ceil(intraLevel / 3)) }, (_, index) => (
            <Path key={index} d={`M${44 + index * 6} 75 l2 2 l-2 2 l-2-2 Z`} opacity={0.45 + index * 0.15} />
          ))}
        </G>
      </Svg>
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[
          styles.level,
          {
            color: palette[3],
            top: style.symbol === "bars" && !isMastery ? "40%" : "45%",
            fontSize: isMastery ? 25 : 29,
          },
        ]}
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
  },
});