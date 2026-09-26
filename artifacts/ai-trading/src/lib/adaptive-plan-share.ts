import type { Translations } from "@/locales/en";
import type { AccountTier, AdaptiveRiskStyle, AdaptiveSidePositionPlan } from "@/lib/adaptive-position-plan";

type Copy = Translations["analysis_detail"];
type Language = "id" | "en";

export interface AdaptivePlanShareData {
  title: string;
  instrument: string;
  timeframe: string;
  analyzedAt: string;
  generatedLabel: string;
  side: "buy" | "sell";
  sideLabel: string;
  status: string;
  actionable: boolean;
  statusDetail: string;
  account: string;
  style: string;
  positionsTitle: string;
  positions: { label: string; value: string }[];
  metrics: { label: string; value: string; detail?: string }[];
  notes: string[];
}

function number(value: number | null | undefined, lang: Language, digits = 2): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", {
    maximumFractionDigits: digits,
  }).format(value);
}

function money(value: number | null | undefined, lang: Language): string {
  const formatted = number(value, lang);
  return formatted === "—" ? formatted : `$${formatted}`;
}

function profit(value: number | null | undefined, lang: Language): string {
  const formatted = money(value, lang);
  return formatted === "—" ? formatted : `+${formatted}`;
}

export function buildAdaptivePlanShareData({
  instrument, timeframe, analysisCreatedAt, accountTier, riskStyle, plan, budget,
  actionable, lang, copy,
}: {
  instrument: string;
  timeframe: string;
  analysisCreatedAt: string;
  accountTier: AccountTier;
  riskStyle: AdaptiveRiskStyle;
  plan: AdaptiveSidePositionPlan;
  budget: {
    usableRiskBudget: number;
    unusedRiskBuffer: number;
    riskUtilizationRate: number;
  } | null;
  actionable: boolean;
  lang: Language;
  copy: Copy;
}): AdaptivePlanShareData {
  if (!plan.ladder.length || !Number.isFinite(Date.parse(analysisCreatedAt))) {
    throw new Error("Adaptive plan or original analysis time unavailable");
  }
  const style = riskStyle === "conservative" ? copy.adaptive_risk_style_conservative
    : riskStyle === "balanced" ? copy.adaptive_risk_style_balanced : copy.adaptive_risk_style_aggressive;
  const account = accountTier === "micro" ? copy.adaptive_account_micro
    : accountTier === "mini" ? copy.adaptive_account_mini : copy.adaptive_account_regular;
  const metrics: AdaptivePlanShareData["metrics"] = [
    { label: copy.adaptive_snapshot_total_lots, value: `${number(plan.totalLots, lang)} ${copy.adaptive_lot}` },
    { label: copy.adaptive_final_stop, value: number(plan.stopLoss, lang, 4) },
    { label: copy.adaptive_cycle_loss, value: money(plan.estimatedCycleLoss, lang) },
  ];
  if (budget) {
    metrics.push(
      { label: copy.adaptive_usable_risk_budget, value: money(budget.usableRiskBudget, lang),
        detail: copy.adaptive_risk_budget_rate.replace("{rate}", number(budget.riskUtilizationRate * 100, lang, 0)) },
      { label: copy.adaptive_unused_risk_buffer, value: money(budget.unusedRiskBuffer, lang) },
    );
  }
  metrics.push({ label: copy.adaptive_margin_required, value: money(plan.marginRequired, lang) });
  if (plan.takeProfit1 != null) {
    metrics.push({
      label: copy.trade_plan_tp1, value: number(plan.takeProfit1, lang, 4),
      detail: `${copy.adaptive_tp_profit}: ${profit(plan.profitToTakeProfit1, lang)}`,
    });
  }
  if (plan.takeProfit2 != null) {
    metrics.push({
      label: copy.trade_plan_tp2, value: number(plan.takeProfit2, lang, 4),
      detail: `${copy.adaptive_tp_profit}: ${profit(plan.profitToTakeProfit2, lang)}`,
    });
  }
  return {
    title: copy.adaptive_share_summary_title,
    instrument, timeframe,
    analyzedAt: `${copy.chart_share_analyzed}: ${new Date(analysisCreatedAt).toLocaleString(lang === "id" ? "id-ID" : "en-US", { dateStyle: "medium", timeStyle: "short" })}`,
    generatedLabel: copy.chart_share_made,
    side: plan.side,
    sideLabel: plan.side === "buy" ? copy.adaptive_buy : copy.adaptive_sell,
    status: actionable ? copy.adaptive_valid : copy.adaptive_conditional_status,
    actionable,
    statusDetail: actionable ? copy.adaptive_snapshot_ready : copy.adaptive_snapshot_wait,
    account, style: copy.adaptive_risk_style_active.replace("{style}", style),
    positionsTitle: copy.adaptive_position_prices_title,
    positions: plan.ladder.map((level) => ({
      label: `${copy.adaptive_position} ${level.level + 1} · ${level.level === 0 ? copy.adaptive_initial : copy.adaptive_additional_short}`,
      value: `${number(level.price, lang, 4)} · ${number(level.lot, lang)} ${copy.adaptive_lot}`,
    })),
    metrics,
    notes: [copy.adaptive_share_summary_warning],
  };
}

const WIDTH = 1080;
const PAD = 52;
const CONTENT = WIDTH - PAD * 2;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const result: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
      continue;
    }
    if (line) result.push(line);
    line = "";
    for (const character of word) {
      if (line && ctx.measureText(line + character).width > maxWidth) {
        result.push(line);
        line = "";
      }
      line += character;
    }
  }
  if (line) result.push(line);
  return result;
}

