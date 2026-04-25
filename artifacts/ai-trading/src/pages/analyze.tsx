import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { Layout } from "@/components/layout";
import { useCreateAnalysis, useGetRecentInstruments, getGetRecentInstrumentsQueryKey, type RecentInstruments, type CreateAnalysisBodyTimeframe } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { useQuoteByInstrument } from "@/hooks/use-live-quotes";
import { TechnicalIndicatorsPanel } from "@/components/technical-indicators-panel";
import { useTranslation } from "@/lib/i18n";

function formatPrice(price: number, instrument: string): string {
  if (instrument === "USD/IDR") return price.toLocaleString("id-ID");
  if (instrument === "USD/JPY") return price.toFixed(2);
  if (price > 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return price.toFixed(4);
}

const FUTURES_INSTRUMENTS = ["XAU/USD", "BRENT", "XAG/USD", "HSI", "NIKKEI", "DJIA", "NASDAQ", "DXY"];
const FOREX_INSTRUMENTS = ["AUD/USD", "EUR/USD", "GBP/USD", "USD/CHF", "USD/JPY", "USD/IDR"];
const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];

function LivePriceChip({ instrument }: { instrument: string }) {
  const { t } = useTranslation();
  const { quote, isLoading } = useQuoteByInstrument(instrument);
  if (isLoading) return <span className="text-[10px] text-muted-foreground">{t.analyze.loading_price}</span>;
  if (!quote) return null;
  const isUp = quote.direction === "up";
  const isFlat = quote.changePercent === "+0%" || quote.changePercent === "0%";
  return (
    <div className="flex items-center gap-1">
      <span className="font-bold text-foreground tabular-nums">{formatPrice(quote.price, instrument)}</span>
      <span className={cn(
        "text-[10px] font-medium flex items-center gap-0.5",
        isFlat ? "text-muted-foreground" : isUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
      )}>
        {isFlat ? <Minus className="w-2.5 h-2.5" /> : isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
        {quote.changePercent}
      </span>
    </div>
  );
}

export default function AnalyzePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createAnalysis = useCreateAnalysis();

  const [activeTab, setActiveTab] = useState<"futures" | "forex">("futures");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [customInstrument, setCustomInstrument] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inst = params.get("instrument");
    if (inst) setSelectedInstrument(inst);
  }, []);

  useEffect(() => {
    if (isLoading) {
      intervalRef.current = setInterval(() => {
        setLoadingMsgIndex((i) => (i + 1) % t.analyze.loading.length);
      }, 1800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLoadingMsgIndex(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLoading, t]);

  const { data: recentData } = useGetRecentInstruments({
    query: { queryKey: getGetRecentInstrumentsQueryKey(), staleTime: 60_000 },
  });
  const recentInstruments = (recentData as RecentInstruments | undefined)?.instruments?.slice(0, 3) ?? [];

  const finalInstrument = customInstrument.trim() || selectedInstrument;

  const handleSubmit = async () => {
    if (!finalInstrument) {
      toast({ title: t.analyze.error_no_instrument, description: t.analyze.error_no_instrument_desc, variant: "destructive" });
      return;
    }
    if (!selectedTimeframe) {
      toast({ title: t.analyze.error_no_timeframe, description: t.analyze.error_no_timeframe_desc, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createAnalysis.mutateAsync({
        data: {
          instrument: finalInstrument,
          timeframe: selectedTimeframe as CreateAnalysisBodyTimeframe,
          mode: user?.selectedMode ?? "beginner",
          userInputContext: notes || undefined,
        },
      });
      setLocation(`/analyses/${result.id}`);
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      toast({
        title: t.analyze.failed_title,
        description: apiErr?.data?.error ?? t.analyze.failed_desc,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setLocation("/dashboard")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t.analyze.title}</h1>
            <p className="text-xs text-muted-foreground">
              {t.analyze.mode_label}: {user?.selectedMode === "beginner" ? t.common.beginner : t.common.pro}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {recentInstruments.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">{t.dashboard.last_analyzed}</h2>
              <div className="flex gap-2 flex-wrap">
                {recentInstruments.map((r) => (
                  <button
                    key={r.instrument}
                    onClick={() => { setSelectedInstrument(r.instrument); setCustomInstrument(""); }}
                    data-testid={`button-recent-${r.instrument}`}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5",
                      selectedInstrument === r.instrument && !customInstrument
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    <span>{r.instrument}</span>
                    <span className="text-muted-foreground text-[10px]">{r.mode === "beginner" ? t.common.beginner : t.common.pro}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.analyze.select_instrument}</h2>
            <div className="flex gap-2 mb-3">
              {(["futures", "forex"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  data-testid={`tab-${tab}`}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-lg border transition-all",
                    activeTab === tab
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border"
                  )}
                >
                  {tab === "futures" ? "Futures" : "Forex"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(activeTab === "futures" ? FUTURES_INSTRUMENTS : FOREX_INSTRUMENTS).map((inst) => (
                <button
                  key={inst}
                  onClick={() => { setSelectedInstrument(inst); setCustomInstrument(""); }}
                  data-testid={`button-instrument-${inst}`}
                  className={cn(
                    "py-2.5 text-sm font-medium rounded-lg border transition-all",
                    selectedInstrument === inst && !customInstrument
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-foreground hover:border-primary/50"
                  )}
                >
                  {inst}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder={t.analyze.or_type}
                value={customInstrument}
                onChange={(e) => {
                  setCustomInstrument(e.target.value);
                  if (e.target.value) setSelectedInstrument("");
                }}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                data-testid="input-custom-instrument"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.analyze.select_timeframe}</h2>
            <div className="flex flex-wrap gap-2">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  data-testid={`button-timeframe-${tf}`}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg border transition-all",
                    selectedTimeframe === tf
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {finalInstrument && (
            <TechnicalIndicatorsPanel instrument={finalInstrument} />
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-foreground">{t.analyze.notes_label}</h2>
            </div>
            <Textarea
              placeholder={t.analyze.notes_placeholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
              data-testid="textarea-notes"
            />
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-start gap-1">
              <span className="text-amber-500 mt-0.5">⚠</span>
              {t.analyze.broker_warning}
            </p>
          </div>

          {finalInstrument && selectedTimeframe && (
            <Card className="p-3 bg-muted/50 border-dashed">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.analyze.instrument_label}:</span>
                <span className="font-semibold text-foreground">{finalInstrument}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">{t.analyze.current_price}:</span>
                <LivePriceChip instrument={finalInstrument} />
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">{t.analyze.timeframe_label}:</span>
                <span className="font-semibold text-foreground">{selectedTimeframe}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">{t.analyze.mode_label}:</span>
                <span className="font-semibold text-foreground">
                  {user?.selectedMode === "beginner" ? t.common.beginner : t.common.pro}
                </span>
              </div>
            </Card>
          )}

          <Button
            className="w-full h-12 text-base"
            onClick={handleSubmit}
            disabled={isLoading || !finalInstrument || !selectedTimeframe}
            data-testid="button-submit-analysis"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">{t.analyze.loading[loadingMsgIndex]}</span>
              </div>
            ) : t.analyze.submit_btn}
          </Button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {t.analyze.disclaimer}
          </p>
        </div>
      </div>
    </Layout>
  );
}
