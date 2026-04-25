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

async function fetchLiveQuotes(): Promise<LiveQuotesResponse> {
  const res = await fetch("/api/quotes/live", { credentials: "include" });
  if (!res.ok) throw new Error("Gagal memuat harga live");
  return res.json();
}

export function useLiveQuotes() {
  return useQuery<LiveQuotesResponse>({
    queryKey: ["live-quotes"],
    queryFn: fetchLiveQuotes,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

export function useQuoteByInstrument(instrument: string) {
  const { data, ...rest } = useLiveQuotes();
  const quote = data?.data.find(
    (q) => q.instrument.toLowerCase() === instrument.toLowerCase()
  );
  return { quote, ...rest };
}
