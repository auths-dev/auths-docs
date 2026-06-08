'use client'

import { usePathname } from 'next/navigation'
import { docsNavigation } from '@/lib/docs-navigation'

export function DocsTopBar() {
  const pathname = usePathname()

  // Find the current section
  let currentSection = ''
  for (const section of docsNavigation) {
    for (const item of section.items) {
      if (item.href === pathname) {
        currentSection = section.title
        break
      }
      if (item.items?.some((i) => i.href === pathname)) {
        currentSection = section.title
        break
      }
    }
    if (currentSection) break
  }

  return (
    <nav className="border-b border-gray-200 sticky top-0 z-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
        <a href="/docs" className="flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-700">
          ← Auths
        </a>

        {currentSection && (
          <div className="flex-1 text-center text-sm text-gray-600 hidden sm:block">
            {currentSection}
          </div>
        )}

        <a
          href="https://github.com/anthropics/auths"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </nav>
  )
}
