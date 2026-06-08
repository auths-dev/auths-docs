import { DocsPrevNext } from './DocsPrevNext'

interface DocWrapperProps {
  children: React.ReactNode
}

export function DocWrapper({ children }: DocWrapperProps) {
  return (
    <article className="prose prose-gray max-w-none">
      {/* Main content */}
      <div className="space-y-6">{children}</div>

      {/* Prev/Next navigation */}
      <DocsPrevNext />
    </article>
  )
}
