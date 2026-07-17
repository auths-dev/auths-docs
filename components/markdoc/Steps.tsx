/**
 * Numbered steps with the ledger's hairline spine — the walk-through
 * skeleton for quickstarts and guides.
 */

export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="not-prose my-6 space-y-0">{children}</ol>
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="relative border-l border-rule pb-8 pl-8 last:border-transparent last:pb-0 [counter-increment:step]">
      <span
        aria-hidden="true"
        className="absolute -left-[13px] top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-rule bg-paper font-mono text-[12px] font-semibold text-seal before:content-[counter(step)]"
      />
      <p className="pt-0.5 font-semibold text-ink">{title}</p>
      <div className="mt-2 text-[15px] leading-7 text-ink-soft [&_a]:text-seal [&_code]:rounded-sm [&_code]:bg-ink/[0.06] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_p+p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </li>
  )
}
