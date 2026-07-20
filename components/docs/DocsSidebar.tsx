'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ProductNav } from '@/lib/content'
import { NavSection } from './NavSection'

/**
 * Frontmatter-derived nav with the area switch on top. Areas are separate
 * worlds that never intermix; the switch navigates to each area's landing page
 * and the shown area follows the URL.
 *
 * Every section renders through the one shared {@link NavSection} disclosure —
 * same caret, same behaviour, in every area.
 */

function productForPath(nav: ProductNav[], pathname: string): ProductNav['product'] {
  for (const p of nav) {
    if (p.sections.some((s) => s.items.some((i) => i.href === pathname))) return p.product
  }
  return 'mcp'
}

/** An area's first navigable page — where its switch tab points. */
function landingHref(p: ProductNav): string {
  for (const section of p.sections) {
    const first = section.items.find((i) => i.badge !== 'soon')
    if (first) return first.href
  }
  return '#'
}

export function DocsSidebar({ nav }: { nav: ProductNav[] }) {
  const pathname = usePathname()
  const currentProduct = productForPath(nav, pathname)
  const active = nav.find((p) => p.product === currentProduct) ?? nav[0]

  return (
    <nav className="space-y-6">
      <div aria-label="Area" className="flex flex-col gap-1 rounded-lg border border-rule bg-paper p-1">
        {nav.map((p) => {
          const selected = p.product === currentProduct
          return (
            <Link
              key={p.product}
              href={landingHref(p)}
              aria-current={selected ? 'page' : undefined}
              className={`rounded-md px-2 py-1.5 text-center font-mono text-[12px] transition-colors ${
                selected ? 'bg-paper-deep font-semibold text-ink' : 'text-ink-faint hover:text-ink'
              }`}
            >
              {p.label}
            </Link>
          )
        })}
      </div>

      <div className="space-y-2">
        {active.sections.map((section) => (
          <NavSection key={section.title} section={section} pathname={pathname} />
        ))}
      </div>
    </nav>
  )
}
