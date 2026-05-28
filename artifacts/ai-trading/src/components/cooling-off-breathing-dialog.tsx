import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Breathing-exercise gate for the cooling-off guardrail (task #163).
// Shown when the user taps Analyse while a cooling-off countdown is
// active. The dialog enforces "one explicit tap" before the analyse
// flow proceeds — never a hard block, just a friction step backed by
// a 4-4-4 box-breath animation.

type Phase = "inhale" | "hold" | "exhale";
const PHASE_SECONDS = 4;

interface CoolingOffBreathingDialogProps {
  open: boolean;
  onClose: () => void;
  onContinueAnyway: () => void;
  lossPnlPercent: string | null;
}

export function CoolingOffBreathingDialog({
  open,
  onClose,
  onContinueAnyway,
  lossPnlPercent,
}: CoolingOffBreathingDialogProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState(PHASE_SECONDS);

  useEffect(() => {
    if (!open) {
      setPhase("inhale");
      setSecondsLeft(PHASE_SECONDS);
      return;
    }
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        setPhase((p) => (p === "inhale" ? "hold" : p === "hold" ? "exhale" : "inhale"));
        return PHASE_SECONDS;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  const phaseLabel =
    phase === "inhale"
      ? t.analyze.cooling_off_dialog_inhale
      : phase === "hold"
        ? t.analyze.cooling_off_dialog_hold
        : t.analyze.cooling_off_dialog_exhale;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm" data-testid="cooling-off-breathing-dialog">
        <DialogHeader>
          <DialogTitle>{t.analyze.cooling_off_dialog_title}</DialogTitle>
          <DialogDescription>
            {t.analyze.cooling_off_dialog_body.replace(
              "{loss}",
              lossPnlPercent ?? "",
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-6 gap-3">
          <div
            data-testid="breathing-orb"
            className={cn(
              "rounded-full bg-amber-400/30 border-2 border-amber-500 transition-all ease-in-out",
              phase === "inhale" && "w-32 h-32",
              phase === "hold" && "w-32 h-32",
              phase === "exhale" && "w-16 h-16",
            )}
            style={{ transitionDuration: `${PHASE_SECONDS * 1000}ms` }}
          />
          <p className="text-sm font-medium text-foreground" data-testid="breathing-phase">
            {phaseLabel} · {secondsLeft}
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="cooling-off-wait-btn"
          >
            {t.analyze.cooling_off_dialog_wait_btn}
          </Button>
          <Button
            variant="destructive"
            onClick={onContinueAnyway}
            data-testid="cooling-off-continue-btn"
          >
            {t.analyze.cooling_off_dialog_continue_btn}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
