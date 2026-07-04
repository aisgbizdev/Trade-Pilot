import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "tp_embed";

/** Returns true if embed mode should be active for this session. */
function detectEmbed(): boolean {
  // ENV var — supports both VITE_EMBED_MODE (Vite convention) and EMBED_MODE (plain).
  const env = import.meta.env as Record<string, string | undefined>;
  if (env["VITE_EMBED_MODE"] === "true" || env["EMBED_MODE"] === "true") return true;
  // sessionStorage — keeps embed mode active within the same browser tab
  if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
  // URL param — the canonical entry point (?embed=1)
  return new URLSearchParams(window.location.search).get("embed") === "1";
}

const EmbedContext = createContext(false);

export function EmbedProvider({ children }: { children: React.ReactNode }) {
  // Lazy initial state so the correct value is available on the very first render —
  // avoids a flash of the marketing landing page before the effect runs.
  const [embed] = useState(() => {
    const active = detectEmbed();
    if (active) sessionStorage.setItem(STORAGE_KEY, "1");
    return active;
  });

  return <EmbedContext.Provider value={embed}>{children}</EmbedContext.Provider>;
}

/** Returns true when TP is running in embed mode (e.g. inside a broker iframe). */
export function useEmbedMode(): boolean {
  return useContext(EmbedContext);
}
