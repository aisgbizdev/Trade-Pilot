import { useCallback, useEffect, useState } from "react";

/**
 * Hook for the standard `beforeinstallprompt` flow on Chromium-based
 * browsers (Android Chrome, desktop Chrome/Edge). The browser fires the
 * event when the PWA is installable; we stash it and expose a `prompt()`
 * helper so a UI button can trigger the native install dialog on a real
 * user gesture. iOS Safari does NOT fire this event — it has its own
 * "Share → Add to Home Screen" flow surfaced separately by
 * `useStandalone`.
 *
 * The install hint is auto-cleared once the user accepts the prompt or
 * the app reports `appinstalled`, so the calling UI hides itself the
 * moment the install completes.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      // Chromium expects us to call preventDefault() so it does not show
      // the mini-infobar; we will surface our own button instead.
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const prompt = useCallback(async () => {
    if (!deferred) return null;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    return choice.outcome;
  }, [deferred]);

  return { canInstall: deferred !== null, prompt };
}
