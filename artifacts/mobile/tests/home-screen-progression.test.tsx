import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// react-test-renderer is deliberately kept at React's exact version.
// @ts-expect-error Its runtime package does not ship TypeScript declarations.
import TestRenderer, { act } from "react-test-renderer";

import en from "../locales/en";
import id from "../locales/id";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const state = vi.hoisted(() => ({
  language: "en" as "en" | "id",
  progression: {
    data: undefined as
      | { level: number; masteryLevel: number; rank: string }
      | undefined,
    isError: false,
  },
  push: vi.fn(),
}));

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
    ActivityIndicator: host("ActivityIndicator"),
    Platform: { OS: "web" },
    Pressable: host("Pressable"),
    ScrollView: host("ScrollView"),
    StyleSheet: {
      create: <T,>(styles: T) => styles,
      hairlineWidth: 1,
    },
    Text: host("Text"),
    View: host("View"),
  };
});

vi.mock("@expo/vector-icons", async () => {
  const ReactModule = await import("react");
  return {
    Feather: (props: Record<string, unknown>) =>
      ReactModule.createElement("Feather", props),
  };
});

vi.mock("expo-router", () => ({
  useRouter: () => ({ push: state.push }),
}));

vi.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

vi.mock("@/components/ProgressionEmblem", async () => {
  const ReactModule = await import("react");
  return {
    ProgressionEmblem: (props: Record<string, unknown>) =>
      ReactModule.createElement("ProgressionEmblem", props),
  };
});

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: "authenticated@example.test",
      displayName: "Authenticated Tester",
      selectedMode: "pro",
    },
  }),
}));

vi.mock("@/context/LangContext", () => ({
  useLang: () => ({ t: state.language === "id" ? id : en }),
}));

vi.mock("@/hooks/useColors", () => ({
  useColors: () => ({
    background: "#000",
    foreground: "#fff",
    border: "#333",
    primary: "#0af",
    card: "#111",
    mutedForeground: "#999",
    destructive: "#f00",
    primaryForeground: "#fff",
    radius: 12,
  }),
}));

vi.mock("@workspace/api-client-react", () => ({
  useCreateAnalysis: () => ({ mutate: vi.fn(), isPending: false }),
  useGetAnalysisQuota: () => ({ data: undefined }),
  useGetProgressionSummary: () => state.progression,
}));

import AnalyzeScreen from "../app/(tabs)/index";

function visibleText(renderer: TestRenderer.ReactTestRenderer): string {
  return renderer.root
    .findAllByType("Text")
    .flatMap((node: TestRenderer.ReactTestInstance) => node.children)
    .filter((child: unknown): child is string => typeof child === "string")
    .join(" ");
}

async function renderScreen() {
  let renderer: TestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = TestRenderer.create(<AnalyzeScreen />);
  });
  return renderer!;
}

describe("authenticated mobile home progression card", () => {
  beforeEach(() => {
    state.language = "en";
    state.progression = { data: undefined, isError: false };
    state.push.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ["id", { level: 25, masteryLevel: 0, rank: "planner" }, "Perencana", "Level 25"],
    ["en", { level: 25, masteryLevel: 0, rank: "planner" }, "Planner", "Level 25"],
    ["id", { level: 103, masteryLevel: 3, rank: "apex" }, "Puncak", "Mastery 3"],
    ["en", { level: 103, masteryLevel: 3, rank: "apex" }, "Apex", "Mastery 3"],
  ] as const)(
    "renders %s progression copy and opens the Progression page",
    async (language, summary, rank, level) => {
      state.language = language;
      state.progression = { data: summary, isError: false };
      const renderer = await renderScreen();

      expect(visibleText(renderer)).toContain(rank);
      expect(visibleText(renderer)).toContain(level);

      const link = renderer.root.findByProps({ testID: "home-progression-link" });
      await act(async () => {
        link.props.onPress();
      });
      expect(state.push).toHaveBeenCalledOnce();
      expect(state.push).toHaveBeenCalledWith("/progression");
    },
  );

  it("keeps loading compact without hiding the analysis form", async () => {
    state.language = "id";
    const renderer = await renderScreen();
    const text = visibleText(renderer);

    expect(renderer.root.findByProps({ testID: "home-progression-link" })).toBeTruthy();
    expect(text).toContain("Memuat progresmu...");
    expect(text).toContain("Instrument");
    expect(text).toContain("Buat Analisis AI");
  });

  it("hides a failed progression card without blocking the analysis form", async () => {
    state.progression = { data: undefined, isError: true };
    const renderer = await renderScreen();
    const text = visibleText(renderer);

    expect(() =>
      renderer.root.findByProps({ testID: "home-progression-link" }),
    ).toThrow();
    expect(text).toContain("Instrument");
    expect(text).toContain("Get AI Analysis");
  });
});