import { Info, TriangleAlert, OctagonAlert, Check, type LucideIcon } from 'lucide-react'

/**
 * The ledger's callouts: hairline frame, one icon, no emoji. `danger` is for
 * real money and destructive actions — loud by design.
 */

type CalloutType = 'info' | 'warning' | 'danger' | 'success'

const STYLES: Record<
  CalloutType,
  { icon: LucideIcon; frame: string; iconColor: string; titleColor: string }
> = {
  info: {
    icon: Info,
    frame: 'border-rule bg-paper-deep/50',
    iconColor: 'text-ink-soft',
    titleColor: 'text-ink',
  },
  warning: {
    icon: TriangleAlert,
    frame: 'border-seal/40 bg-seal/[0.06]',
    iconColor: 'text-seal',
    titleColor: 'text-ink',
  },
  danger: {
    icon: OctagonAlert,
    frame: 'border-deny/50 bg-deny/[0.06]',
    iconColor: 'text-deny',
    titleColor: 'text-deny',
  },
  success: {
    icon: Check,
    frame: 'border-seal/40 bg-paper-deep/50',
    iconColor: 'text-seal',
    titleColor: 'text-ink',
  },
}

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}) {
  const style = STYLES[type] ?? STYLES.info
  const Icon = style.icon

  return (
    <div className={`not-prose my-6 rounded-lg border p-4 ${style.frame}`}>
      <div className="flex gap-3">
        <Icon size={18} className={`mt-0.5 shrink-0 ${style.iconColor}`} aria-hidden="true" />
        <div className="min-w-0 text-[15px] leading-7 text-ink-soft [&_a]:text-seal [&_code]:rounded-sm [&_code]:bg-ink/[0.06] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_p+p]:mt-2">
          {title ? <p className={`mb-1 font-semibold ${style.titleColor}`}>{title}</p> : null}
          {children}
        </div>
      </div>
    </div>
  )
}
