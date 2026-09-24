import { useState } from "react";
import { Coins, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUpdateUserCredits,
  getGetAllUsersQueryKey,
  type UserWithStats,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

// Direct admin correction of a user's purchased-credit balance. Sets the
// balance to an exact target rather than adding to it (see
// PATCH /superadmin/users/:id/credits) — for fixing a support case where
// the credit count is wrong, distinct from POST /admin/topups/manual which
// always ADDS credits and records a synthetic top-up for the payment audit
// trail. Used both in admin.tsx's compact RecentSignupsPanel and the full
// admin-users.tsx User Management page, mirroring UserQuotaEditor.
export function CreditBalanceEditor({ user }: { user: UserWithStats }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateCredits = useUpdateUserCredits();

  const [editing, setEditing] = useState(false);
  const [balance, setBalance] = useState(String(user.creditBalance ?? 0));

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
  };

  const save = async () => {
    const target = Number(balance);
    if (!Number.isFinite(target) || target < 0) {
      toast({ title: t.admin.user_credit_invalid, variant: "destructive" });
      return;
    }
    try {
      await updateCredits.mutateAsync({
        id: user.id,
        data: { balance: Math.floor(target) },
      });
      invalidate();
      setEditing(false);
      toast({ title: t.admin.user_credit_saved });
    } catch {
      toast({ title: t.admin.user_credit_save_failed, variant: "destructive" });
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2" data-testid={`credit-editor-${user.id}`}>
        <Coins className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="text-[11px] text-muted-foreground">
          {t.admin.users_credit_balance_label}: {user.creditBalance ?? 0}
        </span>
        <button
          type="button"
          onClick={() => {
            setBalance(String(user.creditBalance ?? 0));
            setEditing(true);
          }}
          className="text-[11px] text-primary hover:underline"
          data-testid={`button-edit-credit-${user.id}`}
        >
          {t.admin.user_credit_edit}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap" data-testid={`credit-editor-${user.id}`}>
      <Input
        type="number"
        min={0}
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        placeholder={t.admin.users_credit_balance_label}
        className="h-7 w-20 text-xs px-2"
        data-testid={`input-credit-${user.id}`}
      />
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs"
        onClick={save}
        disabled={updateCredits.isPending}
        data-testid={`button-save-credit-${user.id}`}
      >
        {updateCredits.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : t.admin.user_credit_save}
      </Button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-[11px] text-muted-foreground hover:text-foreground"
        data-testid={`button-cancel-credit-${user.id}`}
      >
        {t.admin.user_credit_cancel}
      </button>
    </div>
  );
}
