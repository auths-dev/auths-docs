'use client'

import { usePathname } from 'next/navigation'
import { getPrevNext } from '@/lib/docs-navigation'

export function DocsPrevNext() {
  const pathname = usePathname()
  const { prev, next } = getPrevNext(pathname)

  return (
    <div className="border-t border-gray-200 mt-12 pt-8 grid grid-cols-2 gap-4">
      {prev ? (
        <a
          href={prev.href}
          className="group flex flex-col gap-2 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition"
        >
          <span className="text-xs text-gray-500 group-hover:text-gray-700">← Previous</span>
          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
            {prev.label}
          </span>
        </a>
      ) : (
        <div />
      )}

      {next ? (
        <a
          href={next.href}
          className="group flex flex-col gap-2 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition text-right"
        >
          <span className="text-xs text-gray-500 group-hover:text-gray-700">Next →</span>
          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
            {next.label}
          </span>
        </a>
      ) : (
        <div />
      )}
    </div>
  )
}
