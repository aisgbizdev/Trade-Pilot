import type { TradePlan } from "@workspace/api-client-react";
import { LineStyle } from "lightweight-charts";
import { buildDisplayedLevels, type LevelDisplayMode } from "@/components/analysis-levels-chart";

type Candle = { date: string; open: number; high: number; low: number; close: number };

const FRAME_MS: Record<string, number> = {
  "1m": 60_000, "5m": 300_000, "15m": 900_000, "30m": 1_800_000,
  "1h": 3_600_000, "4h": 14_400_000, "1D": 86_400_000, "1W": 604_800_000,
};

export function selectAnalysisCandles(raw: unknown[], timeframe: string, analyzedAt: string | Date): Candle[] {
  const duration = FRAME_MS[timeframe];
  const cutoff = new Date(analyzedAt).getTime();
  if (!duration || !Number.isFinite(cutoff)) throw new Error("Invalid chart timeframe or analysis time");
  const byTime = new Map<number, Candle>();
  for (const value of raw) {
    if (!value || typeof value !== "object") continue;
    const c = value as Partial<Candle>;
    const timestamp = typeof c.date === "string" ? new Date(c.date).getTime() : NaN;
    if (!Number.isFinite(timestamp) || timestamp + duration > cutoff) continue;
    if ([c.open, c.high, c.low, c.close].some((n) => typeof n !== "number" || !Number.isFinite(n))) continue;
    byTime.set(timestamp, c as Candle);
  }
  const result = [...byTime.entries()].sort((a, b) => a[0] - b[0]).slice(-56).map(([, c]) => c);
  if (result.length < 8) throw new Error("Historical candles at analysis time are unavailable");
  return result;
}

export interface ChartShareCopy {
  title: string;
  analyzed: string;
  made: string;
  bias: string;
  suggested: string;
  buy: string;
  sell: string;
  both: string;
  entry: string;
  stop: string;
  tp1: string;
  tp2: string;
  sourceNote: string;
  warning: string;
  accessibleRange: string;
  accessibleLevels: string;
  accessibleNoLevels: string;
}

export interface ChartShareInput {
  instrument: string;
  timeframe: string;
  analyzedAt: string | Date;
  bias: string;
  plan: TradePlan | null;
  copy: ChartShareCopy;
  locale: string;
}

function describeChart(input: ChartShareInput, candles: Candle[], mode: LevelDisplayMode): string {
  const date = (value: string) => new Date(value).toLocaleString(input.locale, {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "UTC", timeZoneName: "short",
  });
  const levels = buildDisplayedLevels(input.plan, mode).map((level) => {
    const [side, kind] = level.key.split("-");
    const sideLabel = side === "buy" ? input.copy.buy : input.copy.sell;
    const levelLabel = kind === "entry" ? input.copy.entry
      : kind === "sl" ? input.copy.stop
        : kind === "tp1" ? input.copy.tp1 : input.copy.tp2;
    return `${sideLabel} ${levelLabel}: ${level.price.toLocaleString(input.locale, { maximumFractionDigits: 5 })}`;
  });
  return [
    `${input.copy.title} · ${input.instrument} · ${input.timeframe}.`,
    input.copy.accessibleRange
      .replace("{start}", date(candles[0].date))
      .replace("{end}", date(candles[candles.length - 1].date))
      .replace("{count}", candles.length.toLocaleString(input.locale)),
    levels.length
      ? input.copy.accessibleLevels.replace("{levels}", levels.join("; "))
      : input.copy.accessibleNoLevels,
    input.copy.sourceNote,
  ].join(" ");
}

function lines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const output: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) output.push(current);
      current = word;
    }
  }
  if (current) output.push(current);
  return output;
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, color = "#d1d5db") {
  ctx.fillStyle = color;
  ctx.font = "20px system-ui, sans-serif";
  for (const line of lines(ctx, text, width)) {
    ctx.fillText(line, x, y);
    y += 29;
  }
  return y;
}

const WIDTH = 1120;
const PAD = 48;
const CHART_Y = 172;
const CHART_H = 460;
const PLOT_RIGHT = WIDTH - PAD - 104;

