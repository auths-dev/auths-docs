'use client'

import { createContext, useContext, useEffect, useState } from 'react'

/**
 * The shared code-tab language: pick a language once and every code-tabs
 * block on the site follows. Hydrated from `?lang=` (deep link) then
 * localStorage; SSR renders each block's first tab so there is no flash.
 */

const STORAGE_KEY = 'auths.docs.lang'

interface LanguageContextValue {
  lang: string | null
  setLang: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: null,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string | null>(null)

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    const fromStorage = window.localStorage.getItem(STORAGE_KEY)
    const initial = fromUrl ?? fromStorage
    if (initial) setLangState(initial)
  }, [])

  const setLang = (next: string) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode: the choice still applies for this visit.
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext)
}
