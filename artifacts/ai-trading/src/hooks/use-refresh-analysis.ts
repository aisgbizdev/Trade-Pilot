import { useCallback, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  useCreateAnalysis,
  type CreateAnalysisBodyMode,
  type CreateAnalysisBodyTimeframe,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { useTrackEvent } from "@/hooks/use-track-event";
import { showQuotaDialog, type QuotaScope } from "@/hooks/use-quota-dialog";

export interface RefreshableAnalysis {
  id: number;
  instrument: string;
  timeframe: string;
  mode: string;
  userInputContext?: string | null;
  carriedOver?: boolean;
}

export function useRefreshAnalysis(options?: {
  /**
   * Called with the newly-created analysis id instead of navigating to
   * /analyses/:id — for callers that render this analysis inline (e.g.
   * embedded on the Analyze page) and want to stay on the same URL.
   */
  onRefreshed?: (id: number) => void;
}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const createAnalysis = useCreateAnalysis();
  const trackEvent = useTrackEvent();
  const [refreshingIds, setRefreshingIds] = useState<ReadonlySet<number>>(
    () => new Set()
  );
  const inFlightRef = useRef<Set<number>>(new Set());

  const refresh = useCallback(
    async (analysis: RefreshableAnalysis) => {
      if (inFlightRef.current.has(analysis.id)) return false;
      inFlightRef.current.add(analysis.id);
      setRefreshingIds((prev) => {
        const next = new Set(prev);
        next.add(analysis.id);
        return next;
      });
      try {
        const trimmedNotes = analysis.userInputContext?.trim() ?? "";
        const result = await createAnalysis.mutateAsync({
          data: {
            instrument: analysis.instrument,
            timeframe: analysis.timeframe as CreateAnalysisBodyTimeframe,
            mode: analysis.mode as CreateAnalysisBodyMode,
            userInputContext: trimmedNotes ? trimmedNotes : undefined,
          },
        });
        trackEvent("analysis_created", {
          instrument: analysis.instrument,
          timeframe: analysis.timeframe,
        });
        if (options?.onRefreshed) {
          options.onRefreshed(result.id);
        } else {
          const suffix =
            trimmedNotes && analysis.carriedOver ? "?carried_over=1" : "";
          setLocation(`/analyses/${result.id}${suffix}`);
        }
        return true;
      } catch (err: unknown) {
        const apiErr = err as {
          status?: number;
          data?: { error?: string; quota?: { scope: QuotaScope; limit?: number; used?: number } };
        };
        if (apiErr?.status === 429 && apiErr.data?.quota) {
          showQuotaDialog(apiErr.data.quota);
        } else {
          toast({
            title: t.analysis_detail.refresh_failed,
            description: apiErr?.data?.error ?? t.analyze.failed_desc,
            variant: "destructive",
          });
        }
        return false;
      } finally {
        inFlightRef.current.delete(analysis.id);
        setRefreshingIds((prev) => {
          if (!prev.has(analysis.id)) return prev;
          const next = new Set(prev);
          next.delete(analysis.id);
          return next;
        });
      }
    },
    [createAnalysis, setLocation, toast, t, trackEvent, options?.onRefreshed]
  );

  const isRefreshing = useCallback(
    (id: number) => refreshingIds.has(id),
    [refreshingIds]
  );

  return { refresh, isRefreshing };
}