function drawCandles(
  ctx: CanvasRenderingContext2D,
  candles: Candle[],
  plan: TradePlan | null,
  mode: LevelDisplayMode,
  locale: string,
) {
  const left = PAD + 12;
  const top = CHART_Y + 24;
  const bottom = CHART_Y + CHART_H - 40;
  const chartLevels = buildDisplayedLevels(plan, mode);
  const values = candles.flatMap((c) => [c.high, c.low]).concat(chartLevels.map((level) => level.price));
  let min = Math.min(...values);
  let max = Math.max(...values);
  const pad = Math.max((max - min) * 0.08, Math.abs(max) * 0.0002, 0.00001);
  min -= pad;
  max += pad;
  const yFor = (value: number) => bottom - ((value - min) / (max - min)) * (bottom - top);
  const priceText = (value: number) => value.toLocaleString(locale, { maximumFractionDigits: 5 });

  ctx.fillStyle = "#171c24";
  ctx.fillRect(PAD, CHART_Y, WIDTH - PAD * 2, CHART_H);
  ctx.strokeStyle = "#323b47";
  ctx.lineWidth = 1;
  ctx.font = "15px system-ui, sans-serif";
  for (let i = 0; i <= 4; i++) {
    const y = top + (bottom - top) * i / 4;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(PLOT_RIGHT, y);
    ctx.stroke();
    ctx.fillStyle = "#aab1bc";
    ctx.fillText(priceText(max - (max - min) * i / 4), PLOT_RIGHT + 9, y + 5, 88);
  }

  for (const level of chartLevels) {
    ctx.strokeStyle = level.color;
    ctx.lineWidth = 2;
    ctx.setLineDash(level.lineStyle === LineStyle.Dashed ? [8, 5] : []);
    ctx.beginPath();
    ctx.moveTo(left, yFor(level.price));
    ctx.lineTo(PLOT_RIGHT, yFor(level.price));
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const barStep = (PLOT_RIGHT - left) / candles.length;
  const bodyWidth = Math.max(3, Math.min(10, barStep * 0.58));
  candles.forEach((c, index) => {
    const x = left + barStep * (index + 0.5);
    const rising = c.close >= c.open;
    ctx.fillStyle = rising ? "#25c991" : "#f56868";
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, yFor(c.high));
    ctx.lineTo(x, yFor(c.low));
    ctx.stroke();
    const bodyTop = Math.min(yFor(c.open), yFor(c.close));
    ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, Math.max(2, Math.abs(yFor(c.open) - yFor(c.close))));
  });

  ctx.font = "16px system-ui, sans-serif";
  ctx.fillStyle = "#aab1bc";
  for (const i of [0, Math.floor((candles.length - 1) / 2), candles.length - 1]) {
    const date = new Date(candles[i].date).toLocaleString(locale, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    ctx.fillText(date, left + barStep * i, CHART_Y + CHART_H - 12, 165);
  }
}

function drawPlan(ctx: CanvasRenderingContext2D, input: ChartShareInput, mode: LevelDisplayMode, y: number): number {
  if (!input.plan) return y;
  const sides = mode === "both" ? ["buy", "sell"] as const : [mode];
  const width = sides.length === 2 ? (WIDTH - PAD * 2 - 18) / 2 : WIDTH - PAD * 2;
  const heights = sides.map((side) => {
    const data = input.plan![side];
    ctx.font = "20px system-ui, sans-serif";
    return 64 + [
      `${input.copy.entry}: ${data.entryZone || "—"}`,
      `${input.copy.stop}: ${data.stopLoss || "—"}`,
      `${input.copy.tp1}: ${data.takeProfit1 || "—"}`,
      `${input.copy.tp2}: ${data.takeProfit2 || "—"}`,
    ].reduce((sum, text) => sum + Math.max(1, lines(ctx, text, width - 44).length) * 29 + 5, 0);
  });
  const height = Math.max(...heights);
  sides.forEach((side, i) => {
    const x = PAD + i * (width + 18);
    const data = input.plan![side];
    ctx.fillStyle = "#1d242d";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = side === "buy" ? "#30ceab" : "#f5b441";
    ctx.fillRect(x, y, 4, height);
    ctx.font = "700 22px system-ui, sans-serif";
    ctx.fillText(side === "buy" ? input.copy.buy : input.copy.sell, x + 22, y + 36);
    let row = y + 68;
    for (const text of [
      `${input.copy.entry}: ${data.entryZone || "—"}`,
      `${input.copy.stop}: ${data.stopLoss || "—"}`,
      `${input.copy.tp1}: ${data.takeProfit1 || "—"}`,
      `${input.copy.tp2}: ${data.takeProfit2 || "—"}`,
    ]) {
      row = label(ctx, text, x + 22, row, width - 44) + 5;
    }
  });
  return y + height + 22;
}

