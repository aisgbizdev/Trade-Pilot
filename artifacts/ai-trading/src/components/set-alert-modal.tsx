import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { useQuoteByInstrument } from "@/hooks/use-live-quotes";
import {
  useCreateUserPriceAlert,
  getListUserPriceAlertsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instrument: string;
}

export function SetAlertModal({ open, onOpenChange, instrument }: Props) {
  const { t, lang } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createAlert = useCreateUserPriceAlert();
  const { quote } = useQuoteByInstrument(instrument);
  const [target, setTarget] = useState("");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [note, setNote] = useState("");

  // Pre-fill the form *once* per (open, instrument) transition. Live
  // quotes refresh every 15s — we must NOT reset what the user is
  // typing whenever a new tick arrives, so we ignore quote.price as a
  // dependency and read its latest value via a ref instead.
  const quoteRef = useRef(quote?.price);
  quoteRef.current = quote?.price;
  useEffect(() => {
    if (!open) return;
    const seed = quoteRef.current;
    setTarget(seed != null ? String(seed) : "");
    setDirection("above");
    setNote("");
  }, [open, instrument]);

  const handleSubmit = async () => {
    const targetNum = Number(target);
    if (!Number.isFinite(targetNum) || targetNum <= 0) {
      toast({
        title: t.alerts.error_invalid_target,
        variant: "destructive",
      });
      return;
    }
    try {
      await createAlert.mutateAsync({
        data: {
          instrument,
          targetPrice: targetNum,
          triggerDirection: direction,
          note: note.trim() ? note.trim() : null,
          lang,
        },
      });
      queryClient.invalidateQueries({
        queryKey: getListUserPriceAlertsQueryKey(),
      });
      toast({
        title: t.alerts.created_title,
        description: t.alerts.created_desc
          .replace("{instrument}", instrument)
          .replace(
            "{direction}",
            direction === "above" ? t.alerts.above_short : t.alerts.below_short,
          )
          .replace("{price}", String(targetNum)),
      });
      onOpenChange(false);
    } catch (err) {
      const apiErr = err as { data?: { error?: string } };
      toast({
        title: t.alerts.error_create_failed,
        description: apiErr?.data?.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-set-alert">
        <DialogHeader>
          <DialogTitle>{t.alerts.modal_title}</DialogTitle>
          <DialogDescription>{t.alerts.modal_subtitle}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {t.alerts.field_instrument}
            </label>
            <div className="px-3 py-2 rounded-lg bg-muted text-sm font-semibold text-foreground" data-testid="text-alert-instrument">
              {instrument}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1" htmlFor="alert-target">
              {t.alerts.field_target}
            </label>
            <input
              id="alert-target"
              type="number"
              inputMode="decimal"
              step="any"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              data-testid="input-alert-target"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {t.alerts.field_direction}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["above", "below"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDirection(d)}
                  data-testid={`button-direction-${d}`}
                  className={cn(
                    "px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left",
                    direction === d
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-foreground hover:border-primary/50",
                  )}
                >
                  {d === "above" ? t.alerts.direction_above : t.alerts.direction_below}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1" htmlFor="alert-note">
              {t.alerts.field_note}
            </label>
            <input
              id="alert-note"
              type="text"
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.alerts.note_placeholder}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              data-testid="input-alert-note"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-alert-cancel"
          >
            {t.alerts.cancel_btn}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createAlert.isPending}
            data-testid="button-alert-submit"
          >
            {t.alerts.submit_btn}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
