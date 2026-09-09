import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressionEmblem, getProgressionTier } from "../progression-emblem";

describe("ProgressionEmblem", () => {
  it.each([
    { level: 1, family: "badge", symbol: "bars" },
    { level: 30, family: "badge", symbol: "bars" },
    { level: 31, family: "shield", symbol: "star" },
    { level: 80, family: "crest", symbol: "star" },
    { level: 81, family: "crest", symbol: "trophy" },
    { level: 91, family: "crest", symbol: "crown" },
  ])("maps level $level to a $family with $symbol", ({ level, family, symbol }) => {
    const tier = getProgressionTier(level, 0);
    expect(tier.style.family).toBe(family);
    expect(tier.style.symbol).toBe(symbol);
  });

  it("reserves the crown treatment for the highest tier and Mastery", () => {
    expect(getProgressionTier(90, 0).style.symbol).toBe("trophy");
    expect(getProgressionTier(100, 0).style.symbol).toBe("crown");
    expect(getProgressionTier(100, 2).style.symbol).toBe("crown");
  });

  it("exposes tier, state, and accessible level without relying on a progress ring", () => {
    const { rerender } = render(
      <ProgressionEmblem level={47} masteryLevel={0} state="active" className="h-24 w-24" />,
    );
    const active = screen.getByRole("img", { name: /Level 47, Navigator, active/i });
    expect(active).toHaveAttribute("data-family", "shield");
    expect(active).toHaveAttribute("data-state", "active");
    expect(active.querySelector("circle")).not.toBeInTheDocument();

    rerender(<ProgressionEmblem level={47} masteryLevel={0} state="locked" />);
    expect(screen.getByRole("img", { name: /locked/i })).toHaveAttribute("data-state", "locked");
  });
});