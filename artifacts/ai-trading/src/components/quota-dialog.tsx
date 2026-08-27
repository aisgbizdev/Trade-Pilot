import { Clock, CalendarClock, Hourglass } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { hideQuotaDialog, useQuotaDialogState, type QuotaScope } from "@/hooks/use-quota-dialog";

const SCOPE_ICON: Record<QuotaScope, typeof Clock> = {
  hour: Clock,
  day: CalendarClock,
  concurrent: Hourglass,
};

// Nicer replacement for the plain destructive toast previously shown for
// 429 quota errors — a centered icon badge + friendly copy + a visual
// used/limit bar, instead of a red banner with raw backend error text.
// Triggered via showQuotaDialog(...) from anywhere (see use-quota-dialog.ts);
// mounted once at the app root (App.tsx), next to <Toaster />.
export function QuotaDialog() {
  const { t } = useTranslation();
  const { open, info } = useQuotaDialogState();

  if (!info) return null;

  const Icon = SCOPE_ICON[info.scope];
  const title =
    info.scope === "hour"
      ? t.quota_dialog.title_hour
      : info.scope === "day"
        ? t.quota_dialog.title_day
        : t.quota_dialog.title_concurrent;
  const description =
    info.scope === "hour"
      ? t.quota_dialog.desc_hour
      : info.scope === "day"
        ? t.quota_dialog.desc_day
        : t.quota_dialog.desc_concurrent;

  const hasCount = info.limit != null && info.used != null;
  const pct = hasCount ? Math.min(100, Math.round((info.used! / info.limit!) * 100)) : 0;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && hideQuotaDialog()}>
      <DialogContent className="sm:max-w-sm text-center" data-testid="dialog-quota">
        <DialogHeader className="items-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1">
            <Icon className="w-7 h-7 text-amber-500 dark:text-amber-400" />
          </div>
          <DialogTitle data-testid="text-quota-dialog-title">{title}</DialogTitle>
          <DialogDescription data-testid="text-quota-dialog-desc">{description}</DialogDescription>
        </DialogHeader>

        {hasCount && (
          <div className="space-y-1.5 px-1" data-testid="quota-dialog-bar">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  pct >= 100 ? "bg-destructive" : "bg-amber-500",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t.quota_dialog.used_of_limit
                .replace("{used}", String(info.used))
                .replace("{limit}", String(info.limit))}
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-center">
          <Button onClick={hideQuotaDialog} className="w-full sm:w-auto" data-testid="button-quota-dialog-ok">
            {t.quota_dialog.ok_btn}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
