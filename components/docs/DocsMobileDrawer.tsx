'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { DocsSidebar } from './DocsSidebar'

export function DocsMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close drawer when pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-lg"
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 transform transition lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 border-b border-gray-200 flex items-center px-4">
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto text-gray-500 hover:text-gray-900"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-3.5rem)] p-4">
          <DocsSidebar />
        </div>
      </div>
    </>
  )
}
