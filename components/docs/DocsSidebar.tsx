'use client'

import { usePathname } from 'next/navigation'
import { docsNavigation, isPlaceholder } from '@/lib/docs-navigation'

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-8">
      {docsNavigation.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 px-2">
            {section.title}
          </h3>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href
              const isPlaceholderItem = isPlaceholder(item)

              return (
                <li key={item.href}>
                  {isPlaceholderItem ? (
                    <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
                      <span>{item.label}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">
                        soon
                      </span>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className={`block px-3 py-2 text-sm rounded transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-900 font-semibold border-l-2 border-blue-600'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
