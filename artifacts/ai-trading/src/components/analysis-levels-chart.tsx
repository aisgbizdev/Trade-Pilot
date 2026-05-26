import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type IPriceLine,
  type UTCTimestamp,
} from "lightweight-charts";
import { useTheme } from "@/components/theme-provider";
import type { TradePlan, TradePlanPreferredSide } from "@workspace/api-client-react";

interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface AnalysisLevelsChartProps {
  instrument: string;
  timeframe: string;
  tradePlan: TradePlan | null;
  height?: number | string;
  onLoadFailed?: (reason: string) => void;
}

// Parse a possibly-zone price string like "1.0850" or "1.0850-1.0857" or
// descriptive copy from the AI ("menunggu konfirmasi..."). Returns a single
// number — the zone midpoint when given a range — or null if no numeric
// content is present.
function parsePriceLevel(raw: string | null | undefined): number | null {
  if (!raw) return null;
  // Prices are always positive; intentionally NOT matching a leading `-`
  // so that zone strings like "2350-2356" parse as [2350, 2356] instead
  // of [2350, -2356] (which would yield a midpoint of -3).
  const matches = raw.match(/\d+(?:[.,]\d+)?/g);
  if (!matches || matches.length === 0) return null;
  const nums = matches
    .map((m) => Number(m.replace(/,/g, ".")))
    .filter((n) => Number.isFinite(n));
  if (nums.length === 0) return null;
  if (nums.length === 1) return nums[0];
  // Treat first two as zone bounds; take the midpoint so the line sits in
  // the middle of the entry/SL zone.
  return (nums[0] + nums[1]) / 2;
}

interface LevelDef {
  key: string;
  price: number;
  label: string;
  color: string;
  testId: string;
}

function buildLevels(
  plan: TradePlan,
  side: TradePlanPreferredSide,
): LevelDef[] {
  // Color palette tuned to the rest of the app: SL red, TP green, entry
  // neutral/amber so it reads as "decision point" rather than directional.
  const COLORS = {
    entry: "#f59e0b", // amber-500
    sl: "#ef4444",    // red-500
    tp: "#10b981",    // emerald-500
  };
  const targetSide = side === "sell" ? plan.sell : plan.buy;
  const sidePrefix = side === "sell" ? "SELL" : "BUY";
  const levels: LevelDef[] = [];
  const entry = parsePriceLevel(targetSide.entryZone);
  if (entry != null) {
    levels.push({
      key: `${side}-entry`,
      price: entry,
      label: `${sidePrefix} Entry`,
      color: COLORS.entry,
      testId: `chart-level-entry-${side}`,
    });
  }
  const sl = parsePriceLevel(targetSide.stopLoss);
  if (sl != null) {
    levels.push({
      key: `${side}-sl`,
      price: sl,
      label: "SL",
      color: COLORS.sl,
      testId: `chart-level-sl-${side}`,
    });
  }
  const tp1 = parsePriceLevel(targetSide.takeProfit1);
  if (tp1 != null) {
    levels.push({
      key: `${side}-tp1`,
      price: tp1,
      label: "TP1",
      color: COLORS.tp,
      testId: `chart-level-tp1-${side}`,
    });
  }
  const tp2 = parsePriceLevel(targetSide.takeProfit2);
  if (tp2 != null) {
    levels.push({
      key: `${side}-tp2`,
      price: tp2,
      label: "TP2",
      color: COLORS.tp,
      testId: `chart-level-tp2-${side}`,
    });
  }
  return levels;
}

function toCssSize(value: number | string): string {
  if (typeof value === "number") return value > 0 ? `${value}px` : "100%";
  return value || "100%";
}

