import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { TopupFlow } from "@/components/topup-flow";
import { hideTopupDialog, useTopupDialogState } from "@/hooks/use-topup-dialog";

/**
 * The package-select -> QRIS/proof-upload popup opened from the
 * quota-exceeded dialog's "Top Up" CTA — lets a user out of credit top up
 * right where they are instead of being navigated away to /topup.
 * Mounted once at the app root (App.tsx), next to <QuotaDialog />.
 */
export function TopupDialog() {
  const { t } = useTranslation();
  const { open } = useTopupDialogState();

  return (
    <Dialog open={open} onOpenChange={(next) => !next && hideTopupDialog()}>
      <DialogContent className="sm:max-w-sm" data-testid="dialog-topup">
        <DialogHeader>
          <DialogTitle data-testid="text-topup-dialog-title">{t.topup.title}</DialogTitle>
        </DialogHeader>
        <TopupFlow onSubmitted={hideTopupDialog} />
      </DialogContent>
    </Dialog>
  );
}
