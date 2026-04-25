import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { en } from "@/locales/en";
import { id } from "@/locales/id";
import type { Translations } from "@/locales/en";

export type Language = "en" | "id";

const translations: Record<Language, Translations> = { en, id };

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem("app_lang");
      if (stored === "en" || stored === "id") return stored;
    } catch {}
    return "en";
  });

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem("app_lang", l);
    } catch {}
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
