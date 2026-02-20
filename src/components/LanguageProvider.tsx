"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Language } from "@/lib/translations";

/* ── Context ── */
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => {},
    toggleLanguage: () => {},
});

/* ── Provider ── */
export default function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("plus-language") as Language | null;
            if (stored === "en" || stored === "id") return stored;
        }
        return "en";
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("plus-language", lang);
    };

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "id" : "en");
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

/* ── Hooks ── */
export function useLanguage() {
    return useContext(LanguageContext);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTranslation(): any {
    const { language } = useLanguage();
    return translations[language];
}
