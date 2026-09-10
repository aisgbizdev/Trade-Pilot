import React from "react";
// @ts-expect-error Its runtime package does not ship TypeScript declarations.
import TestRenderer, { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";
import { ACHIEVEMENT_BADGE_CASES } from "@workspace/progression-emblem";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("react-native", async () => {
  const ReactModule = await import("react");
  const host = (name: string) => {
    function HostComponent(props: Record<string, unknown>) {
      return ReactModule.createElement(name, props, props.children as React.ReactNode);
    }
    HostComponent.displayName = name;
    return HostComponent;
  };
  return {
    StyleSheet: {
      create: <T,>(styles: T) => styles,
      hairlineWidth: 1,
    },
    View: host("View"),
  };
});

vi.mock("@expo/vector-icons", async () => {
  const ReactModule = await import("react");
  return {
    Feather: (props: Record<string, unknown>) => ReactModule.createElement("Feather", props),
  };
});

vi.mock("@/hooks/useColors", () => ({
  useColors: () => ({
    background: "#101010",
    border: "#303030",
    muted: "#202020",
    mutedForeground: "#909090",
  }),
}));

import { AchievementBadge } from "@/components/AchievementBadge";

describe("AchievementBadge mobile", () => {
  it.each(ACHIEVEMENT_BADGE_CASES)(
    "keeps the $family identity when unlocked and locked",
    async ({ key, family, symbol, shape }) => {
      let renderer!: TestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = TestRenderer.create(<AchievementBadge achievementKey={key} unlocked />);
      });
      expect(renderer.root.findByProps({
        testID: `achievement-badge:${family}:${symbol}:${shape}:unlocked`,
      })).toBeDefined();
      expect(renderer.root.findAllByType("Feather" as never).map((node: { props: { name: string } }) => node.props.name))
        .toEqual([symbol]);

      await act(async () => {
        renderer.update(<AchievementBadge achievementKey={key} unlocked={false} />);
      });
      expect(renderer.root.findByProps({
        testID: `achievement-badge:${family}:${symbol}:${shape}:locked`,
      })).toBeDefined();
      expect(renderer.root.findAllByType("Feather" as never).map((node: { props: { name: string } }) => node.props.name))
        .toEqual([symbol, "lock"]);
    },
  );
});