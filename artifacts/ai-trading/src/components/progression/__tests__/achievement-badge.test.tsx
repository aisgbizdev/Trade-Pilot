import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ACHIEVEMENT_BADGE_CASES } from "@workspace/progression-emblem";
import { AchievementBadge } from "../achievement-badge";

afterEach(cleanup);

describe("AchievementBadge", () => {
  it.each(ACHIEVEMENT_BADGE_CASES)(
    "keeps the $family identity when unlocked and locked",
    ({ key, family, symbol, shape }) => {
      const { container, rerender } = render(
        <AchievementBadge achievementKey={key} unlocked />,
      );
      const unlocked = container.firstElementChild;
      expect(unlocked).toHaveAttribute("data-achievement-family", family);
      expect(unlocked).toHaveAttribute("data-achievement-symbol", symbol);
      expect(unlocked).toHaveAttribute("data-achievement-shape", shape);
      expect(unlocked).toHaveAttribute("data-achievement-state", "unlocked");
      expect(unlocked?.querySelector('[class*="lucide-lock"]')).toBeNull();

      rerender(<AchievementBadge achievementKey={key} unlocked={false} />);
      const locked = container.firstElementChild;
      expect(locked).toHaveAttribute("data-achievement-family", family);
      expect(locked).toHaveAttribute("data-achievement-symbol", symbol);
      expect(locked).toHaveAttribute("data-achievement-shape", shape);
      expect(locked).toHaveAttribute("data-achievement-state", "locked");
      expect(locked?.querySelector('[class*="lucide-lock"]')).not.toBeNull();
      expect(locked?.querySelectorAll("svg")).toHaveLength(2);
    },
  );
});