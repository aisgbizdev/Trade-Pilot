import { useState } from "react";
import { Gauge, Loader2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUpdateUserQuota,
  getGetAllUsersQueryKey,
  type UserWithStats,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

// Per-user analysis-quota override. Used both in admin.tsx's compact
// RecentSignupsPanel and in the full admin-users.tsx User Management
// page — both already render a searchable/paginated user list, so this
// is just the inline editor for one row, no separate picker needed. Null
// on both fields means the user is on the global default (set via
// admin.tsx's QuotaSettingsPanel); setting either field overrides just
// this user, independent of the global value.
export function UserQuotaEditor({ user }: { user: UserWithStats }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateQuota = useUpdateUserQuota();

  const hasOverride = user.customQuotaPerHour != null || user.customQuotaPerDay != null;
  const [editing, setEditing] = useState(false);
  const [hourly, setHourly] = useState(String(user.customQuotaPerHour ?? ""));
  const [daily, setDaily] = useState(String(user.customQuotaPerDay ?? ""));

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
  };

  const save = async () => {
    const perHour = Number(hourly);
    const perDay = Number(daily);
    if (!Number.isFinite(perHour) || perHour <= 0 || !Number.isFinite(perDay) || perDay <= 0) {
      toast({ title: t.admin.user_quota_invalid, variant: "destructive" });
      return;
    }
    try {
      await updateQuota.mutateAsync({
        id: user.id,
        data: { customQuotaPerHour: Math.floor(perHour), customQuotaPerDay: Math.floor(perDay) },
      });
      invalidate();
      setEditing(false);
      toast({ title: t.admin.user_quota_saved });
    } catch {
      toast({ title: t.admin.user_quota_save_failed, variant: "destructive" });
    }
  };

  const reset = async () => {
    try {
      await updateQuota.mutateAsync({
        id: user.id,
        data: { customQuotaPerHour: null, customQuotaPerDay: null },
      });
      invalidate();
      setEditing(false);
      toast({ title: t.admin.user_quota_reset });
    } catch {
      toast({ title: t.admin.user_quota_save_failed, variant: "destructive" });
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2" data-testid={`quota-editor-${user.id}`}>
        <Gauge className="w-3 h-3 text-muted-foreground shrink-0" />
        {hasOverride ? (
          <Badge variant="secondary" className="text-[10px]" data-testid={`badge-quota-override-${user.id}`}>
            {user.customQuotaPerHour ?? "—"}/{t.admin.user_quota_hour_short} ·{" "}
            {user.customQuotaPerDay ?? "—"}/{t.admin.user_quota_day_short}
          </Badge>
        ) : (
          <span className="text-[11px] text-muted-foreground">{t.admin.user_quota_default}</span>
        )}
        <button
          type="button"
          onClick={() => {
            setHourly(String(user.customQuotaPerHour ?? ""));
            setDaily(String(user.customQuotaPerDay ?? ""));
            setEditing(true);
          }}
          className="text-[11px] text-primary hover:underline"
          data-testid={`button-edit-quota-${user.id}`}
        >
          {t.admin.user_quota_edit}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap" data-testid={`quota-editor-${user.id}`}>
      <Input
        type="number"
        min={1}
        value={hourly}
        onChange={(e) => setHourly(e.target.value)}
        placeholder={t.admin.user_quota_hour_short}
        className="h-7 w-16 text-xs px-2"
        data-testid={`input-quota-hour-${user.id}`}
      />
      <Input
        type="number"
        min={1}
        value={daily}
        onChange={(e) => setDaily(e.target.value)}
        placeholder={t.admin.user_quota_day_short}
        className="h-7 w-16 text-xs px-2"
        data-testid={`input-quota-day-${user.id}`}
      />
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs"
        onClick={save}
        disabled={updateQuota.isPending}
        data-testid={`button-save-quota-${user.id}`}
      >
        {updateQuota.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : t.admin.user_quota_save}
      </Button>
      {hasOverride && (
        <button
          type="button"
          onClick={reset}
          disabled={updateQuota.isPending}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          data-testid={`button-reset-quota-${user.id}`}
        >
          <RotateCcw className="w-3 h-3" /> {t.admin.user_quota_reset_btn}
        </button>
      )}
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-[11px] text-muted-foreground hover:text-foreground"
        data-testid={`button-cancel-quota-${user.id}`}
      >
        {t.admin.user_quota_cancel}
      </button>
    </div>
  );
}
