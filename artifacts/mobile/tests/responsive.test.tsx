import React from "react";
import { describe, expect, it, vi } from "vitest";
// @ts-expect-error
import TestRenderer, { act } from "react-test-renderer";

import AnalyzeScreen from "../app/(tabs)/index";
import HistoryScreen from "../app/(tabs)/history";
import ProfileScreen from "../app/(tabs)/profile";
import AnalysisDetailScreen from "../app/analysis/[id]";
import ProgressionScreen from "../app/progression";

const responsiveEnv = vi.hoisted(() => ({
  platform: { OS: "web" },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
  liquidGlassAvailable: false,
}));

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
    ActivityIndicator: host("ActivityIndicator"),
    FlatList: host("FlatList"),
    Platform: responsiveEnv.platform,
    Pressable: host("Pressable"),
    ScrollView: host("ScrollView"),
    StyleSheet: { create: <T,>(styles: T) => styles, hairlineWidth: 1 },
    Text: host("Text"),
    View: host("View"),
    RefreshControl: host("RefreshControl"),
  };
});

vi.mock("expo-router", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  useLocalSearchParams: () => ({ id: "1" }),
}));

vi.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => responsiveEnv.insets,
}));

vi.mock("expo-glass-effect", () => ({
  isLiquidGlassAvailable: () => responsiveEnv.liquidGlassAvailable,
}));

vi.mock("@expo/vector-icons", async () => {
  const ReactModule = await import("react");
  return {
    Feather: (props: Record<string, unknown>) => ReactModule.createElement("Feather", props),
  };
});

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1 }, isLoading: false }),
}));

vi.mock("@/context/LangContext", () => ({
  useLang: () => ({ t: new Proxy({}, { get: () => new Proxy({}, { get: () => "test" }) }), lang: "en" }),
}));

vi.mock("@/hooks/useColors", () => ({
  useColors: () => ({ background: "#000", foreground: "#fff", primary: "#0af", card: "#111", border: "#333", radius: 12 }),
}));

vi.mock("@workspace/api-client-react", () => ({
  useCreateAnalysis: () => ({ mutate: vi.fn(), isPending: false }),
  useGetAnalysisQuota: () => ({ data: undefined }),
  useGetProgressionSummary: () => ({ data: undefined, isError: false }),
  useListAnalyses: () => ({
    data: [{
      id: 1,
      instrument: "XAU/USD",
      timeframe: "4h",
      tradingBias: "bullish",
      mode: "pro",
      createdAt: "2026-09-10T00:00:00.000Z",
      validUntil: "2026-09-11T00:00:00.000Z",
    }],
    isLoading: false,
    isRefetching: false,
    refetch: vi.fn(),
  }),
  useGetAnalysis: () => ({ data: { id: 1, instrument: "test" }, isLoading: false }),
  useGetProgressionCatalog: () => ({ data: undefined, isError: false }),
  useGetProgressionHistory: () => ({ data: undefined, isError: false }),
}));

vi.mock("@/components/ProgressionEmblem", async () => {
  const ReactModule = await import("react");
  return { ProgressionEmblem: (props: Record<string, unknown>) => ReactModule.createElement("ProgressionEmblem", props) };
});

vi.mock("@/components/AchievementBadge", async () => {
  const ReactModule = await import("react");
  return { AchievementBadge: (props: Record<string, unknown>) => ReactModule.createElement("AchievementBadge", props) };
});

function hasMaxWidth(node: TestRenderer.ReactTestInstance, width: number): boolean {
  if (!node.props.style) return false;
  const styles = Array.isArray(node.props.style) ? node.props.style : [node.props.style];
  return styles.some((s: any) => s && s.maxWidth === width);
}

function hasStyleValue(
  node: TestRenderer.ReactTestInstance,
  key: string,
  value: unknown,
): boolean {
  const candidates = [node.props.style, node.props.contentContainerStyle]
    .flatMap((style) => (Array.isArray(style) ? style : [style]))
    .filter(Boolean);
  return candidates.some((style: Record<string, unknown>) => style[key] === value);
}

