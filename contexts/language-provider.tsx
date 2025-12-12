"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import type { Language } from "@/lib/i18n/translations"
import { translations } from "@/lib/i18n/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.en
  mounted: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with "en" to match server-side rendering
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  // Load saved language from localStorage only on client after mount
  useEffect(() => {
    // Use a small delay to ensure hydration is complete
    // This prevents hydration mismatch errors
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const savedLang = localStorage.getItem("language") as Language
        if (savedLang && translations[savedLang] && savedLang !== "en") {
          // Only update if it's different from "en" to avoid unnecessary re-render
          setLanguageState(savedLang)
          // Update HTML attributes immediately
          document.documentElement.lang = savedLang
          if (savedLang === "ar" || savedLang === "ur") {
            document.documentElement.dir = "rtl"
          } else {
            document.documentElement.dir = "ltr"
          }
        } else {
          // Even if no saved language, update HTML attributes
          document.documentElement.lang = "en"
          document.documentElement.dir = "ltr"
        }
        // Set mounted after language is loaded
        setMounted(true)
      }
    }, 100) // Small delay to ensure hydration completes
    
    return () => clearTimeout(timer)
  }, [])

  // Update HTML attributes when language changes (after mount)
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = language
      // For RTL languages
      if (language === "ar" || language === "ur") {
        document.documentElement.dir = "rtl"
      } else {
        document.documentElement.dir = "ltr"
      }
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }

  // Memoize translations to ensure new reference on language change
  // Always use "en" until mounted to prevent hydration mismatch
  const t = useMemo(() => translations[mounted ? language : "en"], [language, mounted])

  return (
    <LanguageContext.Provider value={{ language: mounted ? language : "en", setLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
