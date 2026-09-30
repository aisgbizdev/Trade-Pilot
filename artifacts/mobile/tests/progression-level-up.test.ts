import { describe, expect, it } from "vitest";
import {
  decideProgressionLevelUp,
  parseProgressionLevelCheckpoint,
  progressionLevelStorageKey,
  type ProgressionLevelCheckpoint,
} from "../lib/progression-level-up";
import { PROGRESSION_XP_SOURCES } from "../lib/progression-help";
import en from "../locales/en";
import id from "../locales/id";

describe("mobile progression level-up deduplication", () => {
  it("records the first observed level without replaying old progress", () => {
    const result = decideProgressionLevelUp(null, { level: 8, totalXp: 420 });

    expect(result.celebrationLevel).toBeNull();
    expect(result.checkpoint).toEqual({
      level: 8,
      totalXp: 420,
      celebratedLevel: 8,
    });
  });

  it("celebrates a level increase backed by newly earned XP", () => {
    const previous: ProgressionLevelCheckpoint = {
      level: 8,
      totalXp: 420,
      celebratedLevel: 8,
    };

    expect(decideProgressionLevelUp(previous, { level: 9, totalXp: 455 })).toEqual({
      checkpoint: { level: 9, totalXp: 455, celebratedLevel: 9 },
      celebrationLevel: 9,
    });
  });

  it("does not celebrate level changes without new XP or repeat a celebrated level", () => {
    const previous: ProgressionLevelCheckpoint = {
      level: 8,
      totalXp: 420,
      celebratedLevel: 8,
    };

    const migrated = decideProgressionLevelUp(previous, { level: 9, totalXp: 420 });
    expect(migrated.celebrationLevel).toBeNull();
    expect(migrated.checkpoint).toEqual({ ...previous, level: 9 });

    const refreshed = decideProgressionLevelUp(
      { level: 9, totalXp: 455, celebratedLevel: 9 },
      { level: 9, totalXp: 455 },
    );
    expect(refreshed.celebrationLevel).toBeNull();
  });

  it("parses only valid saved checkpoints and scopes keys by user", () => {
    const saved = { level: 12, totalXp: 800, celebratedLevel: 11 };
    expect(parseProgressionLevelCheckpoint(JSON.stringify(saved))).toEqual(saved);
    expect(parseProgressionLevelCheckpoint("{invalid")).toBeNull();
    expect(parseProgressionLevelCheckpoint(JSON.stringify({ level: 12 }))).toBeNull();
    expect(progressionLevelStorageKey(25)).not.toBe(progressionLevelStorageKey(26));
  });

  it("lists every active XP source with its current daily cap", () => {
    expect(PROGRESSION_XP_SOURCES).toEqual([
      { copyKey: "leveling_checklist", xp: 8, dailyCap: 3 },
      { copyKey: "leveling_feedback", xp: 12, dailyCap: 3 },
      { copyKey: "leveling_journal", xp: 20, dailyCap: 2 },
      { copyKey: "leveling_guide", xp: 15, dailyCap: 2 },
      { copyKey: "leveling_safe_wait", xp: 15, dailyCap: 2 },
      { copyKey: "leveling_streak", xp: 10, dailyCap: 1 },
    ]);
  });

  it.each([["en", en], ["id", id]] as const)(
    "points to real mobile actions while retaining web-only actions in %s",
    (_language, locale) => {
      for (const { copyKey } of PROGRESSION_XP_SOURCES) {
        if (["leveling_journal", "leveling_safe_wait"].includes(copyKey)) {
          expect(locale.progression[copyKey]).toContain("TradePilot.id");
        } else {
          expect(locale.progression[copyKey]).not.toContain("available on TradePilot.id web");
        }
      }
      expect(locale.progression.leveling_checklist).toContain(locale.activities.checklist_start);
      expect(locale.progression.leveling_feedback).toContain(locale.activities.feedback_save);
      expect(locale.progression.leveling_guide).toContain(locale.activities.open_guides);
      expect(locale.progression.leveling_daily_cap).toContain("{count}");
      expect(locale.progression.leveling_feedback.toLowerCase()).toContain(
        _language === "id" ? "opsional" : "optional",
      );
    },
  );
});