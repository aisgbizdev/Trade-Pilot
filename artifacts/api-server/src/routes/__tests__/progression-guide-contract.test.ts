import { describe, expect, it } from "vitest";

import { GUIDE_IDS, startEvidenceSchema } from "../progression";

describe("progression guide evidence contract", () => {
  it.each(["personal-progression", "timeframe-risk-map"] as const)(
    "accepts completion evidence for %s",
    (guideId) => {
      expect(GUIDE_IDS).toContain(guideId);
      expect(
        startEvidenceSchema.safeParse({
          source: "guide_completion",
          guideId,
        }).success,
      ).toBe(true);
    },
  );
});