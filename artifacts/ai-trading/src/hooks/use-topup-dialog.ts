// Global "top up" popup trigger — same hand-rolled module-level pub/sub
// pattern as use-quota-dialog.ts / use-toast.ts, so it can be opened from
// anywhere (e.g. the quota-exceeded dialog's CTA) without navigating the
// user away from whatever page they were on. A single <TopupDialog />
// (mounted once in App.tsx) subscribes and renders it.

import { useEffect, useState } from "react";

interface State {
  open: boolean;
}

let memoryState: State = { open: false };
const listeners: Array<(state: State) => void> = [];

function emit(state: State) {
  memoryState = state;
  listeners.forEach((listener) => listener(memoryState));
}

export function showTopupDialog(): void {
  emit({ open: true });
}

export function hideTopupDialog(): void {
  emit({ open: false });
}

export function useTopupDialogState(): State {
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
