import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

import { storage } from "@/src/utils/storage";
import { LANGS, STRINGS, type Lang } from "./strings";
import type { LocalizedText } from "./content";

const STORAGE_KEY = "nesu.lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  isRTL: boolean;
  t: (key: string) => string;
  tc: (obj: LocalizedText) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem<Lang>(STORAGE_KEY, "en");
      if (saved && (saved === "en" || saved === "fr" || saved === "ar")) {
        setLangState(saved);
      }
    })();
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    storage.setItem(STORAGE_KEY, l);
  }, []);

  const isRTL = lang === "ar";

  // On web, mirror the document direction so the browser flips text/caret too.
  // On native, layout mirroring is handled per-component via isRTL.
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", lang);
    }
  }, [isRTL, lang]);

  const t = useCallback(
    (key: string) => STRINGS[lang][key] ?? STRINGS.en[key] ?? key,
    [lang],
  );

  const tc = useCallback((obj: LocalizedText) => obj[lang] ?? obj.en, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, isRTL, t, tc }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export { LANGS };
export type { Lang };
