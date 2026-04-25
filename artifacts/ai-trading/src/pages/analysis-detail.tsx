import { useLocation } from "wouter";
import { ChevronLeft, Clock, AlertTriangle, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout";
import {
  useGetAnalysis,
  getGetAnalysisQueryKey,
  useSubmitFeedback,
  type Analysis,
  type Feedback,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MARKET_CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  trending_up: { label: "Tren Naik", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  trending_down: { label: "Tren Turun", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ranging: { label: "Sideways", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  volatile: { label: "Volatil", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

const RISK_LEVEL_LABELS: Record<string, { label: string; color: string; bars: number }> = {
  low: { label: "Risiko Rendah", color: "text-green-600 dark:text-green-400", bars: 1 },
  medium: { label: "Risiko Sedang", color: "text-yellow-600 dark:text-yellow-400", bars: 2 },
  high: { label: "Risiko Tinggi", color: "text-red-600 dark:text-red-400", bars: 3 },
};

function ValidityBadge({ validUntil }: { validUntil: string }) {
  const date = new Date(validUntil);
  const valid = date > new Date();
  if (valid) {
    return (
      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
        <Clock className="w-4 h-4" />
        <span className="text-xs font-medium">
          Relevan hingga{" "}
          {formatDistanceToNow(date, { addSuffix: false, locale: idLocale })} lagi
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span className="text-xs font-medium">Analisis ini mungkin sudah tidak relevan</span>
    </div>
  );
}

function Section({ title, content }: { title: string; content?: string | null }) {
  if (!content) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{title}</h3>
      <p className="text-sm text-foreground leading-relaxed">{content}</p>
    </div>
  );
}

export default function AnalysisDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const submitFeedback = useSubmitFeedback();

  const [feedbackType, setFeedbackType] = useState<"useful" | "not_useful" | null>(null);
  const [outcome, setOutcome] = useState<"correct" | "wrong" | "unknown" | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const { data, isLoading } = useGetAnalysis(id, {
    query: {
      enabled: !!id,
      queryKey: getGetAnalysisQueryKey(id),
    },
  });

  type AnalysisWithFeedback = Analysis & { feedback?: Feedback | null };
  const analysis = data as AnalysisWithFeedback | undefined;

  const existingFeedback = analysis?.feedback;

  const handleFeedbackSubmit = async () => {
    if (!feedbackType && !existingFeedback) return;

    try {
      await submitFeedback.mutateAsync({
        id,
        data: {
          feedbackType: (feedbackType ?? existingFeedback?.feedbackType) as "useful" | "not_useful",
          outcome: (outcome ?? existingFeedback?.outcome ?? undefined) as "correct" | "wrong" | "unknown" | null | undefined,
          note: feedbackNote || existingFeedback?.note || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetAnalysisQueryKey(id) });
      setFeedbackSubmitted(true);
      toast({ title: "Feedback tersimpan" });
    } catch {
      toast({ title: "Gagal menyimpan feedback", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!analysis) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <p className="text-muted-foreground mb-4">Analisis tidak ditemukan</p>
          <Button variant="outline" onClick={() => setLocation("/history")}>
            Kembali ke Riwayat
          </Button>
        </div>
      </Layout>
    );
  }

  const mc = analysis.marketCondition ? MARKET_CONDITION_LABELS[analysis.marketCondition] : undefined;
  const rl = analysis.riskLevel ? RISK_LEVEL_LABELS[analysis.riskLevel] : undefined;
  const isBeginnerMode = analysis.mode === "beginner";

  const displayFeedbackType = feedbackType ?? existingFeedback?.feedbackType ?? null;
  const displayOutcome = outcome ?? existingFeedback?.outcome ?? null;

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/history")}
            className="p-2 rounded-lg hover:bg-muted"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground" data-testid="text-instrument">
                {analysis.instrument}
              </h1>
              <Badge variant="outline" className="text-xs">
                {analysis.timeframe}
              </Badge>
              <Badge className={cn("text-xs border-0", mc?.color)}>
                {mc?.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ValidityBadge validUntil={analysis.validUntil} />
            </div>
          </div>
        </div>

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Tingkat Keyakinan</p>
              <p className="text-base font-bold text-foreground" data-testid="text-confidence">
                {analysis.confidenceMin ?? "--"}% – {analysis.confidenceMax ?? "--"}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Risiko</p>
              <p className={cn("text-sm font-bold", rl?.color)} data-testid="text-risk-level">
                {rl?.label}
              </p>
            </div>
          </div>

          <div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-2 flex-1 rounded-full",
                    n <= (rl?.bars ?? 0)
                      ? analysis.riskLevel === "low"
                        ? "bg-green-500"
                        : analysis.riskLevel === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{
                  left: `${analysis.confidenceMin ?? 0}%`,
                  width: `${(analysis.confidenceMax ?? 0) - (analysis.confidenceMin ?? 0)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Dianalisis {format(new Date(analysis.createdAt), "d MMM yyyy, HH:mm", { locale: idLocale })} •{" "}
            Mode {isBeginnerMode ? "Pemula" : "Pro"}
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          {isBeginnerMode ? (
            <>
              <Section title="Skenario Utama" content={analysis.mainScenario} />
              <Section title="Skenario Alternatif" content={analysis.alternativeScenario} />
              <Section title="Alasan" content={analysis.whyReason} />
              <Section title="Kondisi yang Membatalkan" content={analysis.failureConditions} />
            </>
          ) : (
            <>
              <Section title="Skenario Dasar" content={analysis.baseCase} />
              <Section title="Skenario Bullish" content={analysis.bullishScenario} />
              <Section title="Skenario Bearish" content={analysis.bearishScenario} />
              <Section title="Faktor Teknikal" content={analysis.keyDriversTechnical} />
              <Section title="Faktor Fundamental" content={analysis.keyDriversFundamental} />
              <Section title="Konteks Pasar" content={analysis.marketContext} />
              <Section title="Kondisi yang Membatalkan" content={analysis.invalidationConditions} />
              <Section title="Catatan Ketidakpastian" content={analysis.uncertaintyNotes} />
            </>
          )}
        </Card>

        <Card className="p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Analisis ini adalah alat pendukung keputusan, bukan saran keuangan atau sinyal trading otomatis. 
              Selalu lakukan riset sendiri dan kelola risiko dengan bijak.
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {existingFeedback || feedbackSubmitted ? "Feedback Kamu" : "Bagaimana Analisis Ini?"}
          </h3>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setFeedbackType("useful")}
              data-testid="button-feedback-useful"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                displayFeedbackType === "useful"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                  : "border-border text-muted-foreground hover:border-green-400"
              )}
            >
              <ThumbsUp className="w-4 h-4" />
              Berguna
            </button>
            <button
              onClick={() => setFeedbackType("not_useful")}
              data-testid="button-feedback-not-useful"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                displayFeedbackType === "not_useful"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400"
                  : "border-border text-muted-foreground hover:border-red-400"
              )}
            >
              <ThumbsDown className="w-4 h-4" />
              Tidak Berguna
            </button>
          </div>

          {(feedbackType || existingFeedback) && (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Hasil Sebenarnya (opsional)</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["correct", "wrong", "unknown"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOutcome(o)}
                      data-testid={`button-outcome-${o}`}
                      className={cn(
                        "py-2 text-xs font-medium rounded-lg border transition-all",
                        displayOutcome === o
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {o === "correct" ? "Terbukti Benar" : o === "wrong" ? "Analisis Salah" : "Belum Tahu"}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Catatan tambahan (opsional)"
                value={feedbackNote || existingFeedback?.note || ""}
                onChange={(e) => setFeedbackNote(e.target.value)}
                rows={2}
                className="resize-none text-sm"
                data-testid="textarea-feedback-note"
              />

              {!feedbackSubmitted && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleFeedbackSubmit}
                  disabled={submitFeedback.isPending}
                  data-testid="button-submit-feedback"
                >
                  {submitFeedback.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Simpan Feedback
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
