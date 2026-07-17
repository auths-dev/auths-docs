import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function DocsTopBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[88rem] items-center justify-between px-6">
        <div className="flex items-baseline gap-2.5">
          <Link href="/docs" className="font-semibold tracking-tight text-ink transition-opacity hover:opacity-80">
            Auths
          </Link>
          <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink-faint">
            docs
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://auths.dev"
            className="font-mono text-[13px] text-ink-faint transition-colors hover:text-ink"
          >
            auths.dev
          </a>
          <a
            href="https://github.com/auths-dev/auths"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] text-ink-faint transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
