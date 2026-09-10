import { useEffect, useMemo, useRef, useState } from "react";
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
import { createLevelAwareAutoscaleInfoProvider } from "@/lib/chart-autoscale";
import type { TradePlan, TradePlanPreferredSide } from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";

interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

function normalizeCandle(raw: unknown): Candle | null {
  if (!raw || typeof raw !== "object") return null;
  const candle = raw as Partial<Candle>;
  const dateMs = typeof candle.date === "string" ? new Date(candle.date).getTime() : NaN;
  const values = [candle.open, candle.high, candle.low, candle.close];
  if (!Number.isFinite(dateMs) || values.some((value) => typeof value !== "number" || !Number.isFinite(value))) {
    return null;
  }
  return {
    date: candle.date as string,
    open: candle.open as number,
    high: candle.high as number,
    low: candle.low as number,
    close: candle.close as number,
  };
}

interface AnalysisLevelsChartProps {
  instrument: string;
  timeframe: string;
  tradePlan: TradePlan | null;
  // Wall-clock time the AI ran this analysis. Used to draw the
  // "AI saw up to here" vertical marker and to mute bars that
  // printed AFTER the call (i.e. bars the AI never saw).
  analysisCreatedAt?: string | Date | null;
  height?: number | string;
  onLoadFailed?: (reason: string) => void;
  livePrice?: number | null;
  liveUpdatedAt?: string | null;
}

// Parse a possibly-zone price string like "1.0850" or "1.0850-1.0857" or
// descriptive copy from the AI ("menunggu konfirmasi..."). Returns a single
// number — the zone midpoint when given a range — or null if no numeric
// content is present. Timeframe tokens are removed first so their digits
// cannot be mistaken for the second bound of a price range.
function parsePriceLevel(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw
    // Keep parsing consistent with the backend: commas are thousands
    // separators and periods are decimal points.
    .replace(/,/g, "")
    // Handle both H1/M15/4H and 1m/30m/1D/1W forms.
    .replace(/\b[HMDWhmdw]\d{1,3}\b/g, " ")
    .replace(/\b\d{1,3}[mhdwMHDW]\b/g, " ");
  // Prices are always positive; intentionally NOT matching a leading `-`
  // so that zone strings like "2350-2356" parse as [2350, 2356] instead
  // of [2350, -2356] (which would yield a midpoint of -3).
  const matches = cleaned.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return null;
  const nums = matches.map(Number).filter((n) => Number.isFinite(n));
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
  lineStyle: LineStyle;
}

type LevelDisplayMode = "buy" | "sell" | "both";

function buildLevels(
  plan: TradePlan,
  side: TradePlanPreferredSide,
  combined: boolean,
): LevelDef[] {
  // Color palette tuned to the rest of the app: SL red, TP green, entry
  // neutral/amber so it reads as "decision point" rather than directional.
  const COLORS = {
    entry: side === "buy" ? "#06b6d4" : "#f59e0b",
    sl: "#ef4444",    // red-500
    tp: "#10b981",    // emerald-500
  };
  const targetSide = side === "sell" ? plan.sell : plan.buy;
  const sidePrefix = side === "sell" ? "SELL" : "BUY";
  const shortPrefix = side === "sell" ? "S" : "B";
  const lineStyle = side === "sell" ? LineStyle.Dashed : LineStyle.Solid;
  const levels: LevelDef[] = [];
  const entry = parsePriceLevel(targetSide.entryZone);
  if (entry != null) {
    levels.push({
      key: `${side}-entry`,
      price: entry,
      label: `${sidePrefix} Entry`,
      color: COLORS.entry,
      testId: `chart-level-entry-${side}`,
      lineStyle,
    });
  }
  const sl = parsePriceLevel(targetSide.stopLoss);
  if (sl != null) {
    levels.push({
      key: `${side}-sl`,
      price: sl,
      label: combined ? `${shortPrefix}-SL` : "SL",
      color: COLORS.sl,
      testId: `chart-level-sl-${side}`,
      lineStyle,
    });
  }
  const tp1 = parsePriceLevel(targetSide.takeProfit1);
  if (tp1 != null) {
    levels.push({
      key: `${side}-tp1`,
      price: tp1,
      label: combined ? `${shortPrefix}-TP1` : "TP1",
      color: COLORS.tp,
      testId: `chart-level-tp1-${side}`,
      lineStyle,
    });
  }
  const tp2 = parsePriceLevel(targetSide.takeProfit2);
  if (tp2 != null) {
    levels.push({
      key: `${side}-tp2`,
      price: tp2,
      label: combined ? `${shortPrefix}-TP2` : "TP2",
      color: COLORS.tp,
      testId: `chart-level-tp2-${side}`,
      lineStyle,
    });
  }
  return levels;
}

