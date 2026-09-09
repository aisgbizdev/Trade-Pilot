import { useQuery } from "@tanstack/react-query";

export interface LiveQuote {
  instrument: string;
  symbol: string;
  price: number;
  buy: number;
  sell: number;
  spread: number;
  high: number;
  low: number;
  open: number;
  changePercent: string;
  direction: "up" | "down";
  serverTime: string;
  updatedAt: string;
}

interface LiveQuotesResponse {
  status: string;
  updatedAt: string;
  serverTime: string;
  data: LiveQuote[];
}

async function fetchLiveQuotes(fast = false): Promise<LiveQuotesResponse> {
  const res = await fetch(`/api/quotes/live${fast ? "?fast=1" : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal memuat harga live");
  return res.json();
}

export function useLiveQuotes() {
  return useQuery<LiveQuotesResponse>({
    queryKey: ["live-quotes"],
    queryFn: () => fetchLiveQuotes(false),
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

/**
 * Near-real-time variant for a small inline running-price ticker. Polls
 * every few seconds and hits `/api/quotes/live?fast=1`, which serves a
 * ~3s-fresh read instead of the shared 15s cache. Separate query key so
 * it never disturbs the standard `useLiveQuotes` consumers.
 */
export function useLiveQuotesStream(enabled = true) {
  return useQuery<LiveQuotesResponse>({
    queryKey: ["live-quotes", "stream"],
    queryFn: () => fetchLiveQuotes(true),
    refetchInterval: 3_000,
    staleTime: 0,
    enabled,
  });
}

export function useQuoteByInstrument(instrument: string) {
  const { data, ...rest } = useLiveQuotes();
  const quote = data?.data.find(
    (q) => q.instrument.toLowerCase() === instrument.toLowerCase()
  );
  return { quote, ...rest };
}

export function useStreamingQuoteByInstrument(
  instrument: string,
  enabled = true,
) {
  const { data, ...rest } = useLiveQuotesStream(enabled);
  const quote = data?.data.find(
    (q) => q.instrument.toLowerCase() === instrument.toLowerCase()
  );
  return { quote, ...rest };
}
