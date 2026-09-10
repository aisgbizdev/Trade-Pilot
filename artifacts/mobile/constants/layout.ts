import { isLiquidGlassAvailable } from "expo-glass-effect";

export const CLASSIC_TAB_BAR_HEIGHT = 56;

export function getTabContentBottomPadding(
  platform: string,
  bottomInset: number,
): number {
  if (platform === "web") return 100;
  if (isLiquidGlassAvailable()) return 16;
  return CLASSIC_TAB_BAR_HEIGHT + bottomInset + 16;
}