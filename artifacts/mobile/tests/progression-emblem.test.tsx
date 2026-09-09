import React from "react";
import { describe, expect, it, vi } from "vitest";
// @ts-expect-error Its runtime package does not ship TypeScript declarations.
import TestRenderer, { act } from "react-test-renderer";
import {
  PROGRESSION_EMBLEM_CASES,
  PROGRESSION_EMBLEM_STATES,
} from "@workspace/progression-emblem";

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
    StyleSheet: { create: <T,>(styles: T) => styles },
    Text: host("Text"),
    View: host("View"),
  };
});

vi.mock("react-native-svg", async () => {
  const ReactModule = await import("react");
  const host = (name: string) => {
    function HostComponent(props: Record<string, unknown>) {
      return ReactModule.createElement(name, props, props.children as React.ReactNode);
    }
    HostComponent.displayName = name;
    return HostComponent;
  };
  return {
    default: host("Svg"),
    Defs: host("Defs"),
    G: host("G"),
    LinearGradient: host("LinearGradient"),
    Path: host("Path"),
    Rect: host("Rect"),
    Stop: host("Stop"),
  };
});

vi.mock("@/hooks/useColors", () => ({
  useColors: () => ({ mutedForeground: "#777777" }),
}));

import { ProgressionEmblem } from "@/components/ProgressionEmblem";

describe("mobile ProgressionEmblem", () => {
  it.each(PROGRESSION_EMBLEM_CASES)(
    "renders $name at level $level with the shared family, symbol, label, and palette",
    async ({ level, masteryLevel, name, family, symbol, label, palette }) => {
      let renderer: TestRenderer.ReactTestRenderer;
      await act(async () => {
        renderer = TestRenderer.create(
          <ProgressionEmblem
            level={level}
            masteryLevel={masteryLevel}
            state="active"
          />,
        );
      });

      const root = renderer!.root;
      const emblem = root.findByProps({
        testID: `progression-emblem-${family}-${symbol}-active`,
      });
      expect(emblem.props.accessibilityLabel).toBe(
        `${masteryLevel > 0 ? "Mastery" : "Level"} ${masteryLevel > 0 ? masteryLevel : level}, ${name}, active`,
      );
      expect(root.findAllByType("Circle" as never)).toHaveLength(0);
      expect(root.findByProps({ stopColor: palette[0] })).toBeTruthy();
      expect(root.findByProps({ stopColor: palette[1] })).toBeTruthy();
      expect(root.findAllByType("Text" as never).some(
        (node: { children: React.ReactNode[] }) => node.children.includes(label),
      )).toBe(true);
      renderer!.unmount();
    },
  );

  it.each(PROGRESSION_EMBLEM_STATES)("renders the %s state", async (state) => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(
        <ProgressionEmblem level={47} masteryLevel={0} state={state} />,
      );
    });
    const emblem = renderer!.root.findByProps({
      testID: `progression-emblem-shield-star-${state}`,
    });
    expect(emblem.props.accessibilityLabel).toBe(`Level 47, Navigator, ${state}`);
    expect(emblem.props.style[1].opacity).toBe(
      state === "locked" ? 0.42 : state === "completed" ? 0.78 : 1,
    );
    renderer!.unmount();
  });
});