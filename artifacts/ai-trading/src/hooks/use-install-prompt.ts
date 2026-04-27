import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Shared `beforeinstallprompt` capture for Chromium-based browsers
 * (Android Chrome, desktop Chrome/Edge). The browser fires the event
 * exactly once when the PWA becomes installable; whoever captures it
 * gets to call `prompt()` later on a real user gesture.
 *
 * Because there is only one event per page-load, we capture it at the
 * app root (`InstallPromptProvider` mounted in `main.tsx` / `App.tsx`)
 * and share the deferred prompt via context so any screen — the
 * dashboard's enable-push card, the Notifications page, etc. — can
 * surface a single coherent "Install Trade Pilot" button without
 * racing each other for the same event.
 *
 * iOS Safari does NOT fire `beforeinstallprompt` — it has its own
 * "Share → Add to Home Screen" flow surfaced separately by
 * `useStandalone`.
 *
 * The install hint is auto-cleared once the user accepts the prompt
 * or the OS reports `appinstalled`, so every consuming UI hides
 * itself the moment install completes.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

interface InstallPromptValue {
  canInstall: boolean;
  prompt: () => Promise<"accepted" | "dismissed" | null>;
}

const InstallPromptContext = createContext<InstallPromptValue | null>(null);

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      // Chromium expects us to call preventDefault() so it does not
      // show the mini-infobar; we will surface our own button instead.
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

  const value = useMemo<InstallPromptValue>(
    () => ({ canInstall: deferred !== null, prompt }),
    [deferred, prompt],
  );

  return createElement(InstallPromptContext.Provider, { value }, children);
}

export function useInstallPrompt(): InstallPromptValue {
  const ctx = useContext(InstallPromptContext);
  // Falling back to a no-op shape (instead of throwing) keeps tests
  // and isolated component renders working even when the provider has
  // not been mounted — the consuming UI simply hides its install
  // button (`canInstall === false`).
  if (!ctx) {
    return { canInstall: false, prompt: async () => null };
  }
  return ctx;
}
