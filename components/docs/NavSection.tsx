'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { NavItem, NavSection as NavSectionData } from '@/lib/content'

/**
 * One sidebar sub-category.
 *
 * Two shapes, chosen by content rather than configuration:
 *
 * - **Many pages** → a disclosure row with the caret on the LEFT, open by
 *   default so the nav shows its full structure on arrival. Collapsing is the
 *   reader's opt-in, and navigating into a collapsed section re-opens it.
 * - **Exactly one page** (Overview, Glossary) → a plain row. A caret that
 *   reveals a single child is noise, so there is none; the row is aligned to
 *   the disclosure labels by a spacer the width of the caret.
 *
 * Every section in every area goes through this component, so the sidebar
 * cannot drift into looking different between areas.
 */

/** Reserves the caret's width so plain rows align with disclosure labels. */
function CaretSpacer() {
  return <span aria-hidden="true" className="w-[13px] shrink-0" />
}

const ROW_CLASS =
  'flex w-full items-center gap-1.5 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors'

function NavItemRow({ item, pathname }: { item: NavItem; pathname: string }) {
  if (item.badge === 'soon') {
    return (
      <li>
        <div className="flex cursor-default items-center justify-between py-1.5 pl-8 pr-3 text-sm text-ink-faint/70">
          <span>{item.label}</span>
          <span className="rounded-sm border border-rule px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
            soon
          </span>
        </div>
      </li>
    )
  }

  const isActive = pathname === item.href
  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        className={`flex items-center justify-between border-l-2 py-1.5 pl-8 pr-3 text-sm transition-colors ${
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
}

/**
 * A one-page section: the section title *is* the nav entry, linking straight to
 * its single page. No caret, no nesting.
 */
function PlainSection({
  section,
  pathname,
}: {
  section: NavSectionData
  pathname: string
}) {
  const item = section.items[0]
  const isActive = pathname === item.href

  if (item.badge === 'soon') {
    return (
      <div className={`${ROW_CLASS} cursor-default text-ink-faint/70`}>
        <CaretSpacer />
        <span>{section.title}</span>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={`${ROW_CLASS} ${isActive ? 'text-ink' : 'text-ink-faint hover:text-ink'}`}
    >
      <CaretSpacer />
      <span>{section.title}</span>
    </Link>
  )
}

/**
 * Renders one nav section.
 *
 * Args:
 * * `section`: the frontmatter-derived section (title + its pages).
 * * `pathname`: the active route, used to auto-open the containing section.
 */
export function NavSection({
  section,
  pathname,
}: {
  section: NavSectionData
  pathname: string
}) {
  const containsActive = section.items.some((i) => i.href === pathname)
  const [open, setOpen] = useState(true)
  const panelId = useId()

  useEffect(() => {
    if (containsActive) setOpen(true)
  }, [containsActive])

  if (section.items.length === 0) return null
  if (section.items.length === 1) return <PlainSection section={section} pathname={pathname} />

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`${ROW_CLASS} text-ink-faint hover:text-ink`}
      >
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={`shrink-0 transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span>{section.title}</span>
      </button>
      {/* Kept mounted (hidden) so `aria-controls` always resolves. */}
      <ul id={panelId} hidden={!open} className="mt-1 space-y-0.5">
        {section.items.map((item) => (
          <NavItemRow key={item.href} item={item} pathname={pathname} />
        ))}
      </ul>
    </div>
  )
}
