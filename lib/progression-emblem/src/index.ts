export type EmblemState = "active" | "completed" | "locked";
export type EmblemFamily = "badge" | "shield" | "crest";
export type EmblemSymbol = "bars" | "star" | "trophy" | "crown";
export type EmblemPalette = readonly [string, string, string, string];
export type AchievementBadgeFamily =
  | "journal"
  | "evaluation"
  | "checklist"
  | "guide"
  | "wait"
  | "consistency"
  | "level"
  | "mastery";
export type AchievementBadgeSymbol =
  | "compass"
  | "crosshair"
  | "shield"
  | "book-open"
  | "anchor"
  | "zap"
  | "chevron-up"
  | "award";
export type AchievementBadgeShape =
  | "medallion"
  | "square"
  | "shield"
  | "squircle"
  | "octagon"
  | "diamond"
  | "pentagon"
  | "hexagon";

export interface AchievementBadgeStyle {
  readonly family: AchievementBadgeFamily;
  readonly symbol: AchievementBadgeSymbol;
  readonly shape: AchievementBadgeShape;
  readonly accent: string;
}

export interface ProgressionEmblemStyle {
  readonly name: string;
  readonly family: EmblemFamily;
  readonly symbol: EmblemSymbol;
  readonly palette: EmblemPalette;
}

export const PROGRESSION_EMBLEM_TIERS: readonly ProgressionEmblemStyle[] = [
  { name: "Seedling", family: "badge", symbol: "bars", palette: ["#78936f", "#334a35", "#b8ceb0", "#dce8d7"] },
  { name: "Observer", family: "badge", symbol: "bars", palette: ["#738395", "#344252", "#b7c5d2", "#e2e8ee"] },
  { name: "Planner", family: "badge", symbol: "bars", palette: ["#6f99b8", "#294c69", "#b9dbf2", "#e4f3fc"] },
  { name: "Guardian", family: "shield", symbol: "star", palette: ["#a47b52", "#51351f", "#dfbb8d", "#f4d7b3"] },
  { name: "Navigator", family: "shield", symbol: "star", palette: ["#d69b38", "#745016", "#ffda87", "#fff0bd"] },
  { name: "Strategist", family: "shield", symbol: "star", palette: ["#946ab0", "#4b2d63", "#d7b1ee", "#eddafb"] },
  { name: "Sentinel", family: "crest", symbol: "star", palette: ["#bd5454", "#682323", "#f09a9a", "#ffd0d0"] },
  { name: "Vanguard", family: "crest", symbol: "star", palette: ["#278da2", "#164f5b", "#7bd4e2", "#c8f1f6"] },
  { name: "Steward", family: "crest", symbol: "trophy", palette: ["#bbb486", "#625d3d", "#fff4c3", "#fff9dd"] },
  { name: "Apex", family: "crest", symbol: "crown", palette: ["#303943", "#080a0d", "#f5b800", "#ffe17a"] },
] as const;

export const PROGRESSION_EMBLEM_MASTERY: ProgressionEmblemStyle = {
  name: "Mastery",
  family: "crest",
  symbol: "crown",
  palette: ["#b97a08", "#3d2106", "#fff0a6", "#ffffff"],
};

export function getProgressionEmblemTier(level: number, masteryLevel: number) {
  const safeLevel = Math.max(level, 1);
  const isMastery = masteryLevel > 0 || level > 100;
  const index = Math.min(Math.max(Math.floor((safeLevel - 1) / 10), 0), 9);
  const style = isMastery ? PROGRESSION_EMBLEM_MASTERY : PROGRESSION_EMBLEM_TIERS[index]!;
  const displayLevel = isMastery ? Math.max(masteryLevel, 1) : level;
  return {
    index,
    isMastery,
    style,
    intraLevel: isMastery ? Math.max(masteryLevel, 1) : ((safeLevel - 1) % 10) + 1,
    label: isMastery ? `M${displayLevel}` : String(level),
    accessibleLabelPrefix: `${isMastery ? "Mastery" : "Level"} ${displayLevel}, ${style.name}`,
  };
}

