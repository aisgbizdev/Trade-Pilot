import {
  getGetProgressionCatalogQueryKey,
  getGetProgressionHistoryQueryKey,
  getGetProgressionSummaryQueryKey,
} from "@workspace/api-client-react";
import type { QueryClient } from "@tanstack/react-query";

export function refreshProgression(queryClient: QueryClient) {
  void Promise.all([
    queryClient.invalidateQueries({ queryKey: getGetProgressionSummaryQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetProgressionCatalogQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetProgressionHistoryQueryKey() }),
  ]);
}