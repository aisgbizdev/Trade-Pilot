// Global "quota exceeded" dialog trigger — same hand-rolled module-level
// pub/sub pattern as use-toast.ts, so it can be called from anywhere,
// including a plain hook like use-refresh-analysis.ts that isn't itself a
// rendered component. A single <QuotaDialog /> (mounted once in App.tsx,
// next to <Toaster />) subscribes and renders whatever's currently set.

import { useEffect, useState } from "react";

export type QuotaScope = "hour" | "day" | "concurrent";

export interface QuotaDialogInfo {
  scope: QuotaScope;
  limit?: number;
  used?: number;
}

interface State {
  open: boolean;
  info: QuotaDialogInfo | null;
}

let memoryState: State = { open: false, info: null };
const listeners: Array<(state: State) => void> = [];

function emit(state: State) {
  memoryState = state;
  listeners.forEach((listener) => listener(memoryState));
}

export function showQuotaDialog(info: QuotaDialogInfo): void {
  emit({ open: true, info });
}

export function hideQuotaDialog(): void {
  emit({ ...memoryState, open: false });
}

export function useQuotaDialogState(): State {
  const [state, setState] = useState<State>(memoryState);
  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);
  return state;
}