export const PROGRESSION_EMBLEM_CASES = [
  { level: 1, masteryLevel: 0, name: "Seedling", family: "badge", symbol: "bars", label: "1", palette: PROGRESSION_EMBLEM_TIERS[0]!.palette },
  { level: 10, masteryLevel: 0, name: "Seedling", family: "badge", symbol: "bars", label: "10", palette: PROGRESSION_EMBLEM_TIERS[0]!.palette },
  { level: 11, masteryLevel: 0, name: "Observer", family: "badge", symbol: "bars", label: "11", palette: PROGRESSION_EMBLEM_TIERS[1]!.palette },
  { level: 30, masteryLevel: 0, name: "Planner", family: "badge", symbol: "bars", label: "30", palette: PROGRESSION_EMBLEM_TIERS[2]!.palette },
  { level: 31, masteryLevel: 0, name: "Guardian", family: "shield", symbol: "star", label: "31", palette: PROGRESSION_EMBLEM_TIERS[3]!.palette },
  { level: 80, masteryLevel: 0, name: "Vanguard", family: "crest", symbol: "star", label: "80", palette: PROGRESSION_EMBLEM_TIERS[7]!.palette },
  { level: 81, masteryLevel: 0, name: "Steward", family: "crest", symbol: "trophy", label: "81", palette: PROGRESSION_EMBLEM_TIERS[8]!.palette },
  { level: 90, masteryLevel: 0, name: "Steward", family: "crest", symbol: "trophy", label: "90", palette: PROGRESSION_EMBLEM_TIERS[8]!.palette },
  { level: 91, masteryLevel: 0, name: "Apex", family: "crest", symbol: "crown", label: "91", palette: PROGRESSION_EMBLEM_TIERS[9]!.palette },
  { level: 100, masteryLevel: 0, name: "Apex", family: "crest", symbol: "crown", label: "100", palette: PROGRESSION_EMBLEM_TIERS[9]!.palette },
  { level: 100, masteryLevel: 1, name: "Mastery", family: "crest", symbol: "crown", label: "M1", palette: PROGRESSION_EMBLEM_MASTERY.palette },
] as const;

export const PROGRESSION_EMBLEM_STATES: readonly EmblemState[] = ["active", "completed", "locked"];

export const ACHIEVEMENT_BADGE_STYLES: Readonly<Record<AchievementBadgeFamily, AchievementBadgeStyle>> = {
  journal: { family: "journal", symbol: "compass", shape: "medallion", accent: "#3b82f6" },
  evaluation: { family: "evaluation", symbol: "crosshair", shape: "square", accent: "#10b981" },
  checklist: { family: "checklist", symbol: "shield", shape: "shield", accent: "#94a3b8" },
  guide: { family: "guide", symbol: "book-open", shape: "squircle", accent: "#06b6d4" },
  wait: { family: "wait", symbol: "anchor", shape: "octagon", accent: "#f59e0b" },
  consistency: { family: "consistency", symbol: "zap", shape: "diamond", accent: "#eab308" },
  level: { family: "level", symbol: "chevron-up", shape: "pentagon", accent: "#d6a52d" },
  mastery: { family: "mastery", symbol: "award", shape: "hexagon", accent: "#a855f7" },
};

export function getAchievementBadgeStyle(key: string): AchievementBadgeStyle {
  if (key === "first_reflection" || key.startsWith("journal_")) return ACHIEVEMENT_BADGE_STYLES.journal;
  if (key.startsWith("evaluation_")) return ACHIEVEMENT_BADGE_STYLES.evaluation;
  if (key.startsWith("checklist_")) return ACHIEVEMENT_BADGE_STYLES.checklist;
  if (key.startsWith("guide_")) return ACHIEVEMENT_BADGE_STYLES.guide;
  if (key.startsWith("wait_")) return ACHIEVEMENT_BADGE_STYLES.wait;
  if (key.startsWith("streak_") || key === "consistent_1000") return ACHIEVEMENT_BADGE_STYLES.consistency;
  if (key.startsWith("mastery_")) return ACHIEVEMENT_BADGE_STYLES.mastery;
  return ACHIEVEMENT_BADGE_STYLES.level;
}

export const ACHIEVEMENT_BADGE_CASES = [
  { key: "first_reflection", family: "journal", symbol: "compass", shape: "medallion" },
  { key: "evaluation_10", family: "evaluation", symbol: "crosshair", shape: "square" },
  { key: "checklist_10", family: "checklist", symbol: "shield", shape: "shield" },
  { key: "guide_5", family: "guide", symbol: "book-open", shape: "squircle" },
  { key: "wait_10", family: "wait", symbol: "anchor", shape: "octagon" },
  { key: "streak_30", family: "consistency", symbol: "zap", shape: "diamond" },
  { key: "level_50", family: "level", symbol: "chevron-up", shape: "pentagon" },
  { key: "mastery_1", family: "mastery", symbol: "award", shape: "hexagon" },
] as const;