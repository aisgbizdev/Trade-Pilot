import { useEffect, useState } from "react";

// Opt-in pre-trade mental checklist preference. Stored client-side
// only — no server round-trip needed because the toggle has no impact
// on AI output or other devices' UX. If the user reinstalls the PWA
// they fall back to "off", which matches the "opt-in" requirement.
const STORAGE_KEY = "tradepilot.mentalChecklist.enabled";

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function useMentalChecklistPref(): {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
} {
  const [enabled, setEnabledState] = useState<boolean>(() => readStored());

  // Keep tabs in sync if the user toggles in Profile while Analyze is
  // open in another tab.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setEnabledState(readStored());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setEnabled = (v: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch {
      // Storage quota or private-mode — silently ignore; in-memory
      // state below still updates so the toggle responds.
    }
    setEnabledState(v);
  };

  return { enabled, setEnabled };
}
