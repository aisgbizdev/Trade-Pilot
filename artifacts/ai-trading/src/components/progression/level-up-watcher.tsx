import { useEffect, useRef, useState } from "react";
import {
  getGetProgressionSummaryQueryKey,
  useGetProgressionSummary,
} from "@workspace/api-client-react";
import { useAuth } from "@/components/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProgressionEmblem } from "@/components/progression/progression-emblem";
import { useTranslation } from "@/lib/i18n";
import { observeProgressionLevel } from "@/lib/progression-level-observation";

const STORAGE_KEY_PREFIX = "tp_web_progression_level_ack";

function readAcknowledgedLevel(accountId: string): number | null {
  try {
    const value = localStorage.getItem(`${STORAGE_KEY_PREFIX}.${accountId}`);
    if (value === null) return null;
    const level = Number(value);
    return Number.isInteger(level) && level >= 1 ? level : null;
  } catch {
    return null;
  }
}

function writeAcknowledgedLevel(accountId: string, level: number) {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}.${accountId}`, String(level));
  } catch {
    // The in-memory baseline still prevents duplicate celebrations this session.
  }
}

/**
 * App-level watcher shares the existing progression summary query with pages.
 * The web-specific storage key keeps this celebration independent of mobile.
 */
export function ProgressionLevelUpWatcher() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const accountId = user?.id ? String(user.id) : null;
  const { data: summary, isFetchedAfterMount } = useGetProgressionSummary({
    query: {
      queryKey: getGetProgressionSummaryQueryKey(),
      enabled: Boolean(accountId),
      staleTime: 0,
      refetchOnMount: "always",
    },
  });
  const [celebrationLevel, setCelebrationLevel] = useState<number | null>(null);
  const observed = useRef<{
    accountId: string | null;
    previousLevel: number | null;
    previousTotalXp: number | null;
    highestAcknowledgedLevel: number;
  }>({ accountId: null, previousLevel: null, previousTotalXp: null, highestAcknowledgedLevel: 0 });

  useEffect(() => {
    if (!accountId) {
      observed.current = { accountId: null, previousLevel: null, previousTotalXp: null, highestAcknowledgedLevel: 0 };
      setCelebrationLevel(null);
      return;
    }
    if (!summary || !isFetchedAfterMount) return;

    if (observed.current.accountId !== accountId) {
      // Establish a fresh-session baseline so reloads, historical levels, and
      // level recalculations after a rules migration never replay a modal.
      const acknowledged = Math.max(
        summary.level,
        readAcknowledgedLevel(accountId) ?? 0,
      );
      writeAcknowledgedLevel(accountId, acknowledged);
      observed.current = {
        accountId,
        previousLevel: summary.level,
        previousTotalXp: summary.totalXp,
        highestAcknowledgedLevel: acknowledged,
      };
      setCelebrationLevel(null);
      return;
    }

    const result = observeProgressionLevel({
      currentLevel: summary.level,
      previousLevel: observed.current.previousLevel,
      currentTotalXp: summary.totalXp,
      previousTotalXp: observed.current.previousTotalXp,
      highestAcknowledgedLevel: observed.current.highestAcknowledgedLevel,
    });
    observed.current.previousLevel = summary.level;
    observed.current.previousTotalXp = summary.totalXp;
    if (result.highestAcknowledgedLevel > observed.current.highestAcknowledgedLevel) {
      // Persist before opening the dialog, so refreshes and other web tabs do
      // not replay a level-up that has already been presented.
      writeAcknowledgedLevel(accountId, result.highestAcknowledgedLevel);
      observed.current.highestAcknowledgedLevel = result.highestAcknowledgedLevel;
    }
    if (result.celebrateLevel !== null) setCelebrationLevel(result.celebrateLevel);
  }, [accountId, isFetchedAfterMount, summary?.level, summary?.totalXp]);

  return (
    <Dialog
      open={celebrationLevel !== null}
      onOpenChange={(open) => {
        if (!open) setCelebrationLevel(null);
      }}
    >
      <DialogContent
        className="max-w-sm text-center"
        closeLabel={t.progression.level_up_close_label}
        data-testid="dialog-progression-level-up"
      >
        {celebrationLevel !== null && (
          <>
            <div className="flex justify-center pt-2">
              <ProgressionEmblem
                level={celebrationLevel}
                masteryLevel={0}
                className="h-28 w-28"
              />
            </div>
            <DialogTitle className="text-xl font-black text-foreground">
              {t.progression.level_up_title.replace("{n}", String(celebrationLevel))}
            </DialogTitle>
            <DialogDescription>{t.progression.level_up_description}</DialogDescription>
            <button
              type="button"
              onClick={() => setCelebrationLevel(null)}
              className="mx-auto rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t.progression.level_up_close}
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}