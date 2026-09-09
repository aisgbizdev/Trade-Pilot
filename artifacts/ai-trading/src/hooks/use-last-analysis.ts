import {
  useListAnalyses,
  getListAnalysesQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/components/auth-provider";

const PARAMS = { page: 1, limit: 1 } as const;

/**
 * The id of the user's most recent analysis (or null: none yet / still
 * loading / not signed in).
 *
 * Used to route "back" and the nav "Analisis" tab to the last *already
 * generated* analysis instead of a blank New-Analysis form — reopening a
 * finished analysis costs zero AI tokens, re-running one from a fresh form
 * does not.
 */
export function useLastAnalysisId(): { id: number | null; isLoading: boolean } {
  const { user } = useAuth();
  const { data, isLoading } = useListAnalyses(PARAMS, {
    query: {
      enabled: !!user,
      queryKey: getListAnalysesQueryKey(PARAMS),
      staleTime: 30_000,
    },
  });
  return { id: data?.analyses?.[0]?.id ?? null, isLoading };
}

/**
 * Where the "Analisis" nav tab should point: the analyze page showing the
 * last analysis's result inline (`/analyze?result=<id>` — zero tokens to
 * reopen), or the blank form when the user has never run one. It stays on
 * the Analisis page rather than jumping to the standalone detail view.
 */
export function useLastAnalysisNavPath(): string {
  const { id } = useLastAnalysisId();
  return id != null ? `/analyze?result=${id}` : "/analyze";
}

/**
 * Where a generic "back" should land: the analyze page with the last
 * analysis in view, else the dashboard (never the token-spending blank
 * form).
 */
export function useBackToLastAnalysisPath(): string {
  const { id } = useLastAnalysisId();
  return id != null ? `/analyze?result=${id}` : "/dashboard";
}
