import { useState } from "react";
import { TrendingUp, BookOpen, BarChart3, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useUpdateProfile, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: TrendingUp,
    title: "Selamat Datang di AI Trading Assistant",
    description:
      "Ini bukan alat untuk sinyal trading otomatis. Ini adalah asisten analisis yang membantu kamu berpikir lebih jernih sebelum mengambil keputusan trading.",
  },
  {
    icon: BookOpen,
    title: "Mode Pemula vs Pro",
    description:
      "Mode Pemula memberikan analisis dalam bahasa sederhana dengan skenario utama dan alternatif. Mode Pro memberikan analisis mendalam dengan faktor teknikal dan fundamental.",
  },
  {
    icon: BarChart3,
    title: "Cara Menggunakan Analisis",
    description:
      "Pilih instrumen, timeframe, dan mode. AI akan menganalisis kondisi pasar dan memberikan skenario yang mungkin terjadi — bukan prediksi pasti.",
  },
  {
    icon: CheckCircle,
    title: "Pahami Masa Berlaku",
    description:
      "Setiap analisis memiliki masa berlaku berdasarkan timeframe. Analisis 1 menit berlaku 15 menit, analisis 1 minggu berlaku 96 jam. Selalu perhatikan badge masa berlaku.",
  },
];

export function OnboardingModal({ open }: { open: boolean }) {
  const [step, setStep] = useState(0);
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const Icon = current.icon;

  const handleComplete = async () => {
    await updateProfile.mutateAsync({ data: { onboardingCompleted: true } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  const handleSkip = () => handleComplete();

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm mx-auto p-0 overflow-hidden border-0 [&>button]:hidden" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <div className="bg-primary p-6 text-primary-foreground text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex justify-center gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-6 bg-white" : "w-1.5 bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">{current.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {current.description}
          </p>
          <div className="flex gap-3">
            {!isLast && (
              <Button
                variant="ghost"
                className="flex-1"
                onClick={handleSkip}
                data-testid="button-skip-onboarding"
              >
                Lewati
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={isLast ? handleComplete : () => setStep((s) => s + 1)}
              data-testid={isLast ? "button-finish-onboarding" : "button-next-onboarding"}
            >
              {isLast ? "Mulai" : "Lanjut"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
