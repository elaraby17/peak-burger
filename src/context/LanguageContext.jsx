import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, readStorage, writeStorage } from "../utils/storage";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => readStorage(STORAGE_KEYS.LANGUAGE, "en"));

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    writeStorage(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ar" : "en"));

  // t() pulls the right locale out of a { en, ar } object used across data files.
  const t = (field) => {
    if (field === null || field === undefined) return "";
    if (typeof field === "string") return field;
    return field[lang] ?? field.en ?? "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, dir: lang === "ar" ? "rtl" : "ltr", t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
