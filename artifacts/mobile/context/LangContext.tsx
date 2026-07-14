import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import en, { type Locale } from "@/locales/en";
import id from "@/locales/id";

const LANG_KEY = "@trade_pilot_lang";

type Lang = "en" | "id";

interface LangContextValue {
  lang: Lang;
  t: Locale;
  setLang: (lang: Lang) => Promise<void>;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  t: en,
  setLang: async () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((stored) => {
      if (stored === "en" || stored === "id") setLangState(stored);
    });
  }, []);

  async function setLang(newLang: Lang) {
    await AsyncStorage.setItem(LANG_KEY, newLang);
    setLangState(newLang);
  }

  const t = lang === "id" ? id : en;

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
