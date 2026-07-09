import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../lib/translations";

export type Language = "de" | "fr" | "it" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("de");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Safe client-side execution
    const savedLang = localStorage.getItem("bluex_pref_lang") as Language;
    if (savedLang && ["de", "fr", "it", "en"].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0] as Language;
      if (["de", "fr", "it", "en"].includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("bluex_pref_lang", lang);
      document.documentElement.lang = lang;
    }
  };

  // Helper to retrieve nested keys like 'hero.title'
  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations[language] || translations["de"];

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to German translations if key missing in current language
        let fallback: any = translations["de"];
        for (const fbKey of keys) {
          if (fallback && typeof fallback === "object" && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return key; // return key if not found in fallback either
          }
        }
        return typeof fallback === "string" ? fallback : key;
      }
    }

    return typeof current === "string" ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
