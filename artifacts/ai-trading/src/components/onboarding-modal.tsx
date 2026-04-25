import { useState } from "react";
import { TrendingUp, BookOpen, BarChart3, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUpdateProfile, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const ICONS = [TrendingUp, BookOpen, BarChart3, CheckCircle];

export function OnboardingModal({ open }: { open: boolean }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();

  const steps = t.onboarding.steps;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const Icon = ICONS[step];

  const handleComplete = async () => {
    await updateProfile.mutateAsync({ data: { onboardingCompleted: true } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-sm mx-auto p-0 overflow-hidden border-0 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="bg-primary p-6 text-primary-foreground text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex justify-center gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-white" : "w-1.5 bg-white/40")}
              />
            ))}
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">{current.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.description}</p>
          <div className="flex gap-3">
            {!isLast && (
              <Button variant="ghost" className="flex-1" onClick={handleComplete} data-testid="button-skip-onboarding">
                {t.onboarding.skip}
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={isLast ? handleComplete : () => setStep((s) => s + 1)}
              data-testid={isLast ? "button-finish-onboarding" : "button-next-onboarding"}
            >
              {isLast ? t.onboarding.start : t.onboarding.next}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
