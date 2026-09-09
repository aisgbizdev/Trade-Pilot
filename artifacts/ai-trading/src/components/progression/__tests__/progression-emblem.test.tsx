import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  PROGRESSION_EMBLEM_CASES,
  PROGRESSION_EMBLEM_STATES,
} from "@workspace/progression-emblem";
import { ProgressionEmblem, getProgressionTier } from "../progression-emblem";

describe("ProgressionEmblem", () => {
  it.each(PROGRESSION_EMBLEM_CASES)(
    "renders $name at level $level with the shared family, symbol, label, and palette",
    ({ level, masteryLevel, name, family, symbol, label, palette }) => {
    const tier = getProgressionTier(level, masteryLevel);
    expect(tier.style.family).toBe(family);
    expect(tier.style.symbol).toBe(symbol);
    expect(tier.style.palette).toEqual(palette);
    expect(tier.label).toBe(label);

    const { unmount } = render(
      <ProgressionEmblem level={level} masteryLevel={masteryLevel} state="active" />,
    );
    const emblem = screen.getByRole("img", {
      name: new RegExp(`${name}, active`, "i"),
    });
    expect(emblem).toHaveAttribute("data-family", family);
    expect(emblem).toHaveAttribute("data-symbol", symbol);
    expect(emblem).toHaveTextContent(label);
    expect(emblem.querySelector("circle")).not.toBeInTheDocument();
    const stops = emblem.querySelectorAll("linearGradient stop");
    expect(stops[0]).toHaveAttribute("stop-color", palette[0]);
    expect(stops[1]).toHaveAttribute("stop-color", palette[1]);
    unmount();
  });

  it.each(PROGRESSION_EMBLEM_STATES)("exposes the %s state", (state) => {
    render(
      <ProgressionEmblem level={47} masteryLevel={0} state={state} className="h-24 w-24" />,
    );
    expect(screen.getByRole("img", {
      name: new RegExp(`Level 47, Navigator, ${state}`, "i"),
    })).toHaveAttribute("data-state", state);
  });
});