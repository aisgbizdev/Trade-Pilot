export interface ProgressionLevelSnapshot {
  level: number;
  totalXp: number;
}

export interface ProgressionLevelCheckpoint extends ProgressionLevelSnapshot {
  celebratedLevel: number;
}

export interface ProgressionLevelUpDecision {
  checkpoint: ProgressionLevelCheckpoint;
  celebrationLevel: number | null;
}

export function progressionLevelStorageKey(userId: number | string): string {
  return `@trade_pilot_progression_level:${userId}`;
}

export function parseProgressionLevelCheckpoint(
  serialized: string | null,
): ProgressionLevelCheckpoint | null {
  if (!serialized) return null;

  try {
    const value: unknown = JSON.parse(serialized);
    if (
      typeof value !== "object" ||
      value === null ||
      !("level" in value) ||
      !("totalXp" in value) ||
      !("celebratedLevel" in value) ||
      typeof value.level !== "number" ||
      !Number.isFinite(value.level) ||
      typeof value.totalXp !== "number" ||
      !Number.isFinite(value.totalXp) ||
      typeof value.celebratedLevel !== "number" ||
      !Number.isFinite(value.celebratedLevel)
    ) {
      return null;
    }

    return {
      level: value.level,
      totalXp: value.totalXp,
      celebratedLevel: value.celebratedLevel,
    };
  } catch {
    return null;
  }
}

export function decideProgressionLevelUp(
  previous: ProgressionLevelCheckpoint | null,
  current: ProgressionLevelSnapshot,
): ProgressionLevelUpDecision {
  if (!previous) {
    return {
      checkpoint: {
        ...current,
        celebratedLevel: current.level,
      },
      celebrationLevel: null,
    };
  }

  const earnedLevel =
    current.level > previous.level &&
    current.totalXp > previous.totalXp &&
    current.level > previous.celebratedLevel;

  return {
    checkpoint: {
      ...current,
      celebratedLevel: earnedLevel ? current.level : previous.celebratedLevel,
    },
    celebrationLevel: earnedLevel ? current.level : null,
  };
}