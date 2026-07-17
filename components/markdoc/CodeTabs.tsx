'use client'

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useLanguage } from './language-context'

/**
 * Synchronized multi-language code tabs. Every `CodeTabs` on the site
 * subscribes to the shared language context: switching one switches all,
 * the choice persists (localStorage) and deep-links (`?lang=`).
 *
 * SSR renders the first tab; if a block lacks the chosen language it falls
 * back to its first tab with a quiet note instead of breaking the set.
 */

interface CodeTabProps {
  lang: string
  label?: string
  children: ReactNode
}

export function CodeTab({ children }: CodeTabProps) {
  return <>{children}</>
}

export function CodeTabs({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLanguage()
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  const tabs = Children.toArray(children).filter(
    (c): c is ReactElement<CodeTabProps> => isValidElement(c) && 'lang' in ((c.props as object) ?? {})
  )
  if (tabs.length === 0) return null

  const langs = tabs.map((t) => t.props.lang)
  // Until hydration, and whenever the chosen language is absent, show the
  // block's own first tab.
  const chosen = hydrated && lang && langs.includes(lang) ? lang : langs[0]
  const activeIndex = langs.indexOf(chosen)
  const fellBack = hydrated && lang !== null && !langs.includes(lang)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const delta = e.key === 'ArrowRight' ? 1 : -1
    const next = (activeIndex + delta + tabs.length) % tabs.length
    setLang(langs[next])
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="not-prose my-6">
      <div
        role="tablist"
        aria-label="Code language"
        onKeyDown={onKeyDown}
        className="flex items-center gap-1 border-b border-rule"
      >
        {tabs.map((tab, i) => {
          const active = i === activeIndex
          return (
            <button
              key={tab.props.lang}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${i}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setLang(tab.props.lang)}
              className={`-mb-px rounded-t-sm border-b-2 px-3 py-1.5 font-mono text-[13px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-seal ${
                active
                  ? 'border-seal text-ink'
                  : 'border-transparent text-ink-faint hover:text-ink'
              }`}
            >
              {tab.props.label ?? tab.props.lang}
            </button>
          )
        })}
        {fellBack ? (
          <span className="ml-auto pb-1 font-mono text-[11px] text-ink-faint">
            not available in {lang} — showing {tabs[activeIndex].props.label ?? chosen}
          </span>
        ) : null}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.props.lang}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== activeIndex}
          className="[&_.not-prose]:my-0 [&_.not-prose]:rounded-t-none"
        >
          {tab}
        </div>
      ))}
    </div>
  )
}