function buildDisplayedLevels(plan: TradePlan | null, mode: LevelDisplayMode): LevelDef[] {
  if (!plan) return [];
  const sides: TradePlanPreferredSide[] = mode === "both" ? ["buy", "sell"] : [mode];
  return sides.flatMap((side) => buildLevels(plan, side, mode === "both"));
}

function toCssSize(value: number | string): string {
  if (typeof value === "number") return value > 0 ? `${value}px` : "100%";
  return value || "100%";
}

function buildCandleData(
  candles: Candle[],
  cutoffSec: number | null,
  isDark: boolean,
): CandlestickData<UTCTimestamp>[] {
  // lightweight-charts requires strictly increasing, unique timestamps.
  // Backend candles are already sorted, but two intraday bars occasionally
  // share a second (rounding); keep the last one in that case.
  //
  // Bars whose timestamp is AFTER the analysis cutoff are recolored to a
  // muted/translucent palette — these are bars the AI never saw, so
  // de-emphasizing them keeps the user from mistaking "TP already hit on
  // this later bar" for "the AI's call was wrong from the start".
  const mutedUp   = isDark ? "rgba(16,185,129,0.32)" : "rgba(16,185,129,0.42)";
  const mutedDown = isDark ? "rgba(239,68,68,0.32)"  : "rgba(239,68,68,0.42)";
  const map = new Map<number, CandlestickData<UTCTimestamp>>();
  for (const c of candles) {
    const t = Math.floor(new Date(c.date).getTime() / 1000);
    const item: CandlestickData<UTCTimestamp> = {
      time: t as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    };
    if (cutoffSec != null && t > cutoffSec) {
      const isUp = c.close >= c.open;
      const col = isUp ? mutedUp : mutedDown;
      item.color = col;
      item.borderColor = col;
      item.wickColor = col;
    }
    map.set(t, item);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

export function AnalysisLevelsChart({
  instrument,
  timeframe,
  tradePlan,
  analysisCreatedAt = null,
  height = 280,
  onLoadFailed,
  livePrice = null,
  liveUpdatedAt = null,
}: AnalysisLevelsChartProps) {
  const { theme } = useTheme();
  const { lang } = useTranslation();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const liveCandleRef = useRef<Candle | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [markerX, setMarkerX] = useState<number | null>(null);
  const [barSpacing, setBarSpacing] = useState(8);
  const [levelDisplayMode, setLevelDisplayMode] = useState<LevelDisplayMode>(
    tradePlan?.preferredSide === "sell" ? "sell" : "buy",
  );

  useEffect(() => {
    setLevelDisplayMode(tradePlan?.preferredSide === "sell" ? "sell" : "buy");
  }, [tradePlan?.preferredSide]);

  const cutoffSec = useMemo<number | null>(() => {
    if (!analysisCreatedAt) return null;
    const ms = new Date(analysisCreatedAt).getTime();
    if (!Number.isFinite(ms)) return null;
    return Math.floor(ms / 1000);
  }, [analysisCreatedAt]);

  const displayedLevels = useMemo(
    () => buildDisplayedLevels(tradePlan, levelDisplayMode),
    [tradePlan, levelDisplayMode],
  );
  const latestClose = candles?.at(-1)?.close ?? null;
  const autoscaleInfoProvider = useMemo(
    () => createLevelAwareAutoscaleInfoProvider(
      displayedLevels.map((level) => level.price),
      latestClose,
    ),
    [displayedLevels, latestClose],
  );

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
      .then((data: { candles?: unknown[] }) => {
        if (cancelled) return;
        // Upstream data occasionally includes a partially-populated newest
        // candle. lightweight-charts throws on even one null OHLC field, so
        // exclude malformed bars rather than letting the whole detail view
        // crash before the user can read the Standard Plan.
        const list = (Array.isArray(data.candles) ? data.candles : [])
          .map(normalizeCandle)
          .filter((candle): candle is Candle => candle != null);
        if (list.length === 0) throw new Error("empty");
        liveCandleRef.current = list.at(-1) ?? null;
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

  // Keep the active candle moving with the canonical backend quote without
  // rebuilding the chart (which would reset the user's zoom/pan position).
  // Historical bars still come from /historical/candles; this only advances
  // OHLC for the newest visible bucket between historical refreshes.
  useEffect(() => {
    const series = seriesRef.current;
    const previous = liveCandleRef.current;
    if (
      !series ||
      state !== "ready" ||
      !previous ||
      typeof livePrice !== "number" ||
      !Number.isFinite(livePrice) ||
      livePrice <= 0 ||
      !liveUpdatedAt
    ) {
      return;
    }

    const durationMs: Record<string, number> = {
      "1m": 60_000,
      "5m": 5 * 60_000,
      "15m": 15 * 60_000,
      "30m": 30 * 60_000,
      "1h": 60 * 60_000,
      "4h": 4 * 60 * 60_000,
      "1D": 24 * 60 * 60_000,
      "1W": 7 * 24 * 60 * 60_000,
    };
    const bucketDuration = durationMs[timeframe];
    if (!bucketDuration) return;

    const previousMs = new Date(previous.date).getTime();
    if (!Number.isFinite(previousMs)) return;
    const nowMs = Date.now();
    const currentBucketMs = Math.floor(nowMs / bucketDuration) * bucketDuration;
    const previousBucketMs =
      Math.floor(previousMs / bucketDuration) * bucketDuration;
    const startsNewBucket = currentBucketMs > previousBucketMs;
    const next: Candle = startsNewBucket
      ? {
          date: new Date(currentBucketMs).toISOString(),
          open: livePrice,
          high: livePrice,
          low: livePrice,
          close: livePrice,
        }
      : {
          ...previous,
          high: Math.max(previous.high, livePrice),
          low: Math.min(previous.low, livePrice),
          close: livePrice,
        };

    liveCandleRef.current = next;
    series.update({
      time: Math.floor(new Date(next.date).getTime() / 1000) as UTCTimestamp,
      open: next.open,
      high: next.high,
      low: next.low,
      close: next.close,
    });
  }, [livePrice, liveUpdatedAt, state, timeframe]);

  // Build/refresh chart when candles, theme, or cutoff change.
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
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
      },
    });
    chartRef.current = chart;
    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
      priceLineColor: "#eab308",
      priceLineStyle: LineStyle.Dotted,
      autoscaleInfoProvider,
    });
    seriesRef.current = series;
    series.setData(buildCandleData(candles, cutoffSec, isDark));
    chart.timeScale().fitContent();
    chart.timeScale().applyOptions?.({ barSpacing, rightOffset: 10 });

    return () => {
      priceLinesRef.current = [];
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [candles, state, theme, cutoffSec, autoscaleInfoProvider]);

  useEffect(() => {
    chartRef.current?.timeScale().applyOptions?.({ barSpacing });
  }, [barSpacing]);

  const resetChartView = () => {
    setBarSpacing(8);
    const timeScale = chartRef.current?.timeScale();
    timeScale?.fitContent();
    timeScale?.applyOptions?.({ barSpacing: 8, rightOffset: 10 });
  };

  // Draw / refresh price lines for the trade plan whenever the plan changes
  // — or whenever the chart/series is rebuilt. `theme` is in the dep list
  // because a light/dark toggle tears down and recreates the series (see the
  // chart-build effect above); without it the freshly-built series would be
  // left with no SL / Entry / TP lines until the next plan change.
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    // Clear previous lines (e.g. side flip during a hot edit).
    for (const pl of priceLinesRef.current) {
      try { series.removePriceLine(pl); } catch { /* line already gone */ }
    }
    priceLinesRef.current = [];
    for (const lvl of displayedLevels) {
      const line = series.createPriceLine({
        price: lvl.price,
        color: lvl.color,
        lineWidth: 2,
        lineStyle: lvl.lineStyle,
        axisLabelVisible: true,
        // Keep every recommendation label (SL / Entry / TP1 / TP2) on a
        // single, consistent black font regardless of the line color the
        // label background inherits.
        axisLabelTextColor: "#000000",
        title: lvl.label,
      });
      priceLinesRef.current.push(line);
    }
  }, [displayedLevels, candles, state, theme]);

  // Track the x-coordinate of the analysis-created cutoff so we can draw a
  // vertical marker line + badge as an HTML overlay. lightweight-charts has
  // no native vertical-line primitive, so we project the timestamp into pane
  // pixels via timeToCoordinate and re-run on every pan/zoom/resize.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || state !== "ready" || cutoffSec == null) {
      setMarkerX(null);
      return;
    }
    const timeScale = chart.timeScale();
    const recompute = () => {
      const x = timeScale.timeToCoordinate(cutoffSec as UTCTimestamp);
      setMarkerX(typeof x === "number" && Number.isFinite(x) ? x : null);
    };
    recompute();
    timeScale.subscribeVisibleTimeRangeChange(recompute);
    timeScale.subscribeVisibleLogicalRangeChange(recompute);
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(recompute)
      : null;
    if (ro && hostRef.current) ro.observe(hostRef.current);
    return () => {
      timeScale.unsubscribeVisibleTimeRangeChange(recompute);
      timeScale.unsubscribeVisibleLogicalRangeChange(recompute);
      ro?.disconnect();
    };
  }, [cutoffSec, state, candles, theme]);

  return (
    <div
      className="relative w-full"
      style={{ height: toCssSize(height) }}
      data-testid="analysis-levels-chart"
      data-state={state}
      data-instrument={instrument}
      data-timeframe={timeframe}
      data-analysis-cutoff={cutoffSec ?? ""}
      data-level-mode={levelDisplayMode}
    >
      <div
        ref={hostRef}
        className="absolute inset-0"
        style={{ visibility: state === "ready" ? "visible" : "hidden" }}
      />
      {state === "ready" && tradePlan?.preferredSide === "wait" && (
        <div
          className="absolute left-2 top-2 z-10 flex rounded-lg border border-border/70 bg-background/90 p-0.5 shadow-sm backdrop-blur"
          role="group"
          aria-label={lang === "id" ? "Skenario level harga" : "Price level scenario"}
          data-testid="chart-level-mode"
        >
          {(["buy", "sell", "both"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setLevelDisplayMode(mode)}
              aria-pressed={levelDisplayMode === mode}
              data-testid={`chart-level-mode-${mode}`}
              className={`rounded-md px-2 py-1 text-[10px] font-bold transition-colors ${
                levelDisplayMode === mode
                  ? mode === "buy"
                    ? "bg-cyan-500 text-white"
                    : mode === "sell"
                      ? "bg-amber-500 text-[#1a1208]"
                      : "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {mode === "buy" ? "BUY" : mode === "sell" ? "SELL" : lang === "id" ? "Keduanya" : "Both"}
            </button>
          ))}
        </div>
      )}
      {state === "ready" && (
        <div
          className="absolute right-2 top-2 z-10 flex rounded-lg border border-border/70 bg-background/90 p-0.5 shadow-sm backdrop-blur"
          role="group"
          aria-label={lang === "id" ? "Kontrol zoom grafik" : "Chart zoom controls"}
          data-testid="chart-zoom-controls"
        >
          <button
            type="button"
            onClick={() => setBarSpacing((value) => Math.max(4, value - 2))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={lang === "id" ? "Perkecil grafik" : "Zoom out chart"}
            data-testid="chart-zoom-out"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetChartView}
            className="flex h-7 items-center justify-center rounded-md px-2 text-[9px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={lang === "id" ? "Reset zoom grafik" : "Reset chart zoom"}
            data-testid="chart-zoom-reset"
          >
            RESET
          </button>
          <button
            type="button"
            onClick={() => setBarSpacing((value) => Math.min(28, value + 2))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={lang === "id" ? "Perbesar grafik" : "Zoom in chart"}
            data-testid="chart-zoom-in"
          >
            +
          </button>
        </div>
      )}
      {state === "ready" && markerX != null && (
        <>
          {/* Vertical dashed marker line. Leaves room at the bottom for
              the time axis (~22px) so it doesn't bleed into the labels. */}
          <div
            className="pointer-events-none absolute top-0 border-l border-dashed border-foreground/50"
            style={{ left: `${markerX}px`, bottom: 22 }}
            data-testid="analysis-cutoff-marker"
          />
          {/* "AI saw up to here" badge — small chip anchored just left of
              the line so it visually labels the historical (left) side. */}
          <div
            className="pointer-events-none absolute top-1 -translate-x-full pr-1"
            style={{ left: `${markerX}px` }}
            data-testid="analysis-cutoff-badge"
          >
            <span className="inline-block rounded bg-foreground/80 text-background text-[10px] leading-none px-1.5 py-1 whitespace-nowrap">
              {lang === "id" ? "Data AI sampai sini" : "AI saw up to here"}
            </span>
          </div>
        </>
      )}
      {state === "loading" && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground"
          data-testid="analysis-levels-chart-loading"
        >
          <span>{lang === "id" ? "Memuat chart…" : "Loading chart…"}</span>
        </div>
      )}
      {state === "error" && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground px-3 text-center"
          data-testid="analysis-levels-chart-error"
          data-error={errorMsg ?? ""}
        >
          <span>{lang === "id" ? "Data chart tidak tersedia." : "Chart data unavailable."}</span>
        </div>
      )}
    </div>
  );
}