function drawAdaptiveSummary(ctx: CanvasRenderingContext2D, data: AdaptivePlanShareData, draw: boolean): number {
  const text = (value: string, x: number, y: number, color: string, font: string, width: number) => {
    ctx.font = font;
    const lines = wrap(ctx, value, width);
    if (draw) {
      ctx.fillStyle = color;
      lines.forEach((line, i) => ctx.fillText(line, x, y + i * 29));
    }
    return y + Math.max(1, lines.length) * 29;
  };
  let y = 64;
  y = text("TRADEPILOT.ID", PAD, y, "#e8ad2b", "700 21px system-ui, sans-serif", CONTENT) + 9;
  y = text(data.title, PAD, y, "#f7f7f9", "700 32px system-ui, sans-serif", CONTENT) + 10;
  y = text(`${data.instrument} · ${data.timeframe} · ${data.sideLabel}`, PAD, y, "#d8dbe0", "700 23px system-ui, sans-serif", CONTENT) + 7;
  y = text(data.analyzedAt, PAD, y, "#aeb1ba", "19px system-ui, sans-serif", CONTENT) + 26;

  const statusTop = y - 22;
  const statusColor = data.actionable ? "#65d9b6" : "#f5b441";
  ctx.font = "700 25px system-ui, sans-serif";
  const statusRows = Math.max(1, wrap(ctx, data.status, CONTENT - 44).length);
  ctx.font = "19px system-ui, sans-serif";
  const detailRows = Math.max(1, wrap(ctx, data.statusDetail, CONTENT - 44).length);
  if (draw) {
    const statusHeight = 22 + statusRows * 29 + 9 + detailRows * 29;
    ctx.fillStyle = "#272318";
    ctx.fillRect(PAD, statusTop, CONTENT, statusHeight);
    ctx.fillStyle = statusColor;
    ctx.fillRect(PAD, statusTop, 5, statusHeight);
  }
  y = text(data.status, PAD + 22, y, statusColor, "700 25px system-ui, sans-serif", CONTENT - 44) + 9;
  y = text(data.statusDetail, PAD + 22, y, "#e5e7eb", "19px system-ui, sans-serif", CONTENT - 44);
  y += 24;
  y = text(`${data.account}  ·  ${data.style}`, PAD, y, "#d6d8de", "20px system-ui, sans-serif", CONTENT) + 32;

  y = text(data.positionsTitle, PAD, y, "#f7f7f9", "700 23px system-ui, sans-serif", CONTENT) + 8;
  for (const position of data.positions) {
    y = text(position.label, PAD + 18, y, "#d6d8de", "20px system-ui, sans-serif", CONTENT * 0.49);
    if (draw) text(position.value, PAD + CONTENT * 0.52, y - 29, "#ffffff", "700 20px system-ui, sans-serif", CONTENT * 0.45);
    y += 14;
    if (draw) {
      ctx.fillStyle = "#303740";
      ctx.fillRect(PAD, y - 6, CONTENT, 1);
    }
  }
  y += 22;
  const metricWidth = (CONTENT - 22) / 2;
  for (let i = 0; i < data.metrics.length; i += 2) {
    const rowTop = y;
    const heights = data.metrics.slice(i, i + 2).map((metric, offset) => {
      const x = PAD + offset * (metricWidth + 22);
      let row = text(metric.label, x, rowTop, "#aeb1ba", "18px system-ui, sans-serif", metricWidth) + 7;
      row = text(metric.value, x, row, "#f7f7f9", "700 26px system-ui, sans-serif", metricWidth) + 3;
      if (metric.detail) row = text(metric.detail, x, row, "#65d9b6", "18px system-ui, sans-serif", metricWidth);
      return row;
    });
    y = Math.max(...heights) + 44;
    if (draw) {
      ctx.fillStyle = "#303740";
      ctx.fillRect(PAD, y - 24, CONTENT, 1);
    }
  }
  y += 15;
  data.notes.forEach((note, index) => {
    y = text(note, PAD, y, index === 0 ? "#f5b441" : "#c5c9d0", "19px system-ui, sans-serif", CONTENT) + 18;
  });
  y += 10;
  text(data.generatedLabel, PAD, y, "#aeb1ba", "17px system-ui, sans-serif", CONTENT);
  return y + 72;
}

export function renderAdaptivePlanSharePng(
  data: AdaptivePlanShareData,
  lang: Language,
): { blob: Blob; url: string } {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  canvas.width = WIDTH;
  canvas.height = Math.ceil(drawAdaptiveSummary(ctx, data, false));
  if (canvas.height > 12000) throw new Error("Adaptive plan too long to export");
  ctx.fillStyle = "#101216";
  ctx.fillRect(0, 0, WIDTH, canvas.height);
  ctx.fillStyle = "#e8ad2b";
  ctx.fillRect(0, 0, WIDTH, 7);
  drawAdaptiveSummary(ctx, {
    ...data,
    generatedLabel: `${data.generatedLabel}: ${new Date().toLocaleString(lang === "id" ? "id-ID" : "en-US", { dateStyle: "medium", timeStyle: "short" })}`,
  }, true);
  const url = canvas.toDataURL("image/png");
  if (!url.startsWith("data:image/png;base64,")) throw new Error("PNG export failed");
  const binary = atob(url.slice("data:image/png;base64,".length));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return { blob: new Blob([bytes], { type: "image/png" }), url };
}