export async function renderChartSharePng(input: ChartShareInput): Promise<{ blob: Blob; url: string; description: string }> {
  if (!FRAME_MS[input.timeframe]) throw new Error("Unsupported timeframe for chart export");
  const res = await fetch(
    `/api/historical/candles?instrument=${encodeURIComponent(input.instrument)}&timeframe=${encodeURIComponent(input.timeframe)}`,
    { credentials: "include", cache: "no-store" },
  );
  if (!res.ok) throw new Error("Historical candles unavailable");
  const data: { candles?: unknown[] } = await res.json();
  const candles = selectAnalysisCandles(Array.isArray(data.candles) ? data.candles : [], input.timeframe, input.analyzedAt);
  const mode: LevelDisplayMode = input.plan?.preferredSide === "wait"
    ? "both" : input.plan?.preferredSide === "sell" ? "sell" : "buy";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  canvas.width = WIDTH;
  canvas.height = 1350; // Measure the variable-length plan and warning before finalizing.
  ctx.font = "20px system-ui, sans-serif";
  const planHeight = input.plan ? Math.max(...(mode === "both" ? ["buy", "sell"] as const : [mode]).map((side) => {
    const data = input.plan![side];
    const width = mode === "both" ? (WIDTH - PAD * 2 - 18) / 2 : WIDTH - PAD * 2;
    return 64 + [
      `${input.copy.entry}: ${data.entryZone || "—"}`,
      `${input.copy.stop}: ${data.stopLoss || "—"}`,
      `${input.copy.tp1}: ${data.takeProfit1 || "—"}`,
      `${input.copy.tp2}: ${data.takeProfit2 || "—"}`,
    ].reduce((sum, text) => sum + Math.max(1, lines(ctx, text, width - 44).length) * 29 + 5, 0);
  })) + 22 : 0;
  const sourceLines = lines(ctx, input.copy.sourceNote, WIDTH - PAD * 2);
  const warningLines = lines(ctx, input.copy.warning, WIDTH - PAD * 2);
  canvas.height = CHART_Y + CHART_H + 30 + planHeight + 28 + sourceLines.length * 29 + 76 + warningLines.length * 29 + 48;

  ctx.fillStyle = "#101216";
  ctx.fillRect(0, 0, WIDTH, canvas.height);
  ctx.fillStyle = "#e8ad2b";
  ctx.fillRect(0, 0, WIDTH, 7);
  ctx.font = "700 21px system-ui, sans-serif";
  ctx.fillText("TRADEPILOT.ID", PAD, 56);
  ctx.fillStyle = "#f7f7f9";
  ctx.font = "700 32px system-ui, sans-serif";
  ctx.fillText(`${input.copy.title} · ${input.instrument} · ${input.timeframe}`, PAD, 100, WIDTH - PAD * 2);
  const date = new Date(input.analyzedAt).toLocaleString(input.locale, { dateStyle: "medium", timeStyle: "short" });
  ctx.font = "19px system-ui, sans-serif";
  ctx.fillStyle = "#aeb1ba";
  ctx.fillText(`${input.copy.analyzed}: ${date}`, PAD, 132, WIDTH - PAD * 2);
  ctx.font = "700 20px system-ui, sans-serif";
  ctx.fillStyle = input.plan?.preferredSide === "wait" ? "#f5b441" : "#f7f7f9";
  const preferred = input.plan?.preferredSide === "wait" ? input.copy.suggested + ": " + input.copy.both
    : input.plan ? input.copy.suggested + ": " + (mode === "sell" ? input.copy.sell : input.copy.buy) : "";
  ctx.fillText(`${input.copy.bias}: ${input.bias}${preferred ? `  ·  ${preferred}` : ""}`, PAD, 160, WIDTH - PAD * 2);

  drawCandles(ctx, candles, input.plan, mode, input.locale);
  const afterPlan = drawPlan(ctx, input, mode, CHART_Y + CHART_H + 30);
  let y = afterPlan + 28;
  y = label(ctx, input.copy.sourceNote, PAD, y, WIDTH - PAD * 2);
  ctx.fillStyle = "#aeb1ba";
  ctx.font = "17px system-ui, sans-serif";
  ctx.fillText(`${input.copy.made}: ${new Date().toLocaleString(input.locale, { dateStyle: "medium", timeStyle: "short" })}`, PAD, y + 8, WIDTH - PAD * 2);
  ctx.fillStyle = "#333a43";
  ctx.fillRect(PAD, y + 24, WIDTH - PAD * 2, 1);
  label(ctx, input.copy.warning, PAD, y + 63, WIDTH - PAD * 2, "#f5b441");

  const url = canvas.toDataURL("image/png");
  if (!url.startsWith("data:image/png;base64,")) throw new Error("PNG export failed");
  const binary = atob(url.slice("data:image/png;base64,".length));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return { blob: new Blob([bytes], { type: "image/png" }), url, description: describeChart(input, candles, mode) };
}