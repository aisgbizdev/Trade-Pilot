import { describe, expect, it } from "vitest";
import { observeProgressionLevel } from "./progression-level-observation";

describe("observeProgressionLevel", () => {
  it("uses the initial fetched level as a silent baseline", () => {
    expect(observeProgressionLevel({
      currentLevel: 8,
      previousLevel: null,
      currentTotalXp: 420,
      previousTotalXp: null,
      highestAcknowledgedLevel: 0,
    })).toEqual({
      highestAcknowledgedLevel: 8,
      celebrateLevel: null,
    });
  });

  it("celebrates a newly reached level once", () => {
    const result = observeProgressionLevel({
      currentLevel: 9,
      previousLevel: 8,
      currentTotalXp: 455,
      previousTotalXp: 420,
      highestAcknowledgedLevel: 8,
    });
    expect(result).toEqual({
      highestAcknowledgedLevel: 9,
      celebrateLevel: 9,
    });
    expect(observeProgressionLevel({
      currentLevel: 9,
      previousLevel: 9,
      currentTotalXp: 455,
      previousTotalXp: 455,
      highestAcknowledgedLevel: result.highestAcknowledgedLevel,
    }).celebrateLevel).toBeNull();
  });

  it("does not celebrate again when an already acknowledged level is regained", () => {
    expect(observeProgressionLevel({
      currentLevel: 9,
      previousLevel: 7,
      currentTotalXp: 455,
      previousTotalXp: 420,
      highestAcknowledgedLevel: 9,
    })).toEqual({
      highestAcknowledgedLevel: 9,
      celebrateLevel: null,
    });
  });
  it("ignores a level recalculation without newly earned XP", () => {
    expect(observeProgressionLevel({
      currentLevel: 9,
      previousLevel: 8,
      currentTotalXp: 420,
      previousTotalXp: 420,
      highestAcknowledgedLevel: 8,
    }).celebrateLevel).toBeNull();
  });
});