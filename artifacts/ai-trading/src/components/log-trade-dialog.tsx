import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateJournalEntry,
  useUpdateJournalEntry,
  getListJournalEntriesQueryKey,
  getGetJournalStatsQueryKey,
  type JournalEntry,
  type CreateJournalEntryBody,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Outcome = "win" | "loss" | "breakeven" | "open" | "skipped";
type Side = "buy" | "sell";

const MOOD_KEYS: Array<keyof ReturnType<typeof useTranslation>["t"]["journal"]> =
  [
    "mood_confident",
    "mood_calm",
    "mood_uncertain",
    "mood_fomo",
    "mood_revenge",
    "mood_disciplined",
  ];

interface LogTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // When opening from an analysis detail page we pre-fill instrument /
  // side / analysisId so the form is a one-tap log in the common case.
  defaultInstrument?: string;
  defaultSide?: Side;
  defaultEntryPrice?: string;
  analysisId?: number | null;
  // When provided, the dialog runs in edit mode (PATCH) against the
  // existing entry instead of POSTing a new row.
  editing?: JournalEntry | null;
}

export function LogTradeDialog({
  open,
  onOpenChange,
  defaultInstrument,
  defaultSide,
  defaultEntryPrice,
  analysisId,
  editing,
}: LogTradeDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateJournalEntry();
  const updateMutation = useUpdateJournalEntry();

  const [instrument, setInstrument] = useState("");
  const [side, setSide] = useState<Side>("buy");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("open");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [tradedAt, setTradedAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset form whenever the dialog opens, so re-opening doesn't surface
  // leftover values from a previous edit.
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setInstrument(editing.instrument);
      setSide(editing.side);
      setEntryPrice(editing.entryPrice ?? "");
      setExitPrice(editing.exitPrice ?? "");
      setQuantity(editing.quantity ?? "");
      setOutcome(editing.outcome as Outcome);
      setMood(editing.mood ?? "");
      setNote(editing.note ?? "");
      setTradedAt(toLocalInputValue(editing.tradedAt));
    } else {
      setInstrument(defaultInstrument ?? "");
      setSide(defaultSide ?? "buy");
      setEntryPrice(defaultEntryPrice ?? "");
      setExitPrice("");
      setQuantity("");
      setOutcome("open");
      setMood("");
      setNote("");
      setTradedAt(toLocalInputValue(new Date().toISOString()));
    }
    setError(null);
  }, [open, editing, defaultInstrument, defaultSide, defaultEntryPrice]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const validate = (): string | null => {
    if (!instrument.trim()) return t.journal.required_instrument;
    if (side !== "buy" && side !== "sell") return t.journal.required_side;
    for (const v of [entryPrice, exitPrice, quantity]) {
      if (v.trim() === "") continue;
      if (!Number.isFinite(Number(v))) return t.journal.invalid_price;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);

    const body: CreateJournalEntryBody = {
      instrument: instrument.trim(),
      side,
      ...(entryPrice.trim() && { entryPrice: entryPrice.trim() }),
      ...(exitPrice.trim() && { exitPrice: exitPrice.trim() }),
      ...(quantity.trim() && { quantity: quantity.trim() }),
      outcome,
      ...(mood.trim() && { mood: mood.trim() }),
      ...(note.trim() && { note: note.trim() }),
      ...(tradedAt && { tradedAt: new Date(tradedAt).toISOString() }),
      ...(analysisId != null && !editing && { analysisId }),
    };

    const onDone = () => {
      queryClient.invalidateQueries({
        queryKey: getListJournalEntriesQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getGetJournalStatsQueryKey(),
      });
      onOpenChange(false);
    };
    const onErr = () => {
      toast({ title: t.journal.save_failed, variant: "destructive" });
    };

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: body },
        { onSuccess: onDone, onError: onErr },
      );
    } else {
      createMutation.mutate({ data: body }, { onSuccess: onDone, onError: onErr });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md max-h-[90dvh] overflow-y-auto"
        data-testid="modal-log-trade"
      >
        <DialogHeader>
          <DialogTitle>
            {editing ? t.journal.edit_entry : t.journal.new_entry}
          </DialogTitle>
          <DialogDescription>{t.journal.subtitle}</DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="journal-instrument">{t.journal.instrument}</Label>
            <Input
              id="journal-instrument"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              placeholder="XAU/USD"
              data-testid="input-journal-instrument"
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.journal.side}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={side === "buy" ? "default" : "outline"}
                onClick={() => setSide("buy")}
                className={cn(
                  side === "buy" &&
                    "bg-emerald-600 hover:bg-emerald-700 text-white",
                )}
                data-testid="button-side-buy"
              >
                {t.journal.side_buy}
              </Button>
              <Button
                type="button"
                variant={side === "sell" ? "default" : "outline"}
                onClick={() => setSide("sell")}
                className={cn(
                  side === "sell" && "bg-red-600 hover:bg-red-700 text-white",
                )}
                data-testid="button-side-sell"
              >
                {t.journal.side_sell}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="journal-entry">{t.journal.entry_price}</Label>
              <Input
                id="journal-entry"
                inputMode="decimal"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="0.0"
                data-testid="input-journal-entry-price"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="journal-exit">{t.journal.exit_price}</Label>
              <Input
                id="journal-exit"
                inputMode="decimal"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="0.0"
                data-testid="input-journal-exit-price"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="journal-quantity">{t.journal.quantity}</Label>
            <Input
              id="journal-quantity"
              inputMode="decimal"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1.0"
              data-testid="input-journal-quantity"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="journal-outcome">{t.journal.outcome}</Label>
            <Select
              value={outcome}
              onValueChange={(v) => setOutcome(v as Outcome)}
            >
              <SelectTrigger id="journal-outcome" data-testid="select-journal-outcome">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">{t.journal.outcome_open}</SelectItem>
                <SelectItem value="win">{t.journal.outcome_win}</SelectItem>
                <SelectItem value="loss">{t.journal.outcome_loss}</SelectItem>
                <SelectItem value="breakeven">
                  {t.journal.outcome_breakeven}
                </SelectItem>
                <SelectItem value="skipped">
                  {t.journal.outcome_skipped}
                </SelectItem>
              </SelectContent>
            </Select>
            {entryPrice && exitPrice && (
              <p className="text-[11px] text-muted-foreground">
                {t.journal.auto_computed}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>{t.journal.mood}</Label>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_KEYS.map((key) => {
                const label = t.journal[key];
                const active = mood.toLowerCase() === label.toLowerCase();
                return (
                  <Badge
                    key={key}
                    variant={active ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer select-none text-[11px]",
                      active && "bg-primary text-primary-foreground",
                    )}
                    onClick={() => setMood(active ? "" : label)}
                    data-testid={`chip-mood-${key}`}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
            <Input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder={t.journal.mood_placeholder}
              maxLength={40}
              className="text-sm"
              data-testid="input-journal-mood"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="journal-note">{t.journal.note}</Label>
            <Textarea
              id="journal-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.journal.note_placeholder}
              rows={3}
              maxLength={2000}
              data-testid="textarea-journal-note"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="journal-traded-at">{t.journal.traded_at}</Label>
            <Input
              id="journal-traded-at"
              type="datetime-local"
              value={tradedAt}
              onChange={(e) => setTradedAt(e.target.value)}
              data-testid="input-journal-traded-at"
            />
          </div>

          {error && (
            <p
              className="text-xs text-red-600 dark:text-red-400"
              data-testid="text-journal-error"
            >
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-testid="button-save-journal-entry"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              {isPending ? t.journal.saving : t.journal.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ISO string -> "YYYY-MM-DDTHH:mm" in local time so <input type="datetime-local">
// renders the user's wall clock (the input element does not accept Z-suffixed UTC).
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
