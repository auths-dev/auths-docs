'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import type { NavSection, ProductNav } from '@/lib/content'

/**
 * Frontmatter-derived nav with the product switch on top: auths-mcp and
 * Identity & signing are separate worlds that never intermix. The switch
 * navigates to each product's landing page; the shown product follows the URL.
 *
 * Sections come in two shapes: flat (always open) and collapsible — one row
 * with a chevron for large topics, auto-expanded while the reader is inside.
 */

function productForPath(nav: ProductNav[], pathname: string): ProductNav['product'] {
  for (const p of nav) {
    if (p.sections.some((s) => s.items.some((i) => i.href === pathname))) return p.product
  }
  return 'mcp'
}

/** A product's first navigable page — where its switch tab points. */
function landingHref(p: ProductNav): string {
  for (const section of p.sections) {
    const first = section.items.find((i) => i.badge !== 'soon')
    if (first) return first.href
  }
  return '#'
}

function SectionItems({ section, pathname }: { section: NavSection; pathname: string }) {
  return (
    <ul className="space-y-0.5">
      {section.items.map((item) => {
        const isActive = pathname === item.href
        if (item.badge === 'soon') {
          return (
            <li key={item.href}>
              <div className="flex cursor-default items-center justify-between px-3 py-1.5 text-sm text-ink-faint/70">
                <span>{item.label}</span>
                <span className="rounded-sm border border-rule px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                  soon
                </span>
              </div>
            </li>
          )
        }
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center justify-between border-l-2 px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'border-seal font-semibold text-ink'
                  : 'border-transparent text-ink-soft hover:border-rule hover:text-ink'
              }`}
            >
              <span>{item.label}</span>
              {item.badge === 'new' ? (
                <span className="rounded-sm bg-seal/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-seal">
                  new
                </span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** A large topic folded to one row; opens on click and while a child is active. */
function CollapsibleSection({ section, pathname }: { section: NavSection; pathname: string }) {
  const containsActive = section.items.some((i) => i.href === pathname)
  const [open, setOpen] = useState(containsActive)
  useEffect(() => {
    if (containsActive) setOpen(true)
  }, [containsActive])

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mb-3 flex w-full items-center justify-between px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-faint transition-colors hover:text-ink"
      >
        <span>{section.title}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open ? <SectionItems section={section} pathname={pathname} /> : null}
    </div>
  )
}

export function DocsSidebar({ nav }: { nav: ProductNav[] }) {
  const pathname = usePathname()
  const currentProduct = productForPath(nav, pathname)
  const active = nav.find((p) => p.product === currentProduct) ?? nav[0]

  return (
    <nav className="space-y-8">
      <div aria-label="Product" className="flex rounded-lg border border-rule bg-paper p-1">
        {nav.map((p) => {
          const selected = p.product === currentProduct
          return (
            <Link
              key={p.product}
              href={landingHref(p)}
              aria-current={selected ? 'page' : undefined}
              className={`flex-1 rounded-md px-2 py-1.5 text-center font-mono text-[12px] transition-colors ${
                selected
                  ? 'bg-paper-deep font-semibold text-ink'
                  : 'text-ink-faint hover:text-ink'
              }`}
            >
              {p.label}
            </Link>
          )
        })}
      </div>

      {active.sections.map((section) =>
        section.collapsible ? (
          <CollapsibleSection key={section.title} section={section} pathname={pathname} />
        ) : (
          <div key={section.title}>
            <h3 className="mb-3 px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-faint">
              {section.title}
            </h3>
            <SectionItems section={section} pathname={pathname} />
          </div>
        )
      )}
    </nav>
  )
}
