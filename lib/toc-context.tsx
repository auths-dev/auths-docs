'use client'

import React, { createContext, useContext, useState } from 'react'

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

interface TocContextType {
  toc: TocItem[]
  setToc: (toc: TocItem[]) => void
}

const TocContext = createContext<TocContextType | undefined>(undefined)

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [toc, setToc] = useState<TocItem[]>([])

  return (
    <TocContext.Provider value={{ toc, setToc }}>
      {children}
    </TocContext.Provider>
  )
}

export function useToc() {
  const context = useContext(TocContext)
  if (!context) {
    throw new Error('useToc must be used within TocProvider')
  }
  return context
}

/**
 * Tiny client component that sets the TOC when the page mounts.
 * Called by Server Components that have extracted the TOC from Markdoc.
 */
export function TocSetter({ toc }: { toc: TocItem[] }) {
  const { setToc } = useToc()
  React.useEffect(() => {
    setToc(toc)
  }, [toc, setToc])
  return null
}
