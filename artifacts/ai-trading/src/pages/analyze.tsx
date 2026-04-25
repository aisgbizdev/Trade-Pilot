import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { Layout } from "@/components/layout";
import { useCreateAnalysis } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const FUTURES_INSTRUMENTS = ["XAU/USD", "BRENT", "XAG/USD", "HSI", "NIKKEI", "DJIA", "NASDAQ", "DXY"];
const FOREX_INSTRUMENTS = ["AUD/USD", "EUR/USD", "GBP/USD", "USD/CHF", "USD/JPY", "USD/IDR"];
const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];

const LOADING_MESSAGES = [
  "Menganalisis kondisi pasar...",
  "Memeriksa faktor teknikal...",
  "Mengevaluasi sentimen fundamental...",
  "Menyusun skenario kemungkinan...",
  "Memvalidasi tingkat keyakinan...",
  "Menyiapkan hasil analisis...",
];

export default function AnalyzePage() {
  const { user } = useAuth();
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
        setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
      }, 1800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLoadingMsgIndex(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading]);

  const finalInstrument = customInstrument.trim() || selectedInstrument;

  const handleSubmit = async () => {
    if (!finalInstrument) {
      toast({ title: "Pilih instrumen", description: "Pilih atau ketik instrumen yang ingin dianalisis", variant: "destructive" });
      return;
    }
    if (!selectedTimeframe) {
      toast({ title: "Pilih timeframe", description: "Pilih timeframe analisis", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createAnalysis.mutateAsync({
        data: {
          instrument: finalInstrument,
          timeframe: selectedTimeframe,
          mode: user?.selectedMode ?? "beginner",
          notes: notes || undefined,
        },
      });
      const res = result as any;
      setLocation(`/analyses/${res.id}`);
    } catch (err: any) {
      toast({
        title: "Analisis gagal",
        description: err?.data?.error ?? "Terjadi kesalahan, coba lagi",
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
            <h1 className="text-lg font-bold text-foreground">Analisis Baru</h1>
            <p className="text-xs text-muted-foreground">
              Mode: {user?.selectedMode === "beginner" ? "Pemula" : "Pro"}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Pilih Instrumen</h2>
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
                  onClick={() => {
                    setSelectedInstrument(inst);
                    setCustomInstrument("");
                  }}
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
                placeholder="Atau ketik instrumen lain..."
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
            <h2 className="text-sm font-semibold text-foreground mb-3">Pilih Timeframe</h2>
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

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">Catatan (opsional)</h2>
            <Textarea
              placeholder="Tambahkan konteks atau pertanyaan spesifik untuk AI..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
              data-testid="textarea-notes"
            />
          </div>

          {finalInstrument && selectedTimeframe && (
            <Card className="p-3 bg-muted/50 border-dashed">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Instrumen:</span>
                <span className="font-semibold text-foreground">{finalInstrument}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Timeframe:</span>
                <span className="font-semibold text-foreground">{selectedTimeframe}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">Mode:</span>
                <span className="font-semibold text-foreground">
                  {user?.selectedMode === "beginner" ? "Pemula" : "Pro"}
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
                <span className="text-sm">{LOADING_MESSAGES[loadingMsgIndex]}</span>
              </div>
            ) : (
              "Analisis"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Hasil analisis ini hanya untuk mendukung keputusan, bukan saran keuangan atau sinyal trading.
          </p>
        </div>
      </div>
    </Layout>
  );
}
