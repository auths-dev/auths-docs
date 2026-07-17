/**
 * A verdict as it reads on the wire — exact strings only. `allowed` and
 * `consistent` carry the warm accent; every refusal carries the reserved
 * red, which means exactly one thing on this site: a denial.
 */

const POSITIVE = new Set(['allowed', 'consistent'])

export function VerdictChip({ code }: { code: string }) {
  const positive = POSITIVE.has(code)
  return (
    <code
      className={`whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[0.85em] font-medium ${
        positive
          ? 'border-seal/40 bg-seal/[0.07] text-seal-deep'
          : 'border-deny/40 bg-deny/[0.06] text-deny'
      }`}
    >
      {code}
    </code>
  )
}
