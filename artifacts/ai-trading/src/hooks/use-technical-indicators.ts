import { useQuery } from "@tanstack/react-query";

export interface MAResult {
  period: number;
  type: "SMA" | "EMA";
  value: number;
  signal: "Buy" | "Sell" | "Neutral";
}

export interface OscillatorResult {
  name: string;
  value: number;
  signal: "Buy" | "Sell" | "Neutral";
}

export interface TechnicalIndicators {
  symbol: string;
  dataPoints: number;
  lastClose: number;
  lastDate: string;
  change1d: number;
  change1dPct: number;
  change5d: number;
  change5dPct: number;
  change20d: number;
  change20dPct: number;
  rsi14: OscillatorResult;
  macd: { macd: number; signal: number; histogram: number; action: "Buy" | "Sell" | "Neutral" };
  stochastic: { k: number; d: number; signal: "Buy" | "Sell" | "Neutral" };
  bollinger: { upper: number; middle: number; lower: number; signal: "Buy" | "Sell" | "Neutral" };
  movingAverages: MAResult[];
  oscillatorSummary: { buy: number; sell: number; neutral: number };
  maSummary: { buy: number; sell: number; neutral: number };
  overallSummary: { buy: number; sell: number; neutral: number; signal: "Buy" | "Sell" | "Neutral" };
}

export type IndicatorTimeframe = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1D" | "1W";

async function fetchIndicators(
  instrument: string,
  timeframe: IndicatorTimeframe,
): Promise<TechnicalIndicators> {
  const url =
    `/api/historical/indicators?instrument=${encodeURIComponent(instrument)}` +
    `&timeframe=${encodeURIComponent(timeframe)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Gagal mengambil data indikator");
  }
  const data = await res.json();
  return data.indicators;
}

export function useTechnicalIndicators(
  instrument: string | undefined,
  timeframe: IndicatorTimeframe = "1D",
) {
  return useQuery({
    queryKey: ["technical-indicators", instrument, timeframe],
    queryFn: () => fetchIndicators(instrument!, timeframe),
    enabled: !!instrument,
    // Match the lowest server-side cache TTL (1m timeframe → 30s) so the UI
    // refetches roughly in step with the server's freshest snapshot. Daily
    // and weekly callers still benefit from the server's longer cache.
    staleTime: 30 * 1000,
    retry: false,
  });
}
