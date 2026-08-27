import { CheckCircle2, XCircle, AlertCircle, Hourglass, Clock4 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export type OutcomeStatus =
  | "pending"
  | "tp1_hit"
  | "tp2_hit"
  | "sl_hit"
  | "expired"
  | "invalidated";

interface OutcomeBadgeProps {
  status: OutcomeStatus | null | undefined;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

/**
 * Visual chip for the after-the-fact resolution of an AI trade plan.
 * Reads its label / colour set from `t.outcomes` so it stays bilingual.
 * Returns null for unknown / missing statuses so it can be safely
 * dropped into row layouts without leaving an empty gap.
 */
export function OutcomeBadge({ status, size = "sm", showIcon = true, className }: OutcomeBadgeProps) {
  const { t } = useTranslation();
  if (!status) return null;

  const styles: Record<
    OutcomeStatus,
    { label: string; color: string; Icon: typeof CheckCircle2 }
  > = {
    pending: {
      label: t.outcomes.pending,
      color: "bg-muted text-muted-foreground",
      Icon: Hourglass,
    },
    tp1_hit: {
      label: t.outcomes.tp1_hit,
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      Icon: CheckCircle2,
    },
    tp2_hit: {
      label: t.outcomes.tp2_hit,
      color: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      Icon: CheckCircle2,
    },
    sl_hit: {
      label: t.outcomes.sl_hit,
      color: "bg-red-500/15 text-red-600 dark:text-red-400",
      Icon: XCircle,
    },
    expired: {
      label: t.outcomes.expired,
      color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      Icon: Clock4,
    },
    invalidated: {
      label: t.outcomes.invalidated,
      color: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
      Icon: AlertCircle,
    },
  };

  const cfg = styles[status];
  const sizeCls =
    size === "sm"
      ? "text-[10px] px-1.5 py-0.5 gap-0.5"
      : "text-xs px-2 py-1 gap-1";
  const iconSize = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-semibold",
        sizeCls,
        cfg.color,
        className,
      )}
      data-testid={`outcome-badge-${status}`}
      title={t.outcomes.tooltip}
    >
      {showIcon && <cfg.Icon className={iconSize} />}
      {cfg.label}
    </span>
  );
}
