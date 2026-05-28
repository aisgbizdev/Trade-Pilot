import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Brain, CheckCircle2, Circle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Optional pre-trade mental checklist. Renders only when the user
// has opted in (see useMentalChecklistPref). Surfaces 4 short
// self-checks that cover the most common psychological pitfalls:
// risk planned, plan written, not chasing, not revenge-trading.
//
// Returning the `allChecked` flag lets the parent (Analyze page)
// decide whether to gate the submit button on it. Today we *don't*
// hard-block — surfacing the unchecked items is itself the nudge,
// and forcing a block would create exactly the friction users opt
// out of.

const ITEMS = [
  { key: "risk", label_en: "I know exactly how much I'll lose if this trade fails", label_id: "Gw tau persis berapa loss kalau trade ini gagal" },
  { key: "plan",  label_en: "I have an entry, stop-loss, and target — written, not in my head", label_id: "Gw punya entry, stop-loss, dan target — tertulis, bukan di kepala doang" },
  { key: "chase", label_en: "I'm not chasing a move that already happened (no FOMO)", label_id: "Gw nggak ngejar pergerakan yang sudah jalan (bukan FOMO)" },
  { key: "calm",  label_en: "I'm not trading to recover a previous loss (no revenge)", label_id: "Gw nggak trade buat balas dendam loss sebelumnya" },
] as const;

export function MentalChecklist() {
  const { t, lang } = useTranslation();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked((s) => ({ ...s, [key]: !s[key] }));
  const allChecked = ITEMS.every((it) => checked[it.key]);

  return (
    <Card
      className={cn(
        "p-3 border-violet-500/30 bg-violet-500/[0.04] space-y-2",
        allChecked && "border-emerald-500/40 bg-emerald-500/[0.04]",
      )}
      data-testid="mental-checklist"
    >
      <div className="flex items-center gap-1.5">
        <Brain
          className={cn(
            "w-3.5 h-3.5",
            allChecked ? "text-emerald-600 dark:text-emerald-400" : "text-violet-600 dark:text-violet-400",
          )}
        />
        <h3 className="text-xs font-bold text-foreground">
          {t.analyze.mental_checklist_title}
        </h3>
      </div>
      <ul className="space-y-1.5">
        {ITEMS.map((it) => {
          const isChecked = !!checked[it.key];
          return (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => toggle(it.key)}
                data-testid={`mental-check-${it.key}`}
                className="w-full flex items-start gap-2 text-left text-[11px] leading-snug"
              >
                {isChecked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className={cn(isChecked ? "text-muted-foreground line-through" : "text-foreground")}>
                  {lang === "id" ? it.label_id : it.label_en}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!allChecked && (
        <p className="text-[10px] text-muted-foreground italic pt-1 border-t border-border/40">
          {t.analyze.mental_checklist_hint}
        </p>
      )}
    </Card>
  );
}
