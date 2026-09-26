import { afterEach, describe, expect, it, vi } from "vitest";
import type { AdaptiveSidePositionPlan } from "@/lib/adaptive-position-plan";
import { en } from "@/locales/en";
import { id } from "@/locales/id";
import { buildAdaptivePlanShareData, renderAdaptivePlanSharePng } from "../adaptive-plan-share";

const buy = {
  side: "buy",
  ladder: [
    { level: 0, price: 4300, lot: 0.09 },
    { level: 1, price: 4280, lot: 0.04 },
  ],
  rejectedLadder: [{ level: 2, price: 9999, lot: 9.9 }],
  totalLots: 0.13,
  stopLoss: 4290,
  estimatedCycleLoss: 90,
  marginRequired: 200,
  takeProfit1: 4320,
  takeProfit2: 4340,
  profitToTakeProfit1: 180,
  profitToTakeProfit2: 360,
} as AdaptiveSidePositionPlan;

const budget = {
  usableRiskBudget: 187.31,
  unusedRiskBuffer: 145.69,
  riskUtilizationRate: 0.56,
};

afterEach(() => vi.restoreAllMocks());

describe("Adaptive summary image", () => {
  it("exports only selected Buy ladder with an explicit conditional status", () => {
    const data = buildAdaptivePlanShareData({
      instrument: "XAU/USD", timeframe: "1h", analysisCreatedAt: "2026-09-09T08:00:00.000Z",
      accountTier: "mini", riskStyle: "balanced", plan: buy, budget,
      actionable: false, lang: "id", copy: id.analysis_detail,
    });
    expect(data.side).toBe("buy");
    expect(data.status).toContain("belum dapat ditindaklanjuti");
    expect(data.statusDetail).toContain("Angka hanya sebagai acuan");
    expect(data.positions.map((row) => row.value)).toEqual(["4.300 · 0,09 lot", "4.280 · 0,04 lot"]);
    expect(data.positions.some((row) => row.value.includes("9.999"))).toBe(false);
    expect(data.metrics.find((metric) => metric.label === id.analysis_detail.adaptive_usable_risk_budget)?.value).toBe("$187,31");
    expect(data.metrics.find((metric) => metric.label === id.analysis_detail.trade_plan_tp1)?.detail).toContain("+$180");
    expect(data.analyzedAt).toContain("9 Sep 2026");
    expect(data.notes).toHaveLength(1);
    expect(data.notes[0]).toContain("bukan order");
  });

  it("uses only selected Sell values and never labels a missing budget as zero", () => {
    const data = buildAdaptivePlanShareData({
      instrument: "XAU/USD", timeframe: "1h", analysisCreatedAt: "2026-09-09T08:00:00.000Z",
      accountTier: "micro", riskStyle: "conservative",
      plan: { ...buy, side: "sell", ladder: [{ level: 0, price: 4270, lot: 0.1 }], takeProfit1: 4250, takeProfit2: null },
      budget: null, actionable: true, lang: "en", copy: en.analysis_detail,
    });
    expect(data.side).toBe("sell");
    expect(data.actionable).toBe(true);
    expect(data.positions).toHaveLength(1);
    expect(data.positions[0].value).toContain("4,270");
    expect(data.metrics.some((metric) => metric.label === en.analysis_detail.adaptive_usable_risk_budget)).toBe(false);
    expect(data.metrics.some((metric) => metric.label === en.analysis_detail.trade_plan_tp2)).toBe(false);
    expect(data.metrics.find((metric) => metric.label === en.analysis_detail.trade_plan_tp1)?.value).toBe("4,250");
    expect(data.status).toBe(en.analysis_detail.adaptive_valid);
  });

  it("paints the summary and warning into a PNG, without chart or education content", () => {
    const fillText = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      measureText: (value: string) => ({ width: value.length * 9 }),
      fillText, fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,aW1hZ2U=");
    const data = buildAdaptivePlanShareData({
      instrument: "XAU/USD", timeframe: "1h", analysisCreatedAt: "2026-09-09T08:00:00.000Z",
      accountTier: "mini", riskStyle: "balanced", plan: buy, budget,
      actionable: false, lang: "id", copy: id.analysis_detail,
    });
    const result = renderAdaptivePlanSharePng(data, "id");
    const painted = fillText.mock.calls.map(([value]) => String(value)).join(" ");
    expect(painted).toContain(data.status);
    expect(painted).toContain("4.300");
    expect(painted).toContain("$90");
    expect(painted).toContain("bukan order");
    expect(painted).toContain(id.analysis_detail.chart_share_made);
    expect(painted).not.toContain(id.analysis_detail.adaptive_education_title);
    expect(result.blob.type).toBe("image/png");
  });
});