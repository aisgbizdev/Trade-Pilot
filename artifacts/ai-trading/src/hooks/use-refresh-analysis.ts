import { useCallback, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  useCreateAnalysis,
  type CreateAnalysisBodyMode,
  type CreateAnalysisBodyTimeframe,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

export interface RefreshableAnalysis {
  id: number;
  instrument: string;
  timeframe: string;
  mode: string;
  userInputContext?: string | null;
  carriedOver?: boolean;
}

export function useRefreshAnalysis() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const createAnalysis = useCreateAnalysis();
  const [refreshingIds, setRefreshingIds] = useState<ReadonlySet<number>>(
    () => new Set()
  );
  const inFlightRef = useRef<Set<number>>(new Set());

  const refresh = useCallback(
    async (analysis: RefreshableAnalysis) => {
      if (inFlightRef.current.has(analysis.id)) return;
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
        const suffix =
          trimmedNotes && analysis.carriedOver ? "?carried_over=1" : "";
        setLocation(`/analyses/${result.id}${suffix}`);
      } catch (err: unknown) {
        const apiErr = err as { data?: { error?: string } };
        toast({
          title: t.analysis_detail.refresh_failed,
          description: apiErr?.data?.error ?? t.analyze.failed_desc,
          variant: "destructive",
        });
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
    [createAnalysis, setLocation, toast, t]
  );

  const isRefreshing = useCallback(
    (id: number) => refreshingIds.has(id),
    [refreshingIds]
  );

  return { refresh, isRefreshing };
}
