import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error react-test-renderer does not ship declarations.
import TestRenderer, { act } from "react-test-renderer";
import { PreAnalysisChecklist } from "../components/PreAnalysisChecklist";
import GuidesScreen from "../app/guides";
import AnalysisDetailScreen from "../app/analysis/[id]";
import en from "../locales/en";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const state = vi.hoisted(() => ({
  start: vi.fn(),
  record: vi.fn(),
  feedback: vi.fn(),
  invalidate: vi.fn(),
  store: new Map<string, string>(),
  catalog: { completedGuideIds: [] as string[] },
  analysisFeedback: null as null | { feedbackType: "useful" | "not_useful"; note: string | null },
}));
vi.mock("react-native", async () => {
  const ReactModule = await import("react");
  const host = (name: string) => {
    function Host(props: Record<string, unknown>) {
      return ReactModule.createElement(name, props, props.children as React.ReactNode);
    }
    return Host;
  };
  return {
    ActivityIndicator: host("ActivityIndicator"), Pressable: host("Pressable"),
    ScrollView: host("ScrollView"), Text: host("Text"), TextInput: host("TextInput"),
    View: host("View"), Platform: { OS: "web" },
    StyleSheet: { create: <T,>(s: T) => s, hairlineWidth: 1 },
  };
});
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async (key: string) => state.store.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => { state.store.set(key, value); }),
    removeItem: vi.fn(async (key: string) => { state.store.delete(key); }),
  },
}));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => ({ user: { id: 42 } }) }));
vi.mock("@/context/LangContext", () => ({ useLang: () => ({ t: en, lang: "en" }) }));
vi.mock("@/hooks/useColors", () => ({ useColors: () => ({
  card: "#111", background: "#000", foreground: "#fff", mutedForeground: "#aaa",
  border: "#333", primary: "#09f", primaryForeground: "#fff", radius: 12,
}) }));
vi.mock("@tanstack/react-query", () => ({ useQueryClient: () => ({ invalidateQueries: state.invalidate }) }));
vi.mock("@expo/vector-icons", async () => {
  const ReactModule = await import("react");
  return { Feather: (props: Record<string, unknown>) => ReactModule.createElement("Feather", props) };
});
vi.mock("expo-router", () => ({
  useRouter: () => ({ back: vi.fn() }),
  useLocalSearchParams: () => ({ id: "7" }),
}));
vi.mock("react-native-safe-area-context", () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0 }) }));
vi.mock("@workspace/api-client-react", () => ({
  useStartProgressionEvidence: () => ({ mutateAsync: state.start, isPending: false }),
  useRecordProgressionActivity: () => ({ mutateAsync: state.record, isPending: false }),
  useSubmitFeedback: () => ({ mutateAsync: state.feedback, isPending: false }),
  useGetProgressionCatalog: () => ({ data: state.catalog, isLoading: false, isError: false }),
  useGetAnalysis: () => ({ data: {
    id: 7, instrument: "XAU/USD", timeframe: "1h", mode: "pro", tradingBias: "neutral",
    createdAt: "2026-09-01", validUntil: "2026-09-02", feedback: state.analysisFeedback,
  }, isLoading: false }),
  getGetAnalysisQueryKey: (id: number) => ["analysis", id],
  getGetProgressionSummaryQueryKey: () => ["progression", "summary"],
  getGetProgressionCatalogQueryKey: () => ["progression", "catalog"],
  getGetProgressionHistoryQueryKey: () => ["progression", "history"],
}));

function press(renderer: TestRenderer.ReactTestRenderer, testID: string) {
  return renderer.root.findByProps({ testID }).props.onPress();
}

describe("mobile XP activities", () => {
  beforeEach(() => {
    state.store.clear();
    state.catalog.completedGuideIds = [];
    state.analysisFeedback = null;
    state.start.mockReset();
    state.record.mockReset();
    state.feedback.mockReset();
    state.invalidate.mockReset().mockResolvedValue(undefined);
  });

  it("restores a checklist session, requires four checks and honors the server minimum", async () => {
    const session = { token: "a".repeat(43), source: "pre_analysis_checklist", subject: "x", minimumCompleteAt: new Date(Date.now() + 1000).toISOString() };
    state.start.mockResolvedValue(session);
    state.record.mockResolvedValue({ awarded: true, xp: 8 });
    let view!: TestRenderer.ReactTestRenderer;
    await act(async () => { view = TestRenderer.create(<PreAnalysisChecklist instrument="XAU/USD" timeframe="1h" />); });
    await act(async () => { await press(view, "checklist-start"); });
    expect(state.start).toHaveBeenCalledWith({ data: { source: "pre_analysis_checklist", checklist: { instrument: "XAU/USD", timeframe: "1h" } } });
    expect(state.store.size).toBe(1);
    await act(async () => { view.unmount(); });
    await act(async () => { view = TestRenderer.create(<PreAnalysisChecklist instrument="XAU/USD" timeframe="1h" />); });
    expect(state.start).toHaveBeenCalledTimes(1);
    await act(async () => { for (let i = 0; i < 4; i++) press(view, `checklist-item-${i}`); });
    expect(view.root.findByProps({ testID: "checklist-complete" }).props.disabled).toBe(true);
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 1100)); });
    await act(async () => { await press(view, "checklist-complete"); });
    expect(state.record).toHaveBeenCalledWith({ data: { token: session.token } });
    expect(state.invalidate).toHaveBeenCalledTimes(3);
    expect(state.store.size).toBe(0);
    await act(async () => { view.unmount(); });
  });

  it("records guide completion once after reading and disables completed articles", async () => {
    state.start.mockResolvedValue({ token: "b".repeat(43), minimumCompleteAt: new Date(Date.now() - 1000).toISOString() });
    state.record.mockResolvedValue({ awarded: true, xp: 15 });
    let view!: TestRenderer.ReactTestRenderer;
    await act(async () => { view = TestRenderer.create(<GuidesScreen />); });
    await act(async () => { await press(view, "guide-analysis-workflow"); });
    expect(state.start).toHaveBeenCalledWith({ data: { source: "guide_completion", guideId: "analysis-workflow" } });
    await act(async () => { await press(view, "guide-complete"); });
    expect(state.record).toHaveBeenCalledTimes(1);
    expect(state.invalidate).toHaveBeenCalledTimes(3);
    await act(async () => { view.unmount(); });
  });

  it("saves feedback on the analysis and refreshes progress without claiming local XP", async () => {
    state.feedback.mockResolvedValue({ id: 9 });
    let view!: TestRenderer.ReactTestRenderer;
    await act(async () => { view = TestRenderer.create(<AnalysisDetailScreen />); });
    await act(async () => { press(view, "feedback-useful"); });
    await act(async () => { await press(view, "feedback-save"); });
    expect(state.feedback).toHaveBeenCalledWith({ id: 7, data: { feedbackType: "useful", note: undefined } });
    expect(state.invalidate).toHaveBeenCalledTimes(4);
    await act(async () => { view.unmount(); });
  });
});