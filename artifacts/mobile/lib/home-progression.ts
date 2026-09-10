export const HOME_PROGRESSION_TEST_ID = "home-progression-link";
export const HOME_PROGRESSION_ROUTE = "/progression";

const RANK_KEYS = [
  "seedling",
  "observer",
  "planner",
  "guardian",
  "navigator",
  "strategist",
  "sentinel",
  "vanguard",
  "steward",
  "apex",
] as const;

type RankKey = (typeof RANK_KEYS)[number];

type ProgressionCopy = {
  title: string;
  level: string;
  mastery: string;
} & Record<`rank_${RankKey}`, string>;

export type HomeProgressionSummary = {
  level: number;
  masteryLevel: number;
  rank: string;
};

export type HomeProgressionContent =
  | { kind: "hidden" }
  | { kind: "loading"; label: string; accessibilityLabel: string }
  | {
      kind: "summary";
      rank: string;
      level: string;
      accessibilityLabel: string;
    };

function isRankKey(value: string): value is RankKey {
  return (RANK_KEYS as readonly string[]).includes(value);
}

export function getHomeProgressionContent(
  copy: ProgressionCopy,
  summary: HomeProgressionSummary | undefined,
  isError: boolean,
  loadingLabel: string,
): HomeProgressionContent {
  if (isError) return { kind: "hidden" };
  if (!summary) {
    return {
      kind: "loading",
      label: loadingLabel,
      accessibilityLabel: copy.title,
    };
  }

  const rank = isRankKey(summary.rank)
    ? copy[`rank_${summary.rank}`]
    : summary.rank;
  const level = (
    summary.masteryLevel > 0 ? copy.mastery : copy.level
  ).replace(
    "{n}",
    String(summary.masteryLevel > 0 ? summary.masteryLevel : summary.level),
  );

  return {
    kind: "summary",
    rank,
    level,
    accessibilityLabel: `${copy.title}: ${rank}, ${level}`,
  };
}