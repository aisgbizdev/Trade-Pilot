import { useQuery } from "@tanstack/react-query";

export type LandingPreviewBias =
  | "bearish_strong"
  | "bearish"
  | "neutral"
  | "bullish"
  | "bullish_strong";

export type LandingPreviewSide = "buy" | "sell" | "wait";

export interface LandingPreviewTradeSide {
  entryZone: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  riskRewardRatio: string;
}

export interface LandingPreviewResponse {
  status: "success";
  instrument: "XAU/USD";
  timeframe: "1D";
  generatedAt: string;
  isStale: boolean;
  price: number | null;
  tradingBias: LandingPreviewBias;
  confidenceMin: number;
  confidenceMax: number;
  preferredSide: LandingPreviewSide;
  levels: LandingPreviewTradeSide | null;
}

async function fetchLandingPreview(): Promise<LandingPreviewResponse> {
  const response = await fetch("/api/landing/preview");
  if (!response.ok) {
    throw new Error("Live landing preview unavailable");
  }
  return response.json() as Promise<LandingPreviewResponse>;
}

export function useLandingPreview() {
  return useQuery({
    queryKey: ["landing-preview", "XAU/USD", "1D"],
    queryFn: fetchLandingPreview,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}