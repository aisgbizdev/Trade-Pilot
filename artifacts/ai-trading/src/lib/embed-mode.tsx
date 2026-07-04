import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "tp_embed";

/** Returns true if embed mode should be active for this session. */
function detectEmbed(): boolean {
  // ENV var — for dedicated embed-only deployments
  const envMode = (import.meta.env as Record<string, string | undefined>)["VITE_EMBED_MODE"];
  if (envMode === "true") return true;
  // sessionStorage — keeps embed mode active within the same browser tab
  if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
  // URL param — the canonical entry point (?embed=1)
  return new URLSearchParams(window.location.search).get("embed") === "1";
}

const EmbedContext = createContext(false);

export function EmbedProvider({ children }: { children: React.ReactNode }) {
  const [embed, setEmbed] = useState(false);

  useEffect(() => {
    const active = detectEmbed();
    if (active) sessionStorage.setItem(STORAGE_KEY, "1");
    setEmbed(active);
  }, []);

  return <EmbedContext.Provider value={embed}>{children}</EmbedContext.Provider>;
}

/** Returns true when TP is running in embed mode (e.g. inside a broker iframe). */
export function useEmbedMode(): boolean {
  return useContext(EmbedContext);
}
