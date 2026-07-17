'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

/**
 * Light/dark toggle. The root layout's inline script applies the stored (or
 * system) theme before hydration, so there is no flash.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    try {
      window.localStorage.setItem('auths.docs.theme', next ? 'dark' : 'light')
    } catch {
      // Private mode: applies for this visit only.
    }
    setDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-seal"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