function dedupeByTime(candles: Candle[]): CandlestickData<UTCTimestamp>[] {
  // lightweight-charts requires strictly increasing, unique timestamps.
  // Backend candles are already sorted, but two intraday bars occasionally
  // share a second (rounding); keep the last one in that case.
  const map = new Map<number, CandlestickData<UTCTimestamp>>();
  for (const c of candles) {
    const t = Math.floor(new Date(c.date).getTime() / 1000) as UTCTimestamp;
    map.set(t, { time: t, open: c.open, high: c.high, low: c.low, close: c.close });
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

export function AnalysisLevelsChart({
  instrument,
  timeframe,
  tradePlan,
  height = 280,
  onLoadFailed,
}: AnalysisLevelsChartProps) {
  const { theme } = useTheme();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [candles, setCandles] = useState<Candle[] | null>(null);

  // Fetch candles when instrument / timeframe changes.
  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setErrorMsg(null);
    const url =
      `/api/historical/candles?instrument=${encodeURIComponent(instrument)}` +
      `&timeframe=${encodeURIComponent(timeframe)}`;
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ?? `HTTP ${res.status}`,
          );
        }
        return res.json();
      })
      .then((data: { candles?: Candle[] }) => {
        if (cancelled) return;
        const list = Array.isArray(data.candles) ? data.candles : [];
        if (list.length === 0) throw new Error("empty");
        setCandles(list);
        setState("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const reason = err instanceof Error ? err.message : String(err);
        setErrorMsg(reason);
        setState("error");
        onLoadFailed?.(reason);
      });
    return () => {
      cancelled = true;
    };
  }, [instrument, timeframe, onLoadFailed]);

  // Build/refresh chart when candles or theme change.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || state !== "ready" || !candles) return;

    const isDark = theme === "dark"
      || (theme === "system"
        && typeof window !== "undefined"
        && window.matchMedia?.("(prefers-color-scheme: dark)").matches);

    const chart = createChart(host, {
      autoSize: true,
      layout: {
        background: { color: "transparent" },
        textColor: isDark ? "#cbd5e1" : "#475569",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: isDark ? "rgba(148,163,184,0.08)" : "rgba(100,116,139,0.08)" },
        horzLines: { color: isDark ? "rgba(148,163,184,0.08)" : "rgba(100,116,139,0.08)" },
      },
      rightPriceScale: { borderColor: isDark ? "#334155" : "#e2e8f0" },
      timeScale: {
        borderColor: isDark ? "#334155" : "#e2e8f0",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: { mode: 0 },
    });
    chartRef.current = chart;
    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });
    seriesRef.current = series;
    series.setData(dedupeByTime(candles));
    chart.timeScale().fitContent();

    return () => {
      priceLinesRef.current = [];
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [candles, state, theme]);

  // Draw / refresh price lines for the trade plan whenever plan changes.
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    // Clear previous lines (e.g. side flip during a hot edit).
    for (const pl of priceLinesRef.current) {
      try { series.removePriceLine(pl); } catch { /* line already gone */ }
    }
    priceLinesRef.current = [];
    if (!tradePlan) return;
    // When AI says "wait", show levels for BOTH sides faintly so the user
    // can see the structure either way. Otherwise lean into the chosen side.
    const sides: TradePlanPreferredSide[] =
      tradePlan.preferredSide === "wait"
        ? ["buy", "sell"]
        : [tradePlan.preferredSide];
    for (const side of sides) {
      const levels = buildLevels(tradePlan, side);
      for (const lvl of levels) {
        const line = series.createPriceLine({
          price: lvl.price,
          color: lvl.color,
          lineWidth: 2,
          lineStyle: lvl.key.includes("entry") ? LineStyle.Dashed : LineStyle.Solid,
          axisLabelVisible: true,
          title: lvl.label,
        });
        priceLinesRef.current.push(line);
      }
    }
  }, [tradePlan, candles, state]);

  return (
    <div
      className="relative w-full"
      style={{ height: toCssSize(height) }}
      data-testid="analysis-levels-chart"
      data-state={state}
      data-instrument={instrument}
      data-timeframe={timeframe}
    >
      <div
        ref={hostRef}
        className="absolute inset-0"
        style={{ visibility: state === "ready" ? "visible" : "hidden" }}
      />
      {state === "loading" && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground"
          data-testid="analysis-levels-chart-loading"
        >
          <span>Loading chart…</span>
        </div>
      )}
      {state === "error" && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground px-3 text-center"
          data-testid="analysis-levels-chart-error"
          data-error={errorMsg ?? ""}
        >
          <span>Chart data unavailable.</span>
        </div>
      )}
    </div>
  );
}
