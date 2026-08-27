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
  if (!ctx) {
    return { canInstall: false, prompt: async () => null };
  }
  return ctx;
}
