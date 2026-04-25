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

async function fetchIndicators(instrument: string): Promise<TechnicalIndicators> {
  const res = await fetch(`/api/historical/indicators?instrument=${encodeURIComponent(instrument)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? "Gagal mengambil data indikator");
  }
  const data = await res.json();
  return data.indicators;
}

export function useTechnicalIndicators(instrument: string | undefined) {
  return useQuery({
    queryKey: ["technical-indicators", instrument],
    queryFn: () => fetchIndicators(instrument!),
    enabled: !!instrument,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}
