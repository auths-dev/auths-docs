'use client'

import { useEffect, useRef, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export function OnThisPage() {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const rectMapRef = useRef(new Map<string, DOMRect>())

  useEffect(() => {
    // Extract headings from the DOM
    const extractHeadings = () => {
      const headings: TocItem[] = []
      const article = document.querySelector('article')

      if (!article) return

      const h2s = article.querySelectorAll('h2, h3')
      h2s.forEach((heading) => {
        const level = parseInt(heading.tagName[1]) as 2 | 3
        if ([2, 3].includes(level)) {
          const id = heading.id
          const text = heading.textContent || ''
          if (id && text) {
            headings.push({ id, text, level })
          }
        }
      })

      setToc(headings)
    }

    // Wait a bit for the page to render
    const timer = setTimeout(extractHeadings, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toc.length === 0) return

    const updateActiveHeading = () => {
      rectMapRef.current.clear()

      // Collect all headings and their rects
      for (const item of toc) {
        const element = document.getElementById(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          rectMapRef.current.set(item.id, rect)
        }
      }

      // Find the heading closest to the top of the viewport
      let activeHeading = ''
      let smallestDistance = Infinity

      for (const [id, rect] of rectMapRef.current.entries()) {
        // If heading is above viewport, skip
        if (rect.top < 0) continue

        // Distance from top of viewport
        const distance = rect.top

        if (distance < smallestDistance) {
          smallestDistance = distance
          activeHeading = id
        }
      }

      // If no heading is below viewport top, use the first heading
      if (!activeHeading && rectMapRef.current.size > 0) {
        activeHeading = toc[0].id
      }

      setActiveId(activeHeading)
    }

    // Update on scroll
    window.addEventListener('scroll', updateActiveHeading)
    updateActiveHeading()

    return () => {
      window.removeEventListener('scroll', updateActiveHeading)
    }
  }, [toc])

  if (toc.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        On this page
      </h3>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            style={{
              paddingLeft: item.level === 3 ? '1rem' : '0',
            }}
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 transition ${
                activeId === item.id
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
