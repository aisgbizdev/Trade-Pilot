export interface ProgressionLevelObservation {
  currentLevel: number;
  previousLevel: number | null;
  currentTotalXp: number;
  previousTotalXp: number | null;
  highestAcknowledgedLevel: number;
}

export interface ProgressionLevelObservationResult {
  highestAcknowledgedLevel: number;
  celebrateLevel: number | null;
}

/**
 * Treat the first fetched level as the baseline; only a subsequent in-session
 * increase is a new level-up worth celebrating.
 */
export function observeProgressionLevel({
  currentLevel,
  previousLevel,
  currentTotalXp,
  previousTotalXp,
  highestAcknowledgedLevel,
}: ProgressionLevelObservation): ProgressionLevelObservationResult {
  const newLevel =
    previousLevel !== null &&
    previousTotalXp !== null &&
    currentTotalXp > previousTotalXp &&
    currentLevel > previousLevel &&
    currentLevel > highestAcknowledgedLevel;

  return {
    highestAcknowledgedLevel: Math.max(highestAcknowledgedLevel, currentLevel),
    celebrateLevel: newLevel ? currentLevel : null,
  };
}