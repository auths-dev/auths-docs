import Link from 'next/link'
import {
  ArrowUpRight,
  Ban,
  KeyRound,
  ReceiptText,
  SquareTerminal,
  Wallet,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  terminal: SquareTerminal,
  receipt: ReceiptText,
  key: KeyRound,
  wallet: Wallet,
  shield: ShieldCheck,
  refusal: Ban,
}

export function CardGroup({ children }: { children: React.ReactNode }) {
  return <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">{children}</div>
}

export function Card({
  title,
  href,
  icon,
  children,
}: {
  title: string
  href?: string
  icon?: string
  children?: React.ReactNode
}) {
  const Icon = icon ? ICONS[icon] : undefined
  const body = (
    <>
      <div className="flex items-center gap-2.5">
        {Icon ? <Icon size={17} className="shrink-0 text-seal" aria-hidden="true" /> : null}
        <span className="font-semibold text-ink">{title}</span>
        {href ? (
          <ArrowUpRight
            size={14}
            className="ml-auto shrink-0 text-ink-faint transition-colors group-hover:text-seal"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <div className="mt-2 text-sm leading-6 text-ink-soft">{children}</div>
    </>
  )

  const frame = 'rounded-lg border border-rule bg-paper p-4 transition-colors'
  return href ? (
    <Link href={href} className={`group block ${frame} hover:border-seal/50`}>
      {body}
    </Link>
  ) : (
    <div className={frame}>{body}</div>
  )
}
