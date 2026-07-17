'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { DocsSidebar } from './DocsSidebar'
import type { ProductNav } from '@/lib/content'

export function DocsMobileDrawer({ nav }: { nav: ProductNav[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-seal text-paper shadow-lg transition-colors hover:bg-seal-deep lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 top-0 z-50 w-72 transform bg-paper transition lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center border-b border-rule px-4">
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto text-ink-faint hover:text-ink"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
          <DocsSidebar nav={nav} />
        </div>
      </div>
    </>
  )
}
