
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Language = "en" | "id";

const STORAGE_KEY = "ar4n-language";

const messages = {
    en: {
        home: "Home",
        about: "About",
        portfolio: "Portfolio",
        products: "Our Products",
        design: "Design",
        buildings: "Buildings",
        pbgSlf: "PBG & SLF",
        openMenu: "Open navigation",
        closeMenu: "Close navigation",
        navigation: "Main navigation",
        language: "Select language",
    },
    id: {
        home: "Beranda",
        about: "Tentang Kami",
        portfolio: "Portofolio",
        products: "Layanan Kami",
        design: "Desain",
        buildings: "Konstruksi",
        pbgSlf: "PBG & SLF",
        openMenu: "Buka navigasi",
        closeMenu: "Tutup navigasi",
        navigation: "Navigasi utama",
        language: "Pilih bahasa",
    },
} as const;

export type TranslationKey = keyof typeof messages.en;

interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext =
    createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === "en" || saved === "id") {
            return saved;
        }
    } catch {
        // Gunakan bahasa default jika storage tidak tersedia.
    }

    return "id";
}

export function LanguageProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [language, setLanguage] =
        useState<Language>(getInitialLanguage);

    useEffect(() => {
        document.documentElement.lang = language;

        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch {
            // Bahasa tetap berfungsi selama sesi aktif.
        }
    }, [language]);

    const value = useMemo<LanguageContextValue>(
        () => ({
            language,
            setLanguage,
            t: (key) => messages[language][key],
        }),
        [language]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage harus digunakan di dalam LanguageProvider."
        );
    }

    return context;
}
