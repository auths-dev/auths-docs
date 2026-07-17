import Link from 'next/link'
import type { NavItem } from '@/lib/content'

export function DocsPrevNext({ prev, next }: { prev: NavItem | null; next: NavItem | null }) {
  if (!prev && !next) return null
  return (
    <div className="mt-14 grid grid-cols-2 gap-4 border-t border-rule pt-8">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1.5 rounded-lg border border-rule p-4 transition-colors hover:border-seal/50"
        >
          <span className="font-mono text-[11px] text-ink-faint">← Previous</span>
          <span className="font-semibold text-ink transition-colors group-hover:text-seal-deep">
            {prev.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col gap-1.5 rounded-lg border border-rule p-4 text-right transition-colors hover:border-seal/50"
        >
          <span className="font-mono text-[11px] text-ink-faint">Next →</span>
          <span className="font-semibold text-ink transition-colors group-hover:text-seal-deep">
            {next.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