describe("Responsive dimensions", () => {
  it("AnalyzeScreen limits inner content to 720px", async () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<AnalyzeScreen />);
    });
    const nodes = renderer.root.findAll((node: TestRenderer.ReactTestInstance) => hasMaxWidth(node, 720));
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("HistoryScreen limits inner content to 720px", async () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<HistoryScreen />);
    });
    const nodes = renderer.root.findAll((node: TestRenderer.ReactTestInstance) => {
      if (node.props.contentContainerStyle) {
        const styles = Array.isArray(node.props.contentContainerStyle) ? node.props.contentContainerStyle : [node.props.contentContainerStyle];
        return styles.some((s: any) => s && s.maxWidth === 720);
      }
      return hasMaxWidth(node, 720);
    });
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("ProfileScreen limits inner content to 720px", async () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<ProfileScreen />);
    });
    const nodes = renderer.root.findAll((node: TestRenderer.ReactTestInstance) => hasMaxWidth(node, 720));
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("AnalysisDetailScreen limits inner content to 720px", async () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<AnalysisDetailScreen />);
    });
    const nodes = renderer.root.findAll((node: TestRenderer.ReactTestInstance) => {
      if (node.props.contentContainerStyle) {
        const styles = Array.isArray(node.props.contentContainerStyle) ? node.props.contentContainerStyle : [node.props.contentContainerStyle];
        return styles.some((s: any) => s && s.maxWidth === 720);
      }
      return hasMaxWidth(node, 720);
    });
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("ProgressionScreen limits inner content to 720px", async () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<ProgressionScreen />);
    });
    const nodes = renderer.root.findAll((node: TestRenderer.ReactTestInstance) => {
      if (node.props.contentContainerStyle) {
        const styles = Array.isArray(node.props.contentContainerStyle) ? node.props.contentContainerStyle : [node.props.contentContainerStyle];
        return styles.some((s: any) => s && s.maxWidth === 720);
      }
      return hasMaxWidth(node, 720);
    });
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("reserves native status-bar and full tab-bar space with nonzero safe-area insets", async () => {
    responsiveEnv.platform.OS = "android";
    responsiveEnv.insets.top = 30;
    responsiveEnv.insets.bottom = 24;

    let analyzeRenderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      analyzeRenderer = TestRenderer.create(<AnalyzeScreen />);
    });
    expect(
      analyzeRenderer.root.findAll((node: TestRenderer.ReactTestInstance) =>
        hasStyleValue(node, "paddingTop", 46)).length,
    ).toBeGreaterThan(0);
    expect(
      analyzeRenderer.root.findAll((node: TestRenderer.ReactTestInstance) =>
        hasStyleValue(node, "paddingBottom", 96)).length,
    ).toBeGreaterThan(0);

    let historyRenderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      historyRenderer = TestRenderer.create(<HistoryScreen />);
    });
    expect(
      historyRenderer.root.findAll((node: TestRenderer.ReactTestInstance) =>
        hasStyleValue(node, "paddingBottom", 96)).length,
    ).toBeGreaterThan(0);

    responsiveEnv.platform.OS = "web";
    responsiveEnv.insets.top = 0;
    responsiveEnv.insets.bottom = 0;
  });

  it("does not double-count the bottom inset when iOS uses native tabs", async () => {
    responsiveEnv.platform.OS = "ios";
    responsiveEnv.insets.top = 47;
    responsiveEnv.insets.bottom = 34;
    responsiveEnv.liquidGlassAvailable = true;

    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<ProfileScreen />);
    });
    expect(
      renderer.root.findAll((node: TestRenderer.ReactTestInstance) =>
        hasStyleValue(node, "paddingTop", 63)).length,
    ).toBeGreaterThan(0);
    expect(
      renderer.root.findAll((node: TestRenderer.ReactTestInstance) =>
        hasStyleValue(node, "paddingBottom", 16)).length,
    ).toBeGreaterThan(0);
    expect(
      renderer.root.findAll((node: TestRenderer.ReactTestInstance) =>
        hasStyleValue(node, "paddingBottom", 106)).length,
    ).toBe(0);

    responsiveEnv.platform.OS = "web";
    responsiveEnv.insets.top = 0;
    responsiveEnv.insets.bottom = 0;
    responsiveEnv.liquidGlassAvailable = false;
  });
});
